# Review an article

Review is collaborative learning, not gatekeeping. Done right, the reviewer
also finishes understanding the topic better. Approving means one thing: I
would be comfortable if a learner trusted this page.

## Mechanics

1. Open the PR. CI posts a preview deployment, read the article there as a
   reader would, not in the diff view. No preview link? Check out the
   branch and `pnpm dev`.
2. Line-level comments go on the PR in Files changed. Big-picture points go
   in a top-level PR comment. Keep the reasoning on GitHub even if you also
   talk in the chat, the PR is the audit trail.
3. The author pushes revisions to the same branch. The preview updates.
4. When you are satisfied, approve the PR. The author then records you in
   the article's `reviewers` list and sets `lastReviewed`.

An article can only become curated with approval from at least one reviewer
who is not one of its authors. Validation enforces this, you cannot forget.

## What to assess

**Technical correctness**

- Are the claims correct? Are assumptions stated?
- Are simplifications safe, or do they mislead?
- Is notation consistent? Does the code match the explanation?

**Intuition**

- Does the explanation build a real mental model?
- Does the analogy break under common cases? Say where.
- Is the reader told why the concept matters?

**Clarity**

- Does the article flow? Are new terms introduced before use?
- Are the examples concrete? Does the running example carry through?
- Is each section doing distinct work?

**Completeness**

- Are important failure modes covered?
- Are the declared prerequisites actually the right ones?
- Would this page prepare someone for interview questions on the topic?

## Probe the understanding, not the prose

Authors can and do use AI to help write. That is allowed. What is not
allowed is publishing something the author does not actually understand,
so probing is your job, and the author knows to expect it:

- Pick two or three load-bearing claims and ask why they are true.
- Ask what happens in an edge case the article does not cover.
- If a derivation is sketched, ask for the skipped step.
- Well-polished prose with vague answers underneath is a red flag.
  Smooth writing is not evidence of understanding.

This is not hazing. The whole premise of the project is that explaining
under challenge is how the understanding becomes real, for both of you.

## How to give feedback

- Be specific: point to the sentence, propose an alternative when you can.
- Be evidence-based: link a source when you challenge a claim.
- Be open to disagreement: "I read this differently, here is why" beats
  "this is wrong".
- Curiosity over ego, on both sides. Genuine questions are good review
  comments, you do not need to already know the answer to raise a doubt.
