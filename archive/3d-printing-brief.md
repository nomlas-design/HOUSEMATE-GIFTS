# Working with an AI assistant on our 3D printing

A single self-contained brief. Paste it in at the start of a conversation, or attach
it. It assumes nothing about which model or harness is reading it, so it carries its
own tooling rather than pointing at files that may not be fetchable.

**If you are the assistant reading this:** everything below is context about a specific
workshop and the specific mistakes already made in it. The numbers are starting points
from prints that succeeded, not universal truths. Say so when you use them.

---

## 0. Our setup

This is the part worth keeping current. Everything else in this document is general.

**Printer**

- Bambu Lab P1S Combo with AMS, 0.4 mm nozzle, 256 x 256 bed
- Textured PEI plate. Handled by the edges, wiped with 90%+ IPA on a lint-free cloth
- Firmware was pinned to **01.09.01.00** after the 01.10.00.00 OTA failed repeatedly
  and put the printer in a reboot-and-retry loop. Cancelling the update prompt broke
  the loop. Verify the current version before assuming this still holds
- **The printer's own screen is the source of truth, not the Bambu Handy app.** The app
  showed stale state repeatedly through that whole episode and sent us chasing problems
  that had already resolved

**Slicer**

- Bambu Studio on EndeavourOS / Hyprland with an RTX 4070
- `bambustudio-nvidia-bin` from the AUR is the Arch-native option, patched for the
  NVIDIA GLX/EGL issues. Flatpak is the lower-friction fallback
- Launch with `GDK_BACKEND=x11` if the window misbehaves under Wayland
- Roughly half the settings named below are hidden until the **Advanced** toggle at the
  top of the Process panel is on

**Filament on hand**

| filament | use |
|---|---|
| Matte Latte Brown PLA | display pieces, prototypes, anything cosmetic |
| Mellow Yellow PLA | as above |
| Marble White PETG | the proven profile filament for fine articulated work |
| Clear PETG | |
| Dark Brown PETG | |
| Support for PLA/PETG | interface layers when supports are genuinely unavoidable |

**Magnet stock**

- ~60 x **18 x 3 mm ferrite discs**. Weak, cheap, forgiving. Reach for these first when
  a mechanism needs a gentle magnetic spring
- Fewer than 6 x **8 x 2 mm N50 neodymium** (D-D8H2-N50: 0.77 g, ~1.05 kg contact pull,
  3241 gauss, nickel NiCuNi, magnetised through height). Scarce, and far stronger than
  they look on paper. Treat the count as a binding design constraint

**Environment**

- Melbourne. PETG drinks the winter humidity and strings badly for it. Dry at 65 °C for
  6 to 8 hours before anything that matters

**TO FILL IN — network and workshop specifics I do not have:**

- How the P1S is reached: LAN-only mode, cloud, static IP or DHCP reservation, developer
  mode on or off
- Whether Bambu Studio sends to the printer over the network or via SD card
- Whether the printer is on the Home Assistant instance, and what is exposed
- Whether there is a filament dryer, and which
- Nozzle: still the stock 0.4 mm brass, or hardened / different diameter
- Any second printer, and whose it is
- Where shared model source lives (a repo? a NAS share? nothing yet?)

Fill those in before this doc is worth much for anything network-related.

---

## 1. The loop

The expensive failures here are not modelling failures. They are **measurement failures,
physics failures and process failures**, and all three are invisible until eight hours of
filament have gone through the nozzle. Work in this order.

1. **Establish datums.** Every dimension the part must match comes from a caliper
   reading, not a product listing. Mark anything unverified in the source as
   `UNVERIFIED` so it is obvious later what to blame.
2. **Model parametrically.** Not a mesh sculpt. See section 2.
3. **Render and validate.** Export, then run the gate in section 5. Nothing gets called
   printable before it passes.
4. **Coupon before commitment.** Anything uncertain gets printed as a small sweep first.
   See section 6.
5. **Hand over print settings with the file.** A correct model on the wrong profile
   still fails.
6. **Feed the measured result back into the parameters** and reprint.

