# Acts III–V, measured

The district walker in `tools/balance.js` times out on pathing. Still Water, the Paper Vaults and Ninety-Three Blocks killed that bot, and MANDATE and PROVIDENCE were never hit. That sample is kept below as the reason a standing fight was needed. It is not the balance.

## Protocol

`node tools/arena.js`. Level-matched scrapper, Wrecking Crew, identified rare weapon, armor, helm, gloves, boots and belt. No uniques, no hire, no stims. Normal difficulty. Adaptive difficulty off, so the raw curve is what gets recorded. The hero is parked on open floor, one machine is spawned in melee, and attack plus the three skill buttons are held. Boss story offers are flagged off so a dialog does not pause the clock. Three seeds. Sim time is `G.time`.

A second pass (`ARENA_EXTRA=1`) records the opening frame against a sponge, a pack of six, and ten kills with a rendered companion.

## 1v1, before

Median of three seeds. Life is the lowest life during the fight. Left is the fraction of the machine still up when the clock stops (8s trash, 12s bosses).

| Fight | ml | Result | TTK | Life | Left | HP | Damage |
|---|---:|---|---:|---:|---:|---:|---:|
| Parcel drone | 1 | 3/3 kill | 0.37s | 100% | 0 | 19 | 5 |
| Parcel champ | 1 | 3/3 kill | 1.33s | 96% | 0 | 53 | 7 |
| Fields enforcer | 6 | 3/3 kill | 0.40s | 100% | 0 | 116 | 14 |
| Cathedral mech | 12 | 3/3 kill | 1.00s | 100% | 0 | 763 | 63 |
| Pryce | 12 | 1/3 kill | 7.63s | 79% | 26% | 14359 | 100 |
| Updraft lancer | 15 | 3/3 kill | 0.33s | 100% | 0 | 365 | 65 |
| Mezzanine aegis | 27 | 3/3 kill | 0.03s | 100% | 0 | 789 | 43 |
| Vale | 27 | 1/3 kill | 5.70s | 91% | 45% | 54743 | 249 |
| Vestibule proxy | 30 | 3/3 kill | 0.03s | 100% | 0 | 941 | 124 |
| Nine Chairs director | 36 | 3/3 kill | 0.07s | 100% | 0 | 3372 | 222 |
| Still Water censor | 42 | 3/3 kill | 0.03s | 100% | 0 | 1302 | 158 |
| MANDATE | 42 | 1/3 kill | 6.40s | 89% | 32% | 164003 | 510 |
| Mile wisher | 45 | 3/3 kill | 0.03s | 100% | 0 | 1725 | 197 |
| Mile companion | 45 | 3/3 kill | 0.27s | 100% | 0 | 2250 | 241 |
| Tomari caretaker | 51 | 3/3 kill | 1.63s | 100% | 0 | 6650 | 425 |
| Curator | 57 | 1/3 kill | 6.37s | 87% | 36% | 314101 | 908 |
| Block orphan | 60 | 3/3 kill | 0.03s | 100% | 0 | 1109 | 448 |
| Block validator | 60 | 3/3 kill | 0.57s | 100% | 0 | 3991 | 482 |
| Vault custodian | 66 | 3/3 kill | 1.63s | 100% | 0 | 11411 | 726 |
| Blocks sniper | 69 | 3/3 kill | 0.03s | 100% | 0 | 3512 | 653 |
| Room oracle | 72 | 3/3 kill | 0.03s | 100% | 0 | 3591 | 515 |
| PROVIDENCE | 72 | 1/3 kill | 9.30s | 94% | 55% | 548981 | 1477 |

Nobody died. Pryce is the most dangerous boss in the sample (life 79%, and the impact seeds still have a quarter to half of him left at 12s). PROVIDENCE is slower to burn on impact (about 55% left at 12s, so roughly 27s to kill) and safer (life 94%). One seed held a rust weapon and killed every boss inside the window, PROVIDENCE included, in 9.3s. Rust is 1.5× into PROVIDENCE. That is the resist, not a soft boss.

The Cathedral mech is the Act I fight that takes a full second. From Act II on, most normals die on the first frame.

## Opening frame and a pack of six, before

Impact weapon, seed 2. The sponge records one frame of skill plus basic attack. The pack is six of the same machine.

| Fight | Opener / HP | Pack | Life |
|---|---:|---|---:|
| Parcel drone | 1.47× | 1.13s | 93% |
| Fields enforcer | 0.88× | 1.53s | 91% |
| Cathedral mech | 0.14× | 4.03s | 83% |
| Updraft lancer | 0.88× | 1.30s | 97% |
| Mezzanine aegis | 1.31× | 0.60s | 100% |
| Vestibule proxy | 1.30× | 0.03s | 100% |
| Nine Chairs director | 0.46× | 1.13s | 100% |
| Still Water censor | 1.57× | 0.03s | 100% |
| Mile wisher | 2.57× | 0.03s | 100% |
| Mile companion | 0.99× | 0.03s | 100% |
| Tomari caretaker | 0.27× | 1.27s | 97% |
| Block orphan | 3.27× | 0.03s | 100% |
| Block validator | 1.69× | 0.03s | 100% |
| Vault custodian | 0.25× | 1.27s | 100% |
| Blocks sniper | 1.41× | 0.03s | 100% |
| Room oracle | 2.84× | 0.03s | 100% |

