# Plan: eight classes, and a social layer that can survive a restart

Design only. This document does not change the game. It says what to build, in what
order, and how to know a step worked. The two research reports it sits on are
`notes/diablo2-1.08-research.md` and `notes/codebase-inventory.md`. Where those
reports and the source disagreed, the source is what this plan uses. Claims the
research marked UNVERIFIED are not treated as facts here.

The setting stays 2087, after *Project Phonix*: Unity, credits, sats, the machines,
Stillwater, Phonix, Providence. Nothing in this plan imports a D2 name, skill name,
monster, or line of text into the player-facing game.

## What was checked in the source

Four findings were given as starting points. All four hold.

**1. Rows 4 and 5 are six behaviours wearing thirty-six names.**

Each class is authored with nine skills (`src/p1.js` lines 15–86). Two loops then
push the same six passives onto every class:

- Line 90 pushes `strike`, `mend`, `aura`, named per class by `BN` (line 89).
- Line 94 pushes `nova`, `mastery`, `guardian`, named per class by `BN3` (line 93).

The behaviours are not in those loops. They are hardcoded by skill index, and the
index means the same thing for every class:

| Index | Row (as the sheet says it) | What it actually does | Where |
|---|---|---|---|
| 9 | fourth, level 26, Act II | a bolt at the nearest machine on a timer | `update`, `src/p2.js:569` |
| 10 | fourth | a heal and some energy every 5 seconds | `update`, `src/p2.js:570` |
| 11 | fourth | a slow and a tick of damage around you | `update`, `src/p2.js:571` |
| 12 | fifth, level 51, Act III | 20% chance of a shockwave when you are hit | `hurt`, `src/p2.js:434` |
| 13 | fifth | +3% damage per rank, and +2% life | `hit` `src/p2.js:381`, `calc` `src/p2.js:184` |
| 14 | fifth | a killing blow leaves you at 30% life | `hurt`, `src/p2.js:436` |

A missing `BN` or `BN3` key throws while the page is still loading, because the loop
reads `BN[k][i]` for every key of `CLS`. That is the boot crash.

**2. Six classes already occupy six archetypes. The Druid is the empty chair.**

Read from the skills, not from the tags:

| Class | What the kit actually is | Archetype it already echoes |
|---|---|---|
| Scrapper | Wide swings, a spin, a rush, a horn, a leap, a weapon throw. High life, melee. | The weapon-and-shout fighter. |
| Technomancer | Chain lightning, a piercing bolt, a nova, a storm, a turret. Fragile, ranged. | The elemental caster. |
| Runner | A fan of throws, a dash, a decoy, a ground trap, pierce. Fast. | The ranged weapon platform that survives by not being there. |
| Anon | Lures, mines, a blink-stab, stealth, clones, a screen of blades. | The trap and shadow class. What it does not have yet is the charge-up and the finisher. |
| Founder | Interns, contractors, one big enforcer, a convert, an explosion of his own workforce. | The summoner who spends other bodies. His summons do not leash: the Intern tooltip says they follow you everywhere. |
| The Maximalist | One aura at a time, a flurry that ends in a heavy hit, a charge, spiralling hammers. Story-locked. His own tag is "A paladin, essentially." | The aura class. He is the only one. Auras are a bespoke branch (`maxiSet` / `maxiAura` / `maxiBuff` in `src/p12.js`), not a system. |

`shapeShift` (`src/p5.js:74`) is a full class change at the VR rig. It is not a
combat form. The Druid analogue must not be implemented by calling it.

**3. A friends list has nowhere to live.**

`server/lib/live.js` keeps the running world in three Maps: `live`, `games`,
`parties` (lines 41–43). `byZone` and the rate-limit `WeakMap` are derived from
those and are also memory. All of it is gone on restart. That is the right lifetime
for a game of eight. It is the wrong lifetime for a friend.

The only durable store is `server/lib/store.js`. `Table` holds one JSON object per
file (`users`, `sessions`, `tokens`). `docs` holds one file per document under
`data/docs/<uid>/`. Every document route in `server/server.js` takes the uid from
the session (`/api/doc/get` at line 281). A client cannot name another account.
`server/test/run.js` asserts this: Vale cannot read Gramps's `hero1` (around line
94). That test stays green, and the route stays session-scoped. Friends are not a
new document id.

What does already exist, and should be reused rather than rebuilt: `users` is keyed
by lowercased account name, and `findByName` (`server/lib/auth.js:55`) resolves it.
There is no separate character name. A wanderer is "level N, class, slot 1–3" on an
account. The friends list is a list of accounts. `findByName` returns the whole user
record, including the password hash. Any friend lookup has to project before it
replies. Nothing in the reply may contain `pass`, `email`, or a document body.

`live.get(uid)` is the only presence lookup. `lobby()` returns the newest 60 games
and takes no query (`server/lib/live.js:62`). Neither of those should grow a player
directory. You find a person by typing an account name you already know.

**4. A new class is a checklist, and one missing key takes the page down.**

`HANDOFF.md` names the tables. Checked against the call sites, the crash-or-throw
set is:

| What | Where | What happens if the key is missing |
|---|---|---|
| `CLS` entry, 15 skills | `src/p1.js:15` and the `Object.assign` at line 50 | The class does not exist. `applySave` refuses the save (`src/p2.js:226`). |
| `BN` and `BN3` | `src/p1.js:89` and `:93` | The loops at lines 90 and 94 throw during load. The page is blank. This goes away when milestone 0 retires the loops. A class added before that must have both keys. |
| `SKF[cls][i]` for every active | `src/p2.js:456`, extended at 480 | `cast` calls it with no guard (`src/p2.js:527`). A missing function throws on the button press. |
| `DOCS[cls]`, three doctrines | `src/p10.js:57` | The skills sheet calls `.map` on it (`src/p4.js:334`). Opening the sheet throws. |
| `BUILDS[cls]` | `src/p10.js:154` | `buildApply` calls `.find` with no fallback (`src/p10.js:177`). Choosing a build at the rig throws. The "I will assign" path of `shapeShift` does not need it. The sheet still offers builds. |
| `SKT[cls]` | `src/p10.js:80` | Safe. `skType` falls back to `'impact'`. Wrong element, not a crash. |

Also required for the class to look like itself, none of which crash the boot:

