# Balcony planter riser project

This repository is dedicated to the planter riser, its planter/trellis model, and the provisional enclosed litter-tray fit-out.

## Current working files

- Interactive model: `models/planter-stand-model.html`
- Model specification: `model-spec.json`
- Component BOM: `deliverables/bom/planter-riser-bom.xlsx`
- Project handover and design questions: `START-HERE.md`

## Folder layout

- `models/` — current interactive 3D model.
- `models/archive/` — original handover model and its source fragment.
- `references/` — supplied product dimensions and hand-drawn structural sketches.
- `deliverables/bom/` — current BOM workbook plus its preview and verification output.
- `handoff/` — untouched original handoff archive.
- `tools/` — reproducible BOM-building utility.

## Measurement priority

Use the owner's hand measurements where available. Dimensions sourced from the retail listing fill gaps and are labelled listing-derived. The planter box and its attached trellis are existing separate objects; the timber riser is the new structure being designed.

## Current design status

The model is exploratory, not a construction-certified design. Timber grade, maximum wet planter load, final connectors, attachment to the existing planter, cut optimisation and balcony capacity remain to be confirmed.

## Collaboration interface

- `model-spec.json` is the machine-readable design contract.
- `handoff/HANDOVER.md` is the running human/model handover record.
- `handoff/README.md` defines how to start, finish, and transfer a work session.
- The interactive model, specification, and BOM must stay synchronized.
- Housemate planning sources should be added under `references/housemate/` with provenance intact.
- New work should arrive through a focused branch and pull request using the repository template.
