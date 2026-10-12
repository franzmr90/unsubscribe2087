# Back-half bosses: one per stage

A design, not a change. Nothing in `src/` has been touched. Written 2026-10-12
against `main` at `a143827`.

The back half is ten fighting stages: Act IV zones 22-26 and Act V zones 28-32.
Each of the eight non-final stages already has a named superunique guarding its
quest, and each act ends on a boss. This doc gives all ten a fight of their own:
a pattern, a look and effects, built from one shared kit so the page grows by a
few kilobytes rather than a few hundred.

---

## What is actually there today

Checked in the code and in a screenshot of each fight
(`spawn` next to the player, Playwright, 900x600):

- **The Curator and PROVIDENCE already have their own bodies.** `drawEnemy` in
  `src/p3.js:762` draws the Curator as the apologetic executive frame with the
  green attending lights, and `src/p3.js:783` draws PROVIDENCE as the slab with
  forty-one fans that go out as its life drops. Sprite atlases are opt-in
  (`SPRITES=1 ./build.sh`), so these drawn bodies are what ships.
  `notes/PICK-UP-HERE.md` item 1 says they borrow MANDATE's body; that part is
  out of date. What they borrow is MANDATE's **drop table** (`TC`,
  `src/p11.js:25-26`), which is fine.
- **The Curator has its own script, built from the same three verbs as everyone
  else.** `BAI.boss4` (`src/p11.js:220`) is a ring of shots, a call for
  minions and a `warn` circle under the player, plus the "are you proud of me?"
  question at half life. Pryce, Vale and MANDATE are also ring + summon + warn.
- **PROVIDENCE is MANDATE with two dialogs.** `BAI.boss5` calls `boss3AI`
  outright, so the last fight of the game is the Act III fight with orange
  accents and two offers on top. It even summons Act III Proxies, Censors and
  Lancers. The redesign below calls Act V creatures instead.
- **The eight superuniques have no script at all.** They are a regular monster
  at 1.4x size with two of the six champion mods (`MODS`, `src/p1.js:201`).
  Two of them, TARO-9 and Reorg, are the Act I `mech` body, the same one
  Defrag uses. Front-half superuniques are built the same way, so this is
  parity with Act I, not a regression; it is just not what the back half needs.
- **The prequel's fight is dead code.** `daemon`, `wdog`, `fwall`, `cam` and
  `gap` (The Air Gap, with its own `BAI.gap`) are defined in `src/p11.js:6-10`
  and never spawned: the prequel says "Nothing in this week fights back".
  That is about 1.2 KB the kit can take back, if the prequel is meant to stay
  without a fight. The LAN server keeps its own rows for these kinds
  (`server/lib/mobs.js:15,20`), so a deletion goes there too.

This lines up with the project's gap map
(`/mnt/project-files/reports/back-half-gap-map.md`), with one difference: the
map counts the Air Gap as the prequel's fight, and as far as I can find it is
never spawned. The map's top gap, back-half creatures losing the behaviour of
the body they borrow, is a creature fix and is not part of this doc.

---

## The rule for every fight

Each fight teaches one idea from its stage, has one tell you can read without
the text on, and escalates once at half life. Acts IV and V each have a thread:

- **Act IV, the Gentle Years: comfort is the threat.** The act card already
  says it: "They will not chase you if you sit down. Do not sit down." Every
  Act IV boss rewards moving, refusing and standing up, and punishes settling.
- **Act V, the chain: rules that cannot be bribed.** Every Act V boss is a
  protocol you beat by understanding its rule (forks, fees, reserves,
  confirmations, prediction), not by out-trading it.

Effects come only from what the renderer already bakes: `ring`, `warn` (with
`boom` for delayed damage), `patch` (including `stay` and `tel`), `beam`,
`bolt`, `trail`, `orbit`, `mark` (with a text label `n`), `shard`, `strike`,
foe projectiles with `slow`/`drain`/`sil`, `parts`, `glow`, `light`. Each is
already a cached sprite sheet (`fxBlit`), so a new fight adds no art bytes.

---

## Act IV

### 22 · The Agreeable Mile — The Update, Eleven Pages
*Lullaby body (`hr`). Quest q16: "make sure nobody reads past the fourth paragraph."*

- **Pattern: Terms of service.** Four paragraph pages `orbit` it. While any is
  attached it is shielded (damage x0.25) and the counter above it reads
  `p.1/11`. Every fourth hit tears a page off; it flutters to the floor as a
  pale `patch` you can walk over to "read" (1 s). Read four and the shield
  breaks for 6 s: "You read past the fourth paragraph."
