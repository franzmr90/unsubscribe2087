# Defrag, Act I

Tune for the wall in the Act I replay (`notes/PLAYTHROUGH-act1-replay.md`). Fresh Scrapper, level 9, Vicious Ceramic Shiv 16–28, dynamic difficulty on. Six of nine deaths were in the Fields. The quest was still “destroy Defrag.” Credits were not the blocker.

## What was actually killing him

Defrag is a mech superunique (`arc` + `leech`, quest `q3`). On a level-9 Scrapper with that shiv, Picket Line, 20 Might / 20 Vitality, and the replay’s skill points, a fresh Fields spawn measured about **2868 life and 128 damage** (normal difficulty, dynamic difficulty on, his life multiplier clamped at 1).

Three things stacked:

- **Every connected swing was Surge.** `foeType` treats `arc` as Surge on any hit that carries him as the source. The death line “Slain by Defrag … with Surge” is the melee, not the slam. Surge also drains 4 energy, which is why the run toasted “Not enough energy” and could not keep Hurl (the rust answer to a mech) up.
- **Leech was 15% of max life per connected hit.** About 430 life back on a 1.5s swing, on the order of 280 life a second if you trade. A Scrapper’s resisted swings do not keep up, so adaptive easing (×0.8 life and damage every two deaths in the zone) never stuck: he healed to the new maximum.
- **His superunique slam was the short one.** Champions in Act I already telegraph (radius 1.15, 1.6s, 0.7×). Superuniques were excluded from that, so Defrag slammed a radius-1.9 circle onto the player with a 1.0s tell and 1.6× damage. That slam is Heat and is named “an explosion.” It is a second punish on top of the Surge swing.

A facetank that held attack and stimmed under 42% life died four times in 25 seconds and left him near full. Standing in him is supposed to lose. The problem was that spacing did not have a readable window either.

## What changed

Only while `e.q === 'q3'` and Act II has not been entered (`defragAct1`). Marla, HOA-9, other leech uniques, champion tells, the Fields door, and the Act I boom on death are untouched. After the Cloud, Defrag keeps the old numbers.

| Knob | Before | Act I Defrag |
|---|---|---|
| Body hit | Surge (arc), full sheet damage | Impact, damage ×0.85. The swing is a warden’s hit again, and it does not drain energy. |
| Melee windup | 0.45s | 0.72s, so a step out of range is a real read. Other mechs stay at 0.45s. |
| Leech | 15% of max per hit | 5% of max. Still a siphon if you trade. Not a full heal. |
| Arc nova | 6 bolts, speed 5, 0.5× damage, every 1.3s, untyped | 4 bolts, speed 3.2, 0.38×, every 2.1s. These bolts carry a Surge tag and his name, so eating one can still read Defrag + Surge. Other arc enemies stay on the old nova. |
| Slam | radius 1.9, 1.0s, 1.6×, on the player | radius 1.4, 1.55s, 0.8×. Same family as the Act I champion tell, a little wider and a little harder. HOA-9 and Marla still use the old superunique slam. |

The three bots that spawn beside him are unchanged. So is the quest: he falls, the cage opens, Gramps is the turn-in.

## How it was checked

Focused encounter, not a full Act I replay. Level-9 Scrapper, weapon 16–28 with +12% damage, armor 22 and +40 life, helm 8, the build above, dynamic difficulty on, god mode off. Sheet was 471 life, 83 energy, 45 armor. The probe enters the Fields fresh, keeps Defrag and the three bots beside him, and drives `update` at 60fps with keyboard-equivalent movement.

He spawned at **2868 life and 108.7 damage**, typed Impact, windup observed at 0.72s. The first slam was radius 1.4, 1.55s, 0.8× his damage.

- **Spacing and Hurl.** He died in 50s. One death, at 21s, to an Impact swing, with about 1590 life left on him. No second death. Adaptive easing never fired. 57 Hurls, 11 dodges, 3 stims. The pack’s own experience pushed the hero to 11 by the kill; damage did not change with that, only life and energy.
- **Standing in him.** Attack held, stims under 42% life, no steps. Four deaths in 22s (Impact, Surge, Impact, Impact). After two eases he was still on 1818 of 1836. Trading blows does not win.

Marla, checked on a fresh Galleria enter, is still `fast` + `arc` with no forced damage type. `node tools/smoke.js`: 34/34 zones, no errors.
