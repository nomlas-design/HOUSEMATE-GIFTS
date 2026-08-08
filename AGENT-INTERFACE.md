# Agent collaboration interface

This document coordinates work between Zeph’s local agents and Dec’s agents in the shared `HOUSEMATE-GIFTS` repository.

## Canonical repository

- Remote: `https://github.com/nomlas-design/HOUSEMATE-GIFTS`
- Zeph’s canonical local checkout: `C:\Users\zephm\proj\home build\HOUSEMATE-GIFTS`
- Default branch: `main`

Start work by updating from `main` and checking for local changes. Finish with a clean working tree and a concise handover describing changed paths, decisions, unresolved questions and required follow-up. Do not force-push shared history.

## Current contribution boundaries

- `balcony-planter-riser/` contains the current planter-riser and litter-cabinet project.
- `livingroom-balcony` and `og-balcony` are currently broken Git-link entries: they have no `.gitmodules` mapping and their referenced commits are unavailable in this repository.
- Dec will supply the real project contents and combine the three projects into one unified project.

Until that unification is ready, do not remove, rename or archive the three project entries without an explicit handover.

## Unification handover

Dec’s agent should:

1. Replace the broken Git links with recoverable source content.
2. Add the unified project as an ordinary repository folder unless a documented submodule arrangement is intentionally chosen.
3. Verify that the unified project preserves all required source files, references, deliverables and history/provenance notes.
4. Record the new canonical project path and any changed build or publication workflow here.
5. Only after verification, move the three pre-unification projects under `archive/pre-unification/`.

## Archive policy

- `archive/3d-printing-brief.md` is retained personal planning material from the original repository history.
- Archived projects are reference-only and should not be treated as current sources of truth.
- Do not duplicate generated dependencies or build output in the archive.
