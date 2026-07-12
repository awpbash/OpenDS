/**
 * Roadmap generator for OpenDS.
 *
 * Renders docs/CONTENT_ROADMAP.md from the knowledge map skeleton
 * (packages/graph/src/planned.ts) and the real articles in
 * content/concepts. Run from the repo root:
 *
 *     pnpm roadmap
 *
 * The output file is generated, never hand-edited. To change the topic
 * list, edit planned.ts and rerun. This keeps one source of truth: the
 * same data that draws the map on the site produces the plain-text view
 * on GitHub.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import matter from "gray-matter";
import { PLANNED_CONCEPTS, START_HERE } from "@opends/graph";
import { FAMILIES, FAMILY_LABELS } from "@opends/content-schema";
import type { ConceptStatus, Family } from "@opends/content-schema";

const repoRoot = resolve(import.meta.dirname, "../../..");
const conceptsDir = join(repoRoot, "content", "concepts");
const outputFile = join(repoRoot, "docs", "CONTENT_ROADMAP.md");

/** Public-facing labels, same wording the site uses. */
const STATUS_LABELS: Record<ConceptStatus, string> = {
  draft: "Draft",
  "under-review": "In review",
  curated: "Peer-reviewed",
};

interface PublishedConcept {
  slug: string;
  title: string;
  status: ConceptStatus;
  family: Family;
  prerequisites: string[];
}

const published = new Map<string, PublishedConcept>();
for (const file of readdirSync(conceptsDir)) {
  if (extname(file) !== ".mdx") continue;
  const raw = readFileSync(join(conceptsDir, file), "utf8");
  const front = matter(raw).data as Partial<PublishedConcept>;
  const slug = front.slug ?? basename(file, ".mdx");
  published.set(slug, {
    slug,
    title: front.title ?? slug,
    status: front.status ?? "draft",
    family: front.family ?? "foundations",
    prerequisites: front.prerequisites ?? [],
  });
}

interface RoadmapNode {
  slug: string;
  title: string;
  family: Family;
  prerequisites: string[];
  status: ConceptStatus | null;
}

// Planned order is curated (roughly prerequisite-first), so keep it. A
// published article's own prerequisites replace the planned wiring, same
// as in buildGraph.
const nodes: RoadmapNode[] = PLANNED_CONCEPTS.map((planned) => {
  const real = published.get(planned.slug);
  return {
    slug: planned.slug,
    title: real?.title ?? planned.title,
    family: planned.family,
    prerequisites: real?.prerequisites ?? planned.prerequisites,
    status: real?.status ?? null,
  };
});

// Published articles that never had a planned node slot in just before
// the first topic that needs them, so roots like what-is-data lead their
// family instead of trailing it.
const plannedSlugs = new Set(PLANNED_CONCEPTS.map((concept) => concept.slug));
for (const real of published.values()) {
  if (plannedSlugs.has(real.slug)) continue;
  const node: RoadmapNode = {
    slug: real.slug,
    title: real.title,
    family: real.family,
    prerequisites: real.prerequisites,
    status: real.status,
  };
  const dependentIndex = nodes.findIndex((candidate) =>
    candidate.prerequisites.includes(real.slug),
  );
  if (dependentIndex === -1) {
    nodes.push(node);
  } else {
    nodes.splice(dependentIndex, 0, node);
  }
}

const writtenCount = nodes.filter((node) => node.status !== null).length;

const lines: string[] = [
  "<!-- GENERATED FILE, do not edit by hand. -->",
  "<!-- Regenerate with: pnpm roadmap -->",
  "<!-- Topic list source: packages/graph/src/planned.ts -->",
  "<!-- Progress source: content/concepts frontmatter -->",
  "",
  "# Content roadmap",
  "",
  "The plain-text view of the [knowledge map](../packages/graph/src/planned.ts).",
  `${writtenCount} of ${nodes.length} topics have articles.`,
  "",
  "Every unchecked topic is an open invitation. To claim one, say so in the",
  "group chat or open a draft PR, then start with:",
  "",
  "```bash",
  "pnpm new:concept <slug> <your-contributor-id>",
  "```",
  "",
  "A topic earns a node on the map when it can fill a rigorous 15 to 25",
  "minute article without padding, an interviewer would ask about it by",
  "name, and at least one other node needs it first. To add or reshape",
  "topics, edit `packages/graph/src/planned.ts` and rerun `pnpm roadmap`.",
  "",
  `New to the field? Start here: ${START_HERE.map((slug) => `\`${slug}\``).join(", ")}.`,
];

for (const family of FAMILIES) {
  const familyNodes = nodes.filter((node) => node.family === family);
  if (familyNodes.length === 0) continue;
  const done = familyNodes.filter((node) => node.status !== null).length;
  lines.push(
    "",
    `## ${FAMILY_LABELS[family]} (${done}/${familyNodes.length})`,
    "",
  );
  for (const node of familyNodes) {
    const box = node.status === null ? "[ ]" : "[x]";
    const statusNote =
      node.status === null ? "" : ` **${STATUS_LABELS[node.status]}.**`;
    const prereqNote =
      node.prerequisites.length === 0
        ? ""
        : ` needs ${node.prerequisites.map((prereq) => `\`${prereq}\``).join(", ")}`;
    lines.push(
      `- ${box} **${node.title}** \`${node.slug}\`${statusNote}${prereqNote}`,
    );
  }
}

lines.push("");
writeFileSync(outputFile, lines.join("\n"), "utf8");
console.log(
  `Wrote docs/CONTENT_ROADMAP.md: ${nodes.length} topics, ${writtenCount} written.`,
);