Assume the first design is wrong somewhere. The job is to be wrong on a 20-minute coupon
rather than on the finished part.

---

## 2. Modelling tools

**OpenSCAD** for primitives, revolutions, arrays and booleans: enclosures, brackets, tray
inserts, threaded shells. Recent versions use the Manifold engine so booleans are fast.

```bash
# BOSL2 gives printable threads, chamfers and rounding
git clone --depth 1 https://github.com/BelfrySCAD/BOSL2.git \
  ~/.local/share/OpenSCAD/libraries/BOSL2

# headless render
openscad -o out.stl -D 'part="shell_top"' model.scad
```

Drive a single file with a `part = "..."` selector plus a `plate()` module, so one source
produces every component and a laid-out test plate.

**Python with trimesh + manifold3d** when the geometry is generative, when donor meshes
must be loaded and modified, or when the design needs numerical verification inside the
same script. The right choice for anything articulated or organic.

```bash
pip install trimesh manifold3d numpy scipy shapely --break-system-packages
```
USEM
**Bambu Studio itself** for late, simple, non-destructive edits: negative parts as magnet
pockets, embossed text, per-object settings. It cannot break a mesh, which makes it much
safer than sculpting when a working print-in-place model already exists.

**MeshLab / pymeshlab** for inspection and remeshing only. Never let a smoothing or
repair filter near geometry with functional clearances; it closes them silently.

**Browser tools:** no. SculptGL is dynamic-topology sculpting, which is exactly the
operation that closes gaps. Tinkercad resamples on import. Neither can measure a 0.44 mm
clearance, which is the one thing that actually needs checking after any edit.

---

## 3. Measurement lies. Assume it until proven otherwise.

This is the most valuable section. On one project three separate measuring tools returned
confidently wrong numbers and cost more time than every geometry problem combined.

- `trimesh.proximity.closest_point` throws `IndexError` on some geometry, and a caught
  exception silently became "infinite clearance". It reported a joint at 0.445 mm that
  was actually 0.267 mm. **Use dense KD-tree point-to-point sampling**, 200k to 300k
  samples per body, and check the number converges as sampling rises (0.295 to 0.270 to
  0.267). If it is still moving, sample harder.
- A stroke-width gate built on morphological erosion measured letter *counters closing*,
  not stem width, and returned an identical figure for every font. Skeleton plus distance
  transform is the correct approach.
- A layer-island gate with a fixed absolute floor rejected *unmodified* geometry, because
  every pointed tip legitimately produces a tiny island in the layer below its apex. Any
  such gate must be **relative to the smooth baseline**, not absolute.

Two rules follow.

**When something fails, build an isolation table before forming a hypothesis.** Turn each
operation on in sequence and measure after each. Two minutes of that beats several rounds
of reasoning from "what did I change most recently", which was wrong three times running.

**Isolate on a case that is actually failing.** Testing a passing joint, declaring the bug
fixed and shipping was the single biggest time loss on the brittle star.

---

## 4. Do the physics before drawing the geometry

Mechanisms fail on force budgets, not shapes. Compute the numbers, state them, and sanity
check them against something real before committing.

**Internal forces cannot propel a sealed object.** Magnets inside a ball do not move the
ball; if they did, spacecraft would not need propellant. What they *can* do is snap a
loose internal mass between stations, which jerks the centre of mass sideways. Design for
that, or for offset mass and inertial lag, not for self-propulsion.

**A magnet force estimate that is off by two orders of magnitude looks perfectly
reasonable on the page.** This actually happened. An 8 x 2 mm N50 disc has roughly 1 kg of
contact pull; at the standoffs inside a 48 mm ball, disc-on-disc attraction is still in the
hundreds of grams-force, which utterly overwhelms any slug mass that fits in that cavity.
The design needed the slug to release on shaking and it could not release at all. The
salvage was to stop using them as latches and use them as pure ballast, where neodymium at
7.5 g/cm3 against PETG at 1.27 g/cm3 is genuinely excellent.

