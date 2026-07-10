"""Train the tiny character-level transformer behind the live demo in the
Transformers concept article, then export its weights for browser inference.

The browser does not run PyTorch. It runs a small hand-written forward pass
in TypeScript (packages/widgets/src/transformer.ts), so the architecture here
and the architecture there must match exactly:

  token embedding + learned position embedding
  N blocks of: LayerNorm -> causal multi-head attention -> residual
               LayerNorm -> MLP (4x, tanh-approximated GELU) -> residual
  final LayerNorm, logits via the transposed token embedding (tied head)

Export format (consumed by transformer.ts):
  manifest.json  config, charset, tensor offsets into the binary, a test
                 vector so the TypeScript port can prove numerical parity
  weights.bin    all tensors as little-endian float32, matmul weights stored
                 (in, out) so the JS inner loop reads them contiguously

Usage (from the repo root, takes a few minutes on CPU):
  python models/src/train_tiny_shakespeare.py
"""

import json
import math
import struct
import time
import urllib.request
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = REPO_ROOT / "models" / "data" / "tinyshakespeare.txt"
DATA_URL = (
    "https://raw.githubusercontent.com/karpathy/char-rnn/"
    "master/data/tinyshakespeare/input.txt"
)
OUT_DIRS = [
    REPO_ROOT / "models" / "weights" / "tiny-shakespeare",
    REPO_ROOT / "apps" / "web" / "public" / "models" / "tiny-shakespeare",
]

# Model size is a deliberate compromise: big enough to produce
# Shakespeare-shaped text, small enough that the float32 export stays under
# ~1.5 MB and a naive TypeScript forward pass runs in milliseconds.
BLOCK_SIZE = 64
D_MODEL = 96
N_HEAD = 4
N_LAYER = 3
BATCH_SIZE = 64
MAX_STEPS = 4000
WARMUP_STEPS = 100
LR_MAX = 3e-3
LR_MIN = 3e-4
WEIGHT_DECAY = 0.05
EVAL_EVERY = 500
EVAL_ITERS = 100
SEED = 1337

TEST_PROMPT = "ROMEO: "


class CausalSelfAttention(nn.Module):
    def __init__(self):
        super().__init__()
        self.qkv = nn.Linear(D_MODEL, 3 * D_MODEL)
        self.proj = nn.Linear(D_MODEL, D_MODEL)
        mask = torch.tril(torch.ones(BLOCK_SIZE, BLOCK_SIZE))
        self.register_buffer("mask", mask.view(1, 1, BLOCK_SIZE, BLOCK_SIZE))

    def forward(self, x):
        b, t, d = x.shape
        hd = d // N_HEAD
        q, k, v = self.qkv(x).split(d, dim=2)
        q = q.view(b, t, N_HEAD, hd).transpose(1, 2)
        k = k.view(b, t, N_HEAD, hd).transpose(1, 2)
        v = v.view(b, t, N_HEAD, hd).transpose(1, 2)
        att = (q @ k.transpose(-2, -1)) / math.sqrt(hd)
        att = att.masked_fill(self.mask[:, :, :t, :t] == 0, float("-inf"))
        att = F.softmax(att, dim=-1)
        y = (att @ v).transpose(1, 2).contiguous().view(b, t, d)
        return self.proj(y)


class Block(nn.Module):
    def __init__(self):
        super().__init__()
        self.ln1 = nn.LayerNorm(D_MODEL)
        self.attn = CausalSelfAttention()
        self.ln2 = nn.LayerNorm(D_MODEL)
        self.mlp = nn.Sequential(
            nn.Linear(D_MODEL, 4 * D_MODEL),
            nn.GELU(approximate="tanh"),
            nn.Linear(4 * D_MODEL, D_MODEL),
        )

    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x


class TinyGPT(nn.Module):
    def __init__(self, vocab_size):
        super().__init__()
        self.tok_emb = nn.Embedding(vocab_size, D_MODEL)
        self.pos_emb = nn.Embedding(BLOCK_SIZE, D_MODEL)
        self.blocks = nn.ModuleList(Block() for _ in range(N_LAYER))
        self.ln_f = nn.LayerNorm(D_MODEL)

    def forward(self, idx, targets=None):
        b, t = idx.shape
        pos = torch.arange(t, device=idx.device)
        x = self.tok_emb(idx) + self.pos_emb(pos)
        for block in self.blocks:
            x = block(x)
        x = self.ln_f(x)
        # Tied head: logits are similarity to each token's embedding.
        logits = x @ self.tok_emb.weight.T
        loss = None
        if targets is not None:
            loss = F.cross_entropy(
                logits.view(-1, logits.size(-1)), targets.view(-1)
            )
        return logits, loss


def load_corpus() -> str:
    if not DATA_PATH.exists():
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        print(f"downloading corpus to {DATA_PATH} ...")
        urllib.request.urlretrieve(DATA_URL, DATA_PATH)
    return DATA_PATH.read_text(encoding="utf-8")


def lr_at(step: int) -> float:
    if step < WARMUP_STEPS:
        return LR_MAX * (step + 1) / WARMUP_STEPS
    progress = (step - WARMUP_STEPS) / max(1, MAX_STEPS - WARMUP_STEPS)
    return LR_MIN + 0.5 * (LR_MAX - LR_MIN) * (1 + math.cos(math.pi * progress))


@torch.no_grad()
def estimate_loss(model, data, batches):
    model.eval()
    losses = []
    for _ in range(batches):
        xb, yb = get_batch(data)
        _, loss = model(xb, yb)
        losses.append(loss.item())
    model.train()
    return sum(losses) / len(losses)


