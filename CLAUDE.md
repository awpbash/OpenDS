# CLAUDE.md — OpenDS Project Instructions

## 0. Purpose of this file

This file is the root project instruction set for Claude Code and human maintainers working on OpenDS.

Treat it as the source of truth for:

- product vision;
- community philosophy;
- repository architecture;
- frontend and content conventions;
- graph semantics;
- interactive widget standards;
- responsive design requirements;
- contribution and peer-review workflows;
- CI/CD expectations;
- testing standards;
- implementation priorities;
- anti-patterns to avoid.

Before making a significant architectural, UX, content-model, or infrastructure decision, read this file and preserve the intent described here.

Do not optimize OpenDS into a generic blog, generic documentation site, LMS, social network, or startup dashboard.

OpenDS is intentionally community-first, publication-quality, graph-aware, open-source, and non-profit.

---

# 1. Product vision

## 1.1 One-line definition

**OpenDS is a batch-first, open-source learning community where people deepen their understanding of Data Science and AI by teaching one another, peer-reviewing their work, and building a curated knowledge graph that future learners can trust.**

## 1.2 What is the real product?

The website is not the primary product.

The primary product is the community learning loop:

```text
Learn
  ↓
Explain
  ↓
Discuss
  ↓
Review
  ↓
Refine
  ↓
Publish
  ↓
Connect to the knowledge graph
  ↓
Learn something deeper
```

The public website is the durable artifact created by that process.

## 1.3 Origin and growth model

OpenDS begins with a small cohort or batch of people who already know one another.

The initial goal is to create a culture of:

- learning deeply;
- challenging explanations constructively;
- revisiting fundamentals;
- sharing intuition;
- building in public;
- improving one another's technical standard.

Growth should be staged:

```text
Batch community
  ↓
Strong learning and review culture
  ↓
Small collection of excellent connected articles
  ↓
Public open-source platform
  ↓
Careful expansion to external contributors
```

Do not design v1 around hypothetical internet-scale community features.

Do not add features merely because mature open-source platforms have them.

The first real users are:

1. the founding batch/community;
2. undergraduate Data Science learners;
3. early-career DS/AI practitioners.

---

# 2. Product priorities

When priorities conflict, use this order:

1. **Contributor learning**
2. **Technical rigor**
3. **Reader clarity**
4. **Community participation**
5. **Visual beauty**
6. **Publishing velocity**

Visual beauty is still important. It ranks below learning and rigor, but OpenDS must never look careless, generic, or unfinished.

Publishing slowly is acceptable.

Publishing misleading, shallow, or confusing material is not.

---

# 3. Product personality

OpenDS should feel:

- technical but warm;
- premium but not corporate;
- rigorous but not intimidating;
- playful where interaction helps learning;
- calm and editorial rather than loud or gamified;
- community-driven without feeling like a social feed.

Visual references are conceptual, not templates to copy:

- **Obsidian** for graph-based navigation and backlinks;
- **Distill-style interactive explanations** for learning experiences;
- **Apple editorial restraint** for typography, rhythm, whitespace, and presentation polish.

Avoid visual mimicry. Reproduce the qualities, not the branding.

---

# 4. What OpenDS is and is not

## 4.1 OpenDS is

- a learning community;
- an open-source project;
- a non-profit weekend hobby project;
- a curated learning resource;
- a peer-reviewed publication process;
- a graph of connected concepts;
- a place for interactive educational widgets;
- a place for visual explanations and animations;
- a bridge between fundamentals, papers, and real engineering projects.

## 4.2 OpenDS is not

- a startup;
- a commercial course platform;
- another DataCamp;
- a generic Markdown blog;
- a wiki with instant publishing;
- a leaderboard-driven contribution platform;
- a repository of disconnected tutorials;
- a collection of AI-generated summaries;
- a social network;
- a certification platform;
- a substitute for primary papers or formal textbooks.

---

# 5. Core principles

## 5.1 Learn by teaching

Authors should finish an article understanding the topic better than when they started.

The writing process should expose knowledge gaps rather than hide them.

## 5.2 Peer review by default

A page cannot be marked `curated` without independent review.

Review exists to improve:

- correctness;
- intuition;
- clarity;
- examples;
- terminology;
- connections to other concepts.

Review is collaborative learning, not gatekeeping.

## 5.3 Curated over crowded

A smaller set of excellent, connected pages is more valuable than hundreds of shallow pages.

Prefer depth and coherence over content volume.

## 5.4 Explain ideas, not APIs

Libraries and APIs change.

Conceptual reasoning, assumptions, mathematical structure, trade-offs, and failure modes are more durable.

Implementation sections should support understanding, not dominate it.

## 5.5 Intuition before abstraction

Where reasonable, explain the motivating problem and intuition before introducing formal notation.

Do not oversimplify to the point of technical incorrectness.

## 5.6 Connect knowledge

Every concept exists in relation to other concepts.

A reader should understand:

- what they need to know first;
- where this concept sits;
- what it enables next;
- where it appears in projects and papers.

---

# 6. Content architecture

OpenDS has four first-class content types.

```text
Concepts
Papers
Projects
Cheat Sheets
```

These should remain separate content collections and routes.

They may cross-link heavily.

