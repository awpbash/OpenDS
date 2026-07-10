/**
 * Browser-side inference for the tiny character-level transformers trained
 * in models/src/. Pure TypeScript on typed arrays: no runtime dependencies,
 * no DOM, no React. Widgets consume this package for the math and add the
 * presentation on top.
 *
 * The architecture must match the PyTorch training code exactly:
 *
 *   token embedding + learned position embedding
 *   N blocks of: LayerNorm -> causal multi-head attention -> residual
 *                LayerNorm -> MLP (4x, tanh GELU) -> residual
 *   final LayerNorm, logits via the transposed token embedding (tied head)
 *
 * Every exported model carries a test vector (a prompt plus the logits
 * PyTorch produced for it). The parity test in this package replays it,
 * so any drift between the Python and TypeScript sides fails CI.
 *
 * Weight layout contract: matmul weights are exported as (in, out) row-major
 * float32, so the inner loop below reads them contiguously.
 */

export interface TransformerConfig {
  vocabSize: number;
  blockSize: number;
  dModel: number;
  nHead: number;
  nLayer: number;
}

export interface TensorSpec {
  name: string;
  shape: number[];
  /** Offset into weights.bin, counted in float32 elements, not bytes. */
  offset: number;
}

export interface ModelManifest {
  config: TransformerConfig;
  /** The charset: character at index i is token id i. */
  chars: string;
  tensors: TensorSpec[];
  testVector: { prompt: string; logits: number[] };
  meta: {
    paramCount: number;
    valLoss: number;
    trainSteps: number;
    corpus: string;
  };
}

export interface ForwardResult {
  /** Next-token logits at the last position, length vocabSize. */
  logits: Float32Array;
  /**
   * The last position's attention over the context: attention[layer][head]
   * has one weight per context position and sums to 1.
   */
  attention: number[][][];
}

/** Tanh-approximated GELU, matching torch.nn.GELU(approximate="tanh"). */
export function geluTanh(x: number): number {
  return (
    0.5 *
    x *
    (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)))
  );
}

/**
 * LayerNorm over each row of x (t rows of width d), like torch's default:
 * biased variance, eps 1e-5, then scale g and shift b.
 */
export function layerNorm(
  x: Float32Array,
  t: number,
  d: number,
  g: Float32Array,
  b: Float32Array,
  out?: Float32Array,
): Float32Array {
  const y = out ?? new Float32Array(t * d);
  for (let i = 0; i < t; i++) {
    const row = i * d;
    let mean = 0;
    for (let j = 0; j < d; j++) mean += x[row + j];
    mean /= d;
    let variance = 0;
    for (let j = 0; j < d; j++) {
      const dev = x[row + j] - mean;
      variance += dev * dev;
    }
    variance /= d;
    const inv = 1 / Math.sqrt(variance + 1e-5);
    for (let j = 0; j < d; j++) {
      y[row + j] = (x[row + j] - mean) * inv * g[j] + b[j];
    }
  }
  return y;
}

/**
 * out (t x cols) = x (t x inner) @ w (inner x cols) + b. The k-outer loop
 * order keeps both x and w reads sequential, which matters in JS.
 */
function matmulBias(
  x: Float32Array,
  t: number,
  inner: number,
  w: Float32Array,
  cols: number,
  b: Float32Array | null,
  out: Float32Array,
): void {
  for (let i = 0; i < t; i++) {
    const outRow = i * cols;
    if (b) {
      for (let o = 0; o < cols; o++) out[outRow + o] = b[o];
    } else {
      out.fill(0, outRow, outRow + cols);
    }
    const xRow = i * inner;
    for (let k = 0; k < inner; k++) {
      const a = x[xRow + k];
      const wRow = k * cols;
      for (let o = 0; o < cols; o++) {
        out[outRow + o] += a * w[wRow + o];
      }
    }
  }
}

/** Softmax with temperature. Temperature must be > 0. */
export function softmaxWithTemperature(
  logits: ArrayLike<number>,
  temperature: number,
): Float32Array {
  const n = logits.length;
  const probs = new Float32Array(n);
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    probs[i] = logits[i] / temperature;
    if (probs[i] > max) max = probs[i];
  }
  let sum = 0;
  for (let i = 0; i < n; i++) {
    probs[i] = Math.exp(probs[i] - max);
    sum += probs[i];
  }
  for (let i = 0; i < n; i++) probs[i] /= sum;
  return probs;
}

