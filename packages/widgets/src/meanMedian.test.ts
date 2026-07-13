import { describe, expect, it } from "vitest";
import {
  addPoint,
  DEFAULT_POINTS,
  DOMAIN,
  MAX_POINTS,
  mean,
  median,
  movePoint,
  removePoint,
  stackRows,
} from "./meanMedian";

describe("mean and median", () => {
  it("computes both on the default real sales", () => {
    const values = DEFAULT_POINTS.map((point) => point.value);
    expect(mean(values)).toBeCloseTo(453_754.22, 1);
    expect(median(values)).toBe(358_788);
  });

  it("averages the two middle values for an even count", () => {
    expect(median([100, 200, 300, 400])).toBe(250);
  });

  it("ignores input order", () => {
    expect(median([300, 100, 200])).toBe(200);
    expect(mean([300, 100, 200])).toBe(200);
  });

  it("moving one point moves the mean by delta over n, not the median", () => {
    const values = DEFAULT_POINTS.map((point) => point.value);
    const moved = movePoint(DEFAULT_POINTS, 9, 850_000 + 900_000).map(
      (point) => point.value,
    );
    expect(mean(moved) - mean(values)).toBeCloseTo(900_000 / values.length, 5);
    expect(median(moved)).toBe(median(values));
  });
});

describe("point editing", () => {
  it("adds a snapped point with a fresh id", () => {
    const points = addPoint(DEFAULT_POINTS, 612_400);
    expect(points).toHaveLength(DEFAULT_POINTS.length + 1);
    expect(points[points.length - 1]).toEqual({ id: 10, value: 612_000 });
  });

  it("clamps new points to the domain", () => {
    const points = addPoint([], 99_999_999);
    expect(points[0].value).toBe(DOMAIN.max);
  });

  it("does not grow past the maximum", () => {
    let points = DEFAULT_POINTS;
    for (let i = 0; i < MAX_POINTS; i += 1) {
      points = addPoint(points, 500_000);
    }
    expect(points).toHaveLength(MAX_POINTS);
  });

  it("removes by id and reuses nothing", () => {
    const points = removePoint(DEFAULT_POINTS, 1);
    expect(points).toHaveLength(DEFAULT_POINTS.length - 1);
    expect(points.some((point) => point.id === 1)).toBe(false);
  });

  it("does not mutate the input list", () => {
    const before = DEFAULT_POINTS.map((point) => ({ ...point }));
    movePoint(DEFAULT_POINTS, 1, 999_000);
    addPoint(DEFAULT_POINTS, 500_000);
    removePoint(DEFAULT_POINTS, 1);
    expect(DEFAULT_POINTS).toEqual(before);
  });
});

describe("stackRows", () => {
  it("keeps well-separated points on the base row", () => {
    expect(stackRows([0, 100, 200], 20)).toEqual([0, 0, 0]);
  });

  it("lifts colliding points onto successive rows", () => {
    expect(stackRows([100, 105, 110], 20)).toEqual([0, 1, 2]);
  });

  it("reuses the base row once there is horizontal room", () => {
    expect(stackRows([100, 105, 200], 20)).toEqual([0, 1, 0]);
  });

  it("preserves input order in the result", () => {
    const rows = stackRows([200, 100, 205], 20);
    expect(rows[1]).toBe(0);
    expect(rows[0]).toBe(0);
    expect(rows[2]).toBe(1);
  });
});
