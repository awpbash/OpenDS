"""Animation for the "What Is Data?" concept.

Three observations in the world are recorded, one by one, as rows of a
dataset table. Rendered in the OpenDS light-theme palette so the video
sits naturally on the article page.

Render (from the repo root):

    python -m manim render -qh --fps 30 --media_dir animations/media \
        -o observations-to-rows animations/src/what_is_data.py ObservationsBecomeRows
"""

from pathlib import Path

import manimpango
from manim import (
    BOLD,
    DOWN,
    UP,
    Circle,
    Create,
    FadeIn,
    Line,
    ReplacementTransform,
    Scene,
    VGroup,
    Write,
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

OBSERVATIONS = [
    ("A", "6.5", "74"),
    ("B", "8.0", "81"),
    ("C", "5.0", "62"),
]

CIRCLE_POSITIONS = [
    [-5.0, 1.6, 0],
    [-3.6, -0.1, 0],
    [-5.3, -1.7, 0],
]

COLUMN_X = [1.0, 3.0, 5.1]
HEADER_Y = 1.7
ROW_YS = [0.8, -0.1, -1.0]
TABLE_LEFT = 0.2
TABLE_RIGHT = 5.9


class ObservationsBecomeRows(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        observations = VGroup()
        for position, (label, _, _) in zip(CIRCLE_POSITIONS, OBSERVATIONS):
            circle = Circle(radius=0.45, color=TEAL, stroke_width=2.5).move_to(position)
            text = Text(label, font_size=28, color=INK).move_to(position)
            observations.add(VGroup(circle, text))

        world_caption = Text("observations in the world", font_size=20, color=MUTED)
        world_caption.move_to([-4.4, -2.9, 0])

        headers = VGroup(
            *[
                Text(name, font_size=21, color=TEAL, weight=BOLD).move_to([x, HEADER_Y, 0])
                for x, name in zip(COLUMN_X, ["student", "hours_slept", "exam_score"])
            ]
        )
        header_rule = Line(
            [TABLE_LEFT, HEADER_Y - 0.45, 0],
            [TABLE_RIGHT, HEADER_Y - 0.45, 0],
            color=HAIRLINE,
            stroke_width=2,
        )

        self.play(
            FadeIn(observations, lag_ratio=0.35),
            Write(world_caption),
            run_time=1.6,
        )
        self.play(FadeIn(headers), Create(header_rule), run_time=1.0)
        self.wait(0.3)

        for row_index, (label, hours, score) in enumerate(OBSERVATIONS):
            row_y = ROW_YS[row_index]
            student_cell = Text(label, font_size=22, color=INK).move_to([COLUMN_X[0], row_y, 0])
            values = VGroup(
                Text(hours, font_size=22, color=INK).move_to([COLUMN_X[1], row_y, 0]),
                Text(score, font_size=22, color=INK).move_to([COLUMN_X[2], row_y, 0]),
            )
            row_rule = Line(
                [TABLE_LEFT, row_y - 0.45, 0],
                [TABLE_RIGHT, row_y - 0.45, 0],
                color=HAIRLINE,
                stroke_width=1.5,
            )
            self.play(
                ReplacementTransform(observations[row_index], student_cell),
                run_time=0.9,
            )
            self.play(
                FadeIn(values, shift=UP * 0.15),
                Create(row_rule),
                run_time=0.7,
            )

        closing = Text(
            "one row per observation, one column per property",
            font_size=20,
            color=MUTED,
        ).move_to([3.0, -2.4, 0])
        self.play(Write(closing), run_time=1.2)
        self.wait(1.5)
