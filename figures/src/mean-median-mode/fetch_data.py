"""Snapshot of HDB resale transactions for the mean-median-mode figures.

Downloads January to June 2026 resale flat transactions from data.gov.sg
and writes the columns the figures need to data/resale-2026-h1.csv next to
this script. The snapshot is committed so the figure scripts reproduce the
published images without network access. Rerun only to refresh the window,
and update the article's quoted numbers if you do.

Run from the repo root:

    python figures/src/mean-median-mode/fetch_data.py
"""

import csv
import json
import urllib.parse
import urllib.request
from pathlib import Path

RESOURCE_ID = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc"
API = "https://data.gov.sg/api/action/datastore_search"
MONTHS = [f"2026-{m:02d}" for m in range(1, 7)]
COLUMNS = [
    "month",
    "town",
    "flat_type",
    "storey_range",
    "floor_area_sqm",
    "resale_price",
]
PAGE_SIZE = 5000

OUT = Path(__file__).resolve().parent / "data" / "resale-2026-h1.csv"


def fetch_month(month: str) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    offset = 0
    while True:
        query = urllib.parse.urlencode(
            {
                "resource_id": RESOURCE_ID,
                "filters": json.dumps({"month": month}),
                "limit": PAGE_SIZE,
                "offset": offset,
            }
        )
        with urllib.request.urlopen(f"{API}?{query}", timeout=60) as response:
            payload = json.load(response)
        if not payload.get("success"):
            raise RuntimeError(f"API error for {month}: {payload}")
        records = payload["result"]["records"]
        rows.extend({column: record[column] for column in COLUMNS} for record in records)
        offset += len(records)
        if len(records) < PAGE_SIZE:
            return rows


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=COLUMNS)
        writer.writeheader()
        total = 0
        for month in MONTHS:
            rows = fetch_month(month)
            writer.writerows(rows)
            total += len(rows)
            print(f"  {month}: {len(rows)} transactions")
    print(f"wrote {total} rows to {OUT}")


if __name__ == "__main__":
    main()
