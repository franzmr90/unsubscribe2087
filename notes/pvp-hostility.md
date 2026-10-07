# PvP and hostility

Measured against the cards on the party sheet, the declare dialog, and the server rules in `server/lib/live.js`. `PVP_SCALE` stays 0.25. `PARTY_POOL` stays 1.35. Level 9, the minute cooldown, the 10s declaration hold, and the 5s doorway grace were left alone.

## What already matched

| Card | Code |
|---|---|
| Experience is one pool, a third again the kill, split by level. Somebody in town is not helping. | `PARTY_POOL` is 1.35. The split is by level, and only members in the same district are in it. |
| Declare in town. Both level 9. Once a minute. They leave your party. | `hostile()` refuses the other cases and calls `leaveParty` when the target is in yours. |
| Outside a town you can fight. Town is safe. | `canFight` requires the attacker's flag, the same game, the same district, and not a town. |
| A doorway buys five seconds. | A real zone change sets `safeUntil` to five seconds. Either side in grace blocks the hit. |
| The rig duel: declare first, or you swing at nothing. Nothing in there is kept. | Stand-ins exist only while you are hostile to them. A death in the Simulator does not charge the fee. |
| Mute silences voice and messages. | Chat returns early, and the voice gain stays at 0. |
| Eight people, half again the health, four and a half times. | `gameScale` is `1 + 0.5 * (n - 1)` on health and experience. Damage is the difficulty bite only. |

The attacker's floating number is the quarter, shown before armour. The life that comes off is the server's quarter after armour. That preview was already labeled as a preview.

## What the sheet printed

The roster blurb said a declaration cannot be taken back while you are both in this game. The same panel already had Stand down. Standing down deletes only your flag. Theirs remains, they can still hit you, and `mutualHostile` still refuses a new party. Leaving the game clears both.

The declare dialog already said this. The blurb now says it too, and the line you get after declaring no longer says the flag stands until somebody leaves.

## What the quarter was doing

`hurt` multiplied every incoming hit by `partyD`. That multiplier is companion pressure times the game's monster bite. On a Hell game with a rendered companion it is `1.05 × 2.4 = 2.52`, so a player hit that the card calls 25% landed at 63% before armour.

A player hit now skips `partyD`. Armour, resistances, and the rest of the sheet still apply. Machines still pay the tax. Checked by `node tools/pvp-clarity.js`: a Hell companion tax of 2.52 leaves a machine hit at 2.52 times a player hit of the same raw number.
