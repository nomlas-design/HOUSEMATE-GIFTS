# Running handover

Append new entries at the top beneath this introduction. Do not rewrite older entries; supersede them explicitly.

## 2026-08-02 - Increased direct-bearing uprights to 70 x 70

### Objective

Ensure the existing 50 x 50 planter feet sit fully within the uprights rather than spilling over a 70 x 35 bearing surface.

### Changes

- Changed LG-01 through LG-04 from 70 x 35 to 70 x 70 while retaining their 514 mm cut length and direct-bearing role.
- Aligned the square uprights to the planter envelope outer faces, giving each foot 20 mm total additional bearing in both plan directions without shifting the planter.
- Increased the default isolation pads to 70 x 70.
- Split the timber purchase plan into one 2.4 m length of 70 x 70 post stock and two 2.4 m lengths of 70 x 35 rail stock.
- Synchronized the interactive model, specification, BOM and published-site copy.

### Verification and unresolved

- The 50 x 50 planter feet are fully contained by the 70 x 70 upright tops in plan.
- Exact 70 x 70 treated-post catalogue SKU, timber grade, wet planter load, connectors and balcony capacity remain to be confirmed.

## 2026-08-02 - Matched TB-01 and TB-02

### Objective

Make the front and rear upper ties identical and remove unnecessary 90 x 45 framing.

### Changes

- Changed TB-01 from a 900 x 90 x 45 front bearer to a 760 x 70 x 35 non-bearing front upper tie matching TB-02.
- Kept all four planter feet in direct bearing through LG-01 to LG-04; both upper ties now sit between the uprights.
- Lengthened TJ-01 to TJ-03 to 380 mm so they meet the two 35 mm-thick ties without gaps.
- Shortened LG-01 to LG-04 to 514 mm above the default 6 mm pads, preserving 450 mm clear space below the upper ties.
- Removed the obsolete beam-depth slider and the dormant legacy 90 x 45 model block.
- Revised the purchase plan to three 2.4 m lengths of 70 x 35; no 90 x 45 framing remains.
- Regenerated the XLSX BOM and resynced the native Google Drive BOM, including its table ranges and total row.

### Verification and unresolved

- Model and published-site source use matching TB geometry.
- Local workbook formula scan and Google Sheet `#REF!` scans returned no errors.
- This remains exploratory: timber grade, wet planter load, connector schedule and balcony capacity still require confirmation.

## 2026-08-02 - Published model BOM link

### Objective

Connect the component popup in the published 3D model to the collaborative Google Drive BOM.

### Changes

- Made `Open BOM in Google Drive` the primary BOM link in both the canonical model and published-site copy.
- Kept a separate `Download XLSX` link for the packaged workbook.
- Recorded the Drive BOM URL in `model-spec.json`.

### Verification

- Confirmed the canonical and published model copies contain the same Google Drive sheet URL.

## 2026-08-02 - Uniform direct-bearing uprights and three-section frame

### Changes

- Extended LG-01 and LG-03 to match LG-02 and LG-04: all four 70 x 35 uprights are 534 mm above the default 6 mm pads and bear directly under the planter feet.
- Raised TB-02 to joist level and changed it from 45 x 35 to 70 x 35 while retaining its role as a tie rather than a planter bearing member.
- Lengthened TJ-01 through TJ-03 from 360 mm to 370 mm so they meet TB-01 and TB-02 without the previous 10 mm gap.
- Reduced the main frame to three timber sections: 90 x 45, 70 x 35 and 45 x 35; the lightweight 42 x 19 hatch remains non-structural trim.
- Re-optimised the cut plan: two 2.4 m lengths of 70 x 35 and one 2.4 m length of 45 x 35 still cover their respective frame components.

## 2026-08-02 - Package moved under a contribution subfolder

### Objective

Segregate the planter project from other contributions in the shared repository.

### Changes

- Moved the complete working package under `balcony-planter-riser/`, including the model, specification, BOM, references, handover files, tools, and publishable site source.
- Kept repository-wide files such as `.github/`, `AGENTS.md`, `.gitignore`, and the root pointer README at repository root.
- Updated repository-level collaboration paths to point into the new package folder.

### Continuation

Run project tools from `balcony-planter-riser/`; relative paths inside the package remain unchanged.

## 2026-08-02 - Direct rear bearing and unified cabinet walls

### Objective

Remove TB-02 from the planter load path and eliminate duplicate side-wall/gusset layers.

### Changes

- Changed TB-02 from a 900 x 90 x 45 rear bearer to a 760 x 45 x 35 non-bearing rear upper tie.
- Extended rear uprights LG-02 and LG-04 from the isolation pads directly to the rear planter feet; the front feet continue to bear through TB-01.
- Replaced SG-01 and SG-02 with full structural side walls WL-01 and WL-02. Together with rear wall SP-01, the cabinet walls now provide the conceptual racking restraint.
- Synchronized component descriptions, material categories, catalogue mapping, and the provisional cutting plan.
- Resynced the native Google Drive BOM in place.
- Published the interactive package privately at `https://balcony-planter-riser-model.zephstep.chatgpt.site` and sent the URL to the owner's Gmail account.

### Verification and unresolved

- The model remains exploratory. Final wall edge support, fixing schedule, ventilation openings, wet planter load, timber grade, and balcony capacity require confirmation before construction.

## 2026-08-02 - Category visibility and hardware reconciliation

### Objective

Make the model easy to strip back visually to the structural timber frame and restore hardware as explicit, traceable components.

### Changes

- Added viewer categories for main frame, structural panels, hatch/access, litter fit-out, hardware/fixings, isolation/feet, and existing/context objects.
- Added `Main frame only` and `Show all categories` presets. The frame-only preset hides plywood, hatch, fit-out, hardware, feet/pads, planter, trellis, and cat indicator, and recentres the camera on the timber frame.
- Restored distinct model/BOM identities for the continuous hinge (`HN-01`), latch (`HL-01`), hatch stays (`HS-01`–`HS-02`), joist connector screws (`JF-01`–`JF-12`), and strap bolts (`SB-01`–`SB-08`).
- Added a `Category` column to the BOM and synchronized the category contract in `model-spec.json`.

### Verification

- Model module syntax checked successfully.
- Browser-tested the all-category, main-frame-only, and frame-plus-hardware states.
- BOM regenerated; all four sheets rendered and visually reviewed.
- BOM formula scan returned no errors.

### Unresolved

- Exact hatch latch and stay products remain TBC.
- Final connector and fixing quantities must follow the selected manufacturer's schedule rather than the conceptual model count.

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