## 6.1 Concepts

Concept pages explain foundational or practical ideas.

Examples:

- Types of Data
- Exploratory Data Analysis
- Mean, Median, and Mode
- Variance and Standard Deviation
- Correlation
- Train / Validation / Test Split
- Data Leakage
- Prediction Error
- Linear Regression
- Loss Functions
- Gradient Descent
- Decision Trees
- Bagging
- Random Forests
- Boosting
- Neural Networks
- Attention
- Transformers
- Embeddings
- RAG
- LoRA
- Model Evaluation

## 6.2 Papers

Paper pages are accessible deep dives into influential or emerging research.

A paper page should focus on:

- the problem before the paper;
- why the work mattered;
- core contribution;
- intuition;
- method;
- important experiments;
- limitations;
- what changed afterward;
- links to concept pages and projects.

Do not create paper pages that merely paraphrase abstracts.

## 6.3 Projects

Project pages document real systems, experiments, or applications.

A project page should explain:

- problem statement;
- system context;
- architecture;
- design decisions;
- alternatives considered;
- trade-offs;
- evaluation;
- failures and lessons;
- underlying concepts;
- relevant papers.

Projects may be built by OpenDS members or linked with permission/context from external public work.

## 6.4 Cheat Sheets

Cheat sheets are concise revision artifacts.

They should:

- summarize, not replace, concept pages;
- link back to deeper explanations;
- be easy to scan;
- use visual hierarchy carefully;
- avoid pretending that nuance fits in one page.

---

# 7. Concept article philosophy

Concept pages are intended to be meaningful learning experiences, generally around 15–25 minutes of reading/interaction.

They should not be forced into an identical narrative structure.

Authors have narrative freedom.

However, a strong concept page will normally address most of:

- What problem does this solve?
- Why does this concept exist?
- What is the intuition?
- What are the assumptions?
- How does it work?
- What mathematics is necessary?
- How can we explore it interactively?
- How can we implement it?
- When should we use it?
- When does it fail?
- What are common misconceptions?
- What should we learn next?

Do not force headings that create empty, repetitive sections.

Require core outcomes, not rigid prose templates.

---

# 8. Initial learning map

The first public milestone is five polished, connected concept nodes.

The early map should include EDA before formal modeling.

A likely initial progression is:

```text
What Is Data?
  ↓
Types of Data
  ↓
Exploratory Data Analysis
  ├──→ Distributions
  ├──→ Missing Data
  ├──→ Outliers
  └──→ Visualisation
           ↓
Measures of Central Tendency
           ↓
Variance and Spread
           ↓
Correlation
           ↓
Prediction and Error
           ↓
Train / Validation / Test Split
           ↓
Linear Regression
           ↓
Loss Functions
           ↓
Gradient Descent
```

This is not a rigid course sequence.

It is the starting topology of the graph.

The first five polished pages should form a coherent path, not five unrelated topics.

---

# 9. Knowledge graph model

## 9.1 V1 relationship types

Keep v1 intentionally simple.

Use only:

- `prerequisites`
- `partOf`

Generate reverse links automatically.

Examples:

```text
Variance
  prerequisites → Mean

Linear Regression
  prerequisites → Prediction Error
  prerequisites → Correlation

Mean
  partOf → Descriptive Statistics

Linear Regression
  partOf → Supervised Learning
```

Do not introduce many edge types prematurely.

Do not add `related`, `comparedWith`, `appliedIn`, etc. until there is a real navigation need.

Papers and projects should cross-link to concepts using their own typed references, but the core concept graph remains simple in v1.

## 9.2 Graph generation

The graph must be generated from content metadata.

Do not maintain a parallel handwritten graph file containing the same relationships.

Source of truth:

```text
MDX frontmatter
  ↓
Content schema validation
  ↓
Graph generation
  ↓
Graph UI + backlinks + navigation
```

## 9.3 Backlinks

Use both:

- manually curated forward relationships;
- automatically generated reverse relationships.

Example:

If `linear-regression.mdx` declares:

```yaml
prerequisites:
  - prediction-error
```

Then the site automatically knows that `prediction-error` unlocks or leads toward `linear-regression`.

Do not require authors to maintain both directions.

---

# 10. Page information architecture

Every concept page should support three modes of use:

1. **Read deeply**
2. **Explore interactively**
3. **Navigate context**

## 10.1 Desktop layout

