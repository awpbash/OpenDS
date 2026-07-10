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
pnpm build             # production build
pnpm test              # unit tests
pnpm lint              # lint all packages
pnpm typecheck         # TypeScript checks
pnpm format            # format with Prettier
pnpm validate:content  # check article frontmatter and contributor references
```

## Repository map

```text
apps/web/          the Astro site: routes, layouts, styles
packages/
  content-schema/  shared frontmatter schemas (the source of truth for metadata)
  widgets/         interactive educational React components
content/
  concepts/        concept articles (MDX)
  papers/          paper deep dives (coming later)
  projects/        project writeups (coming later)
  cheat-sheets/    revision summaries (coming later)
  contributors/    the contributor registry
animations/        Manim animation source and rendered assets
tooling/           content validation and future build tooling
docs/              guides for contributors and reviewers
```

Articles are plain MDX files with YAML frontmatter. The knowledge graph (prerequisites, backlinks, what a concept unlocks) is generated from that frontmatter. Nobody maintains links by hand.

## Contributing

Start with [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). You do not need to be a frontend engineer to contribute an article: there is a path for writing in a shared doc and having someone port it for you.

Looking for something to write? [docs/CONTENT_ROADMAP.md](docs/CONTENT_ROADMAP.md) is a menu of over a hundred planned topics, each with a vision of what the page should teach and what visual would make it special.

Every article needs an independent review before it can be marked curated. Review here is collaborative learning, not gatekeeping.