- `drawPlayer` in `src/p3.js` (the per-class drawing starts around line 213). The class *picker* is `drawCls` in `src/p4.js:606`, and it is already data-driven off `CLS`. The inventory's "drawCls in p3" is the wrong file. Do not add a case there.
- A `FAM` weapon family (`src/p10.js:109`) if the class should not inherit a random other family's weapons. `famify` already survives a missing family: it picks someone else's.
- Two `UNI` entries with `cls` set, so the class has gear that wakes up in the right hands. The existing classes have two each, except the Maximalist, whose kit is the Sound type instead.
- A `calc()` branch for each passive (`src/p2.js:182–187` is the current hardcoded list). A passive with no branch displays a promise the sheet cannot keep.
- `SKS` is optional. `cast` uses `SKS[G.cls][i] || 'cast'`.
- `baseType()` (`src/p10.js:82`) if the class's ordinary swings should not be Impact.
- The companion AI in `src/p10.js:247` calls `SKF`, so a rendered copy of the class fights once the actives exist. No separate companion table.

`G.sk` is a flat array of 15. Saves written before a change already have points in
indices 9–14. Those points were spent on the six generic boons. Changing what the
index does underneath them is a bait-and-switch. Milestone 0 refunds them.

## Principles

Taken from the 1.08 research, and from what this game has already chosen.

**Do not add skill synergies.** In 1.08 a skill's power came from its own points plus
items. Synergies arrived in 1.10 and are the thing that made hybrids stop working.
This game already has `syn` (`src/p2.js:172`): the skill directly above contributes
+6% per point. That is a prerequisite reward, it is shipped, and it stays. Nothing
in this plan adds a bonus from a skill in another column, or from a skill that is
not the one above.

**Points stay mostly terminal, and the two escapes stay on purpose.** 1.08 had no
respec. This game has Sister Null (a paid refund of skill and attribute points) and
`shapeShift` (a full class change for 5 sats, keeping level, gear and quests). Both
are deliberate. Do not remove them while adding classes. Do not add a third, free,
unlimited respec. The web (`WARMS`) has no respec and should not grow one.

**The Maximalist's joke stays.** "A paladin, essentially" is the line that makes the
influence read as heritage. Do not sand it off. Do rename the one player-facing
skill that is a D2 proper name: `Conviction` (Maximalist skill index 4). Proposed
name: **Marked to Market**. Same effect (resistances stop applying inside the aura).
The implementation comments in `src/p2.js` (Zeal, Smite, Blessed Hammer) and
`src/p12.js` (Fanaticism, Conviction, Holy Fire) ship inside the built HTML, because
`build.sh` concatenates the scripts. When a class's file is touched, rewrite those
comments into the game's own words. Do not do a separate comment-purge commit.

**One aura class.** The Homesteader and the Witness do not radiate auras. Do not
build a general aura system. If the Maximalist gains one more aura, it goes through
`maxiSet`. A second aura class is out of scope for this plan.

**Eight means deepen six, add the empty chair, add one class with no chair at all.**
The eighth class is the proof the roster is not a tracing. It does not get a D2
paragraph in the design.

**Social acts are visible to the person they happen to.** 1.08's party screen told
the target. Keep that. A friend request, a whisper, a hostility declaration, and a
stand-down all produce a line the other account actually receives.

**Do not copy the numbers that the research could not verify.** The 1.08 PvP damage
scalar is unknown; this server already uses `PVP_SCALE = 0.25`, which is the 1.09
value, and it stays. The 1.08 experience curve past level 70 is unknown; this game
uses an act level cap and then paragon, and it stays. Whether the +35% party
experience bonus grew with party size is unknown; this plan uses the flat reading.
Gold splitting was removed a patch later and the sources conflict; do not add it.

## Milestone 0 — rows 4 and 5 become real

This is the first work, and it is worth more than either new class. Ship it one
class at a time, in the order Scrapper, Technomancer, Runner, Anon, Founder,
Maximalist. Each class is its own commit. Do not start the Homesteader until all
six are done, or the new class will be born into the boon loop.

### How the replacement works

The six ticks key off the index, not off the `boon` field. The moment skill 9 has a
new effect, `update` will also fire the old bolt unless the tick is guarded in the
same change. For each class commit:

1. Replace that class's six entries in the skill array with authored skills. Take
   the class out of the `BN` / `BN3` loops rather than leaving names behind. The
   practical way is a per-class skip: the loop continues for classes not yet
   migrated, and a migrated class carries fifteen skills in `CLS` and is absent
   from `BN`. When the sixth class lands, delete `BOON`, `BN`, `BN3`, and both
   loops.
2. In the same commit, guard the index ticks so they only run when
   `CLS[G.cls].sk[i].boon` is set. A migrated skill has no `boon` field, so the old
   bolt, heal, aura, nova, mastery and guardian cannot double-dip. Delete the ticks
   themselves in the commit that deletes the loops.
3. Give each new active an `SKF` function and, where it should not be Impact, an
   `SKT` entry. Give each new passive a `calc()` branch or a tick of its own, next
   to the skill, not as another magic index in `update`.
4. Update that class's three `BUILDS` so `pr`, `sl` and `pa` point at skills that
   still exist and still mean what the build text says. A build that still praises
   "Brownout" after Brownout is gone is a broken plan.
5. Refund, once, on load. If `G.sk` has any points in an index whose skill used to
   be a boon and the save has no `G.boonRefund` flag, add those points back to
   `G.sp`, zero the six indices, set the flag, and toast one line: the old boons
   were withdrawn and the points returned. Do this only for indices that were boons
   on that class. Do not touch points in rows 1–3. Saves that already have the flag
   are left alone, so the refund cannot fire twice.

### What the new skills should be

Most of the six should be actives. The passive cap (`PCAP`: 2, then 3 in Act II,
4 in Act III, 5 in Act V) is a choice among passives. Six more passives makes the
cap a tax. Aim for four actives and two passives per class in these two rows.
Passives that remain must not be "+3% damage and +2% life" under a new name.

The descriptions below are the design, in this game's voice. Numbers are first
drafts in the same range as the row-3 skills. They will move once Acts III–V are
actually measured. Do not tune them by feel in the same commit that adds them.

**Scrapper.** The row is about the weapon and about standing still, which is the
thing the Runner cannot do.

- **Lunch Pail** (active). Set it down. You and anyone fighting beside you recover
  life while near it. It has a life total and it breaks. Not a personal regen tick.
- **Seniority** (passive). The damage type on the weapon in your hand gains a real
  bonus. A Scrapper with a rust sign and a Scrapper with a heat sign are different
  characters. This is the weapon-mastery fantasy, and it replaces +3% to everything.
- **Hold the Line** (passive). Armour rises for each second you have not dashed,
  and resets when you do. It disagrees with Picket Rush on purpose. The Witness
  must not get a skill with this name.