Preferred conceptual layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ Global navigation / search / theme                          │
├──────────────┬────────────────────────────┬──────────────────┤
│ Context nav  │ Article                    │ Concept context  │
│              │                            │                  │
│ Map/section  │ Prose                      │ Prerequisites    │
│ nearby nodes │ Visuals                    │ Part of          │
│              │ Widgets                    │ Backlinks        │
│              │ Code/math                  │ Papers           │
│              │                            │ Projects         │
└──────────────┴────────────────────────────┴──────────────────┘
```

Do not make sidebars visually heavy.

The article remains the primary focal point.

## 10.2 Tablet layout

- Preserve article width.
- Collapse left navigation to a drawer or compact rail.
- Keep concept context accessible without shrinking the article excessively.
- Prefer a collapsible context panel below or beside the title area.

## 10.3 Mobile layout

The site must be fully usable from 320px width upward.

On mobile:

- no persistent multi-column layout;
- no graph canvas that requires desktop hover;
- no tiny text;
- no horizontally overflowing equations without a deliberate scroll container;
- no code blocks that break layout;
- no widget controls that require precision mouse interaction.

Preferred mobile order:

```text
Title
Metadata summary
Context chips / prerequisites
Article
Widgets and visuals
References
Backlinks / what next
```

Graph navigation should have a mobile-specific representation:

- searchable list;
- local neighborhood view;
- breadcrumb/context path;
- optional full-screen graph mode.

Never treat the desktop graph as the only navigation mechanism.

---

# 11. Visual design system

## 11.1 General aesthetic

OpenDS should feel calm, deliberate, and highly polished.

Use:

- generous whitespace;
- strong typography;
- restrained color;
- subtle borders;
- clear reading rhythm;
- carefully tuned transitions;
- intentional empty states;
- high-quality diagrams.

Avoid:

- excessive gradients;
- glassmorphism everywhere;
- neon "AI" aesthetics;
- dashboard-card overload;
- cartoonish gamification;
- excessive icons;
- random accent colors;
- visual noise around the article body.

## 11.2 Light and dark themes

Support both light and dark modes.

Default to light mode unless a future product decision changes this.

Both themes must be designed, not merely inverted.

Check:

- text contrast;
- code syntax contrast;
- graph edge visibility;
- chart and widget colors;
- focus rings;
- borders;
- muted text;
- callout surfaces.

Theme choice should respect user/system preference and persist client-side.

## 11.3 Typography

Typography is a first-class product feature.

Requirements:

- comfortable long-form reading measure;
- strong contrast between article title, section headings, body, captions, and metadata;
- readable inline code;
- equations integrated naturally with prose;
- no overly compressed line height;
- no giant hero typography that harms mobile layout.

Prefer a maximum article text width in the approximate 65–75 character range.

Do not hardcode one typography scale for every viewport.

Use fluid responsive typography where appropriate.

## 11.4 Motion

Motion should explain or orient.

Use motion for:

- graph focus transitions;
- expanding context;
- widget state changes;
- conceptual animation;
- smooth page state changes.

Do not add motion merely to make the site feel "modern."

Respect `prefers-reduced-motion`.

---

# 12. Responsive design requirements

Every feature must be evaluated at:

- 320px mobile;
- 375px mobile;
- 768px tablet;
- 1024px small desktop;
- 1440px desktop;
- large widescreen.

Before marking a UI task complete, verify:

- no horizontal page overflow;
- readable text size;
- reachable touch targets;
- visible focus states;
- graph fallback behavior;
- scrollable code and math;
- widgets usable by touch and keyboard where feasible;
- no critical information hidden behind hover.

Use responsive primitives and container-aware design.

Avoid brittle page-specific breakpoints.

---

# 13. Accessibility requirements

Accessibility is part of quality, not a later enhancement.

Minimum requirements:

- semantic HTML;
- keyboard navigation;
- visible focus styles;
- sensible heading hierarchy;
- alt text or textual equivalent for explanatory visuals;
- captions where animation meaning is not obvious;
- sufficient color contrast;
- no color-only meaning;
- reduced-motion support;
- form controls with labels;
- ARIA only where native semantics are insufficient.

Interactive widgets must provide a textual explanation of the learning outcome.

A reader should still learn the concept if animation is disabled.

---

# 14. Technical stack

## 14.1 Core stack

Use:

- Astro
- TypeScript
- MDX
- React islands for interactive components
- Tailwind CSS
- pnpm workspaces
- Turborepo
- GitHub Actions
- Vercel

Do not use Turbopack. Turbopack is a Next.js bundler and is not the monorepo tool for this architecture.

Use Turborepo for task orchestration and caching across workspace packages.

## 14.2 Why Astro

OpenDS is primarily a content-driven website with selective interactivity.

Default behavior:

- static/server-rendered content pages;
- minimal client JavaScript;
- React only where interactivity is necessary;
- progressive enhancement.

Do not hydrate the whole site as a SPA.

## 14.3 Why React islands

Use React for:

- concept widgets;
- graph interaction;
- rich local simulations;
- stateful controls.

Do not use React for static prose layout that Astro can render without hydration.

## 14.4 No database in v1

Do not add a database unless a product requirement genuinely needs one.

V1 sources of truth:

```text
Content          → MDX files
Metadata         → frontmatter
Graph            → generated from metadata
Review history   → GitHub pull requests
Version history  → Git
Contributors     → GitHub + article metadata
Deployment       → Vercel
```

A future database may be justified for:

- accounts;
- bookmarks;
- saved learning progress;
- quiz history;
- comments;
- reactions;
- private community features.

Do not add a database solely to count contributions.

---

# 15. Monorepo structure

Preferred structure:

```text
opends/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   ├── layouts/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── lib/
│       ├── public/
│       └── astro.config.*
│
├── packages/
│   ├── ui/
│   │   └── reusable presentation components
│   ├── widgets/
│   │   └── interactive educational React widgets
│   ├── graph/
│   │   └── graph construction, validation, selectors
│   └── content-schema/
│       └── shared schemas and content types
│
├── content/
│   ├── concepts/
│   ├── papers/
│   ├── projects/
│   └── cheat-sheets/
│
├── animations/
│   ├── src/
│   │   └── Manim source code
│   ├── fonts/
│   ├── render.py
│   │   └── one-command render + web encode
│   └── renders/
│       └── archived rendered masters
│
├── figures/
│   ├── opends.mplstyle
│   ├── opends_plot.py
│   ├── opends-palette.excalidraw
│   └── src/
│       └── committed figure sources per concept
│
├── models/
│   ├── src/
│   │   └── training scripts for model-backed widgets
│   └── weights/
│       └── committed manifest + weights artifacts
│
├── docs/
│   ├── CONTRIBUTING.md
│   ├── WRITE_AN_ARTICLE.md
│   ├── REVIEW_AN_ARTICLE.md
│   ├── MAKE_FIGURES.md
│   ├── MAKE_ANIMATIONS.md
│   ├── BUILD_A_WIDGET.md
│   ├── STYLE_GUIDE.md
│   ├── CONTENT_ROADMAP.md (generated by pnpm roadmap)
│   └── CONTENT_TEMPLATE.mdx
│
├── tooling/
│   ├── content-validation/
│   └── authoring/
│       └── new:concept scaffolder + roadmap generator
│
├── .github/
│   ├── workflows/
│   ├── pull_request_template.md
│   └── CODEOWNERS
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── CLAUDE.md
```

Keep packages purposeful.

Do not create a package for a single file.

Do not over-abstract early.

---

# 16. Package boundaries

## 16.1 `apps/web`

Owns:

- routes;
- page composition;
- Astro layouts;
- global navigation;
- article rendering;
- content queries;
- page-level SEO;
- graph page composition.

It should consume shared packages rather than duplicate them.

## 16.2 `packages/ui`

Owns reusable presentational primitives:

- Button
- Link
- Callout
- Badge
- Tabs
- Dialog
- Drawer
- Tooltip
- CodeBlock shell
- Figure
- Article metadata components

Keep it visually coherent and accessible.

Do not put content-specific business logic here.

## 16.3 `packages/widgets`

Owns educational interactions.

A widget is a learning object, not merely a chart.

Examples:

- MeanMedianOutlierExplorer
- PredictionErrorExplorer
- LossFunctionExplorer
- TrainTestSplitExplorer
- GradientDescentExplorer
- DecisionBoundaryExplorer
- BaggingVarianceSimulation
- BoostingResidualWalkthrough
- AttentionWeightExplorer

## 16.4 `packages/graph`

Owns:

- graph node types;
- edge types;
- graph construction;
- reverse-link generation;
- validation;
- local-neighborhood selectors;
- filtering;
- layout-independent graph data.

Do not couple graph data logic to a specific visualization library.

## 16.5 `packages/content-schema`

Owns shared runtime and TypeScript schemas for:

- concepts;
- papers;
- projects;
- cheat sheets;
- references;
- contributor credits;
- review status.

---

# 17. Content authoring model

## 17.1 Default author experience

Most content contributors should only need to work with:

- MDX;
- Markdown;
- frontmatter;
- images/assets;
- citations/references.

They should not need to know:

- Astro routing internals;
- React;
- graph rendering;
- Vercel configuration;
- Turborepo;
- build system internals.

## 17.2 Mixed technical comfort

Batch-phase decision (July 2026): the docs teach only Path A, since everyone in the founding batch can learn the git workflow. Path B stays a product-level option for later phases, when non-SWE contributors join, and porting a shared-doc draft remains an informal favor until then.

Support both contribution paths:

### Path A — Git + MDX

For contributors comfortable with technical workflows:

```text
Create branch
  ↓
