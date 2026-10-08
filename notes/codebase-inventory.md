# Unsubscribe 2087 — systems inventory

Produced by a subagent reading the source, October 2026. Where the code and the
documentation disagreed, the code is reported.

**Jargon:** *district* = one zone instance (`ZONES[zi]`); *game* = a server-side shared
world holding 8; *party* = an opt-in XP-sharing group inside a game; *boon row* = a skill
row appended programmatically at Act II/III; *the rig* = the Simulator (zone 6); *the web* =
the `WARMS` passive lattice; *tier* = single-player replay difficulty (`G.tier`).

## Summary

- **8 classes**, **15 skills each** in a 5×3 grid. Homesteader and Witness are in `CLS`
  beside the original six. The Maximalist stays locked until the story flag.
- **No `SKF` gaps**: every active skill in all 8 classes has an implementation.
- Items are a faithful D2 skeleton: `AFX` prefix/suffix tiers, `UNI` (89 uniques),
  **exactly one set** (`SETS.striker`, 3 pieces), `TC` drop tables (22 entries) with a real
  diminishing-MF curve (`MFK`/`qChance`).
- **Multiplayer is the most finished and best-tested subsystem**: 474 lines of server, 18
  message handlers, 52 assertions across `games.js` + `live.js`.
- Social features are game-scoped and ephemeral. **No friends list, no offline/whisper
  messaging, no player search, no lobby filtering beyond newest-60, no ranking, no
  persistent ignore list.**
- There **are** Nightmare/Hell equivalents in two unrelated places: `DIFFS` per-game in
  live.js, and single-player `G.tier` (+12 machine levels per tier).

## Classes and skills

| key | name | hp | hpL | melee | mult | ivl | spd |
|---|---|---|---|---|---|---|---|
| scrapper | Scrapper | 130 | 17 | yes | 1.25 | .6 | 4.1 |
| hacker | Technomancer | 85 | 12 | no | 1.1 | .62 | 4.1 |
| courier | Runner | 100 | 14 | no | .82 | .4 | 4.8 |
| anon | Anon | 95 | 13 | yes | 1 | .42 | 4.7 |
| founder | Founder | 102 | 13 | no | .7 | .6 | 4 |
| homesteader | Homesteader | 120 | 16 | no | 1 | .55 | 4.3 |
| witness | Witness | 102 | 13 | yes | .8 | .68 | 4.2 |
| maxi | The Maximalist | 118 | 15 | yes | 1.2 | .5 | 4.2 |

Maxi is story-locked (`maxiCheck`).

**Tree shape.** `ROWREQ=[1,4,9,26,51]`. Row = `floor(i/3)`, 3 skills per row, 5 rows, max
rank 10. Gating: level ≥ `ROWREQ[row]`, the skill directly above (`i-3`) needs ≥1 point,
row 3 needs `G.act2`, row 4 needs `G.act3`. All fifteen skills are authored on the class.
Life and life-per-level come from `FORMULAS.cls`.

**Implementations.** `SKF` (p2.js:456, extended :480). Monster/companion AI reuses `SKF`
(p10.js:247). Fork modifiers (`FORKS`, p7.js:2) wrap casts: `over`, `lean`, `echo`,
`siphon`, `burn`. Auras exist only on maxi (indices 3, 4, 7), flagged `aura:1`, `cost:0`,
routed through `maxiSet`.

**Point economy.** 1 skill point + 5 attribute points per level. Extra from quest turn-ins,
side quests, and a first prequel win. `skCost` — ranks 1–5 cost 1, ranks 6–10 cost 2. Rank
10 grants extra power and 20% faster recovery. Completing a row grants `ROWB[r]`.
**Respec** exists at Sister Null: `150*G.cpi*G.lvl` credits, refunds skill and attribute
points. A full class change is `shapeShift` for 5 sats, keeping level, gear and quests.

**`DOCS`** = doctrines, three mutually exclusive stat trade-offs per class. **`BUILDS`** =
three preset plans per class (`doc`, `at`, `pr`, `sl`, `pa`, `web`), applied by
`buildApply`, summarised by `buildSummary`. All eight classes have entries in both.

## Items

`AFX`: 17 affixes, each with prefix/suffix, legal slots, and tiers of
`[name, minItemLevel, min, max]`. `AFX2` generates per-damage-type `t_*`/`r_*` affixes.

**Quality.** `QN=['Normal','Magic','Rare','Set','Unique']`. `makeItem(il,q,slot)`: q4 from
`UNI` (filtered `il<=il+2`, excluding `bossOnly`), q3 from `SETS.striker.items`, falling back
to q2; q1 rolls 1–2 affixes, q2 rolls 3–5 weighted; 30% of magic+ weapons get a damage type;
sockets roll 40% on normal weapon/helm/armor (1–3, helm max 2) and 15% on magic.
`req=floor(il*.75)`. `tierOf(il)` = 4 base tiers at il 7/15/22. Item level from
`zoneLevel(z)=z.lvl+G.tier*12`.

