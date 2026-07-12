# OpenDS

**Learning Data Science by teaching it.**

OpenDS is a peer-reviewed, open-source knowledge graph for learning Data Science and AI together. A small community writes explanations of concepts, papers, and projects, reviews one another's work, and connects everything through prerequisite relationships so future learners can follow a trustworthy path.

The website is the artifact. The real product is the learning loop: write an explanation, get it challenged, refine it, publish it, and understand the topic better than when you started.

## Status

Early. The founding batch is building the first connected chain of concept articles. Expect drafts, gaps, and rough edges. That is the point: the project should openly reflect that its contributors are learning too.

## Quick start

You need [Node.js](https://nodejs.org) 22 or newer and [pnpm](https://pnpm.io) 10.

```bash
pnpm install
pnpm dev          # start the site at http://localhost:4321
```

Other commands:

```bash
pnpm new:concept <slug> <your-id>   # scaffold an article from the knowledge map
pnpm validate:content               # check frontmatter and contributor references
pnpm roadmap                        # regenerate docs/CONTENT_ROADMAP.md from the map
pnpm render:animation               # render and encode a Manim scene (see docs)
pnpm build                          # production build (the check that blocks PRs)
pnpm test                           # unit tests
pnpm lint                           # lint all packages
pnpm typecheck                      # TypeScript checks
pnpm format                         # format with Prettier
```

## Repository map

```text
apps/web/          the Astro site: routes, layouts, styles, graph UI
packages/
  content-schema/  shared frontmatter schemas (the source of truth for metadata)
  graph/           knowledge graph construction, validation, planned-topic skeleton
  widgets/         interactive educational React components
  inference/       pure-TypeScript forward pass for model-backed widgets
content/
  concepts/        concept articles (MDX)
  papers/          paper deep dives (coming later)
  projects/        project writeups (coming later)
  cheat-sheets/    revision summaries (coming later)
  contributors/    the contributor registry
animations/        Manim sources, fonts, render script, archived renders
figures/           matplotlib house style, diagram palette, figure sources
models/            training scripts for the tiny models some widgets run
tooling/
  content-validation/  frontmatter checks behind pnpm validate:content
  authoring/           the new:concept scaffolder and roadmap generator
docs/              contributor playbooks (start at docs/CONTRIBUTING.md)
```

Articles are plain MDX files with YAML frontmatter. The knowledge graph (prerequisites, backlinks, what a concept unlocks) is generated from that frontmatter plus the planned-topic skeleton in `packages/graph`. Nobody maintains links by hand, and `docs/CONTENT_ROADMAP.md` is generated from the same data.

## Contributing

Start with [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md), which points to a playbook for each kind of work: writing, reviewing, figures, animations, widgets.

Looking for something to write? [docs/CONTENT_ROADMAP.md](docs/CONTENT_ROADMAP.md) lists every topic on the knowledge map and which ones still need an author.

Every article needs an independent review before it can be marked curated. Review here is collaborative learning, not gatekeeping.
