# Make animations

Manim animations are for the moments where motion itself explains: a mean
sliding as an outlier moves, gradients flowing backward, attention weights
shifting. If a still image teaches the same thing, make a figure instead,
see [MAKE_FIGURES.md](MAKE_FIGURES.md).

## One-time setup

You need Python 3.11+ and ffmpeg on your PATH. Then:

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r animations/requirements.txt
```

## Write the scene

- Source lives in `animations/src/`, one Python file per concept.
- Copy the top of `animations/src/what_is_data.py`: it registers the site's
  Inter font (bundled at `animations/fonts/`) and defines the palette
  constants (PAPER, INK, MUTED, HAIRLINE, TEAL). Manim's fallback font has
  poor letter spacing, never use it.
- Background is always PAPER. The video should look native on the page.
- Keep readable text out of the bottom tenth of the frame, the seek bar
  region on small screens.
- Prefer real numbers from real models or data over invented ones.
- Short beats long. Fifteen seconds that make one thing click is worth
  more than a minute-long tour.

## Render

One command renders, encodes for the web with the locked settings, and
puts the file everywhere it needs to live:

```bash
pnpm render:animation <module> <SceneClass> --slug <concept-slug>
```

Example:

```bash
pnpm render:animation what_is_data ObservationsBecomeRows --slug what-is-data
```

Outputs:

- `animations/renders/<name>.mp4`, the archived master, committed.
- `apps/web/public/videos/concepts/<slug>/<name>.mp4`, what the site
  serves, committed.

The name is the kebab-case of the scene class. Override with `--name` if
the article expects something else.

**Size budget: 2 MB per animation.** The script warns when you are over.
Fix it by shortening the animation or reducing moving detail, never by
tuning the encode settings per video. Consistent settings are what keep
every video on the site looking the same.

## Embed

```mdx
<AnimatedFigure
  src="/videos/concepts/<slug>/<name>.mp4"
  caption="What the reader should notice while it plays."
/>
```

No autoplay, ever. The reader presses play, which also handles reduced
motion preferences. Optional `poster` prop for the frame shown before play.

## Before you push

- The caption says what to notice, not what the video is.
- The article text still teaches the concept if the video never plays.
  Animation is reinforcement, not the only carrier of the idea.
- Both output files are committed (renders and public copies).
- File is under 2 MB.
- Watched it once at phone width.

Manim's intermediate output in `animations/media/` is git-ignored, never
commit it.
