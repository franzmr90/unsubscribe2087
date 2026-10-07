# Homesteader / Witness feel

Measured on a fresh Act I character in The Parcel Moors (monster level 1, Normal). A Tick there has 11.4 life and hits for 11.8. Frame steps were 0.05s. God mode was off for the fights and on only where a script had to hold still.

## What was already the class

Homesteader, on foot, weapon 5–9: two shots, 0.8s, the Tick is dead. Hound: two swings, 1.1s, dead. Cold Frame’s whole 6s life deals about 11.7 and kills that Tick by itself (tick multiplier 0.26 at rank 1). A Stray over the same 6s deals about 13.5 and stays leashed when it is standing on the target. Exclusion, Shed recovery, Wear What You Killed refusing an elite, and form clearing on town and death were already asserted and still are.

Witness, Stub-range notebook not yet rolled (level 1 Box Cutter, 3–6): standing still for 6s with a Tick on screen fills Record to 77 and Testimony to 5. That is 8 × 1.6 per second, and one stack each 1.15s. Pull the Thread then hits for 20 and the Tick dies. The page left is 23, which is 70% of 77 spent. A live Tick that reaches you detonates; one connected swing lands first and the explosion takes about 18 of 80 life. The solo loop is watch, then one button. It is slow and it works. No clearing skill was added.

On the Record at rank 1 is +12%. A 5-damage hit becomes 5.6 and the float shows 6 against 5. Left alone.

## What moved, and what did not

| Knob | Before | After | Why |
|---|---|---|---|
| Homesteader coefficients (`HS`, life, weapon, plot, flock, forms) | draft row-3 | unchanged | Act I on foot, Hound, Cold Frame, and Stray each kill a Tick. |
| Witness coefficients (`WIT`, `WITMIN`, life, Pull the Thread, Publish) | draft | unchanged | Six seconds of standing plus one Thread deletes an Act I Tick. Basic melee stays dull. |
| On the Record `1+.12*L` | 12% per rank, 8s | unchanged | The float already steps up at hireling-sized hits. |
| Named Party `S.named` | `0.05*L` | **same coefficient** | At 5 damage, +5% is 5.25. Both floats render as 5, so a party member cannot see it. If the rounded float would not change, that hit is raised so the float goes up by one. A bonus that already changes the integer (bigger hits, higher ranks) is not touched. |
| Maximalist aura coefficients | — | unchanged | No bug in the way. |
| PvP `pvpScale` | 0.25 | unchanged | Testimony is not applied to player stand-ins (`e.mp` is skipped, and `dmgEnemy` returns into `mpHurt` before On the Record or Named Party). Party marks stay on machines. PvP damage stays the scale the other client already expects. |
| Companion Hull armour | separate from `HS.bigArm` | unchanged | The rendered Hull still toughens on a timer. Not the same formula as the player’s armour stat, and it was not what made co-op feel flat. |

## Party synergy

Checked against the hireling, the rendered companion, and the flock. Remote party members still resolve their own hits on their machine; nothing new was added to the netcode.

| Skill | Result |
|---|---|
| On the Record | Already multiplies every local `dmgEnemy` hit, including the hireling and the companion, for 8s. Confirmed the float steps. Not applied to PvP stand-ins, on purpose. |
| Named Party | Hireling and companion hits set `partyHit`, so the bonus applies, and the Witness’s own `hit()` still does not. The float now shows the rank-1 bonus on a 5-damage swing (6 vs 5). |
| Unnamed Source | Was willing to hang the swing on the nearest ally with no life pool, so a Plot under your feet ate it and the hireling never swung Sound. It now lends only to the hireling, the rendered companion, or a minion that actually swings (a Stray counts; a Plot, a hedge, and a lunch pail do not). The flock and other minions spend that one swing as Sound, then the next hit is their own type again. The Witness’s own swing stays Impact. |
| Hedgerow | Already stopped you and machines. It also stopped the hireling and the rendered companion, so your own line cut your party off from the fight. Those three (hireling, companion, escorted charge) walk through. A leashed Stray still paths straight, so it can come back to you across your hedge. A Stray that has gone foe paths like a machine and the hedge stops it. |
| Cold Frame | Still slows and rusts whatever stands in it, which is the ground helping anyone hitting that machine. No new aura. |

## UX

The Record bar was already the thin bar under the energy orb, hidden when you are not the Witness, including when the companion is. Refusal copy was already split: “The page is blank”, “Not enough energy”, and the chassis lines (“The hound has no hands for that”, “The hull does not dash”, “You are not wearing a chassis”). None of those strings changed.

Hound was already a long low body. Hull was a cab with a face in the glass. Worn used that same cab and only changed colour, so Wear What You Killed read as a repaint. Worn is now a lower, wider carcass with vents and no face. Hull keeps the cab.
