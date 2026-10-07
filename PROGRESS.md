# PROGRESS

Working log for the story + production-quality pass described in `PLAN.md`.
See `git log` for the authoritative order of changes.

**Published.** The Artifact at <https://claude.ai/artifact/5i4v5MTCPoKQjHbi14NCxg> carries
this work (version 59). `./build.sh` writes both dist files; republishing after further
edits just means publishing `dist/unsubscribe.html` to that same URL again.

**What the Artifact can and cannot show you.** Everything single-player: the story pass,
the renderer work, the market at Nonce's counter, and the Report button (which, with no
server behind it, puts the report on your clipboard instead of filing it). It cannot show
the lobby, games, parties, hostility, chat or voice — those need the account server, and the
build deliberately stays inert without it. To see them, run `node server/server.js` and open
two browsers on it.

---

## Done

### Build and tooling
- **`build.sh` writes both dist files.** It previously wrote only
  `dist/unsubscribe.html`, so `dist/Unsubscribe-2087-standalone.html` could drift
  silently. The wrapper swaps the fragment's bare `<title>` line for a real `<head>`;
  verified it reproduces the previously committed standalone byte for byte.
- **`tools/patch.py`** — assert-then-replace helper. Every edit must match its anchor
  exactly once or the script aborts before writing anything. All source edits in this
  session went through it; nothing was hand-edited.
- **`tools/smoke.js`** — boots `dist/unsubscribe.html` under Playwright, walks all 34
  zones, renders every sheet tab, fails on any page error. `node tools/smoke.js [outdir]`.
  Currently 34/34 zones, no errors.
- **`tools/smoke-acts.js` un-stalled.** Its input path pointed at a machine that is not
  this one. It now reads `dist/`, defaults its output to a temp folder, reads the dialog
  title from the right element, and exits non-zero on a page error. It walks the prequel
  and Acts IV–V end to end, including the three-way ending, clean.

### Story — the three machines (PLAN 1.1)
The novel's own notes name the three machines as what readers lose track of. The game
made it worse: two of the three had no name, and the kind machine and the hostile one
were both "a machine that chooses what people see".

- **Phonix is named**, from the title screen and opening cinematic onward. Her *nature*
  is still the Act IV reveal; only the name moved earlier.
- **The difference between her and MANDATE is stated once, plainly**, in INTRO slide 3
  and again in the title blurb — which previously opened on "The Gentle Years ended in
  2035", meaning nothing to a non-reader and not saying who ended them.
- **Act III's ending says the slab was a room, not the mind.** The Act IV intro had been
  assuming the player already knew this.
- **STILLWATER** is named in Act V by the Old Drive, and the town's name pays off —
  Gramps wonders about it in Act I, the Old Drive answers it in Act V.
- **PROVIDENCE**'s reveal keeps its place but now says who built it, when and why.
- The Curator's boss title is `The Curator · Phonix`. Vale and the Act II ending now name
  Phonix instead of saying "she" to a player who has no referent for it.

### Story — the Story tab (PLAN 1.2)
New `story` sheet tab (`STORYDEX` in `src/p11.js`, rendered in `src/p4.js`). Five
sections: the three machines, what happened before you were born, money, vocabulary,
people. **Entries unlock from existing save state** (`G.act2..5`, `G.q.*`, `G.module`,
`G.sq`) — no new save fields were needed for unlocking, so old saves work. Seen entries
are tracked in `G.sdx`; new ones carry a cyan flag plus a dot on the tab. Locked entries
show their title and where to go and find out, so the tab doubles as a signpost. A toast
five seconds after the opening points first-timers at it (`sdxNudge()`, guarded by
`G.sdxTold`).

### Story — canon weight in Acts I–III (PLAN 1.4)
Eight new memos and eleven new gossip lines carrying beats the game only had in Acts
IV–V: Halloran, Natalya's refusal at eleven at night, the nine days, the town's name.
Per the novel's own rule that **the opposition gets one argument nobody refutes**,
Mr. Float gets a memo making the case for credit, and another states what hard money cost
Ines's father. Neither is answered anywhere in the game.