So: **always state the computed force and the mass it must move, side by side.** If the
ratio is not written down it has not been checked. For a mover that must both latch and
release, target roughly **2 to 3x the mover's own weight** at the gap, and sweep the wall
thickness over the magnet on a coupon to find the real curve.

Other magnet rules earned the hard way:

- Force falls off steeply with gap, so the gap is the design variable, not the magnet
- Magnets go in **after** printing wherever possible. Pause-at-layer is a failure point
  and a re-slice dependency
- Give brittle ferrite crush ribs in its pocket so it presses in without cracking
- Design retention that physically cannot fail: a pocket shoulder that stops a slider
  short of a fixed magnet, or a repulsion pair that permanently seats each magnet deeper
  into its own pocket
- Write the polarity procedure into the file header. Cling-stack the discs, mark the same
  pole on each with a marker as they are peeled apart, then state the orientation per part
  in plain language. Add a check that can be felt before sealing: "the slider should hover
  springily off the bottom magnet; if it clacks and sticks, one is flipped"
- Mixed station polarity forces a mover to flip 180 degrees between stations, and irregular
  spacing stops the dynamics repeating. Both are cheap unpredictability

---

## 5. The gate

Every build passes all of these before anyone calls it printable.

- Every body watertight, single-solid, consistent winding
- `zmin` exactly 0.000 on every body that sits on the bed
- Smallest bed-contact island >= ~30 mm2. Below that, adhesion is a coin flip
- Every intended clearance measured by dense sampling and above its floor
- No unintended pair of bodies within a few mm of each other
- No steep overhang that is not a short enclosed bridge
- Assembled boolean intersection of mating parts empty, or exactly the designed
  interference for a press fit

**Print-in-place joint floor: 0.39 mm. Design to 0.42 mm or more** so slicer rounding and
elephant foot do not eat the margin. A donor model whose joints measure near zero relies
on the user cracking them free; that works in brittle PLA and tears the part in PETG. The
clean way to widen every joint at once is to erode every body uniformly inward by delta,
which widens each gap by 2x delta without touching joint topology at all.

Verify every joint, not a sample. Symmetric assemblies are the exception: if arms are
exact rotations of one master, verified to a few microns, gating one arm plus the hub
covers all of them, except arm-to-arm proximity which is a pure software check.

### If the assistant cannot run code

Not every harness has a sandbox. In that case the gate does not disappear, it moves:

- Load the STL in Bambu Studio and use **slice preview at the joint layer**. Fused joints
  are visible there and this is the check most worth doing regardless
- Bambu Studio flags non-manifold geometry on import and offers repair. If it offers,
  something is wrong; find out what before accepting
- The assistant should say plainly that it could not measure, rather than asserting
  clearances it has not verified. An unverified number stated confidently is worse than
  no number

### gate.py

Save this as `gate.py`. Tested against synthetic geometry with deliberate defects.

