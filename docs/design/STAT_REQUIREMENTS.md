# Stat requirements

Plan only. Nothing in this note is in the game yet. It describes the stack tip at `8e607af` (PR #119, `cursor/menu-tabs-3941`) and a first guess at Diablo 2-style requirements on weapons and armor. The damage side of the same decision is in [STAT_SCALING.md](STAT_SCALING.md). Ship them together or not at all: a Might requirement on a maul is only a real choice if Might is what makes the Scrapper hit, and Bandwidth is what makes the Technomancer hit.

Numbers below are a first guess, in the same spirit as the first repair prices. They are not tuned.

## What exists now

### Attributes

Four stats, all starting at 0. Spent points live on `G.at`. Gear can add more through the affixes `+Might`, `+Reflex`, `+Vitality`, and `+Bandwidth`. The sheet adds spent and gear together.

| Key | Name | What a point does today | Same for every class |
|---|---|---|---|
| `mgt` | Might | +1.5% damage | Yes |
| `ref` | Reflex | +0.3% deadly strike, and +1 armor | Yes |
| `vit` | Vitality | +4 life, before class life multipliers | Yes |
| `bnd` | Bandwidth | +3 maximum energy. Spent Bandwidth also regenerates 0.05 energy per second. Gear Bandwidth raises the pool and does not add that regen. | Yes |

A level gives five attribute points, one skill point, and one web point. The web is a separate tree. It is not an attribute. Level 1 starts with nothing to spend, so a character of level L has `5 * (L - 1)` points from levels.

The level cap is 25 until Act II, 50 until Act III, 75 until Act IV, 90 until Act V, then 100. Past the cap, further experience is paragon: +1% damage per paragon level, not an attribute point.

Sister Null, and one side job, also hand out attribute points:

| Source | Points |
|---|---|
| Sister Null after Auditor Prime (`q4`) | +5 |
| Sister Null after Eden (`q7`) | +5 |
| Safe Passage (Tam) | +5 |
| Sister Null after Defrag Prime (`q14`) | +5 |
| Sister Null, `q17` | +5 |
| Sister Null, `q23` | +5 |
| The Ines side job | +3 |

A Normal clear that has spoken to Null for the three act turn-ins has about 220 points at level 42 (`5 * 41`, plus 15). Safe Passage and Ines add another 8. The two late Null visits add 10 more, so a character who has finished the book is about 33 points above the level curve. Hard mid-60s is about 320 from levels. Brutal 80 is about 395 from levels.

Sister Null's "Unlearn skills and attributes" refunds every spent point into `G.ap` and sets all four stats to 0. It does not take gear off. Class shift at the rig does the same refund, then spends the pool from the chosen build's percentages. Those percentages are in `BUILDS` (see the scaling note). A random shift puts about 45% into Vitality for a melee class and into Might otherwise.

There is no strength, no dexterity, no separate attack rating, and no shield block. Reflex is the only accuracy-shaped stat, and it is a deadly-strike chance, not a chance to hit.

### Level requirements, and nothing else

Every generated item stores `req = max(1, floor(il * 0.75))`. Uniques use the unique's own item level for that floor, not the monster level they dropped at. Charms use the same floor. Old subscription slips migrated into charms are forced to `req: 1`.

The gate is level only. `equipFromBag` toasts "Needs level N" and refuses. `canWear` is "identified, not a charm, has a slot, and `G.lvl >= req`". The upgrade arrow requires `canWear` and a strict improvement. `equipBest` skips anything over the character's level. The item card prints `Required Level` in red when the level is short. Compare bails out before the stat rows and says "Needs level N. Your sheet does not change."

Nothing on an item asks for Might, Reflex, Vitality, or Bandwidth. `calc()` does not look at `req` at all. If a piece is equipped, it works, unless it is broken (durability 0) or it is a class-gated unique in the wrong hands. A respec to zero attributes does not unequip anything and does not turn anything off, because there is nothing to fail.

The pack tile does not turn red for a level you cannot meet. Red on a tile today means broken. Yellow means durability at or under 25%.

### Bases and tiers

`tierOf(il)` is four bands, not three: item level under 7, under 15, under 22, and everything else. Tier 3 therefore covers a level-22 sceptre and a level-70 unique with the same base row. Any requirement that is flat per tier will be free for the entire endgame once one tier-3 piece is wearable. The curve below scales with item level inside the band.

Weapons, one slot. Speed at or under −15 is two-handed (`itemHands`): one weapon, and the off-hand slot is not a second weapon.

| Band | Neutral (damage ×1, speed 0) | Heavy (×1.35, speed −20) | Fast (×0.75, speed +25) |
|---|---|---|---|
| 0 | Bent Rebar | Stop Sign | Box Cutter |
| 1 | Signal Baton | Girder Maul | Mono Blade |
| 2 | Arc Sceptre | Wrecking Hammer | Phase Razor |
| 3 | Null Sceptre | Titan Maul | Void Razor |

Weapon damage is `round((3 + 1.6 * il) * factor)` to `round((6 + 2.6 * il) * factor)`. Armor is `round(base + perLevel * il)` with helm 2+1, body 3+1.5, gloves 1+0.6, boots 1+0.6, belt 1+0.5.

Bodies come in a lighter and a heavier name at each band: Hi-Vis Vest / Padded Hoodie, Flak Coat / Courier Mail, Exo Plate / Aegis Shell, Seraph Plate / Cloud Mantle. Helms: Hard Hat, Riot Helm, Praetor Visor, Halo Circuit. Gloves: Work Gloves, Rivet Gauntlets, Servo Fists, Graviton Fists. Boots: Worn Sneakers, Steel-Toes, Mag Greaves, Skywalkers. Belts: Zip-Tie Sash, Tool Belt, Power Girdle, Orbit Girdle. Rings and amulets: Copper Band through Halo Band, Lanyard through Cloud Core.

Seven class families replace the weapon name for a matching wanderer: Sign (Scrapper, heavy), Deck (Technomancer), Launcher (Runner, fast, and the Last-Mile Cannon), Shiv (Anon), Instrument (Founder), Graft (Homesteader), Notebook (Witness). The Maximalist has no family and uses the ordinary bases. Force Majeure is a cannon. Remote Hands is a Zero-Day Rig. Those names are not in the four-by-three table; a fixed unique whose base name is missing falls through to the top of the slot.

Quality is normal, magic, rare, set, unique. Magic and rare roll affixes. The only set is The Striker's Vigil (Placard, Hard Hat, Boots). Uniques set their level requirement from their own item level. There is no affix that lowers a requirement. The stat affixes add Might, Reflex, Vitality, or Bandwidth; they do not change `req`.

### Mercs, charms, loaner, saves

A hireling wears a weapon, helm, and armor. `mercStats` uses the hireling's level, a type multiplier, half the weapon's average damage, and the armor value. The hireling has no attributes. Merc compare does not check the player's level. Merc gear is not durability-stamped.

Charms are not a body slot. They sit on the belt. They already have a level requirement, and `charmApply` skips one the character is under. They grant nothing in the pack.

The loaner weapon is a plain indestructible weapon of item level 1–3, created when a corpse takes the real weapon. It has an ordinary level requirement of 1.

Saves are `G.v: 2`. Items store `req` as a number. Missing attributes are filled with 0 on load. There is no field for a stat requirement. Old saves stay valid if new fields default to "no requirement."

## Proposal

Might stands in for strength. Reflex stands in for dexterity. Vitality and Bandwidth are never a requirement. They are what you spent the points on instead.

Level requirements stay `max(1, floor(il * 0.75))`. They are not raised to do this job. A piece can fail level, or Might, or Reflex, or more than one.

### Curves

All figures are before the unique bump. Round to the nearest integer. A result under 1 on a weapon or armor piece becomes 0, except the loaner, which is always 0.

| Role | Might | Reflex |
|---|---|---|
| Heavy weapon (the maul line, and Sign) | `8 + il * 1.6` | 0 |
| Neutral weapon (the sceptre line, Graft) | `4 + il * 0.9` | 0 |
| Fast weapon (the razor line, Launcher) | 0 | `6 + il * 1.35` |
| Shiv | 0 | `4 + il * 0.7` |
| Deck, Instrument | 0 Might. Bandwidth `4 + il * 0.9` | 0 |
| Notebook | half of the neutral Might curve | 0 |
| Light body (vest, hoodie, courier mail, aegis, cloud mantle) | `il * 0.45` | 0 |
| Heavy body (flak, exo, seraph) | `6 + il * 1.15` | 0 |
| Helm | 60% of the heavy body | 0 |
| Gloves, belt | 40% of the neutral weapon | 0 |
| Steel-toes, mag greaves | 40% of the heavy weapon | 0 |
| Sneakers, skywalkers | 0 | `il * 0.35` |
| Rings, amulets, charms | none | none |

Deck and Instrument ask for Bandwidth so a Technomancer or Founder who spent their points on Bandwidth can hold the class weapon. They do not also ask for Might. Notebook stays on a shallow Might curve so the page build, which is mostly Vitality, can still hold a pencil. Plate and mauls stay on Might so that same build cannot also wear the Scrapper's endgame.

### Magic, rare, unique, set

Magic and rare inherit the base. They do not roll a higher requirement.

Uniques and set pieces take the same curve from their item level and base, then add 10%. Force Majeure and The Indemnity in the table below already include that. A unique with `+Might` or `+Bandwidth` on itself still uses that raised bar; the added stat counts toward meeting it, as in the next section.

### What counts

Spent points, stats on gear that is already worn, stats on the piece being put on, and charms on the belt. The pack does not count. Unspent points do not count. A broken piece contributes neither its stats nor its armor.

This matches the usual Diablo 2 rule that the item's own bonus counts and that taking the bonus off (a charm, a respec) can leave you short.

### When you no longer qualify

Keep the piece equipped. It grants nothing: no damage, no armor, no affixes, no family perk. The card shows the failed lines in red. The tile gets a red tint, distinct from the broken mark (broken is already red durability; a failed requirement tints the whole cell). Compare does what it already does for level: no imagined sheet, and one line, "Can't equip. Need +12 Might." If both stats fail, name both. If the level fails too, name the level first.

Do not drop the piece into the pack. The pack may be full, the piece may be on a corpse, and a respec should not delete a maul.

New equips still refuse, as level already refuses, with the same sentence.

The loaner stays at zero so a walk back to the body can still swing. Charms that fail their level already grant nothing; they do not grow a Might requirement.

### Class identity

The pressure is the point. A build that puts roughly half its points into the stat on the gear wears that gear at the level targets below. A build that puts those points into Vitality wears the light line and the class weapon, and does not wear plate.

Read with the scaling note: after that change, the natural spend is not "everyone puts half into Might."

| Class | Natural body and weapon | Stat that has to be spent |
|---|---|---|
| Scrapper | Sign, mauls, plate | Might |
| Technomancer | Deck, mantle, not plate | Bandwidth on the deck, a little Might on the mantle |
| Runner | Launcher, razors, sneakers | Reflex, a little Might if they touch a heavier coat |
| Anon | Shiv | A shallow Reflex bar, so the demolition build still holds a knife |
| Founder | Instrument, mantle | Bandwidth on the pager, light Might on the coat |
| Homesteader | Graft, mid plate if they bought Might | Might |
| Witness | Notebook, mantle | Shallow Might. Plate does not fit the page build |
| The Maximalist | Mauls, plate | Might |

### Requirement-reducing affixes

Not in the first version. The trade against Vitality only exists if the bar is real. A later affix, sparse, on jewels or one unique, can wait until the curve has been worn in. Diablo 2 had a few such mods. They were not the thing that made the requirements matter.

### Mercs

Hirelings have no Might and no Reflex. Merc gear keeps a level requirement and does not take the new curves. Handing a Titan Maul to a Bodyguard does not ask the player to have the Might, and does not ask the hireling either. The alternative, listed below, is to let the player's stats gate merc gear. That double-gates the Scrapper and does not match a hireling who is not the player.

### PvP and co-op

The check is local, inside `calc()`, like the rest of the sheet. The server does not see it. A red weapon is the naked 2–4 damage range. Party members see a weaker sheet, which is already how a broken weapon works.

A class shift keeps the gear and refunds the stats. If the new build's spend does not meet the gear, those pieces go red under the rule above. The shift card should say so before the sats are spent: "The Titan Maul will go quiet. Need +40 Might." The rig's planned builds should be able to wear what they are holding, or the warning is the whole UI.

A duel in the simulator still drops nothing. Respec is Sister Null, in town. Walking into a duel with a red weapon is the player's choice.

### Mobile

The phone sheet is already tabbed. The item card is not, and should not be: the requirement lines belong on the first screen of the card, under the level line, in the same red. There is no hover. The tint on the tile and the line on the card are the whole signal. Compare already has a one-line note under the columns. "Can't equip. Need +12 Might." fits there. Do not add a second sheet.

### Balance targets

Signature spend, after the template moves in the scaling note, at the three character targets. "Wears" means the natural family weapon and the natural body, not every base in the band.

| Target | Points in hand | What has to be true |
|---|---|---|
| Normal 40–45 | about 205 from levels, about 220 once Null has paid the three act gifts | Each class wears its family weapon and a light or matching body. Mauls and plate fit Scrapper and Maximalist. They do not fit the page build. |
| Hard mid-60s | about 320 from levels, gifts on top | A half-spend in the driving stat wears tier-3 bases around item level 55. A pure Vitality spend does not. |
| Brutal 75–85 | about 395 from levels, up to about 430 with every gift | The top uniques fit the class they were written for. The Indemnity fits a Might build. Force Majeure fits a Reflex build. A pencil still fits a Witness. |

Worked check at level 42 with 220 points:

| Build | Driving points | Asks | Fits |
|---|---|---|---|
| Scrapper, half Might (110) | Titan Maul at il 40 wants 72. Seraph wants 52. | Yes |
| Maximalist, 45% Might (99) | Same maul and plate | Yes |
| Technomancer, half Bandwidth (110) and 15% Might (33) | Deck wants about 40 Bandwidth. Cloud Mantle wants 18 Might. | Yes. A Null Sceptre wants 40 Might, so the deck is the weapon, not the sceptre. |
| Runner, half Reflex (110) and 15% Might (33) | Void Razor wants 60 Reflex. Mantle wants 18 Might. | Yes |
| Anon demolition, 20% Reflex (44) | Shiv at il 40 wants 32 Reflex | Yes |
| Founder headcount, 45% Bandwidth (99) and 20% Might (44) | Instrument wants about 40 Bandwidth. Mantle wants 18 Might. Seraph wants 52, so the iron build (30% Might, 66) wears plate and the headcount build does not. | Yes |
| Homesteader cold bed, 25% Might (55) | Graft at il 40 wants 40. Seraph wants 52, so plate is just in reach and is the vitality trade. | Yes |
| Witness page, 20% Might (44), 55% Vitality | Notebook at il 40 wants about 20. Mantle wants 18. Seraph wants 52. | The page wears paper and a mantle, not plate. |

At Brutal 80 with about 428 points, 45% Might is about 193, against The Indemnity around 92. 10% Might on the glass Witness build is about 43, which still holds a notebook (half of neutral at il 70 is about 34) and does not hold that plate.

### Example bases

Level requirement is the current `floor(il * 0.75)` at the sample item level. Might and Reflex are the first-guess curve. Unique rows include the 10% bump.

| Piece | Band | Sample il | Level | Might | Reflex | Bandwidth |
|---|---|---|---|---|---|---|
| Bent Rebar | 0 | 3 | 2 | 7 | 0 | 0 |
| Stop Sign | 0 | 3 | 2 | 13 | 0 | 0 |
| Box Cutter | 0 | 3 | 2 | 0 | 10 | 0 |
| Signal Baton | 1 | 10 | 7 | 13 | 0 | 0 |
| Girder Maul | 1 | 10 | 7 | 24 | 0 | 0 |
| Mono Blade | 1 | 10 | 7 | 0 | 20 | 0 |
| Arc Sceptre | 2 | 18 | 13 | 20 | 0 | 0 |
| Wrecking Hammer | 2 | 18 | 13 | 37 | 0 | 0 |
| Phase Razor | 2 | 18 | 13 | 0 | 30 | 0 |
| Null Sceptre | 3 | 40 | 30 | 40 | 0 | 0 |
| Titan Maul | 3 | 40 | 30 | 72 | 0 | 0 |
| Void Razor | 3 | 40 | 30 | 0 | 60 | 0 |
| Hi-Vis Vest | 0 | 3 | 2 | 1 | 0 | 0 |
| Padded Hoodie | 0 | 6 | 4 | 3 | 0 | 0 |
| Flak Coat | 0 | 6 | 4 | 13 | 0 | 0 |
| Exo Plate | 2 | 18 | 13 | 27 | 0 | 0 |
| Cloud Mantle | 3 | 40 | 30 | 18 | 0 | 0 |
| Seraph Plate | 3 | 40 | 30 | 52 | 0 | 0 |
| Halo Circuit | 3 | 40 | 30 | 31 | 0 | 0 |
| Worn Sneakers | 0 | 3 | 2 | 0 | 1 | 0 |
| Skywalkers | 3 | 40 | 30 | 0 | 14 | 0 |
| Orbit Girdle | 3 | 40 | 30 | 16 | 0 | 0 |
| Sign (Scrapper) | 3 | 40 | 30 | 72 | 0 | 0 |
| Deck (Technomancer) | 3 | 40 | 30 | 0 | 0 | 40 |
| Launcher (Runner) | 3 | 40 | 30 | 0 | 60 | 0 |
| Shiv (Anon) | 3 | 40 | 30 | 0 | 32 | 0 |
| Instrument (Founder) | 3 | 40 | 30 | 0 | 0 | 40 |
| Graft (Homesteader) | 3 | 40 | 30 | 40 | 0 | 0 |
| Notebook (Witness) | 3 | 40 | 30 | 20 | 0 | 0 |
| The Indemnity (Seraph Plate unique) | 3 | 68 | 51 | 92 | 0 | 0 |
| Force Majeure (cannon unique) | 3 | 70 | 52 | 0 | 111 | 0 |
| Copper Band, any charm | — | — | level only | 0 | 0 | 0 |
| Loaner | — | 1–3 | 1 | 0 | 0 | 0 |

## Recommendation

Add Might, Reflex, and, on Deck and Instrument only, Bandwidth requirements, on the curves above. Keep the level requirement as it is. Magic and rare inherit. Uniques and set pieces add 10%. Worn stats, the piece itself, and belt charms count. A piece you no longer qualify for stays equipped and grants nothing, with red type and a red tile. No reducing affix. Merc gear stays level-only. The loaner, jewelry, and charms stay as they are. The shift card names anything that will go quiet.

Do not stamp old saves. Items with no `reqMgt` / `reqRef` / `reqBnd` count as 0, so a character who loads an old file keeps wearing what they wore. New drops carry the fields. A later pass can stamp, once the curve is accepted.

## Alternative A — level requirements only, raised

Leave attributes out of gear. Raise `floor(il * 0.75)` so endgame bases simply need a higher level. Every class who reached the level can wear every base. There is no vitality trade. It does not need the scaling note. It also does not do the thing this plan is for.

## Alternative B — grandfather, do not go red

New equips refuse, as today. Anything already worn keeps working until it is taken off, even after a respec. Migration is safe and there is no red-item state to draw. A respec into Vitality keeps the maul's damage, so the trade never happens to gear you already own. Weaker than Alternative A's honesty problem, and weaker than the recommendation's.

## Decisions

1. Might for heavy gear, Reflex for fast gear, Bandwidth only on Deck and Instrument. Or Bandwidth stays off requirements entirely, and casters scrape together a little Might for a mantle.
2. Red and inert, or grandfather (Alternative B), or refuse to add stat requirements at all (Alternative A).
3. Whether the item's own stats, and belt charms, count. The recommendation says yes.
4. The 10% unique and set bump. Set it to zero and uniques are just their base.
5. Stamp old items on load, or leave them at zero until they drop again. The recommendation is leave them.
6. Merc gear stays level-only, or the player's stats gate it.
7. The shift warning is in the first version, or it waits.
8. These curves are the ones to implement, or they wait on a paper pass that only checks the table against the eight builds. The table is the pass. The fights are not.
