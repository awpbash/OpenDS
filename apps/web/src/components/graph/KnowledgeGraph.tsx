/**
 * Force-directed knowledge graph, Obsidian style: nodes drift into place,
 * hovering a node lights up its neighborhood, clicking a published node
 * opens the article. Colors come from the per-family CSS variables so both
 * themes work without code changes.
 *
 * Layout is physics only. The graph package owns the data; this component
 * never invents nodes or edges.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export interface GraphNodeInput {
  slug: string;
  title: string;
  family: string;
  /** draft | under-review | curated | planned */
  status: string;
}

export interface GraphEdgeInput {
  source: string;
  target: string;
}

interface Props {
  nodes: GraphNodeInput[];
  edges: GraphEdgeInput[];
  variant: "mini" | "full";
  /** Family display names, passed in so the client bundle stays lean. */
  familyLabels: Record<string, string>;
}

type SimNode = GraphNodeInput & SimulationNodeDatum;
type SimLink = SimulationLinkDatum<SimNode>;

const asNode = (end: SimLink["source"]): SimNode => end as SimNode;

/**
 * Home position of each family on the canvas, in world coordinates
 * (0,0 is the center). Nodes are pulled gently toward their family's
 * home, which partitions the map into visible territories: foundations
 * on the west, math to the south-west, the deep learning to LLM chain
 * running east. Cross-family prerequisites become the roads between
 * regions. Tune positions here, not in the forces.
 */
const FAMILY_ANCHORS: Record<string, { x: number; y: number }> = {
  foundations: { x: -410, y: -25 },
  "probability-statistics": { x: -230, y: -180 },
  "linear-algebra-optimization": { x: -215, y: 190 },
  "time-series": { x: -35, y: -285 },
  "machine-learning": { x: -20, y: 0 },
  "data-engineering": { x: -70, y: 285 },
  "recommender-systems": { x: 205, y: -240 },
  "deep-learning": { x: 205, y: 70 },
  "production-ml": { x: 180, y: 275 },
  nlp: { x: 385, y: -145 },
  "computer-vision": { x: 420, y: 240 },
  "llms-genai": { x: 430, y: 35 },
};

const anchorFor = (family: string, scale: number) => {
  const anchor = FAMILY_ANCHORS[family] ?? { x: 0, y: 0 };
  return { x: anchor.x * scale, y: anchor.y * scale };
};

/** Convex hull (Andrew's monotone chain) of settled node positions. */
function convexHull(points: [number, number][]): [number, number][] {
  if (points.length < 3) return points;
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (
    o: [number, number],
    a: [number, number],
    b: [number, number],
  ) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (list: [number, number][]) => {
    const hull: [number, number][] = [];
    for (const point of list) {
      while (
        hull.length >= 2 &&
        cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0
      ) {
        hull.pop();
      }
      hull.push(point);
    }
    hull.pop();
    return hull;
  };
  return [...build(sorted), ...build([...sorted].reverse())];
}

