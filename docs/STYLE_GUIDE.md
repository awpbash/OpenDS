# Style guide

How OpenDS articles sound and read. This guide grows as articles go through review and we learn what advice we actually need. The step-by-step writing flow lives in [WRITE_AN_ARTICLE.md](WRITE_AN_ARTICLE.md).

## Voice

- Direct, thoughtful, humble, technically precise.
- Write like you are explaining to a smart friend, not lecturing a class.
- It is fine to say "this confused us at first" when it did. The project openly reflects that contributors are learning too.

## Structure

- Intuition before abstraction: motivate the problem before introducing notation.
- Do not oversimplify into technical incorrectness. If a simplification hides something important, say so.
- Introduce every term before you use it.
- No forced headings. Empty ritual sections are worse than missing ones.

## Mathematics

- Inline math with `$...$`, display math with `$$...$$` (KaTeX).
- Every symbol gets introduced in prose near where it first appears.
- Prefer one worked numeric example over three abstract identities.

## Code

- Code supports understanding, it does not replace it. Explain the idea first.
- Keep examples short, runnable, and idiomatic Python unless the topic demands otherwise.
- No API tutorials disguised as concept articles.

## References

- Prefer original papers, official documentation, respected textbooks.
- References exist to help readers go deeper, not to decorate.

## Formatting details

- Article status, difficulty, authors, and relationships live in frontmatter, never in prose.
- Figures get captions that state what to notice, not what the figure is.
- Callouts (blockquotes) are for warnings, misconceptions, and key takeaways. Use sparingly.
