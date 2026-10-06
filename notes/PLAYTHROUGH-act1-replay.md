# Act I replay

Phone-viewport replay of the story tip after UX #13 (`6baf2f6`), Act I balance #14 (`91b73e9`), and Smear opt-in #15 (`8d6b19c`). Notes only. No game code was changed.

An automated player drove a fresh Scrapper with keyboard-equivalent input through the real frame loop: walk, attack, skills, stims, menus, dialogs, the equip chip, and Equip best. Dynamic difficulty stayed on. No god mode, no `enter()` warps, no granted gear. Viewport 390×844.

## 1. Session summary

- **Class:** Scrapper. Doctrine Picket Line, taken in town. Skills, in the order they were bought: Iron Hide, Hurl, Turnstile, Picket Rush, War Horn, a second point in Stop Sign, then at level 9 Overtime, Earthbreaker, and Solidarity. One skill point was still unspent (the next row opens at level 26). Attributes alternated Vitality and Might and finished 20 / 20.
- **How far:** Prequel, Parcel Moors (HOA-9), Hollow Galleria (Marla), Brenda’s turn-in, Humming Fields door. Stopped on Defrag, Keeper of the Stacks. Tribunal Row, the Glass Cathedral, Auditor Prime, and Pryce were not reached.
- **Deaths:** 9. Every death screen showed a re-onboarding fee of ₡15. Three before the Fields (Moors at level 3, Galleria at 5 and 6). Six in the Fields at level 9, which is where the run stopped.
- **Play time:** 646 seconds of game time (about 10 minutes 46 seconds). The driver’s wall clock was about 13.5 minutes.
- **Weapon progression:** Box Cutter 3–6 → Jagged Parcel Sling of Readiness 5–9 → Road Sign of the Jolt 11–20 (on the ground in the Moors; Equip best showed damage 6–10 → 12–22) → Signal Baton 16–27 → Vicious Ceramic Shiv 16–28, still equipped at the stop.

## 2. Chronological notes

### Prequel and Stillwater

- **Low.** The prequel walked. The choice was “I am not proud of you.” Gramps opened Neighbourhood Watch. The phone menu was measured in town: Items, Skills, Hero, Options, and Quests all sat in the 844px frame (body 763/763, no overflow, tabs inside the frame). Story and Codex scrolled inside that frame (5867/763 and 7801/763).
- **Low.** The first story card that finished typing was fully on screen. The longest card measured, Monday (314 characters), was 167px in a 168px well. Next stayed disabled while the line was still typing.

### Parcel Moors (HOA-9)

- **Low.** The entrance drop was Road Sign of the Jolt, a magic Stop Sign, item level 4, identified, damage 11–20. That is inside the 9–16+ band the balance pass aimed for.
- **Low.** HOA-9 died in 31.8 seconds at level 4, weapon already 11–20, with no death on that fight.
- **Low.** One earlier death in the district, level 3, Impact from “the machines,” fee ₡15. The run was not a corpse loop.
- **Low.** A shitcoiner was refused with “No. There is bitcoin, and there is everything else.” He jogged off (“Maxi! Dinosaur!”). No Bagholders, no champion. A later pamphlet in the Fields was walked away from (“He lets you walk.”). Fight count stayed 0.
- Champion warn circles in this district were radius 1.15 with a 1.6s tell. One larger circle, radius 1.9 and a 1.0s tell, lined up with a superunique slam rather than a normal champion.

### Hollow Galleria (Marla)

- **Low.** Marla died in 28.4 seconds at level 7, same 11–20 road sign, with no death on that fight.
- **Medium.** Two deaths on the way in, both Polished Enforcer, Impact, levels 5 and 6, fee ₡15 each. The mall is crossable. The enforcers are the sharp part, and they are ordinary deaths rather than a wall.
- Equip best in town, before the road sign was worn, showed the damage row (6–10 → 12–22) and the armor row (0 → 0) before the confirm tap.

### Brenda, then the Fields door

- **Low.** Brenda’s turn-in set the story objective to The Last Librarian: go to the Humming Fields and destroy Defrag. She gave the discount (`disc` set). Adoption stayed at 20. No campaign was running. The toast and the objective did not say “Unity responds · The Smear.”
- **Low.** Nonce’s dialog offered The Smear with “I will answer it,” “Not now,” and “Talk about money.” This pass pressed Not now. Accepting was left for after Defrag, which the run never reached.
- **Low.** The Fields entrance pack was two gate enemies. They died in 8.9 seconds. The character lived, level 7, still on the 11–20 road sign. That is a short clear, not a sub-15s corpse run. The pack was already dead before an 11-second “still fighting” frame could be taken.
- **Low.** Adoption in the Fields, with no campaign accepted, stayed 20 across 50 seconds of play outside town.

### Defrag — stop

- **High.** Defrag, Keeper of the Stacks, is the wall. Level 9, Vicious Ceramic Shiv 16–28, full life on the walks back (451). Six deaths in the district without the quest moving off state 1. Three of those screens name Defrag and Surge. One names a Wired Siren and Noise. Two name “the machines” and Impact, on the walk back to his tile. Fee ₡15 every time. The run stopped there on purpose.
- **Low.** Credits at the stop were 8784. The ₡15 cap left a hire affordable. Kestrel was never spoken to: each town visit after a Fields death stepped back through the return portal before the hire dialog.

Tribunal Row was not entered, so the Tribunal half of the door fix was not re-measured.

## 3. Checklist

### UX #13

