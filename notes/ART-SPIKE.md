# Art spike: one Act I monster, pre-rendered

The question was whether pre-rendered 3D sprites are worth the cost, and what the
pipeline costs in practice. Subject: the tick, the Act I trash mob you fight most.

## What was built

- `tools/art/render-actor.js` — a software rasteriser that runs in headless
  Chromium. Builds the actor from ellipsoids and tapered limbs, lights it with a
  fixed key/fill/rim rig, and renders 8 isometric directions across idle and walk.
  Writes an albedo atlas, a **normal** atlas and a JSON manifest. No Blender
  needed, and the atlas format is the contract, so a Blender render can replace
  this script and the game will not know.
- `tools/art/pack.js` — inlines atlases into `src/sprites.js` as data URIs.
- Sprite registry in `p3.js` — an actor with an atlas draws from it, everything
  else keeps the drawn art. Direction comes from the entity's own heading, walk
  and idle from whether it is chasing.

Opt-in: `SPRITES=1 ./build.sh`. Without it the atlas is absent, `sprReady` is
false and every actor falls back. `OPT.spr=false` toggles at runtime for an A/B.

## What it cost

| | bytes |
|---|---|
| Normal build | 1,063 KB |
| With one tick | 1,458 KB |
| **One trash mob** | **+395 KB (+37%)** |

That is the finding that matters. The game ships as **one self-contained HTML
file** — the Artifact and the Drop build both depend on it — so there is nowhere
to stream an atlas from. Every sprite byte lives in the page.

At this rate the single-file distribution does not survive real art. Roughly ten
actors and the page doubles; the full roster is not arithmetic you can finish.
Choosing pre-rendered art is therefore also choosing to give up the single-file
Artifact, or to keep the drawn art as the Artifact build and ship sprites only in
the web/native builds. That is a product decision, not a rendering one, and it
should be made before any art is commissioned.

Mitigations worth measuring before concluding: KTX2/Basis instead of PNG, fewer
directions, smaller cells, and shared atlases per act rather than per actor.

## What it looked like

The form reads. Shaded volumes, a real silhouette and a rim beat flat discs for
"this is a creature". Two things got **worse**, and both are about readability,
not fidelity:

1. **Hue collision.** The tick is orange; so is the sodium-lit ground of Act I.
   The drawn version separated them with a pulsing bright eye dot that the
   sprite's small emissive eye does not match. At 26px the glowing dot was doing
   most of the work.
2. **Detail turns to mush at actual size.** A 40px cell holds far less than it
   looks like it does in a contact sheet.

The lesson is that the drawn art was carrying readability deliberately, and 3D
does not inherit that for free. D2 solved it with palette separation (cool
ground, warm monsters), hard rim light and a bright focal point per actor. Any
real art direction here has to adopt those rules explicitly or the game gets
prettier and harder to read at the same time.

## Verdict

The pipeline works and is cheap to run. The open questions are not technical:
the byte budget versus the single-file build, and an art direction with
readability rules. Both are answerable before committing to a renderer rewrite,
which is the point of doing this first.