Write/edit MDX
  ↓
Run local checks
  ↓
Open PR
  ↓
Review
  ↓
Merge
```

### Path B — Docs/Notion draft

For non-SWE contributors:

```text
Draft in shared writing tool
  ↓
Content discussion
  ↓
Maintainer or technical contributor ports to MDX
  ↓
PR
  ↓
Preview review
  ↓
Merge
```

Do not force every good DS reviewer to become a frontend engineer.

---

# 18. Content schemas

Use schema validation for all content.

The exact implementation may use Astro content schemas and/or a shared validation package.

## 18.1 Concept metadata

Example:

```yaml
---
title: "Prediction Error"
slug: "prediction-error"
description: "Understand the gap between model predictions and observed outcomes."
status: "under-review"
difficulty: "beginner"
authors:
  - jun-wei
reviewers: []
lastReviewed: null
prerequisites:
  - mean-median-mode
  - variance
partOf:
  - model-evaluation
papers: []
projects: []
cheatSheets: []
tags:
  - fundamentals
  - supervised-learning
---
```

## 18.2 Allowed concept status

```text
draft
under-review
curated
```

Do not invent status values ad hoc.

## 18.3 Contributor credits

Credit meaningful work by role.

Supported page-level credit categories may include:

- authors;
- reviewers;
- widget contributors;
- animation contributors;
- editors.

Do not add scores or rankings.

---

# 19. Interactive widget standards

## 19.1 Purpose

Every widget must teach something specific.

Before building a widget, define:

```text
Learning question:
What should the user understand after interacting?

