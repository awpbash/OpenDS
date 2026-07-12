"""House plotting setup for OpenDS figures.

Registers the site's Inter font (bundled with the animations) and applies
the shared style file, so every plot script starts identically:

    import opends_plot
    opends_plot.apply()

Scripts live in figures/src/<concept-slug>/ and add this folder to their
import path first. docs/MAKE_FIGURES.md has the copy-paste header.
"""

from pathlib import Path

import matplotlib.font_manager
import matplotlib.pyplot as plt

FIGURES_DIR = Path(__file__).resolve().parent
REPO_ROOT = FIGURES_DIR.parent

# The palette, for anything the style file cannot express (annotation
# colors, reference lines, highlighted points).
PAPER = "#fdfcfa"
INK = "#1f1c19"
MUTED = "#5f5a53"
FAINT = "#948f87"
HAIRLINE = "#e7e3dc"
ACCENT = "#0f766e"


def apply() -> None:
    """Register Inter and switch matplotlib to the OpenDS style."""
    font = REPO_ROOT / "animations" / "fonts" / "Inter-Variable.ttf"
    matplotlib.font_manager.fontManager.addfont(str(font))
    plt.style.use(str(FIGURES_DIR / "opends.mplstyle"))


def export_dir(slug: str) -> Path:
    """The public images folder for a concept, created if missing."""
    target = REPO_ROOT / "apps" / "web" / "public" / "images" / "concepts" / slug
    target.mkdir(parents=True, exist_ok=True)
    return target
