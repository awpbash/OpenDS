import { useId, useRef, useState } from "react";
import {
  addPoint,
  DEFAULT_POINTS,
  DOMAIN,
  formatSGD,
  MAX_POINTS,
  mean,
  median,
  movePoint,
  OUTLIER_VALUE,
  removePoint,
  stackRows,
  VALUE_STEP,
  type PricePoint,
} from "./meanMedian";

const WIDTH = 640;
const HEIGHT = 264;
const PADDING = 44;
const BASELINE_Y = 200;
const DOT_RADIUS = 9;
const ROW_HEIGHT = 22;
const KEYBOARD_STEP = 10 * VALUE_STEP;

const AXIS_TICKS = [200_000, 600_000, 1_000_000, 1_400_000, 1_800_000];

function toX(value: number): number {
  const span = DOMAIN.max - DOMAIN.min;
  return PADDING + ((value - DOMAIN.min) / span) * (WIDTH - 2 * PADDING);
}

function fromX(x: number): number {
  const span = DOMAIN.max - DOMAIN.min;
  return DOMAIN.min + ((x - PADDING) / (WIDTH - 2 * PADDING)) * span;
}

function tickLabel(value: number): string {
  return value >= 1_000_000
    ? `$${(value / 1_000_000).toFixed(1)}M`
    : `$${value / 1_000}k`;
}

interface MoveReport {
  dMean: number;
  dMedian: number;
}

/**
 * Learning question: why does one extreme value drag the mean but barely
 * touch the median?
 *
 * Control: drag real sale prices along a number line, add or remove an
 * outlier. Feedback: mean and median markers move live, with the size of
 * each shift reported in words. Insight: every point owns a share of the
 * mean, but the median listens only to rank order.
 */
