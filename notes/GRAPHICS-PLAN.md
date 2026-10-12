# Making it look as good as it can

A plan, not a change. Written 2026-10-12, after the backdrops.

Everything here is measured against three numbers the repo can produce today:

| | | how |
|---|---|---|
| Cold flipbook bake | **29ms mean, 35ms worst** | `node tools/bake-budget.js` |
| The curtain it hides behind | **900ms minimum**, and extendable | `fxLoad` in `src/p3.js` |
| One pre-rendered actor | **+395KB on a 1094KB page (+37%)** | `notes/ART-SPIKE.md` |

So: about **thirty times more boot time than we spend**, and essentially **no
room at all for downloaded art**. That asymmetry decides the whole plan.

---

## Three.js: the honest answer is no, and not for the reason you would expect

Not "too hard". The repo already proved the hard part is elsewhere.

**1. The spike already ran, and 3D made the game harder to read.**
`notes/ART-SPIKE.md` rendered one Act I monster as a lit 3D actor. The form read
better and two things got worse: the tick's orange collided with Act I's sodium
ground, and detail turned to mush at the 40px it is actually seen at. The drawn
art was carrying readability *on purpose* — a bright pulsing eye doing most of
the work at 26px — and 3D does not inherit that. We would get prettier and less
legible at the same time.

**2. The byte budget forbids the assets that would justify it.** A renderer is
worth changing when it unlocks art you could not otherwise show. Pre-rendered
actors cost 395KB each. Ten of them doubles the page. The full roster is not
arithmetic you can finish. three.js does not change that: a 3D renderer wants
meshes and textures, which are bigger, not smaller, than the atlases we already
cannot afford.

**3. It is a rewrite of the one file that is working.** `src/p3.js` is the
renderer, and it is the part of this codebase with the clearest voice — the
Curator's empty hands, PROVIDENCE's forty-one fans, a sky that is "a kept one,
not a dead one". That is authored drawing. Porting it to meshes throws away the
authorship and keeps the chores.

**4. It breaks the thing the game is.** One self-contained HTML page, published
as an Artifact. three.js from a CDN is roughly 150-200KB gzipped (check before
quoting), and the offline LAN build cannot use a CDN at all.

**Where three.js would genuinely win**, if the goal changes: real-time lights and
shadows on a true 3D scene, a camera that can rotate or tilt, and a modern
material pipeline. None of those are on the complaint list. If you ever want the
camera to move in 3D, revisit this; until then it buys cost.

**The thing to take from 3D instead** is its *lighting vocabulary*, not its
renderer. Rim light, a warm key against a cool ambient, contact shadow, a single
bright focal point per actor. All of that is drawable in 2D for no bytes, and it
is most of why 3D "looks better".

---

## The real constraint, and the opening nobody has used

The single file is the binding constraint, and **it only binds the Artifact**.

`server/server.js:517` already has `serveStatic`, serving anything under
`server/public`. The LAN and web builds can therefore *stream* art that the
Artifact cannot carry. That is a two-tier art strategy, already half-built:

- **The Artifact** keeps the drawn art. It must stay one file.
- **The LAN and web builds** may additionally load an atlas pack over HTTP,
  behind the same loading curtain, with `sprReady` already written to fall back
  when it is absent (`OPT.spr`, from the art spike).

That is a product decision, not a rendering one, and it is the single highest
-leverage choice on this page. Everything in Tier 3 below depends on it.

---

## The ladder, cheapest first

Each rung names what it costs in the two currencies that matter: **bytes on the
page** and **milliseconds at the curtain**.

### Tier 1 — free. Zero bytes, spends boot time we already have.

1. **Write the readability rules down, then enforce them.** D2's trick was
   palette separation: cool ground, warm monsters, one bright focal point each.
   Act I breaks it (orange ticks on sodium ground) and that is why the spike's
   3D tick vanished. This is a data change to `pal` and `TX`, and it is probably
   the largest single improvement available. *0 bytes, 0ms.*
2. **Rim light every actor.** One bright stroke along the edge facing the key
   light. It is the main reason 3D reads as 3D, and in 2D it is a stroke.
   *~30 lines, 0ms.*
3. **Contact shadows that mean something.** `shadow()` is one flat ellipse.
   Tighten it under the feet, soften it with height, darken it near lamps.
   *0 bytes.*
4. **Spend the bake headroom on frames.** `FXART` kinds run 8-12 frames. At 29ms
   of a 900ms budget we can afford far more, and more frames is the cheapest
   possible "smoother". Raise `n` per kind, re-measure, stop at 300ms. *0 bytes,
   maybe +100ms.*
5. **Drop the upscale guard.** `fxBlit` refuses a sheet when `w > sh.w*1.7` and
   falls back to path drawing, so the biggest, most dramatic effects are the
   ones that *lose* the baked art. Bake a large variant for those kinds.
   *0 bytes, some ms.*
6. **Bloom on emissives.** The game already draws glows; a cheap separable blur
   of the bright pass would make every light feel lit rather than painted.
   *0 bytes, per-frame cost — measure.*

### Tier 2 — small bytes, procedural.

7. **Finish the skies.** Two new kinds landed today (the Gentle Years, and 2015).
   Acts I-III still share three. One per act is cheap and procedural.
8. **Floors that have been walked on.** The tile grid is clean diamonds. Wear,
   stains, cracks, puddles that catch the lamp — all procedural, all seeded off
   the map seed so they stay identical across a shared district.
9. **Weather per act.** Rain in the Moors, ash in the Cloud, nothing at all in
   2015. Particles are already in the renderer.

### Tier 3 — the expensive rung, gated on the two-tier decision above.

10. **Pre-rendered actor atlases for the LAN and web builds.** The pipeline
    exists (`tools/art/render-actor.js`, `tools/art/pack.js`) and works. Measure
    KTX2/Basis, fewer directions and act-shared atlases before committing; the
    spike's 395KB was PNG, 8 directions, per actor.
11. **Only then** reconsider a renderer change, with a real question in hand.

---

## What must not break

Three properties are load-bearing and all three have tools that prove them:

- **Nothing bakes inside a fight.** `tools/lazy-bake.js`. A hitch when a hostile
  player is waiting is a death, so every new art asset belongs in `fxPairs` and
  the boot bake, never in a first-sight path.
- **Everyone sees the same district.** `server/test/maps.js`. Anything seeded
  must draw from the map seed, not from `Math.random`, and must consume the same
  number of draws on every engine — see the Fisher-Yates note in `spawn()`.
- **It still loads before you can play.** `tools/bake-budget.js`. The curtain can
  stretch; the rule is that it stretches *before* the player is killable, not
  after.

## Where I would start

Tier 1 item 1, the palette rules. It costs nothing, it is the thing the 3D spike
proved was actually carrying the game, and every later rung is worth more once
it is true.
