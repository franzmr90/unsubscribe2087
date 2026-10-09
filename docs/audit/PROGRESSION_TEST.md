# Normal progression test — Unsubscribe 2087

Date: 2026-10-09. Branch `cursor/progression-test-3887`, stacked on `cursor/audit-fixes-3887` (PR #102). Harness: `tools/progression-play.js`. Season for every run: **bull** (+15% monster damage). God mode stayed off. No character was handed a level or a piece of gear.

## Verdict

A sensibly built character can kill the act bosses. The authored boss, the one you get when the district stays at its written level and adaptive difficulty stays at 1×, is a tense corpse-run on Act I and a long, winnable fight later. What the full clears actually fought was much larger, because a character who clears every district hits the act level cap, the district is then built at that cap, and adaptive difficulty multiplies life and damage by as much as 12. Potions and the mercenary fall off along the way. Experience is fast. Drop item levels kept up for the Scrapper and the Technomancer. The Runner's weapon stalled. The Witness never reached a boss.

So the mix is: boss tables are in a winnable range, experience overshoots the area level, adaptive difficulty then punishes that overshoot, and the credit clock plus the opening hire price take potions and the mercenary out of the late game. Gear pacing is fine for melee and for the caster, and weak for a ranged weapon once the build is married to one base.

No tuning was applied. One play bug was fixed: pathfinding gave up before it could cross a district.

## How it was played

Each run called `newGame` at level 1 with the class's white weapon, 120 credits, 3 stims, and 0 sats. The bot walked the 2015 prequel, took "I am not proud of you," then cleared districts in quest order. It identified, equipped by item score, sold junk, bought stims and one credit upgrade when the score said so, bought one sat upgrade when it could, spent the build's skill and attribute points, and tried to hire a bodyguard. Melee backed off under about 36% life (55% for the Witness). Ranged and the caster kited. Bosses were corpse-run. One short farm was allowed after repeated losses. Two seeds: `12648430` and `8675309`.

| Class | Build | Seed 12648430 | Seed 8675309 |
|---|---|---|---|
| Scrapper | crew, melee | Cleared PROVIDENCE. Level 100, 56 deaths, 4.1 game-hours | Cleared PROVIDENCE. Level 100, 63 deaths |
| Runner | rush, kites | Killed the Curator. Died in Act V trash. Level 100, 779 deaths | Killed MANDATE. Died in Act IV trash. Level 90, 666 deaths |
| Technomancer | chain, kites | Cleared PROVIDENCE. Level 100, 98 deaths | Killed Pryce, then the clock ended in Act II. Level 36, 17 deaths |
| Witness | page, fragile | Never left Act I. Level 22, 47 deaths, Defrag still up | Same stall. Level 22, 135 deaths, Defrag still up |

Screenshots of the pulls are in `/opt/cursor/artifacts/progression/`. The Technomancer's Pryce win and the Scrapper's PROVIDENCE win are the two ends of the scale.

## What an authored boss is

On entry, a district's monster level is `max(area level, character level)` while adaptive difficulty is on, and that level is cached for the district. Spawn life and damage, then the bull-week factors, are:

- Life: `base × (1 + 0.42 × (ml − 1)) × 2.5 × dyn.hp × 1.25 × (1 + 0.012 × level)`
- Damage: `base × (1 + 0.22 × (ml − 1)) × 1.35 × (extra after ml 25) × dyn.dmg × 1.3 × (1 + 0.008 × level) × 1.15`

`dyn` is 1 when the character is at or under the expected curve, and it climbs to a cap of 12 when sheet DPS or effective life is ahead of that curve. It never helps a weak character.

If the district stayed at its written level and dyn stayed at 1, bull week, the five bosses would be:

| Boss | Area level | Base life / damage | Authored life | Authored damage | Two players (1.5× life) |
|---|---|---|---|---|---|
| Pryce | 12 | 700 / 15 | 14,064 | 113 | 21,096 |
| Vale | 27 | 1100 / 17 | 54,251 | 285 | 81,376 |
| MANDATE | 42 | 1900 / 10 | 162,705 | 307 | 244,057 |
| Curator | 57 | 2400 / 11 | 309,688 | 541 | 464,531 |
| PROVIDENCE | 72 | 3000 / 11 | 538,580 | 800 | 807,869 |

The Technomancer's Pryce was exactly that authored fight: monster level 12, dyn 1.00 / 1.00, 14,064 life, 113 damage. Everything after Act I in these clears was the cached, level-capped version.

Act level caps are 25, 50, 75, 90, and 100. Boss areas are 12, 27, 42, 57, and 72. A full clear sits on the cap before the act boss. That is the opposite of an under-leveled character.

Drops roll at monster level + 0 to 2. Trash is about 1 item per several kills (a drone is 9 item weight against 62 nothing). Lieutenants guarantee a rare-side roll. Brenda's credit stock is item level `character + 0..2`, mostly magic. Nonce's sat stock is item level `character + 2..4`, set or rare, at 45 / 30 / 12 sats. At level 1 the sat shop already offered a rare weapon of item level 4 whose score beat the white weapon by 0.88, for 12 sats.

A second player in a Normal game multiplies monster life by 1.5 and experience by 1.5, and does not multiply the damage the monsters deal. That factor divides the damage you land (`mpHp`). The rendered tag-along is a different system (about 1.35× life and 1.05× damage taken) and was not part of these solo runs. The two-player column above is that 1.5× life applied to the authored bar. It was not simulated in a live session.

## Bosses, as played

Pulls are corpse-runs unless the life bar starts over at 100%, which means the district had reset. "Removed" is the share of the bar taken off during that attempt.

### Act I — Pryce, the Glass Cathedral

| Class | Seed | Level | Weapon | Life | Armor | Stims | Merc | ml | dyn hp/dmg | Boss life | Boss dmg | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Technomancer | 8675309 | 13 | Rare il 12, 18–30 | 356 | 100 | 0 | none | 12 | 1.19 / 1.62 | 16,743 | 184 | Won, 3 pulls |
| Technomancer | 12648430 | 15 | Rare il 8, 17–29 | 301 | 25 | 1 | none | 12 | 1.00 / 1.00 | 14,064 | 113 | Won, 3 pulls |
| Scrapper | 8675309 | 19 | Rare il 13, 23–38 | 683 | 140 | 2 | none | 16 | 1.49 / 2.51 | 28,453 | 369 | Won, 2 pulls |
| Runner | 12648430 | 19 | Rare il 18, 32–53 | 624 | 198 | 2 | none | 15 | 1.37 / 3.39 | 24,271 | 469 | Won, 1 pull, 29s |
| Runner | 8675309 | 17 | Set il 15, 36–61 | 439 | 143 | 5 | none | 14 | 1.80 / 1.61 | 29,658 | 210 | Won, 1 pull, 26s |
| Scrapper | 12648430 | 22 | Rare il 20, 59–98 | 850 | 188 | 7 | none | 16 | 2.08 / 2.85 | 39,505 | 419 | Won, 2 pulls |

Technomancer pulls on seed 12648430, the authored fight: died after taking the bar from 100% to 50% (15s, 1 stim), died from 62% to 33% (20s, 1 stim), won from 33% to 0% (18s). Helm and belt were still empty. Gloves and boots were normal item level 2. That is a real level-15 caster, and Pryce took three tries. By the victory screen the kill had pushed the character to level 18.

The other Technomancer arrived even closer to the area, at level 13, with a rare item level 12 weapon (18–30) and 356 life. Dyn was only 1.19 life and 1.62 damage, so Pryce had 16,743 life. Pulls: died from 100% to 78% (9s), died from 78% to 25% (39s, 1 stim), won from 32% to 0% (7s). Three tries again. The clock then ended this run on the Boardwalk at level 36, before Vale.

The Scrappers were a few levels over the area, so the cached cathedral was monster level 16 and dyn had already started. They still won on the second pull. The Runners won on the first pull. Nobody hired a mercenary before Pryce. The opening hire is about 260 credits and the purse on those visits was 2 to 89.

### Act II — Vale, the Mezzanine

Everyone who arrived was on the act cap, level 49 or 50, in a district written as level 27. The cached monster level was 46–50. Dyn damage was 9× to 12×. Vale had 348,000 to 915,000 life and dealt 5,500 to 8,100 a hit, against 1,200 to 2,000 life on the character. The authored Vale is 54,251 life and 285 damage.

| Class | Seed | Weapon | Life | Armor | Stims | Merc | Boss life | Pulls |
|---|---|---|---|---|---|---|---|---|
| Scrapper | 8675309 | Rare il 44, 69–113 | 1,556 | 936 | 11 | dead | 348,453 | 5, won |
| Technomancer | 12648430 | Unique il 42, 70–115 | 1,230 | 1,227 | 4 | none | 430,266 | 3, won |
| Scrapper | 12648430 | Rare il 53, 149–243 | 2,055 | 690 | 8 | alive | 475,421 | 3, won |
| Runner | 12648430 | Rare il 53, 119–194 | 1,611 | 1,731 | 9 | dead | 500,606 | 3, won |
| Runner | 8675309 | Rare il 54, 109–178 | 1,689 | 1,627 | 0 | none | 915,132 | 5, won |

Sample, first Scrapper: 100%→54% dead, 68%→10% dead, 10%→0% won. The bar persisted across the corpse-runs. Weapons were rare or unique around the character's level, well above the area's item level of 27. The fight is a corpse-run because dyn and the level cap rebuilt Vale, and it still ends.

### Act III — MANDATE, Still Water

Arrivals were level 75, the cap, in an area written as 42. Dyn life was 7× to 12× and damage was on the cap of 12. MANDATE had 1.4 million to 4.3 million life. The authored bar is 162,705. Trash in the room was hitting for several thousand. All five arrivals won, three of them in a single pull.

| Class | Seed | Weapon | Life | Armor | Stims in | Merc | Boss life | Result |
|---|---|---|---|---|---|---|---|---|
| Scrapper | 8675309 | Rare il 79, 175–285 | 2,874 | 3,273 | 6 | dead | 1,421,355 | 2 pulls, won |
| Runner | 8675309 | Unique il 71, 117–191 | 2,110 | 1,749 | 0 | none | 2,526,869 | 1 pull, 38s |
| Scrapper | 12648430 | Rare il 79, 161–264 | 3,861 | 2,923 | 9 | dead | 2,848,728 | 2 pulls, won |
| Technomancer | 12648430 | Rare il 79, 129–211 | 3,066 | 2,112 | 0 | none | 3,989,918 | 1 pull, 87s |
| Runner | 12648430 | Rare il 73, 162–264 | 2,583 | 2,329 | 0 | dead | 4,255,487 | 1 pull, 104s |

Uniques were on the body by now (helms, armor, amulets). The first Scrapper's credit index at this door was only 182, because that clear was fast. The slow clears were already in the millions. Stims at the door were 0, 0, 6, or 9 depending on how much the walk had drunk.

### Act IV — the Curator, the Kitchen Table

Area level 57. Arrivals were level 90, the cap. Dyn damage was 12. The Curator had 4.5 million to 8.3 million life and dealt about 15,000 a hit. The authored bar is 309,688 life and 541 damage. Four arrivals, four wins.

| Class | Seed | Weapon | Life | Armor | Stims | Boss life | Result |
|---|---|---|---|---|---|---|---|
| Scrapper | 12648430 | Rare il 79, 161–264 | 4,275 | 5,013 | 9 | 4,490,518 | 1 pull, 182s, no stim used |
| Scrapper | 8675309 | Unique il 94, 153–250 | 4,177 | 4,349 | 5 | 6,573,386 | 1 pull, 26s |
| Runner | 12648430 | Rare il 73, 162–264 | 3,186 | 2,345 | 2 | 6,894,145 | Died at 95%, won the rest in 104s |
| Technomancer | 12648430 | Rare il 87, 154–250 | 3,138 | 2,779 | 8 | 8,283,172 | 1 pull, 66s |

The Runner was still holding the item level 73 weapon from Act III. The second Runner never reached this room: 666 deaths, level 90, that same item level 71 unique, 0 stims, and the clock ran out in the Act IV approach.

### Act V — PROVIDENCE, the Room

Area level 72. The three clears that got here were level 100. Dyn was 10.6× to 12× life and 12× damage. PROVIDENCE had 6.3 million to 7.5 million life and dealt about 10,000 to 12,000 a hit, against 3,600 to 6,100 life. The authored bar is 538,580 life and 800 damage. All three won. All three arrived with an empty stim belt. The mercenary was dead or had never been hired.

| Class | Seed | Weapon | Life | Armor | Boss life | Pulls |
|---|---|---|---|---|---|---|
| Technomancer | 12648430 | Unique il 92, 150–245 | 3,585 | 3,063 | 6,322,823 | 5, won. The long pulls were 835s, 1,059s, 1,827s, then 286s to finish from 14% |
| Scrapper | 12648430 | Rare il 99, 273–445 | 5,609 | 5,174 | 6,749,848 | 3, won. One full-bar pull of 130s after two short deaths |
| Scrapper | 8675309 | Rare il 102, 280–458 | 6,051 | 7,667 | 7,517,244 | 6, won. Chipped 100→78→73→26→13, then 11s to finish |

The first Runner died 779 times and never opened the Room. Level 100, the item level 73 weapon still equipped, 0 stims, mercenary dead, in Block 137,209 (area level 60) getting deleted by trash. That is the dyn damage cap and an empty potion belt, in a district the character outleveled by 40.

## Gear, vendors, and the credit clock

Drop item level tracked monster level, and monster level tracked the character, so the Scrapper and the Technomancer replaced their weapon every act: item levels 8, 13, 18, 20 at Pryce, then the 40s and 50s at Vale, the 70s at MANDATE, the 90s at the Curator, and 92–102 at PROVIDENCE. Rarity moved from rare to unique on several slots by Act III. That is not a slow loot table.

The Runner is the exception. Seed 1 equipped a rare item level 73 weapon for MANDATE and was still holding it at level 100. Seed 2 equipped a unique item level 71 at MANDATE and was still holding it at level 90. Sat stock is only two to four item levels ahead of the character, and a roll that is the wrong weapon family does not beat a good ranged base. Credit stock cannot fill that gap once the prices leave ordinary numbers. A guaranteed class weapon at item level `character + 3` on the sat tab would have given the Runner a new bow in Act IV.

Brenda's level-1 credit tab had magic and rare pieces at item level 2–3 with small positive scores. Nonce's level-1 sat tab had a set helm (30 sats, score +0.11), a rare helm (12 sats, +0.20), and a rare weapon (12 sats, +0.88). The bots did buy from it later (17 to 46 purchases, 200 to 900 sats spent). The early shop is already useful. It is not the reason Pryce takes three tries.

Credits compound every game second:

`cpi ×= 1.0025 ^ (dt × (1.45 − adoption/100))`

Bull week does not change that rate. Stim week uses 1.005. At low adoption a clean half hour is hundreds of times the starting prices, and an hour is hundreds of thousands. Gold drops scale with `cpi^0.9`, so a character who keeps killing can still buy a stim for a while, and the ratio only sours slowly. The fast Scrapper reached Vale at a credit index of 20 and MANDATE at 182. The slow Runner, who spent seven minutes stuck in several districts, reached Pryce at 3,206 and Vale at 10^14. By PROVIDENCE the fast Scrapper was at 1.8×10^7 and the Technomancer was past 10^30. Sheets full of that many digits are not a shop.

The hire is `200 × cpi × (1 + level × 0.25)`. At level 1 that is about 260 credits. A new character has 120, and the first town visits in these runs had 2 to 89, so every class was refused a bodyguard in Act I. The Scrappers and one Runner hired once they had a purse. The Technomancer never did. Revive is `80 × cpi × (1 + level × 0.25)`. After the credit index leaves the hundreds, the mercenary dies on the walk and stays dead at the door. Stims are `25 × cpi × (1 + level × 0.2)`. The walk to a dyn-12 boss drinks the stack, which is why PROVIDENCE was fought on an empty belt.

## Two players

With dyn left as it is, a second player adds 50% life to a boss that is already 8× to 15× the authored bar, and the incoming damage does not go down. The solo clears still won those bars, so a pair would win them too, faster, as long as both people are dealing damage. The painful part for a pair is the same as for the solo Runner: trash that hits for more than a life bar, and no potions.

With the Normal changes below, the pair fights 1.5× the authored life and each still takes a full hit. Pryce is 21,096 instead of 14,064. The level-15 Technomancer was removing about a third of the 14,064 bar per pull with an item level 8 weapon. Two characters at that point finish 21,096 inside two pulls. That is the more comfortable fight, and the solo authored bar stays the tense one. Leave the 1.5× life factor. Do not also multiply damage taken for a real partner.

## Tuning to aim at, not applied

These are the numbers for a 1.08 Normal feel: a solo character built on purpose wins, sometimes on the second or third corpse-run, and a pair wins more comfortably.

1. **On Normal, keep the district at its written level.** `zoneLevel` should be `area + tier × 12`. Drop the `max` with character level. A level 50 character in a level 27 district should feel strong.
2. **On Normal, adaptive difficulty stays at 1.** `dynFor` returns `{hp: 1, dmg: 1}`. The 12× cap is what turned PROVIDENCE from 538,580 life into 6 to 7 million, and what made Act V trash erase the Runner. Do not also cut the base boss life. The authored bars in the table above are the solo targets.
3. **Compound the credit index per minute, not per second.** Use `dt / 60` in the exponent. At low adoption, three hours of play then raises prices about 2× (about 4× on a stim week). Potions, repairs of the purse, and the sheet stay human-sized. Gold drops can keep the `cpi^0.9` factor.
4. **Price the bodyguard without the credit index.** Hire `80 + 8 × level` credits. Revive `40 + 4 × level` credits. Level 1 is 88 credits, under the starting 120, so a player can hire in Stillwater. A level 20 hire is 240. A level 50 hire is 480.
5. **Sell stims for 1 sat at Nonce**, beside the credit price. A dead credit shop then cannot empty the belt.
6. **Put one class-usable weapon on the sat tab at item level `character + 3`.** Price it at 12 to 30 sats, the same band as the other sat stock. That is the fix for a Runner still holding an item level 71 weapon at level 90.

Hard and Brutal can keep the current dyn and the current level-matching. This pass was Normal only.

## Bug fixed

`pathFind` stopped after 480 expansions. A 72-wide district needs on the order of 600 to 750 to reach the quest arrow or the next gate, and the search returned nothing, so a click on that tile did not move. The cap is now 3200. That is the only gameplay change.

## What the bot could not show

The Witness, on both seeds, died in the Humming Fields and never killed Defrag, so there is no Witness boss attempt. Seed 12648430 ended at level 22 with a rare item level 19 hammer, 879 life, 254 armor, 5 stims, and 1,251 sats. Seed 8675309 ended at level 22 with a rare item level 13 hammer, 943 life, and 10 stims, after 135 deaths. Both kits would have been a fair Pryce load, and the quest was still open. The bot also logged repeated stuck positions and then left districts after seven minutes without a boss pull. A player who can see the lieutenant would not play that stall. Treat the Witness rows as "the fragile build did not produce a boss measurement," not as "Pryce is impossible for a Witness."

The two-player numbers are the server's 1.5× life factor applied to the authored bars. There was no second client in the session.

The credit index on the slow runs is partly the bot standing in a district for seven minutes. The fast Scrapper, credit index 7 at Pryce, 20 at Vale, and 182 at MANDATE, is the better picture of an efficient clear. Even that clear was at 1.8×10^7 by PROVIDENCE.
