# Charm redesign

Proposal only. Nothing in this document changes the game. Micah picks a direction first.

The numbers are from `node tools/charm-audit.js`, which loads `dist/unsubscribe.html` and calls the live `mkCharm`, `makeItem`, and `calc`. The sheet examples are a Scrapper with 40% Might, 40% Vitality, 15% Reflex, the rest Bandwidth, one point in the first skill, no web, and no tenure. A "good rare kit" is the best of 24 rares in each slot, scored by sheet damage plus life divided by 8. Reruns move the rare kit around, because 24 rolls is a lucky afternoon, not a fixed loadout. The charm side is stable: a normal rack is about +1% damage at every stage.

## Recommendation

Charms become real items again. A charm you have equipped sits in a slot on your belt and applies its bonus. Every charm you have not equipped sits in the pack or the lockbox, takes a footprint, does not stack, and does nothing until you equip it.

The belt carries two numbers: how many stims it holds, and how many charm slots it has. White belts keep today's stim caps and gain charm slots as they get better, so a new belt is never a downgrade. The real choice lives on magic, rare, and unique belts, which trade stim rows for charm slots or the other way around.

A belt filled with good charms of one kind should move that kind of power by about **12–16% of the sheet** once you have a Tool Belt or better. That is the size of a strong gear upgrade on the kits measured below. A Zip-Tie Sash, with one slot, should move the sheet by about **8–12%**. A mixed belt splits the difference across two stats. Chase uniques are allowed to go further, because they spend most of the belt to do it.

## What a player gets today

Charms are Lapsed Subscriptions. `mkCharm` in `src/p7.js` builds one item: magic quality, already identified, required level 1, one affix, vendor value `30 + il × 4`. The name is "Lapsed {channel} Subscription." The channel is one of eight words: Streaming, Meal Kit, Cloud Storage, Gym, Newsletter, Loyalty, Extended Warranty, Premium.

The affix is an equal roll among seven stats. The value is `round(uniform(low, high) × (1 + il / 40))`, truncated to an integer, and at least 1.

| Stat | Base range, before the item-level factor |
|---|---|
| Enhanced damage | 3–6% |
| Life | 8–20 |
| Magic find | 4–8% |
| Deadly strike | 1–2% |
| Energy | 5–10 |
| Faster run | 1–3% |
| Extra credits | 8–15% |

There is no resist, no faster cast, no life leech, no attack speed, no skill bonus, no rare, and no unique. Item level only multiplies that small base. It never steps up into the affix tiers gear uses.

### Where they go

They do not go in the pack. Pickup calls `chTake` (`src/p10.js`). The hero has a rack of 12. The first six are turned on. A seventh through twelfth are stored and paused. A thirteenth stays on the ground, with the toast "Your subscriptions are full (12)."

The comment above `mkCharm` says pack space is the price. The rack removed that price. Paused charms cost nothing and grant nothing. Running charms are the only ones that count.

On the Items sheet the rack is a row of twelve cells under the pack, labeled "Subscriptions n/12 · m/6 running," plus the minute's bill. Tap or click to run or pause. You can sell one (only while Brenda's shop is open), drop it, or scrap it for 2 parts. You cannot equip it, socket it, or reroll it. Trying to put one on the doll says they are not worn.

### The bill

`chBill` is `floor(12 × running × prices)` credits, once a minute (`upkeepTick` in `src/p10.js`).

| Running | Prices ×1 | Prices ×3 |
|---|---|---|
| 1 | 12 | 36 |
| 3 | 36 | 108 |
| 6 | 72 | 216 |

A stim at level 14 and prices ×1 costs `floor(25 × (1 + 14 × 0.2))` = 95 credits. Six subscriptions cost about three quarters of a stim every minute. If the purse cannot cover a minute, `charmOff` turns the whole rack off until a later minute is paid. The bonus is small, and it can also vanish.

Prices rise on their own as the session goes on, so the same six charms get more expensive without getting better.

### How the stats apply

`extra` in `src/p7.js` adds the affixes of running charms while `charmOff` is clear. Enhanced damage lands in the same pool as gear and Might. Flat life lands in the life pool and is then multiplied by life multipliers, the same way armor life is. Nothing else reads the rack.

The hireling's damage and life are `mercStats` in `src/p2.js`. Charms are not in that formula. The tag-along companion copies the hero's sheet damage, so it does pick up charm damage indirectly. Party members do not share charms. There is no charm aura.

### Drops

The kill hook in `p7Kill` rolls a charm beside the normal drop table. The chance is 10% if the machine is a champion or a named lieutenant, and 1.2% otherwise. Act bosses are spawned without those flags, so a boss is a 1.2% roll plus whatever its own table drops, and the tables do not contain charms. Chests, crates, Brenda, the sat vendor, and gambling boxes never produce one.

Difficulty does not change the chance. Normal, Hard, and Brutal use the same 1.2% and 10%. Item level is the district's monster level: zone level, plus 12 for each replay tier. On Hard and Brutal, with the default "scale machines to your strength" option, monster level is at least the hero's level, so an overleveled hero in those difficulties does get higher charm rolls. The roll ranges still barely move. See the table below.

