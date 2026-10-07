# Act I replay, second pass

Phone-viewport replay of the story tip after Defrag #17 (`c3e656e`, merge of the Act I soften). The earlier replay is `notes/PLAYTHROUGH-act1-replay.md` (stopped on Defrag). Notes only. No game code was changed.

An automated player drove a fresh Scrapper with keyboard-equivalent input through the real frame loop: walk, attack, skills, stims, menus, dialogs, the equip chip, and Equip best. Dynamic difficulty stayed on. No god mode, no `enter()` warps, no granted gear. Viewport 390×844.

## 1. Session summary

- **Class:** Scrapper. Doctrine Picket Line, taken in town. Skills, in the order they were bought: Iron Hide, Hurl, Turnstile, Picket Rush, War Horn, a second point in Stop Sign, then at level 9 Overtime, Earthbreaker, and Solidarity. Further points stayed unspent (the next row opens at level 26). At level 18 the bar was 11 unspent and the attributes were 45 Vitality / 45 Might. The killing pull dinged to 20 with those new points still unspent.
- **How far:** Prequel, Parcel Moors (HOA-9), Hollow Galleria (Marla), Brenda’s turn-in, Humming Fields, Defrag, Tribunal Row (Auditor Prime), Glass Cathedral, Pryce. Exit Interview completed. Act I is clear on this character.
- **Deaths:** 18. The first death screen is the only one the driver kept: Parcel Moors, level 3, “the machines,” Impact, re-onboarding fee ₡11, 60 kills, ₡214 left. Later screens were clicked through. Where a heartbeat and the town line sit on either side of the death, deaths 7, 8, 9, and 10 each moved the balance by ₡15. Death 11’s balance fell much further (₡73,495 → ₡63,340) with no fee line captured. Deaths 12–18 are mixed with loot, so the fee is not isolated.
- **Play time:** 1,188 seconds of game time (19 minutes 48 seconds) when Pryce fell. The driver’s wall clock was about 23 minutes.
- **Weapon progression:** Stop Sign 6–12 → Stop Sign of the Rat 8–15 → Static Box Cutter 7–12 (brief) → Vicious Stop Sign 15–26 → Arcing Girder of the Tick 26–45, equipped at game time 397 and still equipped when Pryce died. The Moors floor drop, Tuned Bent Rebar of Aim 9–16, stayed on the ground. The pack was full from the Fields onward, so later weapons were toasted and left.

### Deaths

| # | Game time | Where | Level | What the log shows |
|---|---|---|---|---|
| 1 | 105s | Parcel Moors | 3 | Death screen: the machines, Impact, fee ₡11 |
| 2 | 195s | Hollow Galleria | 5 | Screen not kept |
| 3 | 216s | Hollow Galleria | 5 | Screen not kept |
| 4 | 246s | Hollow Galleria | 6 | Screen not kept |
| 5 | 273s | Hollow Galleria | 6 | Screen not kept |
| 6 | 385s | Humming Fields, before Defrag | 8 | Screen not kept |
| 7 | 450s | Defrag | 9 | Balance −₡15 from the prior heartbeat |
| 8 | 540s | Defrag | 9 | Balance −₡15 |
| 9 | 640s | Defrag | 9 | Balance −₡15 |
| 10 | 777s | Auditor Prime | 13 | Balance −₡15 (₡73,510 → ₡73,495) |
| 11 | 790s | Auditor Prime | 13 | Balance ₡73,495 → ₡63,340; fee text not captured |
| 12 | 919s | Tribunal Row, on the walk to the cathedral | 15 | Fee mixed with loot |
| 13–18 | 1015–1163s | Glass Cathedral / Pryce | 15–18 | Six deaths, then the clear |

Defrag’s three deaths are 7, 8, and 9. Pryce’s six are 13 through 18.

### Credits at the markers

