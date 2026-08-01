# Running handover

Append new entries at the top beneath this introduction. Do not rewrite older entries; supersede them explicitly.

## 2026-08-01 - Codex project consolidation

### Objective

Make this repository the canonical home for the balcony planter riser project and prepare a clean collaboration path for the owner and housemate.

### Current decisions

- Owner measurements take priority. Values the housemate sourced from the product listing are classified as retailer/listing-derived, not as a separate measurement class.
- Existing planter envelope is modelled as 900 x 450 x 300 mm, with 50 x 50 mm posts and 40 mm rails.
- The riser uses 90 x 45 top bearers, 70 x 35 uprights/top joists, and a provisional 45 x 35 lower frame.
- The rear structural sheet and triangular side gussets provide racking resistance.
- Planter posts retain direct bearing; concealed straps provide lateral/uplift restraint.
- The litter enclosure is provisional: two 350 x 330 x 110 mm tray envelopes, removable floor, side linings, lift-up front hatch, and 230 mm cat flap.
- Six-millimetre isolation pads are the default. Adjustable feet are optional for balcony fall.

### Canonical files

- `models/planter-stand-model.html`
- `model-spec.json`
- `deliverables/bom/planter-riser-bom.xlsx`

### Sources retained

- Original dimension image is preserved at `references/planter_box_dimensions.png` with an identical file hash.
- Owner sketches live in `references/sketches/`.
- Original imported handoff archive remains under `handoff/`.
- Personal `3d-printing-brief.md` was copied to the owner's Desktop and is intentionally removed from the project repository.

### Verification

- Interactive model script passes JavaScript syntax checking.
- BOM workbook was regenerated and visually checked across all sheets.
- Model component IDs and BOM groupings were reconciled.

### Unresolved

- Saturated planter mass and balcony load capacity.
- Actual litter-tray dimensions.
- Exact lower-frame timber, connectors, straps, hatch hardware, cat flap, and isolation-pad products.
- Whether drilling the existing planter posts is acceptable.
- Final enclosure ventilation, waterproof liner, finishes, and hatch stays.

### Recommended next action

Housemate should branch from the consolidated project branch, add previous planning sources under `references/housemate/`, update this log, and propose model/spec changes through a pull request without replacing owner-confirmed measurements.
