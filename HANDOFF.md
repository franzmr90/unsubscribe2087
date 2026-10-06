# Handoff

Written when the previous session ran out of compute mid-task. Everything below is pushed
to `claude/unsubscribe-2087-story-fb99ov`. The working tree is clean.

## Where things stand

The game ships and works. One self-contained HTML file, built by `./build.sh` from `src/`.

| | |
|---|---|
| **Live (single-player)** | <https://unsubscribe2087.netlify.app/> — **stale**, predates the Maximalist and the web +. Needs a manual re-drop, or the two Netlify secrets below. |
| **Artifact** | <https://claude.ai/artifact/5i4v5MTCPoKQjHbi14NCxg> — v62, current |
| **Multiplayer** | Built and tested, but needs the account server. Not deployed anywhere yet. |

**To make deploys automatic**, set two repository secrets and never touch Netlify again:
`NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`. See `DEPLOYING-THE-GAME.md`.
The workflow only deploys to production from `main`; this branch produces draft previews.

## The task that was interrupted

The user asked for research into **Diablo II patch 1.08**, a comparison against this
codebase, and a plan to get to **eight character classes** that mirror D2's roster while
being original enough not to read as plagiarism. Also specifically: how the friends list,
friend messaging and party dynamics worked.

**Two of three steps are done.** Both research reports are in `notes/`:

- `notes/diablo2-1.08-research.md` — sourced, with UNVERIFIED flags where a primary
  source could not be reached. Read the flags; do not treat flagged claims as fact.
- `notes/codebase-inventory.md` — this project's systems, read from source rather than
  from documentation.

**The plan is written:** `notes/PLAN-eight-classes.md`.

It is a design document. It does not add a class, replace the skill rows, or build
the friends list. The order it argues for is: make rows 4 and 5 real, one class at
a time (milestone 0); then the Homesteader, the Druid analogue (milestone 1); then
the Witness, a class with no Diablo II counterpart (milestone 2); then a social
store that is not the document store (milestone 3), the friends list (4), whispers
and offline mail (5); and last, the party-experience and hostility changes (6),
because those change numbers. Each milestone names the test that says it worked.
The per-class checklist is at the bottom of the plan. Read it before adding a class.

**Milestone 0 of that plan has landed on this branch.** Each of the six classes has its own row 4 and row 5. The section below that still describes those rows as shared boons is the tree from before that work. Do not put the boons back.

**The next plan is written:** `notes/PLAN-skill-vfx-and-copy.md`.

It says how unique skill graphics fit the canvas the game already has, how combat stays readable on a phone and in a party of eight, and how to audit the copy without sanding off the voice. Read it before retargeting a skill or rewriting a dialog.

**V1 of that plan has landed.** The purple circle that painted whenever skill 11 was learned is gone. Shapes, particles, and lights are capped (48, 80, and 16). Options has an Effects control — Full, Normal, Thin — defaulting to Normal. Thin keeps your own telegraphs and marks, and skips particles, extra lights, and other players' casts. `node tools/v1-check.js` is the budget check.

**V2 has landed on this branch.** Each of the six classes has a shape record for every skill. A cast plays that shape instead of the old class-colored ring. The same glyph is drawn on the skill button and in the tree, colored by damage type. Passives are glyphs only. Charges, auras that stay up, The Dip, and vesting stacks are still unread on the body: that is V3. Nothing was added to the move packet. Copy rewrites have not started. `node tools/v2-check.js` casts every active and checks the shape.

## What the research changes

Read both reports, but these are the findings that should drive the plan:

1. **1.08 is Lord of Destruction's launch-day build (29 June 2001)**, not a mid-life patch.
   Targeting it means targeting the original LoD design, before later rewrites.
2. **No skill synergies in 1.08** (they arrived in 1.10). Points were fungible across
   trees, so hybrids and odd builds stayed viable. If you want 1.08 feel, do not add
   synergies.
3. **No respec until 1.13, in 2010.** Allocation was terminal, which is what made
   characters identities. This project *does* have a respec (Sister Null) and a full class
   change (`shapeShift`). That is a deliberate divergence worth keeping or killing on
   purpose, not by accident.
4. **D2 party experience is a flat +35% pool, level-weighted split — there is no
   party-size bonus table.** This project uses `PARTY_BONUS=[1,1,1.5,1.75,2,…,3]`, which is
   far more generous than D2 ever was. Decide which you want.
5. **Monster scaling matches already**: D2's `(players+1)/2` is the same curve as
   `gameScale`'s `1+.5*(n-1)`.
