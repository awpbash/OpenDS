"""One-command Manim render for OpenDS.

Renders a scene, re-encodes it with the locked web settings, and drops the
result everywhere it needs to live. Run from the repo root:

    pnpm render:animation <module> <SceneClass> --slug <concept-slug>

Example:

    pnpm render:animation what_is_data ObservationsBecomeRows --slug what-is-data

which is the same as:

    python animations/render.py what_is_data ObservationsBecomeRows --slug what-is-data

Outputs:

    animations/renders/<name>.mp4                          the archived master
    apps/web/public/videos/concepts/<slug>/<name>.mp4      what the site serves

The name defaults to the kebab-case of the scene class
(ObservationsBecomeRows becomes observations-become-rows). Override with
--name when the article expects a different filename.

The ffmpeg settings are the house standard. Do not tune them per video:
if a file comes out too large, shorten or simplify the animation instead.
"""

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = REPO_ROOT / "animations" / "src"
MEDIA_DIR = REPO_ROOT / "animations" / "media"
RENDERS_DIR = REPO_ROOT / "animations" / "renders"
WEB_VIDEOS_DIR = REPO_ROOT / "apps" / "web" / "public" / "videos" / "concepts"

QUALITY_DIR = "1080p30"  # matches -qh at 30 fps
SIZE_BUDGET_MB = 2.0

# Locked web encode: H.264 for compatibility, CRF 27 keeps flat-color
# Manim frames small, faststart lets playback begin before full download,
# no audio track because our animations are silent by design.
FFMPEG_ARGS = [
    "-c:v",
    "libx264",
    "-crf",
    "27",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
]


def kebab(scene_name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "-", scene_name).lower()


def die(message: str) -> None:
    print(f"\n  {message}\n", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("module", help="file in animations/src without .py, e.g. what_is_data")
    parser.add_argument("scene", help="Scene class name, e.g. ObservationsBecomeRows")
    parser.add_argument("--slug", required=True, help="concept slug the video belongs to")
    parser.add_argument("--name", help="output filename without extension, defaults to kebab-case of the scene")
    args = parser.parse_args()

    source = SRC_DIR / f"{args.module}.py"
    if not source.exists():
        available = ", ".join(p.stem for p in sorted(SRC_DIR.glob("*.py")))
        die(f"No {source.relative_to(REPO_ROOT)}. Available modules: {available}")

    if shutil.which("ffmpeg") is None:
        die("ffmpeg is not on PATH. Install it first, the encode step needs it.")

    name = args.name or kebab(args.scene)

    render_cmd = [
        sys.executable,
        "-m",
        "manim",
        "render",
        "-qh",
        "--fps",
        "30",
        "--media_dir",
        str(MEDIA_DIR),
        "-o",
        name,
        str(source),
        args.scene,
    ]
    print(f"\n  Rendering {args.scene} from {args.module}.py ...")
    result = subprocess.run(render_cmd)
    if result.returncode != 0:
        die("Manim render failed, see the output above.")

    raw = MEDIA_DIR / "videos" / args.module / QUALITY_DIR / f"{name}.mp4"
    if not raw.exists():
        die(f"Expected Manim output at {raw.relative_to(REPO_ROOT)} but it is not there.")

    RENDERS_DIR.mkdir(parents=True, exist_ok=True)
    web_dir = WEB_VIDEOS_DIR / args.slug
    web_dir.mkdir(parents=True, exist_ok=True)
    master = RENDERS_DIR / f"{name}.mp4"

    print("  Encoding for the web ...")
    encode_cmd = ["ffmpeg", "-y", "-i", str(raw), *FFMPEG_ARGS, str(master)]
    result = subprocess.run(encode_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr, file=sys.stderr)
        die("ffmpeg encode failed.")

    web_copy = web_dir / f"{name}.mp4"
    shutil.copyfile(master, web_copy)

    size_mb = master.stat().st_size / (1024 * 1024)
    print(f"""
  Done.
    {master.relative_to(REPO_ROOT)}
    {web_copy.relative_to(REPO_ROOT)}
    size: {size_mb:.2f} MB (budget {SIZE_BUDGET_MB:.0f} MB)""")
    if size_mb > SIZE_BUDGET_MB:
        print(
            "    over budget: shorten the animation or reduce moving detail.\n"
            "    Do not change the encode settings per video."
        )
    print(f"""
  Embed in the article:
    <AnimatedFigure src="/videos/concepts/{args.slug}/{name}.mp4" caption="..." />
""")


if __name__ == "__main__":
    main()