| Moment | Credits |
|---|---|
| Stillwater, level 1 | ₡120 |
| Death 1, after the ₡11 fee | ₡214 |
| Kestrel’s sheet, level 5 | ₡814 (every hire listed ₡1.73K) |
| Brenda’s turn-in, level 7 | ₡2,274 |
| Fields door, level 7 | ₡3,051 |
| Defrag engaged, level 8–9 | ₡5,526 |
| Defrag down, back in town, level 10 | ₡2,158 |
| Auditor Prime down, level 14 | ₡72,972 |
| Cathedral entrance, level 15 | ₡80,066 |
| Pryce down, level 20 | ₡326,323 |

## 2. Chronological notes

### Prequel and Stillwater

- **Low.** The prequel walked. The choice was “I am not proud of you.” Gramps opened Neighbourhood Watch. The phone menu was measured in town: Hero, Items, Skills, Web, and Quests sat in the 844px frame (body 763/763, overflow false, tab bar from y 775 to 838). Story and Codex scrolled inside that frame (5867/763 and 7801/763).
- **Low.** Monday’s story card finished at 314 characters. The text block’s scroll height was 168px. Next was enabled when the shot was taken. The driver’s “well” number read the parent (295px), so the first replay’s 168px-well measurement was not repeated. The paragraph is on the card.

### Parcel Moors (HOA-9)

- **Low.** The entrance drop was Tuned Bent Rebar of Aim, magic, identified, item level 4, damage 9–16. That is the floor the balance pass aimed for. It needs level 3, and this character was still level 1, so it stayed on the ground. They wore Stop Sign of the Rat 8–15 into the keeper.
- **Low.** The return from town at 108s reached the quest-complete toast at 129s. Level 3 to 4, weapon 8–15, no death on that walk. One earlier death in the district (the ₡11 screen). Fair.
- **Low.** A shitcoiner (RugPull Inu) was refused with the bitcoin line. He jogged off (“Maxi! Dinosaur!”). Two later pamphlets (TrustMeBro, YieldBunny) got the same line and the same exit. No Bagholders fight.
- Champion warns in this district: radius 1.15 with a 1.6s tell, and a volatile circle at radius 1.35 with a 1.35s tell. One larger circle, radius 1.9 and a 1.0s tell, lined up with a superunique slam.

### Hollow Galleria (Marla)

- **Low.** The last walk in, from 278s, reached “return to Brenda” at 302s. Level 6 to 7, Vicious Stop Sign 15–26, no death on that walk.
- **Medium.** Four deaths on the earlier trips through the mall, levels 5 and 6. The mall is crossable. The enforcers are ordinary deaths.
- Equip best, before the Vicious Stop Sign was worn, showed Damage 12–18 → 24–39 and Armor 18 → 21, with Equip these / Leave them. Later pops showed armor-only upgrades (sash, gloves) with the damage row marked same.

### Brenda, Nonce, the Fields door

- **Low.** Brenda’s turn-in quoted Marla, gave the ring Null Loop, and set prices down 15% (`disc` true). The objective became The Last Librarian: go to the Humming Fields and destroy Defrag. `camp` stayed empty. Adoption stayed 20.
- **Low.** Nonce offered The Smear. The buttons were “I will answer it,” “Not now,” and “Talk about money.” The body names Unity and the feed. This pass left the offer. `camp` was still empty on the next zone line, and adoption was still 20. It later rose on its own (Pleb, “word spreads,” 22% then 23–24% in the cathedral). That is gain, and the Smear was never accepted.
- **Low.** Kestrel’s hire sheet opened at level 5 with ₡814. Bodyguard, Sysadmin, Node Runner, and Stray Hound were each ₡1.73K. Too expensive at that moment. The sheet was closed without a hire. The ₡11 and ₡15 death steps are a small slice of that hire price.
- **Low.** The Fields entrance was two gate enemies. The character died once in the district about 29s later (death 6), before Defrag was engaged, so that first pack’s clear time is not isolated. The next entry had one gate enemy left and cleared it in 5.3s. They lived, level 8, weapon 15–26.

