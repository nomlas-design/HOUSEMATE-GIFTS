# Handover protocol

This folder is the interface between the owner, the housemate, and any model or coding assistant working on the design.

## Start of a work session

1. Read `../PROJECT.md`, `../model-spec.json`, and the newest entry in `HANDOVER.md`.
2. Check the branch and working-tree status.
3. Open the interactive model and verify the components relevant to the task.

## While working

- Use owner measurements first and record the source/confidence of new dimensions.
- Keep model component IDs aligned with the BOM.
- Put new housemate research in `../references/housemate/`.
- Preserve source provenance instead of silently replacing another contributor's files.

## Before handing over

Append one entry to `HANDOVER.md` with the date, contributor, objective, decisions, files changed, verification, unresolved questions, and recommended next action. Then open a focused pull request and state whether the model, specification, BOM, sources, and handover log remain synchronized.