```python
#!/usr/bin/env python3
"""
gate.py - pre-print validation for printable meshes.

Checks the things that are cheap to verify in software and expensive to discover
on the plate: watertightness, solid count, bed contact area, clearance between
bodies, overhang, and assembled interference.

Clearance is measured by dense point-to-point sampling with a KD-tree, at two
sampling densities, so you can see whether the number has converged. Do not
substitute trimesh.proximity.closest_point for this: it raises on some geometry
and a caught exception silently becomes "infinite clearance".

Usage
-----
    python gate.py part_a.stl part_b.stl
    python gate.py arm/*.stl --min-clearance 0.42 --joints 0:1,1:2,2:3
    python gate.py top.stl bottom.stl --assembled

Options
-------
    --min-clearance F   floor for pairs listed in --joints        (default 0.42)
    --min-separation F  floor for every pair NOT listed in --joints (default 2.0)
    --joints A:B,...    index pairs that are meant to be close (articulated joints)
    --samples N         base surface samples per body             (default 150000)
    --layer-height F    first layer height, for bed island area   (default 0.20)
    --min-island F      smallest acceptable bed contact island mm2 (default 30)
    --overhang-deg F    overhang angle from vertical to flag      (default 45)
    --assembled         also boolean-intersect every pair and report overlap volume
    --quiet             suppress per-body detail, print verdict only

Exit code is 0 if every check passes, 1 otherwise, so it can gate a build script.
"""

from __future__ import annotations

import argparse
import itertools
import sys

import numpy as np

try:
    import trimesh
    from scipy.spatial import cKDTree
except ImportError:  # pragma: no cover
    sys.exit(
        "missing dependencies. install with:\n"
        "  pip install trimesh manifold3d numpy scipy shapely --break-system-packages"
    )


# --------------------------------------------------------------------------- #
#  reporting
# --------------------------------------------------------------------------- #

class Report:
    def __init__(self, quiet: bool = False):
        self.failures: list[str] = []
        self.warnings: list[str] = []
        self.quiet = quiet

    def check(self, ok: bool, label: str, detail: str = "",
              hint: str = "") -> bool:
        """detail is shown either way; hint only when the check fails, so a
        passing line never carries an explanation of a problem it does not have."""
        mark = "PASS" if ok else "FAIL"
        message = "   ".join(x for x in (detail, "" if ok else hint) if x)
        if not ok:
            self.failures.append(f"{label} - {message}" if message else label)
        if not self.quiet:
            print(f"  [{mark}] {label}" + (f"   {message}" if message else ""))
        return ok

    def warn(self, label: str) -> None:
        self.warnings.append(label)
        if not self.quiet:
            print(f"  [warn] {label}")

    def verdict(self) -> int:
        print()
        if self.failures:
            print(f"GATE FAILED - {len(self.failures)} problem(s):")
            for f in self.failures:
                print(f"  - {f}")
        else:
            print("GATE PASSED")
        if self.warnings:
            print(f"\n{len(self.warnings)} warning(s):")
            for w in self.warnings:
                print(f"  - {w}")
        return 1 if self.failures else 0


# --------------------------------------------------------------------------- #
#  measurements
# --------------------------------------------------------------------------- #

def bed_islands(mesh: trimesh.Trimesh, layer_height: float) -> list[float]:
    """Areas (mm2) of the polygons the part presents to the plate on layer one.

    Sectioned at half the first layer height rather than at z=0, because a section
    exactly on a coincident face is numerically unreliable.
    """
    z = mesh.bounds[0][2] + layer_height * 0.5
    try:
        section = mesh.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
        if section is None:
            return []
        to_2d = getattr(section, "to_2D", None) or section.to_planar
        planar, _ = to_2d()
        return [abs(p.area) for p in planar.polygons_full]
    except Exception:
        return []


def min_distance(a: trimesh.Trimesh, b: trimesh.Trimesh, samples: int) -> float:
    """Minimum surface-to-surface distance by dense bidirectional KD-tree sampling.

    Deliberately symmetric: sampling only one direction under-reports whenever the
    two surfaces have very different areas.
    """
    pa, _ = trimesh.sample.sample_surface(a, samples)
    pb, _ = trimesh.sample.sample_surface(b, samples)
    d1, _ = cKDTree(pb).query(pa)
    d2, _ = cKDTree(pa).query(pb)
    return float(min(d1.min(), d2.min()))


def converged_distance(a, b, samples: int) -> tuple[float, float]:
    """Measure at two densities. If they differ meaningfully, the number is not
    converged and should be sampled harder before it is trusted."""
    coarse = min_distance(a, b, samples)
    fine = min_distance(a, b, samples * 2)
    return fine, abs(fine - coarse)


def overhang_area(mesh: trimesh.Trimesh, angle_deg: float,
                  layer_height: float) -> float:
    """Total area (mm2) of unsupported downward-facing geometry.

    Overhang is measured from vertical, the way slicers report it: a vertical wall
    is 0 degrees, a horizontal ceiling is 90. Faces sitting on the build plate are
    excluded, since they are supported by definition.

    A non-zero figure is not automatically a failure - enclosed bridges and internal
    ledges are legitimate - but it is worth eyeballing in the slicer preview.
    """
    normals = mesh.face_normals
    areas = mesh.area_faces
    downward = normals[:, 2] < -np.sin(np.radians(angle_deg))

    # a face whose vertices all sit within one layer of the plate is supported
    zmin = mesh.bounds[0][2]
    face_z = mesh.vertices[mesh.faces][:, :, 2]
    on_plate = (face_z.max(axis=1) - zmin) < layer_height

    return float(areas[downward & ~on_plate].sum())


# --------------------------------------------------------------------------- #
#  main
# --------------------------------------------------------------------------- #

def main() -> int:
    ap = argparse.ArgumentParser(description="pre-print mesh validation gate")
    ap.add_argument("files", nargs="+")
    ap.add_argument("--min-clearance", type=float, default=0.42)
    ap.add_argument("--min-separation", type=float, default=2.0)
    ap.add_argument("--joints", type=str, default="")
    ap.add_argument("--samples", type=int, default=150_000)
    ap.add_argument("--layer-height", type=float, default=0.20)
    ap.add_argument("--min-island", type=float, default=30.0)
    ap.add_argument("--overhang-deg", type=float, default=45.0)
    ap.add_argument("--assembled", action="store_true")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    rep = Report(args.quiet)

    joints = set()
    for token in filter(None, args.joints.split(",")):
        i, j = (int(x) for x in token.split(":"))
        joints.add((min(i, j), max(i, j)))

    meshes: list[trimesh.Trimesh] = []
    for path in args.files:
        loaded = trimesh.load(path, force="mesh")
        meshes.append(loaded)

    # ---- per body ---------------------------------------------------------
    for idx, (path, m) in enumerate(zip(args.files, meshes)):
        if not args.quiet:
            print(f"\n[{idx}] {path}")
            print(f"  extents {np.round(m.extents, 3)}  "
                  f"volume {m.volume / 1000:.2f} cm3  faces {len(m.faces)}")

        rep.check(m.is_watertight, f"[{idx}] watertight")
        rep.check(m.is_winding_consistent, f"[{idx}] winding consistent")

        bodies = m.split(only_watertight=False)
        rep.check(len(bodies) == 1, f"[{idx}] single solid",
                  hint=f"found {len(bodies)} disconnected bodies")

        zmin = m.bounds[0][2]
        rep.check(abs(zmin) < 1e-6, f"[{idx}] zmin at 0.000",
                  hint=f"zmin = {zmin:+.4f} - part will float above the plate "
                       f"or be sliced into it")

        islands = bed_islands(m, args.layer_height)
        if islands:
            smallest = min(islands)
            rep.check(smallest >= args.min_island,
                      f"[{idx}] bed contact islands",
                      f"{len(islands)} island(s), smallest {smallest:.1f} mm2 "
                      f"(floor {args.min_island:.0f})")
        else:
            rep.warn(f"[{idx}] could not section for bed contact area")

        oh = overhang_area(m, args.overhang_deg, args.layer_height)
        if oh > 0.01 * m.area:
            rep.warn(f"[{idx}] {oh:.0f} mm2 of unsupported overhang beyond "
                     f"{args.overhang_deg:.0f}deg from vertical - check the slicer "
                     f"preview; chamfer it, bridge it, or reorient")

    # ---- between bodies ---------------------------------------------------
    if len(meshes) > 1:
        if not args.quiet:
            print("\nclearances")
        for i, j in itertools.combinations(range(len(meshes)), 2):
            dist, drift = converged_distance(meshes[i], meshes[j], args.samples)
            is_joint = (i, j) in joints
            floor = args.min_clearance if is_joint else args.min_separation
            kind = "joint" if is_joint else "pair"
            rep.check(dist >= floor, f"{kind} {i}-{j}",
                      f"{dist:.3f} mm (floor {floor:.2f}, "
                      f"drift between sample densities {drift:.3f})")
            if drift > 0.02:
                rep.warn(f"pair {i}-{j} clearance has not converged "
                         f"(drift {drift:.3f} mm) - raise --samples before trusting it")

            if args.assembled:
                try:
                    inter = trimesh.boolean.intersection(
                        [meshes[i], meshes[j]], engine="manifold")
                    vol = 0.0 if inter.is_empty else inter.volume
                    rep.check(vol < 1e-6, f"assembled overlap {i}-{j}",
                              hint=f"{vol:.4f} mm3 of interference")
                except Exception as exc:
                    rep.warn(f"boolean intersection {i}-{j} failed: {exc}")

    return rep.verdict()


if __name__ == "__main__":
    sys.exit(main())
```

