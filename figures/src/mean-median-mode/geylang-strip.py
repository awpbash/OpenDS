"""Dot plot of one real month of sales: 3-room resales, Geylang, April 2026.

The article's opening example. Twenty-nine transactions, with the mean
pulled far above the median by a handful of expensive sales.

Run from the repo root:

    python figures/src/mean-median-mode/geylang-strip.py
"""

import csv
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

import opends_plot

opends_plot.apply()

SNAPSHOT = Path(__file__).resolve().parent / "data" / "resale-2026-h1.csv"
with SNAPSHOT.open(encoding="utf-8") as handle:
    prices = sorted(
        float(row["resale_price"])
        for row in csv.DictReader(handle)
        if row["town"] == "GEYLANG"
        and row["month"] == "2026-04"
        and row["flat_type"] == "3 ROOM"
    )

mean = statistics.fmean(prices)
median = statistics.median(prices)

# Stack dots that would overlap horizontally, like coins on a ruler.
STACK_GAP = 16_000
rows = []
placed: list[tuple[float, int]] = []
for price in prices:
    row = 0
    while any(r == row and abs(p - price) < STACK_GAP for p, r in placed):
        row += 1
    placed.append((price, row))
    rows.append(row)

fig, ax = plt.subplots(figsize=(7.5, 3.6))
ax.scatter(
    prices,
    [0.5 + r for r in rows],
    s=110,
    color=opends_plot.ACCENT,
    alpha=0.8,
    edgecolor="none",
    zorder=3,
)

top = max(rows) + 2.4
ax.axvline(mean, color=opends_plot.ACCENT, linewidth=2, ymax=0.92)
ax.axvline(
    median, color=opends_plot.INK, linewidth=1.6, linestyle=(0, (5, 4)), ymax=0.92
)
# Both labels stack in the clear space right of the mean line; color and
# line style tie each label to its marker.
ax.text(
    mean + 13_000,
    top - 0.35,
    f"mean ${mean:,.0f}",
    color=opends_plot.ACCENT,
    fontsize=11,
    fontweight=600,
)
ax.text(
    mean + 13_000,
    top - 1.05,
    f"median ${median:,.0f}",
    color=opends_plot.INK,
    fontsize=11,
    fontweight=600,
)

ax.set_ylim(0, top)
ax.set_yticks([])
ax.spines["left"].set_visible(False)
ax.grid(axis="y", visible=False)
ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v / 1e3:,.0f}k"))
ax.set_xlabel("Resale price")
ax.set_title("Every 3-room resale in Geylang, April 2026 (29 sales)")

out = opends_plot.export_dir("mean-median-mode") / "geylang-strip.png"
fig.savefig(out)
print(f"wrote {out}")
