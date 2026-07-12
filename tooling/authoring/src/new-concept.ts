/**
 * Article scaffolder for OpenDS.
 *
 * Stamps a ready-to-write MDX file for a topic that already exists on the
 * knowledge map, so authors start from one command instead of copying a
 * template and hand-filling frontmatter. Run from the repo root:
 *
 *     pnpm new:concept <slug> <author-id>
 *
 * Title, family, and prerequisites come from the map skeleton in
 * packages/graph/src/planned.ts. If the topic is not on the map yet, add it
 * there first: the map is the canonical topic list, and scaffolding around
 * it would create a node the graph does not know about.
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { PLANNED_CONCEPTS } from "@opends/graph";
import { FAMILY_LABELS } from "@opends/content-schema";

const repoRoot = resolve(import.meta.dirname, "../../..");
const conceptsDir = join(repoRoot, "content", "concepts");
const contributorsDir = join(repoRoot, "content", "contributors");

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

function contributorIds(): string[] {
  return readdirSync(contributorsDir)
    .filter((name) => extname(name) === ".yaml")
    .map((name) => basename(name, ".yaml"))
    .sort();
}

const [slug, author] = process.argv.slice(2);

if (!slug) {
  fail(
    "Usage: pnpm new:concept <slug> <author-id>\n" +
      "  Example: pnpm new:concept attention jun-wei",
  );
}
if (!KEBAB_CASE.test(slug)) {
  fail(`'${slug}' is not kebab-case. Use lowercase words joined by hyphens.`);
}
if (!author) {
  fail(
    "Missing author id. Usage: pnpm new:concept <slug> <author-id>\n" +
      `  Registered contributors: ${contributorIds().join(", ")}\n` +
      "  Not registered yet? Add content/contributors/<your-id>.yaml first.",
  );
}
if (!existsSync(join(contributorsDir, `${author}.yaml`))) {
  fail(
    `No contributor file at content/contributors/${author}.yaml.\n` +
      `  Registered contributors: ${contributorIds().join(", ")}\n` +
      "  Add yourself to the registry first (one yaml file with your name).",
  );
}

const targetFile = join(conceptsDir, `${slug}.mdx`);
if (existsSync(targetFile)) {
  fail(`content/concepts/${slug}.mdx already exists.`);
}

const planned = PLANNED_CONCEPTS.find((concept) => concept.slug === slug);
if (!planned) {
  // Suggest map slugs that share a word or a 5+ letter word prefix with
  // the input, so 'tokenizers' still surfaces 'tokenization'.
  const tokens = slug.split("-").filter((token) => token.length > 2);
  const sharesPrefix = (a: string, b: string) =>
    a.slice(0, 5) === b.slice(0, 5) && Math.min(a.length, b.length) >= 5;
  const near = PLANNED_CONCEPTS.filter((concept) =>
    concept.slug
      .split("-")
      .some((part) =>
        tokens.some(
          (token) =>
            part === token || part.includes(token) || sharesPrefix(part, token),
        ),
      ),
  ).slice(0, 6);
  fail(
    `'${slug}' is not on the knowledge map.\n` +
      (near.length > 0
        ? `  Did you mean: ${near.map((concept) => concept.slug).join(", ")}\n`
        : "") +
      "  The map is the canonical topic list. If this topic deserves a node,\n" +
      "  add it to packages/graph/src/planned.ts (with its prerequisites)\n" +
      "  and run this command again.",
  );
}

const prerequisiteLines =
  planned.prerequisites.length === 0
    ? "prerequisites: []"
    : "prerequisites:\n" +
      planned.prerequisites.map((prereq) => `  - ${prereq}`).join("\n");

const frontmatter = `---
title: "${planned.title}"
slug: "${slug}"
description: "TODO: one or two sentences on what the reader will understand."
status: "draft"
difficulty: "beginner"
family: "${planned.family}"
authors:
  - ${author}
reviewers: []
lastReviewed: null
${prerequisiteLines}
partOf: []
papers: []
projects: []
cheatSheets: []
tags: []
---`;

const body = `
{/* Scaffolded by pnpm new:concept. The headings below are a starting shape,
    not a mandatory skeleton: keep what does real work for this topic and
    delete the rest. docs/WRITE_AN_ARTICLE.md walks through the whole flow. */}

Open with the problem. What question does ${planned.title} answer, and why
would anyone care before knowing the term for it?

## The problem this solves

A concrete scenario the reader can picture. Numbers beat adjectives.

## The intuition

The mental model, before any notation. An analogy is welcome if you also say
where it breaks.

## How it works

The mechanics. Introduce notation gently and explain every symbol in prose.

{/* Display math: $$ ... $$   Inline math: $ ... $ */}

{/* Figures live in apps/web/public/images/concepts/${slug}/
    Animations embed as:
    <AnimatedFigure src="/videos/concepts/${slug}/name.mp4" caption="..." /> */}

## When to use it, and when it fails

Honest limits. Failure modes are often the most valuable part of the page.

## Common misconceptions

> **Misconception.** State it, then correct it.

## What to learn next

The graph links prerequisites and unlocks automatically from frontmatter,
but prose guidance on where to go next is still worth writing.
`;

writeFileSync(targetFile, `${frontmatter}\n${body}`, "utf8");

const imagesDir = join(
  repoRoot,
  "apps",
  "web",
  "public",
  "images",
  "concepts",
  slug,
);
mkdirSync(imagesDir, { recursive: true });

const prereqNote =
  planned.prerequisites.length > 0
    ? planned.prerequisites.join(", ")
    : "none on the map";

console.log(`
  Created content/concepts/${slug}.mdx
    title:         ${planned.title}
    family:        ${FAMILY_LABELS[planned.family]}
    prerequisites: ${prereqNote}  (from the map, adjust if writing reveals better ones)
    images folder: apps/web/public/images/concepts/${slug}/

  Next steps:
    1. Set 'difficulty' and write the description.
    2. pnpm dev, then open http://localhost:4321/concepts/${slug}
    3. pnpm validate:content before you push.
    4. The full flow lives in docs/WRITE_AN_ARTICLE.md
`);