### Saves, shops, crafting, trading

The rack is part of the hero save (`G.charms`, plus `charmOff` and the minute timer). On load, `chFix` also pulls any charm still sitting in the pack or the old personal stash onto the rack. Past 12, those charms are deleted. They are not dropped.

Brenda's shop and the sat shop call `makeItem`. They have no charm stock. Scrap is a flat 2 parts, not the 1/2/4/8/15 scale other qualities use. There is no reroll and no socket.

The trade window lists the pack only (`mpTradePanel` in `src/p13.js`). A subscription is not in the pack, so it cannot be offered. Two players cannot trade charms. Vendor price is 40% of `30 + il × 4`, times prices. At item level 12 that is about 31 credits, a third of a stim.

### They do not stack to 99

This branch has no charm stack, and no stack size of 99. `q` on a charm is quality, and it is always 1 (magic). Each subscription is its own object. The things that look like a pile are the rack of 12 and the rule that only 6 run.

If a played build showed a quantity of 99, it was not this code. The low-value feeling is explained by the rack as it stands.

### Belts today, because the proposal hangs on them

A belt's only special base stat is stim capacity, set in `baseStats`: `6 + tier × 2`. With no belt, capacity is 4.

| Item level | Base | Stim cap |
|---|---|---|
| 1–6 | Zip-Tie Sash | 6 |
| 7–14 | Tool Belt | 8 |
| 15–21 | Power Girdle | 10 |
| 22+ | Orbit Girdle | 12 |

Right to Repair is a Tool Belt (cap 8) whose special adds 4, so the worn cap is 12. The other unique belts do not change capacity. They are stat sticks that happen to be belts: Dead Man's Alarm, The Quiet Ledger, The Night Drawer, Not Your Keys, The Sign-in Sheet, The Docket, Blank Check, Cold Wallet, Soaker Hose, Carbon Sheet.

## Why it feels low-value

Three things stack up. The bonuses are small next to one affix on one piece of gear. A normal rack is a random mix, so most of the six slots are not even the stat you care about. And nothing is given up to wear them, so there is no moment where a charm is a decision. The bill is a tax on top of that, not a tradeoff that makes the item interesting.

### Rolls next to gear

Median charm roll, and the min–max in parentheses. 4,000 charms per item level.

| Item level | Damage | Life | Magic find | Deadly strike |
|---|---|---|---|---|
| 6 | 5% (3–6) | 16 (9–23) | 6% (4–9) | 1% (1–2) |
| 12 | 6% (3–7) | 18 (10–26) | 7% (5–10) | 1% (1–2) |
| 27 | 8% (5–10) | 23 (13–33) | 10% (6–13) | 1% (1–3) |
| 42 | 10% (6–12) | 28 (16–41) | 12% (8–16) | 2% (2–4) |
| 72 | 14% (8–16) | 42 (22–56) | 16% (11–22) | 5% (2–5) |

Gear at the same item levels, from the same run. "Rate" is how often that affix appeared. A rare has about four affixes. A charm has one.

| Item level | One rare-weapon damage affix | One rare-armor life affix | Notes |
|---|---|---|---|
| 12 | median 33% (8–45), on 43% of rare weapons | median 34 (5–50), on 52% of rare armors | About 14% of rare weapons also roll +1 to all skills |
| 27 | median 77% (8–100) | median 94 (5–130) | All-resist starts showing up on armor, rings, amulets |
| 42 | median 108% (8–140) | median 135 (5–190) | |
| 72 | median 114% (11–140) | median 143 (5–190) | Charm damage has reached 14%. The weapon affix is still around 114% |

At the Glass Cathedral (item level 12), one charm is 3–7% enhanced damage or 10–26 life. One affix on a rare weapon is about 33% enhanced damage. One affix on a rare armor is about 34 life. Six charms, if you could aim them, would still be in the neighborhood of a single affix. You cannot aim them. Each charm is one of seven stats.

Magic find is the one place a late charm matches a gear affix, and only because gear's magic-find tiers stop at 5–24%. Deadly strike, run speed, and extra credits stay well behind the gear tiers. Resists and skills never appear.

The item-level factor is why this never catches up. `(1 + il / 40)` at item level 72 is 2.8, so a 3–6% damage charm becomes 8–16%. Gear does not grow that way. It changes tier: Jagged 8–15%, then Vicious, Brutal, Merciless, Ruinous, Apocalyptic 101–140%. Charm life at item level 72 is 22–56. The life tier on gear at that point is 131–190, and a rare armor often has it.

### What six of them do to the sheet

Enhanced damage from charms is added to the pile the hero already has from gear and Might. A +6% charm on a hero who already has +96% is 6 / 196 of their damage, about 3%, and that is if the charm is a damage charm. One sixth of a random rack is.