- **Call the Strike** (active). A horn. Non-elites scatter. Elites are pulled a
  short distance. War Horn already stuns; this one moves the fight.
- **Two-Handed** (active). Your next three swings are slow, cannot be interrupted,
  and hit a wider arc. It is a weapon stance, not a bolt from the sky.
- **Last Shift** (active, long cooldown). For a few seconds your swings leech and
  you do not flinch. It does not save you from zero. If you are still in it when
  you fall, you fall. The generic guardian promised a free life. This one spends a
  button.

**Technomancer.** Rows 1–3 are almost all Surge. These rows open Heat and Noise as
real specialisations, so the class has the caster's actual choice: which element,
and whether you spend points on moving. No cross-element synergy.

- **Ground Fault** (active, Heat). A line of heat on the floor for a few seconds.
  It has a short casting delay, in the 1.08 sense: a hard wait, not an energy cost.
- **Packet Storm** (active, Noise). You mark a spot. The storm arrives late. Moving
  after you cast does not move it.
- **Schema** (passive). When you learn it you pick Surge, Heat or Noise, and that
  choice is stored on the character (`G.schema`). Respec at Sister Null may change
  it; dying may not. Damage of the chosen type goes up. The other two do not.
- **Step Back** (active). A blink of about four paces, back along your facing. It
  is not a cross-map teleport and it must not become one. The caster's privilege
  in 1.08 was the whole screen; this game's districts are small and a phone screen
  is smaller. Four paces is the echo.
- **Patched** (passive). A fraction of the Surge damage you deal becomes a barrier
  on you. Cipher Ward already turns damage into an energy drain. This is the other
  direction, and it does nothing for a Heat or Noise Schema.
- **Kill Dash Nine** (active, long delay). One machine. Ignores its resistance to
  your Schema type, once. It does not pierce an immunity of 0: the 1.08 rule was
  that resistance-stripping stopped at immune monsters, and this skill respects
  that. A resistance of 0 stays a wall. A resistance below 1 is what this punches
  through.

**Runner.** Delivery and not being there. The decoy gains the leash the Founder's
workforce refuses.

- **Return to Sender** (active). A throw that travels out and comes back, hitting
  on both passes.
- **Route Knowledge** (passive). After a dash, your chance to avoid a hit rises for
  a few seconds. Standing still does nothing. This is the opposite of the
  Scrapper's Line, and a character who shape-shifts between them should feel the
  disagreement.
- **Second Drop** (active). One decoy that copies your last throw, then leashes. If
  you get more than a short distance away it pops. It does not follow you
  everywhere. That sentence is the Founder's, and it stays his.
- **Manifest** (active). A piercing throw that splits into two after the first
  machine it hits.
- **Hazard Pay** (passive). Extra credits and magic find, but only from a machine
  you killed with a throw. A kill with a dash's landing does not pay.
- **Missed Connection** (active). Mark a machine. If it dies within a few seconds,
  to you or to anyone in your party, you blink to where it fell and your next throw
  costs nothing. This is the row's party skill. It is not a cheat-death.

**Anon.** Rows 1–3 are traps and stealth. The archetype's missing half is the
combo: a charge-up that banks, a finisher that spends. Add it here rather than
retrofitting the early rows.

- **Rehearsal** (active). A strike. Landing another Rehearsal within a short window
  adds a charge, up to three. Charges sit on you, not on the target. A different
  charge-up is not required; this class gets one, done properly, rather than a copy
  of a three-skill chain.
- **The Dump** (active). Spends every charge. One charge is a rust bleed. Two is a
  silence. Three is the screen of blades Legion already gestures at, but paid for
  by the combo instead of by a cooldown. A plain attack, while you hold charges,
  spends one and does the one-charge effect. Charges do not survive a zone change.
- **No Attribution** (passive). While Incognito is up, laying a mine does not break
  it, and the mine arms faster. It does nothing when you are visible.
- **Dead Drop** (active). Place a mark. Activate again to appear at it. One mark.
  It is a trap that does not explode. The old boon name can stay, because the boon
  never had a behaviour worth preserving; the new skill should use it for real.
  Refunded points do not auto-learn it.
- **Cutout** (passive). The first hit that would destroy a mine or a sockpuppet is
  ignored. It does not apply to you.
- **We Were Never Here** (active). Every mine and sockpuppet you have goes off as a
  silence, and you drop into Incognito. If you have none, the skill does nothing
  and tells you so. It is an escape that can fail.

**Founder.** The corpse and the curse are the thin side of this kit. Layoffs
explodes his own staff. These rows give him enemy bodies, and a reason not to
explode the staff.

- **Garden Leave** (active). Requires a body: a workforce member or a converted
  machine that died in the last few seconds. Spend it to curse the thing that
  killed them. The curse deals damage over time and the target cannot be healed.
  With no body, the skill does nothing. That restriction is the whole point.
- **Non-Compete** (active). A curse. The target can only attack you. Your workforce
  will not hit it. It is control, and it sets up a convert.
- **Vesting** (passive). A workforce member gains a stack for every few seconds it
  stays alive, and loses them all if you summon over it or lay it off. Layoffs
  still exists. The two skills argue.
- **Term Sheet** (active). One officer, the same "only one" rule as Chief of Staff.
  You may feed it a weapon from your pack. The weapon is consumed. The officer's
  attacks use that weapon's damage type. An empty-handed officer is weaker and is
  Impact. This is the item-consuming summon, and it should feel expensive.
- **Org Debt** (passive). You deal less damage the more workforce you have out.
  They deal more. A Founder who maxes this and then tries to melee is playing the
  class wrong, and the sheet should say so in the tooltip.
- **Liquidation** (active). Explode enemy corpses in an area, not your staff.
  Layoffs remains the button that spends your own people. These two must not share
  a function.

**The Maximalist.** His rows 1–3 are already the most finished in the game. The
boons undercut them, because Nonce Found is a generic bolt on a class whose entire
joke is that nothing resists his damage. Every new skill here deals Sound, or
grants one swing of it. Rename `Conviction` to **Marked to Market** in this commit.

- **The Halving** (active, Sound). A pulse that removes a fraction of a machine's
  current life. It will not push a machine below a stated floor (draft: 35% of its
  maximum). The floor is in the tooltip. This is the 1.08 lesson about a capped
  life-cut, without importing the skill it belonged to.
- **Running a Node** (passive). While an aura is on, allies and your hireling get a
  small bonus, and you get half of it. The half-for-yourself rule is the aura
  class's actual shape. It applies to this passive only.
