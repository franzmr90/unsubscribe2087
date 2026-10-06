# Skill graphics and the copy audit

A design document. It does not add a draw call, a particle, or a rewritten line.
Milestone 0 of `notes/PLAN-eight-classes.md` has landed on this branch: six classes,
fifteen skills each, no shared boon behaviours. This plan starts from that tree.

The owner asked for two things, kept as one sequence because they fail the same way.
A skill you cannot tell apart from the last one is the same problem as a line that
could have been said by anyone.

## Design bar

- An ode to Diablo II around patch 1.08: you can name the skill from the shape, the
  color, and the sound, at the size of a phone, while something is trying to kill you.
  Post-clear and replay stay. Damage numbers, the minimap, magic find, the Simulator,
  boss rush, and `shapeShift` are not on the block.
- PvP has to be readable before it is pretty. A charge, a ground patch, and a pulse
  need a silhouette you can step out of. Party play has to feel different from solo:
  an aura on you should be visible on the people standing next to you, and the
  numeric half of that is its own milestone so it cannot sneak in with the paint.
- The server stays cheap. It is not authoritative over monsters or damage. It already
  fans a position packet out to the district ten times a second. Skill paint is
  computed on the client that is looking at it. The wire carries an id, never a
  spark.

## How Diablo II made a skill readable

Sourced where a page was actually read. Column-level claims about `Missiles.txt` come
from the Diablo II: Resurrected data guide and from Phrozen Keep modding notes, which
describe the classic missile/overlay split as it survived into later patches. Treat
the exact 1.08 column names as **UNVERIFIED**. The architecture is the part to copy.

