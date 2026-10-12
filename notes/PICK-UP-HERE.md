# Where to pick up

The one live document. Everything else in `notes/` is history kept on purpose;
`CLAUDE.md` is the standing reference for how the code is built and tested.
Read this first, update it last, and keep it to one page of truth rather than a
record of everything that happened.

Last true as of **2026-10-12**, `main` at `859cc2d`.

---

## The goal

**A game that holds together end to end.** The front half -- Acts I to III --
has had passes for balance, skills, effects, items and readability. The back
half has had less. The eighteen Act IV and V creatures borrow nine drawing routines
between them, and eight of its thirteen zone styles have no sky. The goal is
parity, so that a player who reaches Act V is still playing a game somebody
finished.

Three tests of done, in order of how much they matter:

1. **Nothing in the back half is borrowed without a reason.** The two final
   bosses already pass this; the eighteen Act IV/V creatures do not, and should
   read as themselves rather than as three colours of the same Siren.
2. **Every system the player can see has something to show for it.** Check each
   before calling it a gap -- a money conversation needs no particle -- but
   shrines and shapeShift are not conversations.
3. **It still loads before you can tell.** The ceiling is the pause at a zone
   boundary or on joining, not a byte count. `node tools/bake-budget.js` reports
   it; today it is 31ms against a 900ms curtain, so the game can get a good deal
   bigger. Keep new art in the boot bake rather than baking it on first sight.

---

## How we work

- **Branch per feature, merge, delete.** Start from a current `main`, branch
  named for the thing, merge with `--ff-only` when it is done, delete the
  branch. The repo has 131 branches and 58 unmerged leftovers because the last
  step kept getting skipped.
- **`./build.sh` after every source change.** It concatenates `src/` into
  `dist/`. `tools/web-bundle.sh` additionally regenerates `web/`, which is
  gitignored; `node tools/pack-lan.js` makes the home-network zip.
- **Patch with small Python scripts that assert the anchor first.** Lines are
  long. A script that writes only at the end means a failed assert leaves
  nothing half-applied -- confirm with `git status` when one trips.
- **`dist/` is committed.** Two branches that both rebuild will conflict in a
  1.1MB generated file. Work one branch at a time; on a conflict take either
  side and rebuild rather than merging by hand.

### The quality bar

These are the habits that actually caught things, not general advice:

- **Prove a new test fails on the old code.** Every fix this week was confirmed
  by reverting the fix and watching the test go red. A test that passes before
  and after is measuring nothing.
- **Run the suite, not the one test you wrote.** `sh server/test/ci.sh` for the
  server, `tools/smoke.js` for the 34 zones, `tools/smoke-acts.js` for the
  prequel and Acts IV-V.
- **A tool that fails is either a bug or a stale expectation.** Decide which and
  say so. Do not leave a red check sitting on `main` unexplained -- see the
  open items below for two that were.
- **Check the claim before reporting it.** Two documents in this folder had
  confident headline findings that were wrong on inspection. Both corrections
  are left visible in the files.

---

## The backlog

From the audit of 2026-10-12. All eight classes and all 120 skills already have
art rows; this is what does not.

### CORRECTION, 2026-10-12: the first audit was wrong about the bosses

The first version of this backlog led with "the final bosses are clones of the
Act III boss". That was wrong, and it is left here rather than deleted because
the mistake is instructive: it came from reading a data table and not the code
that draws or drives it.

- **`boss4` and `boss5` have their own stats** (`src/p11.js:16,23`): The Curator
  at 2400 life, PROVIDENCE at 3000, each with its own damage, sight, reach and
  palette. Hand-tuned, not copied.
- **Both have their own renderer branches** (`src/p3.js:762,783`), and they are
  among the more considered drawings in the file. The Curator is a bone-white
  frame with open empty hands held away from the body and six attending lights,
  whose face goes from a smile to a flat line below half life. PROVIDENCE is a
  dark wedge behind forty-one fans -- the forty-one ways it has already seen the
  conversation go -- which go out as you take its life away.
- **Both have their own AI** (`BAI` in `src/p11.js:218`), with their own shot
  patterns, their own summons, and a dialogue turn mid-fight. The Curator stops
  the fight at half life to ask whether you are proud of her, and the answer
  moves her health either way.
- **What they do share with boss3 is the drop table**, which is the `c('boss3',
  ...)` line at `src/p11.js:24`. `c()` builds `TC` entries, not `ET` ones. A
  final boss dropping like a final boss is a decision, not an oversight.
- The `spr:'boss'` and `spr:'mono'` fields on those two are dead: `drawEnemy`
  branches on `e.k` before it ever consults `spr`.

The claim that `p11.js` "draws no effects" was also wrong, and in the same way.
It has its own `ringShot` and `callIn` helpers, coloured projectiles, a warn
telegraph, and per-boss phase dialogue. The grep behind the claim counted only
`fxFoo(` calls and missed `W.fx.push`; the grep that replaced it dropped the
word boundary and counted every `sfx(` instead. Neither number meant what it
was reported to mean.

### What is actually left

| | Item | Where | Notes |
|---|---|---|---|
| 1 | **Eighteen creatures borrow nine drawing routines** | `src/p11.js:10-22` | This one holds up. Each has its own stats and its own palette, but `spr` points at another creature's drawing, and none has a branch of its own in `drawEnemy`. Oracle, Well-Wisher and Camera are the Siren in three colours. They need a mark that reads at a glance in motion. |
| 2 | ~~Eight styles with no backdrop~~ **DONE** | `BGK` in `src/p3.js` | Two new skies: the Gentle Years (a kept place, not a ruin) for Act IV, and 2015 daylight for the prequel -- the only daylight in the game. `tools/sky-sheet.js` shoots them. |
| 3 | **`p8` and `p9` have no effects at all; `p5` and `p6` have one each** | those files | Some of that is correct -- a money conversation needs no particle. Shrines and shapeShift are not conversations. Check each before assuming it is a gap. |
| 4 | **`tools/vfx-wire-check.js` is red on `main`** | that file | Stale expectations, not a bug. See the open items below. |