| Stage | Level | Item level | Rare kit, damage / life (enhanced damage) | Typical six | Best six damage | Best six life |
|---|---|---|---|---|---|---|
| Humming Fields | 8 | 6 | 85 / 431 (+85%) | +1% damage, +3% life | +12% damage | +30% life |
| Glass Cathedral | 14 | 12 | 136 / 779 (+96%) | +1% damage, +0% life | +12% damage | +18% life |
| Mezzanine | 30 | 27 | 522 / 1,543 (+347%) | +1% damage, +2% life | +12% damage | +12% life |
| Still Water | 45 | 42 | 1,227 / 2,078 (+617%) | +1% damage, +1% life | +9% damage | +11% life |
| The Room | 78 | 72 | 2,335 / 2,946 (+767%) | +1% damage, +1% life | +11% damage | +11% life |
| The Room, tier-2 replay | 90 | 96 | 2,260 / 3,434 (+758%) | +1% damage, +1% life | +14% damage | +11% life |

"Typical six" is the median of 40 random racks. "Best six" is the median of 25 chases, each chase keeping the six highest of that one stat out of 200 charms. That is a rack you built on purpose by throwing everything else away. It is not what drops.

Read it this way.

- The rack a player actually wears is about **+1% damage and +0–3% life** from Act I through a tier-2 replay. That is the whole system, after the minute's bill.
- A chased damage rack, six damage charms and nothing else, is **+9–14% damage**. At the Cathedral, the audit's lucky replacement weapon was +16% damage. So the ceiling of the current system, after discarding every non-damage charm, ties one weapon swap, and only that stat moves.
- A chased life rack is the one loadout that feels like an upgrade, and only early: **+30% life** at the Fields, **+18%** at the Cathedral. By the Mezzanine it is +12%, and it stays around +11% through The Room. The il/40 factor does not keep up with gear life. Getting that rack means all six running charms rolled life. The chance a single charm is life is 1 in 7.

A strong upgrade on these kits is a better weapon or a fat life roll, on the order of 10–16% of the sheet when the roll actually lands. Charms reach that only as a filtered trophy of six, for one stat, and the damage version stops at the low end of that range. The item you find and turn on does not.

### The rest of the feel

There is no chase. Every charm is the same magic item with a channel name. Nothing is rare enough to show someone, and the trade window cannot move one anyway.

There is no inventory pressure. The comment that wrote the system down wanted pack space to be the cost. The rack made the cost a bill in credits instead. Credits inflate, and the bonuses do not, so a long session taxes the rack and can switch it off. That reads as a subscription joke, which fits the setting, and it does not read as a Diablo charm.

Paused charms and the six-over-twelve spare slots are a closet, not a build. The hireling ignores them. Hard and Brutal do not make them rarer or finer except by the monster-level bump above. Acts III through V, where a charm should become a thing you reorganize your pack to keep, are where a normal rack is worth the least.

## Active versus carried

Micah's words: they have to be worth carrying, and the ones you do not have equipped should take inventory.

**Equipped** means the charm is in a charm slot on the worn belt. Those charms add their affixes in `calc`, the same place gear does. They do not also occupy pack cells. The belt slot is the space they spent.

**Carried** means the charm is in the pack or the lockbox. It uses its footprint. It grants nothing. It does not stack with another copy. There is no rack that holds charms for free, and a charm in the lockbox does not run quietly in the background.

Taking one off the belt puts it back in the pack, if the cells are free. If they are not, it stays equipped and the game says the pack is full. Dropping or selling an equipped charm takes it out of the slot first, so it cannot be both worn and gone.

This is the space-versus-power tradeoff, in two places:

- On the belt, slots are few. A small charm, a large one, and a grand one spend different amounts of that budget. Filling the belt with damage charms means you did not fill it with life, resists, or a skill charm.
- In the pack, every spare costs cells you could have used for loot. A grand charm you are not wearing is four cells of dead weight. You carry it because you are about to equip it, trade it, or move it to the lockbox. You do not carry a stack of 99.

The lockbox stays. It is the shared mule, 36 cells, and a charm there is off. Banning charms from the lockbox would also ban muling them to another hero. That is a decision, listed at the end. The thing that goes away is the subscription rack.

## Belt tiers

The four bases already in the game are the ladder. Diablo's sash, light belt, belt, heavy belt, and plated belt are five names across three widths. This game has four item-level tiers, so the ladder is four rungs, not a new base type.

White bases keep the stim caps they have today and gain charm slots. A player who never looks at charms still has the same number of stims.

| Base | Item level | Diablo rhyme | Stims | Charm slots | What fits |
|---|---|---|---|---|---|
| No belt | — | — | 4 | 0 | Charms in the pack stay off |
| Zip-Tie Sash | 1–6 | Sash, light belt | 6 | 1 | One small |
| Tool Belt | 7–14 | Belt | 8 | 2 | Two smalls, or one large |
| Power Girdle | 15–21 | Heavy belt | 10 | 3 | Three smalls, one large and one small, or one grand |
| Orbit Girdle | 22+ | Plated belt | 12 | 4 | Four smalls, two larges, or one grand and one small |

