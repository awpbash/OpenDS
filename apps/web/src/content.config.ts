import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import {
  cheatSheetSchema,
  conceptSchema,
  contributorSchema,
  paperSchema,
  projectSchema,
} from "@opends/content-schema";

// Content lives at the repo root (content/), not inside the app, so that
// authors never need to touch application code. See CLAUDE.md section 15.
const contentRoot = "../../content";

const concepts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: `${contentRoot}/concepts` }),
  schema: conceptSchema,
});

const papers = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: `${contentRoot}/papers` }),
  schema: paperSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: `${contentRoot}/projects` }),
  schema: projectSchema,
});

const cheatSheets = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: `${contentRoot}/cheat-sheets` }),
  schema: cheatSheetSchema,
});

const contributors = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: `${contentRoot}/contributors` }),
  schema: contributorSchema,
});

export const collections = {
  concepts,
  papers,
  projects,
  cheatSheets,
  contributors,
};
