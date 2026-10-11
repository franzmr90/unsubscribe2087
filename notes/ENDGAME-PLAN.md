# Finishing Normal: credits, character select, and the next difficulty

A plan, not a change. Nothing below is implemented.

## What already exists

More than the request assumes. Working through it from the final blow:

- **The final boss already confirms completion.** `bossKill2` in `src/p11.js`
  sets `G.q.q25=3`, bumps `G.maxTier`, and raises the gate:
  `G.diffGate = Math.max(G.diffGate||0, (G.diff||0)>=1 ? 2 : 1)`. It saves
  immediately.
- **There is already an endgame cinematic.** First kill plays `ENDING5`, then
  `finalChoice()` — a two or three way moral choice — then `END_LEAVE`,
  `END_WAKE` or `END_DOUBT`, then `fateScene()`, then `actDone(5)`. The last
  slide of `END_DOUBT` is literally `{art:'title', title:'THE END'}`.
- **Difficulty is already gated and already explained.** `diffUnlocked(i)`
  reads `G.diffGate`, and the picker already refuses with *"Hard opens after
  you clear Act V on Normal."*
- **Old saves already migrate.** `migrateDiff()` grants the gate retroactively
  to anyone with a `boss5` kill.
- **Zone reset already exists.** `resetZones()` is `ZS={}; G.portal=null`.

So the cinematic and the unlock are done. Three things are missing, and one
thing that exists is actively in the way.

## What is missing

### A. A credits screen (new)

There is no credits sequence. `actDone(5)` ends on a dialog that points at
endgame content — More, the Simulator, the boss rush — which is a menu, not a
curtain.

Build it as a `CREDITS` slide array fed to the existing `playScene`. That
machinery already renders `{art, title, text}` slides with a skip button and is
used by every cinematic in the game, so this is content plus one call, not new
rendering. It should name what the player did: class, level, time, the ending
they chose, and the difficulty they cleared. Reachable again afterwards from
Options, so it is not a one-shot.

### B. Returning to character select (new)

Nothing in the end sequence leaves the world. After the credits the game should
`save(true)`, hide the HUD, show `#title` and call `showContinue()`, which is
already `drawSlots()`.

### C. The reset, and a per-difficulty record (new)

This is the real work. Today the entire difficulty switch is one line in the
options handler:

```js
if(!diffUnlocked(i)){...} else { G.diff=i; sfx('ui'); toast(pick(DIFFSET)) }
```

It is a toggle. It resets nothing, moves you nowhere, and can be flipped
mid-dungeon in either direction.

A `beginDifficulty(d)` is needed that resets the run and keeps the character.
From `newGame`'s shape, the split is:

**Reset** — `q`, `sq`, `unlocked` to 1, `tier` to 0, `zone` to 0, `portal`,
`ez` (per-zone adaptive), the `act2`..`act5` flags, and `resetZones()`.

**Keep** — `cls`, `lvl`, `xp`, `sp`, `ap`, `sk`, `slots`, `at`, `bag`, `eq`,
`stash`, `sats`, `credits`, `merc`, `memos`, `kills`, `deaths`, `time`,
`maxTier`, `diffGate`, and the shared `ACC` lockbox. Also `seenIntro`, so the
prologue does not replay.

Plus `G.cleared = {0:1}` so "this character finished Normal" is a fact we can
print on the credits and show on the slot, rather than inferred from
`diffGate`.

## Decisions taken

Asked and answered, so these are settled:

1. **Difficulty becomes one-way, but a cleared difficulty can be replayed.**
   The Options control stops being a setter. Any difficulty that
   `diffUnlocked` allows can be *begun*, and beginning one always runs the
   reset — including re-entering one already cleared. You cannot slide
   sideways into a finished world. Consequence accepted: "what difficulty is
   this character on" is no longer monotonic, because starting a fresh Normal
   run is legal.

2. **Boss first-kill uniques pay again on each difficulty.** `G.bk` resets in
   `beginDifficulty`. Each difficulty is its own campaign and pays its own
   first kills. `G.diffGate` remains the durable record of what has been
   cleared, so resetting `G.bk` cannot cost anyone an unlock.

3. **Existing saves are left alone.** A character already sitting on Hard with
   an unreset Normal world keeps it. The new rules gate transitions from here
   on. Nothing is demoted and nothing is taken away, at the cost of some saves
   being in a state the new rules would not produce.

## The thing in the way

**The free difficulty toggle has to go, or the reset is optional.** If a player
can set `G.diff=2` from a menu, they can skip the reset entirely and carry a
finished Normal world into Brutal — every quest done, every zone open. That is
the opposite of what D2 does and it makes the whole feature decorative.

