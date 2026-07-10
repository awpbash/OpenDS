/**
 * Small shared helpers for content presentation. Public status labels live
 * here so every surface says the same thing: the schema values (draft,
 * under-review, curated) stay internal vocabulary.
 */

import type { ConceptStatus } from "@opends/content-schema";

export const STATUS_LABELS: Record<ConceptStatus, string> = {
  draft: "Draft",
  "under-review": "In review",
  curated: "Peer-reviewed",
};

/** Order of trust for the feed: reviewed work floats to the top. */
export const STATUS_RANK: Record<ConceptStatus, number> = {
  curated: 0,
  "under-review": 1,
  draft: 2,
};

export function readingMinutes(body: string | undefined): number {
  return Math.max(1, Math.round((body ?? "").split(/\s+/).length / 220));
}