Orbit is the belt that drops from the middle of Act II onward (item level 22 is the last base tier). Charm capacity reaches 4 well before Act V. Later acts make charms stronger. They do not add a fifth slot on a white belt.

### The tradeoff

White belts do not trade stims away. A new white belt should be safe to equip. The choice is on anything with a roll or a name.

Two suffixes, able to land on magic and rare belts:

- **of the Courier.** +4 stims, −1 charm slot, and the slot count can hit 0.
- **of the Collection.** +1 charm slot, −4 stims, and stims do not go below 2.

One slot, not two. A rare belt can lean. It should not out-slot the unique that exists to be the charm belt.

### Unique belts

Each unique keeps the special it already has. Capacity is added so the name picks a side. "On the line" means the white belt's stim and charm numbers, and the unique is worn for its other stats.

| Unique | Base | Stims | Charm slots | Why |
|---|---|---|---|---|
| Right to Repair | Tool Belt | 12 | 1 | It already grants +4 stims (worn cap 12). It gives up a charm slot to keep that and the energy refill. |
| Blank Check | Tool Belt, Founder | 6 | 3 | The class belt leans toward skill charms. |
| Cold Wallet | Tool Belt | 10 | 1 | Defensive, more stims. |
| Soaker Hose | Tool Belt, Homesteader | 8 | 2 | On the line. The plot special is the reason. |
| Carbon Sheet | Tool Belt, Witness | 6 | 3 | Leans toward the record charm. |
| Dead Man's Alarm | Power Girdle | 12 | 2 | The panic belt. More stims, fewer charms. |
| The Quiet Ledger | Power Girdle | 8 | 4 | The caster belt. One extra charm slot, two fewer stims. |
| The Night Drawer | Power Girdle | 10 | 3 | On the line. |
| Not Your Keys | Orbit Girdle | 12 | 4 | On the line. The resists are the reason. |
| The Sign-in Sheet | Orbit Girdle | 6 | 5 | The charm belt. Room for a grand and a large, or a grand and two smalls. It already rolls +skills. |
| The Docket | Orbit Girdle | 16 | 1 | The potion belt. One charm, a deep stim row. |

The Sign-in Sheet is how both chase charms can be worn together. A grand costs 3 and the class letter costs 2. A white Orbit has 4 slots, so it holds one trophy, not both. The Sign-in Sheet has 5, and half the stims of a white Orbit. That is the build. The Docket is the other build: you looked at the charm belt and bought potions instead.

Class belts that stay on the line (Soaker Hose, and any future one with nothing to say about capacity) do not become obsolete, and they do not need a fake lean.

## Sizes

Three footprints, matching the small, large, and grand shapes.

| | Slip | Notice | Filing |
|---|---|---|---|
| Shape | Small, 1×1 | Large, 1×2 | Grand, 2×2 |
| Belt slots | 1 | 2 | 3 |
| Pack and lockbox cells | 1 | 2 | 4 |

A filing costs 3 slots and 4 cells on purpose. The 2×2 footprint is the inventory tax, the Diablo shape. The belt cost is 3 so an Orbit can still run one grand and one small. If a grand cost all 4 slots, small charms would stop mattering the moment a grand dropped. If a grand cost 1 slot, the footprint would only punish you for carrying it, and everyone would equip grands.

A notice is how you get two stats in one item. Each of its affixes rolls at about three quarters of a slip's range, so two slips of the same stat beat one notice, and a notice wins when you wanted both stats. A filing is how you get a skill bonus, or two full-strength affixes, not three slips glued together. Three life slips beat a filing on life. The filing is the skill.

Other gear stays 1×1. This pass does not turn weapons into a 2×4 tetris. The pack is already 24 cells in 6 columns. Those cells gain spans for charms only. The lockbox's 36 cells do the same.

## Affix bands

Slips roll one affix. The band comes from the charm's item level, which is the monster level that dropped it. That level already includes the replay tier (+12 per tier) and, on Hard and Brutal with dynamic scaling on, a floor at the hero's level. Difficulty does not multiply the roll a second time. Difficulty decides which sizes and which uniques can drop.

Bands replace `(1 + il / 40)`. A charm from Act I is useful in Act I and is outgrown, the way a Cathedral weapon is outgrown. Required level stays `floor(item level × 0.75)`, same as gear, so a Room charm does not go on a level 8 sash.

Slip ranges. One affix.

| Band | Monster level | Enhanced damage | Life | One resist | All resist | Magic find | Deadly strike |
|---|---|---|---|---|---|---|---|
| Act I | 1–14 | 10–18% | 35–65 | 8–14% | — | 8–15% | 3–5% |
| Act II | 15–29 | 12–22% | 45–80 | 12–20% | 4–8% | 10–18% | 4–7% |
| Act III | 30–44 | 16–28% | 55–100 | 15–25% | 6–11% | 12–22% | 5–8% |
| Act IV | 45–59 | 20–34% | 65–120 | 18–30% | 8–14% | 14–26% | 5–9% |
| Act V | 60+ | 24–38% | 70–130 | 20–35% | 10–18% | 16–30% | 6–10% |