def get_batch(data):
    ix = torch.randint(len(data) - BLOCK_SIZE - 1, (BATCH_SIZE,))
    x = torch.stack([data[i : i + BLOCK_SIZE] for i in ix])
    y = torch.stack([data[i + 1 : i + BLOCK_SIZE + 1] for i in ix])
    return x, y


@torch.no_grad()
def sample(model, encode, decode, prompt, length=300, temperature=0.8):
    model.eval()
    idx = torch.tensor([encode(prompt)], dtype=torch.long)
    for _ in range(length):
        logits, _ = model(idx[:, -BLOCK_SIZE:])
        probs = F.softmax(logits[0, -1] / temperature, dim=-1)
        nxt = torch.multinomial(probs, 1)
        idx = torch.cat([idx, nxt.view(1, 1)], dim=1)
    model.train()
    return decode(idx[0].tolist())


def export(model, chars, val_loss, param_count):
    """Write manifest.json + weights.bin. Matmul weights go out as (in, out)."""
    tensors = []
    blob = bytearray()

    def add(name, tensor):
        arr = tensor.detach().contiguous().float().numpy()
        tensors.append(
            {"name": name, "shape": list(arr.shape), "offset": len(blob) // 4}
        )
        blob.extend(struct.pack(f"<{arr.size}f", *arr.flatten().tolist()))

    add("tok_emb", model.tok_emb.weight)
    add("pos_emb", model.pos_emb.weight)
    for i, block in enumerate(model.blocks):
        p = f"block{i}."
        add(p + "ln1.g", block.ln1.weight)
        add(p + "ln1.b", block.ln1.bias)
        add(p + "attn.wqkv", block.attn.qkv.weight.T)
        add(p + "attn.bqkv", block.attn.qkv.bias)
        add(p + "attn.wo", block.attn.proj.weight.T)
        add(p + "attn.bo", block.attn.proj.bias)
        add(p + "ln2.g", block.ln2.weight)
        add(p + "ln2.b", block.ln2.bias)
        add(p + "mlp.wfc", block.mlp[0].weight.T)
        add(p + "mlp.bfc", block.mlp[0].bias)
        add(p + "mlp.wproj", block.mlp[2].weight.T)
        add(p + "mlp.bproj", block.mlp[2].bias)
    add("ln_f.g", model.ln_f.weight)
    add("ln_f.b", model.ln_f.bias)

    stoi = {ch: i for i, ch in enumerate(chars)}
    with torch.no_grad():
        model.eval()
        idx = torch.tensor([[stoi[c] for c in TEST_PROMPT]], dtype=torch.long)
        logits, _ = model(idx)
        test_logits = logits[0, -1].tolist()

    manifest = {
        "config": {
            "vocabSize": len(chars),
            "blockSize": BLOCK_SIZE,
            "dModel": D_MODEL,
            "nHead": N_HEAD,
            "nLayer": N_LAYER,
        },
        "chars": "".join(chars),
        "tensors": tensors,
        "testVector": {"prompt": TEST_PROMPT, "logits": test_logits},
        "meta": {
            "paramCount": param_count,
            "valLoss": round(val_loss, 4),
            "trainSteps": MAX_STEPS,
            "corpus": "tiny shakespeare (karpathy/char-rnn), ~1.1 MB",
        },
    }

    for out_dir in OUT_DIRS:
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "manifest.json").write_text(
            json.dumps(manifest), encoding="utf-8"
        )
        (out_dir / "weights.bin").write_bytes(bytes(blob))
        print(f"wrote {out_dir} ({len(blob) / 1e6:.2f} MB weights)")


def main():
    torch.manual_seed(SEED)
    text = load_corpus()
    chars = sorted(set(text))
    stoi = {ch: i for i, ch in enumerate(chars)}
    encode = lambda s: [stoi[c] for c in s]  # noqa: E731
    decode = lambda ids: "".join(chars[i] for i in ids)  # noqa: E731

    data = torch.tensor(encode(text), dtype=torch.long)
    split = int(0.9 * len(data))
    train_data, val_data = data[:split], data[split:]

    model = TinyGPT(len(chars))
    param_count = sum(p.numel() for p in model.parameters())
    print(f"vocab {len(chars)}, params {param_count:,}")

    decay, no_decay = [], []
    for name, p in model.named_parameters():
        (decay if p.dim() >= 2 else no_decay).append(p)
    opt = torch.optim.AdamW(
        [
            {"params": decay, "weight_decay": WEIGHT_DECAY},
            {"params": no_decay, "weight_decay": 0.0},
        ],
        lr=LR_MAX,
    )

    start = time.time()
    for step in range(MAX_STEPS):
        for group in opt.param_groups:
            group["lr"] = lr_at(step)
        xb, yb = get_batch(train_data)
        _, loss = model(xb, yb)
        opt.zero_grad(set_to_none=True)
        loss.backward()
        opt.step()
        if step % EVAL_EVERY == 0 or step == MAX_STEPS - 1:
            val = estimate_loss(model, val_data, EVAL_ITERS)
            elapsed = time.time() - start
            print(
                f"step {step:4d}  train {loss.item():.4f}  "
                f"val {val:.4f}  {elapsed:6.1f}s"
            )

    val_loss = estimate_loss(model, val_data, EVAL_ITERS * 2)
    print(f"final val loss {val_loss:.4f}")
    print("--- sample ---")
    print(sample(model, encode, decode, "ROMEO: "))
    print("--------------")
    export(model, chars, val_loss, param_count)


if __name__ == "__main__":
    main()
