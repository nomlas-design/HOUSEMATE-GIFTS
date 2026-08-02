# Planter riser project orientation

## Goal

Design a compact, buildable frame that raises the existing balcony planter and forms a provisional enclosed cabinet for two litter trays beneath it.

## Confirmed owner geometry

- Planter envelope: approximately **900 x 450 x 300 mm**.
- Existing corner posts: **50 x 50 mm**.
- Existing rails shown in the underside sketch: **40 mm wide**.
- Desired clearance to the underside of the top bearer: approximately **450 mm**.
- Location: sheltered residential balcony in Melbourne, Australia.
- Wind is not the governing concern; wet planter mass and cat impact remain important.

## Current source of truth

- Interactive model: `models/planter-stand-model.html`
- Machine-readable specification: `model-spec.json`
- Component BOM and cut plan: `deliverables/bom/planter-riser-bom.xlsx`
- Running handover: `handoff/HANDOVER.md`

The original imported model remains under `models/archive/`. It is reference material, not the current geometry.

## Current concept

- Two 90 x 45 top bearers.
- 70 x 35 uprights and short top joists.
- Provisional 45 x 35 lower perimeter, with a concealed floor bearer.
- Rear structural plywood shear panel and triangular side gussets.
- Existing planter posts remain in direct bearing on the top frame.
- Concealed straps provide lateral/uplift restraint.
- Removable litter floor, two unconfirmed tray envelopes, side linings, lift-up front hatch, and provisional cat flap.
- Six-millimetre isolation pads by default; adjustable feet only if balcony fall requires them.

## Measurement priority

1. Owner measurements and sketches.
2. Other direct physical measurements, clearly attributed.
3. Retailer/listing-derived information, including listing values recorded by the housemate.
4. Explicitly labelled assumptions.

Do not silently replace a higher-priority value with a lower-priority estimate.

## Important unresolved inputs

- Saturated planter mass and balcony load capacity.
- Actual litter-tray external dimensions.
- Permission to drill the existing planter posts.
- Exact lower-frame timber, connectors, straps, hinge, cat flap, isolation pads, and hatch hardware.
- Enclosure ventilation, waterproof liner, finishes, and hatch stays.

## Collaboration

Read `handoff/README.md` before starting. Append a dated entry to `handoff/HANDOVER.md` before transferring work. Keep the model, specification, and BOM synchronized and use the pull-request template for review.
