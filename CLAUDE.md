# Unsubscribe 2087

Diablo 2-style isometric action RPG for phone browsers (touch joystick + buttons). Set in 2087 as the
aftermath of the author's novel *Project Phonix*. One self-contained HTML page, published as a claude.ai Artifact.

## Build
`./build.sh` concatenates `src/p0.html` (CSS + markup, `<title>` first, no doctype/html/head/body) and the
scripts, in this order, inside one IIFE: p1 p2 p5 p6 p7 p8 p9 p10 p11 p3 p4 p12. Output: `dist/unsubscribe.html`.
All files share one scope, so load order decides what a top-level statement may reference.

| File | Contents |
|---|---|
| p1 | data: classes/skills, enemies `ET`, drop tables `TC`, `ZONES`, `QUESTS`, memos, uniques |
| p2 | core: `calc`, `cast`, `hit`/`hurt`, `spawn`, `kill`, `enter`, towns, zone generation, saves (3 slots + cloud), `update` |
| p5 | side quests `SQ`, bounties, `shapeShift` |
| p6 | seed words, reputation, adoption, nodes, events, feats, boss rush, `actOf`/`townOf`, quest tracker |
| p7 | skill forks, dodge, passive web, charms, subpoenas, proof-of-work shrines, Mr. Float |
| p8 | money conversations, social credit, shitcoiners |
| p9 | Unity campaigns, fate (reserve / stalemate / fail) |
| p10 | locals, shared lockbox `ACC`, adaptive difficulty, doctrines, damage types, weapon families, class uniques, Bull Run, builds, boss entrances, tag-along companion, party pressure |
| p11 | the book: prequel (zone 33), Act IV (town 21, zones 22-26), Act V (town 27, zones 28-32), bosses `boss4`/`boss5` |
| p3 | renderer |
| p4 | cinematics, dialogs, HUD, sheets/menus, input, `window.__g` test hook |
| p12 | late additions that need p4 tables (quest turn-ins) |

Zones: 0 Stillwater, 1-5 Act I, 6 Simulator, 7-11 Act II, 12-16 Act III, 17/18 towns II/III, 19 subpoena, 20 Bull Run, 21-33 see p11.

## Editing
Lines are long. Patch with small Python scripts that assert the anchor text exists before replacing
(`tools/ctx.py <regex>` prints matches with context). Rebuild, test, then publish.

## Testing
Playwright with Chromium; load `dist/unsubscribe.html` via `page.setContent('<!doctype html>…')`.
`window.__g` exposes G (save), W (world), P (player), S (stats), `enter`, `kill`, `update`, `talkTo`, etc.
localStorage is blocked under setContent: save tests must open `dist/Unsubscribe-2087-standalone.html` via file://.
Dialogs lock their buttons for 0.8-4s; click only `#dBtns button:not([disabled])` and retry.
`tools/smoke-acts.js` walks the prequel and Acts IV-V. `tools/record-teaser.js` records the trailer shots.

## Publishing
Artifact URL: https://claude.ai/artifact/5i4v5MTCPoKQjHbi14NCxg (capabilities db + user; omit `capabilities` and `icon` on republish).

## Known gaps
- Acts III-V balance is unmeasured; the old balance bot stalls on dialog locks and needs a rewrite.
- Cloud (account) paths for save slots, lockbox, character switching, delete and companion are untested.
- Companion feel, party-pressure step logic, boss4/boss5 tuning are first guesses.
- Held for later: multiplayer server, real sats over Lightning, auction house.