### The graphics plan

`notes/GRAPHICS-PLAN.md` is the ladder: what to improve, cheapest first, in the two
currencies that matter (bytes on the page, milliseconds at the curtain). It also
records why three.js is not the lever, with the measurements behind that.

### The budget, measured

`node tools/bake-budget.js` reports what a player actually waits for. As of
today: a cold flipbook bake is 17-78ms depending on class, mean 31ms, holding
8-11MB of canvas. The loading screen holds for 900ms minimum, so there is
roughly thirty times the current cost in headroom before anybody notices.

Two things that budget depends on, and that new art must not break:

- **Sheets cache for the session**, so a zone boundary costs nothing. Anything
  baked lazily on first sight of a monster would instead cost a hitch in the
  middle of play. New art belongs in `fxPairs` so it bakes at boot, behind the
  curtain, with everything else.
- **A joining player pays the bake once**, at `startPlay`, not per zone.

So the ceiling is not bytes. Measure with the tool, spend against the headroom,
and keep the bake in one place.

### A different kind of work

The eighteen cinematic backdrop painters in `src/p4.js` (`skyline ticker feed
wanderer title harrow lift dawn cage nipper letters node cloud vale clock board
mono lake`) are hand-drawn canvas and have never been touched by any pass.
Treat them as illustration, not effects, and schedule them separately.

---

## Open, not blocked on a session here

- **`tools/vfx-wire-check.js` fails on `main`.** The old note blamed a missing
  SKV table on a branch; that is no longer true -- SKV is in `main` with all 120
  rows. It now fails because the skill graphics passes deliberately re-kinded
  three skills and the checker's expectation table was not updated with them:
  it wants `courier 6 = orbit`, `anon 1 = trail`, `witness 12 = patch`, and the
  live table says `trail`, `ring`, `mark`. Fix the expectations, or retire the
  checker in favour of `tools/skill-aim.js` and `tools/aura-ring.js`.
- **58 branches are unmerged and 73 of their commits have no equivalent in
  `main`.** A spot check of `hs-wit-feel-3941` found all four of its tool files
  already present in `main`, so the work was redone rather than lost -- but that
  is one branch of 58 and the rest are unaudited. List and command in
  `notes/dead-branches.md`. Deleting refs is refused from a cloud session (403);
  run it from a clone with push rights.
- **`server/test/lan.js` has never run for real.** It needs a host with an
  RFC1918 address; a cloud container has only a documentation address. It is
  last in `ci.sh` now, so it no longer aborts the four browser suites that used
  to follow it -- which is how `mobs`, `coop`, `live` and `soak` went unrun for
  a stretch.
- **`tools/classes.js` fails here only.** The build loads a Google Font, this
  sandbox intercepts TLS, and the check treats any console error as failure.
  Zero FAIL lines; it passes on a normal network.
- **`text/GAME-TEXT.md` and `.docx` are edited by hand.** `node
  tools/text/export.js` writes them, `import.js` reads them back,
  `roundtrip.js` proves export, import, build and smoke still agree.
- **The credits prose is a placeholder.** `creditSlides()` in `src/p4.js` wires
  the numbers in; the words are meant to be rewritten.

---

## Recently done

Kept short on purpose. The commit log is the record; this is only what stops
somebody redoing it.

- **Four bots play Act I together, then fight.** `tools/party-playtest.js`.
  Its run found and fixed eight multiplayer bugs: quest sharing, per-character
  districts, the 60-monster cap, host-only monster aim, Pryce's ring and slam,
  hostile players unclickable, a Witness's left click, and the unannounced duel.
  Write-up and what is still open: `notes/PLAYTEST-multiplayer.md`.
- **The game is created and ended, not toggled.** A difficulty is bound when a
  game is made, in single player and multiplayer alike. Leaving is D2's Save and
  Exit. The ending marks the clear, rolls credits and returns to the title.
  `tools/lifecycle-check.js`, `tools/newgame-check.js`.
- **Hostility survives a reconnect.** `MP.hostile` held only what the browser
  watched arrive, so a declared hostile could go red in the roster and still be
  unhittable. It reads the server's roster now. `tools/hostile-check.js`.
  (The *friction* the 10 Oct audit asked for -- town only, level 9, an arming
  delay, a cooldown, a portal lock -- was already in `server/lib/live.js`.)
- **Two people in one game see one district.** Difficulty was being applied
  twice, once from the character and once from the game, so monster power was
  the product of both. One Siren had 86 life for one player and 1687 for the
  other. Covered in `server/test/maps.js`.
- **The champion shuffle is engine-independent.** `sort(() => random())` draws a
  number of times that is the engine's own business, so a Chrome host and a
  Safari guest diverged at the first champion. Fisher-Yates draws exactly n-1
  anywhere.
- **Menu and Save & exit show on a desk.** One CSS rule had swept the bottom
  bar in with the thumb controls.

---

## State

All 120 skills across 8 classes have art rows. Server suites: `run` 39, `wire`
13, `social` 59, `games` 40, `capacity` 5, `bug` 15, `intake` 31, `disclaimer`
11, `maxi` 23, `invite` 9, `guard` 22, `reconnect` 13, `admin` 10, `maps` 25,
`plaus` 60, deploy dry-run 20, `mobs` 21, `coop` 40, `live` 100, soak clean at
20 bots. 34/34 zones, the acts walk clean. `lan.js` unproven here by design.
