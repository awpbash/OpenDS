"""The two penalties behind the two summaries.

The mean minimizes squared distance, the median minimizes absolute
distance. Both curves are scaled to cost 1 at a $100k miss, so the
comparison reads directly: triple the miss and the absolute penalty
triples, but the squared penalty ninefolds. This figure is the bridge to
the later Loss Functions concept.

Run from the repo root:

    python figures/src/mean-median-mode/penalty-curves.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.ticker import FuncFormatter

import opends_plot

opends_plot.apply()

miss = np.linspace(-300_000, 300_000, 601)
unit = 100_000
absolute = np.abs(miss) / unit
squared = (miss / unit) ** 2

fig, ax = plt.subplots(figsize=(7.5, 4.2))
ax.plot(miss, squared, color=opends_plot.ACCENT, zorder=3)
ax.plot(miss, absolute, color=opends_plot.INK, zorder=3)

ax.set_xlim(-320_000, 348_000)
ax.text(
    233_000,
    7.6,
    "squared: the mean's penalty",
    color=opends_plot.ACCENT,
    fontsize=11,
    fontweight=600,
    horizontalalignment="right",
)
ax.text(
    295_000,
    1.28,
    "absolute: the median's penalty",
    color=opends_plot.INK,
    fontsize=11,
    fontweight=600,
    horizontalalignment="right",
)
ax.text(
    307_000,
    9,
    "×9",
    color=opends_plot.ACCENT,
    fontsize=12,
    fontweight=600,
    verticalalignment="center",
)
ax.text(
    307_000,
    3,
    "×3",
    color=opends_plot.INK,
    fontsize=12,
    fontweight=600,
    verticalalignment="center",
)
ax.text(
    -245_000,
    8.8,
    "Triple the error:\nthe absolute penalty triples,\nthe squared penalty ninefolds.",
    color=opends_plot.MUTED,
    fontsize=10,
    verticalalignment="top",
)

ax.xaxis.set_major_formatter(
    FuncFormatter(lambda v, _: f"-${abs(v) / 1e3:,.0f}k" if v < 0 else f"${v / 1e3:,.0f}k")
)
ax.set_xlabel("Size of the error")
ax.set_ylabel("Penalty, relative to a $100k error")
ax.set_title("Sensitivity to outliers: the mean vs the median")

out = opends_plot.export_dir("mean-median-mode") / "penalty-curves.png"
fig.savefig(out)
print(f"wrote {out}")