### Story — items (PLAN 1.5)
**Acts IV and V had no uniques at all.** The highest item level in the game was 34; those
districts run 45–72, so the two acts the book is actually about paid worse than Act III.
Eleven new uniques fill it, each carrying a beat the fight cannot stop to tell: The Eleven
Pages, Out Where, Nurse's Hours, Four Thousand Two Hundred and Eleven, Eighty-Two Minutes,
Ten Minutes, Not Your Keys, Uncertain Knowledge, Twenty-One Million, plus a boss drop each
for The Curator and PROVIDENCE. Two needed real engine hooks (`tenmin`: +60% against an
untouched machine; `e82`: guaranteed deadly strikes for 3s after a dodge) and both are
verified firing. The rest use existing affix/grant machinery. The endgame unique pool now
grows 33 → 41 distinct items between item level 47 and 72.

### Renderer (PLAN 2.1–2.6)
- **Ambient light rework.** `AMBC` tints the shadow veil per style; a source-atop pass
  tints the veil inside coloured lights so lamps warm their surroundings instead of
  cutting grey holes; a broad weak fill light sits under the player's lamp with strength
  derived from the floor palette's luminance (`TX.fill`), so dark zones lift and pale ones
  (Rack Nine, the Vaults, the Mezzanine) don't wash out. Falloff is wider and softer; the
  vignette was pulled back from .5 to .34.
- **Per-zone weather** (`WX` + `weather()`) replaces the single mote field: rain,
  data-rain, embers, dust, sinking letters, spores, drifting blobs. Two layers; the near
  one parallaxes against the camera.
- **Twelve new floor-detail and seven new wall-face styles** (`FD`, `WD`) for zones that
  borrowed another style's art, each drawing the sentence in its own zone intro.
- **Floor palettes that rendered as black lifted**: chain, mempool, blocks, room, vault,
  still, lake. The chain's walls were toned down once they became visible.
- **Layered parallax backdrops.** Each of the four backdrop kinds now has three silhouette
  bands at three parallax rates with lit windows in the far ones.
- **Rim light** on figures and heavy frames from the zone's own light colour; contact
  shadows are a soft spread plus a tight core.
- **The Curator and PROVIDENCE have their own silhouettes.** boss4 was drawing the Act I
  Vice-President with a text-glyph face; boss5 reused the Act III slab unchanged. The
  Curator keeps the executive frame (her intro says it is the only body these machines
  know how to build) but with open hands, a drawn smile that flattens below half life, and
  six attending lights. PROVIDENCE is a taller slab fanned by the forty-one ways it has
  modelled the conversation going; the fan goes out as its life does.
- **`zoneMusic()` hardened** — it resolved a track key through `STY[...].like` and threw
  when a style stopped borrowing one.

**Performance.** The first cut of the backdrop work dropped the chain zone from 52 to 29
fps under software rendering, because two full-screen gradient rasterisations per frame
cost more than every other backdrop draw combined. The static part of each backdrop and
the vignette are now baked once per style and viewport and blitted; the veil-tint pass
skips anything smaller than a real lamp; the densest particle fields were trimmed. Final
measurement: **45–48 fps against a 46–52 fps baseline** across zones 1, 3, 13 and 28.

---

## Not done, and why

- **Acts III–V balance was measured in #35.** Seven glass normals got more life. Bosses,
  uniques, and the multiplayer experience curve were left as they were. The numbers are in
  `notes/balance-acts-3-5.md`.
- **Cloud/account save paths are still untested.** Unchanged from before; they need a
  signed-in browser, which this environment does not have. The save-shaped changes I made
  (`G.sdx`, `G.sdxTold`) are additive and absent-safe: `sdxUnseen()` and `sdxSeen()` both
  tolerate a missing object, so an old save loads and simply shows every entry as new.
- **Companion leash.** Hireling damage matches the hireling sheet, and the #35 pressure
  window (under 0.45s up, over 1.8s down) was left alone. On a winding floor a bodyguard
  or a rendered companion fell about ten tiles behind and never recalled, because recall
  waited until 13. They now catch up at 8 tiles unless the swing they are on is already in
  range.