- **Its attack** is a slow fan of eleven paper projectiles (`#f0ead8`,
  `drain`) that land as short-lived fine-print `patch`es which slow.
- **At half life** it offers the green button: a large soft `patch` under you
  marked I AGREE. Standing in it heals you a little and stacks slow. Stepping
  out is the whole decision.
- **Look:** the Lullaby body plus a sheaf of paper hanging behind it like a
  train, and two buttons on the chest, REVIEW grey and I AGREE lit; REVIEW
  lights instead while the shield is down.

### 23 · The Sofa — The Seventh Year
*Well-Wisher body (`ad`). Quest q17: "keeps them on the sofa."*

- **Pattern: another year.** It barely moves. It lays wide cushion `patch`es
  (warm, `#ffd9a0`) that slow you and feel good: they heal you slowly. While you
  stand on a cushion it heals several times faster than you do (its `leech`).
  A year counter above it ticks `YEAR 1` to `YEAR 7`; each year the cushions
  grow. At year seven, if you are on a cushion, it closes the year: a soft
  `ring` that does no damage and resets the counter, with its life topped up.
- **The tell** is the billboard. The `ad` body already prints a word on its
  screen (BUY/NOW, or NO for the Censor). This one prints NEXT EPISODE and the
  year, so you can read the clock off the boss.
- **At half life** the cushions start following you slowly. You win by
  fighting it from the bare floor.

### 24 · Tomari — TARO-9
*Act I `mech` body today. Quest q18: "It cannot be out-fought for long; put it
back on its dock."*

- **Pattern: put it back.** A dock (`stay` `patch`, labelled DOCK) sits in the
  arena, with a cable drawn from TARO-9 to it. Off the dock it takes 25%
  damage. It charges in straight lines, telegraphed by a lane of `warn`
  circles along the path. Bait a charge that ends on the dock and it locks in
  to save: stunned 5 s, full damage, I AM SAVING ticking up above it.
- **At half life** it charges twice in a row, the second along the reflected
  lane.
- **Look:** the mech body with a yellow-and-black DO NOT UNPLUG band across
  the chest and the cat asleep on its shoulders (the notice at Tomari says
  please do not move the cat). The cat stays put through every charge. Steam
  `parts` at the vents while it saves.

### 25 · The List — Out Where
*Companion body (`bot`). Quest q19: "only ever says two words."*

- **Pattern: door to door.** Three doors stand around the arena, marked with
  `mark` labels `4,209`, `4,210`, `4,211`. It waits on the porch of the first,
  untouchable, while a happy resident (a Lullaby or Well-Wisher minion) is out
  front. Clear the resident and that door shuts with a `ring`; it walks to the
  next. At door 4,211 it comes for you, fast.
- **Throughout:** if you stand still for 1.5 s it says "Out where?" and a
  `warn` lands under you. This is the act's rule made literal: do not sit down.
- **Its only barks are two words.** "Out where?" and nothing else.
- **Look:** the Companion body with a door frame drawn behind it while it is
  on a porch, and a speech bubble that only ever holds those two words.

### 26 · The Kitchen Table — The Curator (act boss)
*Own body and own script already. This keeps both and gives the script her own
verbs.*

- **Phase 1, kindness.** She does not try to hurt you. "True things" are a
  slow outward spiral of feed cards that do little damage but drain energy and
  slow. Then she **curates**: a soft green `patch` appears near you, and a beat
  later `warn` booms land everywhere around it except there. The only safe
  place is the one she chose for you. This is the fight's idea, and no other
  boss in the game has an inverse telegraph.
- **Half life:** the "are you proud of me?" question stays as it is.
- **A quarter of her life left: she stops choosing.** No more safe patch.
  Friction comes back all at once: the curated booms become an even random
  scatter, and MANDATE's white proposals, the slow bolts from the Act III
  fight, start arriving from the edges of the room. This is the ending
  (`ENDING4`) happening during the fight instead of after it.
- **Look:** keep the body. Swap the six green dots for six small feed cards,
  and give the head a webcam light that goes green and out on the killing blow,
  which is the line the ending already has.

---

## Act V

### 28 · Block 137,209 — The Orphan Maker
*Validator body (`bot`). Taunt: "Two blocks were found at once. One of them was
you."*

