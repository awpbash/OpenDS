import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  loadModel,
  sampleIndex,
  softmaxWithTemperature,
  topK,
  type ForwardResult,
  type TinyTransformer,
} from "@opends/inference";

const TOP_K = 8;
const GENERATE_CHARS = 60;
const GENERATE_DELAY_MS = 45;
const MAX_INPUT_CHARS = 500;

/**
 * Learning question: how does a transformer turn the text so far into a
 * probability distribution over what comes next, and where does it look
 * while doing it?
 *
 * Control: edit the text, adjust the temperature, or let the model write.
 * Feedback: next-character probabilities and the attention heatmap update
 * live. Insight: prediction is a distribution, not an answer, and attention
 * concentrates on the parts of the context that matter.
 */
export function TransformerPredictor({
  modelUrl = "/models/tiny-shakespeare",
}: {
  modelUrl?: string;
}) {
  const [model, setModel] = useState<TinyTransformer | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [text, setText] = useState("ROMEO: what light through");
  const [temperature, setTemperature] = useState(0.8);
  const [result, setResult] = useState<ForwardResult | null>(null);
  const [layer, setLayer] = useState<number | null>(null);
  const [writing, setWriting] = useState(false);

  const writingRef = useRef(false);
  const textRef = useRef(text);
  const temperatureRef = useRef(temperature);
  textRef.current = text;
  temperatureRef.current = temperature;

  const headingId = useId();
  const sliderId = useId();

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    loadModel(modelUrl)
      .then((loaded) => {
        if (cancelled) return;
        setModel(loaded);
        setLayer(loaded.config.nLayer - 1);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("The model file could not be loaded.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [modelUrl, loadAttempt]);

  // Recompute the forward pass shortly after typing stops. While the model
  // is writing, the generation loop sets the result itself.
  useEffect(() => {
    if (!model || writingRef.current) return;
    const ids = model.encode(text);
    if (ids.length === 0) {
      setResult(null);
      return;
    }
    const handle = setTimeout(() => setResult(model.forward(ids)), 80);
    return () => clearTimeout(handle);
  }, [model, text]);

  useEffect(() => {
    return () => {
      writingRef.current = false;
    };
  }, []);

  const probs = useMemo(
    () => (result ? softmaxWithTemperature(result.logits, temperature) : null),
    [result, temperature],
  );
  const top = useMemo(
    () => (probs && model ? topK(probs, TOP_K, model.chars) : []),
    [probs, model],
  );

  const contextIds = useMemo(
    () => (model ? model.encode(text).slice(-model.config.blockSize) : []),
    [model, text],
  );

  const attentionWeights = useMemo(() => {
    if (!result || layer === null) return null;
    const heads = result.attention[layer];
    if (!heads || heads[0]?.length !== contextIds.length) return null;
    const averaged = new Array<number>(contextIds.length).fill(0);
    for (const head of heads) {
      for (let i = 0; i < head.length; i++) averaged[i] += head[i];
    }
    let max = 0;
    for (let i = 0; i < averaged.length; i++) {
      averaged[i] /= heads.length;
      if (averaged[i] > max) max = averaged[i];
    }
    return { averaged, max };
  }, [result, layer, contextIds]);

  const handleInput = (value: string) => {
    if (!model || writing) return;
    setText(model.sanitize(value).slice(0, MAX_INPUT_CHARS));
  };

  const write = () => {
    if (!model || writing) return;
    setWriting(true);
    writingRef.current = true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const step = (remaining: number) => {
      if (!writingRef.current || remaining === 0) {
        writingRef.current = false;
        setWriting(false);
        return;
      }
      const ids = model.encode(textRef.current);
      if (ids.length === 0) {
        writingRef.current = false;
        setWriting(false);
        return;
      }
      const forward = model.forward(ids);
      setResult(forward);
      const distribution = softmaxWithTemperature(
        forward.logits,
        temperatureRef.current,
      );
      const nextId = sampleIndex(distribution, Math.random());
      setText((textRef.current + model.chars[nextId]).slice(-MAX_INPUT_CHARS));
      if (reduced) {
        step(remaining - 1);
      } else {
        setTimeout(() => step(remaining - 1), GENERATE_DELAY_MS);
      }
    };
    step(GENERATE_CHARS);
  };

  const stop = () => {
    writingRef.current = false;
    setWriting(false);
  };

  const reset = () => {
    stop();
    setText("ROMEO: what light through");
    setTemperature(0.8);
  };

  if (loadError) {
    return (
      <WidgetShell headingId={headingId}>
        <p className="mt-3 text-sm text-ink-muted">{loadError}</p>
        <button
          type="button"
          onClick={() => setLoadAttempt((n) => n + 1)}
          className="mt-3 rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent"
        >
          Try again
        </button>
      </WidgetShell>
    );
  }

  if (!model) {
    return (
      <WidgetShell headingId={headingId}>
        <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
          Loading the tiny model, about 1.4 MB. It runs entirely in your
          browser.
        </p>
      </WidgetShell>
    );
  }

  const topPrediction = top[0];

  return (
    <WidgetShell headingId={headingId}>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Edit the text and watch the model bet on the next character. Or press
        write and watch it think out loud.
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor={`${headingId}-input`} className="sr-only">
            Text for the model to continue
          </label>
          <textarea
            id={`${headingId}-input`}
            value={text}
            onChange={(event) => handleInput(event.target.value)}
            readOnly={writing}
            rows={4}
            spellCheck={false}
            className="w-full resize-y rounded border border-hairline bg-paper p-3 font-mono text-sm leading-relaxed text-ink focus:border-accent focus:outline-none"
          />

          <div className="mt-3">
            <label
              htmlFor={sliderId}
              className="flex items-baseline justify-between text-sm text-ink-muted"
            >
              <span>Temperature</span>
              <span className="font-mono text-ink">
                {temperature.toFixed(2)}
              </span>
            </label>
            <input
              id={sliderId}
              type="range"
              min={0.2}
              max={2}
              step={0.05}
              value={temperature}
              onChange={(event) => setTemperature(Number(event.target.value))}
              className="mt-1 w-full accent-(--accent)"
            />
            <p className="mt-1 text-xs text-ink-faint">
              Low sticks to the safest bet. High takes risks.
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={writing ? stop : write}
              disabled={!result && !writing}
              className="rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {writing ? "Stop" : `Write ${GENERATE_CHARS} characters`}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm text-ink-muted" aria-live="polite">
            {topPrediction ? (
              <>
                Most likely next character:{" "}
                <strong className="font-mono text-ink">
                  {displayChar(topPrediction.char)}
                </strong>{" "}
                at {(topPrediction.p * 100).toFixed(0)}%
              </>
            ) : (
              "Type something for the model to continue."
            )}
          </p>
          <ol
            className="mt-2 space-y-1"
            aria-label="Next character probabilities"
          >
            {top.map((candidate) => (
              <li key={candidate.id} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-center font-mono text-sm text-ink">
                  {displayChar(candidate.char)}
                </span>
                <span className="h-4 min-w-0 flex-1 overflow-hidden rounded-sm border border-hairline bg-paper">
                  <span
                    className="block h-full bg-accent/70 transition-[width] duration-150 motion-reduce:transition-none"
                    style={{ width: `${Math.max(candidate.p * 100, 0.5)}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right font-mono text-xs text-ink-muted tabular-nums">
                  {(candidate.p * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {attentionWeights && layer !== null && (
        <div className="mt-5 border-t border-hairline pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-ink">
              Where the model is looking
            </h4>
            <div
              role="group"
              aria-label="Attention layer"
              className="flex gap-1"
            >
              {Array.from({ length: model.config.nLayer }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={layer === i}
                  onClick={() => setLayer(i)}
                  className={`rounded border px-2 py-1 text-xs ${
                    layer === i
                      ? "border-accent text-accent"
                      : "border-hairline text-ink-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  Layer {i + 1}
                </button>
              ))}
            </div>
          </div>
          <p
            className="mt-2 rounded border border-hairline bg-paper p-3 font-mono text-sm leading-loose break-all text-ink"
            aria-hidden="true"
          >
            {contextIds.map((id, position) => {
              const strength =
                attentionWeights.max > 0
                  ? attentionWeights.averaged[position] / attentionWeights.max
                  : 0;
              return (
                <span
                  key={position}
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--accent) ${Math.round(strength * 60)}%, transparent)`,
                  }}
                >
                  {model.chars[id] === "\n" ? "⏎" : model.chars[id]}
                </span>
              );
            })}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-faint">
            Darker characters get more attention, averaged over this layer's
            heads, when the model predicts what comes after the last character.
            The model only sees the last {model.config.blockSize} characters.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        This is a deliberately tiny transformer:{" "}
        {Math.round(model.meta.paramCount / 1000)}k parameters trained on
        Shakespeare's plays, about 60 million times smaller than a modern
        assistant. It learned spelling, common words, and the shape of a script,
        not meaning. Everything runs locally in your browser.
      </p>
    </WidgetShell>
  );
}

function WidgetShell({
  headingId,
  children,
}: {
  headingId: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className="rounded border border-hairline bg-surface/40 p-4 font-sans sm:p-5"
    >
      <h3
        id={headingId}
        className="text-sm font-semibold tracking-wide text-ink-muted uppercase"
      >
        Explore: a tiny transformer predicts the next character
      </h3>
      {children}
    </section>
  );
}

function displayChar(ch: string): string {
  if (ch === " ") return "␣";
  if (ch === "\n") return "⏎";
  return ch;
}
