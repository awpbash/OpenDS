"""Histogram of all H1 2026 HDB resale prices with mean and median marked.

The right skew is the story: the tail of million-dollar flats pulls the
mean above the median. Also used as the article's feed cover.

Run from the repo root:

    python figures/src/mean-median-mode/price-histogram.py
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

SNAPSHOT = Path(__file__).resolve().parent / "data" / "resale-2026-h1.csv"
with SNAPSHOT.open(encoding="utf-8") as handle:
    prices = [float(row["resale_price"]) for row in csv.DictReader(handle)]

mean = statistics.fmean(prices)
median = statistics.median(prices)
million_share = sum(p >= 1_000_000 for p in prices) / len(prices)

fig, ax = plt.subplots(figsize=(7.5, 4.4))
bins = np.arange(200_000, 1_800_001, 25_000)
ax.hist(prices, bins=bins, color=opends_plot.FAINT, alpha=0.55, zorder=2)

ax.axvline(mean, color=opends_plot.ACCENT, linewidth=2, zorder=3)
ax.axvline(
    median, color=opends_plot.INK, linewidth=1.6, linestyle=(0, (5, 4)), zorder=3
)

ymax = ax.get_ylim()[1]
ax.text(
    mean + 18_000,
    ymax * 0.96,
    f"mean ${mean:,.0f}",
    color=opends_plot.ACCENT,
    fontsize=11,
    fontweight=600,
)
ax.text(
    median - 18_000,
    ymax * 0.86,
    f"median ${median:,.0f}",
    color=opends_plot.INK,
    fontsize=11,
    fontweight=600,
    horizontalalignment="right",
)
ax.annotate(
    f"{million_share:.0%} of sales crossed $1M,\nall of them pulling the mean up",
    xy=(1_150_000, ymax * 0.06),
    xytext=(1_180_000, ymax * 0.38),
    fontsize=10,
    color=opends_plot.MUTED,
    arrowprops={"arrowstyle": "-", "color": opends_plot.FAINT},
)

ax.xaxis.set_major_formatter(
    FuncFormatter(
        lambda v, _: f"${v / 1e6:.1f}M" if v >= 1_000_000 else f"${v / 1e3:,.0f}k"
    )
)
ax.set_xlabel("Resale price")
ax.set_ylabel("Sales")
ax.set_title(f"All {len(prices):,} HDB resales, January to June 2026")

out = opends_plot.export_dir("mean-median-mode") / "price-histogram.png"
fig.savefig(out)
print(f"wrote {out}")
