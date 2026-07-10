import { describe, expect, it } from "vitest";
import {
  addObservation,
  DEFAULT_OBSERVATIONS,
  DOMAIN,
  fromPlotCoords,
  MAX_OBSERVATIONS,
  nextLabel,
  removeObservation,
  toPlotCoords,
} from "./observations";

describe("nextLabel", () => {
  it("continues the alphabet after the defaults", () => {
    expect(nextLabel(DEFAULT_OBSERVATIONS)).toBe("D");
  });

  it("fills gaps left by removed observations", () => {
    const observations = removeObservation(DEFAULT_OBSERVATIONS, "B");
    expect(nextLabel(observations)).toBe("B");
  });

  it("starts at A for an empty dataset", () => {
    expect(nextLabel([])).toBe("A");
  });
});

describe("addObservation", () => {
  it("adds a labelled, rounded observation", () => {
    const observations = addObservation([], 7.234, 88.6);
    expect(observations).toHaveLength(1);
    expect(observations[0]).toEqual({
      label: "A",
      hoursSlept: 7.2,
      examScore: 89,
    });
  });

  it("clamps values to the domain", () => {
    const observations = addObservation([], 99, -50);
    expect(observations[0].hoursSlept).toBe(DOMAIN.hours.max);
    expect(observations[0].examScore).toBe(DOMAIN.score.min);
  });

  it("does not grow past the maximum", () => {
    let observations = DEFAULT_OBSERVATIONS;
    for (let i = 0; i < MAX_OBSERVATIONS + 5; i += 1) {
      observations = addObservation(observations, 6, 70);
    }
    expect(observations).toHaveLength(MAX_OBSERVATIONS);
  });

  it("does not mutate the input list", () => {
    const before = [...DEFAULT_OBSERVATIONS];
    addObservation(DEFAULT_OBSERVATIONS, 6, 70);
    expect(DEFAULT_OBSERVATIONS).toEqual(before);
  });
});

describe("plot coordinate mapping", () => {
  const width = 560;
  const height = 320;
  const padding = 40;

  it("round-trips data values through plot coordinates", () => {
    const observation = { hoursSlept: 6.5, examScore: 74 };
    const { x, y } = toPlotCoords(observation, width, height, padding);
    const back = fromPlotCoords(x, y, width, height, padding);
    expect(back.hoursSlept).toBeCloseTo(6.5, 5);
    expect(back.examScore).toBeCloseTo(74, 5);
  });

  it("maps the domain corners to the plot corners", () => {
    const origin = toPlotCoords(
      { hoursSlept: DOMAIN.hours.min, examScore: DOMAIN.score.min },
      width,
      height,
      padding,
    );
    expect(origin).toEqual({ x: padding, y: height - padding });

    const top = toPlotCoords(
      { hoursSlept: DOMAIN.hours.max, examScore: DOMAIN.score.max },
      width,
      height,
      padding,
    );
    expect(top).toEqual({ x: width - padding, y: padding });
  });

  it("clamps clicks outside the plot area", () => {
    const outside = fromPlotCoords(0, height * 2, width, height, padding);
    expect(outside.hoursSlept).toBe(DOMAIN.hours.min);
    expect(outside.examScore).toBe(DOMAIN.score.min);
  });
});