**Uniques:** 89. A `sp: null` entry is stats and flavor; the special, when there is one,
is `S.sp.<id>`. **Sets: one** — `SETS.striker`, 3 pieces.

**Drop tables.** `TC`, 22 entries: `picks`, `no`, `gold`, `item`, `stim`, optional
`goldMul`/`jewel`, and `q:{u,s,r,m}` as 1-in-N odds. **MF maths:** `MFK={u:250,s:500,r:600}`;
for unique/set/rare the effective MF is `mf*K/(mf+K)` — D2's diminishing-returns curve —
and magic uses raw MF.

**Damage types.** `DTY`: impact, surge, rust, heat, noise, plus `sound`. `SKT` maps
class+skill→type. `RES` is per-monster multipliers (0 = immune, >1 = weak). **Bypasses:**
`sound` appears in no `RES` entry at all, and `typed()` returns before the table is read, so
the Maximalist's kit is unresistable by construction.

**The web.** `WARMS`: 8 arms × 10 rings. Ring 5 is a doubled node, ring 10 a named keystone
with a trade-off. `webAdj` links ring↔ring plus cross-arm bridges every 3rd ring.
**Currency:** `webPts()=G.lvl-1+(G.para||0)-|G.web|` — one point per level *and* per paragon
level, spent permanently **with no respec path**. Nodes on an arm weaker than its opposite
arm pay **half**.

**Charms / words / crafting.** Charms live in `G.charms`, max 6 running, each billing an
inflating fee. Seed words: `WORDS` (12) socket individually; `PHRASES` (6) are the runeword
equivalent — exact word order in the right slot promotes the item to q4 and ×6 value.
Crafting spends `G.parts`: scrap, reroll, add-socket.

## Multiplayer

### server/lib/live.js
`MAX_GAME=8`, `MAX_PARTY=8`, `MAX_GAMES=200`, `MAX_PLAYERS=400`, `PVP_SCALE=0.25`,
`TOWNS={0,17,18,21,27}`, `SIM_ZONE=6`. `DIFFS`: normal 1/1/1, nightmare 2.5/1.6/1.8, hell
5/2.4/2.8 (hp/dmg/xp), chosen at creation and fixed.

**Handlers:** `hello`, `game.list`, `game.create`, `game.join`, `game.leave`, `move`,
`chat`, `invite`, `accept`, `decline`, `leave`, `hostile`, `xp`, `quest`, `pvp`, `died`,
`sim`, `rtc`, `voice`. Global cap 300 msgs/10s.

**Model.** A game is a Set of uids; a party is a separate Map scoped inside one. Hostility is
a per-player Set, mutual-OR, cleared on leaving the game, irreversible while in it.
`canFight` requires same game, same zone, mutual hostility, not a town, neither in grace.
Districts indexed by `(game, zi, inst)` in `byZone` so fan-out costs the room, not the
server. Roster pushes coalesced 200ms per game; lobby 300ms, newest 60.

**Party XP:** requires ≥2 members in the same zone.
`PARTY_BONUS=[1,1,1.5,1.75,2,2.25,2.5,2.75,3]`. Each non-killer gets
`amount * bonus * level/sum(levels)`. **The killer keeps their own full local XP, so total
XP created exceeds `amount`.**

**Monster scaling:** `hp = diff.hp*(1+.5*(n-1))`, `xp = diff.xp*(1+.5*(n-1))`, `dmg` not
scaled by headcount. Eight players on hell → hp ×22.5.

**Authoritative over:** identity, game and party membership, hostility, district membership,
Simulator wave, PvP permission and scaling. **Not:** monsters, loot, damage — each client
simulates its own world.

### src/p13.js
Transport opens `ws(s)://host/live` **only if `window.__u2087server` is set** — the Artifact
and `file://` copies are inert, which is why no call site is guarded. Exponential backoff ×6.
Single dispatch `mpRecv` over an if/else chain.

Cadence: `mpBeat` at **10 Hz** on its own interval, independent of `update()`, so reading
inventory does not look like leaving. Remote positions interpolate at `dt*9`. Remote players
drawn by `mpDraw`, dispatched from the renderer at p3.js:499. `mpSyncEnts` inserts a
`k:'player'` stand-in into `W.ents` **only for hostiles outside town**, so existing targeting
finds them.

