"""Encode the resale snapshot for the ResaleDatasetExplorer widget.

Reads the committed CSV written by fetch_data.py and produces a compact
dictionary-encoded JSON (categorical columns become indices into lookup
lists) so the browser payload stays small. Rerun after refreshing the
snapshot.

Run from the repo root:

    python figures/src/mean-median-mode/build_widget_data.py
"""

import csv
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[2]
SNAPSHOT = HERE / "data" / "resale-2026-h1.csv"
OUT = (
    REPO_ROOT
    / "apps"
    / "web"
    / "public"
    / "data"
    / "concepts"
    / "mean-median-mode"
    / "resale-2026-h1.json"
)


def main() -> None:
    with SNAPSHOT.open(encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    months = sorted({row["month"] for row in rows})
    towns = sorted({row["town"] for row in rows})
    flat_types = sorted({row["flat_type"] for row in rows})
    storeys = sorted({row["storey_range"] for row in rows})

    month_index = {value: i for i, value in enumerate(months)}
    town_index = {value: i for i, value in enumerate(towns)}
    flat_type_index = {value: i for i, value in enumerate(flat_types)}
    storey_index = {value: i for i, value in enumerate(storeys)}

    encoded = [
        [
            month_index[row["month"]],
            town_index[row["town"]],
            flat_type_index[row["flat_type"]],
            storey_index[row["storey_range"]],
            round(float(row["floor_area_sqm"])),
            round(float(row["resale_price"])),
        ]
        for row in rows
    ]

    payload = {
        "source": "HDB resale flat prices, data.gov.sg, January to June 2026",
        "months": months,
        "towns": towns,
        "flatTypes": flat_types,
        "storeys": storeys,
        "rows": encoded,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {len(encoded)} rows, {OUT.stat().st_size / 1024:.0f} KB -> {OUT}")


if __name__ == "__main__":
    main()
