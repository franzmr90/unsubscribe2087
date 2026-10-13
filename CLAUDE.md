# Unsubscribe 2087

Diablo 2-style isometric action RPG. On a phone: a touch stick and buttons. On a desk the mouse is the default: left click walks and strikes, right click casts. Set in 2087 as the
aftermath of the author's novel *Project Phonix*. One self-contained HTML page, published as a claude.ai Artifact.

## Start here
`notes/PICK-UP-HERE.md` is the one live document: the goal, what is next, what is open, and the
habits worth keeping. Read it before planning work, and update it when the answer changes. The rest
of `notes/` is history kept on purpose, mostly one file per old branch -- useful to search, not to
trust as current.

## Build
`./build.sh` concatenates `src/p0.html` (CSS + markup, `<title>` first, no doctype/html/head/body) and the
scripts, in this order, inside one IIFE: formulas p1 p2 p5 p6 p7 p8 p9 p10 p11 p3 p4 p12 p13 offsite. Output: `dist/unsubscribe.html`.
All files share one scope, so load order decides what a top-level statement may reference.

| File | Contents |
|---|---|
| formulas | class life, the damage-reduction braces, the Act III experience bank. First, and `server/` requires it too |
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
| p12 | late additions that need p4 tables (quest turn-ins), the Maximalist's unlock and auras |
| p13 | games, parties, hostility, chat, proximity voice, the bug reporter — inert without the account server |
| offsite | the All-Hands cabinet in the back of the Simulator. Last, and calls no combat function |

Zones: 0 Stillwater, 1-5 Act I, 6 Simulator, 7-11 Act II, 12-16 Act III, 17/18 towns II/III, 19 subpoena, 20 Bull Run, 21-33 see p11.

## Merging
Merge to `main` every three to five commits with `--ff-only`, never in a batch at the end of a
session. Count the commits since the last merge; at three, offer. At five, say the branch is
overdue. The merge itself is the author's call -- ask, do not merge unprompted.

## Editing
Lines are long. Patch with small Python scripts that assert the anchor text exists before replacing
(`tools/ctx.py <regex>` prints matches with context). Rebuild, test, then publish.

## Testing
Playwright with Chromium; load `dist/unsubscribe.html` via `page.setContent('<!doctype html>…')`.
`window.__g` exposes G (save), W (world), P (player), S (stats), `enter`, `kill`, `update`, `talkTo`, etc.
localStorage is blocked under setContent: save tests must open `dist/Unsubscribe-2087-standalone.html` via file://.
Dialogs lock their buttons for 0.8-4s; click only `#dBtns button:not([disabled])` and retry.
`tools/smoke.js` walks all 34 zones; `tools/smoke-acts.js` walks the prequel and Acts IV-V.
`tools/record-teaser.js` records the trailer shots. `sh server/test/ci.sh` runs the server suites.
Browsers come from `PW_CHROMIUM`, else whatever Playwright brought along — do not hardcode a path.
`server/test/lan.js` needs a host with an RFC1918 address, so it does not run in a cloud container
whose only interface is a documentation address.
`node tools/text/export.js` writes `text/GAME-TEXT.md` and `.docx`: every player-facing line, editable
by hand and read back with `import.js`. `roundtrip.js` proves export, import, build and smoke still agree.

## Publishing
Artifact URL: https://claude.ai/artifact/5i4v5MTCPoKQjHbi14NCxg (capabilities db + user; omit `capabilities` and `icon` on republish).

## Known gaps
A snapshot, not a backlog -- `notes/PICK-UP-HERE.md` carries the current one.
- Acts III-V balance: `node tools/balance.js` is the controlled fight (one pack, a hero that
  presses one button) -> `notes/balance-acts-3-5.md`. `node tools/balance-play.js` is the same
  hero played properly (points, web, situational skills, loot, four waves) ->
  `notes/balance-play.md`. Read balance-play's skills/levels/web/worn columns first; a
  mis-piloted class reads exactly like a hard game. The witness is still mis-piloted.
- Cloud (account) paths for save slots, lockbox, character switching, delete and companion are untested.
- Companion feel, party-pressure step logic, boss4/boss5 tuning are first guesses.
- Held for later: real sats over Lightning, auction house.
- The multiplayer server ships and is tested (`server/`, `MULTIPLAYER.md`). It is not
  authoritative over monsters or damage, and there is no player directory. Friends, and
  letters left while someone is off, are stored on the account and survive a restart.
