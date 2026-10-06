# Acts III–V measurement

One sample. The bot rolled one set of rare items per district and fought once. Nothing in `src/` was changed.

Protocol: level matched to the district, identified rare weapon, armor, helm, gloves, boots and belt, no uniques, no hire. Scrapper on the Wrecking Crew build for every district below. Technomancer on Chain Reaction for the three bosses only. Adaptive difficulty left on (the default). The bot steps along open floor tiles toward the nearest machine, holds attack in range, stims below 45% life, and casts the first skill button when it is ready. Dialog buttons are polled until they enable. Scenes are skipped. Boss and lieutenant title cards are ended through the test hook. Sim time is `G.time`. A fight stops when the district is empty, the hero dies, the hero has not moved and has not had a kill for 8 sim seconds, or the cap is hit (40 sim seconds in a district, 75 on a boss, 90 seconds of wall clock). Stuck with life still high means the bot lost the path, not that the district killed it.

| District | Build | Result | Sim s | Life left | Stims | Enemies left/at start | Boss life |
|---|---|---|---:|---:|---:|---:|---:|
| The Vestibule (lvl 30) | scrapper crew | timeout | 40.2 | 100% | 0 | 35/62 | — |
| The Hall of Minutes (lvl 33) | scrapper crew | stuck | 27.2 | 80% | 4 | 53/69 | — |
| The Nine Chairs (lvl 36) | scrapper crew | timeout | 40 | 83% | 9 | 47/70 | — |
| Rack Nine (lvl 39) | scrapper crew | timeout | 40 | 51% | 1 | 45/76 | — |
| Still Water (lvl 42) | scrapper crew | died | 28.6 | 0% | 12 | 42/53 | 100% |
| The Agreeable Mile (lvl 45) | scrapper crew | timeout | 40.4 | 51% | 8 | 9/56 | — |
| The Sofa (lvl 48) | scrapper crew | timeout | 40.4 | 52% | 6 | 21/66 | — |
| Tomari (lvl 51) | scrapper crew | timeout | 40.1 | 100% | 2 | 26/57 | — |
| The List (lvl 54) | scrapper crew | timeout | 40 | 68% | 13 | 38/66 | — |
| The Kitchen Table (lvl 57) | scrapper crew | stuck | 27.7 | 100% | 8 | 22/46 | 67% |
| Block 137,209 (lvl 60) | scrapper crew | timeout | 40 | 83% | 2 | 28/74 | — |
| The Mempool (lvl 63) | scrapper crew | timeout | 40.1 | 80% | 2 | 39/70 | — |
| The Paper Vaults (lvl 66) | scrapper crew | died | 31.1 | 0% | 13 | 48/56 | — |
| Ninety-Three Blocks (lvl 69) | scrapper crew | died | 12.5 | 0% | 6 | 60/70 | — |
| The Room (lvl 72) | scrapper crew | timeout | 75.1 | 100% | 11 | 8/52 | 100% |
| Still Water (lvl 42) | hacker chain | stuck | 37.7 | 58% | 1 | 23/47 | 100% |
| The Kitchen Table (lvl 57) | hacker chain | stuck | 41.9 | 100% | 5 | 4/51 | 86% |
| The Room (lvl 72) | hacker chain | stuck | 25.4 | 50% | 12 | 47/57 | 100% |

## What this sample says

No combat number was changed. This is one roll of rare gear and one walk of each district.

The 40 second cap is shorter than these districts. A timeout with life left means the hero was still fighting when the clock stopped, not that the district was finished. Enemies left over enemies at the start is the pace.

- The level-matched scrapper was still healthy in most Act III and Act IV districts at the cap. The Agreeable Mile was the closest to a clear: 9 machines left, half life, out of stims almost (8 used) at 40 seconds.
- Three districts killed that scrapper. Still Water did it in the approach, with MANDATE still at full life. The Paper Vaults did it with 48 of 56 machines still up. Ninety-Three Blocks did it in 12.5 seconds, the fastest death in the sample, with 60 of 70 still up.
- The Kitchen Table is the only boss the scrapper damaged: the Curator was at 67% when the bot lost the path, and the hero was at full life. On the technomancer the Curator reached 86%.
- MANDATE and PROVIDENCE were never damaged. The scrapper died before reaching MANDATE. In The Room the scrapper spent the whole 75 seconds and got down to 8 machines with PROVIDENCE still full and the hero still full, so the bot cleared the approach and did not start the boss. The technomancer lost the path in both of those rooms with the boss still full.