- **Cite Your Sources** (active, Sound). A volley that only fires while an aura is
  on, and which aura is on changes the volley: attack speed aura makes it faster
  and lighter, the resistance aura makes it heavier and slower, the damage pulse
  makes it tick. One skill, three readings, no new aura. Do not add a fourth aura
  in this milestone.
- **Priced in Sound** (passive). Damage you deal that is not Sound is converted to
  Sound at a penalty. A rust weapon in his hands becomes the joke, and is worse
  than a real Sound skill. That is the right direction.
- **The Dip** (active, long cooldown). You ignore the next hit. You choose when.
  It does not trigger itself at 0 life.
- **Not Your Keys** (passive). If a hireling or a rendered companion is alive, the
  hit that would kill you kills them instead, once a minute. If you are alone, it
  does nothing. His guardian is a person, not a percentage.

### Testing milestone 0

`node tools/smoke.js` after each class. Plus one small page script per class,
through `window.__g`, that:

- Calls `skipDisc()`, starts that class, grants a point in index 9, and steps
  `update` long enough that the old bolt would have fired. Assert it does not.
- Casts each new active once and asserts the thing it claims (a decoy exists, a
  charge incremented, a corpse was required and the skill refused without one).
- Loads a synthetic save with points in indices 9–14 and no `boonRefund` flag,
  and asserts the points came back and the flag is set. Load it again and assert
  the points were not refunded twice.
- Opens the skills sheet. `DOCS` and `BUILDS` for that class still render.
- `shapeShift`s to the class with a named build and back.

Do not retune row 1–3 numbers in these commits.

## The roster

| # | Class | Role in a party | Where it comes from |
|---|---|---|---|
| 1 | Scrapper | Stands in the door. | Already the weapon fighter. Milestone 0 makes the weapon matter. |
| 2 | Technomancer | Clears the room, badly hurt if touched. | Already the caster. Milestone 0 gives the element choice. |
| 3 | Runner | Kills at a distance, leaves, comes back for the loot. | Already the ranged platform. Milestone 0 adds the leash and the party blink. |
| 4 | Anon | Sets the room up before the pull. | Already traps and stealth. Milestone 0 adds the combo. |
| 5 | Founder | Brings other bodies, and a reason to negotiate who stands where. | Already the summoner. Milestone 0 splits staff-corpses from enemy-corpses. |
| 6 | The Maximalist | The aura. One, shared, always on. | Already that, and story-locked. He stays story-locked. |
| 7 | Homesteader | Controls ground, or becomes a body, and cannot do both. | The empty chair. New. |
| 8 | The Witness | Watches, then spends the watching. Fragile. Makes everyone else's damage better and deals little. | No archetype behind it. New. |

Both new classes appear on the title screen. A class you cannot start is not part
of the roster. The Maximalist remains the one unlock.

## Milestone 1 — the Homesteader

The Druid's mechanical signature is an opportunity cost nobody else pays: a form
that locks the rest of the kit. The Homesteader is the person who left the stipend
towns and lives on the verge, which the Office of Price Stability says does not
exist. They do not hire a workforce and they do not cast like a contractor. They
cultivate a patch of ground, or they climb into a dead machine and wear it, or they
keep a flock of feral drones that do not love them.

Three columns. Using one column's capstone should make another column's skills
fail or fall away. That exclusion is the class. Do not let a build stack all three.

**Column A, the Plot.** Ground skills. Heat vents, a rust rain, a hedge that blocks
movement. These are placed, they persist, and they end if you enter a chassis.

**Column B, the Chassis.** Two forms, and only one at a time.

- **Hound.** Fast, melee, low armour. Plot skills and flock skills grey out. Any
  weapon that was ranged is melee for the duration: the swing still uses the
  weapon's damage, the reach does not. This is the shapeshift rule that mattered,
  reimplemented without an animal's name.
- **Hull.** Slow, armoured, cannot dash. Hound skills grey out. The same range
  collapse.

Leaving a form is itself a skill with a short recovery, not a toggle you tap
between attacks. You cannot cast Plot or Flock while the form is up. The form
survives a zone change and is cleared by death, by town, and by `shapeShift`.

**Column C, the Flock.** Not employees. A small pack of feral drones, and one
**Bull** that picks its own target. The drones leash: past a distance they stop
obeying and will hit you if you are the nearest thing. The Founder's interns follow
him everywhere. The Homesteader's flock will bite the Homesteader. That single
difference is how a player tells the two summoners apart with their hands.

Draft of the fifteen, row by row. Rows 1–3 are the class. Rows 4–5 are its
argument with itself.

| i | Skill | Kind | Column |
|---|---|---|---|
| 0 | **Cold Frame** | active | Plot. A patch of ground that slows and deals rust. |
| 1 | **Wear the Hound** | active | Chassis. Enter Hound form. |
| 2 | **Strays** | active | Flock. Summon feral drones up to a small cap. They leash. |
| 3 | **Compost** | active | Plot. A corpse sinks into the ground and the next Plot skill is stronger. Needs a body, same rule as the Founder, different spender. |
| 4 | **Wear the Hull** | active | Chassis. Enter Hull form. Drops Hound if it was up. |
| 5 | **The Bull** | active | Flock. One bull. It chooses. You cannot ride it. |
| 6 | **Hedgerow** | active | Plot. A line that blocks movement for a few seconds. Machines and you. |
| 7 | **Shed** | active | Chassis. Leave the form. Short recovery. |
| 8 | **Go Feral** | passive | Flock. Drones that have leashed deal more damage and can no longer be called back. |
| 9 | **Kill Frost** | active | Plot. The capstone weather. Ends immediately if you enter a chassis. |
| 10 | **Wear What You Killed** | active | Chassis. Consume a non-elite machine and wear its body until you shed. You gain its damage type. Your flock despawns. Your weapons lose their range. |
| 11 | **Rootbound** | passive | Flock. Drones inside your plots do not leash. Step out of the plot and the rule returns. |
| 12 | **Salt the Earth** | active | Plot. Detonate every plot you have placed. They are gone afterwards. |
| 13 | **Too Big for the Door** | passive | Chassis. Hull form cannot enter a dash, and your armour in Hull goes up further the longer you have been in it. |
| 14 | **Slaughter Weight** | active | Flock. The flock detonates into a plot under them. You spend the flock to feed the ground. You cannot be in a chassis when you do it. |