Control:
What can the user change?

Feedback:
What visibly changes?

Insight:
What relationship becomes obvious?
```

## 19.2 Example

For prediction error:

```text
Learning question:
How does changing a prediction change residuals and aggregate error?

Control:
Drag a regression line or adjust prediction parameters.

Feedback:
Residual lines update in real time.
MAE, MSE, and RMSE update.
Outliers can be added or removed.

Insight:
Squared error penalizes large misses disproportionately.
```

## 19.3 Widget rules

Widgets must:

- be usable without reading implementation details;
- have clear labels;
- explain the learning objective;
- work on touch devices;
- have sensible initial state;
- avoid overwhelming the learner with controls;
- respond immediately;
- be keyboard accessible where feasible;
- include a textual interpretation;
- support dark and light themes;
- respect reduced-motion preferences.

Widgets should not:

- be decorative dashboards;
- expose ten parameters at once without pedagogical reason;
- require a backend when client-side computation is sufficient;
- ship a large ML runtime to the browser without strong justification;
- become isolated mini-products unrelated to the article narrative.

## 19.4 Reusable vs article-specific

Support both:

### Reusable widgets

Examples:

- LossFunctionExplorer
- TrainTestSplitExplorer
- DecisionBoundaryExplorer

### Article-specific interactive stories

Examples:

- WhyMSEPunishesOutliers
- BaggingVarianceSimulation
- BoostingResidualWalkthrough

Prefer reusable primitives internally, but do not force every educational idea into one generic component.

---

# 20. Animation and Manim strategy

Use Manim for polished, canonical explanatory animations.

Examples:

- mean shifting as an outlier moves;
- residuals appearing;
- gradient descent traversing a loss surface;
- bagging sampling process;
- boosting correcting residuals;
- attention weight flow.

Initial policy:

1. Keep Manim source in `animations/src/`.
2. Render manually during v1.
3. Commit or publish optimized web assets.
4. Reference rendered assets from content.
5. Automate rendering only when the workflow pain justifies it.

Do not build Manim CI rendering on day one.

Prefer WebM/MP4 where appropriate rather than using GIF by default.

Always consider:

- file size;
- mobile performance;
- playback controls;
- captions/explanatory text;
- reduced-motion behavior.

---

# 21. Graph UX

The knowledge graph is a major product feature, but it must not overpower the learning experience.

Provide three graph surfaces:

## 21.1 Home/landing exploration

A curated, visually striking overview of the knowledge space.

This should communicate the OpenDS idea quickly.

Do not display every node at once if that creates visual noise.

## 21.2 Dedicated `/map` view

A full exploration surface with:

- search;
- filtering;
- zoom;
- pan;
- keyboard-accessible node selection where feasible;
- local neighborhood focus;
- mobile fallback.

## 21.3 Article mini-graph/context

Each article should show a small local neighborhood:

```text
Prerequisites
  ↓
Current concept
  ↓
Direct downstream concepts
```

This local context is more useful during reading than a giant global graph.

---

# 22. Search and discovery

V1 search should prioritize:

- concept title;
- aliases;
- description;
- headings;
- tags;
- paper/project titles.

Start static-first.

Do not add a hosted search service until content volume requires it.

Search results should show:

- content type;
- title;
- short description;
- relevant context;
- difficulty for concepts.

---

# 23. Contribution workflow

## 23.1 Default ownership model

Initially:

```text
Project maintainer:
- owns merge authority;
- owns architecture consistency;
- owns final product coherence.

Authors:
- own research and explanation.

Reviewers:
- own independent content critique.

SWE contributors:
- own widgets, UI, graph, tooling, or infrastructure.

Visual contributors:
- own diagrams and animations.
```

One person may hold multiple roles on a PR.

The original author must not be the only reviewer of their own article.

## 23.2 Standard content PR

```text
Branch
  ↓
Write article + metadata
  ↓
Add visual/widget integration if needed
  ↓
Open PR
  ↓
CI validation
  ↓
Vercel preview
  ↓
Content review
  ↓
Revision
  ↓
Approval
  ↓
Maintainer merge
  ↓