- **Post-clear loop.** Simulator, boss rush, Nonce, magic find, hardcore, difficulty, and
  the Maximalist were already in place. Tier, respawn, subpoenas, and the servo-leg run
  were stuck on the Act IV page of the Transit Gate, so the harder tier promised at the
  end of Act I could not be raised until Act IV. Those controls now live on More.
- **No new art assets.** There are none in the project and none can be made; everything
  above is drawing code.
- **Acts I–III quest *structure*** is unchanged. I rewrote framing text, not quest design.
  The quests are still all "go to district N and break the named thing", which is fine for
  a Diablo-like but is the place to look if you want the acts to feel less uniform.

---

## Things to know if you pick this up cold

- **Patch with `tools/patch.py`, not by hand.** Source lines run to hundreds of characters
  and a sloppy `sed` will silently hit the wrong one. The helper refuses to write unless
  every anchor matched exactly once.
- **Screenshots lie unless the fog is lifted.** Entering a zone opens a dialog, and
  `update()` does not run while a dialog is up, so `W.seen` stays empty and the map draws
  nothing at all — you get a backdrop and a floating player and conclude the zone is
  broken. Dismiss every `#dBtns button:not([disabled])` (some lock for 4s) *and* move the
  player before judging a frame. I lost a while to this.
- **`STY[style].like` is load-bearing for three things**: the texture base, the prop set in
  `drawObj`, and the music track in `zoneMusic`. Removing it to give a style its own art
  breaks audio. Keep `like` and override the drawing via `FD`/`WD` instead.
- **A unique's `sp` string is display text only.** The actual effect is keyed on the
  unique's `id` as `S.sp.<id>` and has to be coded wherever it applies. A new unique with a
  new `id` and a prose `sp` will read correctly and do nothing. Either hook it or use
  `sp:null` with strong mods and a `grant`, which is generic and needs no code.
- **Republishing** needs the live artifact read first; the tool refuses a blind publish,
  and the gate wants the saved copy actually read through with the Read tool.

---

## Phase 4 — the market (committed separately from the story pass)

Nonce's counter was a fixed exchange rate with a flat spread. It is now a small but
honest market, and the Sats tab is where the game teaches how one works.

- **A price that moves.** `G.mkt` tracks a ratio `r = price / fair value` rather than the
  price itself; the ratio mean-reverts toward `1 + sentiment·0.55` and takes a random walk
  on top. Fair value is `80 · cpi^1.05 · (1 + adopt/50)` — so the credit price of a sat
  rises because credits are being printed, and rises *again* as adoption climbs. Tracking
  the ratio instead of the level matters: a first-order filter chasing a rising level
  always trails it, which produced a permanent fake discount in the first cut.
- **Sentiment is the townspeople.** Lighting a node, winning a Unity campaign, finishing a
  proof-of-work shrine, killing the Golden Bull and liquidating a shitcoiner all push it
  up; selling a big stack, losing a campaign and posting collateral push it down. It decays
  toward an anchor set by the town's lean, so opinion fades and arithmetic wins eventually.
- **The four costs of a trade, all shown.** Spread (narrows with Bitcoiner rank and
  adoption, floor 0.2%), a 0.4% taker fee, and slippage against a visible order-book depth,
  so selling the lot never pays the number on the sign. Posting your own price instead pays
  a 0.2% maker rebate and no fee — the lesson being that impatience is the priced thing.
- **Limit orders** with escrow, four at a time, withdrawable.
- **Mr. Float lends against sats** at 50% LTV and liquidates at 72%, with the liquidation
  price shown *before* the trade rather than after.
- **Cost basis in two currencies** — what your stack cost in credits and what those credits
  would have bought in stims — because measuring a gain in a unit that is itself shrinking
  is the joke the whole economy is built on.
- **Chart** (`mktChart()` in `src/p4.js`): inline SVG, one emphasised price series against a
  recessive fair-value line, on a **ratio (log) axis** — without it the inflation ramp
  swamps every actual price move. Credits view and purchasing-power view.
- Four new feats (buy under fair value, fill your own order, hold through a 20% fall,
  get liquidated), three memos, and four Story-tab entries explaining spread, depth, the
  fee, and what the two lines mean.