D2's rule is that a character *moves* to the next difficulty and cannot go
back. Matching that means the options control stops being a setter and becomes
either nothing or a one-way "Begin Hard" that runs the reset.

Settled above: the control becomes "Begin <difficulty>", and beginning one
always resets. Existing saves keep whatever state they are already in.

## Sequence, end to end

1. boss5 dies → existing: `q25=3`, gate raised, `save(true)`
2. existing: `ENDING5` → `finalChoice()` → chosen ending scene → `fateScene()`
3. **new**: mark `G.cleared[G.diff]=1`
4. **new**: `playScene(CREDITS, ...)`
5. **new**: save, hide HUD, show `#title`, `showContinue()`
6. **new**: the slot shows the character as having cleared Normal, and offers
   **Begin Hard** beside **Continue**
7. **new**: Begin Hard confirms, runs `beginDifficulty(1)`, enters Stillwater

`actDone(5)`'s existing "the story is told" dialog still fits — but it should
fire on *subsequent* clears, not the first, or it competes with the credits.

## Risks

- **Save compatibility.** Adding `G.cleared` is additive and safe; the pattern
  is `migrateDiff`. Settled: existing characters are left as they are.
- **Tier and difficulty now overlap.** `G.tier` (More, +12 levels a step) is
  already the game's "harder replay" ladder, and `actDone(5)` advertises it.
  Two ladders need a stated relationship: I would keep tier as scaling *within*
  a difficulty and reset it to 0 on a difficulty change, which is what the list
  above does.
- **Boss first-kill drops.** Settled: `G.bk` resets, so every difficulty pays
  its first kills again. Check nothing else reads `G.bk` as a lifetime total —
  `migrateDiff` reads `G.bk.boss5`, but only once, behind `G.diffMigrated`.
- **Hardcore.** `G.hc` plus a forced return to character select needs checking
  against `hcBegin`/`heroDead`, which already own that screen on death.
- **Multiplayer.** `G.diff` feeds `zoneLevel`, so party members on different
  difficulties would disagree about monster level. Worth a look before
  shipping, out of scope for the plan.

## Effort

The credits and the return to select are small and low-risk — existing
machinery, content plus wiring. `beginDifficulty` is medium: the reset list is
short but has to be exactly right, and it wants a test that asserts a character
keeps its level, skills, stash and gear across the transition while the world
goes back to zero. That test is the real deliverable; the reset is four lines
once the list is agreed.

---

## Built (2026-10-11)

All of the above is now in the game, with two departures from the plan.

**The game is a thing you create and a thing that ends.** `createGame(d)` in
`src/p6.js` binds a difficulty at creation; `endGame()` ends it. Every entry
into the world goes through the create panel on the title (`openCreate` in
`src/p4.js`), and `startPlay()` sets `G.inGame`, so a page reload that finds a
game already ended lands on the title rather than back in the world. Leaving is
D2's Save and Exit: the HUD's **Save & exit** button confirms, saves, ends the
game and returns to the title; quests and acts stay finished and the districts
are rolled again on the next game.

**The free difficulty toggle is gone.** The Options row now states what this
game is and says it cannot be changed. That was listed above as "the thing in
the way" and it is the whole reason the reset is not optional.

**The ending ends the game.** All three endings run
`fateScene(() => gameOver())`. `gameOver` marks the difficulty cleared, builds
the credits from the run (class, level, time, kills, deaths, adoption, fate and
the choice made), plays them through `playScene`, then returns to the title with
the game over. `markCleared` also raises `G.diffGate`, so the record and the
unlock cannot disagree.

### Departure 1 — `actDone(5)` no longer fires on the final kill

The plan kept its dialog for repeat clears. It advertises More, the Simulator
and the boss rush, which are things you do by *staying in the game*, and the
game now ends. Rather than print advice the player cannot act on, the credits
carry a slide pointing at the next difficulty when one has just opened. The
endgame content is still there; it is reached inside whatever game you create
next. Whether a cleared campaign should instead stay open for More is a design
question this change leaves on the table.

### Departure 2 — the credits are a placeholder

The prose is a skeleton with the numbers wired in. It is meant to be rewritten
by hand.

### Tests

`tools/lifecycle-check.js` walks the whole loop over `file://`: leave play,
land on the title with the game ended, open the create panel, refuse a locked
difficulty, create on Hard and watch the world reset while the wanderer keeps
its level, confirm no `data-diff` setter survives in Options, build the credits
and check the ledger names the run, then run `gameOver` and land back on the
title with the clear recorded and the next difficulty open. Sixteen checks.
`tools/newgame-check.js` still proves the field-by-field reset.