### Defrag

- **Low.** Engaged at 416s. Level 8, then 9. Max life 2,266, damage 81.6, damage type Impact, mods arc and leech. Weapon Arcing Girder of the Tick 26–45, above the 16–28 band this check names. The sampled tell on him was radius 1.4 and 1.55s (the softened slam). A separate surge radius was not sampled.
- **Low.** Three deaths on him (7, 8, 9), all at level 9. He died at 660s, 244s after the first engage, counting the walks back from town. The killing segment after the third death was about 15s. Level 10, full enough to open the quest. The toast said to open Marrow’s cage; the quest then flipped to “return to Gramps” and the driver took a town portal. Gramps closed it (“Take it”).
- He is still a fight. Standing in him killed this character three times even on a 26–45 girder. Spacing finished him. He is no longer the end of the act.

During the fight the credit balance also fell in steps larger than the ₡15 fee (₡5,019 → ₡3,979 → ₡2,466) beside a “Portfolio liquidated” toast and a lapsed newsletter subscription. The liquidation toast grants sats. The driver did not log a purchase. The death-to-town steps themselves stayed at ₡15.

### Tribunal Row (Auditor Prime)

- **Low.** Entered at 749s, level 12, two gate enemies, weapon still 26–45, objective The Audit. The first life reached Auditor Prime (about 20s) and died on him at 77 life (death 10). The second life died on him as well (death 11). The third entry, at 795s, level 13, ended the quest at 825s with no death. Level 14. Sister Null took the turn-in (“I am”) and The Audit closed.
- Champion tell in the row: radius 1.15, 1.6s. A slam circle was radius 1.9, 1.0s. A volatile circle was radius 1.35, 1.35s.
- The door pack did not stop the district. The keeper did, twice, and then he fell.

### Glass Cathedral (Pryce) — and the signpost

- **High.** After Sister Null, the story objective read “Going Up · Go to The Updraft and destroy Foreman Ratchet.” Exit Interview was still state 0. `QUESTS` lists q6 (Going Up) before q5 (Exit Interview), and the tracker walks that object in order, so the first unfinished quest it sees is Act II. The cathedral shot still shows Going Up in the corner. Entering the cathedral did start Exit Interview (“New quest: Exit Interview”, q5 state 1). A player who follows the objective text leaves Act I without meeting Pryce. This run only reached him because the driver walks q1–q5 in numeric order.
- **Medium.** Six deaths in the cathedral (13–18), levels 15–18, often within 8–20s of touching Pryce. He spoke (“You must be my three o’clock,” “Let’s circle back to your termination”). The next life entered at 1173s, level 18, 755 life, 10 machines left in the zone, and Exit Interview completed at 1188s, level 20, deaths still 18. About 15 seconds on a thinned floor, weapon still 26–45. The zone is listed at level 12. Contact is a spike; the return trip, overleveled, is short.

## 3. Checklist

### UX #13

| Fix | Result | Evidence |
|---|---|---|
| Menu Items / Skills / Hero / Options / Quests fit one phone frame. Story / Codex may scroll inside it. | Pass | 390×844. Fit tabs: body 763/763, overflow false, tabs y 775–838. Story 5867/763 and Codex 7801/763 scroll inside the frame. |
| Toasts in a corner, ≤2 lines, off the objective, no identical stack. | Pass | The captured toast is two lines in the lower right. The objective stays readable. |
| Equip offer is a corner chip, not a mid-fight banner. | Pass | “▲ Stop Sign of the Rat / +32% · tap” sits above the right-hand buttons. |
| Story cards show the full paragraph. Next waits for typing. | Pass | Monday, 314 characters, text scroll height 168px, Next enabled once the line had typed. The parent well read 295px on this pass. |
| Equip best shows damage and armor before the swap. | Pass | Pop read Vicious Stop Sign, Damage 12–18 → 24–39, Armor 18 → 21, with Equip these / Leave them. Later pops kept both rows. |
| Shitcoiner decline leaves without a Bagholders fight. | Pass | Three refuses, each “Maxi! Dinosaur!” RugPull Inu, TrustMeBro, YieldBunny. No Bagholders fight. |