Faster cast, attack speed, and a point or two of life leech can sit in the same bands from Act II on, at the low end of what a glove or a weapon would roll, so a charm is a patch for a hole and not a replacement for the slot. Run speed stays off charms. Boots already own it, and a 1–3% charm of it is how the current ones feel like nothing.

Notices roll two affixes from the slip list, each at about 75% of the band. Filings roll either +1 to all skills, or two affixes at full slip strength. A slip can also be a class skill charm, which is +1 to one skill and nothing else. That slip is the skill, not the skill plus a damage roll.

+skills follow the rule the game already uses: the bonus applies to a skill you have put a real point in. Item skills do not unlock the next tier. All-skills from gear is already capped at +4 in `calc`. Charm skills count toward that cap in PvE. PvP has a tighter charm-only cap, below.

### Worked examples on the measured kits

These use the rare kits from the audit and a median roll, not a perfect one. Enhanced damage is added to the kit's existing pile, then turned into sheet damage. Life is flat, on top of the kit's life.

**Humming Fields.** Kit: 85 damage, +85% enhanced damage, 431 life. Zip-Tie Sash, one slot.

- One 16% damage slip: 16 / 185 of the damage pile, about **+9% sheet damage**.
- One 50 life slip: 50 / 431, about **+12% life**.

One slot, one stat, already more than today's whole rack (+1% damage, +3% life), and about half of a two-slot upgrade. That is the right size for a sash.

**Glass Cathedral.** Kit: 136 damage, +96% enhanced damage, 779 life. Tool Belt, two slots. The audit's lucky replacement weapon on this kit was +16% damage.

- Two 14% damage slips: 28 / 196, about **+14% sheet damage**. That is the weapon swap.
- Two 50 life slips: 100 life, about **+13% life**. A rare armor's life affix at this item level is median 34. The belt is two of those, and it cost both charm slots.

**The Room.** Kit: 2,335 damage, +767% enhanced damage, 2,946 life. Orbit Girdle, four slots. A rare weapon's damage affix here is median 114%, which is 114 / 867, about **+13% sheet damage**.

- Four 31% damage slips: 124 / 867, about **+14% sheet damage**. The belt matches one strong weapon prefix.
- Four 100 life slips: 400 life, about **+14% life**. One high life affix on armor is median 143, about 5% of this sheet. The belt is roughly three of those, and only if every slot is life.

A mixed Orbit, two damage and two life, lands near half of each: on the order of +7% damage and +7% life. Still visible. Not a second weapon and a second armor at once.

A perfect Act V damage belt, four slips at 38%, is 152 / 867, about +17% sheet damage. That is the top of the normal pool. Chase uniques go past it by spending slots on skills, not by rolling 80% enhanced damage on a slip.

Today's chased damage rack at The Room is +11% sheet, and today's typical rack is +1%. The proposal makes the typical good belt into what the old ceiling almost was, and keeps it there from the Tool Belt onward instead of letting it fall off.

## Unique charms

A few. They are the things worth a conversation and a trade. Names are in the game's voice. Annihilus and the Hellfire Torch are the shape (one account-level trophy, one class trophy), not a claim that patch 1.08 shipped them. Those two arrived later. They are the modern replay layer on top of the small, large, and grand pool.

**The Churn Notice.** Grand, filing, 3 belt slots. +1 to all skills, +12–20% all resist, +50–90 life, +10–16% enhanced damage. The stats are about one good slip. The skill is why it costs three slots. Flavor: the notice Unity sends when it stops pretending you are a customer. You kept the letter.

On a white Orbit it leaves one slot. You do not also wear four damage slips. On the measured Room kit, the notice plus one 31% damage slip is +1 skills and about +5% sheet damage from the two damage rolls (16% + 31% = 47 / 867). A weapon hitter who wants the +14% damage belt leaves the notice in the pack. A caster wears it.

**The Eleven-Minute Letter.** Large, notice, 2 belt slots. Class-bound: it rolls for the class that killed the boss, and only that class gets the skill bonus. +2 to that class's skills, +30–60 life, +8–12% all resist. Flavor: the letter Phonix sent everyone. This copy has your class's name on it, which is impossible, and it works anyway.

Two slots for +2 skills is the efficient trophy. Together with the Churn Notice it needs 5 slots, which is the Sign-in Sheet and not a white Orbit. You can wear one trophy on any Orbit. You wear both only if you gave up half your stims.

**The Clearance Sticker.** Small, slip, 1 slot. +25–40% magic find, +15–30% extra credits. The common "this slot is for finding more charms" item. Flavor: the price that was never the price.

**Class slips.** One slot, +1 to a single skill of that class, no second stat. They only help a skill you have a point in.

