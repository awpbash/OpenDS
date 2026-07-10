"""Animations for the "Transformers" concept.

Three scenes, all with illustrative numbers chosen for the picture, not
taken from a model:

  AttentionLooksBack   weighted arcs from "it" back over the context
  QkvSoftLookup        query matches keys, softmax weights, blended values
  StackedBlocks        tokens flow up through blocks to a distribution
  GradientHighway      the loss gradient rides the residual path down intact

Render (from the repo root):

    python -m manim render -qh --fps 30 --media_dir animations/media \
        -o attention-looks-back animations/src/transformers.py AttentionLooksBack
    python -m manim render -qh --fps 30 --media_dir animations/media \
        -o qkv-soft-lookup animations/src/transformers.py QkvSoftLookup
    python -m manim render -qh --fps 30 --media_dir animations/media \
        -o stacked-blocks animations/src/transformers.py StackedBlocks
    python -m manim render -qh --fps 30 --media_dir animations/media \
        -o gradient-highway animations/src/transformers.py GradientHighway
    python -m manim render -qh --fps 30 --media_dir animations/media \
        -o full-pass animations/src/transformers.py FullPass
"""

from pathlib import Path

import manimpango
from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UP,
    ArcBetweenPoints,
    Circle,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    MoveAlongPath,
    MovingCameraScene,
    Rectangle,
    ReplacementTransform,
    Restore,
    RoundedRectangle,
    Scene,
    VGroup,
    VMobject,
    Write,
)
from manim import Text as _Text

# All text uses the site's UI font so videos match the pages they sit on.
# Manim's fallback font has uneven letter spacing that reads as sloppy.
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

WORDS = [
    "the",
    "animal",
    "didn't",
    "cross",
    "the",
    "street",
    "because",
    "it",
    "was",
    "too",
    "tired",
]
IT_INDEX = 7

# Illustrative attention from "it" over the tokens before it. Sums to 1.
WEIGHTS = [0.04, 0.45, 0.05, 0.08, 0.04, 0.22, 0.12]


def token_box(word: str) -> VGroup:
    label = Text(word, font_size=22, color=INK)
    box = RoundedRectangle(
        corner_radius=0.12,
        height=0.62,
        width=label.width + 0.4,
        stroke_color=HAIRLINE,
        stroke_width=1.5,
        fill_color=PAPER,
        fill_opacity=1.0,
    )
    label.move_to(box.get_center())
    return VGroup(box, label)