Stats, first draft, to be measured rather than believed: life around 110, life per
level around 15, melee while in a chassis and ranged on foot, damage multiplier
near 1.0, attack interval near 0.55, move speed near 4.3. Colour something that is
not already taken: the six colours are orange, purple, green, near-black, black,
and bitcoin-orange. A dull living green-grey (`#6a8f62` or close) reads as the
verge and not as the Runner's `#3fbf8f`.

Weapon family: **Graft**, bases along the lines of Pruner, Irrigation Spike, Fence
Post, Combine Blade. Perk draft: plots last longer, flock leash is a step more
forgiving. Not a damage multiplier. The class is not short of bodies.

Doctrines, three, mutually exclusive, same shape as `DOCS`:

- **Tenant.** More life, slower. You are staying.
- **Poacher.** More damage, less life. You are taking something and leaving.
- **Fallow.** Plots tick harder, you and the flock deal less. The ground does the work.

Builds, three: a Plot build that never enters a chassis, a Hull build that never
places a plot, a Flock build that uses plots only as leash anchors. `buildApply`
has to be able to spend the points without violating the exclusion, so the build's
`pr` list simply does not contain the excluded column.

### Checklist for this class

Walk the table in "What was checked" above. Concretely, one commit touches:

1. `CLS.homesteader` with all fifteen skills, in `src/p1.js`, after the boon loops are gone.
2. `SKF.homesteader` for every active index, in `src/p2.js`.
3. `SKT.homesteader` for Heat, Rust and whatever the bull is. Impact is the fallback and is wrong for a rust plot.
4. `DOCS.homesteader`, three entries.
5. `BUILDS.homesteader`, three plans.
6. `calc()` branches for Shed's recovery, Go Feral, Rootbound, Too Big for the Door.
7. `drawPlayer` branch: on foot a person with a tool; in Hound a lower, longer silhouette; in Hull a machine you are inside. Three drawings, or the class is a recolour.
8. `FAM.graft`.
9. Two uniques: one that lengthens plots, one that starts you with a single stray.
10. `SKS` entries for the casts you want to hear. Optional, do it anyway.
11. Companion path: a rendered Homesteader in a chassis uses the chassis skills. `tagProxy` swaps `G.cls` for the duration of the call. Confirm the form state lives somewhere the proxy can see, or the companion never transforms and the test catches it.

No `BN` key. If milestone 0 has not landed, do not start this.

### Testing milestone 1

- `newGame('homesteader')` via `__g` after `skipDisc()`.
- Enter Hound. Cast a Plot skill. It must refuse. Shed. Cast it. It must work.
- Walk the flock past the leash distance and assert it is no longer on your side.
- Wear What You Killed on an elite. It must refuse. On a tick, it must work, and the flock must be gone.
- Open the skills sheet. Apply each build through `shapeShift`. Apply "I will assign."
- `node tools/smoke.js`. The new class is not a zone, so the district walk stays 34. Add the class to whatever boot path smoke uses to construct a character, or the smoke never puts the class on.

## Milestone 2 — the Witness

No D2 class is a person whose power goes up when they stop attacking. That is the
design, and it is the originality test. If a playtester can describe the Witness
as one of the seven, the milestone failed.

The Witness kept notes when Unity told everyone to stop looking. Stillwater
watches and does nothing. The Witness writes it down. The record is paper, which
is why Providence cannot edit it: there is no account to seize.

**The Record** is a second meter, 0 to 100, drawn beside energy. It fills while a
hostile machine is on screen and you are not casting, faster if you are also not
moving. It drains when you cast. At 0, the Witness's actives fizzle. They do not
deal "a little damage." They do nothing, and the float text says the page is
blank. This is the opposite of every current class, all of which want the button
pressed.

The Witness does not summon, does not stealth, does not radiate an aura, and has
no element. Damage is Impact, except for one skill that lends a single swing of
Sound to somebody else. Life is the lowest in the roster (draft: 80, plus 11 a
level). Move speed ordinary. Melee weak. The class is a mistake in a solo Act I
and a reason to have a party in Act III. That is acceptable. Do not quietly give
them a clearing skill so solo feels better. The solo path is column B, The Page,
which is a slow single-target kit, and it should be viable and dull, not flashy.

| i | Skill | What it does |
|---|---|---|
| 0 | **Look** | Active, cheap, no record cost. Apply Testimony to one machine. Testimony is a stack that grows while you can see them and are not casting. |
| 1 | **The Sentence** | Active. Spend record. Delay that machine's next attack. Low record, short delay. |
| 2 | **Margin** | Passive. The Record fills faster below half life. |
| 3 | **Cross-reference** | Active. Spend record. The last attack that machine made is copied onto another machine you have Testimony on. |
| 4 | **Pull the Thread** | Active. Spend most of the record. One heavy Impact hit. The damage is the Testimony on the target, not your weapon. |
| 5 | **Filed** | Passive. Testimony does not decay for a few seconds after the machine leaves the screen. |
| 6 | **Correction** | Active, once per district. Spend the whole record to undo the last hit you took. It restores the life you lost on that hit, not a percentage of your maximum. An empty record cannot correct anything. |
| 7 | **Redaction** | Active. Spend record. For two seconds machines can see you and cannot land a blow. This is not stealth: they still path toward you. |
| 8 | **The Footnote** | Passive. Each point raises the rate the Record fills, and lowers your maximum life. The tooltip states the life cost. |
| 9 | **On the Record** | Active. A machine with high Testimony takes more damage from everyone, including party members who have no points in this class. This is the party skill. |
| 10 | **Unnamed Source** | Active. Grant one ally, or your hireling, a single swing that deals Sound. Then it is gone. The Witness never deals Sound themselves. |
| 11 | **Colophon** | Passive. When your Record is above 80 you take less damage. When it is below 20 you take more. The meter is the defence. |
| 12 | **Publish** | Active. Consume all Testimony on screen. Damage equals how long you watched. Record resets to 0 afterwards. The big button, and it leaves you empty. |
| 13 | **Named Party** | Passive. Allies in your party gain a small damage bonus against machines you have Testimony on. You do not gain it. |
| 14 | **Retraction** | Passive. If you would die with Record above 80, you instead drop to 1 life, the Record hits 0, and Retraction cannot happen again for a long time. If you would die with an empty Record, you die. Risk priced against the resource, not a flat 30% save. |

Weapon family: **Notebook**. Bases: Stub Pencil, Court Pad, Bound Minutes, The
Seventh Part. The last one is a nod to an item the story already has; do not make
the unique require the story item. Perk draft: the Record fills a little faster,
and Testimony stacks one higher. Not damage.