### Balance #14

| Fix | Result | Evidence |
|---|---|---|
| Moors entrance weapon about 9–16+. | Pass | Tuned Bent Rebar of Aim on the ground: magic, identified, item level 4, 9–16. Worn weapon into HOA-9 was Stop Sign of the Rat 8–15. |
| Fields / Tribunal first rooms are not sub-15s corpse runs on mid-Act-I gear. | Pass | Fields: one remaining gate enemy cleared in 5.3s, lived, level 8, weapon 15–26. Tribunal: two gate enemies, the first life reached Auditor Prime in about 20s and died on the keeper, not in the doorway. |
| Low-level explosions: longer tell, smaller blast. | Pass | Champion warns radius 1.15 / 1.6s in the Moors, Galleria, Fields, and Tribunal. Volatile circles 1.35 / 1.35s. Superunique slams stayed 1.9 / 1.0s. Defrag’s slam was 1.4 / 1.55s. |
| Early shitcoiner fight is not a champion plus two Bagholders. | Partial | The fight never started. The decline path is what this pass took. |
| Death fee is cheap enough that a Kestrel hire is reachable. | Partial | The one captured screen was ₡11. Deaths 7–10 moved the balance by ₡15, under the hire. Kestrel at level 5 wanted ₡1.73K and the character had ₡814, so the hire was out of reach at the moment the sheet opened. It was never opened again. By Auditor Prime the balance was ₡73K. |
| HOA-9 and Marla stay fair. | Pass | HOA-9’s return walk: ~21s, level 4, weapon 8–15, no death on that walk. Marla’s return walk: ~24s, level 7, weapon 15–26, no death on that walk. |

### Smear #15

| Fix | Result | Evidence |
|---|---|---|
| Brenda turn-in: ring/reward and the Fields next. No auto Smear. Adoption does not drain if the Smear was not accepted. | Pass | Objective became The Last Librarian / Humming Fields / Defrag. Ring Null Loop, `disc` set, `camp` empty, adoption 20. Adoption was still 20 through Defrag, then rose (22–24) with no campaign running. |
| Nonce offers The Smear with Not now / accept. | Pass | Buttons were “I will answer it,” “Not now,” and “Talk about money.” This pass left the offer. `camp` stayed empty. |

### Defrag #17

| Fix | Result | Evidence |
|---|---|---|
| Surge is a readable nova. Body swings are Impact. Clearable with spacing/Hurl around level 9 on a ~16–28 weapon. Still lethal if you stand still. | Partial | Body type was Impact. The sampled tell was the slam, radius 1.4 and 1.55s. A surge radius was not sampled. Three deaths at level 9, then a kill at 660s (244s from first engage, about 15s on the killing life). Level 8–10. The weapon was Arcing Girder of the Tick 26–45, above the 16–28 band, so that band was not re-tested. Standing in him still killed the character. |

### Past Defrag (new this pass)

| Place | Result | Evidence |
|---|---|---|
| Tribunal Row / Auditor Prime | Clear | Two deaths on the keeper (10 and 11), level 13, weapon 26–45. Third entry cleared the quest in ~30s, level 13–14. Sister Null closed The Audit. |
| Glass Cathedral / Pryce | Clear, with a signpost bug | Six deaths (13–18), levels 15–18, then a ~15s kill at level 18–20 on a thinned floor. Exit Interview completed. The HUD pointed at the Updraft the whole time. |

## 4. Remaining issues

Shipped menu, toast, chip, story card, Equip best, shitcoiner decline, Moors weapon, Fields and Tribunal doors, champion tells, Brenda’s turn-in, and the Nonce offer held on this pass and are not listed again.