Production deploy
```

## 23.3 Review attachment

Peer review should be represented in both:

- GitHub PR history;
- article metadata/credits after acceptance.

The GitHub PR is the audit trail.

The article metadata is the public-facing acknowledgement.

---

# 24. Peer review rules

## 24.1 Minimum review rule

A page may become `curated` only after at least one independent reviewer approval.

The number and type of reviewers may vary by topic.

Examples:

- a simple fundamentals page may need one strong reviewer;
- a mathematically dense page may need a technical specialist;
- a complex modern AI page may benefit from multiple reviewers.

Do not encode rigid two-reviewer bureaucracy into v1.

## 24.2 Review dimensions

Reviewers should assess:

### Technical correctness

- Are claims correct?
- Are assumptions stated?
- Are simplifications safe?
- Is notation consistent?
- Does code match the explanation?

### Intuition

- Does the explanation build a real mental model?
- Does the analogy break under common cases?
- Is the reader told why the concept matters?

### Clarity

- Does the article flow?
- Are new terms introduced before use?
- Are examples concrete?
- Are sections doing distinct work?

### Completeness

- Are important failure modes covered?
- Are prerequisites correct?
- Are important links missing?
- Are references appropriate?

## 24.3 Review culture

Feedback should be:

- specific;
- respectful;
- evidence-based;
- open to disagreement;
- focused on the work.

The project values curiosity over ego.

---

# 25. Community recognition philosophy

Do not add contribution leaderboards.

Do not rank people by:

- commits;
- lines changed;
- PR count;
- article count;
- review count.

These metrics create incentives that conflict with deep learning and thoughtful review.

Prefer collective project milestones:

- concepts curated;
- papers explained;
- widgets published;
- peer reviews completed;
- animations produced;
- graph nodes connected.

Credit individuals qualitatively on the work they contributed to.

Celebrate:

```text
What we built together
```

not:

```text
Who is winning
```

---

# 26. CI/CD requirements

## 26.1 Pull request CI

Every PR should run, at minimum:

1. dependency installation;
2. formatting check;
3. linting;
4. TypeScript typecheck;
5. content schema validation;
6. graph validation;
7. internal link validation;
8. unit tests;
9. production build.

For relevant UI changes, add browser tests or visual checks as the project matures.

## 26.2 Graph validation

CI must fail on:

- missing prerequisite slug;
- missing `partOf` target;
- duplicate slug;
- self-reference;
- impossible or invalid content type reference;
- graph cycles only if the specific edge semantics forbid them.

Be careful with cycles.

A `prerequisites` graph generally should not contain dependency cycles.

A `partOf` hierarchy should not contain ancestry cycles.

## 26.3 Vercel workflow

Expected lifecycle:

```text
PR opened/updated
  ↓
CI checks
  ↓
Vercel preview deployment
  ↓
Reviewers inspect live page
  ↓
Approval
  ↓
Maintainer merge to main
  ↓
Production deployment
```

Do not merge failed CI.

Do not rely only on local manual checks.

---

# 27. Testing strategy

## 27.1 Unit tests

Use unit tests for:

- graph construction;
- backlink generation;
- schema helpers;
- selectors;
- widget calculation logic;
- utility functions.

## 27.2 Component tests

Use component tests where interaction logic is meaningful.

Examples:

- slider changes update metric output;
- toggling outlier updates visualization;
- keyboard interaction works;
- theme behavior remains valid.

## 27.3 End-to-end tests

Use Playwright for critical flows:

- home → concept page;
- search → result → article;
- graph → node → article;
- mobile navigation;
- theme switching;
- article links;
- interactive widget smoke tests.

Do not E2E-test every paragraph.

## 27.4 Visual regression

Add visual regression selectively after the design system stabilizes.

Focus on:

- home page;
- concept page;
- map view;
- widget shells;
- mobile layouts.

---

# 28. Developer experience

The repository should be easy to start.

Provide obvious root commands.

Target command surface:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm validate:content
pnpm validate:graph
pnpm check:links
```

Use Turborepo to orchestrate workspace tasks where appropriate.

Keep commands discoverable in the root `package.json`.

Avoid requiring developers to remember deep package-specific commands for normal work.

---

# 29. Documentation requirements

Maintain these documents:

## `README.md`

For:

- what OpenDS is;
- why it exists;
- quick start;
- repository map;
- links to contribution guides.

## `docs/CONTRIBUTING.md`

The entry point and index. For:

- local setup,
- the golden path (branch, scaffold, validate, PR),
- article lifecycle and statuses,
- the AI rule (defend every claim),
- links to the task playbooks below.

## Task playbooks

Docs are organized as start-to-finish recipes, one per kind of work
(decided July 2026, docs are written for the founding batch):

- `docs/WRITE_AN_ARTICLE.md`: pick a topic, scaffold with `pnpm new:concept`, write, PR, review, merge.
- `docs/REVIEW_AN_ARTICLE.md`: review mechanics, the four assessment dimensions, probing understanding (authors may use AI, reviewers verify the human can defend the claims), approval rules.
- `docs/MAKE_FIGURES.md`: Excalidraw diagrams and matplotlib plots, palette, export settings, committed sources under `figures/src/`.
- `docs/MAKE_ANIMATIONS.md`: Manim cookbook covering scene conventions, `pnpm render:animation`, the size budget, and embedding.
- `docs/BUILD_A_WIDGET.md`: widget bar, package boundaries, model-backed widget pipeline.

## `docs/STYLE_GUIDE.md`

For:

- writing voice;
- terminology;
- article philosophy;
- use of intuition;
- equations;
- code examples;
- references.

## `docs/CONTENT_TEMPLATE.mdx`

A useful starter, not a rigid mandatory skeleton.

---

# 30. SEO and metadata

Public pages should include appropriate:

- title;
- description;
- canonical URL;
- Open Graph metadata;
- structured heading hierarchy;
- sensible social preview image behavior.

Do not allow SEO concerns to distort article quality.

The primary audience is humans.

---

# 31. Performance principles

OpenDS should remain fast despite rich learning experiences.

Rules:

- static-first;
- hydrate only interactive islands;
- lazy-load heavy widgets below the fold;
- optimize images;
- prefer video over large GIFs;
- avoid shipping unused visualization libraries site-wide;
- code-split heavy interactive components;
- keep graph rendering isolated from article rendering;
- measure bundle cost before adding large dependencies.

