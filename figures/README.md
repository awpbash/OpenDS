# Figures

Static figure tooling. The full workflow lives in
[docs/MAKE_FIGURES.md](../docs/MAKE_FIGURES.md).

```text
opends.mplstyle             matplotlib house style
opends_plot.py              font registration + style + export helper
opends-palette.excalidraw   the palette as on-canvas swatches for diagrams
src/<slug>/                 committed figure sources, one folder per concept
src/example/                the reference plot script
```

Exports go to `apps/web/public/images/concepts/<slug>/`.