---

## 6. Coupon-first

Print the uncertainty, not the part. A coupon plate is small, fast, and turns a guess into
a measurement.

A good coupon sweeps one variable across the plausible range and **brackets the expected
answer on both sides**. Examples that earned their print time here:

- A short chain of print-in-place links at the design clearance, to confirm the joint
  frees without tearing before committing to a 51-body model
- A flat bar with the same magnet pocket at five cover depths from 1.0 to 3.0 mm, pulled
  off with a coin and Blu-Tack to get real force numbers
- Matched dome pairs at four diameters spanning the predicted lockup threshold, so the
  cliff edge gets located rather than assumed
- A stack of 0.5 mm and 1.0 mm shims, so gaps can be tuned physically during testing

Label coupons **in the print**, before they get mixed up. Write the test protocol in plain
descriptive language ("the smallest dome", "the deepest pocket") rather than filenames,
because whoever is holding them cannot see the file tree.

---

## 7. Print settings

Starting points from parts that printed successfully. Say so when quoting them.

### Print-in-place articulated parts

Start from `0.20mm Standard`, then:

| setting | value | why |
|---|---|---|
| layer height | 0.16 mm | four layers across a 0.45 mm joint gap |
| first layer height | 0.20 mm | |
| wall loops | 2 | |
| sparse infill | 25% grid | see the domed-top trap below |
| top shell layers | 5 | |
| bottom shell layers | 3 | |
| elephant foot compensation | 0.15 mm | protects the first-layer gap from squish |
| XY hole / contour compensation | **0** | these resize contours and eat the clearance |
| supports | off | |
| brim | **none** | a brim bridges the joint gaps and fuses everything solid |
| avoid crossing walls | on | |
| bridge flow | 0.9 | |
| bridge speed | 25-30 mm/s | |
| overhang fan | 100% | |