### Content

1. **High. The story objective skips Pryce.** After The Audit is turned in, the tracker shows Going Up / The Updraft / Foreman Ratchet while Exit Interview is still state 0. `QUESTS` declares q6 before q5, and `storyStep` walks the object in that order. The cathedral is through the Tribunal stairs, and walking in does start Exit Interview, but the text in the corner tells the player to leave Act I. This run reached Pryce because the driver checks q1 through q5 by number.

### Balance

2. **Medium. Pryce deletes the first pulls.** Six deaths, several of them inside 8–20 seconds of reaching him, on a level 15–18 Scrapper with a 26–45 weapon. The clear was the next life, about 15 seconds, level 18 to 20, in a room that had already been thinned to 10 machines. Zone level is 12. The return-stronger loop is intact. The first contact is a spike.
3. **Low. Defrag is a fight again, on better gear than the check named.** Three deaths, then a kill, Impact body, slam tell 1.4 / 1.55s, weapon 26–45 rather than 16–28. Worth a pass on a character who is actually in the 16–28 band before calling the soften finished. It does not need to go back to being the wall.
4. **Low. Death 11’s balance fell by about ₡10,155** (₡73,495 → ₡63,340) with no fee line captured. After the tenth death the fee formula is 8% of credits, capped by 8% of the hire cost, which on the level-5 hire price (CPI implied by ₡1.73K) is a few hundred credits, not ten thousand. Loot and other sinks are mixed in on later deaths. One captured screen and the ₡15 steps through death 10 match the early cap.

### UX

None new in the phone frame. The signpost in item 1 is the new HUD bug.

## 5. Screenshots

| File | What it shows |
|---|---|
| `notes/replay2/replay2-menu-items.png` | Items on a 390×844 frame. Pack, paper doll, and the tab bar sit in one screen. |
| `notes/replay2/replay2-menu-story.png` | Story tab, scrolling inside the frame. |
| `notes/replay2/replay2-toast.png` | Two-line pickup toast in the lower right. The objective stays readable. |
| `notes/replay2/replay2-story-card.png` | Monday’s card, the paragraph on screen, Next present. |
| `notes/replay2/replay2-equip-chip.png` | Corner chip: Stop Sign of the Rat, +32%, tap. |
| `notes/replay2/replay2-equip-best.png` | Equip best preview with a damage row and an armor row, before confirm. |
| `notes/replay2/replay2-moors-weapon.png` | Tuned Bent Rebar of Aim on the ground in the Parcel Moors, 9–16. |
| `notes/replay2/replay2-death.png` | First death. The machines, Impact, re-onboarding fee ₡11. |
| `notes/replay2/replay2-kestrel.png` | Hire sheet. Four names at ₡1.73K, ₡814 in hand, Hire buttons disabled. |
| `notes/replay2/replay2-brenda-dialog.png` | Brenda, Marla’s line, Null Loop, prices down 15%. |
| `notes/replay2/replay2-brenda-fields.png` | After Brenda: objective is The Last Librarian / Humming Fields / Defrag. |
| `notes/replay2/replay2-nonce-offer.png` | Nonce offers The Smear. “Not now” and “I will answer it” are both on the card. |
| `notes/replay2/replay2-fields-door.png` | Fields doorway, one machine still up, the red tell on the floor. |
| `notes/replay2/replay2-defrag.png` | Defrag engaged. Red tell on the ground, level 9, the 26–45 girder. |
| `notes/replay2/replay2-defrag-down.png` | Defrag down. Level 10, “open Marrow’s cage,” quest complete, return to Gramps. |
| `notes/replay2/replay2-tribunal.png` | Tribunal Row entrance. Objective The Audit / Auditor Prime. |
| `notes/replay2/replay2-cathedral.png` | Glass Cathedral entrance. The corner objective still says Going Up / Foreman Ratchet. |