| Class | Charm |
|---|---|
| Scrapper | The Write-up |
| Technomancer | The Ticket |
| Runner | The Missed Scan |
| Anon | The Burner |
| Founder | The Option Pool |
| Homesteader | The Lien |
| Witness | The Carbon |
| The Maximalist | The Whitepaper |

**The Unread Clause.** Large, notice, 2 slots. Two resist rolls, or one all-resist roll at the top of the band. Flavor: it was in the terms. Nobody read it. The belt still did.

That is the unique list. More names would turn the pool back into channel-name noise.

## Drops

Remove the flat 1.2% / 10% side roll. Charms become a separate roll on the kill, with a size, and the old roll does not also fire.

Item level is monster level, as today. The band table above reads that level. The rates below are the chance a kill drops one charm. They do not replace the gear table.

| Source | Normal | Hard | Brutal |
|---|---|---|---|
| Ordinary machine | 1.5% slip | 2% slip, 0.3% notice | 2% slip, 0.6% notice, 0.1% filing |
| Champion | 8% slip, 2% notice | 8% slip, 4% notice, 1% filing | 6% slip, 5% notice, 3% filing |
| Named lieutenant | 10% slip, 8% notice, 2% filing | same, and filings can be rare (three affixes) at 1 in 4 | same, rare filings at 1 in 3 |
| Chest | a champion's row | a champion's row | a champion's row |
| Act boss, first kill that difficulty | one charm of the best size the act allows | one notice, high band | one filing, high band |

An Act of ordinary clears is a handful of slips and something to compare, not a rack of twelve identical subscriptions. Champions are where a notice becomes a normal event. Filings are a lieutenant and boss event until Brutal, where a champion can drop one.

Class slips replace the stat roll on a slip from Act III on: 8% of slips on Hard, 12% on Brutal. They do not drop on Normal. The Clearance Sticker replaces the roll on 5% of champion charm drops from Act II on, any difficulty.

**The Eleven-Minute Letter.** The first time a given account kills the Curator on Hard or Brutal, she drops the letter for the killer's class. Later Curator kills are 6%. It is tradable. One guaranteed copy per account, not per hero, so eight heroes do not each farm one.

**The Churn Notice.** The first time an account kills PROVIDENCE on Brutal, it drops. Later Brutal kills are 5%. It does not drop on Normal or Hard. Tradable. Same once-per-account guarantee.

Brenda does not sell charms. The sat shop does not sell them. Gambling boxes stay gear. A junk charm still sells for credits, at the same 40% of vendor value other gear uses, so the pack can be cleaned. Scrap stays at 2 parts for a slip, 4 for a notice, 8 for a filing, so a bad grand is worth breaking. No reroll in the first version. The chase is the drop. A reroll recipe can come later if the bands feel too swingy. It should not ship in the same change as the new pool.

## Inventory, mercenaries, trading, co-op

The pack is 24 cells. A hero who wants a full Orbit of slips spends 4 cells on the spares they are about to socket, or 0 cells if the four they want are already in the belt. A hero who is carrying a filing for a friend spends 4 cells until the trade. Loot still fits, because gear did not grow. The pressure shows up when the pack is already full of upgrades and a grand drops. That is the Diablo moment, on a grid this game already has.

The lockbox uses the same footprints and the same rule: stored charms are off. It is shared by every hero on the account, which is how a letter moves to an alt. It is not a second belt.

Hirelings do not get charm slots. Their weapons, helms, and armor stay the way they are. Giving them a belt of charms would double the farm and the balance pass. The tag-along copies hero sheet damage, so it keeps benefiting from the hero's equipped charms and only those. It does not grow its own row.

Trades list pack items, which will include charms once charms live in the pack. An equipped charm is not in the pack, so it has to come off the belt before it can be offered. That matches "equipped" and keeps a player from selling a slot they forgot was full. Charms do not stack, so a high roll is its own line on the table, which is what makes it worth pricing in sats. Sats stay the money. The vendor price is a trash can, not the price between players.

Co-op does not share charm stats. Each hero's belt is their own. Charm drops stay on the client, like the rest of the loot. The ground is still first come, first served. A charm is not an aura and not a party buff.

## PvP

Player damage is already multiplied by 0.25 after the hit is built. Charm enhanced damage is inside that hit, so a belt that adds 14% sheet damage adds 14% to a hit that is then quartered. Relative to another player, it is a 14% damage build choice. That is enough to matter and not enough to need a second damage tax. No extra diminishing returns on charm damage.

Life is different. The 0.25 scale does not shrink the life pool, so charm life is full-strength effective health in a fight between players. A specialized life belt at the targets above is about +14% life. The Sign-in Sheet has 5 slots, and a Collection roll can add another. Cap **charm life at 20% of life from level, attributes, and gear**, in PvP only. Past the cap, more life charms still fill slots and still work on machines. They do not push a duel into a stim contest.