PvP: `dmgEnemy` sees `e.mp` and calls `mpHurt`, which predicts locally at `PVP_SCALE` and
sends `pvp`. Inbound goes through `mpTakeHit` → the game's own `hurt()`, so armour, resists
and death reuse one code path; the defender reports `died`.

Voice: two Google STUN servers, full peer mesh, lower-uid-offers tie-break. Audio never
touches the server. `mpVoiceLevels` drives a per-peer GainNode + StereoPannerNode from
screen position with a 90px fade band and squared falloff; off-screen is silence.
`mpMute(uid)` silences voice **and** text.

**Exists:** game and party chat (ephemeral, last 120 client-side, **server stores nothing**),
roster, invite/accept/decline, hostility, per-player mute, proximity voice, the lobby,
password-locked games, the rig as duel or waves.

**Does NOT exist:** friends list; offline or persistent messaging; whisper; player search;
lobby filtering, sorting or search; ladder or leaderboards; persistent ignore list; guilds;
trading; shared loot or stash; cross-game presence; profiles; moderation; chat history.

### server/ account layer
Routes: `POST /api/register|login|logout|password|email|forgot|reset|verify|backup|restore|
delete|doc/get|doc/set|doc/del|bug`, `GET /api/me`. Identity = name (2–24 chars,
case-insensitive unique) + scrypt password + optional email; 30-day session cookie,
CSRF-checked on writes. Saves are **documents, not characters**: one JSON file per doc under
`data/docs/<uid>/<id>.json`, ids filtered against traversal, temp-file-plus-rename writes.

## Progression

34 zones. 0 Stillwater; 1–5 Act I; 6 the Simulator; 7–11 Act II; 12–16 Act III; 17/18 towns;
19 subpoena; 20 Bull Run; 21–26 Act IV; 27–32 Act V; 33 the 2015 prequel.

**Level cap:** 25 → 50 → 75 → 90 → 100 by act. **Paragon:** `G.para` 0–100, unlocked by
Act III, each level +1% damage, +1% life **and +1 web point**, mirrored account-wide.

**Replay difficulty** is `G.tier` — unlocked when `G.maxTier` rises on a boss kill, adds 12
machine levels and 12 item levels per tier and respawns every district. This is the
Nightmare/Hell analogue in single player; `DIFFS` in live.js is the separate per-game
version and **the two do not interact**.

Other endgame: the Simulator (endless waves, lieutenant every 5th, lockbox every 5); boss
rush (up to 20 unlocked super-uniques plus every killed act boss); subpoenas (sealed
districts with 2–3 random rules); the Bull Run; the market; adoption; reputation;
doctrines; charms; the web; the 36-slot account lockbox.

**Quests:** 25, state a flat integer per key — 0 unknown, 1 taken, 2 done, 3 turned in.
`applySave` back-fills missing keys. Side quests separate: `SQ`, 4 entries.

## Honest assessment

**Verified.** The account layer (41 assertions: traversal, CSRF, cross-account isolation,
token single-use, rate limiting). Games and lobby (28, including exact scale values and the
ninth player refused). Two-browser multiplayer (24: party formation, XP sharing, hostility
ejecting from party, the stand-in entity, PvP crossing and scaling, town safety, chat).
Maxi (22). Capacity (5) and the bug reporter (15). `tools/smoke.js` walks all districts.

**Untested.** The web, charms, crafting, seed-word phrases, doctrines, `BUILDS`, respec,
`shapeShift`, paragon, `G.tier`, the market, the Simulator, the boss rush, subpoenas, the
lockbox. Acts III–V balance is unmeasured; boss4/boss5 and party pressure are guesses.
`adaptKill`/`adaptSpawn` are heuristics with no coverage. Rows 4 and 5 of every tree are six
repeated mechanics behind 36 names. One set family and six phrases make that layer nominal.

**Hardest places to extend.**
1. **A new class** must land in six tables in load order: `CLS`, `BN`, `BN3` (a missing key
   crashes the boon loop at load), `SKF`, `SKT`, `DOCS`, `BUILDS`. `buildApply` and
   `shapeShift` index by class key with no fallback.
2. **Rendering a new class** needs `drawCls` in p3.js plus a colour; the aura path is a
   bespoke branch, so a second aura class re-opens `cast` in p2 and p10.
3. **Any persistent social feature** has nowhere to live: `live.js` state is three in-memory
   Maps wiped on restart, and the only durable store is scoped strictly to one uid by
   design — cross-account reads are explicitly blocked and tested.
4. **Any player directory** runs into `lobby()` returning the newest 60 games with no query
   surface, and `live` keyed only by uid with no name index.
5. **Client message handling** is one 70-line if/else chain with UI redraws interleaved, and
   the panel is three string-building functions dispatched through flat `data-mp*` checks —
   adding a tab means editing all three plus `drawSheet` in p4.js.
