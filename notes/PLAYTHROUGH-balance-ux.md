# Playthrough notes: balance and UX

Phone-viewport play of the story tip after C2 (`7c901fb`). One fresh Scrapper. No balance or UX changes were made. Acts II–V were not reached. A second class was not spot-checked.

## Shipped in this PR

- [x] **Menu is one phone frame.** Items, Skills, Hero, Options, and Quests sit in the frame with the tab bar underneath the content, so the pack and the skill names are not covered. Story and Codex still scroll, inside that frame and above the tabs.
- [x] **Toasts are a short corner stack.** Two lines at most, off the objective. A line that is already on screen is not stacked again.
- [x] **Equip offer is a corner chip** above the right-hand buttons, not a banner across the fight.
- [x] **Story cards grow to the paragraph.** Next stays shut until the line has finished typing.
- [x] **Equip best shows damage and armor** before the swap. Confirm is a second tap.
- [x] **A shitcoiner can be declined.** Refusing, walking away, ignoring him, or having no sats sends him off. No champion, no Bagholders.

Not in the UX PR: the Balance list below (Fields door, early weapon drops, explosions, shill scaling, death fee versus hire price) and the Smear-on-turn-in note. Balance shipped in the follow-up.

## Shipped in this PR (balance)

- [x] **Act I doors are smaller.** The first combat room of the Moors and the Galleria is 3–4 normal machines, no champion. The Fields door is two non-tick normals at 70% damage. Tribunal’s door is two normals that are not wardens, at 55% damage. No champion and no volatile in either entrance. Later rooms and the lieutenants are unchanged.
- [x] **The Parcel Moors grants a weapon.** An identified magic weapon (item level 4, at least 9–16) is on the ground in the entrance, before the first pack and before the Galleria.
- [x] **A low-level shitcoiner is not a champion pack.** Below level 8 he is a normal shill, not fast, and a fight adds no Bagholders. Below level 6 most spawn attempts are skipped. Peaceful decline is unchanged.
- [x] **Act I explosions telegraph longer and hit softer.** Volatile death: radius 2.2 → 1.35, tell 0.7s → 1.35s, damage ×1.5 → ×0.85, while Act II is still closed. Champion slams in that span: radius 1.9 → 1.15, tell 1.0s → 1.6s, damage ×1.6 → ×0.7. Lieutenant slams are unchanged.
- [x] **HOA-9 and Marla were not retuned.** Mods stay strong+shield and fast+arc.
- [x] **Act I death fee no longer eats the hire.** Was 15% of credits, uncapped, every death. Now, until Act II: the first 10 deaths take 5% capped at 15 credits; later Act I deaths take 8% capped at 8% of Kestrel’s hire price. Act II and a cold wallet are unchanged (15%, or zero).

Left untouched: the Smear / adoption drain on Brenda’s turn-in, Acts II–V, C3/C4 copy, Homesteader/Witness, party and multiplayer, and the UX list above.

Screenshots cited below are attached on the pull request.

## 1. Session summary

- **Class:** Scrapper. Skill points were spread across the first three rows as they opened (Stop Sign, Hurl, Iron Hide, Turnstile, Picket Rush, War Horn, Overtime, Earthbreaker). Attribute points alternated Vitality and Might.
- **How far:** Prequel finished. Act I through Hollow Galleria: Gatewarden HOA-9 and Marla the Greeter are dead and turned in (Gramps, then Brenda). The Humming Fields were not turned in. At level 12, with the weapon finally at 21–36, one visit walked out the far door into Tribunal Row. That entrance lasted 14 seconds (a Heat explosion). The transit gate then sent the character back to the Fields, because q3 was still the active quest. Pryce and Acts II–V were not played.
- **Play time:** About half an hour across two passes. The prequel was 2 minutes 20 seconds. The second pass is the one these notes follow; the first pass is called out where it saw the same wall with different gear.
- **Setup:** 390×844, the phone layout. Movement, attack, stim, dodge, and skills were the keyboard equivalents of the on-screen controls. Thumb occlusion of the joystick was not tested.
- **What was read from the game:** Position, life, the quest arrow’s target, and sheet height. Nothing was granted. No warps, no god mode. Gear was equipped by tapping the mid-fight banner and, in town, the pack’s **Equip best** button. Kestrel was talked to. No companion was hired.

## 2. Chronological notes

### Prequel — Ubiquitous Enterprises, 2015

- **Low.** Six arrow stops, no combat, about 140 seconds. The desk-to-parking-deck walk is a clear on-ramp. The choice taken was “I am not proud of you.”
- **Medium.** Story cards overflow the text well. Monday measured 173px of text in a 149px box. The same overflow (173–198px vs 149px) hit the “you have not failed” card and several Act I intro cards (“So when Unity Holdings offered…”). The last lines sit under the Next button until you scroll inside the card.
- **Medium.** Tapping a stop that has already happened stacks the same toast three times: “The Cage. That part has happened.” The stack sits on the objective. See `toasts-prequel.png`.
- **Low.** Cards type on quickly, and Next finishes the line. A single eager tap skips the rest of the paragraph.

### Stillwater Commons

