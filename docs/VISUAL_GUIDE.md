# Visual guide

Skeleton version. Covers diagrams, animations, and widget visuals.

## Palette

Use the site tokens so visuals feel native in both themes:

| Token     | Light     | Dark      | Use                        |
| --------- | --------- | --------- | -------------------------- |
| paper     | `#fdfcfa` | `#171512` | backgrounds                |
| ink       | `#1f1c19` | `#e8e4de` | primary text               |
| ink muted | `#5f5a53` | `#a8a29a` | secondary text, captions   |
| hairline  | `#e7e3dc` | `#2e2a25` | rules, borders             |
| accent    | `#0f766e` | `#2dd4bf` | the single accent, sparing |

Static figures are drawn for the light palette. The site places them on a paper surface in dark mode automatically.

## Diagrams

- Hand-rolled SVG preferred: small, crisp, themeable.
- One idea per figure. If it needs a paragraph to explain, split it.
- Captions state what to notice.
- Every figure needs alt text or a textual equivalent nearby.

## Manim animations

- Source lives in `animations/src/`, one Python file per concept.
- Use the palette constants at the top of `what_is_data.py` as the reference.
- All text uses the site's Inter font, bundled at `animations/fonts/` and registered at the top of each scene file. Manim's fallback font has poor letter spacing, never use it.
- Keep captions and anything readable out of the bottom tenth of the frame if possible, and prefer real numbers from real models or data over invented ones.
- Render locally (Manim CE, 1080p, 30 fps is plenty):

  ```bash
  python -m manim render -qh --fps 30 --media_dir animations/media \
      -o <name> animations/src/<file>.py <SceneClass>
  ```

- Copy the final MP4 to `animations/renders/` and to `apps/web/public/videos/concepts/<slug>/`.
- Embed with `<AnimatedFigure src="..." poster="..." caption="..." />` in MDX. No autoplay, ever. Prefer MP4 or WebM over GIF.
- Keep files small: aim under 2 MB per animation.

## Model-backed widgets

Some widgets run a real (tiny) neural network in the reader's browser. The pattern mirrors Manim: Python produces an artifact locally, the artifact is committed, the site serves it statically. Nothing ML runs in CI or on a server.

- Training code lives in `models/src/`, one script per model, with `models/requirements.txt` pinning dependencies. Training runs locally and never in CI.
- Every export is two files: `manifest.json` (architecture config, charset, tensor layout, and a test vector with the exact logits PyTorch produced for a fixed prompt) and `weights.bin` (float32, matmul weights stored input-major). They go to `models/weights/<name>/` and `apps/web/public/models/<name>/`.
- The browser side runs the forward pass in `packages/inference`, pure TypeScript with no dependencies. Its test suite replays the manifest's test vector, so CI fails if the Python and TypeScript implementations ever drift.
- Weights are lazy-fetched when the reader reaches the widget, never bundled. Keep a model under about 2 MB. If artifacts outgrow that, that is the moment to discuss Git LFS.
- The article must say honestly what the model can and cannot do.

## Widgets

Before building, write down: the learning question, the control, the feedback, and the insight. If you cannot fill those four lines, it is a chart, not a widget.

Minimum bar (the full checklist lives in CLAUDE.md):

- works by touch, keyboard reachable;
- sensible initial state, immediate response;
- explanatory text so the reader learns even without interacting;
- both themes via the CSS variables above;
- core calculations in a plain TypeScript module with unit tests.