export interface TokenProbability {
  id: number;
  char: string;
  p: number;
}

/** The k most probable tokens, sorted by probability, highest first. */
export function topK(
  probs: ArrayLike<number>,
  k: number,
  chars: string,
): TokenProbability[] {
  const entries: TokenProbability[] = [];
  for (let i = 0; i < probs.length; i++) {
    entries.push({ id: i, char: chars[i], p: probs[i] });
  }
  entries.sort((a, b) => b.p - a.p);
  return entries.slice(0, k);
}

/**
 * Sample a token id from a probability distribution using a uniform random
 * number in [0, 1). The random number is a parameter so tests stay exact.
 */
export function sampleIndex(probs: ArrayLike<number>, rand: number): number {
  let cumulative = 0;
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i];
    if (rand < cumulative) return i;
  }
  return probs.length - 1;
}

export class TinyTransformer {
  readonly config: TransformerConfig;
  readonly chars: string;
  readonly meta: ModelManifest["meta"];
  private readonly tensors: Map<string, Float32Array>;
  private readonly stoi: Map<string, number>;

  constructor(manifest: ModelManifest, weights: Float32Array) {
    this.config = manifest.config;
    this.chars = manifest.chars;
    this.meta = manifest.meta;
    this.tensors = new Map();
    for (const spec of manifest.tensors) {
      const size = spec.shape.reduce((a, b) => a * b, 1);
      this.tensors.set(
        spec.name,
        weights.subarray(spec.offset, spec.offset + size),
      );
    }
    this.stoi = new Map();
    for (let i = 0; i < manifest.chars.length; i++) {
      this.stoi.set(manifest.chars[i], i);
    }
  }

  static fromBuffer(
    manifest: ModelManifest,
    buffer: ArrayBuffer,
  ): TinyTransformer {
    return new TinyTransformer(manifest, new Float32Array(buffer));
  }

  private tensor(name: string): Float32Array {
    const t = this.tensors.get(name);
    if (!t) throw new Error(`model is missing tensor "${name}"`);
    return t;
  }

  /** Keep only characters the model knows. */
  sanitize(text: string): string {
    let out = "";
    for (const ch of text) if (this.stoi.has(ch)) out += ch;
    return out;
  }

  /** Text to token ids. Characters outside the charset are dropped. */
  encode(text: string): number[] {
    const ids: number[] = [];
    for (const ch of text) {
      const id = this.stoi.get(ch);
      if (id !== undefined) ids.push(id);
    }
    return ids;
  }

  decode(ids: number[]): string {
    let out = "";
    for (const id of ids) out += this.chars[id] ?? "";
    return out;
  }