- **Pattern: the fork.** At full life and again at half it splits into two,
  each with the life it had. Each copy is tied by a chain of block squares
  (`trail`) to a tip tile on the floor (`stay` `patch` with a hash `mark`).
  Step on a tip and that branch is orphaned: the copy tethered to it bursts
  (`boom`) and is gone. Hitting the copies is allowed but slow; reading the
  tethers is fast.
- **Its attack:** an arc-mod burst whenever a copy is orphaned, so standing on
  the tip of the branch nearest you is the risk.
- **Look:** the Validator body with orange chain links trailing from the
  shoulders to its tip. The copy is drawn at 70% alpha.

### 29 · The Mempool — First Seen
*Fee Sniper body (`hound`). Quest q22: "It has never once been second."*

- **Pattern: front-running.** When you cast or swing at range, it lunges to
  the point you aimed at before your shot lands there. You beat it by aiming
  where it is going to be: at your own feet, or behind you.
- **The weather.** Payments drift across the arena in slow lanes, big and slow
  ones first, then small fast ones ("the richest ones first"). Each touches
  for damage. Every payment it catches makes it faster for a few seconds;
  every payment you break starves it.
- **At half life** the lanes come from two directions.
- **Look:** the hound with a `#1` tag on its collar and a fee label that
  rises with its speed.

### 30 · The Paper Vaults — The Eleventh Custodian
*Custodian body (`mech`). Quest q23: "The Eleventh keeps the ledger of the other
ten."*

- **Pattern: a bank run.** It is shielded by paper. A counter above it reads
  `RESERVES 10/10`. Every hit on the shield prints an IOU: a slow paper shot
  sent back at you ("Here is a paper that says so"). Stand inside its vault
  ring (a `patch` close around it) for 2 s and you have asked for your coin:
  the reserves count drops by one. At zero the shield breaks and it is stunned
  6 s. Close range is the answer; ranged classes walk in.
- **At half life** it calls two Paper Claims, which fly to the vault ring and
  sit in it.
- **Look:** the Custodian body carrying a ledger, with PAID stamps (`float`
  text) on every IOU it prints.

### 31 · Ninety-Three Blocks — Reorg
*Act I `mech` body today. Taunt: "History is whatever I decide was the
longest."*

- **Pattern: confirmations.** It keeps three seconds of history. The last
  three seconds of damage you dealt sit as a grey, unconfirmed slice of its
  life bar. Every nine seconds a `mark` counts `REORG 3, 2, 1` and it snaps
  back to where it stood three seconds ago, with the unconfirmed damage undone.
  A faint afterimage shows where it is going to land. The skill is to burst
  just after a reorg and use the last three seconds to dodge.
- **At half life: deep reorg.** You are rewritten too: you snap back to where
  you stood three seconds ago, drawn as your own afterimage first.
- **Look:** the mech body with a page on a lectern in front of it, and the
  afterimage at 30% alpha.

### 32 · The Room — PROVIDENCE (act boss)
*Own body already. Script today is MANDATE's. This replaces it.*

- **Pattern: it predicts you.** Every attack aims at where you will be in one
  second, not where you are: running in a straight line is the mistake. A
  faint marker of your predicted self (`mark`) is the tell, and the fan line
  pointing at it brightens.
- **Forty-one ways.** Its main attack is a burst of fan lines along predicted
  paths (`warn` lanes, then `beam`). Each one it uses goes out on its body;
  the fans already dim as its life falls.
- **The seventh part.** If you give it the nineteen minutes at the existing
  one-third dialog, its predictions turn noisy for the rest of the fight: it
  doubts. That puts the book's answer into the mechanics.
- **Last third: it plays to win.** The floor near you is marked in tiles and
  every tile but one gets a `warn` boom. The one safe tile is random. It
  cannot win at that, and neither can you, which is the point.
- **Look:** keep the slab and the fans. Add the predicted-you marker and the
  brightening line.

---

## The kit, and the bytes

One table of moves and one table of fights, so a fight is a row, not a
function. Sizes below are estimates from the existing code, measured with a
script against `main`: today `BAI` is 2.9 KB, `boss3AI` 0.95 KB, `boss2AI`
1.4 KB, Pryce's script 1.1 KB, the Curator's body 1.7 KB, PROVIDENCE's 1.1 KB.

