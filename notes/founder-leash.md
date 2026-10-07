# Founder staff recall

Measured on a fresh Founder in The Parcel Moors. A floor tile ten tiles from the player, and another three tiles out. One frame is 0.05s. God mode was on so the clock belongs to the summons.

## What the bodies did

| Body | Start | After one frame | After the fight |
|---|---|---|---|
| Hireling, no target | 10.00 | 0.00 | Snaps. The 8-tile recall from the ally pass. |
| Intern, no target | 10.00 | 9.75 | Walks home at 5 tiles a second. The snap waited for 14. |
| Intern already on a Tick | 10.00 | stays | After 1s still at 10, and the Tick has taken 4.1. |
| Intern idling three tiles out | 3.00 | walks | After 0.5s it is 0.50 away. The loose ring still works. |
| Botnet drone, no `per` | 10.00 | 9.75 | Timed minions were not the staff. |
| Intern standing with you | 0.80 | stays | Two seconds on a Tick deals 5.5. The summon is the damage. |

Contractors, the chief, and the officer share the intern's movement. A converted machine does not: Acqui-hire has a timer and no `per` flag, so it keeps the old 14.

## What moved

Permanent staff (`per`) now use the hireling rule. Past 8 tiles they are back on you, unless the swing they are on is already in range, in which case they may stay out to 13. An intern who has already reached a Tick ten tiles out keeps that fight. One who is only walking toward it, or standing in empty ground, comes home.

Damage, the follow speed, the 1.5-tile ring, and the wall-crossing step are unchanged. Timed minions still snap at 14.

Checked by `node tools/founder-leash.js`.