Wisher, validator and oracle are weak to impact (1.5×), so a scrapper's opener is supposed to hurt. It was deleting them twice over, and the whole pack, before they fired. The orphan has no such weakness and the opener was 3.27× its life. Caretakers and custodians resist impact and already take about as long as a director. Their damage never connected in a pack: life stayed at 97–100%. The Act I mech pack is the one that gets a hit in.

Act II's aegis is the same shape (opener 1.31×). It was left alone so the early acts stay the ruler.

## What changed

Base life only, on the machines whose opener deleted them. Damage, bosses, the level curve, the post-25 damage ramp, and adaptive difficulty are untouched.

| Machine | Base HP |
|---|---|
| Proxy | 42 → 56 |
| Censor | 38 → 60 |
| Well-Wisher | 46 → 88 |
| Orphan Block | 20 → 66 |
| Validator | 72 → 90 |
| Fee Sniper | 52 → 74 |
| Oracle | 50 → 104 |

The impact-weak three (wisher, validator, oracle) are aimed at about 1.3× the opener, so the weakness still matters and the overkill does not. The others are aimed at about 1×, one solid hit from dying.

## Uniques

High roll of each Act IV–V unique against a rare of the same item level in that slot, the other slots a level-72 rare set. Sheet damage and effective life, from the same formula the character sheet uses. None of them beat the rare by enough to call them too strong. Several lose, because a rare of that item level rolls more affixes than the unique's three.

| Unique | Slot | Sheet DPS | Effective life |
|---|---|---:|---:|
| The Eleven Pages | amulet | −26% | +19% |
| Out Where | boots | 0 | −12% |
| Nurse's Hours | gloves | −23% | 0 |
| Four Thousand Two Hundred and Eleven | helm | −2% | −20% |
| Eighty-Two Minutes | ring | −6% | +9% |
| The Kitchen Table | armor | 0 | +14% |
| Ten Minutes | weapon | −36% | −15% |
| Not Your Keys | belt | 0 | −4% |
| Uncertain Knowledge | amulet | −19% | +26% |
| Twenty-One Million | ring | −24% | +4% |
| The Room | weapon | −12% | −15% |

Eighty-Two Minutes forces a deadly strike for 3 seconds after a dodge. One such hit on a validator was 1592, against 590 for a non-crit on the rare ring it replaced. That is the crit the item is for. Ten Minutes' first hit is the coded +60%. Left both.

## Party pressure

With a companion rendered, ten kills:

| Target | Median TTK | Pressure after 10 |
|---|---:|---:|
| Parcel drone | 0.03s | 0 → 1 |
| Cathedral mech | 0.73s | 0 → 1 |
| Tomari caretaker | 0.63s | 0 → 1 |
| Blocks sniper | 0.03s | 0 → 1 |

The old window raised pressure under 1.6s and lowered it over 6s. Every geared normal in the sample is under 1.6s, including the Act I mech, so pressure only climbed. Nothing but a boss lasts 6s, and bosses are not in the sample, so it never came back down. The step size (1.35 life and 1.05 damage taken at zero, plus 0.20 and 0.06 per step, cap 6) is unchanged.

The window is now under 0.45s to rise and over 1.8s to fall. 0.45s is a delete. 1.8s is slower than any geared normal here, so a struggling kill can ease the district off. A Cathedral mech at 0.73s no longer counts as too fast.

## Milestone 6

Left as it is. `node server/test/games.js` passed 38, failed 0.

- Two same-level members on a 1600 report sum to 2160, which is 1.35×, and the killer is in the split.
- Eight same-level members still sum to 2160. The old total was about 3.6×.
- A member ten levels under a level-20 monster receives 23. The on-level member receives 900.

That is the plan: full share within 5 levels, then 0.81, 0.62, 0.43, 0.24, and a 5% floor at a gap of 10. No separate penalty at level 70. `partyNoWeight` changes the no-drop weight only. `qChance` is the same at party size 1 and party size 8.

## The old walker, for the record

One roll, adaptive difficulty on, the bot pathing. Not used for the numbers above.

| District | Result | Sim s | Life | Left |
|---|---|---:|---:|---|
| Vestibule | timeout | 40 | 100% | 35/62 |
| Hall of Minutes | stuck | 27 | 80% | 53/69 |
| Nine Chairs | timeout | 40 | 83% | 47/70 |
| Rack Nine | timeout | 40 | 51% | 45/76 |
| Still Water | died | 29 | 0% | 42/53, boss 100% |
| Agreeable Mile | timeout | 40 | 51% | 9/56 |
| Sofa | timeout | 40 | 52% | 21/66 |
| Tomari | timeout | 40 | 100% | 26/57 |
| The List | timeout | 40 | 68% | 38/66 |
| Kitchen Table | stuck | 28 | 100% | boss 67% |
| Block 137,209 | timeout | 40 | 83% | 28/74 |
| Mempool | timeout | 40 | 80% | 39/70 |
| Paper Vaults | died | 31 | 0% | 48/56 |
| Ninety-Three Blocks | died | 12 | 0% | 60/70 |
| The Room | timeout | 75 | 100% | boss 100% |
