/**
 * Core logic for the ResaleDatasetExplorer widget: decoding, filtering,
 * sorting, and summarizing the committed HDB resale snapshot. Kept free of
 * React and fetching so every calculation can be unit-tested directly.
 *
 * The JSON payload is dictionary-encoded to stay small: categorical columns
 * are indices into the lookup lists, and each row is a plain array.
 */

import { mean, median } from "./meanMedian";

export interface ResaleDataset {
  source: string;
  months: string[];
  towns: string[];
  flatTypes: string[];
  storeys: string[];
  /** Row layout: [month, town, flatType, storey, areaSqm, price]. */
  rows: number[][];
}

export const COL = {
  month: 0,
  town: 1,
  flatType: 2,
  storey: 3,
  area: 4,
  price: 5,
} as const;

/** null means "all", otherwise an index into the matching lookup list. */
export interface ResaleFilter {
  town: number | null;
  flatType: number | null;
  month: number | null;
}

export const NO_FILTER: ResaleFilter = {
  town: null,
  flatType: null,
  month: null,
};

export type SortOrder = "latest" | "price-desc" | "price-asc";

export function filterRows(rows: number[][], filter: ResaleFilter): number[][] {
  return rows.filter(
    (row) =>
      (filter.town === null || row[COL.town] === filter.town) &&
      (filter.flatType === null || row[COL.flatType] === filter.flatType) &&
      (filter.month === null || row[COL.month] === filter.month),
  );
}

/** Returns a new array; the snapshot itself is ordered oldest month first. */
export function sortRows(rows: number[][], order: SortOrder): number[][] {
  const copy = [...rows];
  if (order === "latest") return copy.reverse();
  const sign = order === "price-desc" ? -1 : 1;
  return copy.sort((a, b) => sign * (a[COL.price] - b[COL.price]));
}

export interface ModalCategory {
  index: number;
  count: number;
  share: number;
}

/** Most frequent value of a categorical column. Ties break to the lowest index. */
export function modeOf(rows: number[][], column: number): ModalCategory | null {
  if (rows.length === 0) return null;
  const counts = new Map<number, number>();
  for (const row of rows) {
    counts.set(row[column], (counts.get(row[column]) ?? 0) + 1);
  }
  let best: ModalCategory | null = null;
  for (const [index, count] of counts) {
    if (
      !best ||
      count > best.count ||
      (count === best.count && index < best.index)
    ) {
      best = { index, count, share: count / rows.length };
    }
  }
  return best;
}

export interface ResaleSummary {
  n: number;
  mean: number;
  median: number;
  modalFlatType: ModalCategory | null;
}

export function summarize(rows: number[][]): ResaleSummary | null {
  if (rows.length === 0) return null;
  const prices = rows.map((row) => row[COL.price]);
  return {
    n: rows.length,
    mean: mean(prices),
    median: median(prices),
    modalFlatType: modeOf(rows, COL.flatType),
  };
}
