# 1.08 throwbacks — nostalgia list, counterparts, item revamp

Design note only. No game code in this change. Item tables were read on `main` (`ca5be45`), which matches the item generators on `cursor/class-run-3941` (PR #81). PR #82 is not merged. Where it changes a key, the note says so. The resistance overhaul there is the one to build against: five combat resists, cap 75 after a Hard −20 / Brutal −50 cut, `of Proofing` up to 31–45 at item level 36, and a rare `of Coverage` (`r_all`) that will not share an item with Proofing. Sound is not a resist.

The book already states the design constraint. In chapter 54 Wes describes months of Mephisto runs for one Immortal King's Maul, then paying seven dollars for someone else's hours: "The thing was scarce because the work was hard and the hardness was enforced by the game and nobody could talk their way around it." A throwback that drops every session, or a currency ring the client can duplicate, fails that test. A throwback nobody can ever see fails it the other way.

## Executive summary

Diablo II around 1.08–1.09 was an item game. Skills were one point each and did not synergy. The chase was a short list of uniques, two or three partial sets, and a handful of runewords you could actually finish (Stealth, Leaf, Rhyme, Lore). Magic find had diminishing returns, and people priced the world in Stones of Jordan. Patch 1.10 (28 Oct 2003) replaced that economy with runewords, skill-tree charms, and ethereal mercenary weapons. Enigma, Spirit, Arachnid's Mesh, Grief, and Gheed's Fortune are from that later game. They are listed at the end, marked optional, and they should not be the model.

Unsubscribe 2087 already has the right skeleton. Qualities are white / magic / rare / set / unique. Magic find uses Diablo's own curve (250 / 500 / 600). Champions, lieutenants, and bosses roll better tables. Tier replays add 12 monster levels. Seed words are the rune system, and they are better writing than runes. Subscriptions are charms with a bill, which is the right joke.

What is missing is the part players remember. A unique roll is uniform across every unique you have outleveled, so a level 70 district still spends its unique on a level 3 ring. There is one set. There is no percent damage reduction, no faster-cast affix, no life or energy per level, no crushing blow, and no "this ring is what things cost." Shields do not exist as a slot. One ring slot is enough if the currency ring stacks in the lockbox. A second equipped ring would double +skills and should not be added casually.

Build in this order.

1. **Treasure classes.** A unique may drop only from a band of about eight items near the monster's level. Early uniques leave the pool.
2. **Eight anchor items**, with the PvP caps in the same change: Force Majeure (Windforce), the All-Hands (Shako), the Unspent Output (Stone of Jordan, also the trade chip), Remote Hands (Oculus), the Rate Card (Vipermagi), the Night Audit (Vampire Gaze), the Indemnity (Stormshield, as armor), the Coupon (Gull).
3. **Three stats those items need:** percent damage reduction capped at 50, a faster-cast affix that feeds the existing `cdr` cap of 60, and per-level life and energy.
4. **Two partial sets** on top of the Striker's Vigil that is already the early melee kit: the Schema Wrappings (wear three for magic find, five on a Technomancer) and the Old Guard (weak partials, one maul that is the chase).
5. **Party and trade rules.** Uniques are personal for eight seconds, then free-for-all. The Unspent Output is minted and moved by the account server. The client must not be the ledger.

Concrete rates are in section 4. At 0 magic find a champion should drop a unique about 1 in 35 kills, and a specific item in its band about 1 in 280. At 200 magic find those become about 1 in 17 and 1 in 130. That is a weekend, not a career, and not a vending machine.

## How to read the patch flags

| When | What it was |
|---|---|
| 1.07 | Retail *Lord of Destruction* on the disc, June 2001, before the day-one update. Classic (non-expansion) uniques are older still. |
| **1.08** | 29 June 2001, the Battle.net update that shipped with the expansion. Elite bases exist from this day. Ethereal does not. The famous runewords do not. |
| **1.09** | 20 August 2001. Almost every unique was rewritten. `players X`, runewords in single player, the socket cube recipe, and uniques from gambling arrive here. This is the list people mean by "1.08" after two years of playing it. |
| **1.10** | 28 October 2003. Synergies, ladder, ethereal as a system, skill charms, and the runewords that ended the unique era. |

"Only spawns in 1.09 or later" on the Arreat Summit means the **listed** mods are the 1.09 rewrite. The same name often existed in 1.08 with different mods. Where that difference was the reason people cared (Harlequin Crest's +40% life), it is called out. Where a page only gives the 1.10 block (Lightsabre, The Gnasher), the item is in the later-era section.

Stats below are from the Arreat Summit unless another source is named. Pages were fetched October 2026. Blizzard's live Summit is a post-1.10 snapshot. For these items the Summit itself prints the spawn patch, and that flag is what this note trusts.

## 1. Nostalgia list

Thirty-four items from the era people actually equipped, plus the early sets and the runewords a level 30 character could finish. Signature mods are the 1.09 block. "Why" is the job the item did, not a power ranking.

### Weapons

| Item | Slot | Signature mods (1.09 unless noted) | Why people loved it |
|---|---|---|---|
| **Windforce** | Elite bow (Hydra Bow). Item level 85, level req 73, 134 str, 167 dex. | +250% enhanced damage, +3.125 max damage per level, 20% IAS, 6–8% mana stolen per hit, +30% heal stamina, +10 str, +5 dex, **knockback**. 1.08 had +35 dex, 8% mana stolen, no strength. ([diablo2.diablowiki.net/Windforce](https://diablo2.diablowiki.net/Windforce); the wiki fetch was blocked, stats from the search snippet of that page and the 1.09 unique compilation at vhpg.com) | The bow. Knockback meant melee could not stand on you. It was the PvP weapon of the era and the thing a physical bowazon farmed toward for months. |
| **Buriza-Do Kyanon** | Exceptional crossbow (Ballista). Level req 41. | +150–200% enhanced damage, +2.5 max damage per level, 32–196 cold over 8 seconds, **100% piercing**, freezes target +3, +35 dex, 80% IAS, +75–150 defense. ([diablo2.io](https://diablo2.io/uniques/buriza-do-kyanon-t716.html), marked patch 1.09) | The freeze-and-pierce bow you used while Windforce did not exist yet. Strafe and multishot through a whole room, everything chilled. |
| **The Grandfather** | Elite sword (Colossus Blade). Level req 81. | +150–250% enhanced damage, +2.5 max damage per level, +50% attack rating, +80 life, +20 to all attributes, indestructible. Summit elite-swords page; the alpha index points this name at that Colossus Blade block. 1.09 or later. | The named sword from Diablo I, still the fantasy of a slow enormous blade. A trophy as much as a weapon. Outclassed later by runewords, which is the point of remembering it now. |
| **Titan's Revenge** | Exceptional javelin (Ceremonial Javelin). Level req 42, quality level 50. | +2 javelin and spear skills, +150–200% enhanced damage, +25–50 damage, 5–9% life leech, +20 str, +20 dex, **increased stack size, replenishes quantity**. ([diablo-2.net](https://www.diablo-2.net/uniques/item-info?item=Titan%27s+Revenge), "patch 1.09 or later"). A mashed caption on that page also shows +2 all Amazon skills and 30% run speed; those match **Lycander's Flank** on the Summit class-item page, not the standard Titan's block. They are not counted here. | The javazon weapon. Thrown weapons that restock themselves, with leech so you could stand in a crowd. Amazon-only, and that restriction was fine because the class was the fantasy. |
| **The Oculus** | Exceptional orb (Swirling Crystal), sorceress only. Level req 42. | **+3 sorceress skills**, +5 mana after each kill, all resist +20, **25% chance to cast level 1 Teleport when struck**, 30% faster cast, +20 vitality, +20 energy, +20% defense, 50% magic find. (vhpg 1.09 compilation; Summit spawn flag "1.09 or later" is the usual one for this block) | Three skills, a cast breakpoint, and magic find on the weapon you were fighting with. The random teleport was also why people hated it. Both reactions are the design. |
| **Gull** | Dagger. Level req 4. | +1–15 damage, **100% magic find**, −5 mana. Summit normal daggers. 1.09 or later for this block. | Not a weapon. A swap. You put it on for the boss's last hit. The earliest "I am a magic finder" identity item. |
| **Lidless Wall** | Exceptional necromancer shield (Grim Shield). Level req 41. | **+1 all skills**, +10% max mana, **20% faster cast**, +3–5 mana after each kill, +10 energy. Summit exceptional shields; the Grim Shield block, named via the alpha index. 1.09 or later. | The caster shield of the first month. Skills, cast rate, and mana on kill, on a base you could wear early. |
| **The Gnasher** | Hand axe. Level req 5. | The **published** block is 1.10 or later: +60–70% enhanced damage, **20% crushing blow**, 50% open wounds, +8 str. Summit normal axes. A 1.08/1.09 Gnasher existed with other mods. Those mods were not on the page. | The first crushing-blow weapon. People remember the name from the first hour, not the 1.10 numbers. Treat the published mods as later-era. |

Eaglehorn (the ignore-defense bow people wore on the way to Windforce) is real and era-appropriate. Its exact 1.09 mod block was not re-fetched for this note. Do not invent the numbers. The job is what matters, and this game has no attack rating to ignore. See the counterpart.

### Helms

| Item | Slot | Signature mods | Why |
|---|---|---|---|
| **Harlequin Crest** ("Shako") | Elite helm (Shako). Item level 69, level req 62, 50 str. | **1.09:** +2 all skills, +1.5 life per level, +1.5 mana per level, **damage reduced by 10%**, 50% magic find, +2 to all attributes. **1.08:** +2 skills, **+40% maximum life**, +1.25 mana per level, 50% magic find, +100% defense, indestructible. The +40% life was removed because it was absurd. ([diablo2.diablowiki.net/Harlequin_Crest](http://diablo2.diablowiki.net/Harlequin_Crest)) | The helm. Skills, life, mana, find, and a little reduction, on every class. Ugly on purpose. If a character had done one thing right, it was finding this. |
| **Vampire Gaze** | Exceptional helm (Grim Helm). Level req 41. | +100% defense, 6–22 cold, 6–8% life leech, 6–8% mana leech, **damage reduced 15–20%**, magic damage reduced 10–15. ([diablo2.io](https://diablo2.io/uniques/vampire-gaze-t1007.html), marked patch 1.09) | The melee helm. Dual leech plus a large physical reduction. Mercenaries wore it for the same reason. |
| **Arreat's Face** | Barbarian helm (Slayer Guard). Level req 42. | +150–200% defense, 30% faster hit recovery, +20% attack rating, **+2 barbarian skills**, 3–6% life leech, all resist +30, +20 str, +20 dex, **+2 combat skills**. Summit class items. 1.09 or later. | The barbarian's face. Two skills from the helm and two more from the combat tree, with leech and resists. Class items were allowed to be greedy. |

### Armor and shields

| Item | Slot | Signature mods | Why |
|---|---|---|---|
| **Skin of the Vipermagi** | Exceptional armor (Serpentskin). Level req 29. | +120% defense, all resist +20–35, **30% faster cast**, magic damage reduced by 9–13, **+1 all skills**. 1.08 had all resist +35 and magic reduction 15, and **no +skills**. ([purediablo wiki](https://www.purediablo.com/d2wiki/Skin_of_the_Vipermagi)) | The caster armor for two years. One cast breakpoint, one skill, every resist. Enigma retired it in 1.10. Before that, this was the coat. |
| **Shaftstop** | Exceptional armor (Mesh Armor). Level req 38. | +180–220% defense, **damage reduced by 30%**, +250 defense vs missiles, +60 life. Summit exceptional armor. 1.09 or later. | The physical wall you could wear in Nightmare. Thirty percent from one piece, before the cap of 50. |
| **Stormshield** | Elite shield (Monarch). Level req 73, 156 str. | +3.75 defense per level, +25% block chance, 35% faster block, **damage reduced by 35%** (the highest on any one item), cold resist +60%, **lightning resist +25%**, +30 str, attacker takes 10 lightning, indestructible. Official Summit HTML says `Lightning Resist +25%`, and diablo2.io / the fandom wiki agree. A common memory says −25%. That memory is wrong for the published item. 1.09 or later. | The PvP shield. Thirty-five percent physical reduction, a pile of strength toward your next armor, and enough lightning help that you still wore Thundergod's Vigor when conviction showed up. Absorb, not the shield's resist, is what survived conviction. |
| **Herald of Zakarum** | Paladin shield (Gilded Shield). Level req 42. | +150–200% defense, +30% block, 30% faster block, +20% attack rating, +20 str, +20 vit, **all resist +50**, **+2 paladin skills**, **+2 combat skills**. Summit class items. 1.09 or later. | The hammerdin shield of this era, years before Spirit. Skills and a finished resist sheet on one arm. |

### Gloves, belts, boots

| Item | Slot | Signature mods | Why |
|---|---|---|---|
| **Magefist** | Light gauntlets. Level req 23. | +1 to fire skills, **20% faster cast**, regenerate mana 25%, +1–6 fire. Summit normal gloves. 1.09 or later. | The fire sorceress glove, and the cast-rate glove everyone else borrowed. Warmth plus the glove's own regen was the mana engine. |
| **Frostburn** | Gauntlets. Level req 29. | **+40% maximum mana**, +5% enhanced damage, +1–6 cold, some defense. Summit. The mana percent **adds** with Stone of Jordan: two SoJs (25+25) and Frostburn (40) are +90% base mana. 1.09 or later. | The mana glove. Energy-shield sorceresses and anyone who had not found Magefist. |
| **Chance Guards** | Chain gloves. Level req 15. | +25–40% magic find, +200% gold, +25 attack rating. Summit normal gloves; the Chain Gloves block. 1.09 or later. | Early magic find you did not have to think about. |
| **Bloodfist** | Heavy gloves. Level req 9. | 10% IAS, **30% faster hit recovery**, +40 life, +5 minimum damage. Summit. 1.09 or later. | The first pair that made you stop getting stunlocked. Hit recovery was a breakpoint stat, and 30 was a real step. |
| **Goldwrap** | Heavy belt. Level req 27. | 10% IAS, **30% magic find** (not 40–60), 50–80% extra gold, +2 light radius. Summit normal belts. 1.09 or later. | The magic-find belt. Attack speed on a belt was the extra that made it feel like gear rather than a farming costume. |
| **String of Ears** | Exceptional belt (Demonhide Sash). Level req 29. | **6–8% life leech**, **damage reduced 10–15%**, magic damage reduced 10–15. Summit exceptional belts. 1.09 or later. | The melee belt. Leech and reduction on a low strength requirement. You wore it until something ridiculous replaced it, and often nothing did. |
| **Thundergod's Vigor** | Exceptional belt (War Belt). Level req 47. | +1–50 lightning, 5% chance to cast Fist of the Heavens when struck, **+20 lightning absorb**, +10% max lightning resist, +20 str, +20 vit, +3 Lightning Fury and Lightning Strike (Amazon). Summit. 1.09 or later. The page prints "+20 Lightning Absorb" without a percent sign; every other listing of this item treats it as 20% absorb. | Souls, conviction, gloams. Absorb applies when your resist has already been crushed. Also a fine Amazon belt. The PvM safety item of the era. |
| **Gore Rider** | Exceptional boots (War Boots). Level req 47. | 30% faster run, **15% crushing blow**, **15% deadly strike**, **10% open wounds**, −25% requirements. Summit exceptional boots. 1.09 or later. | Three boss-killer stats on your feet. Crushing blow for life pools, deadly strike for the double, open wounds so the boss could not regen. |
| **War Traveler** | Exceptional boots (Battle Boots). Level req 42. | 25% faster run, +10 vit, +10 str, **+15–25 damage**, **30–50% magic find**. Summit exceptional boots; the Battle Boots block, which the alpha index and the melee guide both assign to this name. 1.09 or later. | Magic find that also added flat damage, so a physical build could farm in its real boots. |

### Jewelry

| Item | Slot | Signature mods | Why |
|---|---|---|---|
| **Stone of Jordan** | Ring. Level req 29. | **+1 all skills**, **+25% maximum mana**, +1–12 lightning, +20 mana. Summit unique rings. **Spawns in any patch.** | The currency. Duped, stacked, and used as the unit of account for everything else ("that bow is 40 SoJs"). Also the best caster ring, and you could wear two. The 1.10 "sell a SoJ to spawn Uber Diablo" trick was Blizzard trying to delete the pile. Do not copy the duping. Do copy the unit of account. |
| **Bul-Kathos' Wedding Band** | Ring. Level req 58. | +1 all skills, **+0.5 life per level**, **3–5% life leech**, +50 stamina. Summit. 1.09 or later. | The melee SoJ. Skills and leech, so a physical fighter did not have to wear a caster ring. |
| **Nagelring** | Ring. Level req 7. | 15–30% magic find, +50–75 attack rating, magic damage reduced by 3, attacker takes 3. Summit. 1.09 or later for this block. | The cheap find ring. Two of them was a farming outfit. |
| **Manald Heal** | Ring. Level req 15. | **4–7% mana stolen per hit**, replenish life +5–8, regenerate mana 20%, +20 life. Summit. 1.09 or later. This is **mana** leech, not life leech. A lot of memory swaps it. | The mana ring for fighters whose mana pool was a puddle. Casters did not need it. Zealots did. |
| **Raven Frost** | Ring. Level req 45. | **Cannot be frozen**, +150–250 attack rating, 15–45 cold, +15–20 dex, +40 mana, 20% cold absorb. Summit. 1.09 or later. | Frozen meant you did not move. One ring fixed it. Dexterity helped the bow and the block. Near-mandatory, which is a design smell and also why it felt good to find. |
| **Mara's Kaleidoscope** | Amulet. Level req 67. | **+2 all skills**, all resist +20–30, +5 to all attributes. Summit unique amulets. 1.09 or later. | The amulet. Two skills and a resist roll you could finish your sheet with. |
| **Highlord's Wrath** | Amulet. Level req 65. | +1 all skills, **20% IAS**, +0.375% deadly strike per level, lightning resist +35, +1–30 lightning, attacker takes 15 lightning. Summit. 1.09 or later. | The melee amulet. Mara's was for casters. This one attacked. |
| **The Cat's Eye** | Amulet. Level req 50. | **30% faster run**, **20% IAS**, +25 dex. Summit. 1.09 or later. | Speed, for bowazons and zealots. No skills, and people still paid for it. |
| **The Eye of Etlich** | Amulet. Level req 15. | +1 all skills, 3–7% life leech, a little cold, light radius. Summit. **Any patch.** | The first +skills amulet. Life leech on an amulet carried the first act. |

### Sets, charms, and the runewords that existed

**Tal Rasha's Wrappings** (helm, armor, belt, amulet, orb). The set is in *Lord of Destruction*. Partial bonuses, as repeated by the fandom listings and an older fan page ([jolie.ca](https://jolie.ca/~dan_ruffolo/diablo/d2settalrashas.html)): 2 pieces replenish 10 life, **3 pieces +65% magic find**, 4 pieces faster hit recovery, full set +3 sorceress skills plus life, resists, and defense. The live Summit's per-item mods are the **1.10** rewrite, which moved the good stats onto the pieces and made the 3-piece find bonus the reason every class wore the mask, the armor, and the belt. What to copy is the behavior, not a disputed 1.08 line: three pieces is a find set for anyone, five pieces wakes up on a sorceress.

**Immortal King** (helm, armor, belt, gloves, boots, maul). Six pieces, barbarian helm so the full set is class-bound. Partial bonuses on the post-1.10 listing are famously weak: +50 / +75 / +125 / +200 attack rating at 2 / 3 / 4 / 5 pieces. Full set is +3 skills, +150 life, resists, a pile of attack rating ([purediablo](https://www.purediablo.com/d2wiki/Immortal_King)). People wore one piece, or all of them. The maul was the piece that did not drop. That is the Wes story.

**Sigon's** is the classic (pre-expansion) starter set: a full kit by the end of Act I, then replaced. Exact 1.09 partial numbers were not re-fetched. The job is the one that matters. **Cathan's** did the same for a fire caster. **Angelic** ring plus amulet was the two-piece that solved attack rating, which is why hybrids could hit things.

**Charms** exist in 1.08. The day-one notes already talk about cutting charm damage. They take inventory space, which is the cost. Small charms of life and grand charms of life are the era fantasy. **+1 to a skill tree** ("skillers") became the economy in 1.10. **Annihilus, Hellfire Torch, and Gheed's Fortune** are 1.10 unique charms. Gheed's (magic find, gold find, cheaper vendors) is listed under later-era because that is where unique grand charms landed. A 1.09 unique Gheed's was not found in these sources.

**Original runewords** (Summit "Original Rune Words", not the 1.10 page). In 1.08 they worked on closed Battle.net, and Ancient's Pledge was the one that worked everywhere. 1.09 turned the list on for single player and open games.

| Word | Sockets | Runes | What a 1.09 character actually made |
|---|---|---|---|
| **Stealth** | 2 armor | Tal + Eth | 25% cast, 25% hit recovery, 25% run. The armor you wore until Vipermagi. |
| **Leaf** | 2 staff | Tir + Ral | +3 fire skills, plus three more fire spells. The sorceress starter. |
| **Rhyme** | 2 shield | **Shael** + Eth | Cannot be frozen, 25% magic find, all resist +25, block. The Shael people mean. |
| **Lore** | 2 helm | Ort + Sol | +1 all skills. The helm before Shako. |
| **Ancient's Pledge** | 3 shield | Ral + Ort + Tal | A pile of resists. The quest-reward runes made one for free. |
| **Smoke** | 2 armor | Nef + Lum | All resist +50. The resist coat. |
| **Lionheart** | 3 armor | Hel + Lum + Fal | Attributes, life, all resist +30. |
| **Wealth** | 3 armor | Lem + Ko + Tir | 100% magic find. A swap chest. |
| **Zephyr** | 2 bow | Ort + Eth | 25% IAS, 25% run, a little lightning. The bow before Buriza. |
| **Steel** | 2 melee | Tir + El | 25% IAS, open wounds. The first socketed weapon. |

Shael in a weapon is increased attack speed, in armor or a helm faster hit recovery, in a shield faster block. That single rune teaching three different lessons is worth stealing. The phrase should depend on the slot.

### Later-era, optional

Do not build the 1.08 ode out of these. A couple are worth stealing later because they are good game design. They are not what this list is for.

| Item | Patch | Why it is here |
|---|---|---|
| **Enigma** | 1.10 runeword (Jah + Ith + Ber) | +2 skills, teleport on every class, strength per level, magic find. It ended "the sorceress is the one who teleports." Copying it would flatten party roles. |
| **Spirit** | 1.10 | +2 skills and 25–35% cast rate on a cheap sword or shield. It retired Lidless, HoZ's cast-rate job, and a lot of rare jewelry. |
| **Arachnid's Mesh** | 1.10 unique belt | +1 skills, 20% cast rate. The caster belt after Goldwrap. |
| **Lightsabre** | Published block is **1.10 or later** (Summit elite swords, Phase Blade): ignore target defense, 25% lightning absorb, 20% IAS, mana leech. | The whirlwind sword. Ignore-defense mattered because attack rating was a tax. This game has no such tax. |
| **The Gnasher's published mods** | 1.10 block, see above | Keep the early-game crushing-blow fantasy. Do not treat the 1.10 numbers as 1.08 canon. |
| **Gheed's Fortune** | Unique grand charm, 1.10-era | Magic find, gold, vendor discount, in the charm inventory. A fine subscription, if it is built as one. |
| **Ethereal** | 1.10 | Indestructible on a mercenary, or Zod. This game has no durability. Skip it. |
| **Rainbow facets, skillers-as-currency, Annihilus, Torch** | 1.10 | The second economy, after SoJ was burned down. |

### What that era rewarded

A 1.09 character was a stack of breakpoints and a few uniques, not a completed set.

- **Faster cast rate** had hard plateaus. A sorceress lightning build wanted 63 or 105. Vipermagi (30) plus a ring and Magefist was a puzzle with a right answer.
- **Faster hit recovery** was the same puzzle for anyone who got hit. Bloodfist existed to solve the first step.
- **Life leech and mana leech worked on physical damage only**, at full strength in Hell. 1.10 cut leech to 1/2 in Nightmare and 1/3 in Hell. The 1.09 melee fantasy is "I heal when I hit."
- **Crushing blow** took a fraction of current life. It was the boss stat. 1.08 had already halved it on bows, because Windforce plus crushing blow was too much.
- **Deadly strike** doubled physical damage. It rolled separately from critical strike.
- **Open wounds** was a bleed that turned monster regen off.
- **Damage reduced by X%** capped at **50**, and it was physical only. Integer "damage reduced by N" and "magic damage reduced by N" were separate and did not cap the same way.
- **Cannot be frozen** was almost mandatory. One ring, one shield, or one armor solved it.
- **+skills** on a rare amulet could be +2 from 1.08's own notes. On a unique, +1 was a ring and +2 was a helm or amulet. Items did not grant a skill you had never put a point in, for the purpose of unlocking the tree. They did let you use it.
- **Requirements** were strength and dexterity. The puzzle was "enough to wear the piece, everything else in vitality."
- **Five stat points and one skill point per level.** No respec until 1.13, in 2010.
- **Magic find** did not change whether an item dropped. It changed the quality roll, with diminishing returns: unique effective find is `MF × 250 / (MF + 250)`, set uses 500, rare uses 600, magic is linear. 100 find is a big jump. 400 to 600 is almost nothing. People aimed at about 300.
- **No-drop and party size.** More players in the area meant more rolls, not better quality. Loot was free-for-all. The Arreat Summit taught etiquette because the game did not assign drops.
- **Gambling** (Gheed) could produce uniques from 1.09, on the order of 1 in 2000, and you could aim at a base type. **Larzuk** in Act V added sockets. The "uniques get exactly one socket" rule is the later, familiar one. 1.09 also added a cube recipe that rolled a random socket count.
- **Elite bases shipped with 1.08**, not 1.09. 1.09 retuned their damage. Normal / exceptional / elite is the whole expansion, from day one.

## 2. Throwback counterparts

Names are homages in this setting's voice. They are not Blizzard names with the serial filed off, and they are not the names already in `UNI`.

### Keys that already exist

From `AFX` / `STATK` in `src/p1.js`, plus the typed keys built next to them:

| Key | What the player sees | Use it for |
|---|---|---|
| `dmg` | +% enhanced damage | Windforce, Grandfather, Gore's damage half |
| `hp`, `en` | flat life, flat energy | Shaftstop's +60, jewelry |
| `leech` | % life stolen per hit | Gaze, String, BK, Titan's |
| `aspd`, `mspd` | attack speed, run speed. Run speed caps at 50 in `calc`. | Goldwrap, Cat's Eye, Gore |
| `crit` | deadly strike | Highlord's, Gore |
| `mf`, `gold` | magic find, extra credits | Gull, Shako, War Traveler, Nagel, Goldwrap |
| `skills` | +N to all skills. Affix exists but only at +1, weight 0.25, amulet / helm / weapon, item level 8. | SoJ, Mara, Shako, Viper. Uniques may roll 2. The affix should stay at 1. |
| `regen`, `regenH` | energy per second, replenish life | Magefist, Tal's 2-piece |
| `thorns`, `shock` | attacker takes damage, flat shock | Stormshield's lightning thorns, SoJ's little lightning |
| `armorP`, `armor` | percent armor, flat armor on jewelry | almost every armor unique |
| `stun` | chance to stun | a pale knockback |
| `t_impact` `t_surge` `t_rust` `t_heat` `t_noise` | Tuned, +% of that type | class weapons, Magefist's fire |
| `r_impact` `r_surge` `r_rust` `r_heat` `r_noise` | of Proofing | single resists |
| `r_all` | of Coverage, **PR #82, not on this branch** | Vipermagi, Mara, Tal's full set. Weight 0.3, shares a group with Proofing so an item cannot have both. |
| `cdr` | faster skill recovery, **already honored in `calc` and capped at 60% of the cooldown**, but **not an affix**. It arrives from Overclock, Fine Print, doctrines, the web. | Vipermagi, Oculus, Magefist, Lidless. Add it to `AFX`. |

Unique-only behavior in this game is a string `sp` and a flag `S.sp[id]`, checked by name (`nda`, `cloud9`, `fineprint`, `repair`, `terms`). Knockback, blink, cannot-be-slowed, and "explode on kill" should follow that pattern. Do not invent a generic key for a behavior one item has.

Class uniques already use `cls` and `grant: [skillIndex, rank]`. A throwback that should wake up in one pair of hands should do the same, and stay useful (find, resists, life) in the wrong hands. That is how Arreat's Face and HoZ worked: greedy on the class, wearable by others only when the base allowed it.

### Keys to add

Propose these as real `AFX` or unique-mod keys. Names in **bold** are new.

| Key | Meaning | Cap and notes |
|---|---|---|
| **`pdr`** | Percent of damage removed after resists and before armor. | **Cap 50**, same as 1.09. Applies to every combat type. Impact-only reduction would be a dead stat: Ticks are heat, Sirens are noise, Aegis drones are surge (`ETY` in `src/p10.js`). |
| **`cdr`** | +% faster skill recovery, as an affix. | The cast line already does `cd * (1 - min(0.6, S.cdr))`. Tiers: 8–12 on gloves, 15–20 on armor and orbs, 8–12 on amulets. A unique may roll 25 or 30. Two uniques must not be able to hit the 60 cap alone. |
| **`hpL`**, **`enL`** | Life or energy per level, added in `calc`. | Shako's identity. A helm with +1.5 and a ring with +0.5 is the whole budget. |
| **`enPct`** | Percent maximum energy, added after the base pool, **summed** the way Frostburn and SoJ summed. | Cap the gear total at 80%. |
| **`enKill`** | Energy after each kill. | Oculus, Lidless. |
| **`enleech`** | Percent of damage dealt returned as energy. | Manald. Does not work on Sound, same as life leech should not. |
| **`mgt` `ref` `vit` `bnd`** | + to Might, Reflex, Vitality, Bandwidth. Fold into the same formulas as `G.at` (+1.5% damage, +0.3% crit and +1 armor, +4 life, +3 energy). | Shako's +2 all attributes, Mara's +5, Grandfather's +20. |
| **`cb`** | Crushing blow. On proc, bonus hit equal to a fraction of **current** life, as Impact. | 12% of current life in melee, 6% for throws, **2% against players**. Cap the chance at 60 from gear. Bosses included. This is the Gore Rider / Gnasher stat. |
| **`ow`** | Open wounds. A short rust bleed that sets the existing no-heal flag. | So a boss that would mend cannot, for a few seconds. Small damage. |
| **`abs_surge`** (and the other four, not Sound) | Percent of that type taken and then returned as life, after resists. | Thundergod. 20 is a unique. Do not put it on magic items above 5. |
| **`noslow`** | Cannot be slowed. | Raven Frost, and The Offer already does this as a one-off. A key lets both share code. |
| **`sk_<class>`** | +N skills for one class. Ignored on the wrong class. Does not unlock a tree branch the player has not spent a point in. | Arreat, HoZ, Titan, Oculus, Leaf. |
| **`fhr`** | Faster recovery. Shortens stun and flinch. | Bloodfist, Arreat. Three soft steps (15 / 30 / 50), not a 20-row breakpoint table. |

Do not add attack rating, dexterity requirements on every piece, or durability. Attack rating was the tax that made Angelic and Raven Frost mandatory. This game connects. Leave it that way. Eaglehorn's "ignore defense" has nothing to ignore.

There is no shield slot (`SLOTS` is weapon, helm, armor, gloves, boots, belt, ring, amulet). Stormshield, Lidless, HoZ, and Rhyme have to live on armor, a helm, or an amulet until an off-hand exists. An off-hand is a Could, and it is a large UI change on a phone. The counterparts below do not wait for it.

### The items

Rough item level is the unique's `il` in `UNI`. `mkFixed` already scales a few mods up when the drop's level is higher. Drop tier is which treasure class may roll it (section 4). "Familiar" is the hook, in one line.

Boss-only stays rare. Most of these are world uniques. A few are the boss's signature, the way Exit Interview already is.

**1. Force Majeure** — Windforce. Weapon, launcher family (`FAM.sling` bases; the top one is Last-Mile Cannon). Runner wakes `sk_courier` +1. Item level 70. TC late (Act V, or any district once monster level is 62+).

- Mods: `dmg` 180–250, `aspd` 15–20, `enleech` 6–8, `mgt` 8–12, `ref` 4–8.
- Special `sp: 'majeure'`: hits knock ordinary machines back. Bosses, lieutenants, and players get a short shove, and a second shove inside 1.5 seconds does nothing. Players with `noslow` ignore it.
- Flavor: "An act of God, as defined by the party that can afford the lawyer."
- Familiar because the bow pushes the room off you, and it steals the resource you spend to keep shooting.
- Risk: on a Runner who already dashes, knockback plus speed is a PvP stunlock. The shove cap is the mitigation. Do not add crushing blow to this weapon. 1.08 already learned that.

**2. The All-Hands** — Harlequin Crest. Helm, Praetor Visor or Halo Circuit. No class. Item level 62. TC late.

- Mods: `skills` 2, `hpL` 1.5, `enL` 1.5, `pdr` 10, `mf` 40–50, `mgt` 2, `ref` 2, `vit` 2, `bnd` 2.
- Flavor: "Attendance was mandatory. The hat was not. Everyone wore it anyway."
- Familiar because it is the slightly embarrassing helm that makes every build better, and the life grows as you do.
- Risk: +2 skills on a helm plus a +1 ring plus a +2 amulet is +5, which this game's skills were not budgeted for. Cap **+skills from gear at +4**, and let the All-Hands be 2 of them. The 1.08 version's +40% life is intentionally not copied.

**3. The Unspent Output** — Stone of Jordan. Ring, Signet Chip. No class. Item level 29. TC mid, and also a boss-rare from Nonce's side of the story, not from every champion.

- Mods: `skills` 1, `enPct` 25, `shock` 4–10, `en` 15–25.
- Flavor: "It has not moved. That is the entire value."
- Familiar because it is the ring casters wear and the chip the economy quotes.
- **Currency rule.** Extras in the lockbox are not gear. They are the unit. Nonce prices a short list in outputs ("the coat is 6"). Players can pay each other in them through the account server, which mints and destroys the receipt. The client-side item is a picture of that receipt. A second equipped ring slot is not required and should not be added to make this work: you wear one, you stack the rest. See section 4.
- Risk: +1 skills is already a large unique mod (`skills` weight 0.25 on rares). A ring that also becomes money will be duped if the server does not own the count. Do not ship the ring before the receipt exists.

**4. Remote Hands** — The Oculus. Weapon, Deck family, Technomancer. Item level 42. TC mid.

- Mods: `sk_hacker` 3, `enKill` 5, `r_all` 15–20, `cdr` 25, `vit` 15, `bnd` 15, `mf` 40–50.
- Special `sp: 'remote'`: when struck, 25% chance to dash about three paces along your facing. PvE internal cooldown 2 seconds. **PvP cooldown 6 seconds**, and it will not fire while you are stunned. It is a step, not a random town portal.
- Flavor: "You were at your desk. The desk disagrees."
- Familiar because the orb is +skills, cast rate, find, and the flinch that moves you.
- Risk: a random blink made 1.09 duels a coin flip. The facing dash and the PvP cooldown are the correction. Do not blink allies.

**5. The Rate Card** — Skin of the Vipermagi. Armor, Courier Mail or Aegis Shell. No class. Item level 29. TC mid. This is the coat people should find in Act II and wear into Act IV.

- Mods: `skills` 1, `armorP` 80–120, `r_all` 20–30, `cdr` 25, and a small flat reduction that can live as `pdr` 4 until a separate magic-reduction key exists. Do not also roll `of Proofing`. PR #82 already forbids `r_all` and Proofing together.
- Flavor: "The rate is the rate. The coat just itemises it."
- Familiar because one armor finishes cast rate and resists for a caster.
- Risk: `r_all` 30 plus the Brutal −50 cut is still −20 before other gear. That is correct. Do not "fix" it by raising the roll. The 1.08 version without +skills is the wrong one to copy. People wore the 1.09 coat.

**6. The Night Audit** — Vampire Gaze. Helm, Riot Helm. No class. Item level 41. TC mid-high. Competes with the All-Hands on purpose. Melee wears this. Casters wear the hat.

- Mods: `armorP` 80–100, `leech` 6–8, `enleech` 4–6, `pdr` 12–18, `shock` replaced by a small rust or surge chip: `t_rust` is wrong (that is percent). Use a new flat `chip` only if needed; otherwise `shock` 6–16 retinted in the flavor as a cold lamp, and accept that `shock` is untyped extra damage today.
- Flavor: "They close the books at night. Something else opens them."
- Familiar because you heal when you hit, and the hits that land on you are smaller.
- Risk: 8% leech with no Hell penalty, on top of Overtime's leech, is a full heal per swing. Cap **life leech from all sources at 15% against machines and 4% against players.** Count this helm inside the cap.

**7. The Indemnity** — Stormshield. Armor, Seraph Plate (there is no shield). No class. Item level 68. TC late.

- Mods: `pdr` 25 (not 35; one armor at 35 plus the Night Audit at 18 is the cap on two pieces, and 35 was a shield you gave up an off-hand for), `r_heat` wait, the real item is cold and lightning: `r_rust` is not cold. Map cold to a resist this game has. Surge is the lightning. Use `r_surge` 20 and `r_heat` 0. Add `mgt` 20–30, `thorns` 8–14, `armorP` 80–120.
- Special: attacks against you cannot crit. That is the block fantasy without a block stat.
- Flavor: "The policy pays. It does not pay all of it. Read the exclusion."
- Familiar because a huge share of every hit simply is not there, and you still want a Ground Strap when the surge specialists show up.
- Risk: 25 `pdr` plus 75 resist is 12.5% of the original hit before armor. On Brutal the resist cut keeps that honest. On Normal it is a wall. **`pdr` above 15 should require item level 60+**, so Act I never sees it.

**8. The Coupon** — Gull. Weapon, Box Cutter or Letter Opener. No class. Item level 4. TC early only. It must leave the pool by monster level 20, or it will be the unique Act V keeps dropping.

- Mods: `mf` 80–100, `en` −8 as a negative roll, `dmg` 0–10.
- Flavor: "Expires. Not accepted on the thing you actually wanted."
- Familiar because you swap to it for the last hit on a lieutenant. The game should make that swap easy: a single "coupon" button that equips it and equips the previous weapon again after the next kill. That is the 1.09 ritual, and on a phone it will not happen unless it is one tap.
- Risk: 100% find on a weapon you forget to swap back. The button solves that.

**9. Frozen Payroll** — Frostburn. Gloves, Work Gloves or Rivet Gauntlets. No class. Item level 29. TC mid.

- Mods: `enPct` 35–40, `dmg` 4–8, `shock` 1–6.
- Flavor: "Paid in cold. Spends the same."
- Do not name it Cold Wallet. That belt exists (`coldwallet` in `src/p10.js`).
- Familiar because the pool gets deeper, and it stacks with the Unspent Output the way Frostburn stacked with SoJ.
- Risk: `enPct` 40 plus the ring's 25 is +65% energy, which makes Technomancer's energy-as-life (`Cipher Ward`) much stronger. The 80% gear cap is the line.

**10. The On-Call** — Magefist. Gloves. Technomancer wakes `sk_hacker` +1 and the regen. Other classes get the cast rate and the regen only. Item level 23. TC early-mid.

- Mods: `cdr` 15–20, `regen` 2–3, `t_heat` 15–25.
- Flavor: "They said it could wait until Monday. It could not."
- Familiar because the gloves are how a caster hits the next cast step.

**11. The Expense Account** — Goldwrap. Belt. No class. Item level 27. TC mid.

- Mods: `aspd` 8–12, `mf` 25–35, `gold` 50–80.
- Flavor: "Itemised. Approved. Someone else's."
- Overlaps Last Honest Review (a ring with crit and magic find) and Orange Pill. The belt is the one you wear while you farm. The rings do other jobs.
- Risk: with the Coupon and a find helm, magic find crosses 200 easily. That is fine. The curve is already diminishing. Do not also put 50% find on the boots and the amulet in the same outfit without checking the section 4 table.

**12. The Finder's Fee** — Nagelring. Ring. Item level 8. TC early, and it must age out.

- Mods: `mf` 15–30, `thorns` 2–5.
- Flavor: "A small consideration for making the introduction."
- The early find ring. Two of them was the 1.09 outfit. This game has one ring slot, so the fee is what you wear until the Unspent Output. That is a better curve than two identical rings.

**13. The Draw** — Manald Heal. Ring. Item level 15. TC early-mid.

- Mods: `enleech` 4–7, `regenH` 2–4, `regen` 1–2, `hp` 15–25.
- Flavor: "The account refills when you hit something. The account is not yours."
- Familiar because a melee energy pool stops being the reason you stand there swinging the basic attack.

**14. The Vesting Schedule** — Bul-Kathos' Wedding Band. Ring. Item level 55. TC high.

- Mods: `skills` 1, `hpL` 0.5, `leech` 3–5.
- Flavor: "You do not own it yet. You will."
- The melee answer to the Unspent Output. A fighter should not have to wear the caster ring.
- Risk: +1 skills and leech on the same ring is the best melee ring by a distance. Keep the Unspent Output better for casters (the energy percent) so they do not also want this.

**15. The Five-Way** — Mara's Kaleidoscope. Amulet. Item level 64. TC late.

- Mods: `skills` 2, `r_all` 18–25, `mgt` 5, `ref` 5, `vit` 5, `bnd` 5.
- Flavor: "Five markets. One neck."
- Familiar because the amulet is where a finished resist sheet and two skills come from.
- Risk: together with the All-Hands this is +4 skills before a ring. The +4 gear cap binds here. The amulet should be allowed to be the +2, and the helm the other +2, and the ring then does not fit. That is a real choice. Good.

**16. The Closing Bell** — Highlord's Wrath. Amulet. Item level 60. TC high. The melee amulet, opposite the Five-Way.

- Mods: `skills` 1, `aspd` 15–20, `crit` scaling as `crit` 4 plus a special: +0.25 deadly strike per level (handle in `calc` from `sp: 'bell'`), `r_surge` 25–35, `shock` 8–20, `thorns` 8–12.
- Flavor: "Nothing good happens after the close. That is when the work starts."

**17. The Dispatch** — The Cat's Eye. Amulet. Runner, but the stats work for anyone. Item level 48. TC high.

- Mods: `mspd` 20–25 (the global run cap is 50, so this is half of it), `aspd` 15–20, `ref` 15–25.
- Flavor: "You were already late."
- No skills, on purpose. Speed is the identity.

**18. The Freeze-Frame** — Buriza. Weapon, launcher. Runner gets +1 `sk_courier` and the pierce special. Item level 44. TC mid-high. The bow you use until Force Majeure.

- Mods: `dmg` 120–180, `aspd` 30–40, `ref` 20–30, `t_rust` or a cold reading of surge: apply slow. Use `sp: 'frame'`: hits chill for 2 seconds and punches through, using the existing `pierce` stat at 100 for the wearer while it is equipped.
- Flavor: "Hold still. The invoice is not finished."
- Risk: 100% pierce on a Runner who already pierces from Deadeye is a screen clear. Cap pierce at 100, do not add them.

**19. The Senior Tranche** — The Grandfather. Weapon, Sign family, the slow maul (Girder / Wrecking / Picket). Scrapper gets the stun from the family plus `sk_scrapper` +1. Item level 78. TC late, and it should be the rarest weapon in that band. This is the maul Wes did not find.

- Mods: `dmg` 160–240, `hp` 70–100, `mgt` 15, `ref` 15, `vit` 15, `bnd` 15, `crit` 6–10.
- Flavor: "The old instrument. It does not know the company has changed hands."
- Risk: +20 to all attributes was a requirement solver in a game with strength gates. Here it is a large pile of damage, life, crit, and energy. Drop the attributes to +12 if the first playtests one-shot lieutenants. The enhanced damage is the fantasy. The attributes are the trophy.

**20. Restock** — Titan's Revenge. Weapon, launcher. Runner only for the special. Item level 46. TC mid-high.

- Mods: `sk_courier` 2, `dmg` 100–150, `leech` 5–8, `mgt` 12, `ref` 12.
- Special: throws that cost a resource refund a charge on hit, and Scatter Shot fires one extra blade. Do not rename it Return to Sender. That skill exists.
- Flavor: "You sent it back. They billed you for the privilege."

**21. The Ground Strap** — Thundergod's Vigor. Belt. No class. Amazon-style bonus: a Technomancer wearing it gets `t_surge` 20. Item level 50. TC high.

- Mods: `abs_surge` 15–20, `r_surge` 10, `mgt` 12–18, `vit` 12–18, `shock` 10–30, `armorP` 60–100.
- Special: when struck by surge, a small nova. PvP: the nova does not hit players. Absorb still does.
- Flavor: "Touch the chassis. Not the other way around."
- This is the answer to Aegis drones and to the Indemnity not covering surge.

**22. The Open Minute** — Lidless Wall. Amulet, because there is no shield. Witness or Technomancer wakes +1 class skills. Anyone gets the rest. Item level 36. TC mid. The caster amulet before the Five-Way.

- Mods: `skills` 1, `cdr` 15–20, `enPct` 10, `enKill` 3–5, `bnd` 8–12.
- Flavor: "The minute you were not in the room for. It still counts."

**23. The Picket Visor** — Arreat's Face. Helm. Scrapper. Item level 44. TC mid-high.

- Mods: `sk_scrapper` 2, `leech` 4–7, `r_all` 20–25, `mgt` 12, `ref` 12, `fhr` 30, `armorP` 80–120.
- A second Scrapper skill line, `grant` on Solidarity or Hold the Line, only if the +2 is not enough of a class gift. Do not do both.
- Flavor: "The face of the line. Management has a poster of it."
- Risk: overlaps the Night Audit and the All-Hands. Three helms at this tier is correct. They should not share a treasure class with equal weight. The visor is heavier in Scrapper games, the Audit in everyone else's, the All-Hands only in the late class.

**24. The Gilded Agenda** — Herald of Zakarum. Armor. Founder, and the Maximalist may wear it once the story unlocks him. Item level 48. TC high.

- Mods: `sk_founder` 2 (Maximalist: `sk_maxi` 2 instead, one or the other based on who equips it), `r_all` 25–35, `hp` 40–70, `armorP` 80–140.
- Special `sp: 'agenda'`: a thin aura, weaker than any Maximalist aura, that gives allies inside a few paces +10% damage reduction from `pdr` (and this **does** count toward the 50 cap) and +8% damage. It does not stack with a second Agenda. It does not stack with Marked to Market. The stronger aura wins.
- Flavor: "All in favor. The minutes will reflect that you were."
- Risk: an aura on a drop is how 1.10 paladins got replaced by gear. Keep the numbers small. The class aura is still the reason you bring a Maximalist.

**25. The Loss Leader** — String of Ears. Belt. Item level 32. TC mid.

- Mods: `leech` 6–8, `pdr` 10–14, `hp` 20–40.
- Flavor: "Sold below cost. The cost is you."
- The melee belt. Competes with the Expense Account (find) and the Ground Strap (absorb). Three belts, three jobs.

**26. The Mesh Clause** — Shaftstop. Armor. Item level 40. TC mid-high. The physical coat before the Indemnity.

- Mods: `pdr` 20–25, `hp` 50–80, `armorP` 100–140.
- Flavor: "Coverage applies to impact. The other four types are a separate schedule."
- If `pdr` is all-type, the flavor line is a lie. Either make this the one `pdr` piece that is Impact-only, or change the line. Recommend Impact-only for this piece and all-type for the Indemnity, so they are not the same coat twice. An Impact-only key is `pdr_impact`.

**27. The Closer** — Gore Rider. Boots. Item level 52. TC high.

- Mods: `mspd` 20–25, `cb` 12–15, `crit` 12–15, `ow` 8–12.
- Flavor: "They send the closer when the meeting has already failed."
- Risk: crushing blow plus deadly strike on boots, worn with the Senior Tranche, deletes bosses. Cap boss-life damage from `cb` at 8% of current life per second, so a fast weapon cannot proc it four times a second for 48%.

**28. The Per Diem** — War Traveler. Boots. Item level 46. TC high.

- Mods: `mspd` 18–22, `vit` 8–12, `mgt` 8–12, a flat damage add (new key **`flat`**, +12–22, added after percent damage), `mf` 25–40.
- Flavor: "The day rate. The day was longer than the rate."
- Find boots that a physical build does not take off. That is the whole design.

**29. The Thaw** — Raven Frost. Ring. Item level 45. TC high.

- Mods: `noslow` 1, `ref` 12–18, `en` 30–40, `abs` of one type at 10 (pick rust, as the cold reading), `crit` 3–6.
- Flavor: "The freeze comes off the account at dawn. You are not the account."
- The Offer (`offer`, boss ring) already prevents slow and energy drain, with crit and find. The Thaw is the one people find in the world. The Offer stays better and rarer. Do not let both be common.

**30. The Sure Posting** — Eaglehorn's job, without its unverified numbers. Weapon, launcher. Item level 36. TC mid. Out of the pool once Force Majeure's class is open.

- Mods: `dmg` 80–120, `crit` 8–12, `aspd` 10–15, `pierce` 30.
- Special: the first hit on a machine that has not been hit yet is a deadly strike. Ten Minutes (`tenmin` in `src/p11.js`) already does +60% damage to a machine you have not hit. Do not stack the fantasy twice on the same slot in the same act. Put this one in Act II and Ten Minutes in Act V.
- Flavor: "It arrives. That part is not in dispute."

**31. First Shift** — the early crushing-blow axe, which is the part of The Gnasher worth keeping. Weapon, Sign. Item level 6. TC early only.

- Mods: `dmg` 40–60, `cb` 15–20, `mgt` 6–10.
- Flavor: "They handed you the axe and the shift. They did not hand you the rest."
- `cb` at item level 6 must use the 8%-of-current rule and the per-second cap, or Act I bosses fall over.

### Sets

Partial bonuses should fire from `calc` the way Striker's Vigil already does (`s.set.striker >= 2` adds damage, `>= 3` adds a skill and a kill-heal). Keep that shape. A partial should be worth wearing. The full set should be worth finishing on one class and merely good on the others.

**The Striker's Vigil** stays. It is already Sigon's: three early pieces, a 2-piece damage bonus, a 3-piece skill and a heal on kill. Do not add another early melee set. If it needs anything, it is a fourth piece at item level 14 (a belt) so Act I has a little more of it, and a note in the treasure class that its pieces drop often and together. Right now a set roll picks one of the three at random (`makeItemCore` when `q === 3`), so finishing the set is a coin flip across the whole game. **A set drop should prefer a piece the character does not have equipped or stashed.** That one change makes sets feel like 1.09.

**The Orientation** — Cathan's, for the first caster. Three pieces, item level 8–14. TC early.

| Piece | Slot | Mods |
|---|---|---|
| Badge | helm | `en` 15–25, `r_surge` 10–16 |
| Lanyard | amulet | `skills` 1, `regen` 1 |
| Vest | armor | `cdr` 8–12, `hp` 20–30 |

- 2 pieces: `regen` +1.
- 3 pieces: `sk_hacker` +1, and `r_all` +8.
- Flavor on the vest: "Day one. The vest is the wrong size. The badge works."
- Any class may wear it. Only a Technomancer gets the third skill point.

**The Schema Wrappings** — Tal Rasha. Five pieces. Item level 28–48. TC mid, with the armor the common piece and the weapon the rare one.

| Piece | Slot | Mods on the piece |
|---|---|---|
| The Mask | helm | `leech` 4–6, `enleech` 4–6, `mf` 20–30 |
| The Coat | armor | `r_all` 15–25, `armorP` 60–100, `mf` 20–30 |
| The Cloth | belt | `enPct` 10–15, `regen` 1–2, `pdr` 4 |
| The Adjudication | amulet | `sk_hacker` 1, `skills` 1, `hp` 30–50 |
| The Eye | weapon, Deck | `sk_hacker` 2, `cdr` 15–20, `mf` 15–25 |

- 2 pieces: `regenH` +4.
- 3 pieces: `mf` +40. This is the reason a Scrapper wears the mask, the coat, and the belt.
- 5 pieces, Technomancer only: `skills` +1 more, `r_all` +15, and a visible idle effect. Other classes wearing all five get the 3-piece find and nothing else from the full set. Finishing it on the wrong class is a costume.
- Flavor, on the coat: "Three pieces and the room starts paying you to be in it."
- Risk: +40 find on top of the pieces' own find is a lot, and it is supposed to be. It replaces a dedicated find outfit. It should not also be the best combat coat. The Rate Card remains the caster coat if you are not building the set. Do not let the Coat roll `cdr`. That job stays on the Rate Card and on the Eye.

**The Old Guard** — Immortal King. Five pieces a Scrapper finishes, one maul the treasure class almost never rolls. Item level 50–78. The maul is item level 78 and weight 1 against the other pieces' weight 4.

| Piece | Slot | Mods |
|---|---|---|
| The Visor | helm | `armorP` 60–90, `fhr` 20, `hp` 40–60 |
| The Coat | armor | `armorP` 100–150, `hp` 60–100, `pdr` 8 |
| The Belt | belt | `leech` 3–5, `mgt` 10–15 |
| The Gloves | gloves | `aspd` 10–15, `cb` 8–10 |
| The Maul | weapon | `dmg` 140–200, `cb` 15, `leech` 6–8, `sk_scrapper` 1 |

- 2 pieces: `crit` +3. Weak, on purpose.
- 3 pieces: `hp` +40. Still not a reason to wear three random pieces.
- 5 pieces, Scrapper: `skills` +2, `leech` +4, `pdr` +10, and allies within a few paces take 8% less damage (inside the `pdr` cap). Other classes wearing the maul get a large weapon and no set gift.
- Flavor, on the maul: "Months. He never found it. Someone else had, and the work was real."
- The maul is allowed to be the rarest non-boss unique in the game. A player who clears Act V on tier 0 should not expect it. A player who runs the late districts on the next tier should see one in a long weekend of champions, at the rates in section 4. If it never drops, the Wes story is a complaint. If it drops twice, it is not the story.

**The Countersign** — Angelic, compressed. Ring and amulet, item level 18. TC early-mid.

- Ring: `crit` 3–5, `hp` 15–25.
- Amulet: `mf` 10–15, `hp` 15–25.
- 2 pieces: `crit` +6, `aspd` +8.
- This is the attack-rating set translated into the stats this game actually uses. Two pieces, then you are done. Hybrids can hit. That was the whole Angelic trick.

### Seed-word phrases worth adding

`PHRASES` in `src/p6.js` already has six. **Full Node** (helm, `island` + `kernel`) is Lore: magic find, crit, and +1 skills. **Longest Chain** is a run-speed helm. **Cold Storage** is a life armor. Do not add a second Lore.

Three holes, using words that already exist where the order can be made unique:

| Phrase | Slot | Words | Mods | The 1.09 original |
|---|---|---|---|---|
| **Quiet Hours** | armor, 2 sockets | `ladder`, `candle` | `mspd` 15, `cdr` 15, `regen` 1, `fhr` 15 | Stealth. The armor before the Rate Card. |
| **Kindling** | weapon, 2 sockets | `forge`, `candle` | `sk_hacker` 2, `t_heat` 30, `enKill` 2 | Leaf. Needs the class-skill key. |
| **Standing Order** | helm, 2 sockets | `island`, `border` | `noslow` 1, `mf` 20, `r_all` 10 | Rhyme's job, on a helm, because there is no shield. Rhyme was Shael + Eth. Shael's lesson (the same word does a different thing in a different slot) wants a **new word**, `shael` in spirit, named **`quorum`**: in a weapon it grants `aspd` 10, in armor or a helm `fhr` 15, in a future off-hand a small `pdr` or dodge. One word, three lessons. |

`socketWord` already completes a phrase only when the sockets are full and the order matches. Keep that. A wrong order should keep the individual word bonuses and not be a dead item. It already works that way.

White items socket at 40% (`makeItemCore`), magic at 15% for one socket, and rares, sets, and uniques do not roll sockets. The Larzuk fantasy is the craft verb `addsoc` (12 parts, cap 2 on helms and 3 on weapons and armor). Restrict that verb on uniques and sets to **one** socket. A Force Majeure with three words in it is a different game.

### Party and PvP, on the items that need a rule

PvP damage is already a quarter (`MP.pvpScale = 0.25` in `src/p13.js`), which is the 1.09 scalar. Keep it. The new items break it unless the following travel with them.

- `pdr` caps at 50 against machines and against players. No exception for the Agenda aura.
- Life leech caps at 15% in PvE and **4% in PvP**. Energy leech at 8% and 2%.
- Crushing blow against players is 2% of current life, and only once a second.
- Knockback against players is the short shove, with a 1.5 second gate.
- Remote Hands blinks on a 6 second PvP cooldown, along facing, and never while stunned.
- The Agenda aura does not crit, does not leech, and does not stack with Marked to Market or a second Agenda.
- +skills from gear caps at +4. Class-skill keys count toward that cap.
- `noslow` does not grant stun immunity. The Offer can keep its stronger version as the boss ring. The Thaw only stops slows.

Party loot is free-for-all, and `partyDropN` only adds rolls (it shrinks the "nothing" weight). That matches 1.08, and it is why 1.08 parties needed etiquette. On a phone, etiquette loses to the person standing on the beam. **A unique or a set piece is visible only to the killer for 8 seconds, then to everyone.** Credits, sats, and magic items stay free-for-all, so the screen still looks shared. The killer's hireling counts as the killer. A party member who landed a hit in the last 3 seconds shares the window. That is enough synergy to make "I helped" true, without a master-looter menu.

The Gilded Agenda is the party item. Schema Wrappings' 3-piece find is the party-farmer item, and it should not raise the whole party's find. Find is personal. Auras are shared. That split is the one 1.09 paladins already understood.

## 3. How items work today

### Making an item

`makeItem` calls `makeItemCore` and then every `ITEM_HOOKS` entry. The hooks in play are `fixTypes` (a rolled `t_x` / `r_x` becomes a real type) and `famify` (some weapons become a class family).

`makeItemCore(il, q, slot)`:

- `q` 4 is unique. It picks from `UNI` where `il` is at most the drop level + 2, the unique is not `bossOnly`, and the slot matches if one was forced. If nothing matches, it demotes to rare.
- `q` 3 is set. It picks from `SETS.striker.items` only. There is no item-level filter. Any set drop can be a level 2 placard in a level 70 zone.
- Otherwise it picks a slot from `SLOTW` (weapon 18, most armor 12, amulet 10), a base from `BASE[slot][tierOf(il)]`, and affixes.

`tierOf` is 0 below 7, 1 below 15, 2 below 22, and 3 after that. There are four base names per slot and then the names stop. A level 70 weapon is a Void Razor or a Titan Maul with bigger numbers (`baseStats`: damage `(3+1.6×il)` to `(6+2.6×il)`, times the base's damage factor). Acts IV and V do not get new bases. They get larger versions of the Act II ones.

Quality on a random piece:

- White (`q` 0): the base name, no affixes. About 40% of weapons, helms, and armors roll 1–3 sockets (helms cap at 2).
- Magic (`q` 1): one prefix and/or one suffix. The prefix table excludes anything with a `w` weight, which is how `skills` (weight 0.25) stays off magic items. About 15% get one socket. About 30% of magic-and-up weapons that are not uniques roll a damage type (`surge`, `rust`, `heat`, `noise`). Impact is the default when they do not.
- Rare (`q` 2): 3 to 5 affixes, weighted by `w` (default 1). Name is `RN1` + `RN2`.
- Set and unique go through `mkFixed`: roll each `mods` range, scale a few keys up by 4% per item level over the unique's own `il`, attach `sp` and `fl`.

`rollAffix` uses the highest tier the item level allows 55% of the time, and a random legal tier otherwise. So a level 40 weapon usually rolls Apocalyptic if it rolls enhanced damage, but not always. Good. Keep it.

Affix groups do not exist yet, except the resist group PR #82 adds. A rare can roll enhanced damage and Tuned and shock and leech and crit, and it can also roll two different resists only because they are different keys. It cannot roll the same key twice, because the pool removes a key once used. PR #82's `grp: 'res'` is the right idea and should extend to a few more groups: one speed suffix, one leech suffix, one "of the whale" life suffix.

Requirements are `max(1, floor(il × 0.75))` for random items and `floor(unique.il × 0.75)` for uniques. Level only. No Might gate, no Reflex gate. Equip fails the level check and the identify check (`equipFromBag` in `src/p4.js`).

There is no durability field anywhere in item creation.

### Affixes, as they stand on this branch

`AFX` in `src/p1.js`: enhanced damage, enhanced armor, shock, energy, magic find, thorns, +1 skills, life, life leech, attack speed, run speed, deadly strike, replenish life, energy per second, stun, extra credits, flat armor on jewelry.

`AFX2`: Tuned and of Proofing for the five combat types, four damage tiers up to 51–70 at item level 36, three resist tiers up to 21–30 at item level 24. `t_x` and `r_x` are the rollers. `fixTypes` in `src/p10.js` assigns a free type.

PR #82, from its diff, not from this branch:

- of Proofing gains a fourth tier, item level 36, 31–45.
- `r_all`, prefix-style suffix named of Coverage, weight 0.3, group `res`, slots armor / helm / belt / ring / amulet, tiers 5–8 / 9–15 / 16–20.
- `t_sound` exists so a Maximalist weapon can say so. `r_sound` is migrated off old saves onto a random combat resist.
- `resOf` becomes `clamp(raw − penalty, −100, 75)` with penalties 0 / 20 / 50.

Build the throwbacks against that formula. A Rate Card with `r_all` 25 is 25 on Normal, 5 on Hard, and −25 on Brutal before any other piece. State that on the item tooltip or players will think the coat is broken on Brutal.

### Uniques and the one set

`UNI` in `src/p1.js` is the Act I–III list (the parachute through Exit Interview, including boss-only The Offer, Still Water, Forty-Four Lines, Exit Interview). `src/p10.js` pushes class uniques and a few shared ones (Orange Pill, Cold Wallet, Hash Rate). `src/p11.js` pushes the Act IV–V list, several of them boss-only (The Kitchen Table, The Room). Order of fifty, one set of three.

They already cover some of this note's jobs:

| Already in the game | The itch it scratches | Do not also add |
|---|---|---|
| Last Honest Review | magic find on a ring | a second early find ring with crit |
| The Expense Account (proposed) | find on a belt, which Review is not | — |
| Fine Print | +skills and faster recovery on an amulet | a second generic +skills amulet at the same item level as the Open Minute. Open Minute is item level 36. Fine Print is 18. They are a sequence. |
| The Offer | cannot be slowed, boss ring | a common version of the same ring. The Thaw is the common one and is weaker. |
| Twenty-One Million | a late find ring | — |
| Not Your Keys | a late resist belt (`r_x`) | — |
| Board Seat | life, armor, +1 skills, late armor | — |
| Striker's Vigil | the early melee set | another Sigon's |
| Ten Minutes | bonus against a machine you have not hit | the same special on the Sure Posting in the same act |

The holes, which the counterparts fill: knockback weapon, blink weapon, percent damage reduction, life per level, a ring that is money, a caster coat with all-resist and cast rate, dual leech helm, crushing blow, a find dagger you swap to, partial sets beyond three pieces of one early kit.

### Drops

`TC` in `src/p1.js` is per monster. Each kill makes `picks` rolls. A roll lands on nothing, credits, an item, or a stim, by weight. `partyNoWeight` shrinks the nothing weight when more of the party is in the district. Quality is a separate roll.

`qChance` is the Diablo curve, already:

```
eff = (magic) ? mf : mf × MFK[k] / (mf + MFK[k])
chance = min(1, (1 / q[k]) × (1 + eff/100))
```

with `MFK = {u: 250, s: 500, r: 600}`. Magic find of 0 / 100 / 200 / 300 / 1000 is about 1× / 1.71× / 2.11× / 2.36× / 3× on uniques. The curve is right. Do not replace it.

`rollQ` then draws unique, else set, else rare, else magic, else white, each with a fresh random against that chance. A Tick is `q.u = 500`, so 1 in 500 items is unique before find. A Tick's item weight is 4 in 100, one pick, so a unique is about **1 in 12,500 Tick kills**, and that unique is uniform across every non-boss unique with `il <= monsterLevel+2`. In Act I that pool is already the early story uniques plus the class uniques from `p10.js`. A specific one is tens of thousands of kills. In Act V the pool is every unique in the game except the six boss-only pieces. The Coupon and Force Majeure share a roll.

Worked late-game case. Monster level 70, 0 find, a champion (`q.u = 75`, two picks, first forced to an item, second an item 48% of the time): about one unique per 50 champions, then a 1 in ~40 chance it is the one you want. One specific chase item per **two thousand champions**. That is the Wes problem without the seven-dollar ending, because nobody has the maul to sell.

Bosses are better and still untargeted. Pryce is seven picks at 70% item and `q.u = 8`, about 0.6 random uniques, plus a forced unique on the first kill, plus the signature Exit Interview on the first kill or 25% after. The forced unique is still a random legal `UNI` entry. The signature is the only drop a player can name in advance.

First kills of Pryce, Vale, and MANDATE call `dropFrom` with `forceU`. Boss 4 and 5 do the same in `bossKill2`. Signatures are `mkFixed` of a specific id. Keep that pattern for any new boss item. Do not use it for Force Majeure. A chase weapon that always drops from one boss is a quest reward. Windforce was not a quest reward.

Magic find on the character is `S.mf` plus 100 from the Clearance shrine plus Hazard Pay's temporary find (`mfNow`). Runner passives add find. Gear adds `mf`. The shrine is a 60 second double-find and it is fine.

Charms: `mkCharm` in `src/p7.js` rolls one of damage, life, find, crit, energy, run speed, gold. They drop at about 1.2% from ordinary kills, 10% from champions and lieutenants. Twelve fit, six run, each running one bills `12 × price index` credits a minute (`chBill`). They lapse if you cannot pay. This is a better charm system than 1.09's inventory tetris, for this game. Do not replace it with small / large / grand grids. Do add, later, a unique subscription (the Gheed slot) and a class-column subscription (+1 to one of the three columns). Those are Could.

Seed words drop at 100% from bosses and lieutenants, 20% from champions, 2% from everyone else (`p2.js` kill path), and 20% from lockboxes. Twelve words, six phrases. The phrase list is the right size for now. Three more, in section 2, and then stop.

### Vendors, identify, craft, tier

**Brenda.** Eight items, item level around yours plus tier × 12, 12% rare and the rest magic, identified. She does not sell uniques. She identifies the unidentified pile for `40 × price index` per item, with the discount. Marrow does it free after her quest. Rares and up drop unidentified (`id: q < 2`). Magic drops identified. That is kinder than 1.09 and correct on a phone.

**Wren.** You pick the slot. `boxPrice` is `(8 + level × 5) × 9`, times the price index. The roll is unique 1.5%, set 2%, rare 15%, magic the rest (`p4.js`, the `d.box` handler). 1.09 Gheed was about 1 in 2000 for a unique, on a random base, from a pool of hundreds. Wren is 1 in 67, on the slot you chose, from a pool that is currently "everything you have outleveled." Once treasure classes exist, 1.5% of the right slot is still hot: six uniques in the band means a specific one about 1 in 400 boxes. Recommend **0.4% unique, 0.8% set, 12% rare** after the bands, not before. Before the bands, do not raise her rates.

**Nonce.** On each town visit, a handful of identified items, 15% unique, 17% set, the rest rare, at 45 / 30 / 12 sats before reputation (`satShop` in `buildTown`). Item level is yours, plus tier × 12, plus 2 to 4. This is a unique vending machine. It will empty the chase the day the chase items exist. Recommend **3% unique, 6% set, the rest rare**, prices 80 / 40 / 15, and his uniques come from the **next** band up, so he is a gamble on tomorrow's gear rather than a catalog of today's.

**Craft.** Scrap returns 1 / 2 / 4 / 8 / 15 parts by quality. Reroll costs `5 + floor(il / 4)` and replaces one affix. Add socket costs 12 parts. No Horadric recipe list. That is fine. The one rule to add is the unique socket cap.

**Tier.** Clearing an act boss raises `maxTier` to `tier + 1`. The transit gate then offers a harder world: every district's monster level gains `tier × 12`, and items use that level. This is Nightmare and Hell, and it is the right post-clear structure. It does not filter the unique pool. A tier 3 Parcel Moors (monster level 1+36) can roll every unique up to item level 38, including the Coupon.

**Leveling.** One skill point, five attribute points, one web point, per level (`gainXp`). Caps are 25 / 50 / 75 / 90 / 100 by act. Attributes are Might, Reflex, Vitality, Bandwidth. This is the 1.09 point budget plus the web, which should stay. The web is the modern system the design bar asked not to strip.

**Hirelings** have three equipment slots in the migrate path (weapon, helm, armor) and do not inherit your Tuned damage. A Night Audit on a hireling is a good 1.09 memory (they loved Gaze). Let them use `leech` and `pdr`. They already have their own resist table on PR #82.

### What a player can feel, and what they cannot

They can feel quality color, the unique beam, identify, vendors, a set bonus on three pieces, magic find with diminishing returns, sockets that become a named phrase, and a tier replay. They cannot feel a targeted chase, a second set, a caster coat, a reduction cap, a cast-rate puzzle, or a price quoted in anything but inflating credits and scarce sats. Sats are the right scarce money. They are not an item you show on your hand. The Unspent Output is how a ring becomes a sentence in chat: "six outputs for the coat."

## 4. What to change

Compared with 1.09, in the order that matters.

| 1.09 system | This game | Verdict |
|---|---|---|
| Treasure classes, so Mephisto cannot drop Gull | One pool, `il <= ml+2` | **Must fix.** This is the revamp. |
| Unique / set / rare / magic / white, plus low quality and superior | Four qualities, no superior, no crude | Enough. Superior sockets can be a Could. |
| Normal / exceptional / elite bases | Four base tiers, then the same names scale | Enough for now. A fifth tier at item level 40 is a Could, mostly so the late icons change. |
| MF curve 250 / 500 / 600 | Implemented, correctly | Keep. |
| No-drop falls with party size, quality does not | `partyNoWeight` does this | Keep. Add the 8 second unique window. |
| Two rings | One ring | Keep one. Stack the currency ring in the lockbox. |
| Shield slot | None | Map shield uniques onto armor and amulets. Off-hand is a Could. |
| Str / dex requirements, 5 stats per level | Level requirement only, 5 attributes per level, plus the web | Keep the points. Do not add a requirement tax unless a full attribute refund exists. Sister Null takes skills back. Attributes look permanent. A permanent Might gate is the 1.08 pain people do not actually want. |
| FCR / FHR / IAS breakpoints | `cdr` capped smoothly at 60, attack speed linear, run speed capped at 50 | Add three **soft steps** displayed on the character sheet ("cast: slow / ready / quick" at 15 / 30 / 45 `cdr`) so the Rate Card visibly crosses a line. Do not import the sorceress breakpoint table. |
| Leech, full strength in Hell | `leech` with no difficulty penalty, no PvP penalty | Cap it. On Brutal, halve it. |
| Crushing blow, deadly strike, open wounds | Deadly strike exists (`crit`). The other two do not. | Add `cb` and `ow` with the caps above. |
| % DR cap 50, physical | Armor is `100/(100+armor)`, which is Diablo's defense curve, not percent reduction | Add `pdr`, cap 50, after resists. |
| Cannot be frozen | Slows exist. The Offer is immune. | `noslow` as a key. |
| Teleport charges, Oculus proc | Step Back, Dead Drop, town portals | Remote Hands is a short dash, not a second portal. |
| Charms in the inventory | Subscriptions, billed, six running | Keep. Extend later. |
| Runes and runewords | Twelve seed words, six phrases | Keep, add three phrases and one slot-sensitive word. |
| Gambling 1/2000, Larzuk sockets | Wren 1.5% on a chosen slot, Nonce 15%, craft-a-socket for 12 parts | Retune after bands. Cap unique sockets at 1. |
| Ethereal | No durability | Skip. |
| Set partials | One set, and the drop does not prefer a missing piece | Fix the prefer-missing rule for every set. Add Orientation, Schema, Old Guard, Countersign. |
| SoJ as money | Sats, and credits that inflate | Outputs, server-backed. |
| PvP at 1/4 | `pvpScale` 0.25 | Keep, and add the item caps so the new uniques do not bypass it. |
| Free-for-all loot | Free-for-all, more rolls per body in the district | 8 second personal unique window. |
| No respec | Skills can be unlearned at Sister Null. The web is spend-only. | Leave it. The 1.08 "this character is a decision" feeling is already here. |

### Drop targets

Keep `qChance`. Change what a unique **is**, not how often the word "unique" is rolled.

A treasure class is a list of about six to eight uniques and one set, plus a monster-level window.

| Class | Monster level | What lives there |
|---|---|---|
| Early | 1–18 | Coupon, Finder's Fee, First Shift, The Draw, Orientation, Striker's Vigil, Sure Posting's younger cousins |
| Mid | 16–40 | Rate Card, On-Call, Frozen Payroll, Expense Account, Loss Leader, Open Minute, Remote Hands, Countersign |
| High | 36–60 | Night Audit, Freeze-Frame, Restock, Picket Visor, Mesh Clause, Per Diem, Thaw, Schema Wrappings, Ground Strap, Gilded Agenda, Dispatch |
| Late | 58–80 | All-Hands, Five-Way, Force Majeure, Indemnity, Closing Bell, Vesting Schedule, Senior Tranche, Old Guard |
| Boss | that boss only | The signatures that already exist, plus nothing from this list except maybe the Old Guard maul as a **bad** idea. Leave the maul in Late, at low weight. |

A unique rolls only if its class matches the monster. Overlap at the edges is fine (16–18 is both early and mid). A level 70 Tick does not roll the Coupon.

Target chance of **a** unique, before the class filter, at 0 magic find. These replace the current `q.u` feelings for the sources players actually farm. The current Tick number is 1 in 12,500 kills. That can stay. Trash is not the farm.

| Source | Unique per kill, 0 MF | At 200 MF (~2.11×) | Specific item, if the class has 8 |
|---|---|---|---|
| Ordinary machine | leave it rare (about 1 in 8,000–12,000) | still rare | not a farm |
| Champion | **1 in 35** (today about 1 in 50, then diluted by the whole pool) | about 1 in 17 | **1 in 280**, or 1 in 130 at 200 MF |
| Lieutenant | **1 in 6** | about 1 in 3 | 1 in 48, or 1 in 24 at 200 MF |
| Lockbox | 1 in 80 | 1 in 40 | a bonus, not the plan |
| Act boss, first kill | the signature, guaranteed, plus one from the class | same | the signature is the promise |
| Act boss, repeat | signature at 25% (already the pattern) plus one class unique about half the time | — | repeat bosses are how you finish a set piece, not how you print Force Majeure |
| Wren, after the retune | 0.4% of boxes | her items are identified and should **not** gain the player's magic find | 1 in ~2,000 boxes for a specific unique in a band of 8 on that slot. Closer to Gheed. |
| Nonce | 3% of his stock, from the **next** class up | no | a tease, priced in sats so it hurts |

Set chance stays a little higher than unique, as it is now (`q.s` is a smaller N than `q.u` on most rows, so sets are commoner). Prefer a missing piece. A finished Striker's Vigil in Act I should be normal. A finished Old Guard should be the story you tell.

Magic find's job is to move a farmer from "I will not see it" to "I might, if I stay." It is already shaped that way. The pool is what makes it feel like nothing.

### Must

1. **Treasure classes**, as above, including "this unique has left the pool." Effort: the drop path and `makeItemCore`'s unique branch, plus a `tc` field on each `UNI` entry. No new combat math. Do this before adding the new items, or the new items drown.
2. **The eight anchors**, in one batch, with the caps: Force Majeure, All-Hands, Unspent Output, Remote Hands, Rate Card, Night Audit, Indemnity, Coupon. They need `pdr`, `hpL`, `enL`, `enPct`, `enleech`, `cdr` as an affix, `r_all` from PR #82, and the specials `majeure` and `remote`.
3. **PvP and leech caps in that same batch.** Percent reduction 50, leech 15 / 4, crushing-blow timing if `cb` is in the batch (it can wait for the Closer), +skills from gear at +4, knockback gate, blink cooldown.
4. **Server receipt for the Unspent Output** before anyone can trade one. The account server already keeps the lockbox and the mail. A stack count there is the whole feature. If that slips, ship the ring as a unique and do not let it stack, and do not let chat call it money yet.
5. **Set drops prefer a missing piece**, applied to Striker's Vigil immediately, even before the new sets.

### Should

6. **Schema Wrappings and the Old Guard**, plus the Orientation and the Countersign. Partial bonuses only, no 8-piece costume.
7. **The rest of the counterparts** in section 2, in class order: mid band first (so Act II has a coat), high band with Act III, late band with Act V and tier replay.
8. **Soft cast steps** on the sheet, at 15 / 30 / 45 `cdr`, labeled in words. Same for `fhr` if it exists.
9. **Wren and Nonce retune**, after the bands, to the numbers above.
10. **Brutal halves leech.** Normal and Hard leave it alone, which is the 1.09 Hell fantasy on the difficulties people learn on. Brutal is where the fantasy gets expensive.
11. **The Coupon button**, a one-tap weapon swap that reverts after the next kill.
12. **Hirelings can wear leech and `pdr`.** Gaze on the mercenary was half the item's fame.
13. **Tooltip line for `r_all` on Brutal**, so the Rate Card shows the cut.

### Could

14. A fifth base tier at item level 40, new names only, same damage formula. So late uniques sit on a base you have not seen since Act II.
15. One new seed word that changes with the slot, plus Quiet Hours, Kindling, and Standing Order.
16. Unique socket cap of 1 on the craft verb.
17. A unique subscription (vendor discount, find, gold) and a +1-to-a-column subscription. Not skillers-as-currency.
18. An off-hand slot, and only then move the Indemnity and the Open Minute onto it. Large, phone UI, do not block the items.
19. Integer damage reduction and a separate magic-reduction key. Percent `pdr` covers the fantasy. Two more reduction stats is how 1.09 sheets became unreadable.
20. Low-quality and superior whites. Superior is only interesting if sockets matter more than they do today.

### What not to do

- Do not add Enigma, Spirit, or a teleport-on-every-class armor. Party roles in this game are real. The Maximalist brings the aura. The Technomancer brings the blink. Gear may borrow a step. It may not take the job.
- Do not add attack rating, weapon durability, or a second equipped ring.
- Do not copy the 1.08 Harlequin Crest +40% life.
- Do not put crushing blow on Force Majeure.
- Do not let Nonce's 15% unique stock survive the day the late uniques exist.
- Do not make the Old Guard's partial bonuses good. The weakness is the design. The maul and the full set are the design.
- Do not retune monster damage in the same change as `pdr`. The cap is enough. If Brutal becomes trivial, lower the unique `pdr` rolls, do not raise Brutal again.

### Effort, roughly

Must is one item-generation change, eight `UNI` entries, a handful of keys in `calc`, and the PvP gates. It is the kind of change that wants a drop test (roll 10,000 champions at three monster levels and print the histogram) more than a playtest of every class. Should is content on that pipe. Could is a second project.

The drop test is the definition of done for the Must. If a level 12 champion can still roll the All-Hands, the bands are wrong. If a level 70 champion rolls the Coupon more than once in several thousand uniques, the bands are wrong. If Force Majeure is more than about one unique in eight inside the late class, it is not a chase. If it is less than one in twenty, it is the maul, and only the maul is allowed to be that rare.

## Sources

Blizzard, fetched October 2026:

- [Unique rings](https://classic.battle.net/diablo2exp/items/normal/urings.shtml) — Nagelring, Manald Heal, Stone of Jordan, Raven Frost, Bul-Kathos' Wedding Band. Spawn flags as printed.
- [Unique amulets](https://classic.battle.net/diablo2exp/items/normal/uamulets.shtml) — Eye of Etlich, Cat's Eye, Highlord's Wrath, Mara's Kaleidoscope.
- [Normal unique gloves](https://classic.battle.net/diablo2exp/items/normal/ugloves.shtml) — Bloodfist, Chance Guards, Magefist, Frostburn, and the Frostburn/SoJ mana note.
- [Normal unique belts](https://classic.battle.net/diablo2exp/items/normal/ubelts.shtml) — Goldwrap.
- [Normal unique daggers](http://classic.battle.net/diablo2exp/items/normal/udaggers.shtml) — Gull.
- [Exceptional unique belts](https://classic.battle.net/diablo2exp/items/exceptional/ubelts.shtml) — String of Ears, Thundergod's Vigor.
- [Exceptional unique armor](https://classic.battle.net/diablo2exp/items/exceptional/uarmor.shtml) — Shaftstop.
- [Exceptional unique boots](https://classic.battle.net/diablo2exp/items/exceptional/uboots.shtml) — Gore Rider, War Traveler (Battle Boots block).
- [Exceptional unique shields](https://classic.battle.net/diablo2exp/items/exceptional/ushields.shtml) — Lidless Wall (Grim Shield block).
- [Elite unique shields](https://classic.battle.net/diablo2exp/items/elite/ushields.shtml) — Stormshield. Raw HTML: `Lightning Resist +25%`.
- [Elite unique swords](https://classic.battle.net/diablo2exp/items/elite/uswords.shtml) — The Grandfather (Colossus Blade block, 1.09 or later), Lightsabre (Phase Blade block, 1.10 or later).
- [Class-specific uniques](https://classic.battle.net/diablo2exp/items/normal/uclass.shtml) — Arreat's Face, Herald of Zakarum. Lycander's Flank is on this page and is not Titan's Revenge.
- [Original runewords](http://classic.battle.net/diablo2exp/items/runewords-original.shtml) and the [1.10 runeword page](https://classic.battle.net/diablo2exp/items/runewords-110.shtml) — Stealth, Leaf, Rhyme, Lore, and the later list (Enigma, Spirit).
- [Unique basics](http://classic.battle.net/diablo2exp/items/uniquebasics.shtml) — what the spawn-patch flags mean.
- Alpha index, for the names the belt/boot/shield/sword pages dropped in text conversion: [uniques-alpha](https://classic.battle.net/diablo2exp/items/uniques-alpha.shtml).

Other:

- Windforce 1.08 vs 1.09 and Harlequin Crest 1.08 vs 1.09: [diablo2.diablowiki.net](https://diablo2.diablowiki.net/Windforce) (fetch blocked by the site; numbers taken from the search snippet and checked against the vhpg 1.09 compilation).
- The Oculus 1.09 block: [vhpg patch-109 unique list](https://www.vhpg.com/d2r-unique-items/patch-109.html).
- Vampire Gaze, marked patch 1.09: [diablo2.io](https://diablo2.io/uniques/vampire-gaze-t1007.html).
- Buriza, marked patch 1.09: [diablo2.io](https://diablo2.io/uniques/buriza-do-kyanon-t716.html).
- Titan's Revenge: [diablo-2.net](https://www.diablo-2.net/uniques/item-info?item=Titan%27s+Revenge).
- Vipermagi 1.08 vs 1.09: [purediablo](https://www.purediablo.com/d2wiki/Skin_of_the_Vipermagi).
- Immortal King partials, and the 1/2000 gamble note: [purediablo](https://www.purediablo.com/d2wiki/Immortal_King).
- Tal Rasha partials, treated as the familiar post-rewrite list rather than a verified 1.08 dump: [jolie.ca](https://jolie.ca/~dan_ruffolo/diablo/d2settalrashas.html), [fextralife](https://diablo2.wiki.fextralife.com/Tal_Rasha%27s_Wrappings_Set).
- 1.09 runeword behavior (Battle.net-only before 1.09, Ancient's Pledge the exception): [GameFAQs 1.09 rune FAQ](https://gamefaqs.gamespot.com/pc/370600-diablo-ii-lord-of-destruction/faqs/12681).
- Patch timing: `notes/diablo2-1.08-research.md` in this repo, which separates 1.08, 1.09, and 1.10 and flags the PvP scalar disagreement. This note uses 1/4, which is what 1.09 set and what `MP.pvpScale` already is.
- The maul story: `canon/manuscript/54-chapter-54.md`.

This game: `src/p1.js` (`TC`, `MFK`, `qChance`, `AFX`, `UNI`, `SETS`, `BASE`), `src/p2.js` (`makeItemCore`, `mkFixed`, `dropFrom`, `calc`, `satShop`), `src/p4.js` (Wren's box, `boxPrice`, identify, sell), `src/p6.js` (`WORDS`, `PHRASES`), `src/p7.js` (`mkCharm`, `craft`), `src/p10.js` (`fixTypes`, `FAM`, `resOf`, class uniques), `src/p11.js` (Act IV–V uniques), `src/p13.js` (`partyDropN`, `pvpScale`). PR #82 diff for `r_all`, the fourth Proofing tier, and the Hard/Brutal cut.
