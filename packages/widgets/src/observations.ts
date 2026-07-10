/**
 * Core logic for the ObservationsExplorer widget, kept free of React and
 * presentation so it can be unit-tested directly.
 */

export interface Observation {
  label: string;
  hoursSlept: number;
  examScore: number;
}

export const DOMAIN = {
  hours: { min: 0, max: 12 },
  score: { min: 0, max: 100 },
} as const;

export const MAX_OBSERVATIONS = 12;

export const DEFAULT_OBSERVATIONS: Observation[] = [
  { label: "A", hoursSlept: 6.5, examScore: 74 },
  { label: "B", hoursSlept: 8.0, examScore: 81 },
  { label: "C", hoursSlept: 5.0, examScore: 62 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Next free single-letter label, starting after the highest one in use. */
export function nextLabel(observations: Observation[]): string {
  const used = new Set(observations.map((observation) => observation.label));
  for (let i = 0; i < 26; i += 1) {
    const candidate = String.fromCharCode(65 + i);
    if (!used.has(candidate)) return candidate;
  }
  return `Z${observations.length + 1}`;
}

/** Add an observation with clamped, rounded values. Full datasets stay unchanged. */
export function addObservation(
  observations: Observation[],
  hoursSlept: number,
  examScore: number,
): Observation[] {
  if (observations.length >= MAX_OBSERVATIONS) return observations;
  const observation: Observation = {
    label: nextLabel(observations),
    hoursSlept:
      Math.round(clamp(hoursSlept, DOMAIN.hours.min, DOMAIN.hours.max) * 10) /
      10,
    examScore: Math.round(clamp(examScore, DOMAIN.score.min, DOMAIN.score.max)),
  };
  return [...observations, observation];
}

export function removeObservation(
  observations: Observation[],
  label: string,
): Observation[] {
  return observations.filter((observation) => observation.label !== label);
}

/** Map an observation to SVG coordinates inside the padded plot area. */
export function toPlotCoords(
  observation: Pick<Observation, "hoursSlept" | "examScore">,
  width: number,
  height: number,
  padding: number,
): { x: number; y: number } {
  const spanX = DOMAIN.hours.max - DOMAIN.hours.min;
  const spanY = DOMAIN.score.max - DOMAIN.score.min;
  const x =
    padding +
    ((observation.hoursSlept - DOMAIN.hours.min) / spanX) *
      (width - 2 * padding);
  const y =
    height -
    padding -
    ((observation.examScore - DOMAIN.score.min) / spanY) *
      (height - 2 * padding);
  return { x, y };
}

/** Map SVG coordinates back to data values, clamped to the domain. */
export function fromPlotCoords(
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number,
): { hoursSlept: number; examScore: number } {
  const spanX = DOMAIN.hours.max - DOMAIN.hours.min;
  const spanY = DOMAIN.score.max - DOMAIN.score.min;
  const hoursSlept = clamp(
    DOMAIN.hours.min + ((x - padding) / (width - 2 * padding)) * spanX,
    DOMAIN.hours.min,
    DOMAIN.hours.max,
  );
  const examScore = clamp(
    DOMAIN.score.min +
      ((height - padding - y) / (height - 2 * padding)) * spanY,
    DOMAIN.score.min,
    DOMAIN.score.max,
  );
  return { hoursSlept, examScore };
}
