# Make figures

Static visuals come in two lanes. Diagrams (boxes, arrows, geometric
intuition) are drawn in Excalidraw. Data plots (distributions, curves,
residuals) are matplotlib scripts. Animations are their own lane, see
[MAKE_ANIMATIONS.md](MAKE_ANIMATIONS.md).

## Rules for both lanes

- Draw for the light palette only. The site frames every figure on a paper
  surface in dark mode, never make a dark variant.
- One idea per figure. If it needs a paragraph to explain, split it.
- Captions state what to notice, not what the figure is.
- Every figure needs alt text or a textual equivalent nearby.
- Exports go to `apps/web/public/images/concepts/<slug>/`.
- Sources are committed too, so the next person can edit instead of
  redrawing: everything under `figures/src/<slug>/`.

The palette:

| Token     | Hex       | Use                          |
| --------- | --------- | ---------------------------- |
| paper     | `#fdfcfa` | backgrounds                  |
| ink       | `#1f1c19` | primary text, strokes        |
| ink muted | `#5f5a53` | secondary text, labels       |
| hairline  | `#e7e3dc` | gridlines, subtle rules      |
| accent    | `#0f766e` | the one highlight, sparingly |

Family colors (for anything grouped by topic family) live as swatches in
`figures/opends-palette.excalidraw` and as the color cycle in
`figures/opends.mplstyle`.

## Lane 1: diagrams in Excalidraw

Use [excalidraw.com](https://excalidraw.com) or the VS Code extension.

1. Open `figures/opends-palette.excalidraw` to get the palette as swatches
   on canvas. Color-pick from them, then delete them before saving your
   diagram, or keep your work in a separate file from the start.
2. House settings: the "Normal" font (not the hand-drawn one), thin
   strokes, ink `#1f1c19` for lines and text, accent teal for the one thing
   the reader should look at. The slightly sketchy line style is welcome,
   comic lettering is not.
3. Save the source as `figures/src/<slug>/<name>.excalidraw`.
4. Export as PNG, scale 2x, background on. Save to
   `apps/web/public/images/concepts/<slug>/<name>.png`.
5. Embed in MDX as a normal image with a caption:

   ```mdx
   ![Residuals as vertical gaps between points and the line](/images/concepts/<slug>/residuals.png)

   _The residual is the vertical gap. Notice how one far point dominates._
   ```

## Lane 2: plots in matplotlib

One-time setup (same venv as the animations is fine):

```bash
pip install -r figures/requirements.txt
```

Every plot is a committed script in `figures/src/<slug>/`, so figures are
reproducible and editable. Start from the reference script at
`figures/src/example/sleep-vs-scores.py`. The pattern:

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import matplotlib.pyplot as plt
import numpy as np

import opends_plot

opends_plot.apply()          # house style + Inter font

# ... build the figure ...

out = opends_plot.export_dir("<slug>") / "<name>.png"
fig.savefig(out)
```

Rules for plots:

- Fixed random seed. Rerunning the script must reproduce the committed
  figure exactly.
- Real numbers over invented ones where possible. If data is synthetic,
  make it plausible and say so in the article.
- Let the style file do the styling. If you are calling `ax.spines` or
  setting colors manually, stop and check whether the style should change
  for everyone instead. Palette constants for annotations live in
  `opends_plot` (ACCENT, MUTED, HAIRLINE and friends).
- Most figures need one color. Almost none need more than three.

Run from the repo root:

```bash
python figures/src/<slug>/<name>.py
```

Commit the script and the exported PNG together.