Doctrines:

- **Stringer.** Record fills faster, maximum life down further.
- **Editor.** Casts cost less record, Testimony stacks slower.
- **Corrections desk.** Correction and Retraction recover more, and your damage is worse.

Builds: a solo Page build (The Sentence, Pull the Thread, Correction), a party
build (Look, On the Record, Named Party, Unnamed Source), and a risky Retraction
build that wants to sit at high Record and low life. All three have to be playable
with the passive cap.

UI: the Record is a third number, and the HUD is already crowded on a phone. Put
it as a thin bar under the energy orb, not as a third orb. Hide it when the class
is not the Witness, including when a rendered companion is the Witness and you are
not. The companion's Record ticks on its own; do not show two bars.

`cast` currently refuses on low energy only. The Witness refusal is low Record,
and it has to be a different toast ("The page is blank") so players do not buy
energy gear to fix it.

### Checklist

The same eleven items as the Homesteader, with `CLS.witness`, `SKF.witness`,
`SKT` left as Impact on purpose, `DOCS`, `BUILDS`, `calc()` for the three
passives that are stats, a `drawPlayer` branch (a person, a coat, a notebook — no
weapon glow), `FAM.notebook`, two uniques. Plus the Record meter, which is new
code in the HUD (`src/p4.js`) and in `update`. The meter is the risky part of the
milestone. Ship the class only when the meter fills, drains, and fizzles an active
at 0, in a test.

### Testing milestone 2

- Record stays 0 if no machine is on screen. It rises when one is, and `attack`
  or a cast stops the rise for that tick.
- Pull the Thread at 0 record does no damage and does not start a cooldown.
- On the Record increases the damage a second `__g`-driven hit deals, not only the
  Witness's hit. The second hit can be a hireling or a direct `hit()` call with
  the flag set. Do not require two browsers for this.
- Retraction saves you above 80 and does not save you at 0. Assert both.
- Unnamed Source does not change the Witness's own damage type.
- Smoke, sheet, shapeShift, as in milestone 1.

## Milestone 3 — the social store

No client work in this milestone. A module and tests. The page does not change.

### What not to do

Do not add a document route that accepts a uid. Do not store friend rows under
`data/docs/<uid>/`, because `docs.dump` is the emailed backup and a friend's
mailbox does not belong in someone else's backup, and because a future "let me
pass an id" bug would punch the hole the tests exist to prevent. Do not hang
friends off the `live` player object.

### What to add

`server/lib/social.js`, using `Table` from `store.js`. Two tables:

**`friends.json`**, one row per account uid.

```
{
  to: { "<uid>": { name, at, state } }
}
```

`state` is `pending` (I asked), `in` (they asked me), `friend`, or `blocked`.
Cap the `friend` plus `pending` count at 25, the same mechanical limit the
researched list used. Blocks do not count toward the 25. Mutual presence requires
`friend` on both rows, which means both accepted. This is more consent than the
1.08 one-way add, on purpose: this server is meant to be postable publicly, and a
one-way add puts a stranger onto someone's social surface. The divergence is the
accept step. Presence rules still match the research: you learn which game a
friend is in only when the friendship is mutual. Otherwise the list says nothing
about where they are.

**`mail.json`**, one row per recipient uid.

```
{ box: [ { id, from, fromName, text, at, read } ] }
```

Cap 40 messages, 240 characters, drop anything older than 30 days on read and on
login. 1.08 has no documented offline whisper store. This project adds one,
because a phone-browser player is not always in a game, and a whisper into the
void is a bug. Say that in the UI later: "They are not on. Left in their box."

Blocked is the persistent ignore. The existing mute (`mpMute`) is per session and
dies with the page. Keep mute. Block survives restart, suppresses whisper, mail,
friend request and party invite, and is not announced to the blocked person. A
probe of "does this name exist" and "did this person block me" must return the
same sentence, so the list cannot be used as a directory. `findByName` is the
lookup. The handler projects `{ name }` and nothing else. A test asserts the
response has no `pass`, no `hash`, no `email`, and no document.

`deleteUser` (`server/lib/auth.js:140`) currently kills sessions, deletes that
uid's documents, and deletes the user row. It must also call `social.purge`:
remove their friends row, remove their uid from everyone else's `to` map, delete
their mailbox. A deleted account's name can be re-registered later. Purge by uid,
not by name, so the new person does not inherit the old person's friends. Add a
test that registers the same name again and sees an empty list.

Rate limit with the existing `rateLimit`: friend requests, mail sends. Draft: 10
requests and 10 mails per 10 minutes per account.

HTTP routes, session and CSRF exactly like the document routes:

- `POST /api/friend/list`
- `POST /api/friend/ask` with a name
- `POST /api/friend/answer` accept or decline
- `POST /api/friend/remove`
- `POST /api/friend/block`
- `POST /api/mail/list`
- `POST /api/mail/send` with a name and a text, only if they are a friend and not
  blocked, and only if they are offline. Online delivery is milestone 5 and goes
  over the socket, not into the box.
- `POST /api/mail/read` and `/api/mail/del`

`/api/doc/get`, `/api/doc/set` and `/api/doc/del` are not modified.

### Testing milestone 3

New file `server/test/social.js`, run with the other server suites.

- Ask, accept, list. Both sides see `friend`. A third account sees nothing.
- Ask when the name does not exist. Ask when you are blocked. Same response body.
- The 26th friend is refused.
- Vale still cannot read Gramps's `hero1`. Re-run `server/test/run.js`. Do not
  weaken that assertion to make the new routes convenient.
- A friend response fixture contains no password field. Build the fixture from a
  real `createUser`, not a stub record.
- Delete the account. The other side's list no longer contains the uid. A new
  account with the same name has no friends and no mail.
- Restart is free: `Table` loads from disk. Write a row, construct a new `Table`
  against the same `DATA_DIR`, read it back. That is the test that this is not
  another Map in `live.js`.
- Mail over 240 characters is refused. The 41st message drops the oldest.

## Milestone 4 — the friends list on the page

The multiplayer panel is three builders (`mpPanel`, `mpLobbyPanel`, `mpGamePanel`)
and one click handler (`mpClick`), dispatched from the sheet. Add a friends
section to the party sheet rather than a new top-level menu. When the account
server is not configured, the section says so, in the same voice as the existing
"not connected" paragraph. The artifact build and `file://` stay inert.

