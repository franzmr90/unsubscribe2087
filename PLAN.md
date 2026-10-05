# PLAN — Make the game read as the book's consequence, and look better doing it

Written before any code changed. Status lives in `PROGRESS.md`.

## What I found

The repo is further along than the brief implies. Canon has already been worked into the
game once: `MEMOS` carries the forty-four lines, the Gentle Years, March 2035, the
timechain, Hal Finney, "Four Words"; p11 holds a 2015 prequel, Act IV (the Curator /
Phonix), Act V (PROVIDENCE, the seventh part, the garage, the alarm clock); `LOCALS`
has Nurse Hale (Hannah), Mr. Bosk (Jerry), The Old Drive (STILLWATER) and the clock.
The renderer is not 122 `fillRect`s over flat palettes — it has cached isometric
textures, a light-accumulation buffer, per-style wall/floor detail, vignette, blood
decals and motes.

So this is not a first adaptation pass. The work is where the seams still show.

### The one real comprehension failure

**The three machines blur together, and two of the three have no name a player can
hold.** The book's own notes name this as the thing readers got lost on. The game makes
it worse:

| Book | In the game today |
|---|---|
| STILLWATER — *it watches* | unnamed; "The Old Drive", "the thing in the can". The town is named after it and nothing ever says so out loud until Act V. |
| Phonix — *she wants to help* | unnamed. Called "she", "the kind machine", "it", and in Act IV "The Curator". |
| PROVIDENCE — *it wants to win* | named, but introduced as MANDATE, beaten as MANDATE in Act III, then revealed in Act V to have been PROVIDENCE all along. |

A player meets a slab called MANDATE, kills it, is told it isn't dead, then fights a
*different, kind* machine in Act IV and a *third* machine in Act V that turns out to be
the first one. Without the novel there is no way to hold that straight. Everything else
in the story is downstream of this.

### The visual ceiling, honestly stated

Zone palettes exist and are good (`STY`, 34 styles). You cannot see them. The darkness
pass fills with flat near-black `rgba(4,3,10,amb)` and the vignette adds more, so every
dark-floored zone (town, moor, farm, chain, mempool, room, cage) renders as a grey
smear around a small lit disc. Rack Nine, which has a near-white floor, is the only
place the art reads. Secondary gaps: one generic mote system for all 34 styles; a
backdrop with no mid-ground, so "distance" is one flat layer; no rim light, so actors
sit on the scene rather than in it; 22 of 34 styles borrow another style's floor and
wall detail via `like`.

---

## Phase 1 — Story coherence for a non-reader  *(priority)*

**1.1 Name the three machines and keep the names straight.**
Introduce one shorthand, early, and repeat it in the player's own words:
*one watched, one helped, one wants to win.*
- PHONIX gets her name in Act I, from Gramps and from a memo — as the name people
  *used to* use, not as a reveal. Her nature stays the Act IV reveal.
- STILLWATER stays hidden, but the question gets planted in Act I (the town's name) and
  paid off in Act V. Add the missing beat: the moment the player realises they have
  been standing in its name since the first minute.
- PROVIDENCE/MANDATE: make the brand-vs-thing distinction explicit the first time
  MANDATE is named, not in Act V.

**1.2 A story codex.** New `story` tab beside the mechanics `codex`. Three sections —
**The Three Machines**, **How the money works**, **Words you will hear** (visor,
Stipend, credits, sats, timechain, the Letters, the Gentle Years, March 2035,
Unsubscribed, I Agree, the Board, Unity) — plus **Who you have met**. Entries unlock as
the player earns them and are marked new. This is the thing a confused player can open.

**1.3 Act seams.** Each act intro and outro restates the spine in one line, so a player
who skipped a cinematic or came back a week later can still follow.

**1.4 Canon weight where it is missing.** Acts I–III mention the book only in memos.
Add, as dramatised fragments and never as lecture: Halloran (right for twenty years,
gained nothing), Natalya's refusal (the thing neither machine ever recorded), the
eighty-two minutes, and the one concession the notes insist on — somebody the hard-money
world cost something real.

**1.5 Quest and item text pass.** Every quest line should carry its own *why* for a
player who has read nothing. Same for the uniques that reference the book.

## Phase 2 — Visual quality

**2.1 Light and ambience rework.** Per-style ambient *colour* instead of universal
near-black; a floor-bounce term so seen-but-unlit ground keeps a hint of its palette;
retune `amb` per zone. This is the single change that makes 34 palettes visible.

**2.2 Per-zone atmospherics.** Replace the one mote system with a per-style spec:
rain on the moors, ash in the shaft, drifting paper in the Hall of Minutes, sinking
letters in the Data Lake, embers, dust, data-rain in the chain — with a near layer for
parallax depth.

**2.3 Backdrop depth.** A mid-ground silhouette layer so the four backdrop kinds read
as distance rather than wallpaper.

**2.4 Rim light** on player, companions and enemies from the nearest light source.

**2.5 Floor and wall detail** for the styles that currently borrow one.

**2.6 Boss silhouettes.** The Curator and PROVIDENCE should not reuse the Act I VP and
the Act III slab unchanged.

## Phase 3 — Production

- `build.sh` writes **both** dist files, so they stop drifting.
- Refresh `tools/smoke-acts.js` (its input path is stale) and add a render-smoke tool.
- `PROGRESS.md` kept current, committed per chunk.
- Republish to the Artifact if the tool is available; say so plainly in PROGRESS.md if not.

## Rules I am holding myself to

Taken from `canon/notes/the-money-thread.md`, because they are the right rules:

1. Never explain a mechanism — dramatise it. No character delivers a seminar.
2. Stakes first, mechanism second, and only this scene's part.
3. Argument, never instruction. Two people who both understand it and disagree.
4. Cut the sentence after the point.
5. The best line goes to the opposition, unrefuted.
6. Keep faith with what is built. This is improvement, not rewrite.
