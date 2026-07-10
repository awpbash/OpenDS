/**
 * Shared content schemas for OpenDS.
 *
 * These zod schemas are the single source of truth for content frontmatter.
 * The web app uses them for Astro content collections, and the content
 * validator uses them to give authors readable errors without a full build.
 *
 * Relationship fields (prerequisites, partOf, and the cross-type references)
 * are first-class here on purpose: the knowledge graph is generated from
 * this metadata, never maintained by hand.
 */

import { z } from "zod";

export const CONCEPT_STATUSES = ["draft", "under-review", "curated"] as const;
export type ConceptStatus = (typeof CONCEPT_STATUSES)[number];

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/**
 * Top-level families of the knowledge space. They drive the topic filter
 * on the homepage and the color groups of the knowledge graph, so the set
 * is deliberately small and stable. Add a family only with a product
 * decision, not per article.
 */
export const FAMILIES = [
  "foundations",
  "probability-statistics",
  "linear-algebra-optimization",
  "machine-learning",
  "time-series",
  "recommender-systems",
  "deep-learning",
  "nlp",
  "llms-genai",
  "computer-vision",
  "data-engineering",
  "production-ml",
] as const;
export type Family = (typeof FAMILIES)[number];

export const FAMILY_LABELS: Record<Family, string> = {
  foundations: "Foundations",
  "probability-statistics": "Probability & Statistics",
  "linear-algebra-optimization": "Linear Algebra & Optimization",
  "machine-learning": "Machine Learning",
  "time-series": "Time Series",
  "recommender-systems": "Recommender Systems",
  "deep-learning": "Deep Learning",
  nlp: "NLP",
  "llms-genai": "LLMs & GenAI",
  "computer-vision": "Computer Vision",
  "data-engineering": "Data Engineering",
  "production-ml": "Production ML",
};

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugString = z
  .string()
  .regex(
    KEBAB_CASE,
    "must be kebab-case: lowercase letters, numbers, and single hyphens (for example 'prediction-error')",
  );

const slugList = z.array(slugString).default([]);

export const contributorSchema = z.object({
  name: z.string().min(1, "every contributor needs a display name"),
  /** Current role, shown on the About page, e.g. "Data Scientist at Acme". */
  role: z.string().max(80, "keep the role to one line").optional(),
  /** A few interest areas, shown as a short list, e.g. ["LLMs", "causal inference"]. */
  interests: z
    .array(z.string().min(1))
    .max(6, "list at most six interests")
    .default([]),
  github: z.string().min(1).optional(),
  linkedin: z
    .string()
    .url("linkedin must be a full URL, including https://")
    .optional(),
  website: z
    .string()
    .url("website must be a full URL, including https://")
    .optional(),
  /** Headshot path under public/, e.g. "/images/contributors/jun-wei.jpg". */
  avatar: z.string().min(1).optional(),
  bio: z
    .string()
    .max(280, "keep bios short, 280 characters or fewer")
    .optional(),
});
export type Contributor = z.infer<typeof contributorSchema>;

/**
 * Core concept frontmatter, per CLAUDE.md section 18.
 *
 * The curated rules from sections 5.2 and 24.1 are enforced here:
 * a page cannot be curated without at least one reviewer who is not
 * also an author.
 */
export const conceptSchema = z
  .object({
    title: z.string().min(1, "title is required"),
    slug: slugString,
    description: z
      .string()
      .min(
        1,
        "description is required, one or two sentences on what the reader will understand",
      )
      .max(500, "keep the description under 500 characters"),
    status: z.enum(CONCEPT_STATUSES, {
      message: "status must be one of: draft, under-review, curated",
    }),
    difficulty: z.enum(DIFFICULTIES, {
      message: "difficulty must be one of: beginner, intermediate, advanced",
    }),
    family: z.enum(FAMILIES, {
      message: `family must be one of: ${FAMILIES.join(", ")}`,
    }),
    /**
     * Feed card visual: a path under public/ to one of the article's own
     * figures. Cards without a cover fall back to a typographic layout.
     */
    cover: z.string().min(1).optional(),
    coverAlt: z.string().min(1).optional(),
    /** First publication date, used to order the feed within a status group. */
    published: z.coerce.date().optional(),
    authors: z
      .array(slugString)
      .min(
        1,
        "every concept needs at least one author (a contributor id like 'jun-wei')",
      ),
    reviewers: slugList,
    lastReviewed: z.union([z.null(), z.coerce.date()]).default(null),
    prerequisites: slugList,
    partOf: slugList,
    papers: slugList,
    projects: slugList,
    cheatSheets: slugList,
    tags: slugList,
  })
  .superRefine((concept, ctx) => {
    if (concept.status === "curated") {
      const independentReviewers = concept.reviewers.filter(
        (reviewer) => !concept.authors.includes(reviewer),
      );
      if (independentReviewers.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["status"],
          message:
            "a page cannot be 'curated' without at least one independent reviewer (someone who is not an author). Add them to 'reviewers' or keep the status 'under-review'.",
        });
      }
    }
    if (concept.prerequisites.includes(concept.slug)) {
      ctx.addIssue({
        code: "custom",
        path: ["prerequisites"],
        message: "a concept cannot be its own prerequisite",
      });
    }
    if (concept.partOf.includes(concept.slug)) {
      ctx.addIssue({
        code: "custom",
        path: ["partOf"],
        message: "a concept cannot be part of itself",
      });
    }
  });
export type Concept = z.infer<typeof conceptSchema>;

/**
 * Papers, projects, and cheat sheets are stubs until their build phase
 * (Phase 5 in CLAUDE.md). The shared core keeps cross-linking consistent:
 * every content type points at concepts through 'concepts'.
 */
const contentStubFields = {
  title: z.string().min(1, "title is required"),
  slug: slugString,
  description: z.string().min(1, "description is required"),
  status: z.enum(CONCEPT_STATUSES, {
    message: "status must be one of: draft, under-review, curated",
  }),
  family: z
    .enum(FAMILIES, {
      message: `family must be one of: ${FAMILIES.join(", ")}`,
    })
    .optional(),
  cover: z.string().min(1).optional(),
  coverAlt: z.string().min(1).optional(),
  published: z.coerce.date().optional(),
  authors: z.array(slugString).min(1, "at least one author is required"),
  reviewers: slugList,
  concepts: slugList,
  tags: slugList,
};

export const paperSchema = z.object({
  ...contentStubFields,
  paperTitle: z.string().min(1).optional(),
  paperAuthors: z.array(z.string().min(1)).default([]),
  year: z.number().int().min(1900).max(2100).optional(),
  link: z.string().url("link must be a full URL to the paper").optional(),
});
export type Paper = z.infer<typeof paperSchema>;

export const projectSchema = z.object({
  ...contentStubFields,
  repository: z.string().url("repository must be a full URL").optional(),
});
export type Project = z.infer<typeof projectSchema>;

export const cheatSheetSchema = z.object(contentStubFields);
export type CheatSheet = z.infer<typeof cheatSheetSchema>;
