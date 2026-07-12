# Write an article

Start to finish: from picking a topic to a merged, reviewed page. Writing
one should take a few evenings. The point is that you come out understanding
the topic better than when you started, so do not rush it.

## 0. One-time setup

You need Node.js 22+ and pnpm 10. Then:

```bash
git clone <repo-url>
cd OpenDS
pnpm install
pnpm dev        # site at http://localhost:4321
```

First contribution only: add yourself to the registry. Create
`content/contributors/<your-id>.yaml` (kebab-case filename, that is your id):

```yaml
name: "Your Name"
role: "Data Scientist at Acme"
interests: ["time series", "LLMs"]
github: "yourhandle"
linkedin: "https://www.linkedin.com/in/yourhandle"
```

Only `name` is required. The rest shows up on the About page.

## 1. Pick a topic

The knowledge map is the topic list. Browse it at `/map` on the site, or
read [CONTENT_ROADMAP.md](CONTENT_ROADMAP.md), the same list as plain text.
Unchecked topics are open. Say in the chat which one you are taking so two
people do not write the same page.

Want a topic that is not on the map? Add one entry to its family's section
in `packages/graph/src/planned.ts`, run `pnpm roadmap`, and include both in
your PR. An entry is four lines, copy a neighbor:

```ts
{
  slug: "quantile-regression",
  title: "Quantile Regression",
  family: "machine-learning",
  prerequisites: ["linear-regression", "loss-functions"],
},
```

The bar for a node: it fills a rigorous 15 to 25 minute article, an
interviewer would ask about it by name, and something else needs it first.

## 2. Scaffold

```bash
git checkout -b concept/<slug>
pnpm new:concept <slug> <your-id>
```

This stamps `content/concepts/<slug>.mdx` with the title, family, and
prerequisites the map already knows, plus a starting shape for the body.
It also creates your images folder at
`apps/web/public/images/concepts/<slug>/`.

## 3. Write

The bar: a reader finishes in 15 to 25 minutes prepared to answer interview
questions on the topic. Dense like good lecture notes, with intuition woven
in, not a gentle intro. The [style guide](STYLE_GUIDE.md) covers voice, math,
and code conventions. The short version:

- Intuition before abstraction, but never at the cost of correctness.
- One running example with real numbers that the whole article keeps
  returning to.
- Introduce every symbol and term before using it.
- Failure modes and misconceptions are first-class sections, not footnotes.
- Delete any scaffolded heading that is not doing real work for your topic.

**The AI rule.** Use AI however you like: drafting, critique, figures, code.
But you must be able to defend every claim in this article without it.
Reviewers are told to probe your understanding, not your prose. If you
cannot explain a paragraph when challenged, that paragraph is not done.

## 4. Visuals

Every article should have at least one figure, most deserve several.

- Diagrams and plots: [MAKE_FIGURES.md](MAKE_FIGURES.md)
- Manim animations: [MAKE_ANIMATIONS.md](MAKE_ANIMATIONS.md)
- Interactive widgets: [BUILD_A_WIDGET.md](BUILD_A_WIDGET.md), or ask a
  developer in the batch to pair on one

Pick one figure as the feed card cover and declare it in frontmatter:

```yaml
cover: "/images/concepts/<slug>/cover.png"
coverAlt: "One sentence describing the image"
```

## 5. Polish the metadata

Before opening the PR, revisit the frontmatter:

- `description`: one or two sentences on what the reader will understand.
  This is what shows on cards and in search.
- `difficulty`: beginner, intermediate, or advanced.
- `prerequisites`: now that the article exists, are these actually what a
  reader needs first? Writing usually reveals better ones. Your list
  replaces the map's planned wiring for this node. Declare this direction
  only: what your page unlocks is generated, never written by hand.
- `partOf`: leave it empty. It points at a broader parent page (think
  Mean inside Descriptive Statistics), and until such umbrella pages
  exist there is nothing valid to point at. Families do the grouping.
- `published`: set today's date when the article is ready for the feed.

Check the result on your page: the Builds on and Unlocks panels and the
mini graph all come from this frontmatter.

## 6. Check your work

```bash
pnpm validate:content   # frontmatter errors in plain English
pnpm dev                # read your own page at /concepts/<slug>
```

Read the page once on your phone, or a narrow browser window. Math and
code blocks are the usual overflow suspects.

## 7. Open the PR

Push the branch and open a pull request. The template asks what stage the
article is at and whether you can defend every claim. CI builds a preview
deployment so your reviewer reads the real page, not the diff.

Name a reviewer in the PR or ask in the chat. Review is a conversation,
expect questions rather than verdicts, and expect to learn something.
[REVIEW_AN_ARTICLE.md](REVIEW_AN_ARTICLE.md) is what your reviewer follows.

## 8. After review

- Address comments by pushing to the same branch.
- When a reviewer who is not an author approves, add their id to
  `reviewers`, set `lastReviewed`, and flip `status` to `curated`.
  Until then, `under-review` is the honest status.
- A maintainer merges. The page deploys with the site.

Statuses map to public labels: draft shows as Draft, under-review as
In review, curated as Peer-reviewed.