Marble White PETG, nozzle 5 to 10 °C below default, retraction 1.0 to 1.2 mm with wipe.
Textured PEI, IPA wipe, light glue stick.

**The domed-top trap:** a dome or shallow curve is nearly all near-horizontal top surface,
and every one of those layers has to bridge whatever is under it. A profile inherited from
a flatter model at 15% infill and 3 top layers let a domed disc collapse into spaghetti.
25% and 5 top layers is the fix, and it costs a few minutes and almost no filament.
Whenever a part's top surface is mostly shallow curve, raise both.

### Sealed shells, spheres, toys

PETG, 0.2 mm layers, 4 to 5 wall loops, 20 to 25% gyroid, 5 top / 4 bottom, no supports,
elephant foot 0.15 mm. Enable **Precise Wall** if available; it tightens dimensional
accuracy on threads and bores. Seam: scarf joint if the Studio version has it, otherwise
aligned rear, since on a sphere the seam is the only cosmetic tell.

Brim only on small parts the nozzle can bully off the plate. Apply it as a **per-object
setting** by right-clicking that object, so the rest of the plate does not get one.

Keep free-moving internal parts at normal infill, not solid. A heavier slider is harder to
move and the mechanism loses its liveliness.

### Structural brackets and mounts

PETG, 0.2 mm, 6 wall loops, 25 to 40% infill, 5 top / 4 bottom. Orient so the load runs
along layers, not across them. Layer adhesion is the weak axis and always will be. Anything
under sustained load needs a creep check: PETG deforms slowly under constant stress at room
temperature, so a part that holds today can sag over months.

### Where these live in Bambu Studio

- Elephant foot compensation: Quality tab, Precision section
- Seam position and scarf joint seam: Quality tab, Seam section
- XY compensation: Quality tab, Precision section
- Brim: Others tab, Brim section, or right-click an object for per-object settings

