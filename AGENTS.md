# Project collaboration instructions

This repository is shared by Zeph and Dec for home-design projects. `AGENTS.md` is the single repository-level source of working instructions for people and agents. Machine-specific instructions belong outside the repository.

## Repository workflow

- Remote: `https://github.com/nomlas-design/HOUSEMATE-GIFTS`
- Default branch: `main`
- Start by updating from `main` and checking the working tree.
- Use a short-lived branch for changes. Push and open a pull request, but do not merge unless the user explicitly instructs you to merge that pull request.
- Never force-push shared history.
- Finish with a concise handover listing changed paths, decisions, unresolved questions and required follow-up.

## Current project boundaries

- `balcony-planter-riser/` contains the planter-riser and enclosed litter-tray cabinet project.
- `livingroom-balcony` and `og-balcony` are legacy Git-link entries. They have no `.gitmodules` mapping and their referenced source is not available through this repository.
- Dec intends to supply the source and combine the three projects into one unified project.

Do not remove, rename or archive these three project entries until the unified replacement has been added, verified and explicitly handed over.

## Balcony planter riser

Before changing the design:

1. Read `balcony-planter-riser/PROJECT.md`, `balcony-planter-riser/model-spec.json`, and the latest entry in `balcony-planter-riser/handoff/HANDOVER.md`.
2. Treat owner measurements as authoritative. Dimensions supplied by a product listing are retailer/listing-derived, regardless of which contributor recorded them.
3. Keep `balcony-planter-riser/models/planter-stand-model.html`, `balcony-planter-riser/model-spec.json`, and `balcony-planter-riser/deliverables/bom/planter-riser-bom.xlsx` consistent whenever component geometry or IDs change.
4. Put new source photographs and sketches under `balcony-planter-riser/references/`. Use `balcony-planter-riser/references/housemate/` where contributor provenance would otherwise be unclear.
5. Append a concise entry to `balcony-planter-riser/handoff/HANDOVER.md` before handing work to another person or agent.
6. Do not treat this exploratory design as structural certification. Keep unknown loads, fasteners, balcony capacity and unconfirmed products explicit.

## Unification handover

When Dec supplies the unified project:

1. Replace the legacy Git links with recoverable source content.
2. Add the unified project as an ordinary repository folder unless a documented submodule arrangement is intentionally chosen.
3. Verify that all required source files, references, deliverables and provenance notes are preserved.
4. Update this file and `README.md` with the new canonical project path and any changed build or publication workflow.
5. Only after verification and explicit approval, move the three pre-unification projects under `archive/pre-unification/`.

## Archive policy

- `archive/3d-printing-brief.md` is retained personal planning material.
- Archived projects are reference-only and are not current sources of truth.
- Do not archive generated dependencies or build output.
