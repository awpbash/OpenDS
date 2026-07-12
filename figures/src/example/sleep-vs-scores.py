"""Reference figure script: a scatter plot in the house style.

Every plot script starts with the same header (the sys.path lines make
figures/opends_plot.py importable no matter where you run from), calls
opends_plot.apply(), and saves through opends_plot.export_dir(slug).

Run from the repo root:

    python figures/src/example/sleep-vs-scores.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import matplotlib.pyplot as plt
import numpy as np

import opends_plot

opends_plot.apply()

# Fixed seed: rerunning the script must reproduce the committed figure.
rng = np.random.default_rng(7)
sleep = rng.uniform(4.5, 9.5, 40)
scores = np.clip(35 + 6.2 * sleep + rng.normal(0, 7, 40), 0, 100)

fig, ax = plt.subplots(figsize=(7, 4.5))
ax.scatter(sleep, scores, s=42, color=opends_plot.ACCENT, alpha=0.75, edgecolor="none")
ax.set_xlabel("Hours of sleep")
ax.set_ylabel("Exam score")
ax.set_title("More sleep, better scores, and a lot of scatter")

out = opends_plot.export_dir("example") / "sleep-vs-scores.png"
fig.savefig(out)
print(f"wrote {out}")