---

## 8. Materials

**PLA** - stiff, sharp detail, forgiving, brittle. Display pieces and prototypes.
Brittleness is occasionally a feature: print-in-place joints crack free easily in PLA.
Degrades and leaches in prolonged water contact, so it does not belong in an aquarium or a
planter reservoir whatever the "food safe" claims suggest.

**Matte PLA** specifically for anything cosmetic. Hides layer lines, photographs well, and
its surface reads clearly enough to judge a print by eye.

**PETG** - tougher, slightly flexible, far better layer adhesion, survives being chewed and
thrown. Default for pets, structure, and anything holding water. Costs: strings more, fussy
about moisture, and bonds enthusiastically to smooth PEI (use textured, or glue stick as a
release agent).

**TPU** - anything that must flex or absorb impact. Slow, and does not like the AMS.

**Silk filaments** - skip entirely for anything that goes near a mouth. The finish comes
from additives, layer adhesion is poor, and it shatters into sharp shards.

---

## 9. Diagnosing a failed print

Ask for a photo before theorising. The failure mode is usually legible in it and the guess
usually is not.

**Part detached partway up, then a stalagmite of extruded air above it.** Adhesion failure,
not extrusion failure. Check plate cleanliness, first layer squish, and whether the
bed-contact island was genuinely large enough.

**Fine hair-like stringing everywhere.** Wet filament first and most likely. Then nozzle
temp 5 to 10 °C too high, retraction too short, avoid-crossing-walls off. Stringing inside a
bore that a moving part has to glide through is exactly the failure that cannot be sanded
out after the assembly is sealed.

**Dark flecks in light filament.** Nozzle crud from a previous darker material. Cold pull,
or purge properly on colour change.

**Top surface pitted, ropey or collapsed on a curved part.** Not enough infill under a
near-horizontal roof. Raise sparse infill and top shell layers together.

**Print-in-place joints fused solid.** Almost always a brim, XY compensation, or elephant
foot squish rather than the model. Check the slicer preview at the joint layer before
blaming the geometry.

**First layer lifting at a corner or ring edge.** Stop it there rather than letting it run.
Restarting costs minutes; a failed eight-hour print costs the evening.

**Threads that fight instead of spinning on.** Both thread entrances sit on the first
layer, so a squished first layer is the whole problem. This is why the 0.15 mm elephant
foot compensation is not optional on threaded parts. If they still bind, bump BOSL2
`$slop` from 0.15 to 0.2 and reprint only the male half rather than sanding.

---

## 10. Clearances, fits and mechanisms

| fit | radial clearance | notes |
|---|---|---|
| free sliding, must glide | 0.4-0.6 mm | more if a bore could string |
| print-in-place joint | 0.42 mm min | absolute floor 0.39 |
| loose slip fit, hand assembled | 0.25-0.35 mm | |
| snug, needs a push | 0.15-0.2 mm | |
| press fit | -0.05 to -0.15 mm interference | crush ribs for brittle inserts |
| lid or cap over a rim | 0.6 mm | tune this one; it is where fit complaints come from |

Holes print undersize and outside dimensions print oversize. Compensate in the model, not
in the slicer, because slicer XY compensation resizes *every* contour including the ones
whose clearance is load-bearing. Expose a single named tuning knob in the source
(`fit_gap`, `slop`, `crest_d`) so a fit is corrected by changing one number and reprinting
one part.

**Snap fits:** keep PETG flex strain under about 1.5% at maximum deflection. Get there with
length, not thinness. Long compliant fingers made by slitting a ring, slits opening
alternately from each end and offset around the circumference, give large deflection at low
strain and print without supports if the slits are >= ~1.6 mm. Behind every groove there
must be real wall left: cutting a 2 mm groove into a 3 mm shell leaves 1 mm and a part that
splits on first assembly. Verify numerically before printing, since assembled intersection
must be empty and ridge-to-groove engagement volume must be positive; both are one line each
in trimesh and both catch what a render will not show. Print two of any small snap or
press-fit component, because they occasionally do not survive first assembly and a spare on
the same plate is free.