Presence is pushed over the existing socket. On connect, and when a friend starts
or leaves a game, the server sends each mutual online friend a projection:
`{ uid, name, online, cls, lvl, gameName }`. `gameName` is omitted unless mutual.
A pending request sends a one-line system message, because social acts are visible
to their subject. No polling of `users`. The friends row has at most 25 uids;
resolve those through `live.get` and stop.

Joining a friend's game uses the existing `game.join`. If the game is passworded,
the client already knows how to ask for a password. If the game is full, say so.
If the friend is in a game that has fallen off the newest-60 lobby, joining by id
must still work. Check `game.join` for an assumption that the game was on the
lobby list, and remove that assumption if it exists. Do not add lobby search.

### Testing milestone 4

Extend `server/test/live.js` with two browsers, the way that file already works.

- A and B become friends through the HTTP routes, then both connect. Each sees the
  other's class and level.
- B has not accepted. A sees B as a pending name and does not see B's game.
- A blocks B. B's invite does not arrive. B is not told about the block.
- Restart the server process. Reconnect. The friendship is still there. The game
  they were in is not, which is the existing and correct behaviour.
- A client sends `/api/doc/get` for a document id it learned from a friend
  response. It still fails. Friends responses must not contain document ids in the
  first place; assert they do not.

## Milestone 5 — whispers and the offline box

Online whisper: a socket message `whisper`, delivered to `live.get(uid)` if that
player is connected, not written to `mail`. The sender sees "delivered." Offline:
`mail.send`, and the sender sees "left in their box." A whisper to a blocked
person gets the same not-delivered line as a whisper to a name that does not
exist.

Whispers are not game chat. They do not go into the 120-line client chat buffer
that everyone in the game can scroll. They get a separate short log on the friends
section, last 30, client-side only. The server does not keep online whispers. The
server does keep the offline box, which is the point of milestone 3.