Do not introduce a heavy library when a small focused implementation is sufficient.

---

# 32. State management

Prefer local component state for widgets.

Do not add a global state library without a demonstrated cross-page or cross-component need.

Graph exploration may have URL-addressable state for:

- selected node;
- filters;
- search query;
- focused neighborhood.

Prefer shareable URLs where useful.

---

# 33. Data and privacy

V1 should collect as little user data as possible.

Without accounts, do not invent profile systems.

If analytics are later added:

- prefer privacy-conscious measurement;
- document what is collected;
- avoid invasive tracking;
- do not use personal analytics to rank contributors.

---

# 34. Implementation phases

## Phase 0 — Foundation

Goal: make contribution and quality enforcement possible.

Build:

- monorepo;
- Astro app;
- pnpm workspace;
- Turborepo task orchestration;
- TypeScript;
- styling foundation;
- content collections;
- schemas;
- basic CI;
- Vercel deployment;
- docs skeleton.

## Phase 1 — Editorial shell

Goal: make one article feel excellent.

Build:

- global navigation;
- article layout;
- typography system;
- light/dark themes;
- code rendering;
- equation rendering;
- figures/captions;
- callouts;
- mobile behavior;
- article metadata;
- credits and review status.

Do not proceed to a giant graph before the reading experience is strong.

## Phase 2 — Five-node learning chain

Goal: prove the content model.

Publish five connected concept pages.

Include EDA in the early learning journey.

Use real peer review.

Validate that non-SWE contributors can participate.

## Phase 3 — First widgets

Build two strong educational widgets.

Recommended candidates:

1. Mean/median/outlier explorer
2. Prediction error / MAE vs MSE explorer

The widgets should prove the pedagogical interaction model.

## Phase 4 — Graph navigation

Build:

- local article graph;
- backlinks;
- dedicated map;
- search;
- mobile fallback.

Graph functionality must be useful, not merely impressive.

## Phase 5 — Paper and project layers

Add first-class paper and project pages.

Cross-link them to concept nodes.

Example:

```text
Attention
  ↔ Attention Is All You Need
  ↔ Transformer concept
  ↔ project using transformer architecture
```

## Phase 6 — Community expansion

Only after the contribution system works internally:

- improve external contributor docs;
- issue templates;
- public roadmap;
- good-first-issue labels;
- contributor onboarding.

Do not optimize for external scale before the founding batch has proven the culture.

---

# 35. MVP definition

The first meaningful release is:

- visually polished responsive landing page;
- strong article template;
- light and dark themes;
- five connected concept pages;
- peer-review metadata;
- local graph context;
- dedicated map prototype;
- two educational widgets;
- at least one Manim animation;
- contributor guide;
- style guide;
- review guide;
- CI validation;
- Vercel preview workflow;
- production deployment.

The MVP is not "all of Data Science."

The MVP proves:

1. the community can learn together;
2. the content can be curated;
3. the site can teach beautifully;
4. the graph can connect ideas;
5. contributors do not need deep SWE knowledge.

---

# 36. Coding standards

General defaults:

- TypeScript strict mode;
- explicit types at public package boundaries;
- small focused components;
- pure functions for graph transformations;
- no `any` without justification;
- no duplicated content relationship logic;
- no hidden mutation in graph utilities;
- prefer composition over giant configurable components;
- keep educational math logic separate from presentation where possible.

Before adding a dependency:

1. identify the need;
2. check if an existing dependency already solves it;
3. evaluate bundle impact for client-side code;
4. prefer narrow dependencies over giant frameworks.

---

# 37. Component conventions

## 37.1 Astro components

Use Astro for:

- static layout;
- prose wrappers;
- metadata blocks;
- server/static content composition;
- non-interactive navigation primitives.

## 37.2 React components

Use React when:

- state is required;
- user interaction changes the visualization;
- graph exploration requires client behavior;
- simulation or rich controls are necessary.

Do not convert static Astro components into React by default.

## 37.3 Styling

Use shared design tokens and reusable component patterns.

Avoid one-off arbitrary styling that causes drift.

Create coherent primitives for:

- spacing;
- radius;
- typography;
- surface;
- border;
- interactive state;
- semantic feedback.

The design system should support both themes.

---

# 38. Content-to-code boundary

A content contributor should be able to embed a widget with a simple MDX interface.

Example:

```mdx
<PredictionErrorExplorer
  mode="regression-line"
  showMetrics={["mae", "mse", "rmse"]}
/>
```

Avoid making authors provide internal chart config objects, pixel coordinates, or application wiring.

For advanced article-specific experiences, a developer may create a dedicated component with a simple author-facing API.

---

# 39. Article reference policy

Prefer authoritative references:

- original papers;
- official technical documentation;
- respected textbooks;
- high-quality primary sources.

Do not fill reference lists with low-value SEO articles.

References should help readers go deeper.

Do not use references decoratively.

---

# 40. AI-assisted content policy

AI tools may assist with:

- brainstorming;
- rewriting;
- code scaffolding;
- visual prototyping;
- review support.

But AI-generated content must not bypass human understanding or peer review.

An OpenDS author should be able to defend and explain claims in their article.