**Palette note.** Run against the `dataviz` validator, this palette logs two deliberate
FAILs: the de-emphasis grey must read as grey rather than as a second series, and
`#f7931a` is the game's established colour for satoshis everywhere else, which outranks
the validator's lightness band. Both are choices, not oversights.

**Test gotcha fixed.** `tools/smoke.js` opened the sheet tabs without first clearing any
dialog left over from the zone walk. `openSheet` draws nothing behind a dialog, so a tab
would intermittently report zero characters and look broken. It now dismisses dialogs
first.

---

## Phase 5 — the server, and playing together

Two stages, both working. `server/README.md` covers accounts; `MULTIPLAYER.md` covers
parties, hostility, the rig and the capacity question.

### 5a — accounts (no dependencies at all)

Node standard library only: no `package.json`, no install, no build step, no native
modules. `node server/server.js` serves the current build and keeps the accounts.

The part worth knowing: **the game was not modified for any of this.** It already saves to
an account by asking the page for `window.claude.use('user')` and `('db')` and reading and
writing documents. `server/public/cloud-shim.js` implements exactly that interface against
this server and the server injects it ahead of the bundle — so one build runs as an
Artifact, from a file, and here, finding whatever account system is present or none.

scrypt passwords with their parameters stored beside each hash; opaque session cookies
hashed at rest; CSRF on every write; single-use half-hour reset links, also hashed; a
password change signing out every other device; identical answers for known and unknown
accounts on both login and recovery, with a scrypt hash run on a miss so the timing matches
too. Storage is JSON files written through a rename, so backup is `cp -r`.

**39 offline tests.**

### 5b — parties, hostility, the rig

Diablo II's rules. A party is an invitation both sides agree to, up to eight; experience is
split only among members in the district with the killer, weighted by level, with D2's own
party bonus; quest progress is shared with whoever is standing there; hostility is declared,
throws you out of the party, is announced, and does not come back; town is safe; a doorway
buys five seconds of grace; damage between players lands at a quarter. The Simulator takes a
party, for waves together or for duelling.

Two ideas carried the implementation:

- **A hostile player is an inert stand-in in `W.ents`.** It does not think, push or die
  there. But because it is in `W.ents`, every skill, projectile and area effect already
  written finds it, and there is no per-skill PvP code anywhere in the game. `dmgEnemy`
  spots the stand-in and routes the damage to the server.
- **The network clock is not the game loop.** `update()` stops while a dialog or a sheet is
  open, and somebody reading their inventory has not left the district, is not invisible to
  their party, and is not invulnerable. Position, stand-ins and incoming damage run on their
  own 100ms interval.

WebSockets are RFC 6455 in the standard library (`server/lib/ws.js`), so the server still
has no dependencies. The client half (`src/p13.js`) is inert unless the account server is
serving the page.

**16 live tests across two real browsers, 5 capacity tests.** One found a genuine bug: the
post-doorway invulnerability `P.inv` only ticks down inside `update()`, so a player sitting
in a menu kept it forever — a clean exploit. The server's grace is the authority for a fight
between players, so a hit it has allowed is no longer gated on the local i-frames too.

### The bug report button

In the heads-up display, and deliberately slow. Pressing it files nothing: it asks first,
with the game's own four-second hold, and then a form that refuses to send until all three
questions are answered — what you were doing, what happened, and what you expected instead.
Reports land in `server/data/bugs/` carrying district, level, class, quest state and any
errors the page recorded. With no server behind the page the report goes to the clipboard
instead. **15 tests**, including that an empty and a half-filled report are both refused.

### Not done, and why

- **No sharding into separate games.** This is one world with a hard ceiling of 40, and the
  ceiling refuses clearly rather than degrading. Diablo II's answer — many games of eight —
  is what actually makes this safe to post publicly, and it is the next stage.
- **Damage is not authoritative.** The server decides who may fight whom and scales the hit,
  but each client simulates its own monsters and asserts its own hits. A modified client
  could claim hits it did not land. Right trade for people who know each other; wrong trade
  for a public ladder. Fixing it means the server running `update()`, which is a rewrite of
  the game loop rather than a patch to it.