export function MeanMedianOutlierExplorer() {
  const [points, setPoints] = useState<PricePoint[]>(DEFAULT_POINTS);
  const [selected, setSelected] = useState<number | null>(null);
  const [lastMove, setLastMove] = useState<MoveReport | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragId = useRef<number | null>(null);
  const baseline = useRef<{ mean: number; median: number } | null>(null);
  const headingId = useId();

  const values = points.map((point) => point.value);
  const currentMean = mean(values);
  const currentMedian = median(values);
  const full = points.length >= MAX_POINTS;

  const rows = stackRows(
    points.map((point) => toX(point.value)),
    DOT_RADIUS * 2 + 3,
  );

  const markBaseline = () => {
    baseline.current = { mean: currentMean, median: currentMedian };
  };

  const applyMove = (next: PricePoint[]) => {
    setPoints(next);
    if (baseline.current) {
      const nextValues = next.map((point) => point.value);
      setLastMove({
        dMean: mean(nextValues) - baseline.current.mean,
        dMedian: median(nextValues) - baseline.current.median,
      });
    }
  };

  const valueAtPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * WIDTH;
    return fromX(x);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragId.current === null) return;
    const value = valueAtPointer(event);
    if (value === null) return;
    applyMove(movePoint(points, dragId.current, value));
  };

  const endDrag = () => {
    dragId.current = null;
  };

  const startDrag = (id: number, event: React.PointerEvent) => {
    setSelected(id);
    dragId.current = id;
    markBaseline();
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const nudge = (id: number, direction: 1 | -1) => {
    const point = points.find((candidate) => candidate.id === id);
    if (!point) return;
    if (!baseline.current) markBaseline();
    applyMove(movePoint(points, id, point.value + direction * KEYBOARD_STEP));
  };

  const addOutlier = () => {
    markBaseline();
    const next = addPoint(points, OUTLIER_VALUE);
    applyMove(next);
    setSelected(next[next.length - 1]?.id ?? null);
  };

  const removeSelected = () => {
    if (selected === null) return;
    markBaseline();
    applyMove(removePoint(points, selected));
    setSelected(null);
  };

  const reset = () => {
    setPoints(DEFAULT_POINTS);
    setSelected(null);
    setLastMove(null);
    baseline.current = null;
  };

  const meanX = toX(currentMean);
  const medianX = toX(currentMedian);
  const clampLabelX = (x: number) => Math.min(WIDTH - 76, Math.max(76, x));
  const selectedPoint = points.find((point) => point.id === selected) ?? null;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded border border-hairline bg-surface/40 p-4 font-sans sm:p-5"
    >
      <h3
        id={headingId}
        className="text-sm font-semibold tracking-wide text-ink-muted uppercase"
      >
        Explore: drag a sale, watch the mean chase it
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Each dot is a real 3-room resale in Geylang, April 2026. Drag one, or
        use the arrow keys after selecting it. Watch how far each summary moves
        in response.
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Number line of ${points.length} sale prices with mean ${formatSGD(currentMean)} and median ${formatSGD(currentMedian)}`}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="mt-4 w-full rounded border border-hairline bg-paper select-none"
      >
        {/* mean and median markers, labels pinned to two fixed lanes */}
        <line
          x1={meanX}
          y1={30}
          x2={meanX}
          y2={BASELINE_Y}
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <text
          x={clampLabelX(meanX)}
          y={20}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="var(--accent)"
        >
          mean {formatSGD(currentMean)}
        </text>
        <line
          x1={medianX}
          y1={52}
          x2={medianX}
          y2={BASELINE_Y}
          stroke="var(--ink-muted)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <text
          x={clampLabelX(medianX)}
          y={44}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="var(--ink-muted)"
        >
          median {formatSGD(currentMedian)}
        </text>

        {/* number line */}
        <line
          x1={PADDING}
          y1={BASELINE_Y}
          x2={WIDTH - PADDING}
          y2={BASELINE_Y}
          stroke="var(--ink-faint)"
          strokeWidth="1"
        />
        {AXIS_TICKS.map((tick) => (
          <g key={tick}>
            <line
              x1={toX(tick)}
              y1={BASELINE_Y}
              x2={toX(tick)}
              y2={BASELINE_Y + 6}
              stroke="var(--ink-faint)"
              strokeWidth="1"
            />
            <text
              x={toX(tick)}
              y={BASELINE_Y + 22}
              textAnchor="middle"
              fontSize="12"
              fill="var(--ink-faint)"
            >
              {tickLabel(tick)}
            </text>
          </g>
        ))}

        {/* draggable sales */}
        {points.map((point, index) => {
          const x = toX(point.value);
          const y = BASELINE_Y - 16 - rows[index] * ROW_HEIGHT;
          const isSelected = point.id === selected;
          return (
            <g
              key={point.id}
              role="slider"
              aria-label={`Sale ${index + 1}`}
              aria-valuemin={DOMAIN.min}
              aria-valuemax={DOMAIN.max}
              aria-valuenow={point.value}
              aria-valuetext={formatSGD(point.value)}
              tabIndex={0}
              style={{ touchAction: "none" }}
              onPointerDown={(event) => startDrag(point.id, event)}
              onFocus={() => {
                setSelected(point.id);
                markBaseline();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                  event.preventDefault();
                  nudge(point.id, 1);
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                  event.preventDefault();
                  nudge(point.id, -1);
                }
              }}
              className="cursor-grab focus:outline-2 focus:outline-accent"
            >
              {/* oversized invisible hit area for touch */}
              <circle cx={x} cy={y} r="16" fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={DOT_RADIUS}
                fill={isSelected ? "var(--accent)" : "var(--paper)"}
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              {isSelected && (
                <text
                  x={Math.min(WIDTH - 40, Math.max(40, x))}
                  y={y - 16}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--ink-muted)"
                >
                  {formatSGD(point.value)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addOutlier}
          disabled={full}
          className="rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add a $1.6M sale
        </button>
        <button
          type="button"
          onClick={removeSelected}
          disabled={selected === null}
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
          The plot is full at {MAX_POINTS} sales. Remove one to add more.
        </p>
      )}

      <p
        className="mt-3 text-sm leading-relaxed text-ink-muted"
        aria-live="polite"
      >
        {lastMove ? (
          <>
            That change moved the <strong className="text-ink">mean</strong> by{" "}
            {lastMove.dMean >= 0 ? "+" : "−"}
            {formatSGD(Math.abs(lastMove.dMean))} and the{" "}
            <strong className="text-ink">median</strong> by{" "}
            {lastMove.dMedian >= 0 ? "+" : "−"}
            {formatSGD(Math.abs(lastMove.dMedian))}.
            {Math.abs(lastMove.dMedian) * 5 < Math.abs(lastMove.dMean) &&
              " The mean absorbed almost all of it."}
          </>
        ) : (
          <>
            Gap right now: the mean sits{" "}
            <strong className="text-ink">
              {formatSGD(currentMean - currentMedian)}
            </strong>{" "}
            above the median.
            {selectedPoint === null && " Try dragging the highest sale."}
          </>
        )}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-ink-faint">
        Every dot owns an equal share of the mean, so moving one dot always
        shifts the mean by exactly the drag distance divided by {points.length}.
        The median only cares which dot is in the middle, so the same drag
        usually moves it barely or not at all.
      </p>
    </section>
  );
}