`/away` and `/dnd` are slash commands this game does not have. A single toggle on
the friends section, "Not taking messages," stored on the user's own friends row
as a flag, drops whispers and mail with a distinct reply to the sender ("They are
not taking messages") that does not reveal whether they are online. Persistent,
unlike a session away-flag, because the page reloads constantly on a phone.

Party invite from a friend who is in another game: the invite names the game, and
accepting joins that game if there is room. It does not pull them into your party
across a game boundary. Party is still inside one game. This is the 1.08 shape and
the current code's shape. Do not invent cross-game parties.

### Testing milestone 5

- Two browsers, both online. Whisper arrives, mail box stays empty.
- One browser disconnects. Whisper becomes a mail row. Reconnect. The box lists it.
  Mark read. It is read after a process restart.
- Not-taking-messages suppresses both paths.
- A third browser that is not a friend cannot whisper. Same failure as a bad name.
- Rate limit: the 11th mail inside the window is refused, and the test clock is
  the existing rate-limit window, not a sleep of ten minutes.

## Milestone 6 — party dynamics

Separate from friends, and last, because it changes numbers. Do not bundle it into
a social commit. The comment above `PARTY_BONUS` in `server/lib/live.js:28` says
it is Diablo II's party experience multiplier. It is not. 1.08 used a flat +35%
pool and a level-weighted split, and there is no party-size bonus table. The
comment gets corrected in the same commit as the formula.

### Experience

Today (`server/lib/live.js:329`): the killer's client has already kept the full
experience in `gainXp`, and the server additionally pays every other member
`amount * PARTY_BONUS[n] * level / sum(levels)`. The killer is in the sum and not
in the payout. Two same-level players produce 1.75× the monster's experience in
total. Eight produce about 3.6×, on top of `gameScale`, which has already
multiplied the monster's experience by `(players+1)/2`.

Replace it with one pool:

```
pool = amount * 1.35
share(member) = round(pool * member.level / sum(levels))
```

The killer is in the split. The killer's client must add only its share, not the
full amount plus a share. The honest way, given the server is not authoritative
over kills: the client still reports the monster's base experience, the server
computes every share including the killer's, and the client applies the share it
is sent rather than the value it had locally. A modified client can still lie
about the base amount. This milestone does not fix that, and the test should not
pretend it did.

Then, as its own commit after the pool is in and measured: the level-difference
curve. A member within 5 levels of the monster gets the full share. The share
slides down from 6 to 10 levels and floors at 5%. Do not invent a penalty past
level 70. If measurement says the floor feels spiteful at this game's party
sizes, revert this commit and keep the flat pool. The pool is the part that
matches the research. The curve is the part to be willing to lose.

`gameScale` stays. Monster life and experience already follow `(players+1)/2`,
counting people in the game, not the party. That is correct and it is already
tested. Do not retune `DIFFS`.

### Drops

1.08 increased how often something dropped, never how good it was. This game has
no such curve. `dropFrom` (`src/p2.js:161`) rolls `no` / `gold` / `item` / `stim`
by weight, and `qChance` decides quality with a diminishing magic-find curve that
should not be touched.

Add a no-drop reduction based on how many party members are in the same district
as the kill. People in the game but not the district count as half, added in
pairs, which is the researched rule. Apply it to the `no` weight only. `qChance`,
unique odds, and set odds stay. Because loot is client-side, this is an honest
client's behaviour. Write that limitation in the commit message. Do not move loot
onto the server in this milestone.

The single-player rendered companion has its own pressure (`partyH`, `partyD`,
`partyKill` in `src/p10.js`). That is not this system. Do not change those
numbers here.

### Hostility

What exists: declare from the roster anywhere, either side's flag is enough to
fight (`mutualHostile` is an OR), the declaration is irreversible until somebody
leaves the game, towns are safe, entering a district grants five seconds of grace,
and declaring against a party member drops you from the party. Neutral players are
not targets, because stand-ins are only inserted for hostiles.

What to add, as one commit, adapted to a roster button rather than a slash command:

- The server rejects a declaration from outside `TOWNS`. The button can stay
  visible. The refusal tells you to do it in town.
- Both characters must be level 9 or higher.
- Once per minute per target. The timestamp lives on the `live` player. It does
  not need to survive a restart, because hostility itself does not.
- A town-only **stand down** removes your flag and not theirs. They can still hit
  you. You cannot hit them until you declare again. This is the asymmetry the
  current OR already implies and then refuses to let you use, because there is no
  way to clear your own flag.
- The declarer's client clears their own portal and refuses `usePortal` for ten
  seconds. The server also ignores that player's zone-leave for ten seconds, so
  they are not a legal combatant in a new district on the server's view. A
  modified client can ignore the local half. Say so. Do not build server-side
  movement authority to prevent it.

What not to add:

- Chain hostility to the target's whole party. Pickup groups on a public server
  turn that into a gank. 1.08 had it. We are leaving it out, on purpose.
- Ear drops, gold splitting, a change to `PVP_SCALE`.
- A friends-only hostility exception. Friends can still declare. The party screen
  remains the place it happens, and the friend sees the line.

### Testing milestone 6

`server/test/games.js` already asserts the current scale numbers. Update those
assertions in the same commit, and quote the old and new totals in the commit
message so the change is reviewable.

- One reported kill, two same-level members. Sum of experience delivered, including
  the killer, is 1.35× the report, not 1.75×.
- Eight same-level members. The sum is still 1.35×, not ~3.6×.
- A member 10 levels below the monster receives 5% of their share after the curve
  commit, and the full share before it. Two commits, two assertions.
- A drop roll with party size 1 and party size 8, same seed, same `qChance` inputs.
  Quality odds are equal. The `no` weight is not.
- Declare outside town. Refused. Declare in town below level 9. Refused. Declare,
  stand down, assert you cannot damage them and they can damage you. Declare twice
  inside a minute. The second is refused.

Measure Acts III–V separately, with the balance bot, before believing any of the
draft skill numbers in milestones 0–2. Milestone 6's experience change will move
those measurements. Run the bot before and after, and keep both reports.

## Sequencing

Serial, because one person will do this and the steps share files.

| Order | Milestone | Ships when | Depends on |
|---|---|---|---|
| 1 | 0, six commits | Each class's rows 4–5 are real, old ticks cannot double-fire, refund works | Nothing |
| 2 | 1 Homesteader | On the title screen, forms exclude columns, flock leashes | 0, so there is no boon loop to join |
| 3 | 2 Witness | Record meter fizzles an empty cast | 0, for the same reason. Not on 1. |
| 4 | 3 social store | Tests pass, document isolation unchanged | Nothing in the client. Can start any time after 0 is understood. Do not start it in the middle of a class commit. |
| 5 | 4 friends on the sheet | Two browsers see mutual presence and not pending presence | 3 |
| 6 | 5 whisper and mail | Offline message survives a restart | 4 |
| 7 | 6 party numbers | Old and new experience totals are in the commit message | None of the class work. Last so the measurement is of the game people will actually play. |

Milestones 1 and 2 are not required for 3–5. If a session has to choose, finish
the class currently in progress, then do social store before starting the next
class. A half-migrated boon loop is the most expensive place to stop.

## Risks

- **Double-dip.** Shipping a new skill 9 without guarding `sl(9)` in `update`
  leaves the old bolt in the game under a new name. The guard is part of the
  commit, not a follow-up.
- **The refund firing twice**, or firing on a class whose rows 1–3 were touched.
  The flag and the index range are the whole safety. Test both.
- **A new class added to `CLS` before its `BN` key exists.** Blank page. Milestone
  0 removes the trap. Until that commit, the checklist includes `BN` and `BN3`.
- **`const` arrow functions called from an earlier file.** The bundle is one
  scope. A function declaration hoists. A `const` does not. `maxiOn` is a
  declaration for this reason. New code that an earlier file calls at load has to
  be a declaration too.
- **Aura generalisation.** The Homesteader's plots will look enough like auras
  that a later change will want `maxiSet` to become a framework. Plots are placed
  objects with positions. Auras are a mode on the player. Keep them different.
- **The Witness in solo.** The class will feel bad in Act I if someone expects a
  clearer. That is the design. The failure mode to watch for is a quiet buff that
  gives them a screen clear "just so the early game works." Do not take that patch.
- **Document isolation.** The convenient implementation of "show my friend's gear"
  is a cross-account doc read. Do not build it. Presence is a projection computed
  by the server from `live`. Gear, saves, and the lockbox stay inside one uid.
- **`findByName` leaking the user record.** Easy to forward the return value into
  `ok(res, user)`. The test that the body has no `pass` field is the mitigation.
  Write the test first.
- **Party experience feeling worse and being reverted angrily.** The current curve
  is much more generous than 1.08. Players who liked eight-person games will feel
  the cut. Ship it alone, with the numbers in the message, so it can be reverted
  without reverting friends.
- **Client-authoritative loot and damage.** Drop frequency and the ten-second
  hostility lockout are honest-client behaviours. Do not describe them as
  enforced. `MULTIPLAYER.md` already states the server's real authority. Update
  it when the social features land, in the same milestone, so the document does
  not keep saying there is no friends list.
- **Balance numbers in this document.** Every damage figure above is a draft in
  the range of the current row-3 skills. Acts III–V have never been measured.
  Implement the behaviour, leave the constants obvious, and change them only in a
  commit that says what the bot measured.

## Out of scope

- Ladder seasons, `/players X`, runewords on the 1.10 list, and skill synergies.
  All of those are later than 1.08, and the first three are not this game's systems
  anyway. The six seed-word phrases and the one set family are thin, and thickening
  them is a separate plan.
- A general aura framework.
- Cross-game parties, guilds, a player directory, lobby search, trading, an
  auction house, real sats over Lightning.
- Server authority over monsters, loot, or damage.
- Removing Sister Null or `shapeShift`.
- Retuning `DIFFS`, `PVP_SCALE`, companion party pressure, or boss4 / boss5 in the
  same work as any milestone here.

## Per-class checklist, condensed

Use this as the commit template for the Homesteader, the Witness, and any class
after them.

1. `CLS` — 15 authored skills, no `boon` field. `src/p1.js`.
2. `SKF` — a function for every index with `a:1`. `src/p2.js`.
3. `SKT` — an entry wherever the type is not Impact. `src/p10.js`.
4. `DOCS` — three doctrines. `src/p10.js`.
5. `BUILDS` — three plans whose indices exist on this class. `src/p10.js`.
6. `calc()` — a branch for every passive that changes a stat. `src/p2.js`.
7. `drawPlayer` — a silhouette that is not another class's with a new colour. `src/p3.js`.
8. `FAM` — a weapon family. `src/p10.js`.
9. `UNI` — two class uniques. `src/p1.js` or the `UNI.push` in `src/p10.js`.
10. `SKS` — cast sounds. `src/p2.js`. Optional, expected.
11. Boot — the class is not in `BN` or `BN3`, because those are gone. If they are not gone yet, both keys exist.
12. Sheet — skills, doctrines and builds render. `shapeShift` onto the class with a named build, with "I will assign," and back off it.
13. Companion — a rendered copy can cast its first active through the existing `SKF` proxy.
14. Smoke — `node tools/smoke.js` still walks every district.
