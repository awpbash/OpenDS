/**
 * Core logic for the MeanMedianOutlierExplorer widget, kept free of React
 * and presentation so it can be unit-tested directly.
 */

export interface PricePoint {
  id: number;
  value: number;
}

export const DOMAIN = { min: 200_000, max: 1_800_000 } as const;

export const MAX_POINTS = 14;

/** Step for dragging and keyboard nudges: prices snap to whole thousands. */
export const VALUE_STEP = 1_000;

/**
 * Nine real transactions: 3-room resale flats in Geylang, April 2026,
 * picked evenly by rank from the month's 29 sales (data.gov.sg). The two
 * high sales are genuine, which is the point: real data comes with real
 * outliers already in it.
 */
export const DEFAULT_POINTS: PricePoint[] = [
  292_000, 330_000, 340_000, 350_000, 358_788, 430_000, 445_000, 688_000,
  850_000,
].map((value, index) => ({ id: index + 1, value }));

/** What the "add an outlier" button appends: a rare but real price level. */
export const OUTLIER_VALUE = 1_600_000;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number): number {
  return (
    Math.round(clamp(value, DOMAIN.min, DOMAIN.max) / VALUE_STEP) * VALUE_STEP
  );
}

export function mean(values: number[]): number {
  let sum = 0;
  for (const value of values) sum += value;
  return sum / values.length;
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function addPoint(points: PricePoint[], value: number): PricePoint[] {
  if (points.length >= MAX_POINTS) return points;
  const nextId = points.reduce((max, point) => Math.max(max, point.id), 0) + 1;
  return [...points, { id: nextId, value: snap(value) }];
}

export function removePoint(points: PricePoint[], id: number): PricePoint[] {
  return points.filter((point) => point.id !== id);
}

export function movePoint(
  points: PricePoint[],
  id: number,
  value: number,
): PricePoint[] {
  return points.map((point) =>
    point.id === id ? { ...point, value: snap(value) } : point,
  );
}

/**
 * Dot-plot stacking: points whose horizontal positions collide are lifted
 * onto higher rows, like coins stacked on a ruler. Returns one row index
 * per input, preserving input order.
 */
export function stackRows(xs: number[], minGap: number): number[] {
  const order = xs.map((x, index) => ({ x, index }));
  order.sort((a, b) => a.x - b.x || a.index - b.index);

  const placed: { x: number; row: number }[] = [];
  const rows = new Array<number>(xs.length).fill(0);
  for (const { x, index } of order) {
    let row = 0;
    while (
      placed.some(
        (other) => other.row === row && Math.abs(other.x - x) < minGap,
      )
    ) {
      row += 1;
    }
    placed.push({ x, row });
    rows[index] = row;
  }
  return rows;
}

/** "$447,433", no decimals. Shared by both mean-median-mode widgets. */
export function formatSGD(value: number): string {
  return `$${Math.round(value).toLocaleString("en-SG")}`;
}