Skills are the other sharp edge. +2 from the letter, +1 from the notice, and a class slip is a lot of skill ranks on top of gear, and skill ranks scale the skill before the 0.25. In PvP, **skills granted by charms are capped at +2 total**. The letter alone is the PvP skill charm. Wearing the letter and the notice together is a PvE choice. The notice still gives its resists and its small stat rolls. The existing PvE cap of +4 to all skills stays, and charm skills count toward it everywhere.

Resists from charms are real in PvP and are already inside the resist cap the game uses (75%, with the difficulty cut). No separate resist diminishing. A notice full of all-resist is a legal duel charm and costs two slots.

Nothing here changes `PVP_SCALE`. The slot budget is the structural cap. The two extra clamps are life and skills, which the quarter-damage rule does not already handle.

## Mobile and desktop

The Items sheet already puts the doll, the pack, and a charm row on one scroll. The subscription row is replaced by the belt's charm slots, drawn as a short row of large buttons next to the stim count. On the fit layout the pack cells are 36px. A filing is two by two of those, about 72px, which is a thumb target. A slip is one cell.

Equipping does not require a drag. Tap a charm in the pack, then tap an empty belt slot. If it does not fit (a filing on a sash, or two slots left and the charm wants three), the slot shakes and one line says why: "A filing needs 3 slots. This belt has 1." Tap an equipped charm to select it, then tap the pack to take it off, or use the button that already means "take off."

Desktop can drag between the pack and the belt. The tap path stays, so the two clients do not grow different rules.

The stim row is the count the HUD already uses. This proposal does not turn stims into individual grid items. Capacity is the belt's number, the way it is today, plus the unique and suffix modifiers. A player on a phone manages four to six charm buttons and a stim count, not a 10×4 inventory puzzle.

The belt row shows both budgets in the title the subscription row uses now: "Orbit Girdle · 4/4 charms · 12 stims." A Courier or Collection roll, and any unique, prints its altered numbers there so the tradeoff is visible before you equip it.

## Save migration

Old saves have `G.charms`: up to 12 subscription objects, each with one affix, an item level, and an `on` flag. Some older packs and stashes may still contain `charm` items. `chFix` currently moves those onto the rack and deletes anything past 12. Migration has to see them first.

Run once, flagged on the hero (`charmMigrated`). Also scan the account lockbox, and flag that scan on the account so a second hero does not convert the same mule twice.

1. Collect every old charm from `G.charms`, the pack, the hero stash, and the account lockbox.
2. Turn each one into a slip. Keep the affix and the value. Do not reroll it onto the new band. A life charm that was worth +30% of an Act I sheet stays that charm. It will be outgrown, which is what already happens, and the player is not handed a surprise Act V roll for free.
3. Required level on a migrated slip is 1, matching the old charms. New drops use the gear requirement.
4. Sort the ones that were `on` ahead of the paused ones. Within that, prefer enhanced damage and life, then the higher roll.
5. Equip into the worn belt's new charm slots, in that order, until the slots are full. A hero with no belt has 0 slots. Their charms all go to the pack. If they later equip a sash, they socket one themselves.
6. The rest go to the pack, one cell each. Overflow goes to the lockbox. Overflow past the lockbox becomes **2 sats each**, and a toast says how many were converted. Twelve charms is the most a rack can hold, so the refund is at most 24 sats, and only when both bags are already full. The flag means it cannot be farmed.
7. Delete `G.charms`, `charmOff`, and the minute timer. The bill stops. A hero who was lapsed simply gets their charms back as items, off, until step 5 equips what fits.

There is no stack to split. If a hand-edited save has a quantity field greater than 1, treat the object as one charm and ignore the quantity. Do not spawn 99 slips.

Heroes in Act I who collected a life rack keep those numbers on the slips they can wear. A Tool Belt will hold the two best. The other four take pack cells until they are sold, scrapped, or outgrown. That is the migration that respects the only current loadout that was actually strong.

## Head to head

### Belt slots (recommended)

Equipped charms occupy belt slots and apply. Carried charms occupy pack or lockbox cells and do not apply. Stims and charms are two budgets on the same item. White belts grow both. Uniques and two suffixes trade them.

The space-versus-power tradeoff is the slot budget (a grand costs 3, so it crowds out smalls) plus the pack footprint of anything not socketed. It is also the stim row: the Docket and the Sign-in Sheet cannot be the same belt.

This is the model that matches all three of Micah's notes. Charms are equipped. Anything not equipped takes inventory, by size, with no stack and no free rack. Belts grow a charm capacity next to the stim capacity they already have. The phone UI is a short row of buttons. PvP has a natural cap in the slot count, with two clamps where the quarter-damage rule does not reach. Build diversity is real: potion belt, charm belt, or the white line, and then which charms.

The cost is that belts become a system with two jobs, and every unique belt needs a written pair of numbers. This document is that list. The other cost is that a player who hates charms still looks at a charm row. It can be empty. Their stim cap does not go down.

### Diablo's inventory, charms active while carried

In Diablo, a charm works because it is in the pack. There is no equip step. The tradeoff is pure: every cell is a charm, a drop you want to haul out, or a potion. Small, large, and grand are the whole puzzle. High rolls are worth trading because they are individual items. That is the homage in its original shape.