| Fix | Result | Evidence |
|---|---|---|
| Menu Items / Skills / Hero / Options / Quests fit one phone frame. Story / Codex may scroll inside it. | Pass | 390×844. Fit tabs: body 763/763, overflow false, tab bar from y 769 to 844. Story 5867/763 and Codex 7801/763 scroll inside the frame. |
| Toasts in a corner, ≤2 lines, off the objective, no identical stack. | Pass | Stack max 2, no duplicate lines, no overlap with the objective. The captured toast is two lines (“Picked up / Road Sign of the Jolt”) in the lower right. A two-line toast is about 34px tall at 10.5px type, which is why a 32px probe flagged height; the lines themselves stay at two. |
| Equip offer is a corner chip, not a mid-fight banner. | Pass | “▲ Sturdy Courier Mail of the Hound / +23% · tap” sits above the right-hand buttons. The fight is not covered. |
| Story cards show the full paragraph. Next waits for typing. | Pass | Next was disabled while the line typed. Monday, 314 characters, measured 167px in a 168px well. |
| Equip best shows damage and armor before the swap. | Pass | Pop read “Road Sign of the Jolt, Damage 6–10 → 12–22, Armor 0 → 0,” with Equip these / Leave them. |
| Shitcoiner decline leaves without a Bagholders fight. | Pass | One refuse (“Maxi! Dinosaur!”) and one walk-away (“He lets you walk.”). Fight 0, champion 0, Bagholders 0. |

### Balance #14

| Fix | Result | Evidence |
|---|---|---|
| Moors entrance weapon about 9–16+. | Pass | Road Sign of the Jolt on the ground: magic, identified, item level 4, 11–20. |
| Fields / Tribunal first rooms are not sub-15s corpse runs on mid-Act-I gear. | Partial | Fields door: 2 enemies, cleared in 8.9s, lived, level 7, weapon 11–20. Tribunal was not entered. |
| Low-level explosions: longer tell, smaller blast. | Pass | Act I champion warns were radius 1.15 and a 1.6s tell (Moors and Fields). Superunique slams stayed at radius 1.9 and a 1.0s tell. No volatile-death circle was sampled. |
| Early shitcoiner fight is not a champion plus two Bagholders. | Partial | The fight never started. The decline path is what this pass took, so the scaled pack was not seen. |
| Death fee is cheap enough that a Kestrel hire is reachable. | Partial | Nine screens, every one ₡15, from level 3 through level 9. Credits at the stop were 8784. The hire dialog was never opened. |
| HOA-9 and Marla stay fair. | Pass | HOA-9: 31.8s, level 4, 11–20, no death on the fight. Marla: 28.4s, level 7, same weapon, no death on the fight. |

### Smear #15

| Fix | Result | Evidence |
|---|---|---|
| Brenda turn-in: ring/reward and the Fields next. No auto Smear. Adoption does not drain if the Smear was not accepted. | Pass | Objective became The Last Librarian / Humming Fields / Defrag. `camp` stayed null, `disc` set, adoption 20. Fifty seconds in the Fields later, adoption was still 20. |
| Nonce offers The Smear with Not now / accept. | Pass | Buttons were “I will answer it,” “Not now,” and “Talk about money.” This pass pressed Not now. Accept was never reached because Defrag was not killed. |

## 4. Remaining issues

Only items that are still broken, or new on this pass. Shipped menu, toast, chip, story-card, Equip best, shitcoiner decline, Moors weapon, Fields door, champion explosion tell, Brenda’s turn-in, and the Nonce offer are not listed again.

### Balance

1. **High. Defrag is the Fields wall.** Level 9, weapon 16–28, six deaths in the district, quest still “destroy Defrag.” Three of the screens are Defrag / Surge. The entrance pack is no longer the thing that stops the act. The keeper is. Tribunal and everything after it were not reached, so the Tribunal door is unmeasured this pass.
2. **Low. The Fields entrance now swings the other way.** Two gate enemies died in 8.9 seconds at level 7 on an 11–20 weapon. That is a clear, not a corpse run. It does not need a nerf. It is the reason the old “door” bug should not be re-opened.

### UX

None new. The phone frame, corner toasts, corner chip, story card, and Equip best preview all held on this pass.

### Content

None new. The Smear stays off Brenda and shows up on Nonce. Accepting it was not played, because the Fields quest never turned in.

## 5. Screenshots

| File | What it shows |
|---|---|
| `replay-menu-items.png` | Items on a 390×844 frame. Pack, credits, and Close sit in one screen. |
| `replay-menu-skills.png` | Skills tab, same frame. |
| `replay-menu-char.png` | Hero tab, same frame. |
| `replay-menu-opts.png` | Options tab, same frame. |
| `replay-menu-quests.png` | Quests tab, same frame. |
| `replay-menu-story.png` | Story tab, scrolling inside the frame. |
| `replay-toasts.png` | Two-line pickup toast in the lower right. The objective stays readable. |
| `replay-story-card.png` | A finished story card with Next available after the line has typed. |
| `replay-equip-chip.png` | Corner chip: Sturdy Courier Mail of the Hound, +23%, tap. |
| `replay-equip-best.png` | Equip best preview: damage 6–10 → 12–22 and the armor row, before confirm. |
| `replay-moors-weapon.png` | Road Sign of the Jolt on the ground in the Parcel Moors, 11–20. |
| `replay-brenda-fields.png` | After Brenda: objective is The Last Librarian / Humming Fields / Defrag. No Smear line. |
| `replay-nonce-offer.png` | Nonce offers The Smear. “I will answer it” and “Not now” are both on the card. |
| `replay-death-fee.png` | Early death. Re-onboarding fee ₡15. |
| `replay-death-wall.png` | The Fields stop. Surge from the keeper’s end of the district, fee still ₡15. |

No Fields-door frame. The entrance pack was dead at 8.9 seconds, so there was no “still in the doorway at 11 seconds” moment to shoot.
