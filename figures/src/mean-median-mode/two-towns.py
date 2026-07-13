"""Bimodal mixture: 4-room resales in Woodlands and Queenstown together.

With two price clusters, the mean lands in the gap where almost nothing
sold, and the median sits inside the bigger cluster and ignores the other.
Two different failures of "one typical number" in a single picture.

Run from the repo root:

    python figures/src/mean-median-mode/two-towns.py
"""

import csv
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.ticker import FuncFormatter

import opends_plot

opends_plot.apply()

BLUE = "#3d5fa8"  # second hue of the house cycle

SNAPSHOT = Path(__file__).resolve().parent / "data" / "resale-2026-h1.csv"
woodlands: list[float] = []
queenstown: list[float] = []
with SNAPSHOT.open(encoding="utf-8") as handle:
    for row in csv.DictReader(handle):
        if row["flat_type"] != "4 ROOM":
            continue
        if row["town"] == "WOODLANDS":
            woodlands.append(float(row["resale_price"]))
        elif row["town"] == "QUEENSTOWN":
            queenstown.append(float(row["resale_price"]))

mixture = woodlands + queenstown
mean = statistics.fmean(mixture)
median = statistics.median(mixture)

fig, ax = plt.subplots(figsize=(7.5, 4.4))
bins = np.arange(350_000, 1_400_001, 30_000)
ax.hist(woodlands, bins=bins, color=opends_plot.ACCENT, alpha=0.6, zorder=2)
ax.hist(queenstown, bins=bins, color=BLUE, alpha=0.6, zorder=2)

ax.axvline(mean, color=opends_plot.INK, linewidth=2, zorder=3)
ax.axvline(
    median, color=opends_plot.INK, linewidth=1.6, linestyle=(0, (5, 4)), zorder=3
)

ymax = ax.get_ylim()[1]
ax.text(
    462_000,
    ymax * 0.56,
    f"Woodlands\n{len(woodlands)} sales",
    color=opends_plot.ACCENT,
    fontsize=11,
    fontweight=600,
    horizontalalignment="right",
)
ax.text(
    1_060_000,
    ymax * 0.42,
    f"Queenstown\n{len(queenstown)} sales",
    color=BLUE,
    fontsize=11,
    fontweight=600,
    horizontalalignment="center",
)
# Both summary labels live in the empty gap between the clusters, with
# hairline leaders back to their lines.
ax.annotate(
    f"mean ${mean:,.0f}\nlands where almost nothing sold",
    xy=(mean, ymax * 0.84),
    xytext=(760_000, ymax * 0.9),
    fontsize=10,
    color=opends_plot.INK,
    verticalalignment="top",
    arrowprops={"arrowstyle": "-", "color": opends_plot.FAINT},
)
ax.annotate(
    f"median ${median:,.0f}\ninside the Woodlands cluster",
    xy=(median, ymax * 0.62),
    xytext=(760_000, ymax * 0.68),
    fontsize=10,
    color=opends_plot.MUTED,
    verticalalignment="top",
    arrowprops={"arrowstyle": "-", "color": opends_plot.FAINT},
)

ax.xaxis.set_major_formatter(
    FuncFormatter(
        lambda v, _: f"${v / 1e6:.1f}M" if v >= 1_000_000 else f"${v / 1e3:,.0f}k"
    )
)
ax.set_xlabel("Resale price")
ax.set_ylabel("Sales")
ax.set_title("4-room resales in two towns, January to June 2026")

out = opends_plot.export_dir("mean-median-mode") / "two-towns.png"
fig.savefig(out)
print(f"wrote {out}")
