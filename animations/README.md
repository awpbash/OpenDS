# Animations

Manim sources and rendered assets. The full workflow lives in
[docs/MAKE_ANIMATIONS.md](../docs/MAKE_ANIMATIONS.md).

```text
src/         one Python file per concept
fonts/       the site's Inter font, registered by every scene
renders/     archived masters, committed
media/       Manim intermediate output, git-ignored
render.py    the one-command render + encode script
```

Render from the repo root:

```bash
pnpm render:animation <module> <SceneClass> --slug <concept-slug>
```
