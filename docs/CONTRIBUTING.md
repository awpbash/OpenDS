# Contributing to OpenDS

OpenDS exists so that we learn topics deeply by explaining them to one
another. Contributions are judged by whether they help someone understand
something, not by volume. These docs are written for the founding batch:
short, direct, and assuming you can always ask in the group chat.

## Find your playbook

Each guide is a start-to-finish recipe for one kind of work:

| I want to...                  | Read                                         |
| ----------------------------- | -------------------------------------------- |
| write a concept article       | [WRITE_AN_ARTICLE.md](WRITE_AN_ARTICLE.md)   |
| review someone's article      | [REVIEW_AN_ARTICLE.md](REVIEW_AN_ARTICLE.md) |
| make a diagram or plot        | [MAKE_FIGURES.md](MAKE_FIGURES.md)           |
| make a Manim animation        | [MAKE_ANIMATIONS.md](MAKE_ANIMATIONS.md)     |
| build an interactive widget   | [BUILD_A_WIDGET.md](BUILD_A_WIDGET.md)       |
| know what topics need writing | [CONTENT_ROADMAP.md](CONTENT_ROADMAP.md)     |
| match the writing voice       | [STYLE_GUIDE.md](STYLE_GUIDE.md)             |

One person can hold several roles, but an article only becomes curated
after approval from at least one reviewer who is not an author of it.

## Setup

Node.js 22+ and pnpm 10. Then:

```bash
pnpm install
pnpm dev            # site at http://localhost:4321
```

## The golden path

Every contribution follows the same shape:

```bash
git checkout -b concept/<slug>          # branch per piece of work
pnpm new:concept <slug> <your-id>      # scaffold (articles only)
# ... do the work ...
pnpm validate:content                   # plain-English frontmatter checks
git push -u origin concept/<slug>       # then open a PR on GitHub
```

CI runs on the PR and a preview deployment appears, so reviewers read the
real page. Discussion happens in PR comments, revisions are pushes to the
same branch, and a maintainer merges when review is done.

Useful commands, all from the repo root:

```bash
pnpm dev                 # local site
pnpm validate:content    # frontmatter and contributor checks
pnpm roadmap             # regenerate CONTENT_ROADMAP.md from the map
pnpm build               # what CI requires to pass
pnpm test                # unit tests
pnpm lint                # linting
pnpm typecheck           # TypeScript
```

## Article lifecycle

```text
draft  →  under-review  →  curated
```

The status lives in frontmatter and validation enforces the rules. On the
site these show as Draft, In review, and Peer-reviewed. Drafts are welcome,
curated is a promise to readers that someone independent checked the work.

## The AI rule

Use AI tools however you like: drafting, critique, code, figures. But you
must be able to defend every claim in your work without them. Reviewers
are explicitly told to probe understanding, not prose. The whole point of
this project is that the understanding ends up in your head.

## CI

Only the production build blocks a PR. Everything else (lint, typecheck,
tests, formatting) runs as advisory checks, fix them when they flag
something real. Note that the build itself validates frontmatter and the
graph, so a broken prerequisite slug still fails the PR.

## Questions

Ask in the group chat or open an issue. There are no silly questions here,
that is the whole premise of the project.