Do not publish unverified AI-generated explanations, derivations, references, or citations.

The purpose of OpenDS is learning, not maximizing content throughput.

---

# 41. Anti-patterns

Claude must actively avoid the following.

## Product anti-patterns

- turning OpenDS into a generic blog;
- building a full LMS;
- adding user accounts without a strong reason;
- gamifying contribution;
- adding leaderboards;
- designing around vanity metrics;
- expanding scope before the first five-node chain works.

## Architecture anti-patterns

- database-first architecture;
- backend services without need;
- microservices;
- duplicated graph state;
- manually maintaining forward and reverse links;
- hydrating the entire site;
- using React for static prose;
- excessive package fragmentation;
- giant global state stores.

## UI anti-patterns

- unreadable glassmorphism;
- neon AI aesthetic;
- dashboard-card overload;
- graph canvas as the only navigation;
- desktop-only hover interactions;
- tiny mobile controls;
- animation without educational purpose;
- unoptimized GIF-heavy pages.

## Content anti-patterns

- shallow listicles;
- API tutorials pretending to be conceptual teaching;
- rigid identical article structure;
- excessive jargon;
- unexplained notation;
- claims without support;
- AI-generated filler;
- paper summaries with no motivation or critique.

---

# 42. Decision rules for Claude Code

When implementing a feature, ask in this order:

1. Does this help contributors learn?
2. Does this improve technical rigor or reader clarity?
3. Can it remain static-first?
4. Can the content author avoid touching application code?
5. Can the reviewer evaluate the content through a preview?
6. Does this work well on mobile?
7. Is the feature accessible?
8. Is there a simpler implementation?
9. Does this preserve visual coherence?
10. Is this needed for the current phase?

If the answer to the last question is no, prefer documenting the future idea instead of implementing it now.

---

# 43. First build target

When bootstrapping the repository, implement in this order:

1. pnpm workspace;
2. Turborepo;
3. Astro app;
4. React integration;
5. Tailwind setup;
6. TypeScript strictness;
7. root scripts;
8. content collections;
9. content schemas;
10. article route;
11. article layout;
12. theme system;
13. responsive navigation shell;
14. initial concept metadata;
15. graph package data model;
16. graph validation;
17. CI workflow;
18. Vercel deployment;
19. first content PR workflow;
20. first widget.

Do not start with a sophisticated force-directed graph.

The reading experience and contribution loop come first.

---

# 44. Initial repository deliverables

A good first infrastructure PR should contain:

```text
- working monorepo
- apps/web boots successfully
- shared packages resolve correctly
- root dev/build/lint/typecheck commands work
- one example concept MDX page
- schema validation
- one responsive article layout
- light/dark theme foundation
- CI workflow
- Vercel-ready build configuration
- README quick start
- CONTRIBUTING skeleton
```

Do not attempt the entire product in the first PR.

---

# 45. Definition of done for frontend work

A frontend task is not done until:

- it works in light mode;
- it works in dark mode;
- it is responsive;
- it has no page-level horizontal overflow;
- keyboard behavior is reasonable;
- focus states are visible;
- reduced-motion behavior is considered;
- loading and empty states are intentional where relevant;
- no unnecessary client JavaScript is shipped;
- it follows the shared design system.

---

# 46. Definition of done for content features

A content-system task is not done until:

- metadata is schema-validated;
- invalid references fail clearly;
- authors receive actionable error messages;
- graph relationships update automatically;
- reverse links do not require manual duplication;
- content contributors do not need to modify app routing for a normal page;
- preview deployments render the page correctly.

---

# 47. Definition of done for widgets

A widget is not done until:

- it has a defined learning objective;
- its controls are understandable;
- state changes are immediate and interpretable;
- it works on touch screens;
- it has a usable narrow layout;
- it has explanatory text;
- it supports both themes;
- it does not depend on hover alone;
- its core calculations are tested;
- its client bundle cost is acceptable.

---

# 48. Naming and voice

Product name:

**OpenDS**

Preferred tagline:

**Learning Data Science by teaching it.**

Alternative explanatory phrase:

**A peer-reviewed, open-source knowledge graph for learning Data Science and AI together.**

Voice:

- direct;
- thoughtful;
- humble;
- curious;
- technically precise;
- not promotional;
- not grandiose.

Do not claim OpenDS is the definitive way to learn Data Science.

The project should openly reflect that contributors are learning too.

---

# 49. Community success model

OpenDS succeeds when:

- contributors understand concepts more deeply;
- reviews contain genuine technical discussion;
- article quality improves through collaboration;
- readers can navigate concepts meaningfully;
- the batch develops a lasting technical learning culture;
- new contributors can join without lowering standards.

The long-term aspiration is that the community grows into a group of strong DS/AI practitioners who helped one another improve and left behind a concrete, trustworthy learning platform.

The reputation should emerge from the work.

Do not engineer the product around status-seeking.

---

# 50. Final principle

When uncertain, return to this:

> OpenDS is a community learning system first, a curated publication second, and a knowledge graph interface third.

The technology exists to support the community.

The graph exists to support understanding.

The visuals exist to make intuition visible.

The review process exists to help contributors learn and to make the published work trustworthy.

Build accordingly.