6. **D2's drop *frequency* scaled with party size** as `1 − 0.75^n`, never quality. This
   project has no equivalent.
7. **Hostility in D2 was far more mechanical than here**: town-only declaration, level 9
   minimum, once per minute, declaring destroys your own town portals, a 10-second lockout
   before you can leave town, and un-hostiling is asymmetric — they stay hostile to you.
   This project has the shape but little of the friction.
8. **Six of this game's classes already map onto six D2 archetypes.** Only the Druid is
   unclaimed. "Eight classes" therefore means: a Druid analogue, one wholly original
   eighth, and deepening the six that exist.

## The biggest obstacle, named plainly

This was true when the eight-class plan was written. **On this branch it is done.** Rows 4
and 5 are authored skills, and `BOON`, `BN`, and `BN3` are gone. What follows is the old
description, kept so the plan's reasoning still reads.

**Only 9 of the 15 skills per class were real.** Rows 4 and 5 were not authored: they were six
generic mechanics (`strike`, `mend`, `aura`, `nova`, `mastery`, `guardian`) pushed in a loop
at `src/p1.js`, given per-class *names only* via `BN` and `BN3`. Thirty-six
names, six behaviours. D2 hand-designed every tier. Closing that gap was worth more than any
new class.

## Other things the plan must account for

- **Adding a class touches six tables in load order**: `CLS` (p1.js:15/87), `BN` and `BN3`
  (p1.js:89/93 — a missing key crashes the boon loop at load), `SKF` (p2.js:456), `SKT`
  (p10.js:79), `DOCS` (p10.js:57), `BUILDS` (p10.js:154). `buildApply` and `shapeShift`
  index by class key with no fallback.
- **Auras are not a system.** The Maximalist's three are a bespoke branch
  (`maxiSet`/`maxiAura`/`maxiBuff`). A second aura class re-opens `cast` in p2 and p10.
- **A friends list has nowhere to live.** `server/lib/live.js` holds three in-memory Maps
  wiped on restart; the only durable store is per-account documents in
  `server/lib/store.js`, where cross-account reads are deliberately blocked *and tested*.
  Friends, whispers and offline mail all need a new persistence layer, not a new handler.
- **There is no player directory.** `live.get(uid)` is the only lookup the protocol has —
  no name index — and `lobby()` returns the newest 60 games with no query surface.
- **One set family, six runeword phrases.** That layer is nominal next to D2's.

## On the originality question

Game *mechanics and systems* are not protectable: skill trees, aura stacking, party
experience curves and hostility rules can all be studied and reimplemented freely. What is
protectable is names, specific skill names, lore, character designs and art. This project is
well clear of that line and should stay there deliberately. The Maximalist's own tagline —
"A paladin, essentially" — is the right instinct: worn as a joke, the influence reads as
heritage. The eighth class having no D2 counterpart at all is the strongest proof the roster
is not a tracing.

## How to work on this codebase

Read `CLAUDE.md` first. The things that will bite you:

- **Patch with `tools/patch.py`**, which refuses to write unless every anchor matches
  exactly once. Lines run to hundreds of characters and a sloppy `sed` hits the wrong one.
  It resolves paths against `src/`, so it cannot patch `tools/` or `server/`.
- **Load order decides what top-level code may reference.** A `const` arrow in a later file
  called at load from an earlier one throws; function *declarations* hoist across the single
  shared IIFE. This has broken the boot twice.
- **Screenshots lie unless you clear dialogs and move the player.** `update()` does not run
  while a dialog is up, so the map draws nothing and the zone looks broken.
- **Anything driving the page must call `__g.skipDisc()` first** — the disclaimer card holds
  the screen for about seven seconds.
- **Run the tests that the change can plausibly break**, not all of them. `node
  tools/smoke.js` (boots and walks all 34 districts) catches most things. The server suites
  under `server/test/` are only relevant to server changes.

## Known-good state

All suites passed at the last commit touching their areas: 39 account, 26 lobby, 24 live
(two real browsers), 22 Maximalist, 15 bug reporter, 11 disclaimer, 5 capacity, 34/34
districts, and the Acts IV–V walk.

Untested, and listed honestly: the passive web, charms, crafting, seed-word phrases,
doctrines, builds, respec, `shapeShift`, paragon, difficulty tiers, the market, the
Simulator, the boss rush, subpoenas, the lockbox. Acts III–V balance has never been
measured by anybody.
