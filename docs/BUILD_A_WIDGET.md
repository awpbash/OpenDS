# Build a widget

A widget is a learning object, not a chart. The reader changes something,
sees the consequence immediately, and a relationship becomes obvious that
prose alone could not make obvious.

## Before writing any code

Fill in these four lines. If you cannot, it is a chart, not a widget:

```text
Learning question: what should the user understand after interacting?
Control:           what can the user change?
Feedback:          what visibly changes in response?
Insight:           what relationship becomes obvious?
```

Example, for prediction error: drag the regression line, residuals and
MAE/MSE/RMSE update live, and it becomes obvious that squared error
punishes one big miss far more than many small ones.

## Where the code goes

- Interactive React components live in `packages/widgets`.
- The educational math (loss calculations, sampling, updates) lives in a
  plain TypeScript module next to the component, with unit tests. The
  component renders state, the module computes it. This split is what
  makes the pedagogy testable.
- Authors embed widgets through a thin Astro wrapper in
  `apps/web/src/components/mdx/`, so the MDX stays simple:

  ```mdx
  <PredictionErrorExplorer showMetrics={["mae", "mse"]} />
  ```

  Props are author-facing knobs, not chart config. If an author would need
  to pass pixel coordinates or wiring, the API is wrong.

## The bar

A widget is done when:

- it works by touch and is keyboard reachable;
- initial state already shows something meaningful;
- every change responds immediately;
- it has explanatory text, so the reader learns even without interacting;
- both themes work, via the site's CSS variables, never hardcoded colors;
- nothing depends on hover alone;
- the core calculations have unit tests (`pnpm test`);
- it hydrates as an island and heavy ones lazy-load below the fold.

Keep controls minimal. Two controls that teach beat eight that impress.

## Model-backed widgets

Some widgets run a real (tiny) neural network in the reader's browser.
The pattern mirrors Manim: Python produces an artifact locally, the
artifact is committed, the site serves it statically. Nothing ML runs in
CI or on a server.

- Training code lives in `models/src/`, one script per model, with
  `models/requirements.txt` pinning dependencies. Training runs locally.
- Every export is two files, written to `models/weights/<name>/` and
  `apps/web/public/models/<name>/`: `manifest.json` (architecture config,
  charset, tensor layout, and a test vector with the exact logits PyTorch
  produced for a fixed prompt) and `weights.bin` (float32, input-major).
- The browser side runs the forward pass in `packages/inference`, pure
  TypeScript with no dependencies. Its test suite replays the manifest's
  test vector, so CI fails if the Python and TypeScript implementations
  ever drift.
- Weights are lazy-fetched when the reader reaches the widget, never
  bundled. Keep a model under about 2 MB. If artifacts outgrow that, that
  is the moment to discuss Git LFS.
- The article must say honestly what the model can and cannot do.