- A skill is a **missile** plus a **hit**, not a cloud. The server function decides
  whether it hit. The client function draws the flight and the impact
  (`pSrvDoFunc` / `pCltDoFunc`, `pSrvHitFunc` / `pCltHitFunc` on the Resurrected
  missiles table, [d2r-tools.com/data/missiles](https://d2r-tools.com/data/missiles)).
  `CltSubMissile` and `CltHitSubMissile` are documented there as visual-only. That
  split is the whole multiplayer lesson: everyone can agree a Frozen Orb was cast
  without anyone transmitting the ice.
- **Color is not the graphic.** Phrozen Keep's note on missile RGB columns is that
  they tint the light radius, and the cel is what you actually recognize
  ([skill colors](https://d2mods.info/forum/viewtopic.php?t=7884)). Lightning,
  fire, cold, poison, and magic each have a palette, and then a shape on top of it:
  a bolt, a ball, a wall, a hammer, a hydra. Two skills of one element still read
  as two skills.
- **Auras are overlays, not recasts.** Paladin auras in 1.08 are one at a time, on
  while readied, and they cover party members and hirelings in range. Different
  paladins' auras stack. The resist aura's hidden max-resist bonus is halved for
  the paladin himself (see `notes/diablo2-1.08-research.md`). The overlay list
  (Holy Fire, Holy Shock, Sanctuary, Shout) is a looping graphic on the body, plus
  a separate hit graphic when the aura deals damage
  ([GFX masterlist](https://d2mods.info/forum/viewtopic.php?t=42404)). You can see
  whose aura is up from across a room.
- **The monster tells you it was hit.** Classic play flashes the target, plays a
  hit class, and leaves a state (chilled, poisoned, stunned). Floating damage
  numbers are not a 1.08 feature. This game already has them, and on a phone they
  earn their place. Keep them. Do not let them become the only difference between
  two skills.
- **What 1.08 will not give you.** Later ARPGs filled the screen and then had to
  invent culling. Path of Exile's dynamic particle culling (Chris Wilson, 18 June
  2020, [forum thread 2874529](https://www.pathofexile.com/forum/view-thread/2874529))
  exists because unique effects, stacked, made the game both slower and harder to
  read. Players still ask for a transparency slider and a way to mute other
  players' effects ([thread 3765157](https://www.pathofexile.com/forum/view-thread/3765157)).
  The 1.08 lesson and the modern lesson agree: a few strong shapes, a hard cap,
  and other people's spells quieter than your own.

Do not import the cels. A spinning hammer, a pink frozen orb, a hydra, and a
valkyrie are someone's art. The shapes below are built out of the rectangles this
game already draws: a sign, a parcel, a staple, a packet, an orange ring.

## Current state

### What combat actually draws

`src/p3.js` is Canvas 2D, isometric, one frame. Effects are records on `W.fx`
with a kind, a life, and usually a color. The kinds are:

| Kind | Drawn as | Used for |
|---|---|---|
| `ring` | Expanding ellipse, plus a light | Almost every cast, every nova, level-up, death |
| `arc` | Three orange strokes of a swing | Melee, including skills that are not a swing |
| `bolt` | A jagged line between two points | Chains, zaps, heals, marks |
| `strike` | A line from off the top of the screen | Storms |
| `beam` | A vertical bar | Rare-drop glints |
| `warn` | A filled red ellipse that does not expand | A monster about to explode |

Projectiles (`W.projs`) are one chevron, or a rectangle if the kind is `hacker`.
Particles (`W.parts`) are squares. Floating text (`W.texts`) is one font, one
second, and it already carries "Dodge", "The dip", "BLOCK", and the damage
number.

There is no per-skill sprite, no per-skill button art, and no table that says
which skill looks like what. `cast` in `src/p2.js` always pushes the same small
ring in the class color before `SKF` runs. `SKF` then pushes another ring, bolt,
or arc, usually in that same class color. After a few casts, a fight is one
color and three shapes.

The skill buttons are abbreviations (`setSkillButtons` in `src/p4.js`). Three
buttons, text only. That is the right count. The graphic has to live on the
button as well as in the world, or the player still has to read "TICK TOCK"
while moving.

A few allies already have their own draw: turret, mine, pail, fault line, packet
storm, dead drop, parcel, intern, officer, golem, clone. Those are the best
graphics in the game, because they stay on the ground and you can walk around
them. New work should look like that, not like a second ring.

### A leftover from the boons

`drawPlayer` still strokes a purple ellipse of radius 3.2 whenever `sl(11)` is
set and you are out of town (`src/p3.js`). Index 11 used to be the shared aura
boon. It is now Schema, Second Drop, No Attribution, Vesting, Cite Your Sources,
or Hold the Line, depending on the class. The circle lies. The first
implementation milestone removes it and puts persistent paint on the skills that
are actually persistent.

### What you can already tell apart

- **Damage type** has a color in `DTY` (`src/p10.js`): Impact, Surge, Rust, Heat,
  Noise, Sound. `typed()` sets `e.lt`. The float uses a per-call color, not
  `e.lt`, so a rust hit and a sound hit can share a white number.
- **State on you** is three ellipses: red if `P.buff`, gold if `P.guard`, green
  if `P.haste`. The Maximalist's aura, the Dip, Rehearsal charges, and Vesting
  stacks do not get their own mark. The aura's only persistent tell is the haste
  ellipse, and only for Toxic Maximalism, because that one sets `P.haste`.
- **Monsters** flash white, show a bar, and sometimes a slow or a stun. That is
  enough for "I hit it." It is not enough for "which of my three buttons did
  that."
- **Class bodies** in `drawPlayer` are already distinct (hard hat, visor, mask,
  suit, cap). Other players are not. `mpDraw` is one stick figure tinted with
  the class color, plus a name, a level, and a friend-or-hostile ring.

### What the network already carries

`mpBeat` runs every 100ms (`src/p13.js`) and sends `x`, `y`, `zi`, `dir`, `hp`,
`hpm`, `inst`. Class and level go out on `hello` and come back on the zone
roster. There is no cast message. Another player's client cannot know which
skill was pressed. PvP damage is one packet, `{uid, dmg, kind}`, after the hit.
The server checks that the two of you may fight and scales the number. Nothing
in that path is a particle.

Party members are not entities. Hostile players are, as stand-ins in `W.ents`,
so a local skill that loops `W.ents` can already hit them. `maxiAura` buffs
`P` and `W.merc` only. A party member standing in Marked to Market does not
take the mark, and does not get the haste from Toxic Maximalism. The hireling
gets the haste. The tag-along companion is a local actor: `tagDo` swaps `P` for
the companion, so `SKF` graphics already appear at the companion's feet. That
trick does not exist for a remote player.

`partyH()` and `partyD()` are global multipliers (life pool and damage taken),
not auras. They are the wrong layer for "the paladin is standing next to me."

### Where the words are

User-facing copy is inline in the scripts, not in a string table.

| Surface | Where | How often the player sees it |
|---|---|---|
| Skill name, abbreviation, tooltip | `CLS` in `src/p1.js` (and the Act IV–V classes if extended later) | Every point spent, every hover |
| Buttons | `sk.ab` | Constantly |
| Toasts | `toast()` call sites across p2, p4, p5–p13. On the order of 170 call sites, many of them built strings | During play, three lines, 3.8s |
| Dialogs | `dlg()` across the same files. On the order of 90 call sites | Locks the screen |
| Gossip | `GOSSIP`, `CHATTER` in `src/p1.js` | Every time you talk, a random line |
| Quests | `QUESTS` in `src/p1.js`, turn-ins in `QRW` (`src/p12.js`) and `talkTo` (`src/p4.js`) | Once each, then the tracker |
| Side quests, locals, money | `src/p5.js`, `src/p8.js`, `src/p10.js` `LOCALS` | Repeatable |
| Cinematics | `playScene` slides in `src/p4.js` and `src/p11.js` | Once |
| Sheets, doctrines, builds | `src/p4.js`, `DOCS` and `BUILDS` in `src/p10.js` | When the player opens them |
| Items, affixes, uniques | `src/p1.js`, `src/p10.js` | Constantly, on the ground |
| Multiplayer | `src/p13.js` | The party invite explains the experience formula in the invitation |
| Web, feats, events | `src/p6.js`, `src/p7.js` | When that system is on screen |

Comments are not in the audit. Item affix *names* are in it. Generated item
numbers are not.

### What the copy is doing well, and where it goes slack

The voice, when it is good, is specific. Brenda has a shop and a visor she took
off. Wren has a sign from a repealed law. Tam has tomatoes and a stipend. The
street `CHATTER` is one concrete complaint per line. Boss barks are memos.
Skill names like Stop Sign, Lunch Pail, Term Sheet, and Have Fun Staying Poor
are the game.

The slack is a second voice that showed up on top of that one. It explains the
theme, then explains the mechanic, then explains the theme again. It is the
same length in Gramps, Sister Null, Marrow, and Nonce. A few samples, as
evidence for the rubric, not as a rewrite list:

- Tooltips that do their job, then add a thesis. Seniority ends with "A rust
  sign and a heat sign are different jobs," which is the mechanic. Org Debt
  ends by telling you that you are playing the class wrong. The Halving states
  the floor, which the player needs, and Marked to Market adds "Few understand
  why this works. It works." One of those sentences is a number. The other is
  a poster.
- Gossip that shares a thesis. Gramps, Null, and Nonce all deliver "people
  learn from cost / the machines made it free" in the same cadence. The
  setting can have that idea. It cannot have it every time you press Talk.
- Act-entry dialogs are patch notes. "Your level limit rises from 25 to 50,
  and a fourth row of skills opens in every tree" is information the player
  needs once. It is not a scene. The quest-complete dialogs in `actDone` are
  the same kind of line, and they are fine as a toast-length fact.
- The party invite explains the split. That belongs on the party sheet, in
  one sentence, not in someone's mouth.

None of this is a call to make the writing plainer than D2's. Deckard Cain
gets to explain. Akara gets to worry. The failure mode is every speaker being
Cain, and every Cain line being the moral.

## Proposed combat graphics

Stay inside the current pipeline. A skill does not get a PNG. It gets a row in
a table the renderer already knows how to draw.

### A small shape library

Add kinds only when an existing kind cannot say the thing. The budget is about
ten kinds, not ninety.

Keep `arc`, `bolt`, `ring`, `strike`, `beam`, `warn`, and the chevron
projectile. Add:

- **`patch`**. A ground ellipse that holds its size and fades. Fault lines,
  packet storms, auras, and "this circle is the hitbox" all want this. `ring`
  expands, so it cannot mark a radius you are supposed to leave.
- **`trail`**. A few short rectangles along a segment. Dashes, Orange Pill,
  Step Back, Picket Rush. The segment is two points, the same as `bolt`.
- **`mark`**. A tiny shape above a head: pips for Rehearsal, a stack count for
  Vesting, a ring for The Dip while it is armed, a collar for Non-Compete.
  Drawn with the floating text, above the darkness, so it survives the light
  pass.
- **`orbit`**. Two or three small rectangles circling a point. Blessed
  Hashrate and anything else that is "many shots from me." Not a hammer cel.
  If it starts to look like one, it is wrong.
- **`glyph`**. The same id, drawn into the skill button at 24px with the
  abbreviation still underneath. One function, two sizes.

Each active skill gets a record, not a function:

```
SKV[cls][i] = { k, col, r, w }
```

`k` is a kind. `col` defaults to `DTY[skType(cls, i)].c`, then to the class
color, so a Heat skill and a Surge skill separate even when the shape matches.
`cast` stops pushing its own ring. The skill's record is the cast. Passives
get a `mark` or a `patch` while they are on, and nothing on the frame they
are learned.

`SKF` stays the gameplay. It may still push a `patch` when it creates a ground
object, but the choice of shape lives in `SKV`, next to `SKT` and `SKS` in
load order (`src/p10.js` is the natural home: it already owns damage type and
sound). The renderer in `src/p3.js` switches on `k` and never on class or
index.

### Readability rules

- One skill, one primary shape. A second shape is the hit, smaller and
  shorter. Tick Tock is an `arc` nine times and one heavier `arc` on the
  tenth, not a ring plus an arc plus a bolt.
- The hit's float color comes from `e.lt` when the hit has a type. White
  remains the default for untyped.
- Persistent states use `mark` or `patch` and do not also toast, once the
  mark exists. Refused casts keep the toast ("Nothing above the floor", "No
  aura is on"). A refusal has no graphic.
- Enemy ground danger stays `warn` red. Player ground effects use the damage
  color and a thinner stroke, so a volatile monster and a Ground Fault are
  not the same disc.
- Other players and the companion draw from `SKV` at their own coordinates.
  `tagDo` already aims `SKF` at the companion. Remote players need the id,
  then the local client plays `SKV` at the interpolated position. No second
  art path.

### The light buffer is not the place to spend

`LC` in `src/p3.js` is an 8×8 canvas, stretched over the view. Lights are
blobs. Another radial gradient will not make Blessed Hashrate readable. Spend
the main canvas on the shape. Call `light()` for a cast at most once, and
skip it entirely for other players' effects.

### Caps, before the pretty version

Per frame, after the new kinds exist:

- `W.fx` at 48. Drop the oldest `ring` first. Never drop a `warn` or a `patch`
  that is still the telegraph of a hit you can walk out of.
- `W.parts` at 80.
- `LIGHTS` at 16, own casts first.

`OPT` gains `fx` with three steps, defaulting to the middle: full, normal,
thin. Thin draws your own telegraphs and `mark`s, and skips other players'
casts, extra lights, and particles. The options sheet already has a row of
toggles (`OPT_DEF` in `src/p1.js`). This is a toggle, not a menu.

### What goes on the wire

Extend the existing `move` packet with three small fields, sent only when they
change, so a standing player does not grow the packet:

- `sk`: the last skill index cast, or null
- `au`: the aura index, or null
- `sw`: 1 if a melee swing happened since the last beat

The receiver plays `SKV` once when `sk` changes, and draws the aura `patch`
while `au` is set. Ten updates a second already interpolate position. A cast
does not need its own message, and it must not be sent to the server as a
list of coordinates. The server stores and forwards the fields the same way
it forwards `dir`. It does not simulate them.

PvP damage stays the `pvp` packet. A cosmetic cast is not permission to hit.

### Party auras, paint first and numbers later

Paint, in the graphics milestones: if `au` is set and the other player is in
your party and within the aura's range, draw the same `patch` on them that
you draw on yourself. Range uses the positions you already have. No stat
changes.

Numbers, in their own milestone, because they are balance: the three
Maximalist auras apply to party members and hirelings in range, one aura at
a time, and two Maximalists' different auras can both be up. Match the 1.08
shape already in the research note. Running a Node already gives allies the
full bonus and you half; do not invent a second rule. Offensive auras
(Marked to Market, Proof of Work) already want hostile stand-ins, which are
in `W.ents`. They must not treat a party member as a monster. Buff auras must
not haste a hostile. The implementation wants an explicit "nearby allies"
list, not a wider `W.ents` loop.

Do not retune the aura coefficients in that milestone. Wire the existing
numbers to a wider set of bodies, then measure. PvP damage stays on
`mpDmg()`. This plan does not change the fraction.

## Copy audit

### Method

1. A read-only extractor, `tools/copy-ledger.js`, walks the built page's
   string sources (the `src/` files, not `dist/`) and writes
   `notes/copy-ledger.md`. One row per string: file, line, surface (tooltip,
   toast, dialog, gossip, quest, scene, sheet, item, multiplayer), speaker,
   and the text. Dynamic strings are recorded as their template with the
   interpolations marked. This tool does not edit `src/`.
2. A person, or an agent with the rubric below, tags each row with a bucket.
   The tag is a column in the ledger. It is not a commit to the game.
3. Rewrites land per bucket, per speaker, in later milestones. A rewrite of
   Gramps is a diff the owner can read in one sitting. A rewrite of every
   file in one commit is how the slack voice gets painted over the specific
   one.
4. New strings after the ledger exists have to be added to it in the same
   change. That is the regression test. There is no automated slop score.
   A score will flag Have Fun Staying Poor and miss a bland tooltip.

### Rubric

Keep the line when it has one of these:

- A fact the player must act on (a number, a floor, a refusal, a cost, a key).
- A concrete noun that only this speaker would be holding.
- A want, a contradiction, or a joke that fails if you give it to someone else.
- The setting's own words (sats, visor, stipend, MANDATE, the timechain), used
  as objects, not as a sermon.

Cut or tighten when the line is:

- A second sentence that restates the first in finer words.
- The theme, announced. Cost, freedom, and the two machines are the story.
  They are not required in the tooltip.
- A patch note in a character's mouth. Move the fact to a short toast or the
  quest tracker. Leave the character one line, or nothing.
- The same thesis already said by this speaker in `GOSSIP`. Keep the best
  one. The others can be about the shop, the weather, the fee.
- A "Not X. Y." where X was not in doubt, or a triad that exists to sound
  finished.

Do not "improve" a line by making it warmer, wiser, or more grammatical. The
street chatter is allowed to be flat. Bosses are allowed to talk like memos.

### Priority buckets

Work top to bottom. Lower buckets are seen less often and are closer to the
book, so they wait for the owner.

1. **Combat strings.** Refused-cast toasts, float text, the level-up toast.
   High frequency, low literary risk. After a `mark` exists, delete the toast
   that only existed to announce the state.
2. **Skill tooltips and abbreviations.** Every active tooltip should say what
   it does in one or two clauses and the number. Names stay unless a name is
   a D2 proper name that slipped back in. Abbreviations have to fit the
   button once a glyph sits above them. Passives say "Passive" once, then the
   number.
3. **System dialogs.** Act entry, act complete, the party invite, schema
   choice, the boon-refund toast, shape-shift confirmations. Facts stay.
   Speeches go.
4. **Repeatable talk.** `GOSSIP`, `CHATTER`, locals, vendors, Kestrel's fee
   line. Deduplicate the thesis. Keep the lines that mention an object.
5. **Quests and turn-ins.** The brief in `QUESTS` is already short and should
   mostly survive. Turn-ins in `QRW` and `talkTo` that retell the quest get
   cut to the reward and one sentence of character. "You gain 1 skill point"
   stays. It is the Cain line, and it is honest.
6. **Scenes.** `playScene` slides, boss introductions, the endings. Not an
   agent pass. The ledger tags them. The owner rewrites, or declines to, one
   scene at a time.

Item names and affixes are bucket 2 if they are jokes with no picture
("Apocalyptic" on a damage roll is noise; "Jagged" is fine) and otherwise
left alone. Unique item flavor is bucket 6.

## Milestones

Each one is a later commit series. This document is milestone 0 of *this*
plan, and it ships alone.

### V1. Budget, and the lying circle

Remove the `sl(11)` ellipse. Add the caps, `OPT.fx`, and the four new kinds
with one internal caller each so they can be seen. No skill retarget yet.

**Test.** A `__g` page script spawns a pack, casts until it would have
exceeded the caps, and asserts `W.fx`, `W.parts`, and `LIGHTS` stay inside
them, and that a `warn` survives when rings are dropped. `OPT.fx` thin skips
particles. `node tools/smoke.js` still walks all 34 districts. Screenshot the
phone viewport once with a `patch` and a `trail` on screen so the kinds are
visible.

### V2. One class of shapes

Assign `SKV` for one class, Scrapper first, then the same order as milestone 0
of the class plan: Technomancer, Runner, Anon, Founder, Maximalist. One class
per commit. Buttons for that class draw the glyph. `cast` no longer adds a
class-colored ring on top.

**Test.** Per class, a page script casts each active once and asserts the
`W.fx` kind matches `SKV`. Screenshot the three buttons and one cast. No
number changes, so the existing `tools/m0-check.js` combat checks still pass.
Do not feel-tune damage in these commits.

### V3. State you can read without a toast

`mark` and `patch` for: the three auras, Rehearsal charges, The Dip armed,
Vesting stacks, Non-Compete, Garden Leave on the cursed machine, The Dump's
spent-charge type. Party members and the hireling get the aura `patch` when
they are in range. Stats do not change.

**Test.** Set the state through `__g`, screenshot, assert the mark exists and
the matching toast does not fire for a state that now has a mark. Refused
casts still toast. Two-browser check is not required yet, because the fields
are local. A fake `MP.others` entry with `au` set is enough to assert the
patch is drawn.

### V4. The wire

Add `sk`, `au`, and `sw` to `move`, forwarded by the server, ignored by
combat. The other client plays `SKV` at the interpolated body, under the
normal fx cap, and not at all when `OPT.fx` is thin.

**Test.** `server/test/` for the forwarded fields: the packet stays small
(assert the JSON is well under a kilobyte, and that it does not contain
arrays of points). A two-browser test: one client casts, the other sees a
single fx of the right kind, and the server log shows no per-particle
message. Re-run the live suite. PvP damage numbers are unchanged.

### V5. Party auras as numbers

Nearby party members and hirelings receive the aura that is already
implemented for the owner. Hostile stand-ins receive only the offensive
half. No coefficient changes.

**Test.** Two browsers in a party, same district: Toxic Maximalism changes
the ally's swing timer, Marked to Market marks a monster near the aura
holder and does not mark the ally, Proof of Work damages that monster.
A hostile pair: the defender is marked, and is not hasted. Record the
before/after on a single monster's time-to-kill and leave the numbers for
a later balance pass if the wider radius is obviously too strong. Do not
"fix" it inside V5.

### C1. The ledger

Ship `tools/copy-ledger.js` and the generated `notes/copy-ledger.md` with
every row untagged or tagged `unread`. No string in `src/` changes.

**Test.** The script exits 0, the row count is stable against a second run,
and a deliberate extra `toast('ledger canary')` in a throwaway edit shows
up as a new row. Revert the canary. `npm` script optional; `node
tools/copy-ledger.js` is enough.

### C2. Combat strings and tooltips

Buckets 1 and 2, all six classes. Names stay unless they are a D2 proper
name. Abbreviations re-measured against the button with the glyph from V2,
so C2 waits until that class's V2 commit exists. If V2 slips, C2 may still
edit tooltip *bodies*, not abbreviations.

**Test.** Ledger diff is the review. `m0-check` tooltip asserts that look
for a substring have to be updated in the same commit when the substring
moves. Smoke. Read the skills sheet in the browser for one class and
confirm the tooltip still states the number the test asserts (the Halving
floor, Org Debt's direction, a refusal).

### C3. System dialogs and repeatable talk

Buckets 3 and 4.

**Test.** Ledger diff. A page script opens the act-entry dialog and the
party invite and asserts the fact is still present (level cap, row unlock,
invite requires acceptance) in fewer sentences. Gossip: each speaker's
lines are still non-empty, and the duplicated thesis appears once per
speaker. Talk to Gramps, Brenda, and Nonce in the browser and confirm the
line that remains is still theirs.

### C4. Quests, then scenes only if the owner asks

Bucket 5 as a normal change. Bucket 6 is a list of proposed cuts in the
ledger, not a rewrite, until the owner picks a scene.

**Test.** Quest tracker still names the quest, the giver, and the reward.
Turn-in still grants the reward. `tools/smoke-acts.js` if a scene's slide
count changes. No reward tuning.

## Risks

- **Performance.** The expensive part is strokes on the full-resolution
  canvas, times device pixel ratio, times eight players. The light buffer
  is already cheap and already blurry, so "more glow" is a trap. Caps and
  `OPT.fx` land in V1, before any class is retargeted. If a phone cannot
  hold V2's Scrapper at the middle setting, the shapes get simpler. The
  skills do not get a second art pass to compensate.
- **Plagiarism of the look.** Mechanics are free to reimplement. Specific
  missile art, overlay art, and skill names are not. No extracted D2 cel,
  no hammer, no orb, no hydra, no "sanctuary" ring of the classic
  proportions copied by eye. If a screenshot from this game could be
  mistaken for a cropped D2 screenshot, the shape is wrong. The class line
  "A paladin, essentially." stays a joke in text. It does not become a
  winged helmet.
- **Scope.** Ninety skills times a bespoke animation is not this plan. Ten
  kinds, colored by damage type, assigned in a table, is. Party-aura
  *numbers* are one milestone and stop at the existing coefficients.
  Homesteader, Witness, and the social layer stay in the eight-class plan
  and are not started here. Copy bucket 6 can absorb an unbounded amount of
  taste; the ledger is the brake.
- **Voice.** An agent rewrite of the book will regress toward the slack
  voice this audit is trying to thin out. Buckets 5 and 6 are small diffs.
  The rubric's "do not make it wiser" line is there for that reason.
- **Multiplayer authority.** A prettier hit is not a confirmed hit. Clients
  already show PvP damage locally and then take the server's word. V4 must
  not add a path where the cosmetic cast applies damage on the far side.
- **The lying circle and old tests.** Anything that assumed `sl(11)` paints
  an aura, or that a cast always pushes a class-colored ring, will fail in
  V1 and V2. Update the assertion. Do not put the circle back to satisfy it.

## What this plan will not do

- It will not retune rows 1–3, the new row-4 and row-5 numbers, or PvP's
  damage fraction.
- It will not add a WebGL layer, a sprite sheet, or a second canvas for
  effects.
- It will not sync particles, corpses, or floating text.
- It will not start the Homesteader, the Witness, or the friends list.
- It will not rewrite dialogue in the same commit as a graphic.
