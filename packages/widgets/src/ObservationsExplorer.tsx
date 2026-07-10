import { useId, useRef, useState } from "react";
import {
  addObservation,
  DEFAULT_OBSERVATIONS,
  DOMAIN,
  fromPlotCoords,
  MAX_OBSERVATIONS,
  removeObservation,
  toPlotCoords,
  type Observation,
} from "./observations";

const PLOT_WIDTH = 560;
const PLOT_HEIGHT = 320;
const PLOT_PADDING = 40;

/**
 * Learning question: how do individual observations become the rows of a
 * table and the points of a plot, at the same time?
 *
 * Control: tap the plot to record a new observation, tap a row or point to
 * select it. Feedback: table, notation, and plot stay in sync. Insight: a
 * dataset is one collection seen through three equivalent views.
 */
export function ObservationsExplorer() {
  const [observations, setObservations] =
    useState<Observation[]>(DEFAULT_OBSERVATIONS);
  const [selected, setSelected] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const headingId = useId();

  const full = observations.length >= MAX_OBSERVATIONS;
  const selectedObservation =
    observations.find((o) => o.label === selected) ?? null;
  const selectedIndex = selectedObservation
    ? observations.indexOf(selectedObservation) + 1
    : null;

  const handlePlotClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (full) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PLOT_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * PLOT_HEIGHT;
    const { hoursSlept, examScore } = fromPlotCoords(
      x,
      y,
      PLOT_WIDTH,
      PLOT_HEIGHT,
      PLOT_PADDING,
    );
    const next = addObservation(observations, hoursSlept, examScore);
    setObservations(next);
    setSelected(next[next.length - 1]?.label ?? null);
  };

  const addExample = () => {
    const hours =
      DOMAIN.hours.min +
      2 +
      ((observations.length * 1.3) % (DOMAIN.hours.max - 4));
    const score = 45 + ((observations.length * 17) % 50);
    const next = addObservation(observations, hours, score);
    setObservations(next);
    setSelected(next[next.length - 1]?.label ?? null);
  };

  const removeSelected = () => {
    if (!selected) return;
    setObservations(removeObservation(observations, selected));
    setSelected(null);
  };

  const reset = () => {
    setObservations(DEFAULT_OBSERVATIONS);
    setSelected(null);
  };

  const toggleSelect = (label: string) => {
    setSelected((current) => (current === label ? null : label));
  };

  return (
    <section
      aria-labelledby={headingId}
      className="rounded border border-hairline bg-surface/40 p-4 font-sans sm:p-5"
    >
      <h3
        id={headingId}
        className="text-sm font-semibold tracking-wide text-ink-muted uppercase"
      >
        Explore: observations become a dataset
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Tap anywhere on the plot to record a new observation. Tap a point or a
        row to see it in every view at once.
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
            role="img"
            aria-label={`Scatter plot of exam score against hours slept with ${observations.length} observations`}
            onClick={handlePlotClick}
            className={`w-full select-none rounded border border-hairline bg-paper ${full ? "" : "cursor-crosshair"}`}
          >
            <line
              x1={PLOT_PADDING}
              y1={PLOT_HEIGHT - PLOT_PADDING}
              x2={PLOT_WIDTH - PLOT_PADDING}
              y2={PLOT_HEIGHT - PLOT_PADDING}
              stroke="var(--ink-faint)"
              strokeWidth="1"
            />
            <line
              x1={PLOT_PADDING}
              y1={PLOT_PADDING}
              x2={PLOT_PADDING}
              y2={PLOT_HEIGHT - PLOT_PADDING}
              stroke="var(--ink-faint)"
              strokeWidth="1"
            />
            <text
              x={PLOT_WIDTH / 2}
              y={PLOT_HEIGHT - 10}
              textAnchor="middle"
              fontSize="13"
              fill="var(--ink-muted)"
            >
              hours slept
            </text>
            <text
              x={14}
              y={PLOT_HEIGHT / 2}
              textAnchor="middle"
              fontSize="13"
              fill="var(--ink-muted)"
              transform={`rotate(-90 14 ${PLOT_HEIGHT / 2})`}
            >
              exam score
            </text>

            {observations.map((observation) => {
              const { x, y } = toPlotCoords(
                observation,
                PLOT_WIDTH,
                PLOT_HEIGHT,
                PLOT_PADDING,
              );
              const isSelected = observation.label === selected;
              return (
                <g
                  key={observation.label}
                  role="button"
                  aria-label={`Observation ${observation.label}: ${observation.hoursSlept} hours, score ${observation.examScore}`}
                  aria-pressed={isSelected}
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleSelect(observation.label);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleSelect(observation.label);
                    }
                  }}
                  className="cursor-pointer focus:outline-2 focus:outline-accent"
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill={isSelected ? "var(--accent)" : "var(--paper)"}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill={isSelected ? "var(--paper)" : "var(--ink-muted)"}
                  >
                    {observation.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addExample}
              disabled={full}
              className="rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add example observation
            </button>
            <button
              type="button"
              onClick={removeSelected}
              disabled={!selected}
              className="rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove selected
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent"
            >
              Reset
            </button>
          </div>
          {full && (
            <p className="mt-2 text-sm text-ink-faint">
              The dataset is full at {MAX_OBSERVATIONS} observations. Remove one
              to add more.
            </p>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm text-ink-muted" aria-live="polite">
            <em className="font-serif">D</em> = {"{"}(x<sub>i</sub>, y
            <sub>i</sub>){"}"}
            <sub>i = 1..n</sub> with n ={" "}
            <strong className="text-ink">{observations.length}</strong>
            {selectedObservation && selectedIndex !== null && (
              <span>
                {" "}
                · selected: (x<sub>{selectedIndex}</sub>, y
                <sub>{selectedIndex}</sub>) = ({selectedObservation.hoursSlept},{" "}
                {selectedObservation.examScore})
              </span>
            )}
          </p>

          <table className="mt-3 w-full border-collapse overflow-x-auto text-sm">
            <caption className="sr-only">
              The same observations as table rows: student, hours slept, exam
              score
            </caption>
            <thead>
              <tr className="border-b border-ink-faint text-left">
                <th scope="col" className="py-1.5 pr-4 font-semibold">
                  student
                </th>
                <th scope="col" className="py-1.5 pr-4 font-semibold">
                  hours_slept
                </th>
                <th scope="col" className="py-1.5 font-semibold">
                  exam_score
                </th>
              </tr>
            </thead>
            <tbody>
              {observations.map((observation) => {
                const isSelected = observation.label === selected;
                return (
                  <tr
                    key={observation.label}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleSelect(observation.label)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleSelect(observation.label);
                      }
                    }}
                    className={`cursor-pointer border-b border-hairline focus:outline-2 focus:outline-accent ${
                      isSelected ? "bg-surface text-ink" : "text-ink-muted"
                    }`}
                  >
                    <td className="py-1.5 pr-4">{observation.label}</td>
                    <td className="py-1.5 pr-4">{observation.hoursSlept}</td>
                    <td className="py-1.5">{observation.examScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            Every tap creates one row and one point, because they are the same
            thing: a recorded observation. The notation only counts them.
          </p>
        </div>
      </div>
    </section>
  );
}
