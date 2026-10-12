# Is this built the right way for better graphics?

Asked 2026-10-12. A decision record, with the measurements behind it.

## The short answer

**Yes, with one caveat that nobody has named yet.** And no, three.js is not the
move — but the reason people reach for it *is* real, and there is a cheaper way
to get it.

## What is actually right about the current build

- **The renderer is one isolated file.** `src/p3.js`. Nothing in the game logic
  draws. That means it can be replaced later without touching the game, which is
  the property that makes "decide later" a safe answer.
- **The art pipeline is already proven swappable.** `notes/ART-SPIKE.md` built
  pre-rendered actor atlases, a sprite registry, and a fallback: `sprReady()`
  false means every actor falls back to drawn art, and `OPT.spr` toggles it live.
  So authored art can arrive incrementally, one actor at a time, with an A/B.
- **It is deterministic**, which multiplayer requires. Everyone draws the same
  district from the same seed. A renderer change must not break this.
- **It is fast.** 3.5ms of work in a heavy fight, about 21% of a 60Hz frame.
  There is no performance reason to change anything.

## The caveat, which is the real strategic issue

**All the art is code.** Every monster, item, sky and floor tile is a function
that draws it. The consequences:

- Art quality scales with *programming* effort, not artist effort.
- It cannot be handed to an artist, or to an image tool, without a pipeline that
  does not exist yet for environments.
- Every improvement is bespoke and sequential.

This — not Canvas2D — is what limits how good the game can look. And it is worth
being clear that the drawn art is not a weakness in itself: it is distinctive,
tiny, deterministic and in places genuinely good. It is simply a ceiling set by
how much drawing code anyone wants to write.

## The fork that matters is not the one being asked about

Two independent axes, routinely conflated:

| | |
|---|---|
| **Art source** | drawn by code  ⟷  authored assets |
| **Renderer** | Canvas2D  ⟷  WebGL |

Authored assets work fine in Canvas2D. The ART-SPIKE already blits a
pre-rendered atlas through the existing renderer. **You can have authored art
without changing the renderer at all**, and that is where almost all of the
available gain is.

## The number that decides the order

Environments cover most of the screen. Actors are small and mostly in motion.
Per megabyte, environment art buys far more than actor art, and it is not close:

| | resident | download |
|---|---|---|
| every floor and wall texture, all 31 styles, authored at 2x | **8.6MB** | ~775KB |
| **one** pre-rendered actor (640x800, albedo + normal) | **3.9MB** | ~288KB |
| the full ~50-actor roster, naive | 195MB | 14.1MB |

All 31 districts re-skinned with authored textures costs less than **three**
actors. That is the highest-value thing on this page and it does not need a new
renderer, a new projection, or three.js.

(Today each style builds 5 floor variants at 66x34, 2 walls at 66x46 and one low
wall — 71KB resident, and only the current style is built. Authored tiles at 2x
would be 283KB per style.)

## What Canvas2D genuinely cannot do

Being fair to the case for WebGL, there are exactly two things:

1. **Per-pixel lighting.** Normal-mapped sprites lit by the lamp they stand
   next to. The art pipeline already emits normal maps that Canvas2D throws
   away. This is most of what separates a nice 2D game from a beautiful one now.
2. **Post-processing.** Real bloom, colour grading, heat shimmer. Canvas2D can
   fake pieces of this with composites, badly.

Everything else — additive light, depth sorting, thousands of sprites, parallax,
particles — Canvas2D does, and this game already does most of it.

So WebGL is a real ceiling, eventually. **three.js is still the wrong tool for
it**: a 3D scene graph for lit 2D quads in a fixed isometric projection is weight
carried and not used. A thin WebGL sprite layer, or a 2D-first library, does the
job with a fraction of the surface area and keeps the projection, the
determinism and the gameplay untouched. three.js earns its place only if the
camera is meant to move in 3D, which is a decision about what the game *is*.

## The order, with what each costs

| | | cost | risk |
|---|---|---|---|
| 1 | **Lighting rework.** `notes/ACT1-GRAPHICS.md` -- the player's own light flattens everything within 310px, so lamps cannot light anything. | ~40 lines | low, needs play-testing |
| 2 | **Authored environment textures**, one act at a time. | 8.6MB resident for all 31 | low |
| 3 | **Authored actors, act-scoped and streamed** at town boundaries. Drop the normal maps until something uses them. | ~40MB resident per act | medium |
| 4 | **WebGL blit layer**, for normal-mapped light and post-processing. | a renderer rewrite | high |

**Do 1 before deciding anything else.** It is cheap, it is the largest current
deficit, and it is a test: if the game looks transformed by lighting alone, the
renderer was never the problem, and 2 then buys more than 3 or 4 would.

## What I would not do

- **Do not re-engineer now.** There is no performance problem, the renderer is
  already isolated, and nothing in 1 to 3 needs a new one. Rewriting a working
  renderer before knowing whether lighting and textures were the answer is
  paying the largest cost first for the least information.
- **Do not build an abstraction layer "so WebGL is easier later".** The renderer
  is one file with a narrow surface. Speculative indirection would cost now and
  save little.
- **Do not start with actors.** They are the most expensive art per pixel of
  screen, and the 3D spike already showed that lit 3D actors read *worse* than
  the drawn ones at 40px unless the readability rules are enforced first.

## What I cannot tell you

Whether the result will satisfy you. Stages 1 and 2 are cheap enough to judge by
looking, and that judgement is yours. The honest recommendation is to buy the
cheap information before committing to the expensive work.
