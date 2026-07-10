# Contributing to OpenDS

Thanks for being here. OpenDS exists so that we learn topics deeply by explaining them to one another. Contributions are judged by whether they help someone understand something, not by volume.

## Ways to contribute

- **Author**: research a concept and write the article.
- **Reviewer**: read a draft critically and improve its correctness, intuition, and clarity.
- **Widget or site work**: build interactive explorers, improve layouts, tooling, or CI.
- **Visuals**: diagrams and Manim animations.

One person can hold several roles, but an article can only become **curated** after approval from at least one reviewer who is not an author of that article.

Not sure what to write? Browse the [content roadmap](CONTENT_ROADMAP.md), a menu of planned topics with a vision and visual ideas for each. Claim one by opening an issue or a draft PR.

## Article lifecycle

```text
draft  →  under-review  →  curated
```

The status lives in the article's frontmatter and is enforced by validation. Drafts are welcome on the site. Curated is a promise to readers that someone independent has checked the work.

## Path A: Git and MDX

For contributors comfortable with a code editor.

1. **Set up once.** Install Node.js 22+ and pnpm 10, clone the repo, run `pnpm install`, then `pnpm dev` and open http://localhost:4321.
2. **Create a branch.** `git checkout -b concept/your-topic`
3. **Add yourself to the registry** (first time only): create `content/contributors/your-id.yaml` with your name. Your id is the filename, kebab-case.
4. **Write the article** at `content/concepts/your-topic.mdx`. Copy the frontmatter from [CONTENT_TEMPLATE.mdx](CONTENT_TEMPLATE.mdx) or an existing article. The slug must match the filename.
5. **Check your work.** `pnpm validate:content` tells you in plain English if metadata is wrong. `pnpm dev` shows you the page.
6. **Open a pull request.** CI runs the same checks. A preview deployment lets reviewers read the real page.
7. **Discuss and revise.** Review comments are learning conversations. Push updates to the same branch.
8. **A maintainer merges** once review is done.

## Path B: write first, port later

For contributors who would rather not touch git at all.

1. Draft the article in a shared doc (Google Docs or Notion).
2. Share it with the group for early discussion.
3. A maintainer or technical contributor ports it to MDX and opens the PR, crediting you as the author.
4. You take part in the review conversation on the preview page.

Being a great explainer or reviewer matters more here than knowing the toolchain. Do not let the toolchain stop you.

## Writing an article

The goal is a meaningful learning experience, roughly 15 to 25 minutes of reading and interaction. There is no mandatory structure, but strong articles usually answer: what problem does this solve, what is the intuition, how does it work, when does it fail, and what should I learn next. See the [style guide](STYLE_GUIDE.md).

Declare relationships in frontmatter as you write:

```yaml
prerequisites:
  - types-of-data
partOf:
  - exploratory-data-analysis
```

Reverse links (what a concept unlocks) are generated automatically. Never write them by hand.

## Widgets and animations

- Widgets live in `packages/widgets`. Every widget starts from a learning question: what should the user understand after interacting? See the [visual guide](VISUAL_GUIDE.md) and the checklist in the project CLAUDE.md.
- Manim animation source lives in `animations/src`. Render locally, put the optimized MP4 in `animations/renders`, and copy the web asset into `apps/web/public/videos`.

## Review

Reviewers assess technical correctness, intuition, clarity, and completeness. Feedback is specific, respectful, and evidence-based. See the [review guide](REVIEW_GUIDE.md).

## Questions

Open an issue or ask in the group chat. There are no silly questions here, that is the whole premise of the project.
