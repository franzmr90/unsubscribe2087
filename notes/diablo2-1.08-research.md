# Diablo II / LoD circa patch 1.08 — research for a reimplementation

Produced by a research subagent, October 2026. Every behavioural claim is sourced.
**Claims marked UNVERIFIED could not be confirmed against a reachable primary source — do
not treat them as fact.** Blizzard's live Arreat Summit pages are a post-1.10 snapshot, so
every claim was cross-checked against the 1.08/1.09/1.10 patch notes.

## Most important findings

- **1.08 is the Lord of Destruction *launch-day* build, not a mid-life patch.** 29 June
  2001, the same day as the expansion; 1.07 shipped on the retail CD and 1.08 was the
  day-one Battle.net update. Then 1.09 (20 Aug 2001), then 1.10 (28 Oct 2003).
- **No skill synergies in 1.08.** Synergies arrived with 1.10's data-driven rewrite. A
  skill's power came only from its own points plus items.
- **No Ladder seasons in 1.08.** Ladder characters and seasonal resets came in 1.10. A
  *ranking* ladder existed earlier, which is a different thing.
- **No `/players X` in 1.08** — added in 1.09, single-player/open/TCP-IP only. Scaling by
  real player count did exist: `Life = HP × (players+1)/2`, `Exp = base × (n+1)/2`.
- **Runewords existed but were partly realm-only.** The famous 1.10 runewords (Enigma,
  Heart of the Oak, Infinity, Spirit) did not exist.
- **Party experience is a flat +35% pool and a level-weighted split — there is no
  party-size bonus table.** The *drop-chance* table is size-based: `1 − 0.75^n`.
- **The "2 screens from the kill" experience leash is a 1.10 rule.** In 1.08 the
  requirement was only "same named area" on the automap.
- **Gold was split among party members in 1.08**; LoD removed gold sharing in 1.09.
  Sources conflict — the Arreat Summit still documents splitting and was never updated.

## 1. Patch 1.08 specifically

It reads like a balance pass on an unfinished launch build:

- Two-handed attack speed with two weapons is **averaged**; Whirlwind alternates weapons.
- Big elemental-caster buffs: Fire Wall, Blizzard duration, Frozen Orb, Ice/Fire
  Ball/Lightning/Nova/Glacial Spike per-level damage; Meteor's cast delay reduced.
- **Casting delays added** to Fist of the Heavens, Immolation Arrow, Plague Javelin — an
  era signature: hard per-skill cooldowns rather than resource throttling.
