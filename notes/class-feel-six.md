# Original six — class feel

Measured on a fresh Act I character in The Parcel Moors (monster level 1, Normal). A Tick there has 11.4 life. Weapon rolls were pinned to the middle of the range. Frame steps were 0.05s. The Tick was stunned so the clock is the player's, and god mode was off.

Homesteader and Witness were left where the earlier pass put them.

## What already killed the Tick

| Class | Sheet | Swings | Time |
|---|---|---|---|
| Scrapper | 6–12 × 1.25, 0.60s | 2 | 0.80s |
| Technomancer | 6–12 × 1.10, 0.62s | 1 | 0.05s |
| Runner | 6–12 × 0.82, 0.40s | 2 | 0.60s |
| Anon | 6–12 × 1.00, 0.42s | 2 | 0.60s |
| Founder | 6–12 × 0.70, 0.60s | 2 | 0.80s |
| The Maximalist | 6–12 × 1.20, 0.50s | 2 | 0.70s |

Life, weapon multiplier, and attack interval were left alone. Founder staying the softest basic attack is the class: the intern is the fight. A living companion still divides every local hit by 1.35 (100 becomes 74). That tax was left alone.

Lunch Pail already restores a hireling standing in it. Proof of Work already ticks the monster and not the ally. The owner's Toxic swing interval stays the ally-term-off path from the aura pass: the owner hits harder through `pdmg`, and does not take the hireling's attack-speed term.

## What moved

| Knob | Before | After | Why |
|---|---|---|---|
| Class sheets, Lunch Pail, party tax, owner's Toxic swing | as measured | unchanged | Each of the six deletes an Act I Tick. The pail already feeds the hireling. |
| Toxic damage on a hireling shot | speed only (`toxicSwing` 1.18 at rank 1), shot damage unchanged | shot also × `1.20+0.05×rank` | The card says anybody beside you hits harder. The companion's swing already did, because it goes through `hit()`. The hireling's shot is raw and skipped that line. |
| Running a Node on a rendered companion | hireling shots ×1.08 at rank 1, companion swings unchanged (`nodeM` 0) | companion swings × the same full ally bonus | The companion borrows the companion's class for the swing, so the Maximalist's node check never saw it. The hireling path was already correct and was not doubled. |
| Marked to Market | flat ×1.30 at rank 1 and at rank 10 | rank 1–2 stay ×1.30; rank 10 is ×1.60 | The card is +20+4×rank percent. Orange Pill, Signed For, and Dox already print +30% and share the mark timer, so a low rank does not get worse, and the two bonuses do not multiply. A hostile copy of the aura uses the same rule on you. |

Checked by `node tools/class-feel.js`.
