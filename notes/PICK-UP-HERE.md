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
half has not, and it shows: the last two bosses are the Act III boss recoloured,
every Act IV and V creature is a reskin of an Act I creature, and the file that
holds a third of the game draws no effects at all. The goal is parity, so that
a player who reaches Act V is still playing a game somebody finished.

Three tests of done, in order of how much they matter:

1. **Nothing in the back half is borrowed without a reason.** The Curator and
   PROVIDENCE have their own bodies and their own tells. The eighteen reskinned
   creatures read as themselves.
2. **Every system the player can see has something to show for it.** Shrines,
   subpoenas, shapeShift, dodge and the boss rush are moments; none of them
   currently draws anything.
3. **The suites still pass and the file still fits.** Art that costs a megabyte
   is not art we can ship; the whole game is one HTML page.

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

### The back half

| | Item | Where | Notes |
|---|---|---|---|
| 1 | **The final bosses are clones** | `src/p11.js:16,23` | `boss4: c('boss3', 'The Curator')` and `boss5: c('boss3', 'PROVIDENCE')` borrow MANDATE's body *and* behaviour. New names, palettes, resistances; nothing else. The credits now fire straight after one of them. **Start here.** |
| 2 | **`p11.js` draws no effects** | all of `src/p11.js` | Zero `fx*` calls against 40 in `p2.js`. That is the prequel (zone 33), Act IV (21-26) and Act V (27-32). Nine `sfx()` calls are the only feedback in the file. |
| 3 | **Eighteen creatures, nine borrowed bodies** | `src/p11.js:25-26` | Oracle, Well-Wisher and Camera are all the Siren. Validator, Firewall and Companion are all the Enforcer. They need marks that distinguish them at a glance. |
| 4 | **Eight styles with no backdrop** | `BGK` in `src/p3.js:932` | `cutler mile sofa list kitchen garage vault cage` fall through to the default horizon. All thirteen Act IV/V styles do have tile palettes, so the ground is right and the sky is not. |

### The systems with nothing to show

`p5` (side quests, bounties, shapeShift), `p6` (nodes, events, feats, boss
rush), `p7` (charms, subpoenas, proof-of-work shrines, dodge, Mr. Float), `p8`
(money talk, shitcoiners) and `p9` (Unity campaigns, fate) make **zero** `fx`
calls between them. Some of that is correct -- a conversation needs no
particle. Shrines, subpoenas, shapeShift and dodge are not conversations.

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
11, `maxi` 23, `invite` 9, `guard` 22, `reconnect` 13, `admin` 10, `maps` 22,
`plaus` 60, deploy dry-run 20, `mobs` 19, `coop` 40, `live` 100, soak clean at
20 bots. 34/34 zones, the acts walk clean. `lan.js` unproven here by design.