- **Immunity hard-walls established:** Conviction, Lower Resist, Amplify Damage and Cold
  Mastery stop working on immune monsters. **Static Field capped in expansion games**
  (won't take a monster below 33% HP in Nightmare, 50% in Hell).
- Druid shapeshift nerfs across the board.
- Item economy: claw durability doubled, elite weapon damage retuned, higher chance of
  enhanced-damage/AR/armor affixes, rune resistance bonuses up, +2 all skills allowed on
  rare amulets, Crushing Blow cut 50% on bows, jewel drop rates up, charm damage reduced.
- Rite of Passage gated behind clvl 20/40/60 by difficulty.

**Contemporaneous reaction was hostile.** A 2001 thread titled "A SAD DAY FOR D2 PLAYERS"
collects complaints about characters "rendered completely ineffective," reduced block
rates, new casting delays, and broken dueling.

**1.09 added what 1.08 lacked:** `players X`; runewords for non-realm games; the add-socket
cube recipe; rares always spawning with 3+ affixes; set/unique items from gambling; Town
Portal restricted to party members; Iron Golems saved with the character; the hireling
experience system and Act II auras; PvP damage set to 1/4; better super-unique and
quest-boss drops; and monster stats reverted "back to what they were before v1.08."

**1.10 added:** synergies, Ladder characters/seasons, 20 new runewords, 100+ new uniques,
the 2-screen exp leash, a harsher clvl-70+ exp penalty, much tougher Nightmare/Hell.

**Why 1.08 partisans prefer it.** (a) Without synergies, **points are fungible** — hybrids
stay viable, whereas after 1.10 "the game literally tells you what to max out." (b)
Itemization centred on magic-finding rather than runeword assembly. The preservation
community calls 1.08 "the 'true' version of what the original LOD launch and design was
like." **Counter-view:** 1.09 is often called the first *stable* expansion build and 1.10
genuinely made more classes viable. Whether 1.08 was "more balanced" is contested —
**UNVERIFIED either way.**

## 2. The seven classes (LoD)

| Class | Mechanical identity | Trees / organising idea |
|---|---|---|
| **Amazon** | A weapon-platform class that picks a *delivery system* — thrown javelin, spear, or bow — and buys survivability through passive avoidance rather than armour. | Javelin & Spear; Passive & Magic (dodge/avoid/evade, pierce, criticals, Valkyrie/Decoy); Bow & Crossbow |
| **Barbarian** | The only class built around *weapon mechanics themselves*: dual-wielding, per-weapon-type masteries, shouts that buff the party. | Combat Masteries; Combat Skills; Warcries |
| **Necromancer** | A battlefield-manager whose power is in *other units and the enemy's own corpses*, not his own attack. | Summoning; Poison & Bone; Curses |
| **Paladin** | The party's engine: one always-on aura radiating to allies and hirelings. | Combat Skills; Defensive Auras; Offensive Auras |
| **Sorceress** | Three parallel damage economies plus mobility; defined by which element she specialises and whether she has Teleport. | Cold; Fire; Lightning (each bolt → ball → mastery) |
| **Assassin** | A combo class: charge-up strikes bank effects, finishers spend them. | Martial Arts; Shadow Disciplines; Traps |
| **Druid** | Pays an opportunity cost no one else does: transforming locks skills off. | Elemental; Shape Shifting; Summoning |

Signature mechanics:

- **Paladin auras:** only one at a time; different auras stack across multiple Paladins;
  in effect whenever readied as the right-mouse skill; buff "all party members" and their
  hirelings. Resist auras grant a hidden **+1% max resist per point** (cap 95%), halved for
  the Paladin himself.
- **Necromancer corpses & minions:** one golem at a time; golems need no corpse but Iron
  Golem consumes an item; minions **leash** — they vanish or stop obeying if you outrun
  them, and Teleport instantly recalls them.
- **Assassin charge/finish:** a charge-up adds a charge per successive hit within a short
  window; a normal attack or a Finishing Move spends them. Charges stack across *different*
  charge-ups for combined effects.
- **Druid shapeshift:** in animal form you **lose access to certain skills**; weapon damage
  still applies, but **ranged weapons lose their range** and must be used at melee distance.
- **Barbarian weapons:** 1.08 made dual-wield speed an *average* of both weapons.

**Dominant archetypes — UNVERIFIED community recollection:** Whirlwind Barbarian, Bowazon
(called "the undisputed king of PvP" in 1.09), Meteor/Fireball and Blizzard Sorceress,
Zeal/Hammer Paladin. What *is* verifiable is the causal shape: no synergies and no Enigma
meant builds were a single maxed skill plus gear, and Teleport was a Sorceress privilege.

## 3. Skill tree structure

- Everyone starts with **Attack, Throw, Unsummon**; **30 class skills, 3 tabs × 10**,
  arranged "much like a Tech-Tree."
- Tiers unlock at character level **1, 6, 12, 18, 24, 30**; only **one point per character
  level past the skill's required level**; hard cap **20 points** per skill (exceedable only
  via items, Battle Command, Skill Shrine).
- **Prerequisites** are the shaded arrows: locked until ≥1 *real* point in each prerequisite
  and the level is met. Item-granted skills let you *use* a skill but **unlock nothing
  downstream**.
- **Skill points:** one per level, plus quest rewards once per difficulty — Den of Evil +1,
  Radament +1, Izual +2 = 4 per difficulty, **12 total**, so **110 max at level 99**.
- **No respec existed in 1.08.** Respec arrived in **1.13**, in 2010.
- **+skills from items** apply **only to skills with at least one point already**.
- **oskills** are skill bonuses with **no class restriction**; if the wearer's class owns
  the skill, the bonus is **capped at +3**.

## 4. Battle.net social systems

**Friends list.** `/f` or `/friends`; `/f a <name>` add, `/f r` remove, `/f l` list "all of
your friends and their current status", `/f m <msg>` broadcast to the whole list, `/f p` /
`/f d` promote/demote a slot. **Max 25 friends.** Address by list position: `/f %5`.
Friending is **one-way** (it is your list) but visibility is **mutual-gated** — you see the
game or channel a friend is in only when the friendship is mutual, otherwise they read as
being in a private game. **UNVERIFIED:** the exact `/f l` output fields. Do not assume
difficulty was shown.