export default function KnowledgeGraph({
  nodes,
  edges,
  variant,
  familyLabels,
}: Props) {
  const full = variant === "full";
  const width = full ? 1060 : 340;
  const height = full ? 740 : 250;

  const svgRef = useRef<SVGSVGElement>(null);
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });

  // Anchor scale maps the shared FAMILY_ANCHORS layout onto each canvas.
  // The mini factor compensates for the wider full-map spread so the
  // mini graph keeps its original footprint.
  const anchorScale = full ? 1 : 0.29;

  const sim = useMemo(() => {
    const simNodes: SimNode[] = nodes.map((node) => ({ ...node }));
    const simLinks: SimLink[] = edges.map((edge) => ({ ...edge }));
    return {
      nodes: simNodes,
      links: simLinks,
      // Each node is pulled toward its family's home position, which is
      // what carves the map into territories. Links are kept weaker than
      // the anchors so cross-family prerequisites stretch between regions
      // instead of dragging the regions together.
      simulation: forceSimulation(simNodes)
        .force(
          "link",
          forceLink<SimNode, SimLink>(simLinks)
            .id((node) => node.slug)
            .distance(full ? 38 : 14)
            .strength(0.25),
        )
        .force("charge", forceManyBody().strength(full ? -60 : -10))
        .force("collide", forceCollide(full ? 13 : 5.5))
        .force(
          "x",
          forceX<SimNode>(
            (node) => anchorFor(node.family, anchorScale).x,
          ).strength(0.14),
        )
        .force(
          "y",
          forceY<SimNode>(
            (node) => anchorFor(node.family, anchorScale).y,
          ).strength(0.16),
        )
        .stop(),
    };
  }, [nodes, edges, full, anchorScale]);

  // Drive the simulation ourselves: an animation loop when motion is fine,
  // a single synchronous settle when the user prefers reduced motion.
  useEffect(() => {
    const { simulation } = sim;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      simulation.tick(300);
      setReady(true);
      setFrame((frame) => frame + 1);
      return;
    }
    setReady(true);
    let raf = 0;
    const step = () => {
      if (simulation.alpha() > simulation.alphaMin()) {
        simulation.tick(2);
        setFrame((frame) => frame + 1);
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [sim]);

  // React registers wheel listeners as passive, so zoom needs a native one.
  useEffect(() => {
    if (!full) return;
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      setView((view) => {
        const k = Math.min(3, Math.max(0.4, view.k * factor));
        const rect = svg.getBoundingClientRect();
        const scale = width / rect.width;
        const px = (event.clientX - rect.left) * scale - width / 2;
        const py = (event.clientY - rect.top) * scale - height / 2;
        // Keep the point under the cursor fixed while zooming.
        const ratio = k / view.k;
        return {
          k,
          x: px - (px - view.x) * ratio,
          y: py - (py - view.y) * ratio,
        };
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [full, width, height]);

  // Background pan and node drag, mouse only. Touch keeps scrolling the
  // page, and tap still selects and navigates.
  const onNodePointerDown = (node: SimNode) => (event: React.PointerEvent) => {
    if (!full || event.pointerType !== "mouse") return;
    event.stopPropagation();
    sim.simulation.alpha(0.4);
    let raf = 0;
    const settle = () => {
      if (sim.simulation.alpha() > sim.simulation.alphaMin()) {
        sim.simulation.tick(2);
        setFrame((frame) => frame + 1);
        raf = requestAnimationFrame(settle);
      }
    };
    raf = requestAnimationFrame(settle);
    const move = (moveEvent: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = width / rect.width;
      const px = (moveEvent.clientX - rect.left) * scale - width / 2;
      const py = (moveEvent.clientY - rect.top) * scale - height / 2;
      node.fx = (px - view.x) / view.k;
      node.fy = (py - view.y) / view.k;
      sim.simulation.alpha(0.4);
    };
    const up = () => {
      node.fx = null;
      node.fy = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onBackgroundPointerDown = (event: React.PointerEvent) => {
    if (!full || event.pointerType !== "mouse") return;
    const start = { x: event.clientX, y: event.clientY };
    const startView = { ...view };
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = width / rect.width;
    const move = (moveEvent: PointerEvent) => {
      setView({
        ...startView,
        x: startView.x + (moveEvent.clientX - start.x) * scale,
        y: startView.y + (moveEvent.clientY - start.y) * scale,
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const neighbors = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    for (const edge of edges) {
      if (edge.source === active) set.add(edge.target);
      if (edge.target === active) set.add(edge.source);
    }
    return set;
  }, [active, edges]);

  const trimmedQuery = query.trim().toLowerCase();
  const matchesQuery = (node: GraphNodeInput) =>
    trimmedQuery === "" || node.title.toLowerCase().includes(trimmedQuery);

  const nodeOpacity = (node: SimNode) => {
    if (!matchesQuery(node)) return 0.08;
    if (neighbors && !neighbors.has(node.slug)) return 0.15;
    return node.status === "planned" ? 0.9 : 1;
  };

  const nodeRadius = (node: SimNode) => {
    const planned = node.status === "planned";
    if (full) return planned ? 4 : node.status === "curated" ? 9 : 8;
    return planned ? 2.5 : 5;
  };

  const activeNode = active
    ? sim.nodes.find((node) => node.slug === active)
    : null;

  // Territory blobs: a padded convex hull around each family's settled
  // cluster, drawn behind the edges. Recomputed every frame while the
  // simulation drifts, which is cheap at this node count.
  const territories = useMemo(() => {
    const byFamily = new Map<string, [number, number][]>();
    for (const node of sim.nodes) {
      if (node.x === undefined || node.y === undefined) continue;
      const list = byFamily.get(node.family) ?? [];
      list.push([node.x, node.y]);
      byFamily.set(node.family, list);
    }
    return [...byFamily.entries()].map(([family, points]) => {
      const hull = convexHull(points);
      const path =
        hull.length === 1
          ? `M ${hull[0][0]} ${hull[0][1]} l 0.01 0`
          : `M ${hull.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`;
      const cx =
        points.reduce((sum, point) => sum + point[0], 0) / points.length;
      const top = Math.min(...points.map((point) => point[1]));
      return { family, path, cx, cy: top - (full ? 30 : 16) };
    });
    // Positions mutate in place each tick, so `frame` (bumped per tick)
    // is what actually drives recomputation here.
  }, [sim.nodes, frame, full]);

  const open = (node: SimNode) => {
    if (node.status !== "planned") {
      window.location.href = `/concepts/${node.slug}`;
    } else {
      setActive(node.slug);
    }
  };

  const statusLine = (node: SimNode) => {
    const family = familyLabels[node.family] ?? node.family;
    if (node.status === "planned")
      return `${family} · planned, not written yet`;
    const status =
      node.status === "curated"
        ? "Peer-reviewed"
        : node.status === "under-review"
          ? "In review"
          : "Draft";
    return `${family} · ${status}`;
  };

  return (
    <div className="font-sans">
      {full && (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="grow">
            <span className="sr-only">Search the map</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search concepts…"
              className="w-full max-w-xs rounded border border-hairline bg-paper px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
          </label>
          <div className="flex gap-1.5">
            {(
              [
                ["Zoom in", 1.4],
                ["Zoom out", 1 / 1.4],
              ] as const
            ).map(([label, factor]) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() =>
                  setView((view) => ({
                    ...view,
                    k: Math.min(3, Math.max(0.4, view.k * factor)),
                  }))
                }
                className="flex h-8 w-8 items-center justify-center rounded border border-hairline text-ink-muted hover:border-accent hover:text-accent"
              >
                {factor > 1 ? "+" : "−"}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setView({ x: 0, y: 0, k: 1 })}
              className="h-8 rounded border border-hairline px-2.5 text-xs text-ink-muted hover:border-accent hover:text-accent"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Knowledge graph of concepts. A searchable list of the same concepts follows."
        className={`block w-full select-none ${full ? "cursor-grab" : ""}`}
        onPointerDown={onBackgroundPointerDown}
        onPointerLeave={() => setActive(null)}
      >
        {ready && (
          <g
            transform={`translate(${width / 2 + view.x} ${height / 2 + view.y}) scale(${view.k})`}
          >
            {territories.map((territory) => (
              <g key={territory.family} aria-hidden="true">
                <path
                  d={territory.path}
                  fill={`var(--family-${territory.family})`}
                  fillOpacity={0.05}
                  stroke={`var(--family-${territory.family})`}
                  strokeOpacity={0.05}
                  strokeWidth={full ? 44 : 20}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {full && (
                  <text
                    x={territory.cx}
                    y={territory.cy}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={600}
                    letterSpacing="0.08em"
                    fill={`var(--family-${territory.family})`}
                    opacity={0.4}
                  >
                    {(familyLabels[territory.family] ?? territory.family)
                      .replace(" & ", " · ")
                      .toUpperCase()}
                  </text>
                )}
              </g>
            ))}
            {sim.links.map((link, index) => {
              const source = asNode(link.source);
              const target = asNode(link.target);
              const lit =
                active !== null &&
                (source.slug === active || target.slug === active);
              return (
                <line
                  key={index}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={lit ? "var(--ink-muted)" : "var(--graph-edge)"}
                  strokeWidth={lit ? 1.6 : 1}
                  strokeOpacity={neighbors && !lit ? 0.25 : 0.8}
                />
              );
            })}
            {sim.nodes.map((node) => {
              const planned = node.status === "planned";
              const color = `var(--family-${node.family})`;
              const radius = nodeRadius(node);
              // Published nodes always carry their name. Planned labels
              // appear on hover, in a search, or once zoomed in: with a
              // hundred-plus nodes, all-labels-always is a text cloud.
              const showLabel =
                node.status !== "planned" ||
                active === node.slug ||
                (full &&
                  (view.k >= 1.3 ||
                    (trimmedQuery !== "" && matchesQuery(node))));
              return (
                <g
                  key={node.slug}
                  transform={`translate(${node.x ?? 0} ${node.y ?? 0})`}
                  opacity={nodeOpacity(node)}
                  tabIndex={full ? 0 : undefined}
                  role={planned ? undefined : "link"}
                  aria-label={`${node.title}. ${statusLine(node)}`}
                  className={planned ? "" : "cursor-pointer"}
                  style={{ outline: "none" }}
                  onPointerEnter={() => setActive(node.slug)}
                  onFocus={() => setActive(node.slug)}
                  onBlur={() => setActive(null)}
                  onPointerDown={onNodePointerDown(node)}
                  onClick={() => open(node)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") open(node);
                  }}
                >
                  <circle
                    r={radius}
                    fill={planned ? "var(--paper)" : color}
                    stroke={color}
                    strokeWidth={planned ? 1.2 : active === node.slug ? 2 : 0}
                  />
                  {showLabel && (
                    <text
                      y={radius + (full ? 12 : 10)}
                      textAnchor="middle"
                      fontSize={full ? 9.5 : 8.5}
                      fill={
                        planned
                          ? "var(--graph-label-faint)"
                          : "var(--graph-label)"
                      }
                      stroke="var(--paper)"
                      strokeWidth={3}
                      paintOrder="stroke"
                    >
                      {node.title}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {full && (
        <p
          className="mt-2 min-h-5 text-sm text-ink-muted"
          role="status"
          aria-live="polite"
        >
          {activeNode
            ? `${activeNode.title} · ${statusLine(activeNode)}`
            : "Hover a node to see its connections, zoom in to reveal planned topics, and click a published concept to read it."}
        </p>
      )}
    </div>
  );
}
