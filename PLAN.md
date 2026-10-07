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

---

# PHASE 4 — A market that teaches (added after the first pass shipped)

**The ask:** a live Bitcoin price chart whose rate responds to inflation, adoption and
sentiment from how you treat the townspeople; buy and sell sats with a small spread and a
market-maker fee; teach how markets work, funny and factual; plus other small value adds
to the economy and the story.

## What is there now

`satRate() = 80 · cpi^1.05`. One deterministic line. No chart, no volatility, no demand
side, no sentiment, a flat 10% spread applied only on the buy, and no fees. Selling a
thousand sats gets the same price as selling one, which is the single most misleading
thing a game can teach about markets.

## The model (`src/p8.js` — "money conversations" is exactly where this belongs)

**Fair value** `80 · cpi^1.05 · (1 + adoption/50)`. Two forces, both already in the game:
the numerator debases (credits), the denominator doesn't (21M). Adoption is demand.

**Price** mean-reverts to `fair · (1 + sentiment·0.55)` on a ~42s clock, with a random
walk on top. **Volatility falls as adoption rises** — a deeper market is a calmer one,
which is true and is also a reward the player can feel.

**Sentiment** is news. It decays toward whatever the town thinks of you (`G.lean`), and
it jumps on things you do: lighting a node, proving work, winning somebody over,
liquidating a shitcoiner, an executive falling (+); selling in size, buying a shitcoin,
borrowing from Float, a Unity campaign opening (−). A short **news ticker** under the
chart names the last few, so the player can see a price move and read why.

**Depth, spread, slippage, fees** — the four things a market actually charges you:
- **Spread.** Nonce quotes a bid and an ask around the mid. It is his pay for being
  willing to trade when nobody else will. Tightens with your standing and with adoption.
- **Taker fee** (0.4%) for taking his quote right now.
- **Maker rebate** (+0.2%) for posting a price and waiting — you did his job for him.
  Implemented as real **limit orders** with escrow, filled on the market tick. The
  trade-off is certainty vs price, which is the actual lesson.
- **Slippage.** Order size against book depth. Selling everything at once walks the book
  down and you eat the difference. Nonce will tell you he warned you.

**Cost basis in two currencies.** Track credits paid *and* the stims those credits would
have bought. Then show both: up 4,000% in credits, up 11% in stims. That contrast is the
best lesson available in this game and it is already the thesis of the book.

## The chart (`src/p4.js`, inline SVG in the Sats sheet)

Form: **emphasis** — one series (price, Bitcoin orange `#f7931a`, 2px) plus one recessive
reference line (fair value, `#6a6458` hairline), both direct-labelled. Hairline solid
grid, endpoint dot, selective min/max labels, no number on every point. A toggle between
**in credits** (climbs forever; the joke) and **in stims** (purchasing power; the truth) —
two views, one axis each, never a dual axis.

Palette validated with the skill's checker against the game's `#17131c` surface: CVD ΔE
22.9, normal ΔE 28.8, contrast passes. Two checks fail by design and are kept
deliberately: the de-emphasis gray is *meant* to read gray, and `#f7931a` sits above the
dark-mode categorical band but is the game's established entity colour for everything
bitcoin — "colour follows the entity" outranks the band, and with one series there is no
adjacent pair to confuse.

## Other value adds

- **Mr. Float lends against your sats.** Borrow credits at 50% loan-to-value; if the
  price falls far enough he takes the collateral. Leverage, margin call and liquidation,
  and it is the novel's argument about debt cancelling consequence — except here it
  doesn't. He is delighted either way.
- **The Golden Bull's death spikes sentiment**, and the Bull Run's "number go up" crowd
  finally has a number to go up.
- **Feats** for the market: buying below fair value, filling a limit order, holding
  through a drawdown, and getting liquidated.
- **Teaching copy** in Nonce's own voice, new memos, and a "How a market works" block in
  the Story tab's money section — mechanism dramatised, never lectured, per the rules.

## Rules carried over

Same six from `canon/notes/the-money-thread.md`. Dramatise, never explain. Nobody
delivers a seminar. The opposition keeps its unrefuted argument: Float is right that a
market maker is doing you a service, and nobody in this town answers him.

---

# PHASE 5 — Accounts, and a path to playing together

**The ask:** a small backend in this repo so people can sign in with a username and
password, back up by email, change and recover a password, and so a small group can play
online together. Sketch the multiplayer path. **No Bitcoin integration** — the sats stay
a game currency, nothing touches a real chain or a real wallet.

## Why the game is already shaped for this

`src/p2.js` already has a complete cloud-save layer (`cloudSave`, `cloudLoad`,
`cloudInit`, `CL`, `CLD`) written against `window.claude.use('db')` and `use('user')`:
one document per hero slot, one per visited district, one shared lockbox. It degrades to
localStorage when that is absent. So the server does not need a new save format — it
needs to **be** that interface. That is the whole trick, and it keeps the Artifact build
working unchanged.

## Stage 5a — the account server (build it)

`server/` in this repo. Node, no build step, few dependencies.

- **Store:** SQLite (`better-sqlite3`), one file, no migrations service.
- **Passwords:** scrypt from node's own `crypto` (no native build), per-user salt,
  timing-safe compare. Never logged, never returned.
- **Sessions:** opaque random token, httpOnly cookie, rolling expiry, revocable.
- **Email:** pluggable transport. SMTP via `nodemailer` when configured; a console
  transport otherwise so the whole flow is testable with no provider. Used for: verify
  address, password reset, and **save backup** (a save code mailed to you on request).
- **Recovery:** single-use, time-limited, hashed-at-rest reset tokens.
- **Save API:** `GET/PUT /api/save/:slot`, `GET/PUT /api/zone/:slot/:zone`,
  `GET/PUT /api/lockbox` — shaped to match what `cloudSave`/`cloudLoad` already send.
- **Rate limits** on login, reset and signup. CSRF on cookie-auth mutations.
- **Tests** that run without a network or a mail server.

Then a small shim in the game: when the page is served by this server (not the
Artifact), `cloudInit` finds a `window.__sv` adapter with the same `doc().get/set`
shape and uses it. One new file, no change to the save logic.

## Stage 5b — playing together (sketch, then foundation)

Realtime action sync for a Diablo-like is a big piece of work and most of it is not
worth building for "a small few". The honest ladder, cheapest first:

1. **Shared world state, not shared frames.** Presence (who is online), the town square
   showing other players' heroes, a shared chat, and the lockbox already being
   account-wide. No combat sync. Cheap, and it is most of what "playing together" feels
   like in town.
2. **Asynchronous co-op.** Bounties and quests that several accounts contribute to; the
   adoption number and Unity's campaigns as a *shared world state* on the server, so a
   small group pushes the same meter. This fits the game's existing design better than
   anything else on this list and needs no realtime loop.
3. **Party play in districts** — one host authoritative, WebSocket, 15–20 Hz state
   snapshots of entities and players, client-side prediction for your own hero only.
   This is the expensive one; it needs the game loop refactored so `update()` can run
   headless and be fed inputs. Worth sketching, not worth building blind.

Stage 5b builds (1) and the server side of (2), and documents (3) with the specific
refactor it would need.

## Not in scope, explicitly

No Bitcoin integration of any kind: no wallet, no Lightning, no on-chain anything. The
in-game satoshi stays a game token. Anything that would make it otherwise is out.