**Whisper / messaging.** `/w`, `/msg`, `/whisper`; `/msg *<account>` reaches whichever
character that account is on; `/msg <Char@Realm>` crosses realms; `/reply` answers the last
message; `/squelch` = `/ignore`, with `/unsquelch`; `/away <reason>` and `/dnd <reason>`
(DND prevents all whispers); `/whois` (aliases `/where`, `/whereis`); `/whoami`; `/who
<channel>`; `/users`. Filters: `/o igw` ignores whispers from non-friends, `/o igpub` /
`/o igpriv` ignore public/private channel chat from non-friends. **Whispers to offline
players are not deliverable and no offline store is documented — UNVERIFIED, but no
evidence of one exists.** Hotkeys mattered: `CTRL+N`/`ALT+N` paste the selected name,
`ALT+W` whispers them, TAB cycles your last 10 commands.

**Channels.** `/join <name>`; joining and creating are the same act. Three kinds: **Public**
(no operator, profanity-filtered), **Private** (unfiltered), **Op channels** (named after
the creator's account: `/join op <account>`). Operators can `/kick`, `/ban`, `/unban`,
`/designate` an heir, `/resign`. **Trading in chat was impossible** — "To trade, you must
enter a game and use the Secure Trading Screen."

**Game creation / joining.**
- Create takes a **game name, password, and description**; **max 8 players**; difficulty
  gated by having beaten the previous one. Open games also expose a **character-level
  difference limit and a max-player limit**, explicitly recommended as anti-PK tools.
- **Game lifetime, exactly:** under 1 minute old → stays up 1 minute even if empty; 1–5
  minutes old → **vanishes immediately** when empty; over 5 minutes → lingers **5 more
  minutes**. A game with no players never appears on the list. On disconnect the game
  persists "several minutes" so you can return. **Nothing special happens when the creator
  leaves** — only emptiness matters.
- Characters are **realm-bound**, **8 per realm per account**, saved every 5 minutes and
  whenever anyone leaves. **Your corpse follows you between games.** Names: 2–15 letters,
  one dash or underscore, no digits or spaces, unique per realm.
- **Guilds and arenas were cut from D2 and never shipped.**

## 5. Party dynamics

**Experience.**
1. The monster's exp pool is **+35%** if a party member of the killer is in the same
   **named area**. The official wording reads as a **single flat 35%, not per member** —
   whether it scaled with party size is **UNVERIFIED**.
2. Split: each member gets `member level ÷ sum of all member levels`.
3. Each share is then multiplied by the solo level-difference curve: 100% within 5 levels,
   sliding down across 6–10, floor **5%** at ≥10 difference. For clvl 25+, monsters above
   your level give `exp × (clvl / mlvl)`.
4. Area requirement: 1.08 = same named area. **The 2-screen radius came in 1.10.**
5. Death: **5% of the current level's exp band in Nightmare, 10% in Hell**, never a level
   loss; recovering your corpse refunds **75%** (save-and-exit refunds nothing). The
   clvl-70+ decay table on the Arreat Summit is post-1.10 — **the 1.08 curve is UNVERIFIED.**
6. For two neutral players, **the killing blow takes all the experience.** Hirelings and
   minions never steal exp.

**Player-count scaling:** `Life = HP × (players+1)/2`, `Exp = base × (n+1)/2`, recomputed as
people join and leave.

**Drops:** every party member *in the area of the kill* adds a roll multiplier; **every two
extra non-area players count as one**. Chance of a drop = `1 − (1−p)^n` (25% → 43.8% →
57.8% → 68.4% → 76.3% → 82.2% → 86.7% → 90.0%). It affects **frequency only, never
quality**.

**Hostility.**
- Declared from the **Party screen, only while in town**; the target can be anywhere.
  Requires **clvl ≥ 9**. **Once per minute per opponent.**
- **Asymmetric to undo:** going hostile makes the target hostile to you automatically, but
  going neutral does *not* clear their hostility — they can still hit you and you cannot
  answer until you return to town and re-declare.
- Going hostile with any party member makes **their whole party** hostile to you; going
  hostile with your *own* party member just drops you from the party as neutral.
- Anti-ambush rules: declaring **destroys your own Town Portals**; hostiles **cannot use
  another player's Town Portal**; "absentee" skills (Meteor, Fire Wall, sentries, Volcano)
  are **terminated when the caster enters town**; a **10-second lockout** between declaring
  and using a waypoint or TP to leave town. Towns are safe.
- **Neutral players cannot be targeted** — the cursor slides to a monster, a hostile, or the
  ground.
- **PvP kill:** you drop a **named ear** (name, class, level) and only the gold a
  monster-death would have cost; no experience loss from PvP deaths. Minions, hirelings,
  Valkyries and golems fight hostiles at **half damage**.
- **PvP damage scalar — sources disagree:** 1.09 set it to **1/4**; the current Arreat
  Summit says **17% (1/6)**. **The 1.08 value is UNVERIFIED.**
- Logged-out characters linger **15–30 seconds** in the world.

**Loot & corpses:** **no loot-ownership timers, no per-player drops.** The Arreat Summit
teaches social conventions instead — rotation, master looter, or "the least structured
method, but unfortunately most popular… Free-For-All." **Corpse looting is a Hardcore-only
consent toggle** and the only way to rescue a dead hardcore character's gear.

**Gold:** in 1.08, picking up gold **splits it evenly** among party members in the same
area, remainder to the picker, and **cannot be turned off**. 1.09 removed this in LoD; the
Arreat Summit was never updated, so **sources conflict.**

**Quests in a party:** only the quests available to the **game's creator** appear in that
game, and you generally must be on the level where the boss dies — community-sourced,
**UNVERIFIED**. What *is* official is the **blocking-quest portal rule**: you cannot enter
another player's Town Portal into Canyon of the Magi, the Arcane Sanctuary chain, Durance of
Hate, Worldstone Keep, or the Cow Level without having done the gating quest yourself,
explicitly "to prevent higher level players from helping lower level players to advance
further in the game without working for it."

## 6. What made it feel good

1. **Points were terminal decisions.** No respec until 2010, 20-point cap. Characters were
   identities.
2. **Pre-synergy points were fungible across trees**, so hybrids worked. If you want 1.08
   feel, do not add synergies.
3. **The social layer lived in the party screen, not a menu.** One screen held invites,
   hostility, chat exclusion, squelch and hardcore loot consent, and "when you press any
   button on the Party screen, the target player receives an appropriate message about your
   action" — every social act was *visible to its subject*.
4. **PvP was opt-in, town-safe, and asymmetric on purpose.** Town-only declaration, a level
   floor, TPs destroyed, absentee spells cancelled, a 10-second exit lockout — deliberate
   anti-griefing *mechanics* rather than etiquette, while the one-sided un-hostile rule kept
   the stakes real.
5. **Co-op had real friction that produced real negotiation.** FFA loot, forced gold
   splitting, minion leashing, blocking-quest portals, and "the killing blow takes the exp"
   generated social contracts the Arreat Summit had to document as etiquette.
6. **Scaling was one legible formula, not a difficulty slider.** `(players+1)/2` on HP and
   exp with `1 − 0.75^n` on drops is simple enough that players optimised against it.
7. **Risk was priced, not punished.** Exp loss with a **75% corpse-recovery refund**
   rewarded going back in.
8. **Caveat to all nostalgia:** players at the time hated 1.08, and 1.09 reverted its
   monster stats outright. The golden-age framing is retrospective.

## Unresolved

1.08's PvP damage scalar; 1.08's clvl-70+ exp curve; whether the 35% party exp bonus scales
with party size; the exact `/f l` output fields; the exact 1.08 runeword roster.

## Sources

Blizzard: classic.battle.net/diablo2exp/ — basics/parties, basics/experience, basics/pvp,
basics/hardcore, faq/multiplayer, faq/realms, faq/ladder, faq/gameplay, skills/ (index),
skills/basics, skills/assassin-martialarts, skills/druid-shapeshifting,
skills/necromancer-summoning, skills/paladin-defense; classic.battle.net/info/commands,
/info/channels.

Patch notes: diablo.fandom.com/wiki/Patch_1.08_(Diablo_II), _1.09_, _1.10_;
diablo-archive.fandom.com/wiki/Patch_1.13_(Diablo_II); also Game_commands, Oskill,
Enigma_Rune_Word, Token_of_Absolution.

Community (corroboration and era reaction): themovingcaravan.com patch 1.07–1.08 timeline
analysis; forums.anandtech.com 2001 "A SAD DAY FOR D2 PLAYERS";
us.forums.blizzard.com "Remove synergies"; theamazonbasin.com/wiki Patch;
almarsguides.com permanent quest rewards; diablo2.io game-lifetime thread.

Fetch-blocked, used only via search summaries and marked UNVERIFIED: diablo2.diablowiki.net
Skills; purediablo.com "Credit for quests"; forums.d2jsp.org mutual-friends thread;
rpgcodex.net favourite-version thread.