To reach the power targets above, the pack would need enough cells of charms to add up to a 12–16% sheet swing, which on a 6×4 pack means a large fraction of the pack is charms, or each charm is so strong that one cell is a weapon. The first of those makes looting on a phone into inventory tetris every time a sword drops. The second makes the "I will carry one" decision too sharp and makes PvP a question of who filled more squares.

It also does not have an inactive charm. Carrying it is using it. Micah asked for equipped versus carried as two states. You can fake the second state by adding a "turn this charm off" flag, and then you have reinvented the belt slot without the belt. Stims are a counter in this game, not grid items. Getting Diablo's potion-versus-charm tension means moving stims into the grid as well, which is a second redesign of the thing players press in a fight.

I would ship this if the game were desktop-only and the pack were already a freeform grid. It is not the better fit for a phone, or for a belt that already exists to hold the potion row.

### A charm grid that is not the belt

A row of four slots, separate from the belt, always the same size for every hero. Equipped means "in the grid." Carried means "in the pack, inert, with a footprint." No stacking. No bill.

This hits the power target, the active-versus-carried split, the footprints, and the phone UI. It is the belt proposal with the belt left out. Implementation is smaller: no unique-belt table, no suffix, stims stay exactly as they are.

What it gives up is the choice of how many charms you run. Every Orbit wearer and every sash wearer would have the same four slots, or the grid would have to grow with level and ignore the belt anyway. The Docket versus the Sign-in Sheet would not exist. Micah's belt note is the reason this is the fallback and not the recommendation. If the unique-belt table feels like too much for the first version, ship the grid at 1 / 2 / 3 / 4 slots by character level (or by the best belt tier the hero has equipped, which quietly becomes the belt model). I would rather put the number on the belt, where the stim row already is.

### What I would not ship

A louder subscription rack. Raising the six rolls until a typical rack is +15% would make charms "worth it" on a spreadsheet and would leave every other complaint in place: no equip step, no inventory cost, no sizes, no trade, no chase item, and a bill that turns the bonus off. The rack is the part that feels weird. The numbers are why it also feels weak.

## Decisions

Each one has a recommendation. "Yes" on all of them is a shippable spec.

1. **Model.** Belt charm slots, with carried charms inert in the pack. The alternatives are Diablo's always-on pack, and a charm grid that ignores the belt. Recommendation: the belt.
2. **White belts.** Keep today's stim caps (4 / 6 / 8 / 10 / 12) and add charm slots (0 / 1 / 2 / 3 / 4). Recommendation: yes. The tradeoff lives on suffixes and uniques, so a new white belt is safe to wear.
3. **Suffix size.** of the Courier is +4 stims and −1 charm slot. of the Collection is +1 charm slot and −4 stims. Recommendation: one slot, not two, so the Sign-in Sheet and the Docket stay special.
4. **Grand cost.** A filing spends 3 belt slots and 4 pack cells. Recommendation: yes. Two slots would make grands strictly better than smalls. Four slots would make smalls obsolete.
5. **Gear footprints.** Only charms grow. Weapons and armor stay 1×1 in the 24-cell pack. Recommendation: yes for this pass.
6. **Lockbox.** Inactive charms can sit in the shared lockbox at their footprint. Recommendation: yes. The alternative is no muling.
7. **PvP clamps.** Charm life caps at 20% of pre-charm life. Charm skills cap at +2 total. Charm damage has no extra tax beyond the slot budget and the existing 0.25 hit scale. Recommendation: those two clamps only.
8. **Chase drops.** First Brutal PROVIDENCE kill on an account guarantees the Churn Notice. First Hard or Brutal Curator kill guarantees the Eleven-Minute Letter for that class. Both are tradable. Later kills are 5% and 6%. Recommendation: yes.
9. **Migration.** Keep the old affix, equip the best into the new slots, overflow to the pack, then the lockbox, then 2 sats each, once. Recommendation: preserve the roll. A full refund would delete the one life rack that currently matters in Act I.
10. **The bill.** The per-minute credit charge goes away with the rack. Recommendation: yes.
11. **Reroll.** No charm reroll in the first version. Scrap scales 2 / 4 / 8 parts by size. Recommendation: yes.
12. **Hirelings.** No charm slots on the mercenary. Recommendation: yes.

## Files the audit walked

- `src/p7.js` — `mkCharm`, `extra`, the kill-hook drop.
- `src/p10.js` — `chTake`, `chFix`, `chBill`, `upkeepTick`.
- `src/p2.js` — `calc`, `baseStats` (belt stim cap), `makeItem`, the life and damage formulas.
- `src/p1.js` — affix tiers, belt bases, the early unique belts.
- `src/p4.js` — the subscription row, sell and scrap.
- `src/p11.js` and `src/p10.js` — the later unique belts.
- `src/p13.js` — trades read the pack only. `PVP_SCALE` is 0.25 in `server/lib/live.js`.
