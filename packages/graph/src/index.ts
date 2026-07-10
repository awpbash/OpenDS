/**
 * Knowledge graph construction for OpenDS.
 *
 * The graph is generated from content metadata plus the planned-concept
 * skeleton, never maintained by hand. This package owns the data model and
 * validation only. It knows nothing about rendering or layout, per
 * CLAUDE.md section 16.4.
 */

import type { ConceptStatus, Family } from "@opends/content-schema";
import { PLANNED_CONCEPTS, START_HERE } from "./planned.ts";
import type { PlannedConcept } from "./planned.ts";

export { PLANNED_CONCEPTS, START_HERE };
export type { PlannedConcept };

/** A published article, as read from content collection frontmatter. */
export interface ConceptInput {
  slug: string;
  title: string;
  family: Family;
  status: ConceptStatus;
  description?: string;
  prerequisites: string[];
  partOf: string[];
}

export type NodeStatus = ConceptStatus | "planned";

export interface GraphNode {
  slug: string;
  title: string;
  family: Family;
  status: NodeStatus;
  description?: string;
}

export interface GraphEdge {
  /** The prerequisite: learn this first. */
  source: string;
  /** The concept that builds on it. */
  target: string;
  kind: "prerequisite" | "partOf";
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Merge published concepts with the planned skeleton and derive all edges.
 *
 * A published concept replaces the planned node with the same slug, and its
 * own declared prerequisites replace the planned ones. Throws with a
 * readable message on broken references, duplicates, self-loops, or
 * prerequisite cycles, so a bad graph fails the build instead of rendering
 * quietly wrong.
 */
export function buildGraph(
  concepts: ConceptInput[],
  planned: PlannedConcept[] = PLANNED_CONCEPTS,
): KnowledgeGraph {
  const seen = new Set<string>();
  for (const concept of concepts) {
    if (seen.has(concept.slug)) {
      throw new Error(`duplicate concept slug '${concept.slug}'`);
    }
    seen.add(concept.slug);
  }

  const realSlugs = new Set(concepts.map((concept) => concept.slug));
  const nodes: GraphNode[] = [
    ...concepts.map((concept) => ({
      slug: concept.slug,
      title: concept.title,
      family: concept.family,
      status: concept.status,
      description: concept.description,
    })),
    ...planned
      .filter((stub) => !realSlugs.has(stub.slug))
      .map((stub) => ({
        slug: stub.slug,
        title: stub.title,
        family: stub.family,
        status: "planned" as const,
      })),
  ];

  const known = new Set(nodes.map((node) => node.slug));

  const edges: GraphEdge[] = [];
  const addEdges = (
    slug: string,
    targets: string[],
    kind: GraphEdge["kind"],
  ) => {
    for (const target of targets) {
      if (target === slug) {
        throw new Error(`'${slug}' references itself via ${kind}`);
      }
      if (!known.has(target)) {
        throw new Error(
          `'${slug}' lists unknown ${kind} '${target}'. Add the article, add it to PLANNED_CONCEPTS, or fix the slug.`,
        );
      }
      edges.push({ source: target, target: slug, kind });
    }
  };

  for (const concept of concepts) {
    addEdges(concept.slug, concept.prerequisites, "prerequisite");
    addEdges(concept.slug, concept.partOf, "partOf");
  }
  for (const stub of planned) {
    if (realSlugs.has(stub.slug)) continue;
    addEdges(stub.slug, stub.prerequisites, "prerequisite");
  }

  assertAcyclic(nodes, edges);

  return { nodes, edges };
}

/** Prerequisite chains must not loop: you cannot need A to learn A. */
function assertAcyclic(nodes: GraphNode[], edges: GraphEdge[]): void {
  const next = new Map<string, string[]>();
  for (const edge of edges) {
    if (edge.kind !== "prerequisite") continue;
    const list = next.get(edge.source) ?? [];
    list.push(edge.target);
    next.set(edge.source, list);
  }

  const DONE = 2;
  const IN_PROGRESS = 1;
  const state = new Map<string, number>();
  const stack: string[] = [];

  const visit = (slug: string): void => {
    state.set(slug, IN_PROGRESS);
    stack.push(slug);
    for (const target of next.get(slug) ?? []) {
      const targetState = state.get(target);
      if (targetState === IN_PROGRESS) {
        const cycle = [...stack.slice(stack.indexOf(target)), target];
        throw new Error(
          `prerequisite cycle detected: ${cycle.join(" -> ")}. Break the loop by removing one of these prerequisites.`,
        );
      }
      if (targetState !== DONE) visit(target);
    }
    stack.pop();
    state.set(slug, DONE);
  };

  for (const node of nodes) {
    if (!state.has(node.slug)) visit(node.slug);
  }
}

/** Everything that directly builds on the given concept. */
export function unlocks(graph: KnowledgeGraph, slug: string): GraphNode[] {
  const targets = graph.edges
    .filter((edge) => edge.kind === "prerequisite" && edge.source === slug)
    .map((edge) => edge.target);
  return graph.nodes.filter((node) => targets.includes(node.slug));
}

/** Node lookup, for titles and status of prerequisites that may be planned. */
export function findNode(
  graph: KnowledgeGraph,
  slug: string,
): GraphNode | undefined {
  return graph.nodes.find((node) => node.slug === slug);
}
