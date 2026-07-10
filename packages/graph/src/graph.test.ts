import { describe, expect, it } from "vitest";
import { buildGraph, findNode, unlocks, PLANNED_CONCEPTS } from "./index.ts";
import type { ConceptInput, PlannedConcept } from "./index.ts";

const concept = (overrides: Partial<ConceptInput> = {}): ConceptInput => ({
  slug: "what-is-data",
  title: "What Is Data?",
  family: "foundations",
  status: "draft",
  prerequisites: [],
  partOf: [],
  ...overrides,
});

const planned = (
  slug: string,
  prerequisites: string[] = [],
): PlannedConcept => ({
  slug,
  title: slug,
  family: "foundations",
  prerequisites,
});

describe("buildGraph", () => {
  it("merges planned nodes with published ones, published wins", () => {
    const graph = buildGraph(
      [concept({ slug: "types-of-data", title: "Types of Data (published)" })],
      [planned("types-of-data"), planned("outliers")],
    );
    expect(graph.nodes).toHaveLength(2);
    const merged = findNode(graph, "types-of-data");
    expect(merged?.title).toBe("Types of Data (published)");
    expect(merged?.status).toBe("draft");
    expect(findNode(graph, "outliers")?.status).toBe("planned");
  });

  it("derives prerequisite edges pointing from prerequisite to dependent", () => {
    const graph = buildGraph(
      [concept({ slug: "eda", prerequisites: ["what-is-data"] })],
      [planned("what-is-data")],
    );
    expect(graph.edges).toEqual([
      { source: "what-is-data", target: "eda", kind: "prerequisite" },
    ]);
  });

  it("published prerequisites replace the planned ones for the same slug", () => {
    const graph = buildGraph(
      [concept({ slug: "eda", prerequisites: [] })],
      [planned("eda", ["what-is-data"]), planned("what-is-data")],
    );
    expect(graph.edges).toHaveLength(0);
  });

  it("rejects an unknown prerequisite with an actionable message", () => {
    expect(() =>
      buildGraph([concept({ prerequisites: ["not-a-page"] })], []),
    ).toThrow(/unknown prerequisite 'not-a-page'/);
  });

  it("rejects duplicate slugs and self-references", () => {
    expect(() => buildGraph([concept(), concept()], [])).toThrow(/duplicate/);
    expect(() =>
      buildGraph([concept({ prerequisites: ["what-is-data"] })], []),
    ).toThrow(/references itself/);
  });

  it("rejects prerequisite cycles and names the loop", () => {
    expect(() =>
      buildGraph([], [planned("a", ["b"]), planned("b", ["a"])]),
    ).toThrow(/cycle/);
  });

  it("accepts the real planned skeleton", () => {
    const graph = buildGraph(
      [
        concept(),
        concept({
          slug: "transformers",
          title: "Transformers",
          family: "deep-learning",
          prerequisites: ["attention", "embeddings", "gradient-descent"],
        }),
      ],
      PLANNED_CONCEPTS,
    );
    expect(graph.nodes.length).toBe(PLANNED_CONCEPTS.length + 2);
  });
});

describe("unlocks", () => {
  it("lists everything that builds directly on a concept", () => {
    const graph = buildGraph(
      [concept()],
      [planned("types-of-data", ["what-is-data"]), planned("outliers")],
    );
    expect(unlocks(graph, "what-is-data").map((node) => node.slug)).toEqual([
      "types-of-data",
    ]);
    expect(unlocks(graph, "outliers")).toEqual([]);
  });
});
