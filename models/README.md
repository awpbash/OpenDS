# Models

Training scripts for the tiny models some widgets run in the reader's
browser. The full pipeline (train locally, commit manifest + weights,
replay-test in `packages/inference`) is documented in
[docs/BUILD_A_WIDGET.md](../docs/BUILD_A_WIDGET.md).

```text
src/            one training script per model
weights/        committed artifacts: manifest.json + weights.bin per model
data/           training corpora, git-ignored (scripts re-download)
```

Nothing here runs in CI or on a server. Python produces an artifact,
the site serves it statically.
