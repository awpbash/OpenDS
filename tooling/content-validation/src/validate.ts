/**
 * Content validator for OpenDS.
 *
 * Gives authors fast, readable feedback on frontmatter without running a
 * full site build. Run from the repo root with:  pnpm validate:content
 *
 * Checks:
 *   1. every contributor file parses and matches the contributor schema;
 *   2. every concept's frontmatter matches the concept schema;
 *   3. the slug field matches the filename;
 *   4. authors and reviewers exist in the contributor registry.
 *
 * Graph-level checks (missing prerequisite targets, cycles) belong to the
 * graph package and arrive with the graph phase.
 */

import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { ZodError } from "zod";
import { conceptSchema, contributorSchema } from "@opends/content-schema";

const repoRoot = resolve(import.meta.dirname, "../../..");
const contentRoot = join(repoRoot, "content");

interface Problem {
  file: string;
  message: string;
}

const problems: Problem[] = [];

function relPath(absolute: string): string {
  return relative(repoRoot, absolute).replaceAll("\\", "/");
}

function reportZodError(file: string, error: ZodError): void {
  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.join(".") : "(top level)";
    problems.push({ file, message: `field '${field}': ${issue.message}` });
  }
}

function extractPeople(frontmatter: Record<string, unknown>): Set<string> {
  const people = new Set<string>();
  for (const key of ["authors", "reviewers"]) {
    const value = frontmatter[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") people.add(item);
      }
    }
  }
  return people;
}

function listFiles(dir: string, extension: string): string[] {
  return readdirSync(dir)
    .filter((name) => extname(name) === extension)
    .map((name) => join(dir, name));
}

// 1. Contributors
const contributorIds = new Set<string>();
for (const file of listFiles(join(contentRoot, "contributors"), ".yaml")) {
  const id = basename(file, ".yaml");
  let raw: unknown;
  try {
    raw = parseYaml(readFileSync(file, "utf8"));
  } catch (error) {
    problems.push({
      file: relPath(file),
      message: `could not parse YAML: ${error instanceof Error ? error.message : String(error)}`,
    });
    continue;
  }
  const result = contributorSchema.safeParse(raw);
  if (result.success) {
    contributorIds.add(id);
  } else {
    reportZodError(relPath(file), result.error);
  }
}

// 2. Concepts
let conceptCount = 0;
for (const file of listFiles(join(contentRoot, "concepts"), ".mdx")) {
  const fileSlug = basename(file, ".mdx");
  let frontmatter: Record<string, unknown>;
  try {
    frontmatter = matter(readFileSync(file, "utf8")).data;
  } catch (error) {
    problems.push({
      file: relPath(file),
      message: `could not parse frontmatter: ${error instanceof Error ? error.message : String(error)}`,
    });
    continue;
  }

  const result = conceptSchema.safeParse(frontmatter);
  if (result.success) {
    conceptCount += 1;
    const concept = result.data;
    if (concept.slug !== fileSlug) {
      problems.push({
        file: relPath(file),
        message: `slug '${concept.slug}' does not match the filename. Rename the file to '${concept.slug}.mdx' or change the slug to '${fileSlug}'.`,
      });
    }
  } else {
    reportZodError(relPath(file), result.error);
  }

  // Check people against the registry even when other fields are broken,
  // so an author typo shows up on the first run.
  for (const person of extractPeople(frontmatter)) {
    if (!contributorIds.has(person)) {
      problems.push({
        file: relPath(file),
        message: `'${person}' is not in the contributor registry. Add content/contributors/${person}.yaml or fix the id.`,
      });
    }
  }
}

// Report
if (problems.length > 0) {
  console.error("Content validation failed.\n");
  const byFile = new Map<string, string[]>();
  for (const problem of problems) {
    const list = byFile.get(problem.file) ?? [];
    list.push(problem.message);
    byFile.set(problem.file, list);
  }
  for (const [file, messages] of byFile) {
    console.error(`  ${file}`);
    for (const message of messages) {
      console.error(`    - ${message}`);
    }
    console.error("");
  }
  console.error(`${problems.length} problem(s) across ${byFile.size} file(s).`);
  process.exit(1);
}

console.log(
  `Content OK: ${conceptCount} concept(s) and ${contributorIds.size} contributor(s) validated.`,
);
