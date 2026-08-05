import { describe, expect, it } from "vitest";
import {
  COL,
  filterRows,
  modeOf,
  NO_FILTER,
  sortRows,
  summarize,
} from "./resaleData";

// [month, town, flatType, storey, areaSqm, price]
const ROWS: number[][] = [
  [0, 0, 1, 2, 68, 400_000],
  [0, 1, 1, 0, 70, 500_000],
  [1, 0, 2, 1, 93, 700_000],
  [1, 1, 2, 3, 95, 800_000],
  [2, 0, 1, 1, 67, 450_000],
];

describe("filterRows", () => {
  it("passes everything through with no filter", () => {
    expect(filterRows(ROWS, NO_FILTER)).toHaveLength(ROWS.length);
  });

  it("filters by a single column", () => {
    const town0 = filterRows(ROWS, { ...NO_FILTER, town: 0 });
    expect(town0).toHaveLength(3);
    expect(town0.every((row) => row[COL.town] === 0)).toBe(true);
  });

  it("combines filters with AND", () => {
    const rows = filterRows(ROWS, { town: 0, flatType: 1, month: null });
    expect(rows).toHaveLength(2);
  });

  it("returns empty for an impossible combination", () => {
    expect(filterRows(ROWS, { town: 1, flatType: 1, month: 2 })).toHaveLength(
      0,
    );
  });
});

describe("sortRows", () => {
  it("orders by price both ways", () => {
    const asc = sortRows(ROWS, "price-asc").map((row) => row[COL.price]);
    expect(asc).toEqual([400_000, 450_000, 500_000, 700_000, 800_000]);
    const desc = sortRows(ROWS, "price-desc").map((row) => row[COL.price]);
    expect(desc).toEqual([800_000, 700_000, 500_000, 450_000, 400_000]);
  });

  it("shows the latest month first by default", () => {
    const latest = sortRows(ROWS, "latest");
    expect(latest[0][COL.month]).toBe(2);
  });

  it("does not mutate the input", () => {
    const before = ROWS.map((row) => [...row]);
    sortRows(ROWS, "price-asc");
    expect(ROWS).toEqual(before);
  });
});

describe("modeOf", () => {
  it("finds the most frequent category with its share", () => {
    const modal = modeOf(ROWS, COL.flatType);
    expect(modal).toEqual({ index: 1, count: 3, share: 0.6 });
  });

  it("breaks ties toward the lowest index, deterministically", () => {
    const tied = [
      [0, 0, 5, 0, 60, 1],
      [0, 0, 3, 0, 60, 1],
      [0, 0, 5, 0, 60, 1],
      [0, 0, 3, 0, 60, 1],
    ];
    expect(modeOf(tied, COL.flatType)?.index).toBe(3);
  });

  it("returns null for no rows", () => {
    expect(modeOf([], COL.flatType)).toBeNull();
  });
});

describe("summarize", () => {
  it("computes n, mean, median, and the modal flat type", () => {
    const summary = summarize(ROWS);
    expect(summary?.n).toBe(5);
    expect(summary?.mean).toBe(570_000);
    expect(summary?.median).toBe(500_000);
    expect(summary?.modalFlatType?.index).toBe(1);
  });

  it("returns null for an empty slice", () => {
    expect(summarize([])).toBeNull();
  });
});
