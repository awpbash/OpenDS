import { useEffect, useId, useMemo, useRef, useState } from "react";
import { formatSGD } from "./meanMedian";
import {
  COL,
  filterRows,
  NO_FILTER,
  sortRows,
  summarize,
  type ResaleDataset,
  type ResaleFilter,
  type SortOrder,
} from "./resaleData";

const DEFAULT_SRC = "/data/concepts/mean-median-mode/resale-2026-h1.json";

/** Rows rendered per chunk as the reader scrolls the table window. */
const PAGE = 100;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthLabel(raw: string): string {
  const [year, month] = raw.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

function titleCase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/(^|[\s/])[a-z]/g, (match) => match.toUpperCase());
}

function flatTypeLabel(raw: string): string {
  if (/^\d/.test(raw)) return raw.replace(" ROOM", "-room");
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

/**
 * Learning question: what do 12,243 recorded observations actually look
 * like, and what happens to "typical" when you slice them?
 *
 * Control: filter the real transactions by town, flat type, and month, and
 * reorder them by price. Feedback: the table and the summary row (count,
 * mean, median, most common flat type) recompute instantly. Insight: mean,
 * median, and mode are one-number answers to a question the reader can now
 * ask of any slice, and the answers move apart as slices get more skewed.
 */
export function ResaleDatasetExplorer({ src = DEFAULT_SRC }: { src?: string }) {
  const [dataset, setDataset] = useState<ResaleDataset | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<ResaleFilter>(NO_FILTER);
  const [order, setOrder] = useState<SortOrder>("latest");
  const [visible, setVisible] = useState(PAGE);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headingId = useId();
  const townId = useId();
  const flatTypeId = useId();
  const monthId = useId();
  const orderId = useId();

  useEffect(() => {
    const controller = new AbortController();
    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload: ResaleDataset) => {
        if (!Array.isArray(payload.rows)) throw new Error("malformed payload");
        setDataset(payload);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setFailed(true);
        }
      });
    return () => controller.abort();
  }, [src]);

  const filtered = useMemo(
    () => (dataset ? filterRows(dataset.rows, filter) : []),
    [dataset, filter],
  );
  const summary = useMemo(() => summarize(filtered), [filtered]);
  const sorted = useMemo(() => sortRows(filtered, order), [filtered, order]);

  const setFilterPart = (part: Partial<ResaleFilter>) => {
    setFilter((current) => ({ ...current, ...part }));
    setVisible(PAGE);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  // The table lives in a fixed-height window. Nearing its bottom renders
  // the next chunk, so browsing feels continuous without growing the page.
  const handleTableScroll = () => {
    const window_ = scrollRef.current;
    if (!window_) return;
    const nearBottom =
      window_.scrollTop + window_.clientHeight >= window_.scrollHeight - 240;
    if (nearBottom) {
      setVisible((count) => (count < sorted.length ? count + PAGE : count));
    }
  };

  const isFiltered =
    filter.town !== null || filter.flatType !== null || filter.month !== null;

  const parseIndex = (raw: string): number | null =>
    raw === "" ? null : Number(raw);

  const skewSentence = () => {
    if (!summary || summary.n < 2) return null;
    const pct = ((summary.mean - summary.median) / summary.median) * 100;
    if (Math.abs(pct) < 0.5)
      return "In this slice the mean and median nearly agree, so the prices are close to symmetric around the middle.";
    if (pct > 0)
      return `In this slice half the flats sold for ${formatSGD(summary.median)} or less, yet the mean is ${pct.toFixed(1)}% higher, pulled up by the most expensive sales.`;
    return `In this slice the mean sits ${Math.abs(pct).toFixed(1)}% below the median, so the tail of unusual prices points downward here.`;
  };

  if (failed) {
    return (
      <section className="rounded border border-hairline bg-surface/40 p-4 font-sans text-sm text-ink-muted sm:p-5">
        The dataset could not be loaded right now. The numbers quoted in the
        article come from this same snapshot: 12,243 HDB resale transactions,
        January to June 2026, from data.gov.sg.
      </section>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className="rounded border border-hairline bg-surface/40 p-4 font-sans sm:p-5"
    >
      <h3
        id={headingId}
        className="text-sm font-semibold tracking-wide text-ink-muted uppercase"
      >
        Explore: the dataset itself
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Every number in this article comes from the real transactions below.
        Slice them by town, flat type, or month, and watch all three answers to
        &ldquo;what is typical?&rdquo; recompute.
      </p>

      {!dataset ? (
        <p className="mt-4 text-sm text-ink-faint" aria-live="polite">
          Loading 12,243 real transactions&hellip;
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              {
                id: townId,
                label: "Town",
                value: filter.town,
                options: dataset.towns.map(titleCase),
                set: (index: number | null) => setFilterPart({ town: index }),
              },
              {
                id: flatTypeId,
                label: "Flat type",
                value: filter.flatType,
                options: dataset.flatTypes.map(flatTypeLabel),
                set: (index: number | null) =>
                  setFilterPart({ flatType: index }),
              },
              {
                id: monthId,
                label: "Month",
                value: filter.month,
                options: dataset.months.map(monthLabel),
                set: (index: number | null) => setFilterPart({ month: index }),
              },
            ].map((control) => (
              <label
                key={control.id}
                htmlFor={control.id}
                className="flex flex-col gap-1 text-xs text-ink-faint"
              >
                {control.label}
                <select
                  id={control.id}
                  value={control.value ?? ""}
                  onChange={(event) =>
                    control.set(parseIndex(event.target.value))
                  }
                  className="rounded border border-hairline bg-paper px-2 py-1.5 text-sm text-ink"
                >
                  <option value="">All</option>
                  {control.options.map((option, index) => (
                    <option key={option} value={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label
              htmlFor={orderId}
              className="flex flex-col gap-1 text-xs text-ink-faint"
            >
              Order
              <select
                id={orderId}
                value={order}
                onChange={(event) => {
                  setOrder(event.target.value as SortOrder);
                  setVisible(PAGE);
                  scrollRef.current?.scrollTo({ top: 0 });
                }}
                className="rounded border border-hairline bg-paper px-2 py-1.5 text-sm text-ink"
              >
                <option value="latest">Latest first</option>
                <option value="price-desc">Price, high to low</option>
                <option value="price-asc">Price, low to high</option>
              </select>
            </label>
            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setFilter(NO_FILTER);
                  setVisible(PAGE);
                }}
                className="self-end rounded border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:border-accent hover:text-accent"
              >
                Reset filters
              </button>
            )}
          </div>

          <dl
            className="mt-4 grid grid-cols-2 gap-3 border-y border-hairline py-3 sm:grid-cols-4"
            aria-live="polite"
          >
            <div>
              <dt className="text-xs text-ink-faint">Sales</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink tabular-nums">
                {summary ? summary.n.toLocaleString("en-SG") : 0}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Mean price</dt>
              <dd className="mt-0.5 text-lg font-semibold text-accent tabular-nums">
                {summary ? formatSGD(summary.mean) : "–"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Median price</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink tabular-nums">
                {summary ? formatSGD(summary.median) : "–"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Most common</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink">
                {summary?.modalFlatType
                  ? `${flatTypeLabel(dataset.flatTypes[summary.modalFlatType.index])} (${Math.round(summary.modalFlatType.share * 100)}%)`
                  : "–"}
              </dd>
            </div>
          </dl>

          {summary ? (
            <>
              <div
                ref={scrollRef}
                onScroll={handleTableScroll}
                role="region"
                aria-label="Matching transactions, scrollable table"
                tabIndex={0}
                className="mt-3 max-h-96 overflow-x-auto overflow-y-auto overscroll-contain rounded border border-hairline bg-paper focus:outline-2 focus:outline-accent"
              >
                <table className="w-full border-separate border-spacing-0 text-sm">
                  <caption className="sr-only">
                    HDB resale transactions matching the current filters
                  </caption>
                  <thead>
                    <tr className="text-left text-ink-muted">
                      <th
                        scope="col"
                        className="sticky top-0 hidden border-b border-ink-faint bg-paper py-2 pr-3 pl-3 font-semibold sm:table-cell"
                      >
                        Month
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-b border-ink-faint bg-paper py-2 pr-3 pl-3 font-semibold sm:pl-0"
                      >
                        Town
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-b border-ink-faint bg-paper py-2 pr-3 font-semibold"
                      >
                        Flat type
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 hidden border-b border-ink-faint bg-paper py-2 pr-3 font-semibold sm:table-cell"
                      >
                        Storey
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 hidden border-b border-ink-faint bg-paper py-2 pr-3 font-semibold sm:table-cell"
                      >
                        Area
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-b border-ink-faint bg-paper py-2 pr-3 text-right font-semibold"
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.slice(0, visible).map((row, index) => (
                      <tr
                        key={`${index}-${row[COL.price]}`}
                        className="text-ink-muted"
                      >
                        <td className="hidden border-b border-hairline py-1.5 pr-3 pl-3 whitespace-nowrap sm:table-cell">
                          {monthLabel(dataset.months[row[COL.month]])}
                        </td>
                        <td className="border-b border-hairline py-1.5 pr-3 pl-3 sm:pl-0">
                          {titleCase(dataset.towns[row[COL.town]])}
                        </td>
                        <td className="border-b border-hairline py-1.5 pr-3 whitespace-nowrap">
                          {flatTypeLabel(dataset.flatTypes[row[COL.flatType]])}
                        </td>
                        <td className="hidden border-b border-hairline py-1.5 pr-3 whitespace-nowrap sm:table-cell">
                          {dataset.storeys[row[COL.storey]].toLowerCase()}
                        </td>
                        <td className="hidden border-b border-hairline py-1.5 pr-3 whitespace-nowrap sm:table-cell">
                          {row[COL.area]} m²
                        </td>
                        <td className="border-b border-hairline py-1.5 pr-3 text-right whitespace-nowrap text-ink tabular-nums">
                          {formatSGD(row[COL.price])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-2 text-sm text-ink-faint">
                {sorted.length.toLocaleString("en-SG")} sales in this slice,
                scroll the window to browse them.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {skewSentence()}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-ink-faint">
              No sales match this combination. HDB towns do not stock every flat
              type, which is itself a lesson about recorded data. Loosen a
              filter to continue.
            </p>
          )}

          <p className="mt-3 text-xs text-ink-faint">{dataset.source}.</p>
        </>
      )}
    </section>
  );
}