- **Proximity voice chat is not built.** It is very doable — WebRTC peer to peer, with the
  existing WebSocket as the signalling channel and the existing 100ms position beat driving
  a Web Audio `PannerNode` — and it costs the server nothing because the audio never touches
  it. The limits are that it needs HTTPS, that a full mesh caps out around six to eight
  people in earshot, and that a minority behind strict NATs need a TURN relay that does cost
  money.
- **SMTP against a real relay is untested.** The protocol code is exercised only through the
  outbox fallback; it has never spoken to an actual mail server.

### Games, a lobby, difficulty and voice (the last stage)

- **A game holds eight**, Diablo II's number. Anyone opens one from the lobby with a name, a
  difficulty and an optional password. Join, play, leave, land back in the lobby; the last
  player out closes it.
- **Difficulty** — Normal, Nightmare, Hell — is chosen at creation and fixed, and every
  extra person in the game adds half again to monster health and to what monsters are worth.
  Eight people face monsters 4.5× tougher than one does, and are paid for it. It multiplies
  into `partyH()`/`partyD()`, the multipliers the game already had for companion pressure,
  so no other combat maths changed.
- **Text goes to the whole game**, one channel on purpose, from a bar that collapses to a
  SAY button carrying a dot when something has been said.
- **Voice is whoever can see you** — a WebRTC mesh where loudness follows whether you are on
  their screen and the pan follows which side of it. Per-player muting silences their typing
  too. The server carries only the handshake, so talking costs it nothing, and that is why
  eight is the right number for a mesh. Needs https.
- **Scoping to a game also answered the capacity question**: the roster is eight entries and
  movement is indexed per district, so per-player cost no longer grows with how busy the
  server is.

Tests: **39** account, **26** lobby, **24** live across two real browsers, **15** report,
**5** capacity, **34/34** zones, acts walk clean.

### Still not done

- **No load test.** Several hundred people across several dozen games is a reasonable
  expectation, not a measured one.
- **No TURN server**, so a minority behind strict NATs will not connect to some voice peers.
- **SMTP against a real relay is untested** — only the outbox fallback is exercised.
- **Damage is still not authoritative**, by choice. See `MULTIPLAYER.md`.

### The Maximalist — a sixth wanderer, unlocked by finishing the story

Shaped as Diablo II's Paladin, because that is what a maximalist is: **auras**, a zealot's
flurry, and one conviction applied to everything.

- **Three auras**, which is the whole identity. One on at a time, no duration, on until you
  swap or switch it off. **Toxic Maximalism** (Fanaticism — you and anyone beside you swing
  faster and harder), **Conviction** (everything standing in it takes more damage from every
  source, its resistances having stopped applying), and **Proof of Work** (Holy Fire — a
  constant pulse, because entropy runs one way).
- **Tick Tock Next Block** is Zeal: nine quick swings and a tenth that is a block.
  **Have Fun Staying Poor** is Smite — close range, cannot miss, stuns.
  **Orange Pill** is Charge. **Blessed Hashrate** is Blessed Hammer and does exactly what
  Blessed Hammer does, which is win.
- **Sound damage.** A sixth type that nothing resists, is immune to, or shields against —
  `typed()` settles it and returns before the resistance table is consulted, so one can
  never be added by accident later, and `dmgEnemy` skips shields and wards for it.
- Doctrines: Toxic Maximalism, Running My Own Node, Thinkboi.

The unlock is on the **account**, not the character, so deleting the wanderer who earned him
does not take him away. 22 tests in `server/test/maxi.js`.

Three real bugs came out of building him, all found by looking rather than assuming:

- `maxiOn` was a `const` arrow in p12 while the title screen called it at load from p4.
  Function declarations hoist across the bundle's single scope; a const sits in its dead
  zone and throws. The whole game failed to boot.
- The class list was built at load, but `ACC` is read from storage inside `start()`
  afterwards — so an earned unlock never appeared. It is now a function called again
  whenever the account store arrives, from storage and from the server.
- `DOCS` is keyed by class, and without an entry `docOf()` returns undefined and every
  build summary throws.