- **High.** The in-game menu does not fit a phone frame. Measured on the 844px-tall sheet, with the tab bar pinned to the bottom:

  | Tab | Sheet height | Fits one frame? |
  |---|---|---|
  | Items | 1385px | No |
  | Skills | 1499px | No |
  | Hero | 1983px | No |
  | Story | 6486px | No |
  | Options | 2356px | No |
  | Quests | 844px | Yes |

  Items and skills are the tabs you open every level. Getting to the pack, or to a skill’s description, means scrolling with the tabs covering the bottom. See `menu-items.png`, `menu-skills.png`, `menu-options.png`.
- **Low.** Gramps’s first quest and the transit gate are understandable. Traveling to an unlocked district is one sheet and one tap.

### The Parcel Moors (q1, Gatewarden HOA-9)

- **High.** The first district kills you before the quest target does. This pass: Rusted Enforcer (Impact) at level 2, then a Heat explosion at level 3. The earlier pass, with a slightly better starter weapon, died four times here (a named champion at level 1, Impact from “the machines,” a Rusted Enforcer, and a Heat explosion).
- **Medium.** HOA-9 itself went down without a death on that fight. The packs and the explosion were the difficulty.
- **Medium.** This character’s weapon stayed at its starter range, 5–9, through the whole district. Nothing in the pack was better. The earlier pass found a Road Sign (+85%, shown on the center banner) around level 3.

### Hollow Galleria (q2, Marla the Greeter)

- **High.** Shill for PonziDAO killed this character twice in a row, at level 3 and level 4, in 12–13 seconds, Noise damage. A Bagholder (Impact) killed the run before that. A later Shill for UnityCoin killed again in the Fields (Noise). The pitch has no decline that lets you leave: refusing, walking away, or being unable to pay the sats all start a fight, and the shill arrives as a champion with two Bagholders. See `death-shill.png`.
- **High.** Marla the Greeter killed the first attempt with Surge, at 17% life, in the same moment the center banner offered a Static Stop Sign at +119%. The retry, full life, weapon 13–22, killed her at level 7 without dying. She is a fair fight if you arrive healthy. She is not the problem the shill is.
- **High.** On leveling to 4 inside the mall, three toasts landed at once and covered the objective: the level-up line, then “A torn note with one word on it: echo”, then the same for “kernel”. The objective underneath was not readable. See `toasts-levelup.png`.
- **Medium.** The equip banner is a wide chip across the middle of the fight (“▲ Static Stop Sign · +119% stronger · tap to equip”), above the skill buttons, while a lieutenant is in range. See `equip-banner.png`. The same pattern fired in the Moors on the earlier pass (Road Sign, +85%).
- **Low.** After that weapon, the walk to the Galleria exit was 39 seconds and no death. The mall is fine once the weapon exists and the shill is behind you.

### The Humming Fields (q3, Defrag)

Zone listing for this district is level 6. The character entered at 7.

- **High.** The front of the district is a corpse run until the weapon catches up. Deaths on the way in: Wired Carrion Drone (Impact, twice, 8 seconds, one of those with zero kills), Gloomgnash the Downsizer (Surge, 9 seconds), Shill for UnityCoin (Noise), then “the machines” (Impact) and a Heat explosion. The earlier pass also died in the first 12 seconds at level 8. See `death-fields.png`.
- **High.** The lieutenant’s tile was reached at level 10, around 64% life, and a Heat explosion ended it there. See `death-fields-explosion.png`. Defrag was still the active quest afterward, so that blast was the neighborhood, not a logged kill on the keeper.
- **High.** Town **Equip best · 2 upgrades** dropped the weapon’s base range from 13–22 to 10–18. The next pull on the same drone was the zero-kill death. A later Equip best did the opposite and jumped the range to 21–36. The button does not show that damage change before it commits.
- **Medium.** With the range still 10–18, a later entrance at 21–36 still died in 37 seconds with one kill. After that same 21–36 weapon had been held for a trip, the following visit crossed the district in 40 seconds and came out the far door. The Fields are crossable once the swing exists. They are not crossable on the gear the first two districts hand you.
- Brenda’s turn-in (a ring, Bone Knot on this pass) worked. It immediately opened “Unity responds · The Smear” and said adoption drains until three townsfolk get a bitcoiner answer. That side errand was not done. The drain was not measured.

### Tribunal Row (q4) — one entrance

- **High.** Level 12, weapon 21–36, armor 20, full life. A Shill for Stablish opened a pitch at the door. Fourteen seconds and two kills later, a Heat explosion ended it. The gate’s next trip went back to the Fields, because that quest was still open. One sample, but it is the same explosion pattern on a character who had just walked the previous district.

### Not reached

Auditor Prime as a finished fight, the Glass Cathedral, Pryce and the MANDATE offer, Acts II–V, boss4/boss5, a hireling in combat, party pressure.

## 3. Prioritized fix plan

### UX