  /**
   * Run the model over up to blockSize trailing tokens and return the
   * next-token logits plus the attention pattern of the last position.
   */
  forward(inputIds: number[]): ForwardResult {
    if (inputIds.length === 0) {
      throw new Error("forward needs at least one token of context");
    }
    const { blockSize, dModel: d, nHead, nLayer, vocabSize } = this.config;
    const ids = inputIds.slice(-blockSize);
    const t = ids.length;
    const headDim = d / nHead;
    const scale = 1 / Math.sqrt(headDim);

    const tokEmb = this.tensor("tok_emb");
    const posEmb = this.tensor("pos_emb");

    const x = new Float32Array(t * d);
    for (let i = 0; i < t; i++) {
      const tok = ids[i] * d;
      const pos = i * d;
      for (let j = 0; j < d; j++) {
        x[i * d + j] = tokEmb[tok + j] + posEmb[pos + j];
      }
    }

    const normed = new Float32Array(t * d);
    const qkv = new Float32Array(t * 3 * d);
    const attnOut = new Float32Array(t * d);
    const proj = new Float32Array(t * d);
    const hidden = new Float32Array(t * 4 * d);
    const scores = new Float32Array(t);
    const attention: number[][][] = [];

    for (let layer = 0; layer < nLayer; layer++) {
      const p = `block${layer}.`;

      // Causal multi-head self-attention with residual.
      layerNorm(
        x,
        t,
        d,
        this.tensor(p + "ln1.g"),
        this.tensor(p + "ln1.b"),
        normed,
      );
      matmulBias(
        normed,
        t,
        d,
        this.tensor(p + "attn.wqkv"),
        3 * d,
        this.tensor(p + "attn.bqkv"),
        qkv,
      );

      const layerAttention: number[][] = [];
      attnOut.fill(0);
      for (let head = 0; head < nHead; head++) {
        const qOff = head * headDim;
        const kOff = d + head * headDim;
        const vOff = 2 * d + head * headDim;
        for (let i = 0; i < t; i++) {
          const qRow = i * 3 * d + qOff;
          let max = -Infinity;
          for (let j = 0; j <= i; j++) {
            const kRow = j * 3 * d + kOff;
            let dot = 0;
            for (let c = 0; c < headDim; c++)
              dot += qkv[qRow + c] * qkv[kRow + c];
            scores[j] = dot * scale;
            if (scores[j] > max) max = scores[j];
          }
          let sum = 0;
          for (let j = 0; j <= i; j++) {
            scores[j] = Math.exp(scores[j] - max);
            sum += scores[j];
          }
          const outRow = i * d + qOff;
          for (let j = 0; j <= i; j++) {
            const weight = scores[j] / sum;
            scores[j] = weight;
            const vRow = j * 3 * d + vOff;
            for (let c = 0; c < headDim; c++) {
              attnOut[outRow + c] += weight * qkv[vRow + c];
            }
          }
          if (i === t - 1) {
            layerAttention.push(Array.from(scores.subarray(0, t)));
          }
        }
      }
      attention.push(layerAttention);

      matmulBias(
        attnOut,
        t,
        d,
        this.tensor(p + "attn.wo"),
        d,
        this.tensor(p + "attn.bo"),
        proj,
      );
      for (let i = 0; i < t * d; i++) x[i] += proj[i];

      // MLP with residual.
      layerNorm(
        x,
        t,
        d,
        this.tensor(p + "ln2.g"),
        this.tensor(p + "ln2.b"),
        normed,
      );
      matmulBias(
        normed,
        t,
        d,
        this.tensor(p + "mlp.wfc"),
        4 * d,
        this.tensor(p + "mlp.bfc"),
        hidden,
      );
      for (let i = 0; i < t * 4 * d; i++) hidden[i] = geluTanh(hidden[i]);
      matmulBias(
        hidden,
        t,
        4 * d,
        this.tensor(p + "mlp.wproj"),
        d,
        this.tensor(p + "mlp.bproj"),
        proj,
      );
      for (let i = 0; i < t * d; i++) x[i] += proj[i];
    }

    // Final norm on the last position only, then the tied head.
    const last = x.subarray((t - 1) * d, t * d);
    const finalNormed = layerNorm(
      last,
      1,
      d,
      this.tensor("ln_f.g"),
      this.tensor("ln_f.b"),
    );
    const logits = new Float32Array(vocabSize);
    for (let v = 0; v < vocabSize; v++) {
      const row = v * d;
      let dot = 0;
      for (let j = 0; j < d; j++) dot += finalNormed[j] * tokEmb[row + j];
      logits[v] = dot;
    }

    return { logits, attention };
  }
}

/** Fetch a model's manifest and weights from a static base URL. */
export async function loadModel(baseUrl: string): Promise<TinyTransformer> {
  const trimmed = baseUrl.replace(/\/$/, "");
  const manifestResponse = await fetch(`${trimmed}/manifest.json`);
  if (!manifestResponse.ok) {
    throw new Error(`could not load model manifest from ${trimmed}`);
  }
  const manifest = (await manifestResponse.json()) as ModelManifest;
  const weightsResponse = await fetch(`${trimmed}/weights.bin`);
  if (!weightsResponse.ok) {
    throw new Error(`could not load model weights from ${trimmed}`);
  }
  const buffer = await weightsResponse.arrayBuffer();
  return TinyTransformer.fromBuffer(manifest, buffer);
}