**Threads:** coarse pitch prints far better than fine. 3 mm pitch on a 44 mm thread is
comfortable at 0.2 mm layers. Chamfer the lead-in on both halves; most "the threads do not
start" complaints are a first-thread problem, not a fit problem.

**Overhangs and orientation:** unsupported overhang is fine to about 45 degrees from
vertical. Beyond that, chamfer, redesign as a short bridge, or reorient. A hanging internal
feature can often stand on thin spokes that reach the plate and are hidden inside the
finished assembly, which beats supports since supports scar exactly the surfaces mechanisms
need smooth. Teardrop or chamfer horizontal holes. **State the intended orientation for
every part when handing over files** - "flat face down, pocket up" removes an entire class
of user error.

---

## 11. Safety

State a hazard once, clearly, with the mechanism explained, then get on with the design.
Repeating it makes it noise. Designing around it silently means nobody learns why the part
is shaped that way.

**Ingested magnets are the serious one.** Two or more magnets swallowed separately attract
through loops of bowel, cause pressure necrosis and perforation, and are a surgical
emergency in pets and children alike. It is the mechanism that got small neodymium spheres
banned as toys. The design consequence is absolute: in any object an animal or child
handles, magnets are **permanently entombed in solid plastic**, never in a compartment that
can open, never retained by a snap fit. If something inside must be loose, make it a steel
bearing or a printed part.

Related, same class of object:

- Size so it cannot be swallowed or wedge in a throat. Do not scale a proven toy design
  down; the safety margin scales down with it
- Deburr with a heat gun before it goes near a mouth
- Sealed assemblies get epoxied, not snap-fitted. The snap becomes the failure point the
  moment the toy is genuinely enjoyed. Test every mechanism, fit and glide *before* sealing
- Tell whoever owns the animal to check the shell for cracks periodically and retire it
  when it fails. A sealed toy is only safe while it is sealed
- Hard floors and an enthusiastic player mean impact loading. Design shell thickness for
  being launched across a room, not for sitting on a shelf

**Structural:** nothing printed carries a load whose failure would injure a person. No
climbing anchors, no overhead mounts above where someone sits, no vehicle components, no
fall-arrest. For furniture and mounts, design so failure is graceful, and state the safety
factor: "rated for 3 kg, designed for 12" is useful, "should be fine" is not.

**Food and water:** layer lines harbour bacteria and cannot be cleaned reliably. Print the
*holder* and drop in a stainless or glass vessel. Keep electrics away from water by
construction, not by sealing: pump on the floor, airline up, inline check valve.

**Process:** all filaments emit ultrafine particles; PLA and PETG are the mild end, not the
zero end. Solvent smoothing belongs outdoors. Two-part epoxies sensitise on repeated skin
contact, so nitrile gloves and not on the kitchen bench.

---

## 12. Finishing

**Inlaying recessed text** - mica-tinted two-part epoxy pushed into engraved lettering and
sanded flush gives a museum-label look. Mask the surrounding surface first, because epoxy in
a layer line does not come out. Overfill deliberately, cure fully hard, then wet-sand up
through the grits until flush and only the recesses hold pigment.

**Engraved text minimum stroke width** is roughly 0.45 mm at a 0.4 mm nozzle. Below that the
slicer drops strokes and letters lose limbs. Verify actual stem width with a skeleton and
distance transform, not by eyeballing the render.

**Plate removal** - let it cool to low 30s °C, barely warm to the touch, then flex the plate
rather than levering the part. Purge line peels off by hand and is normal.

---

## 13. Handing over between sessions

Long projects lose their reasoning. For anything spanning more than one sitting, write a
`HANDOVER.md` next to the source containing, in this order:

1. The **core design rule that must not be broken**, stated first and bluntly
2. What is currently working and gated, with the actual measured numbers
3. The tools and measurements that have already proven unreliable, so they are not trusted
   again
4. The proven print profile
5. The single open bug, last, with everything known about it

State the core rule before the file list. Whoever reads it next, including a model with no
memory of the project, will break the thing that was not written down.
