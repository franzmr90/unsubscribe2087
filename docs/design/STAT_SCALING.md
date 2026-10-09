# Stat scaling

Plan only. Nothing here changes combat. It is the other half of [STAT_REQUIREMENTS.md](STAT_REQUIREMENTS.md): if plate asks for Might, Might has to be what a Scrapper hits with, and it has to stop being what everyone hits with.

Read against the stack tip at `8e607af` (PR #119, `cursor/menu-tabs-3941`). Rates are a first guess.

## How damage, defense, and resources work today

One formula covers every class. `calc()` does this, then almost every blow multiplies weapon damage by it:

```
damage bonus = (spent Might + gear Might) * 1.5        // percent
deadly strike = 5 + other crit + (spent Reflex + gear Reflex) * 0.3
armor = (armor on gear * (1 + enhanced armor / 100) + flat armor + Reflex) * class multipliers
life = (class base + (level - 1) * life per level + Vitality * 4 + flat life) * class multipliers
energy = (50 + level * 2 + Bandwidth * 3 + flat energy) * (1 + energy percent, capped at 80%)
```

A basic swing rolls `dmin..dmax` on the weapon, multiplies by `(1 + damage bonus / 100)`, then by the class weapon factor below. Skills that call `hit` or `shoot` do the same, with the skill's own factor in place of the class factor, and with a further `+6%` per point in the skill three slots above (the previous row of the same column). That 6% is a local synergy. It is not Diablo 2's 1.10 synergy graph.

Shock damage on the weapon is added after the percent, and it scales with the skill factor, not with Might by itself.

Deadly strike doubles the blow by default (`critM` is 2). Each point of Reflex is `+0.3` chance to double. That is about `+0.3%` expected damage per point when the multiplier is 2. One hundred Reflex is about `+30%` expected damage. One hundred Might is `+150%` damage on every blow, crit or not. Reflex is also `+1` armor per point, and armor reduces a hit by `armor / (100 + armor)` before the class braces. The first points of armor matter more than the later ones.

Energy regen each second is `4 + gear regen + spent Bandwidth * 0.05`. Gear Bandwidth does not add the 0.05.

Paragon, past the level cap, adds `+1%` damage per level on top of Might. It is not an attribute.

### What does not use Might

- Pull the Thread, Publish, and Cross-reference. They call `witImpact` with a flat number. Thread is `Testimony * (4.6 + 0.5 * rank) * page * (1 + 0.42 * (level - 1))`. The card is right that the weapon is not consulted. Might is not consulted either.
- Acqui-hired machines. They strike with their own `raw` damage.
- Hirelings. `mercStats` is `(4 + 2.2 * level) * type multiplier + half the merc weapon's average`. No player attribute is in there.
- A rendered companion copies the sheet, so it does pick up the player's Might. That is the tag path, not the hireling path.

Founder interns, Homesteader plots and the flock, turrets, storms, mines, and most other summons call `hit` or `shoot`. They inherit the player's weapon range and the player's Might.

### Class weapon factor, life, and speed

The factor applies to the basic swing, not to skill coefficients. Life is the level-1 pool and the gain per level, before Vitality and before passive multipliers such as Iron Hide.

| Class | Swing | Factor | Interval | Base life | Life / level | Range |
|---|---|---|---|---|---|---|
| Scrapper | melee | 1.25 | 0.60 | 130 | 17 | close |
| Technomancer | ranged | 1.10 | 0.62 | 85 | 12 | bolt |
| Runner | ranged | 0.82 | 0.40 | 100 | 14 | throws |
| Anon | melee | 1.00 | 0.42 | 95 | 13 | knife |
| Founder | ranged | 0.70 | 0.60 | 102 | 13 | the workforce does the dying |
| Homesteader | ranged, melee in a chassis | 1.00 | 0.55 | 120 | 16 | plot, hull, or flock |
| Witness | melee | 0.92 | 0.68 | 102 | 13 | slow, on purpose |
| The Maximalist | melee | 1.20 | 0.50 | 118 | 15 | Sound, if the passive is up |

### What each attribute does to each class

The columns are the same for all eight. A point of Might on a Witness adds the same `+1.5%` as a point of Might on a Scrapper, including to Arc Chain, to an intern's swing, and to a mine. Bandwidth does not add damage to anything. Vitality does not add damage to anything.

| Class | Might on a swing or a skill that uses the weapon | Reflex | Vitality | Bandwidth |
|---|---|---|---|---|
| Scrapper | +1.5% on the swing and on Stop Sign, Hurl, Turnstile, Earthbreaker, Call the Strike | +0.3% deadly strike, +1 armor. Iron Hide multiplies armor again. | +4 life, then Iron Hide's life multiplier | +3 energy. The kit is cheap. |
| Technomancer | +1.5% on the bolt and on Arc Chain, Spark Lance, Null Nova, the turret, the storm, Botnet, Ground Fault, Packet Storm, Kill Dash Nine | +0.3% deadly strike. Zero Day adds more crit from the skill, not from Reflex. | +4 life on the smallest pool | +3 energy. Cipher Ward and the Arc Chain ward spend that pool to take hits. Overclock adds regen from the skill. |
| Runner | +1.5% on every throw, Scatter Shot, the decoy burst, Rush Order, Signed For, Return to Sender, Manifest | +0.3% deadly strike, +1 armor. Evasion and Route Knowledge are skills, not Reflex. | +4 life | +3 energy |
| Anon | +1.5% on the knife, Proxy Hop, mines, Zip Bomb, sockpuppets, Legion, Rehearsal, The Dump | +0.3% deadly strike, and OpSec adds more from the skill. The hop forces a deadly strike for one blow. | +4 life | +3 energy |
| Founder | +1.5% on the weak personal bolt, on Mech Suit slams, and on intern and contractor swings, because those call `hit` | +0.3% deadly strike, +1 armor | +4 life, then Equity's life multiplier | +3 energy. The summons cost energy. Their damage does not read Bandwidth. |
| Homesteader | +1.5% on shots, on hull and hound swings, and on plot and flock ticks | +0.3% deadly strike, +1 armor, then the hull and hound armor multipliers | +4 life on a large pool | +3 energy |
| Witness | +1.5% on the slow swing only. Look's Testimony bonus is a separate multiplier on that swing. Thread, Publish, and Cross-reference ignore Might. | +0.3% deadly strike, +1 armor | +4 life, then The Footnote can cut the pool | +3 energy. The page spends Record, not a large energy bar. |
| The Maximalist | +1.5% on the swing and on Tick Tock, Have Fun Staying Poor, the hammers, Cite Your Sources. Priced in Sound converts the result and keeps `55 + 3 * rank` percent of it. | +0.3% deadly strike, +1 armor, then Twenty-One Million multiplies armor | +4 life | +3 energy. Auras cost nothing. |

### Signature builds, and the bonus they actually bought

`BUILDS[].at` is `[Might, Reflex, Vitality, Bandwidth]` in percent. The rig spends the pool in that ratio. These are the first plan of each class, which is the one the game treats as the class.

Points at three targets, from levels only (`5 * (level - 1)`). The Null gifts add about 15 by the end of Act III and about 33 if every gift in the book is in. The bonus column uses level points only, at `1.5%` per Might point, so it is a floor.

| Class | Plan | Split | Might bonus at 42 (205 pts) | at 65 (320) | at 80 (395) |
|---|---|---|---|---|---|
| Scrapper | Wrecking Crew | 50 / 15 / 35 / 0 | +154% | +240% | +296% |
| Technomancer | Chain Reaction | 50 / 0 / 20 / 30 | +154% | +240% | +296% |
| Runner | Rush Hour | 50 / 30 / 20 / 0 | +154% | +240% | +296% |
| Anon | Demolition | 50 / 20 / 20 / 10 | +154% | +240% | +296% |
| Founder | Headcount | 20 / 0 / 35 / 45 | +62% | +96% | +119% |
| Homesteader | Cold Bed | 25 / 15 / 45 / 15 | +77% | +120% | +148% |
| Witness | The Page | 20 / 15 / 55 / 10 | +62% on the swing, and nothing on Thread | +96% on the swing | +119% on the swing |
| The Maximalist | Orange Pilled | 45 / 20 / 25 / 10 | +138% | +216% | +266% |

The Chain Reaction plan puts half its points in Might because that is the only damage stat. The 30% Bandwidth is mana and the ward, not Arc Chain's damage. Rush Hour puts half in Might and only 30% in Reflex, even though the class is the fast one. Headcount puts the damage stat at 20% and the mana stat at 45%, and the workforce still scales off the 20%. The Page puts 55% in Vitality and then Thread, the button that kills, ignores every attribute.

That is the bug this plan is about. Not a number that is too high. A single stat is doing the damage for eight classes, so the requirements in the other note would all collapse into "have enough Might."

## What Diablo 2 1.08 actually did

Patch 1.08 is a Lord of Destruction patch from 2001. Assassin and Druid exist. The 1.10 synergy system does not.

### Weapon damage from attributes

Strength and dexterity add **off-weapon** enhanced damage. The ratio depends on the weapon, not on the class holding it. The ratios below are the `weapons.txt` bonuses documented for Lord of Destruction (PureDiablo's formulae archive, and the mannm.org strength FAQtoid). Patch 1.10's notes add synergies and do not retune these ratios, so they are the 1.08 table as well.

| Weapons | From strength | From dexterity |
|---|---|---|
| Ordinary melee (swords, axes, spears, polearms, staves, wands, scepters) | 1% per point | none |
| Hammers and mauls | 1.1% per point | none |
| Daggers, throwing weapons, assassin claws | 0.75% per point | 0.75% per point |
| Bows and crossbows | none | 1% per point |
| Amazon spears and javelins, either in hand or thrown | 0.8% per point | 0.5% per point |

A bow asks for strength to be equipped, and then the damage comes from dexterity. A javelin is not dexterity-only. Amazon spears and javelins take most of their bonus from strength and a smaller share from dexterity.

The percent is enhanced damage. It adds with other off-weapon enhanced damage (armor jewels, auras, skills) after the weapon's own enhanced damage has already scaled the base.

### Energy, and sorceress spells

Energy adds mana. The long-standing per-point rates are sorceress and necromancer 2, druid 2, amazon and paladin 1.5, assassin 1.75, barbarian 1. Energy does not add spell damage in 1.08, and it still does not in later retail patches. A 1.10 sorceress guide tells the player to put nothing in energy and everything leftover in vitality. Mana comes from the pool, from charms, and from Warmth, which regenerates a percent of maximum mana. More energy means more casts, not harder casts.

In 1.08 a sorceress hit harder by:

- putting points in the spell itself (the skill's own level),
- `+skills` on gear,
- a mastery skill, which is a percent damage bonus,
- `+%` fire, cold, lightning, or poison on items,
- and, on some skills, character level inside the skill formula.

She did not hit harder by assigning energy. She also did not yet have the 1.10 synergy bonus: a listed percent per hard point in a different skill, with `+skills` on gear not counting toward that percent. Blizzard's 1.10 notes say "Added skill synergy bonuses" down the sorceress trees and across the other classes. The wiki records that this is the patch that made one-tree sorceresses the default. Before that, a sorceress often carried two or three elements, because a point in a second tree was not a damage penalty on the first.

Vitality adds life at a class rate (barbarian 4, amazon, assassin, and paladin 3, sorceress, necromancer, and druid 2). This game already gives everyone the barbarian rate, a flat `+4`.

Dexterity also adds attack rating (5 per point) and feeds defense and shield block. This game has no attack rating and no block. Reflex's deadly strike is the local stand-in, and it is a much smaller damage term than dexterity was on a bow.

### What 1.08 does not give us

1.08 does not make energy the sorceress's damage stat. Copying 1.08 literally would leave Bandwidth as mana, leave every class's damage on the weapon, and give fast weapons their damage from Reflex and heavy weapons theirs from Might. That is a good weapon table. It does not make the Technomancer, the Founder, or the Witness care about a different stat than the Scrapper. The ask was that each class's natural stat drive its damage, so the requirements and the build are the same decision. That part is a deliberate step past 1.08, closer to Diablo 3's primary stat, and it should be labeled as such.

## Other models

**Primary stat per class (Diablo 3).** One stat multiplies all of that class's damage. Strength for the barbarian and crusader, dexterity for the demon hunter and monk, intelligence for the wizard and witch doctor. The same stat also feeds armor or resistances, which means the damage stat is also the defense stat, and vitality is the only thing you give up. Simple, and it kills the "requirements versus life" trade if we also let Might add armor. Not recommended here: Might stays damage and requirements, Vitality stays life, Reflex stays a weapon stat and a little armor, Bandwidth stays mana and, for two classes, damage.

**Stat-scaled skills.** Each skill names one stat. Stop Sign reads Might. Arc Chain reads Bandwidth. Thread reads Vitality. Hybrids fall out for free: Anon's hop reads Reflex and Anon's mine reads Might. This is the model below. It is more code than a single primary, and it is the one that can describe a Founder who hits with Bandwidth on interns and with Might in the mech.

**Per-skill tags, as a gear system.** The same idea, plus tags on items ("skills with the Bandwidth tag"). That is a second itemization pass. Not in this plan. The stat on the skill is enough. Gear keeps `+Might` and the other three, which already feed the pool the skill reads.

**Literal 1.08.** Weapon family decides the stat, energy never scales a spell, spells scale by skill rank and the local `+6%` column bonus. Documented above as the rejected default. It can still be the fallback if the class table is too much for one patch: ship the weapon rows only, and leave class skills on whatever stat the weapon uses. A Technomancer with a Deck would then want Bandwidth only because the Deck's row says so. That is Alternative A.

## Proposal

One rating per blow, at `1.5%` per point, which is today's Might rate. A blow uses one stat. It does not add Might and Bandwidth together.

The rating multiplies the same place Might multiplies today: inside `(1 + bonus / 100)` on weapon damage. Skills that already ignore the weapon keep ignoring it, and gain their own smaller rating so the page is not a second maul.

Gear stats count, including on the weapon, once the piece is allowed to work. A red piece, under the requirements note, contributes nothing.

### Which stat a blow reads

| Blow | Stat | Rate |
|---|---|---|
| Heavy weapon, Sign, neutral weapon, Graft, ordinary Maximalist bases | Might | 1.5% |
| Fast weapon, Launcher, razor line | Reflex | 1.5% |
| Shiv, and Anon's hop, Rehearsal, and the knife | Reflex | 1.5% |
| Anon's mines, Zip Bomb, honeypot, Legion | Might | 1.5% |
| Deck, and Technomancer skills and the bolt | Bandwidth | 1.5% |
| Instrument, and Founder interns, contractors, the chief, layoffs, liquidation | Bandwidth | 0.7% |
| Founder personal bolt and Mech Suit | the weapon's stat | 1.5% |
| Homesteader hull, hound, and the shot | the weapon's stat (Graft is Might) | 1.5% |
| Homesteader plots, frost, salt, the flock's bites | Vitality | 0.4% |
| Witness swing, including the Testimony multiplier on it | the weapon's stat (Notebook is Might) | 1.5% |
| Thread, Publish, Cross-reference | Vitality | 0.6% |
| Maximalist swings, Tick Tock, hammers, Cite Your Sources, Proof of Work ticks | Might | 1.5% |

Priced in Sound still converts after this, and still keeps only part of a non-Sound blow. The rating does not get a second pass after the conversion.

Hirelings stay on `mercStats`. They do not gain a player attribute. A rendered companion keeps copying the sheet, so it follows this table in the copied class.

The local `+6%` per point in the skill above stays. It is skill investment, not an attribute. Do not replace it with the stat.

### Why two Founder and Witness rates are lower

Headcount already puts 45% in Bandwidth and only 20% in Might. At `1.5%`, moving intern damage onto Bandwidth would take the workforce from about `+62%` to about `+138%` at level 42 (205 level points). Interns are already the class. The `0.7%` rate keeps a 45% Bandwidth spend near today's `+62%` (`0.7 * 0.45 * 205 ≈ 65`). A raid build that put half its points in Might keeps a strong personal swing and a weaker staff, which is what Org Debt is already telling the player.

Thread currently takes no attribute. `0.6%` per Vitality on a page build (55% of 205 is about 113 Vitality) is about `+68%` on a blow that had zero. That is a real buff to the button the class kills with, and it is aimed at the Witness pace problem, not at a power fantasy. It has to be checked in a fight before it ships. The swing stays on Might, so a Witness who abandoned the page and built like a Scrapper still hits with the pencil, and still cannot wear plate if the requirements note lands.

Plot ticks at `0.4%` Vitality are a small buff to Cold Bed (45% Vitality is about `+37%` on the tick at level 42) and do nothing for a hull that is not standing in a plot. Hull damage stays Might, so the tank form is not also the best damage form.

### Templates have to move in the same change

If the formula changes and `BUILDS` does not, the rig keeps spending Might on a Technomancer and the class loses about a third of its stat bonus on day one. Chain Reaction is 50% Might and 30% Bandwidth today because Might is damage. After the change the damage stat is Bandwidth.

Proposed percentages, first guess, `[Might, Reflex, Vitality, Bandwidth]`. Only the plans whose damage stat moved are listed. The others stay.

| Plan | Now | Proposed | Why |
|---|---|---|---|
| Chain Reaction | 50 / 0 / 20 / 30 | 15 / 5 / 30 / 50 | Bandwidth is the spell. 15% Might still wears a mantle (see the requirements table). |
| Sysadmin | 20 / 0 / 35 / 45 | 10 / 5 / 40 / 45 | Already a Bandwidth plan. A little Might for the coat. |
| Control Rod | 30 / 0 / 30 / 40 | 15 / 5 / 30 / 50 | Same. |
| Rush Hour | 50 / 30 / 20 / 0 | 15 / 50 / 30 / 5 | Reflex is the throw. |
| Porch Pirate | 30 / 20 / 40 / 10 | 15 / 40 / 35 / 10 | The kit is traps and blinks; Reflex covers the throws. |
| Tip Jar | 35 / 30 / 35 / 0 | 15 / 45 / 35 / 5 | Same. |
| Ghost | 45 / 35 / 20 / 0 | 20 / 50 / 25 / 5 | The hop and the knife are Reflex. |
| Demolition | 50 / 20 / 20 / 10 | stays | Mines stay Might. 20% Reflex still holds a shiv on the shallow curve. |
| Headcount, Cold Bed, The Page, Wrecking Crew, Orange Pilled | stay | The rate, not the split, was chosen so these stay put. |

Random class shift currently dumps 45% into Vitality for melee and into Might otherwise. It should dump 45% into the class's driving stat (the table above) and the rest at random, or it will keep producing Might casters.

The Hero screen strings are still "+1.5% damage per point" on Might for everyone. Those four lines have to name what the point does for the class you are, or the phone build will lie.

### Hybrids

A point goes to one kind of blow.

- Anon demolition is a Might mine build that can still hold a shiv. Anon ghost is a Reflex knife. Neither point adds to the other button.
- Founder headcount is a Bandwidth staff. Iron Founder is a Might mech with a staff that did not get those points. Org Debt already punishes swinging while the staff is out; the stats now agree.
- Homesteader in the hull hits with Might and is safe from Vitality. Homesteader in the plot hits the tick with a little Vitality and is giving up the maul.
- Witness on the page hits Thread with Vitality and the pencil with whatever Might they kept for the notebook requirement. A pure Vitality Witness has a stronger Thread and a dull swing, which is the class as written.
- Maximalist stays a Might paladin. There is no energy-scaled hammer. Auras do not open a second stat.
- Runner on a maul is holding a Might weapon. Their throws from that maul read Might, and their Reflex is only deadly strike and the sneakers. The launcher exists so the natural plan does not do this.

Scrapper and Maximalist do not become hybrids. Heavy is Might. That is the whole class.

### PvP and co-op

The rating is the same in a duel as in a district. There is no second PvP coefficient. Charm life is already taxed when it exceeds 20% of the pre-charm pool, and charm skill ranks are already capped while a player is hostile. Those stay.

Bandwidth on a Technomancer is both the mana pool and the damage. That is the real PvP risk: one stat buys uptime and hit size. The cost is the Vitality they did not take, on the smallest life pool in the game. If duel logs show that build never dying, the fix is the life side, not a quieter damage formula for PvP only.

Co-op damage is still the client's sheet. A red weapon, a refunded stat, or a shift into the wrong spend shows up as a weaker blow. Nothing new has to be replicated on the server.

### Balance targets

The character targets stay the ones already used for pacing: Normal 40–45, Hard mid-60s, Brutal 75–85. This note does not retune experience or monster levels.

At those levels, with the template moves above and with level points only:

| Class | Driving stat at 42 / 65 / 80 | Stat bonus, first guess | Against today |
|---|---|---|---|
| Scrapper, crew | 102 / 160 / 198 Might | +154% / +240% / +296% | Unchanged on a maul |
| Technomancer, chain, after the move | same counts in Bandwidth | same bonus | Unchanged if the template moves. About a third lower if it does not. |
| Runner, rush, after the move | same counts in Reflex | same bonus | Same condition |
| Anon, demolition | same counts in Might, on mines | same bonus on mines | The hop stays Reflex, so it scales off the 20% |
| Founder, headcount | 92 / 144 / 178 Bandwidth at 0.7% | +65% / +101% / +124% | Near today's +62 / +96 / +119 |
| Homesteader, cold bed | plots at 0.4% of the 45% Vitality | about +37% / +58% / +71% on ticks | New. The shot stays on the 25% Might, about +77% at 42. |
| Witness, the page | Thread at 0.6% of the 55% Vitality | about +68% / +106% / +130% on Thread | New. The swing stays on 20% Might, about +62% at 42. |
| Maximalist, orange | 92 / 144 / 178 Might | +138% / +216% / +266% | Unchanged |

A pure Vitality spend, no points in the driving stat, loses the free Might damage on weapon blows and keeps the Vitality term only where the table grants one (plots, Thread). That is the trade the requirements note is selling. It should not also be a 1.5% damage stat, or plate and life are no longer a choice.

Do not ship the Witness and Founder rates without a paper check: one Thread at rank 10 against a Normal Pryce, one intern wave against a Normal pack, compared with the same skills on today's Might formula. If Thread more than doubles, the 0.6% is too high. If interns fall over, the 0.7% is too low.

## Respec and migration

Sister Null already puts every spent point back into `G.ap` and zeroes `G.at`. No save rewrite of spent points is required, and none should be done. An old Technomancer who logged off with 100 Might and 10 Bandwidth will cast weaker the moment the formula is live. Rewriting their stats in the save would spend points they did not choose.

On the first load after the change, one toast, once, stored as a flag on the save: Sister Null can return the points. Do not open her dialog for them.

`BUILDS` and the random-shift rule change in the same patch as `calc()`. Class shift already refunds and then applies a plan, so a shift after the patch spends the new percentages. A shift before the player has read the toast spends the new plan too, which is what we want.

Old items do not need new stat fields for scaling. `+Might` and the other three already exist and already add into `calc()`. The requirements fields are the migration discussed in the other note: missing means zero, so old gear does not go red on load.

Broken gear already drops out of `calc()`. Red gear, if the requirements plan is accepted, must drop out the same way, or a maul you cannot lift still provides the Might that lets you lift it.

## Recommendation

Replace the universal `+1.5%` per Might with the one-stat-per-blow table. Keep the rate at 1.5% where the class was already a Might class. Use the lower Founder and Witness and plot rates so those kits do not jump. Move the caster and Runner templates in the same patch. Leave hirelings alone. Leave the 6% column synergy alone. Do not auto-respec.

This is not 1.08's energy rule. 1.08 is the weapon half (heavy reads Might, fast reads Reflex, a bow-shaped launcher reads Reflex) plus an honest statement that sorceress spells did not scale with energy. The class half is the part 1.08 refused to do, and it is the part that makes Bandwidth, Reflex, and Vitality show up on the buttons those classes actually press.

## Alternative A — 1.08 weapons only

Heavy and Sign and Graft read Might at 1.5%. Fast, Launcher, and Shiv read Reflex at 1.5%. Deck reads Bandwidth at 1.5% because the weapon says so, and Technomancer skills then follow the weapon in their hands. Notebook reads Might. Thread stays flat. Founder interns keep inheriting the weapon.

Fewer special cases. A Technomancer who picks up a maul becomes a Might caster for as long as they hold it, which is the 1.08 joke and also a way to ignore the class. The Witness page still does not scale. Templates still have to move for Runner and for anyone whose weapon stat changed.

## Alternative B — one primary, every blow

| Class | Primary |
|---|---|
| Scrapper, Anon, Homesteader, Maximalist | Might |
| Runner | Reflex |
| Technomancer, Founder | Bandwidth |
| Witness | Vitality |

Every skill and the swing use that stat at 1.5%. No per-skill split. Hybrids do not exist: an Anon mine and an Anon hop are the same stat, so the demolition plan and the ghost plan are the same decision. The Witness swing and Thread both scale off Vitality, so the pencil stops caring about Might and the notebook requirement in the other note should drop to zero or the page build cannot hold it.

Simpler to explain on a phone. Worse for the three classes that are actually two builds.

## Decisions

1. The per-blow table, or Alternative A (weapon only), or Alternative B (one primary).
2. The Founder workforce rate of 0.7%, the Thread rate of 0.6%, and the plot rate of 0.4%. Or hold those three at zero until a fight is measured, and ship the Might and Reflex and Bandwidth rows first.
3. Whether `BUILDS` moves in the same patch. The recommendation is yes. Shipping the formula alone nerfs every plan that was pointing at Might for damage.
4. The one-time toast, with no automatic respec. Or a button on the Hero tab that refunds once for free, the way Sister Null does for credits.
5. Whether a Deck in a non-Technomancer's hands still grants Bandwidth damage. The recommendation is no: the blow's stat comes from the class table, and the weapon only chooses when the class table says "the weapon's stat." A Scrapper with a Deck uses Might, and the Deck's family perk stays class-locked as it is today.
6. Hirelings stay off the table. Say so explicitly if that is wrong and a Bodyguard should scale with the player's Might.
7. This waits on the requirements note, or the two ship as one change. They should ship as one. A Might requirement without a Might damage stat, or a Bandwidth damage stat with no Bandwidth requirement on the Deck, leaves half of the choice on the table.