class AttentionLooksBack(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        tokens = VGroup(*[token_box(word) for word in WORDS])
        tokens.arrange(buff=0.14)
        if tokens.width > 12.8:
            tokens.scale_to_fit_width(12.8)
        tokens.move_to([0, -0.9, 0])

        self.play(FadeIn(tokens, lag_ratio=0.08), run_time=1.6)
        self.wait(0.3)

        it_box = tokens[IT_INDEX][0]
        question = Text(
            'to predict the next word, the model must resolve "it"',
            font_size=22,
            color=MUTED,
        ).move_to([0, -2.4, 0])
        self.play(
            it_box.animate.set_stroke(color=TEAL, width=3.5),
            Write(question),
            run_time=1.2,
        )
        self.wait(0.6)

        arcs = VGroup()
        for target_index, weight in enumerate(WEIGHTS):
            start = tokens[IT_INDEX][0].get_top() + UP * 0.05
            end = tokens[target_index][0].get_top() + UP * 0.05
            arc = ArcBetweenPoints(
                start,
                end,
                angle=1.1,
                color=TEAL,
                stroke_width=1.0 + 9.0 * weight,
            )
            arc.set_stroke(opacity=0.25 + 0.75 * weight)
            arcs.add(arc)

        animal_box = tokens[1][0]
        strongest = Text("0.45", font_size=18, color=TEAL)
        strongest.next_to(arcs[1].point_from_proportion(0.5), UP, buff=0.12)
        runner_up = Text("0.22", font_size=18, color=MUTED)
        runner_up.next_to(arcs[5].point_from_proportion(0.5), UP, buff=0.1)

        self.play(Create(arcs, lag_ratio=0.12), run_time=2.2)
        self.play(
            animal_box.animate.set_fill(color=TEAL, opacity=0.14),
            FadeIn(strongest, shift=UP * 0.1),
            FadeIn(runner_up, shift=UP * 0.1),
            run_time=1.0,
        )
        self.wait(0.8)

        closing = Text(
            "attention scores every earlier token, then blends them by weight",
            font_size=22,
            color=MUTED,
        ).move_to([0, -2.4, 0])
        self.play(FadeOut(question, shift=DOWN * 0.1), run_time=0.4)
        self.play(Write(closing), run_time=1.4)
        self.wait(2.0)


# Illustrative softmax([1.2, 4.8, 2.9]) for the lookup scene.
LOOKUP_TOKENS = ["the", "animal", "street"]
LOOKUP_SCORES = ["1.2", "4.8", "2.9"]
LOOKUP_WEIGHTS = [0.02, 0.85, 0.13]
LOOKUP_YS = [2.0, 0.5, -1.0]


class QkvSoftLookup(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        sources = VGroup()
        for word, y in zip(LOOKUP_TOKENS, LOOKUP_YS):
            box = token_box(word)
            box.move_to([-4.5, y, 0])
            sources.add(box)

        asker = token_box("it")
        asker.move_to([4.0, 0.5, 0])
        asker[0].set_stroke(color=TEAL, width=3)
        query_label = Text('the query of "it"', font_size=18, color=MUTED)
        query_label.next_to(asker, UP, buff=0.25)

        caption = Text(
            "every earlier token offers a key to match and a value to give",
            font_size=22,
            color=MUTED,
        ).move_to([0, -2.9, 0])

        self.play(
            FadeIn(sources, lag_ratio=0.2),
            FadeIn(asker),
            FadeIn(query_label),
            Write(caption),
            run_time=1.6,
        )
        self.wait(0.4)

        lines = VGroup()
        scores = VGroup()
        for box, score in zip(sources, LOOKUP_SCORES):
            line = Line(
                asker.get_left() + LEFT * 0.08,
                box.get_right() + RIGHT * 0.08,
                color=TEAL,
                stroke_width=1.8,
                stroke_opacity=0.55,
            )
            lines.add(line)
            label = Text(f"score {score}", font_size=18, color=INK)
            label.next_to(box, RIGHT, buff=0.3).shift(UP * 0.35)
            scores.add(label)

        self.play(Create(lines, lag_ratio=0.2), run_time=1.4)
        self.play(FadeIn(scores, lag_ratio=0.2), run_time=1.0)
        self.wait(0.6)

        caption2 = Text(
            "softmax turns scores into weights that sum to one",
            font_size=22,
            color=MUTED,
        ).move_to([0, -2.9, 0])
        weights = VGroup()
        for label, weight in zip(scores, LOOKUP_WEIGHTS):
            new_label = Text(f"weight {weight:.2f}", font_size=18, color=TEAL)
            new_label.move_to(label)
            weights.add(new_label)

        self.play(FadeOut(caption, shift=DOWN * 0.1), run_time=0.4)
        self.play(
            Write(caption2),
            *[
                ReplacementTransform(old, new)
                for old, new in zip(scores, weights)
            ],
            *[
                line.animate.set_stroke(
                    width=1.0 + 8.0 * weight, opacity=0.25 + 0.75 * weight
                )
                for line, weight in zip(lines, LOOKUP_WEIGHTS)
            ],
            run_time=1.4,
        )
        self.wait(0.8)

        # The values blend into one bar, one segment per token, sized by weight.
        bar_width = 4.2
        bar_left = asker.get_center()[0] - bar_width / 2
        bar_y = -1.4
        segments = VGroup()
        x = bar_left
        for weight in LOOKUP_WEIGHTS:
            width = bar_width * weight
            segment = Rectangle(
                width=max(width, 0.06),
                height=0.5,
                stroke_color=PAPER,
                stroke_width=2,
                fill_color=TEAL,
                fill_opacity=0.25 + 0.6 * weight,
            )
            segment.move_to([x + width / 2, bar_y, 0])
            segments.add(segment)
            x += width
        blend_label = Text(
            'the new "it": 85% animal', font_size=18, color=MUTED
        ).next_to(segments, DOWN, buff=0.2)

        copies = VGroup(*[box.copy() for box in sources])
        self.play(
            *[
                ReplacementTransform(copy, segment)
                for copy, segment in zip(copies, segments)
            ],
            run_time=1.4,
        )
        self.play(FadeIn(blend_label), run_time=0.6)
        self.wait(0.6)

        caption3 = Text(
            "match with keys, weigh with softmax, blend the values",
            font_size=22,
            color=MUTED,
        ).move_to([0, -2.9, 0])
        self.play(FadeOut(caption2, shift=DOWN * 0.1), run_time=0.4)
        self.play(Write(caption3), run_time=1.2)
        self.wait(2.0)


STACK_TOKENS = ["to", "be", "or", "not", "to"]
STACK_PREDICTIONS = [("be", 0.71), ("the", 0.09), ("do", 0.05)]


class StackedBlocks(Scene):
    def construct(self):
        self.camera.background_color = PAPER

        tokens = VGroup(*[token_box(word) for word in STACK_TOKENS])
        tokens.arrange(buff=0.18).move_to([0, -3.2, 0])

        embeddings = VGroup()
        for box in tokens:
            bar = Rectangle(
                width=0.2,
                height=0.55,
                stroke_color=TEAL,
                stroke_width=1.8,
                fill_color=TEAL,
                fill_opacity=0.18,
            )
            bar.move_to([box.get_center()[0], -2.0, 0])
            embeddings.add(bar)
        embed_label = Text("embeddings", font_size=18, color=MUTED)
        embed_label.next_to(embeddings, RIGHT, buff=0.5)

        blocks = VGroup()
        for i, y in enumerate([-0.85, 0.35, 1.55]):
            block = RoundedRectangle(
                corner_radius=0.14,
                width=6.2,
                height=0.85,
                stroke_color=HAIRLINE,
                stroke_width=2,
                fill_color=PAPER,
                fill_opacity=1.0,
            ).move_to([0, y, 0])
            label = Text(
                f"block {i + 1}:  attention + MLP", font_size=20, color=INK
            ).move_to(block.get_center())
            blocks.add(VGroup(block, label))

        bar_left = -1.1
        predictions = VGroup()
        for row, (word, p) in enumerate(STACK_PREDICTIONS):
            y = 3.4 - row * 0.42
            label = Text(word, font_size=18, color=INK)
            label.move_to([bar_left - 0.5, y, 0])
            bar = Rectangle(
                width=max(3.4 * p, 0.05),
                height=0.22,
                stroke_width=0,
                fill_color=TEAL,
                fill_opacity=0.85 if row == 0 else 0.45,
            )
            bar.move_to([bar_left + 3.4 * p / 2, y, 0])
            pct = Text(f"{int(p * 100)}%", font_size=16, color=MUTED)
            pct.next_to(bar, RIGHT, buff=0.15)
            predictions.add(VGroup(label, bar, pct))
        predictions_title = Text(
            "p(next token)", font_size=18, color=MUTED
        ).move_to([-3.6, 3.4, 0])

        caption = Text(
            "one prediction, bottom to top",
            font_size=22,
            color=MUTED,
        ).move_to([4.6, -3.2, 0])

        self.play(FadeIn(tokens, lag_ratio=0.1), run_time=1.0)
        self.play(
            ReplacementTransform(
                VGroup(*[box.copy() for box in tokens]), embeddings
            ),
            FadeIn(embed_label),
            Write(caption),
            run_time=1.2,
        )

        for block in blocks:
            self.play(FadeIn(block, shift=UP * 0.15), run_time=0.6)
            self.play(
                block[0]
                .animate.set_fill(color=TEAL, opacity=0.1)
                .set_stroke(color=TEAL, width=2),
                run_time=0.35,
            )
            self.play(
                block[0]
                .animate.set_fill(color=PAPER, opacity=1.0)
                .set_stroke(color=HAIRLINE, width=2),
                run_time=0.35,
            )

        self.play(FadeIn(predictions_title), run_time=0.5)
        self.play(FadeIn(predictions, lag_ratio=0.25, shift=UP * 0.1), run_time=1.2)
        self.wait(0.6)

        closing = Text(
            "the output is always a distribution over what comes next",
            font_size=22,
            color=MUTED,
        ).move_to([0, -3.85, 0])
        self.play(FadeOut(caption, shift=DOWN * 0.1), run_time=0.4)
        self.play(Write(closing), run_time=1.2)
        self.wait(2.0)


class GradientHighway(Scene):
    """The canonical residual diagram, animated in both directions.

    The spine is the residual stream. Each block is a detour loop that
    rejoins the spine at a plus junction. A pulse travels up in the forward
    pass (splitting through each block and merging at the plus), then a
    pulse travels back down in the backward pass, splitting the same way.
    The point: one straight path always connects the loss to the input.
    """

    SPINE_X = 0.0
    DETOUR_X = 2.4
    BOTTOM = -2.75
    TOP = 2.95
    SPLITS = [-2.1, -0.5, 1.1]  # where each detour leaves the spine
    JOINS = [-0.9, 0.7, 2.3]  # the plus junction where it rejoins

    def construct(self):
        self.camera.background_color = PAPER

        spine = Line(
            [self.SPINE_X, self.BOTTOM, 0],
            [self.SPINE_X, self.TOP, 0],
            color=HAIRLINE,
            stroke_width=2.5,
        )

        detour_paths = []
        detour_lines = VGroup()
        blocks = VGroup()
        pluses = VGroup()
        for i, (a, b) in enumerate(zip(self.SPLITS, self.JOINS)):
            corners = [
                [self.SPINE_X, a, 0],
                [self.DETOUR_X, a, 0],
                [self.DETOUR_X, b, 0],
                [self.SPINE_X + 0.16, b, 0],
            ]
            path = VMobject().set_points_as_corners(corners)
            detour_paths.append(path)
            visible = path.copy().set_stroke(color=HAIRLINE, width=2.5)
            detour_lines.add(visible)

            block = RoundedRectangle(
                corner_radius=0.12,
                width=1.9,
                height=0.68,
                stroke_color=HAIRLINE,
                stroke_width=2,
                fill_color=PAPER,
                fill_opacity=1.0,
            ).move_to([self.DETOUR_X, (a + b) / 2, 0])
            label = Text(f"block {i + 1}", font_size=19, color=INK)
            label.move_to(block.get_center())
            blocks.add(VGroup(block, label))

            plus = VGroup(
                Circle(
                    radius=0.16,
                    color=MUTED,
                    stroke_width=1.8,
                    fill_color=PAPER,
                    fill_opacity=1.0,
                ),
                Text("+", font_size=20, color=MUTED),
            ).move_to([self.SPINE_X, b, 0])
            pluses.add(plus)

        loss = token_box("loss")
        loss.move_to([self.SPINE_X, self.TOP + 0.42, 0])
        inputs = Text("embeddings", font_size=19, color=MUTED)
        inputs.move_to([self.SPINE_X, self.BOTTOM - 0.4, 0])
        stream_label = Text("the residual stream", font_size=18, color=MUTED)
        stream_label.move_to([-2.4, 0.1, 0])

        caption = Text(
            "forward: the stream flows up, each block adds its edit at +",
            font_size=22,
            color=MUTED,
        ).move_to([0, -3.65, 0])

        self.play(
            Create(spine),
            Create(detour_lines, lag_ratio=0.15),
            FadeIn(blocks, lag_ratio=0.15),
            FadeIn(pluses, lag_ratio=0.15),
            FadeIn(loss),
            FadeIn(inputs),
            FadeIn(stream_label),
            Write(caption),
            run_time=2.2,
        )
        self.wait(0.4)

        # Forward pulse: filled dot rides the spine, a copy takes each detour,
        # they merge at the plus.
        pulse = Dot(
            [self.SPINE_X, self.BOTTOM, 0], radius=0.11, color=TEAL
        ).set_fill(TEAL, opacity=1.0)
        self.play(FadeIn(pulse, scale=0.5), run_time=0.3)
        for a, b, path, plus in zip(
            self.SPLITS, self.JOINS, detour_paths, pluses
        ):
            self.play(
                pulse.animate.move_to([self.SPINE_X, a, 0]),
                run_time=0.45,
            )
            side = pulse.copy().set_opacity(0.7)
            self.play(
                pulse.animate.move_to([self.SPINE_X, b, 0]),
                MoveAlongPath(side, path),
                run_time=1.0,
            )
            self.play(
                FadeOut(side, scale=0.4),
                plus[0].animate.set_stroke(color=TEAL, width=2.5),
                run_time=0.25,
            )
        self.play(pulse.animate.move_to(loss.get_center()), run_time=0.5)
        self.play(
            FadeOut(pulse, scale=0.5),
            loss[0].animate.set_stroke(color=TEAL, width=3),
            run_time=0.4,
        )
        self.wait(0.4)

        caption2 = Text(
            "backward: at every +, the gradient splits and one copy rides straight down",
            font_size=22,
            color=MUTED,
        ).move_to([0, -3.65, 0])
        self.play(
            FadeOut(caption, shift=DOWN * 0.1), Write(caption2), run_time=1.0
        )

        # Backward pulse: a ring retraces the spine from the loss. At each
        # plus it splits, the detour copy dims into the block (its weight
        # update), the spine copy keeps full strength.
        grad = Circle(radius=0.11, color=TEAL, stroke_width=3.5)
        grad.move_to(loss.get_center())
        self.play(FadeIn(grad, scale=0.5), run_time=0.3)
        for a, b, path, block in zip(
            reversed(self.SPLITS),
            reversed(self.JOINS),
            reversed(detour_paths),
            reversed(list(blocks)),
        ):
            self.play(
                grad.animate.move_to([self.SPINE_X, b, 0]), run_time=0.45
            )
            side = grad.copy().set_stroke(opacity=0.5)
            reverse = path.copy().reverse_points()
            self.play(
                grad.animate.move_to([self.SPINE_X, a, 0]),
                MoveAlongPath(side, reverse),
                run_time=1.0,
            )
            self.play(
                FadeOut(side, scale=0.4),
                block[0].animate.set_stroke(color=TEAL, width=2.5),
                run_time=0.25,
            )
        self.play(
            grad.animate.move_to([self.SPINE_X, self.BOTTOM, 0]),
            run_time=0.45,
        )
        self.play(FadeOut(grad, scale=0.5), run_time=0.3)
        self.wait(0.3)

        closing = Text(
            "one straight path always connects the loss to the input",
            font_size=22,
            color=MUTED,
        ).move_to([0, -3.65, 0])
        self.play(FadeOut(caption2, shift=DOWN * 0.1), run_time=0.4)
        self.play(Write(closing), run_time=1.2)
        self.wait(2.0)


# ---------------------------------------------------------------------------
# FullPass: the capstone. One continuous shot of the whole prediction and
# learning loop, using REAL numbers from the trained demo model (extracted
# by running "ROMEO: " through the exported weights, see the article).
#
# Storyboard:
#   1. "ROMEO: " appears as characters, becomes token ids, becomes vectors
#   2. the machine is revealed: residual spine, 3 blocks as detour loops
#   3. a pulse rides up through block 1
#   4. camera zooms into block 2: real attention weights of the last
#      position fan out over the context, the values blend, zoom out
#   5. the pulse finishes, the real top-5 probabilities unfold as bars,
#      sampling picks "I", it is appended to the input
#   6. training act: the text says "w" comes next, loss = 2.37 nats
#   7. the gradient ring retraces the spine, every block takes its share
#   8. the "w" bar grows a nudge, the real loss curve ticks down, close
# ---------------------------------------------------------------------------

FP_CHARS = ["R", "O", "M", "E", "O", ":", "_"]
FP_IDS = [30, 27, 25, 17, 27, 10, 1]
# block 2 attention of the last position, head-averaged, from the real model
FP_ATTN = [0.09, 0.16, 0.05, 0.01, 0.02, 0.27, 0.40]
# real top-5 next-char probabilities after "ROMEO: "
FP_TOP5 = [("I", 0.175), ("w", 0.094), ("t", 0.071), ("s", 0.062), ("W", 0.049)]

FP_SPINE_X = 0.0
FP_DETOUR_X = 1.9
FP_BOTTOM = -2.45
FP_TOP = 2.05
FP_SPLITS = [-2.1, -0.85, 0.4]
FP_JOINS = [-1.2, 0.05, 1.3]


def small_char_box(char: str, size: float = 0.52, font_size: int = 17) -> VGroup:
    label = Text(char, font_size=font_size, color=INK)
    box = RoundedRectangle(
        corner_radius=0.08,
        height=size,
        width=size,
        stroke_color=HAIRLINE,
        stroke_width=1.4,
        fill_color=PAPER,
        fill_opacity=1.0,
    )
    label.move_to(box.get_center())
    return VGroup(box, label)


class FullPass(MovingCameraScene):
    def swap_caption(self, old, text, run_time=1.0):
        new = Text(text, font_size=22, color=MUTED).move_to([0, -3.8, 0])
        if old is None:
            self.play(Write(new), run_time=run_time)
        else:
            self.play(
                FadeOut(old, shift=DOWN * 0.1), Write(new), run_time=run_time
            )
        return new

    def construct(self):
        self.camera.background_color = PAPER

        # ------------------------------------------------- beat 1: input
        input_row = VGroup()
        for i, ch in enumerate(FP_CHARS):
            box = small_char_box(ch)
            box.move_to([-1.95 + i * 0.65, -2.95, 0])
            input_row.add(box)

        cap = self.swap_caption(
            None, "the model reads 7 characters and must bet on the 8th"
        )
        self.play(FadeIn(input_row, lag_ratio=0.1), run_time=1.2)
        self.wait(0.5)

        ids = VGroup()
        for box, token_id in zip(input_row, FP_IDS):
            label = Text(str(token_id), font_size=14, color=TEAL)
            label.move_to([box.get_center()[0], -3.42, 0])
            ids.add(label)
        cap = self.swap_caption(
            cap, "each character is an id, each id looks up a 96-number vector"
        )
        self.play(FadeIn(ids, lag_ratio=0.1), run_time=0.9)
        self.wait(1.0)

        columns = VGroup()
        for i in range(7):
            bar = Rectangle(
                width=0.14,
                height=0.5,
                stroke_color=TEAL,
                stroke_width=1.6,
                fill_color=TEAL,
                fill_opacity=0.18,
            ).move_to([-1.95 + i * 0.65, -2.0, 0])
            columns.add(bar)
        self.play(
            ReplacementTransform(ids, columns),
            run_time=1.0,
        )
        self.wait(0.3)

        # --------------------------------------- beat 2: reveal the machine
        spine = Line(
            [FP_SPINE_X, FP_BOTTOM, 0],
            [FP_SPINE_X, FP_TOP, 0],
            color=HAIRLINE,
            stroke_width=2.5,
        )
        detour_paths = []
        detour_lines = VGroup()
        blocks = VGroup()
        pluses = VGroup()
        for i, (a, b) in enumerate(zip(FP_SPLITS, FP_JOINS)):
            corners = [
                [FP_SPINE_X, a, 0],
                [FP_DETOUR_X, a, 0],
                [FP_DETOUR_X, b, 0],
                [FP_SPINE_X + 0.15, b, 0],
            ]
            path = VMobject().set_points_as_corners(corners)
            detour_paths.append(path)
            detour_lines.add(path.copy().set_stroke(color=HAIRLINE, width=2.2))
            block = RoundedRectangle(
                corner_radius=0.1,
                width=1.7,
                height=0.58,
                stroke_color=HAIRLINE,
                stroke_width=1.8,
                fill_color=PAPER,
                fill_opacity=1.0,
            ).move_to([FP_DETOUR_X, (a + b) / 2, 0])
            label = Text(f"block {i + 1}", font_size=16, color=INK)
            label.move_to(block.get_center())
            blocks.add(VGroup(block, label))
            plus = VGroup(
                Circle(
                    radius=0.13,
                    color=MUTED,
                    stroke_width=1.6,
                    fill_color=PAPER,
                    fill_opacity=1.0,
                ),
                Text("+", font_size=17, color=MUTED),
            ).move_to([FP_SPINE_X, b, 0])
            pluses.add(plus)

        norm_box = VGroup(
            RoundedRectangle(
                corner_radius=0.1,
                width=1.7,
                height=0.5,
                stroke_color=HAIRLINE,
                stroke_width=1.8,
                fill_color=PAPER,
                fill_opacity=1.0,
            ),
            Text("final norm", font_size=15, color=INK),
        )
        norm_box[1].move_to(norm_box[0].get_center())
        norm_box.move_to([FP_SPINE_X, FP_TOP + 0.35, 0])

        stream_label = Text("the residual stream", font_size=16, color=MUTED)
        stream_label.move_to([-2.4, -0.3, 0])

        machine = VGroup(
            spine, detour_lines, blocks, pluses, norm_box, stream_label
        )

        cap = self.swap_caption(
            cap, "the vectors enter the stream, every block edits it"
        )
        self.play(
            Create(spine),
            Create(detour_lines, lag_ratio=0.15),
            FadeIn(blocks, lag_ratio=0.15),
            FadeIn(pluses, lag_ratio=0.15),
            FadeIn(norm_box),
            FadeIn(stream_label),
            run_time=1.8,
        )

        pulse = Dot([FP_SPINE_X, FP_BOTTOM, 0], radius=0.1, color=TEAL)
        pulse.set_fill(TEAL, opacity=1.0)
        self.play(
            ReplacementTransform(columns, pulse),
            run_time=0.8,
        )

        # ------------------------------------------ beat 3: through block 1
        self.wait(0.5)
        a, b = FP_SPLITS[0], FP_JOINS[0]
        self.play(pulse.animate.move_to([FP_SPINE_X, a, 0]), run_time=0.45)
        side = pulse.copy().set_opacity(0.7)
        self.play(
            pulse.animate.move_to([FP_SPINE_X, b, 0]),
            MoveAlongPath(side, detour_paths[0]),
            run_time=1.1,
        )
        self.play(
            FadeOut(side, scale=0.4),
            pluses[0][0].animate.set_stroke(color=TEAL, width=2.2),
            run_time=0.25,
        )
        self.play(
            pulse.animate.move_to([FP_SPINE_X, FP_SPLITS[1], 0]), run_time=0.4
        )

        # ------------------------------- beat 4: zoom into block 2 attention
        cap = self.swap_caption(cap, "inside block 2: attention, with the real weights")
        self.wait(0.6)
        self.camera.frame.save_state()
        self.play(
            self.camera.frame.animate.move_to([1.9, -0.55, 0]).set(width=5.6),
            machine.animate.set_opacity(0.07),
            pulse.animate.set_opacity(0.1),
            run_time=1.8,
        )

        mini_row = VGroup()
        for i, ch in enumerate(FP_CHARS):
            box = small_char_box(ch, size=0.4, font_size=13)
            box.move_to([0.1 + i * 0.6, -1.55, 0])
            mini_row.add(box)
        mini_row[-1][0].set_stroke(color=TEAL, width=2.2)

        weights = VGroup()
        for i, w in enumerate(FP_ATTN):
            label = Text(f"{w:.2f}", font_size=10, color=TEAL if w > 0.2 else MUTED)
            label.move_to([0.1 + i * 0.6, -1.95, 0])
            weights.add(label)

        arcs = VGroup()
        for i, w in enumerate(FP_ATTN[:-1]):
            arc = ArcBetweenPoints(
                mini_row[-1][0].get_top() + UP * 0.02,
                mini_row[i][0].get_top() + UP * 0.02,
                angle=0.9,
                color=TEAL,
                stroke_width=0.8 + 6.0 * w,
            )
            arc.set_stroke(opacity=0.3 + 0.7 * w)
            arcs.add(arc)

        zcap = Text(
            "the space asks: who is about to speak?",
            font_size=13,
            color=MUTED,
        ).move_to([1.9, 0.75, 0])

        self.play(FadeIn(mini_row, lag_ratio=0.08), run_time=1.0)
        self.play(
            Create(arcs, lag_ratio=0.12),
            FadeIn(weights, lag_ratio=0.1),
            Write(zcap),
            run_time=2.4,
        )
        self.wait(2.4)

        blend = Rectangle(
            width=1.7,
            height=0.28,
            stroke_color=PAPER,
            stroke_width=1.5,
            fill_color=TEAL,
            fill_opacity=0.55,
        ).move_to([1.9, 0.25, 0])
        zcap2 = Text(
            "their values blend into the new vector for that position",
            font_size=13,
            color=MUTED,
        ).move_to([1.9, 0.75, 0])
        self.play(FadeOut(zcap), run_time=0.3)
        self.play(
            ReplacementTransform(
                VGroup(*[mini_row[i].copy() for i in range(7)]), blend
            ),
            Write(zcap2),
            run_time=1.6,
        )
        self.wait(2.0)

        self.play(
            FadeOut(VGroup(mini_row, weights, arcs, blend, zcap2)),
            run_time=0.6,
        )
        self.play(
            Restore(self.camera.frame),
            machine.animate.set_opacity(1.0),
            pulse.animate.set_opacity(1.0),
            run_time=1.6,
        )

        # -------------------------------- beat 5: finish the pass, predict
        for i in [1, 2]:
            a, b = FP_SPLITS[i], FP_JOINS[i]
            if i == 2:
                self.play(
                    pulse.animate.move_to([FP_SPINE_X, a, 0]), run_time=0.35
                )
            side = pulse.copy().set_opacity(0.7)
            self.play(
                pulse.animate.move_to([FP_SPINE_X, b, 0]),
                MoveAlongPath(side, detour_paths[i]),
                run_time=0.8,
            )
            self.play(
                FadeOut(side, scale=0.4),
                pluses[i][0].animate.set_stroke(color=TEAL, width=2.2),
                run_time=0.2,
            )
        self.play(pulse.animate.move_to(norm_box.get_center()), run_time=0.4)
        self.play(
            FadeOut(pulse, scale=0.5),
            norm_box[0].animate.set_stroke(color=TEAL, width=2.2),
            run_time=0.4,
        )

        panel_title = Text("p(next char)", font_size=16, color=MUTED)
        panel_title.move_to([-4.9, 3.0, 0])
        bars = VGroup()
        for row, (ch, p) in enumerate(FP_TOP5):
            y = 2.55 - row * 0.42
            label = Text(ch, font_size=16, color=INK)
            label.move_to([-5.6, y, 0])
            bar = Rectangle(
                width=max(6.0 * p, 0.05),
                height=0.24,
                stroke_width=0,
                fill_color=TEAL,
                fill_opacity=0.85 if row == 0 else 0.45,
            )
            bar.move_to([-5.25 + 6.0 * p / 2, y, 0])
            pct = Text(f"{p:.3f}", font_size=13, color=MUTED)
            pct.next_to(bar, RIGHT, buff=0.12)
            bars.add(VGroup(label, bar, pct))

        cap = self.swap_caption(cap, "softmax turns 65 scores into a bet")
        self.play(FadeIn(panel_title), FadeIn(bars, lag_ratio=0.2), run_time=1.8)
        self.wait(1.6)

        ring = Circle(radius=0.22, color=TEAL, stroke_width=3)
        ring.move_to(bars[0][0].get_center())
        cap = self.swap_caption(cap, 'sampling at low temperature: the favourite "I" wins')
        self.play(FadeIn(ring, scale=0.5), run_time=0.5)
        self.wait(0.8)

        new_char = small_char_box("I")
        new_char.move_to([-1.95 + 7 * 0.65, -2.95, 0])
        new_char[0].set_stroke(color=TEAL, width=2.0)
        flying = bars[0][0].copy()
        self.play(
            ReplacementTransform(flying, new_char),
            FadeOut(ring),
            run_time=1.2,
        )
        cap = self.swap_caption(cap, "append it, and the whole loop runs again")

        # The loop restarting, compressed: a ghost pulse rides the spine.
        ghost = Dot([FP_SPINE_X, FP_BOTTOM, 0], radius=0.09, color=TEAL)
        ghost.set_fill(TEAL, opacity=0.45)
        self.play(FadeIn(ghost, scale=0.5), run_time=0.3)
        self.play(
            ghost.animate.move_to([FP_SPINE_X, FP_TOP, 0]), run_time=1.7
        )
        self.play(FadeOut(ghost, scale=0.5), run_time=0.3)
        self.wait(0.6)

        # ------------------------------------------- beat 6: training truth
        cap = self.swap_caption(
            cap, 'training act: in the text, the next character was "w"'
        )
        truth = Text('text: "w"', font_size=15, color=INK)
        truth.next_to(bars[1][2], RIGHT, buff=0.25)
        self.play(
            FadeIn(truth, shift=LEFT * 0.15),
            bars[1][1].animate.set_fill(opacity=0.95),
            bars[0][1].animate.set_fill(opacity=0.3),
            FadeOut(new_char),
            run_time=1.0,
        )
        loss_text = Text(
            "loss = -log(0.094) = 2.37", font_size=16, color=INK
        ).move_to([-4.6, 0.3, 0])
        cap = self.swap_caption(
            cap, "the model gave the truth 9%, that error is the signal"
        )
        self.play(Write(loss_text), run_time=1.1)
        self.wait(1.6)

        # ------------------------------------------------ beat 7: backprop
        cap = self.swap_caption(
            cap, "the gradient retraces the path, every block takes its share"
        )
        grad = Circle(radius=0.1, color=TEAL, stroke_width=3.2)
        grad.move_to(loss_text.get_center())
        self.play(FadeIn(grad, scale=0.5), run_time=0.3)
        self.play(grad.animate.move_to(norm_box.get_center()), run_time=0.5)
        for i in [2, 1, 0]:
            a, b = FP_SPLITS[i], FP_JOINS[i]
            self.play(
                grad.animate.move_to([FP_SPINE_X, b, 0]), run_time=0.35
            )
            side = grad.copy().set_stroke(opacity=0.5)
            reverse = detour_paths[i].copy().reverse_points()
            self.play(
                grad.animate.move_to([FP_SPINE_X, a, 0]),
                MoveAlongPath(side, reverse),
                run_time=0.8,
            )
            self.play(
                FadeOut(side, scale=0.4),
                blocks[i][0].animate.set_stroke(color=TEAL, width=2.2),
                run_time=0.2,
            )
        self.play(
            grad.animate.move_to([FP_SPINE_X, FP_BOTTOM, 0]), run_time=0.35
        )
        self.play(FadeOut(grad, scale=0.5), run_time=0.3)

        # ------------------------------------------------- beat 8: payoff
        cap = self.swap_caption(
            cap, 'every weight nudges probability toward "w", 4,000 times over'
        )
        grown = bars[1][1].copy().stretch_to_fit_width(6.0 * 0.14)
        grown.move_to([-5.25 + 6.0 * 0.14 / 2, bars[1][1].get_center()[1], 0])
        shrunk = bars[0][1].copy().stretch_to_fit_width(6.0 * 0.15)
        shrunk.move_to([-5.25 + 6.0 * 0.15 / 2, bars[0][1].get_center()[1], 0])
        self.play(
            ReplacementTransform(bars[1][1], grown),
            ReplacementTransform(bars[0][1], shrunk),
            bars[1][2].animate.next_to(grown, RIGHT, buff=0.12),
            bars[0][2].animate.next_to(shrunk, RIGHT, buff=0.12),
            truth.animate.next_to(grown, RIGHT, buff=0.85),
            run_time=1.0,
        )

        ticker = Text("val loss 2.28", font_size=16, color=MUTED)
        ticker.move_to([-4.6, -0.35, 0])
        self.play(FadeIn(ticker), run_time=0.5)
        for value in ["val loss 1.85", "val loss 1.70"]:
            new_ticker = Text(value, font_size=16, color=MUTED)
            new_ticker.move_to(ticker.get_center())
            self.play(ReplacementTransform(ticker, new_ticker), run_time=0.7)
            self.wait(0.3)
            ticker = new_ticker
        self.wait(0.8)

        cap = self.swap_caption(
            cap, "read, bet, compare, nudge: that is the whole machine"
        )
        self.wait(3.0)