1. **Make the menu one phone frame, with no scroll.** Items, skills, hero, story, and options are all taller than 844px; quests already fit. The tab bar is sticky at the bottom, so the part you need (the pack, the skill text) hides under it. Why: this is the screen opened on every level-up and every gear check. Effort: medium. The sheet is one layout; the work is fitting doll, pack, and detail into the frame, not a new system.
2. **Shrink toasts and keep them off the objective.** One or two short lines, in a corner. Do not stack a repeated sentence, and do not fire the level-up line and two “torn note” lines in the same spot. Why: the level-4 stack hid the objective, and a finished prequel stop filled all three toast slots with one line. Effort: small.
3. **Move the equip prompt off the middle of the fight.** A corner chip, or equip-on-pickup with an undo, for the case that is clearly stronger. Why: the +119% banner sat over Marla while life was at 17%. Effort: small.
4. **Let a story card show the whole paragraph.** The text well is shorter than the copy (measured overflow on Monday and the Act I intro). Next also skips the rest of a line that is still typing. Why: the prequel and the act openers are the sentences a new player has to read. Effort: small.
5. **Show the damage and armor change on Equip best before it swaps.** Why: one tap in town cut the weapon range from 13–22 to 10–18 and the next room became a zero-kill death. A later tap raised it to 21–36. The player cannot see which of those they are about to do. Effort: small.
6. **Give the shitcoiner pitch a decline that does not start a fight.** Refusing, walking away, and being unable to pay all aggro a champion plus two Bagholders. Why: that fight killed a level 3–4 Scrapper twice in the Galleria and again in the Fields. Effort: small.

### Balance

1. **Bring early-Act I damage spikes down, starting with the Fields door and Tribunal’s first room.** On gear from the first two districts, the Fields entrance kills in under 15 seconds (drone, named champ, pack, Heat explosion), on two characters. The same explosion pattern killed a level 12 character with a 21–36 weapon 14 seconds into Tribunal Row. Once that weapon had been in hand for a trip, the Fields themselves were a 40-second crossing. Why: the act stops on the door, not on the lieutenant. Effort: medium (first rooms and volatile explosions, not a full act retune).
2. **Put a weapon upgrade in the Parcel Moors.** This run fought district 1 and most of district 2 on a 5–9 starter. The first real swing was a single +119% drop in the Galleria; the next was at level 10 (21–36). Why: the deaths before that drop are a power gap, not a puzzle. Effort: medium (early drop table or a quest weapon).
3. **Do not send a champion shitcoiner and two adds at level 3.** Scale that encounter to the district, or keep it rare until the player can live through Noise. Why: it was a harder fight than Marla. Effort: small.
4. **Give low-level explosions a longer tell or a smaller blast.** Heat explosions killed in the Moors at level 3 and on Defrag’s tile at level 10. Why: they end a pull that was otherwise going. Effort: small.
5. **Leave the quest uniques alone until the packs are survivable.** HOA-9 never got a kill. Marla killed once, from 17% life, and died cleanly on the retry. Why: tuning them up would make the act harder in the wrong place. Effort: none until the fields change.
6. **Check the death fee against Kestrel’s price.** Sixteen deaths on this pass, each taking a cut of credits, and the hire dialog never produced a companion. Why: the hire is offered in Act I and this character could not take it. Effort: small (confirm the numbers; the fee is already printed on the death screen).

### Content

1. **Do not start the Smear, or the adoption drain, on the Brenda turn-in.** The main-quest reward immediately opened a side errand and said adoption drains until it is done. Why: a player following the arrow inherits a penalty they did not opt into. Effort: small.
2. **The prequel can stay.** It is short, safe, and it points. No content hole there.

## 4. Non-issues

- The death screen is clear: killer, damage type (Impact, Heat, Noise, Surge), a credit fee, and one button back to town. Cleared machines stayed dead, so a death was a walk back, not a full reset.
- The quest arrow, the transit gate, and the Gramps and Brenda turn-ins all behaved. Zone intro dialogs were readable aside from the overflow in section 2.
- Dialog buttons stay locked for a moment, including the prequel’s “I am not proud of you.” That pause is the right call on a phone.
- The Quests tab fits the frame.
- Hollow Galleria after the weapon upgrade, on the way to the exit, was a normal clear.
- Dynamic difficulty was left on (the default). The Fields deaths happened with it on.
- Skill and attribute spending works, and the skills sheet says passives only change in town.

## 5. Screenshots

| File | What it shows |
|---|---|
| `menu-items.png` | Items sheet on a 390×844 screen. Pack and detail sit below the fold. Tabs are at the bottom. |
| `menu-skills.png` | Skills sheet, same problem. Stop Sign’s text is partly behind the tab bar. |
| `menu-options.png` | Options list running well past one frame. |
| `toasts-levelup.png` | Level-up toast plus two torn-note toasts covering the objective in Hollow Galleria. |
| `toasts-prequel.png` | Three identical “The Cage. That part has happened.” lines. |
| `equip-banner.png` | “+119% stronger · tap to equip” across the middle of the Marla fight. |
| `death-shill.png` | Death to Shill for PonziDAO, Noise, in Hollow Galleria. |
| `death-fields.png` | Death to a Wired Carrion Drone, Impact, at the Humming Fields entrance. |
| `death-fields-explosion.png` | Death to a Heat explosion on the lieutenant’s tile. |