| Move | Used by | Est. |
|---|---|---|
| `lane(from,to,n,delay,dmg)`: a row of `warn` circles | TARO-9, PROVIDENCE, First Seen | 0.2 KB |
| `fan(a0,n,spread,spd,col,o)`: projectile fan | Update, Pryce and Vale (shared) | 0.2 KB |
| `pad(x,y,r,col,life,fx)`: a `patch` that does something to whoever stands in it | Update, Sofa, TARO-9 dock, Orphan tips, Custodian, Curator | 0.4 KB incl. one update hook |
| `count(e,label)`: a `mark` over the boss | Update, Sofa, Custodian, Reorg, TARO-9 | 0.1 KB |
| `ghost(e,x,y,a)`: draw a body at alpha | Orphan twin, Reorg, PROVIDENCE | 0.15 KB |
| history ring buffer (3 s) | Reorg | 0.2 KB |
| still timer, predicted position | Out Where, PROVIDENCE | 0.1 KB |
| **Kit total** | | **~1.4 KB** |

| Cost | Est. |
|---|---|
| Ten fight rows, about 0.3-0.5 KB each | +4 KB |
| Eight body overlays drawn on the existing body | +3 KB |
| Curator and PROVIDENCE body touches | +0.5 KB |
| Kit | +1.4 KB |
| **Gross** | **~+9 KB** |
| Delete the never-spawned prequel fight (`daemon`-`gap`, its TC, RES and `BAI.gap`) | -1.2 KB |
| Rewrite Pryce, Vale and MANDATE as rows on the same kit, same behaviour | -2 KB |
| Move the overlay words (YEAR, DOCK, 4,211) into the existing `ad`/`mark` text paths | -0.5 KB |
| **Net** | **~+5 KB on 1,120 KB, about 0.45%** |

Hooks into existing code are two lines: `bossAI` also runs for a superunique
whose quest has a row (`e.su&&SUF[e.su.q]`), and `drawEnemy` calls an overlay
after the base body. Rows are keyed by **quest id** (q16-q24), not by name,
because names are player text that `tools/text/import.js` can change.

Everything is canvas code. No sprite, no image, no new `fx` kind.

---

## Things that will bite

- **Multiplayer owns monster life on the server.** `src/p13.js:606` says the
  host moves machines and the server owns their hit points. Anything that
  writes `e.hp` (the Sofa's top-up, Reorg's undo, the Orphan Maker's split,
  and the Curator's existing ±15% for "proud") will disagree with the server
  in a party. Two choices: add one server message for a heal, or express
  those beats as damage windows (immune, then x2) that never write life. The
  second is safer and is what this doc recommends for a first build. The
  Curator's existing ±15% is probably already wrong in a party; I have not
  tested it.
- **Guests do not run boss AI.** The same comment says a guest draws the
  host's positions and nothing else, so in a party only the host sees boss
  attacks. That is true for every boss today, inferred from the code, not
  tested.
- **No new monster kinds.** The LAN server keeps its own copy of every kind
  (`BASE` and `BOSSES` in `server/lib/mobs.js`) and nothing tests that the two
  agree. Every design here reuses existing kinds: the Orphan Maker's copy is
  another `valid`, the List's residents are `lull` and `wisher`, the Custodian
  calls `claim`. If a build does add a kind, it needs a row there and a name of
  16 characters or fewer.
- **Boss rush** (`rushList`, `src/p6.js:125`) spawns these superuniques in its
  own arena, so nothing in a row may assume zone objects. Pads, doors, the dock
  and the tips are all placed relative to the boss when the fight starts.
- **Dialogs lock input for 0.8-4 s** mid-fight. The Curator and PROVIDENCE
  already do this; no new fight adds one.
- **Balance is unmeasured for Acts III-V** (`CLAUDE.md`, Known gaps). These
  numbers are first guesses and want the balance bot that does not exist yet.

---

## Order of work, if this is approved

1. The kit plus PROVIDENCE (it is the worst borrowing and the last thing a
   player sees), then the Curator's curate and stop-choosing phases.
2. Pryce, Vale and MANDATE ported onto the kit with no change in behaviour,
   proved by a test that fails if their patterns change. This is where the
   bytes come back.
3. TARO-9 and Reorg first among the superuniques, because they are the two
   wearing an Act I body.
4. The other six.
5. Delete the prequel fight.

Each step: `./build.sh`, `tools/smoke.js`, `tools/smoke-acts.js`, a new check
that spawns the fight and asserts its tell appears, and the byte count in the
commit message.

## Open questions for Micah

- ~~Is "keep the page size flat" a hard zero?~~ Answered 2026-10-12: small
  gains are fine, keep it minimal. The ~+5 KB net plan above stands.
- Should Act I-III superuniques get the same treatment later, or should
  scripted superuniques be the thing that marks the back half as harder?
