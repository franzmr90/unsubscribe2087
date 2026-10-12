# Multiplayer playtest: four bots through Act I, then PvP and a duel

`tools/party-playtest.js` starts the real server in-process, opens four browsers,
registers four accounts, makes one game and partys everyone up. Then it plays.

| Bot | Class | Plays as |
|---|---|---|
| Ada | Scrapper | leads, takes the quests |
| Bea | Witness | follows, takes the quests |
| Cid | Hacker | follows, never talks to a quest giver |
| Dot | Courier | follows, never talks to a quest giver |

Per district q1 to q5, it checks:
- every browser draws the same map from the server's seed;
- one machine host;
- the same monster ids and kinds on every browser, with the server knowing every one;
- monsters wake on and chase a guest, not only the host;
- life bars agree through the fight;
- experience reaches everyone;
- quest credit reaches the two who never took the quest.

After the act:
- Ada declares on Dot in town, goes out to the field and kills Dot.
- Bea and Cid book the rig, declare and duel.

Run it with `PLAYWRIGHT` browsers available: `node tools/party-playtest.js`.
- `PARTY_PVP_ONLY=1` skips the act.
- `PARTY_ZONE_MS` sets the time per district.
- `PARTY_LVL` sets the starting level (default 13).
- `PARTY_LOG` sets the log path.

## Found and fixed

1. **Marrow's cage did not share q3.** Only the player who opened the cage got
   credit. The rest stayed on q3=1, so the Sister Null brief (q4) never opened for
   them. The cage now shares the quest like every other step (`src/p2.js`), and a
   shared q3 sets `G.marrow` (`src/p13.js`).

2. **A shared district came out differently per character.** Each browser draws
   the district from the server's seed. Several draws in `genZone` depended on the
   character, so the same monster id became a different monster, or a monster
   nobody else had:
   - the Moors blade rolls with the class;
   - a finished quest skips its named monster;
   - adaptive difficulty rescales spawns.

   Guests saw ghosts they could not kill. Fixes:
   - the blade rolls on the player's own random (`ownRng`, `src/p1.js`);
   - named monsters are always placed in a shared district;
   - adaptation leaves shared (`mid`) monsters alone (`src/p10.js`);
   - the memo shuffle is Fisher-Yates.

   Guests now replace a monster whose kind disagrees with the server, and drop
   locals that the host's full list does not have. `server/test/maps.js` now uses
   a third browser with a different class, quest state and adaptation.

3. **The host reported at most 60 monsters.** Act I districts have 67 to 79, so
   the server never knew the rest. Hits on them were refused until enough of the
   first 60 died. The cap is now 160 on both ends (`src/p13.js`,
   `server/lib/live.js`), and `server/test/mobs.js` covers 85.

4. **Monsters only ever chased the host.** The AI ran on the host against the
   host's own player. Monsters woke on the host's distance and walked to the host.
   Guests were hurt only by splash. Every ranged shot also struck every guest
   within range the instant it fired. Now:
   - the host aims each monster at the nearest living player (`mpMobTarget`);
   - melee and lunges strike that player (`mpMobStrike`);
   - shots fly at them and land on contact.

5. **Boss shots and slams hit only the host.** Pryce's ring and slam now land on
   anyone they reach (`mpProjHit`, `mpMobBlast`). The other bosses' own area
   attacks (boss2, boss3, the `BAI` table) still test only the host's player. See
   open item 1.

6. **A mouse could not pick a hostile player.** `pickAt` and `pickScreen` skipped
   stand-ins. Clicking another player walked to them instead of striking, so on a
   desk only shift-click could start a fight.

7. **A Witness could not hurt a player with left click.** The Witness's default
   left skill is Pull the Thread. It spends Testimony, and Testimony never builds
   on a person, so every click said "the page is blank". Against a player, left
   click now swings instead.

8. **A duel loss was never announced.** A fall in the rig leaves you on 1 life,
   not 0. The defender's client therefore never sent `died`, and the game never
   heard there was a duel. Further hits after the fall also reopened the fall
   dialog. Both are fixed in `mpTakeHit`.

## Seen and left open

1. **Bosses other than Pryce aim their specials at the host only.** Their movement
   now follows the nearest player, but their own area checks still test `P`.
   A guest standing in boss2's or boss3's ground effect is untouched.
2. **The rig's duel booking is cosmetic.**
   - The dialog offers "Go to the rig" at once, but you cannot fight until both
     of you declare. Declaring has to happen in town, and it takes you out of the
     party, which clears the booking (`MP.sim`).
   - Waves still spawn during a duel.
   - Any two hostile players can fight in zone 6 with or without a booking.
3. **Four players at level 13 die a lot in Act I.** Monsters have 2.5x life and
   hit as hard, so the bots died often. This was not measured against real people.
4. **The run before the boss fixes had Pryce standing after 150 s.** After them, all
   four finish q5 and Act II opens for everyone.
5. **Duels are slow.** Damage between players lands at 25%. After the act, a Witness took
   more than 150 s of steady swings to take a level-17 Hacker from 363 life to 3
   (274 hits, about 1.3 life each). Field PvP took 60 to 150 s. That may be what you
   want, but it reads as a stalemate.

