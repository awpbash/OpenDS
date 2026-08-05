"""Animation for the "Mean, Median, and Mode" concept.

Nine real sale prices (3-room resales, Geylang, April 2026) sit on a
number line. The most expensive sale slides from $850k to $1.6M: the mean
chases it, the median does not move at all. Rendered in the OpenDS
light-theme palette so the video sits naturally on the article page.

Render (from the repo root):

    pnpm render:animation mean_median_mode MeanChasesOutlier --slug mean-median-mode
"""

from pathlib import Path

import manimpango
from manim import (
    BOLD,
    DOWN,
    Circle,
    Create,
    DashedLine,
    FadeIn,
    FadeOut,
    Line,
    Scene,
    ValueTracker,
    VGroup,
    Write,
    always_redraw,
    linear,
)
from manim import Text as _Text

# All text uses the site's UI font so videos match the pages they sit on.
manimpango.register_font(
    str(Path(__file__).resolve().parents[1] / "fonts" / "Inter-Variable.ttf")
)


def Text(*args, **kwargs):  # noqa: N802 - deliberate drop-in for manim.Text
    kwargs.setdefault("font", "Inter")
    return _Text(*args, **kwargs)


PAPER = "#fdfcfa"
INK = "#1f1c19"
MUTED = "#5f5a53"
HAIRLINE = "#d8d3ca"
TEAL = "#0f766e"

# The eight sales that stay put, and the one that will slide.
FIXED_PRICES = [292_000, 330_000, 340_000, 350_000, 358_788, 430_000, 445_000, 688_000]
OUTLIER_START = 850_000
OUTLIER_END = 1_600_000

PRICE_MIN = 250_000
PRICE_MAX = 1_700_000
X_LEFT, X_RIGHT = -5.9, 5.9
BASELINE_Y = -1.6
DOT_RADIUS = 0.13
ROW_STEP = 0.34
MARKER_TOP = 1.3
TICKS = [250_000, 500_000, 750_000, 1_000_000, 1_250_000, 1_500_000]


def to_x(price: float) -> float:
    span = PRICE_MAX - PRICE_MIN
    return X_LEFT + (price - PRICE_MIN) / span * (X_RIGHT - X_LEFT)


def stack_rows(prices: list[float], min_gap: float) -> list[int]:
    """Row per price so nearby dots stack instead of overlapping."""
    placed: list[tuple[float, int]] = []
    rows: list[int] = []
    for price in prices:
        row = 0
        while any(r == row and abs(p - price) < min_gap for p, r in placed):
            row += 1
        placed.append((price, row))
        rows.append(row)
    return rows


def money(value: float) -> str:
    return f"${round(value):,}"


def tick_label(price: int) -> str:
    if price < 1_000_000:
        return f"${price // 1000}k"
    text = f"{price / 1e6:.2f}".rstrip("0").rstrip(".")
    return f"${text}M"


def mean_of(outlier: float) -> float:
    return (sum(FIXED_PRICES) + outlier) / (len(FIXED_PRICES) + 1)


class MeanChasesOutlier(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        median = 358_788  # middle of the nine; the slide never changes it

        # Number line with dollar ticks.
        axis = Line([X_LEFT, BASELINE_Y, 0], [X_RIGHT, BASELINE_Y, 0], color=HAIRLINE, stroke_width=2.5)
        ticks = VGroup()
        for price in TICKS:
            x = to_x(price)
            ticks.add(Line([x, BASELINE_Y, 0], [x, BASELINE_Y - 0.12, 0], color=HAIRLINE, stroke_width=2))
            ticks.add(Text(tick_label(price), font_size=17, color=MUTED).move_to([x, BASELINE_Y - 0.42, 0]))

        # The eight fixed sales, stacked where they crowd.
        rows = stack_rows(FIXED_PRICES, min_gap=32_000)
        fixed_dots = VGroup(
            *[
                Circle(radius=DOT_RADIUS, color=TEAL, fill_color=PAPER, fill_opacity=1, stroke_width=2.5).move_to(
                    [to_x(price), BASELINE_Y + 0.3 + row * ROW_STEP, 0]
                )
                for price, row in zip(FIXED_PRICES, rows)
            ]
        )

        outlier_price = ValueTracker(OUTLIER_START)
        outlier_dot = always_redraw(
            lambda: Circle(
                radius=DOT_RADIUS, color=TEAL, fill_color=TEAL, fill_opacity=1, stroke_width=2.5
            ).move_to([to_x(outlier_price.get_value()), BASELINE_Y + 0.3, 0])
        )

        # Median: dashed, static, labelled to the left of its line.
        median_x = to_x(median)
        median_line = DashedLine(
            [median_x, BASELINE_Y, 0], [median_x, MARKER_TOP, 0], color=INK, stroke_width=2.5, dash_length=0.12
        )
        median_label = VGroup(
            Text("median", font_size=21, color=INK, weight=BOLD),
            Text(money(median), font_size=21, color=INK),
        ).arrange(DOWN, buff=0.08)
        median_label.move_to([median_x - 1.0, MARKER_TOP + 0.45, 0])

        # Mean: solid teal, follows the data live, labelled to the right.
        def mean_group():
            x = to_x(mean_of(outlier_price.get_value()))
            line = Line([x, BASELINE_Y, 0], [x, MARKER_TOP, 0], color=TEAL, stroke_width=3.5)
            label = VGroup(
                Text("mean", font_size=21, color=TEAL, weight=BOLD),
                Text(money(mean_of(outlier_price.get_value())), font_size=21, color=TEAL),
            ).arrange(DOWN, buff=0.08)
            label.move_to([x + 1.0, MARKER_TOP + 0.45, 0])
            return VGroup(line, label)

        mean_marker = always_redraw(mean_group)

        caption = Text(
            "nine real sales: 3-room resales, Geylang, April 2026",
            font_size=19,
            color=MUTED,
        ).move_to([0, -2.9, 0])

        self.play(
            Create(axis),
            FadeIn(ticks),
            FadeIn(fixed_dots, lag_ratio=0.15),
            FadeIn(outlier_dot),
            Write(caption),
            run_time=1.6,
        )
        self.play(Create(median_line), FadeIn(median_label), run_time=0.9)
        self.play(FadeIn(mean_marker), run_time=0.9)
        self.wait(0.6)

        # Pulse a ring around the sale that is about to move. The dot itself
        # is an always_redraw mobject, so it cannot be animated directly.
        ring = Circle(radius=DOT_RADIUS * 2.1, color=TEAL, stroke_width=3).move_to(
            [to_x(OUTLIER_START), BASELINE_Y + 0.3, 0]
        )
        self.play(Create(ring), run_time=0.4)
        self.play(FadeOut(ring), run_time=0.4)

        self.play(outlier_price.animate.set_value(OUTLIER_END), run_time=4.0, rate_func=linear)
        self.wait(0.5)

        closing = Text(
            "one sale moved $750,000 · the mean moved $83,333 · the median moved $0",
            font_size=20,
            color=INK,
        ).move_to([0, -2.9, 0])
        self.play(caption.animate.set_opacity(0), FadeIn(closing), run_time=0.9)
        self.wait(1.8)
