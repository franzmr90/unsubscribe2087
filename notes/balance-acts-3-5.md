# Acts III–V measurement

Pack fights. One sample each. Nothing in combat numbers was changed for this run.

Protocol: level matched to the district, the class build named below, identified rare weapon, armor, helm, gloves, boots and belt rolled at that level, no uniques, no hire. Adaptive scaling left on, then reset before each fight so an earlier death does not ease the next one. Trash districts spawn 5 ordinary machines of that district's first non-tick kind, on top of the hero. Boss districts spawn the act boss alone. The hero stims under half life (6 stims), casts the first skill button, and steps toward the pack. Sim time is `G.time`. Cap 16s on a pack and 25s on a boss. Damage taken is life lost plus 45% of max life per stim. Died is 1 if the hero fell. Unique pool is how many non-boss uniques `uniqEligible` allows at that machine level (the new bands).

Caps, measured on a naked Brutal hero, armor 0, resists 0, one impact hit of 200 that ignores the player-damage quarter. The Brutal resist cut is 50, so a 0 resist becomes −50 and the hit lands at 1.5× before physical reduction: pdr 0 removed 300, pdr 40 removed 180, pdr 80 removed 150 (the 50% cap). Unique pool sizes by monster level: 12→24, 27→18, 36→27, 42→9, 48→9, 57→9, 60→17, 70→8. Left counts living machines when the clock stops, including anything the pack summoned.

| District | Class | Difficulty | Seconds | Damage taken | Died | Left | Pack life | Kind | Unique pool |
|---|---|---|---:|---:|---:|---:|---:|---|---:|
| The Vestibule 30 | scrapper | Normal | 0.5 | 176 | 0 | 0/5 | 10749 | proxy | 18 |
| The Vestibule 30 | scrapper | Hard | 0.9 | 0 | 0 | 0/5 | 15479 | proxy | 18 |
| The Vestibule 30 | scrapper | Brutal | 0.9 | 473 | 0 | 0/5 | 22359 | proxy | 18 |
| The Hall of Minutes 33 | scrapper | Normal | 1.2 | 0 | 0 | 0/5 | 35515 | director | 18 |
| The Hall of Minutes 33 | scrapper | Hard | 2 | 0 | 0 | 0/5 | 51709 | director | 18 |
| The Hall of Minutes 33 | scrapper | Brutal | 2.8 | 589 | 0 | 0/5 | 75513 | director | 18 |
| The Nine Chairs 36 | scrapper | Normal | 1.2 | 0 | 0 | 0/5 | 48223 | director | 27 |
| The Nine Chairs 36 | scrapper | Hard | 2 | 0 | 0 | 0/5 | 70155 | director | 27 |
| The Nine Chairs 36 | scrapper | Brutal | 2.4 | 1902 | 0 | 0/5 | 102367 | director | 27 |
| Rack Nine 39 | scrapper | Normal | 0.5 | 196 | 0 | 0/5 | 19102 | proxy | 27 |
| Rack Nine 39 | scrapper | Hard | 0.5 | 0 | 0 | 0/5 | 27507 | proxy | 27 |
| Rack Nine 39 | scrapper | Brutal | 1 | 0 | 0 | 0/5 | 39732 | proxy | 27 |
| Still Water 42 | scrapper | Normal | 9.9 | 5143 | 1 | 2/1 | 529621 | boss3 | 9 |
| Still Water 42 | scrapper | Hard | 8.3 | 5143 | 1 | 1/1 | 762654 | boss3 | 9 |
| Still Water 42 | scrapper | Brutal | 0.9 | 1390 | 1 | 1/1 | 1101611 | boss3 | 9 |
| The Agreeable Mile 45 | scrapper | Normal | 0 | 0 | 0 | 0/5 | 54706 | wisher | 9 |
| The Agreeable Mile 45 | scrapper | Hard | 0.6 | 434 | 0 | 0/5 | 78777 | wisher | 9 |
| The Agreeable Mile 45 | scrapper | Brutal | 0.6 | 0 | 0 | 0/5 | 113788 | wisher | 9 |
| The Sofa 48 | scrapper | Normal | 0 | 0 | 0 | 0/5 | 20959 | lull | 9 |
| The Sofa 48 | scrapper | Hard | 0 | 0 | 0 | 0/5 | 30181 | lull | 9 |
| The Sofa 48 | scrapper | Brutal | 0.6 | 0 | 0 | 0/5 | 43595 | lull | 9 |
| Tomari 51 | scrapper | Normal | 2.7 | 0 | 0 | 0/5 | 149225 | ctkr | 9 |
| Tomari 51 | scrapper | Hard | 4.4 | 1083 | 0 | 0/5 | 216668 | ctkr | 9 |
| Tomari 51 | scrapper | Brutal | 5.9 | 6441 | 0 | 0/5 | 312965 | ctkr | 9 |
| The List 54 | scrapper | Normal | 0.4 | 310 | 0 | 0/5 | 52579 | wisher | 9 |
| The List 54 | scrapper | Hard | 0.5 | 0 | 0 | 0/5 | 75714 | wisher | 9 |
| The List 54 | scrapper | Brutal | 1 | 0 | 0 | 0/5 | 109365 | wisher | 9 |
| The Kitchen Table 57 | scrapper | Normal | 10.6 | 6704 | 1 | 3/1 | 1136273 | boss4 | 9 |
| The Kitchen Table 57 | scrapper | Hard | 1 | 1812 | 1 | 1/1 | 1636233 | boss4 | 9 |
| The Kitchen Table 57 | scrapper | Brutal | 0.9 | 1812 | 1 | 1/1 | 2363447 | boss4 | 9 |
| Block 137,209 60 | scrapper | Normal | 0.6 | 0 | 0 | 0/5 | 54615 | orphan | 17 |
| Block 137,209 60 | scrapper | Hard | 0.6 | 967 | 0 | 0/5 | 78646 | orphan | 17 |
| Block 137,209 60 | scrapper | Brutal | 0.4 | 1761 | 1 | 5/5 | 113599 | orphan | 17 |
| The Mempool 63 | scrapper | Normal | 0.5 | 0 | 0 | 0/5 | 82007 | sniper | 8 |
| The Mempool 63 | scrapper | Hard | 0.6 | 0 | 0 | 0/5 | 118089 | sniper | 8 |
| The Mempool 63 | scrapper | Brutal | 1 | 0 | 0 | 0/5 | 170574 | sniper | 8 |
| The Paper Vaults 66 | scrapper | Normal | 2 | 0 | 0 | 0/5 | 222489 | custod | 8 |
| The Paper Vaults 66 | scrapper | Hard | 4 | 5557 | 0 | 0/5 | 320384 | custod | 8 |
| The Paper Vaults 66 | scrapper | Brutal | 2.4 | 2058 | 1 | 5/5 | 466230 | custod | 8 |
| Ninety-Three Blocks 69 | scrapper | Normal | 0.7 | 0 | 0 | 0/5 | 134123 | valid | 8 |
| Ninety-Three Blocks 69 | scrapper | Hard | 0.7 | 0 | 0 | 0/5 | 193137 | valid | 8 |
| Ninety-Three Blocks 69 | scrapper | Brutal | 1.3 | 0 | 0 | 0/5 | 278976 | valid | 8 |
| The Room 72 | scrapper | Normal | 25 | 2341 | 0 | 1/1 | 2803751 | boss5 | 8 |
| The Room 72 | scrapper | Hard | 2.6 | 2601 | 1 | 1/1 | 4037401 | boss5 | 8 |
| The Room 72 | scrapper | Brutal | 3.4 | 2601 | 1 | 1/1 | 5831802 | boss5 | 8 |
| The Vestibule 30 | hacker | Normal | 0.7 | 0 | 0 | 0/5 | 9888 | proxy | 18 |
| The Vestibule 30 | hacker | Hard | 1.4 | 0 | 0 | 0/5 | 14239 | proxy | 18 |
| The Vestibule 30 | hacker | Brutal | 1.1 | 861 | 1 | 5/5 | 20567 | proxy | 18 |
| The Hall of Minutes 33 | hacker | Normal | 2.7 | 0 | 0 | 0/5 | 44373 | director | 18 |
| The Hall of Minutes 33 | hacker | Hard | 3.2 | 640 | 0 | 0/5 | 64574 | director | 18 |
| The Hall of Minutes 33 | hacker | Brutal | 4.1 | 1351 | 1 | 4/5 | 94255 | director | 18 |
| The Nine Chairs 36 | hacker | Normal | 2.3 | 333 | 0 | 0/5 | 31006 | director | 27 |
| The Nine Chairs 36 | hacker | Hard | 3.4 | 791 | 0 | 0/5 | 44648 | director | 27 |
| The Nine Chairs 36 | hacker | Brutal | 1.1 | 1275 | 1 | 6/5 | 65222 | director | 27 |
| Rack Nine 39 | hacker | Normal | 0.5 | 0 | 0 | 0/5 | 20167 | proxy | 27 |
| Rack Nine 39 | hacker | Hard | 0.5 | 0 | 0 | 0/5 | 29041 | proxy | 27 |
| Rack Nine 39 | hacker | Brutal | 1 | 0 | 0 | 0/5 | 41948 | proxy | 27 |
| Still Water 42 | hacker | Normal | 18.8 | 2494 | 1 | 1/1 | 632909 | boss3 | 9 |
| Still Water 42 | hacker | Hard | 8.7 | 2494 | 1 | 1/1 | 911388 | boss3 | 9 |
| Still Water 42 | hacker | Brutal | 1.1 | 674 | 1 | 1/1 | 1316450 | boss3 | 9 |
| The Agreeable Mile 45 | hacker | Normal | 2.2 | 0 | 0 | 0/5 | 49384 | wisher | 9 |
| The Agreeable Mile 45 | hacker | Hard | 2.6 | 0 | 0 | 0/5 | 71112 | wisher | 9 |
| The Agreeable Mile 45 | hacker | Brutal | 5.1 | 0 | 0 | 0/5 | 102718 | wisher | 9 |
| The Sofa 48 | hacker | Normal | 1.2 | 0 | 0 | 0/5 | 34733 | lull | 9 |
| The Sofa 48 | hacker | Hard | 2.4 | 362 | 0 | 0/5 | 50016 | lull | 9 |
| The Sofa 48 | hacker | Brutal | 3.6 | 733 | 0 | 0/5 | 72245 | lull | 9 |
| Tomari 51 | hacker | Normal | 2.4 | 0 | 0 | 0/5 | 135644 | ctkr | 9 |
| Tomari 51 | hacker | Hard | 3.3 | 508 | 0 | 0/5 | 196965 | ctkr | 9 |
| Tomari 51 | hacker | Brutal | 1.3 | 1129 | 1 | 5/5 | 284506 | ctkr | 9 |
| The List 54 | hacker | Normal | 2.3 | 0 | 0 | 0/5 | 78701 | wisher | 9 |
| The List 54 | hacker | Hard | 3.5 | 0 | 0 | 0/5 | 113330 | wisher | 9 |
| The List 54 | hacker | Brutal | 3.5 | 0 | 0 | 0/5 | 163698 | wisher | 9 |
| The Kitchen Table 57 | hacker | Normal | 25 | 1397 | 0 | 1/1 | 1290483 | boss4 | 9 |
| The Kitchen Table 57 | hacker | Hard | 2.8 | 1035 | 1 | 1/1 | 1858295 | boss4 | 9 |
| The Kitchen Table 57 | hacker | Brutal | 1.1 | 1035 | 1 | 1/1 | 2684204 | boss4 | 9 |
| Block 137,209 60 | hacker | Normal | 0.8 | 0 | 0 | 0/5 | 95948 | orphan | 17 |
| Block 137,209 60 | hacker | Hard | 1.2 | 0 | 0 | 0/5 | 138166 | orphan | 17 |
| Block 137,209 60 | hacker | Brutal | 0.8 | 897 | 1 | 5/5 | 199573 | orphan | 17 |
| The Mempool 63 | hacker | Normal | 1.5 | 0 | 0 | 0/5 | 116134 | sniper | 8 |
| The Mempool 63 | hacker | Hard | 2.7 | 341 | 0 | 0/5 | 167233 | sniper | 8 |
| The Mempool 63 | hacker | Brutal | 0.8 | 1118 | 1 | 5/5 | 241559 | sniper | 8 |
| The Paper Vaults 66 | hacker | Normal | 1.2 | 0 | 0 | 0/5 | 227822 | custod | 8 |
| The Paper Vaults 66 | hacker | Hard | 1.6 | 0 | 0 | 0/5 | 328063 | custod | 8 |
| The Paper Vaults 66 | hacker | Brutal | 2.6 | 1483 | 0 | 0/5 | 477397 | custod | 8 |
| Ninety-Three Blocks 69 | hacker | Normal | 2.3 | 449 | 0 | 0/5 | 158482 | valid | 8 |
| Ninety-Three Blocks 69 | hacker | Hard | 3.4 | 449 | 0 | 0/5 | 228213 | valid | 8 |
| Ninety-Three Blocks 69 | hacker | Brutal | 1 | 1447 | 1 | 5/5 | 329642 | valid | 8 |
| The Room 72 | hacker | Normal | 0.9 | 1876 | 1 | 1/1 | 1719518 | boss5 | 8 |
| The Room 72 | hacker | Hard | 0.5 | 1294 | 1 | 1/1 | 2476106 | boss5 | 8 |
| The Room 72 | hacker | Brutal | 0.7 | 1294 | 1 | 1/1 | 3576598 | boss5 | 8 |
| The Vestibule 30 | courier | Normal | 1.3 | 29 | 0 | 0/5 | 15461 | proxy | 18 |
| The Vestibule 30 | courier | Hard | 1.3 | 92 | 0 | 0/5 | 22265 | proxy | 18 |
| The Vestibule 30 | courier | Brutal | 2 | 540 | 0 | 0/5 | 32160 | proxy | 18 |
| The Hall of Minutes 33 | courier | Normal | 3.3 | 938 | 0 | 0/5 | 27582 | director | 18 |
| The Hall of Minutes 33 | courier | Hard | 4.1 | 665 | 0 | 0/5 | 39718 | director | 18 |
| The Hall of Minutes 33 | courier | Brutal | 1 | 1404 | 1 | 5/5 | 58729 | director | 18 |
| The Nine Chairs 36 | courier | Normal | 4 | 338 | 0 | 0/5 | 36530 | director | 27 |
| The Nine Chairs 36 | courier | Hard | 4.9 | 0 | 0 | 0/5 | 53175 | director | 27 |
| The Nine Chairs 36 | courier | Brutal | 4.3 | 2816 | 1 | 3/5 | 77637 | director | 27 |
| Rack Nine 39 | courier | Normal | 1.3 | 0 | 0 | 0/5 | 18471 | proxy | 27 |
| Rack Nine 39 | courier | Hard | 1.9 | 161 | 0 | 0/5 | 26598 | proxy | 27 |
| Rack Nine 39 | courier | Brutal | 1.9 | 360 | 0 | 0/5 | 38419 | proxy | 27 |
| Still Water 42 | courier | Normal | 24.5 | 1471 | 1 | 1/1 | 573276 | boss3 | 9 |
| Still Water 42 | courier | Hard | 0.9 | 774 | 1 | 1/1 | 825517 | boss3 | 9 |
| Still Water 42 | courier | Brutal | 0.9 | 774 | 1 | 1/1 | 1192413 | boss3 | 9 |
| The Agreeable Mile 45 | courier | Normal | 0.7 | 28 | 0 | 0/5 | 56968 | wisher | 9 |
| The Agreeable Mile 45 | courier | Hard | 1.4 | 132 | 0 | 0/5 | 82034 | wisher | 9 |
| The Agreeable Mile 45 | courier | Brutal | 2.1 | 0 | 0 | 0/5 | 118493 | wisher | 9 |
| The Sofa 48 | courier | Normal | 0.1 | 0 | 0 | 0/5 | 25365 | lull | 9 |
| The Sofa 48 | courier | Hard | 1 | 191 | 0 | 0/5 | 36526 | lull | 9 |
| The Sofa 48 | courier | Brutal | 2 | 0 | 0 | 0/5 | 52760 | lull | 9 |
| Tomari 51 | courier | Normal | 8.2 | 1798 | 0 | 0/5 | 119623 | ctkr | 9 |
| Tomari 51 | courier | Hard | 3.6 | 3696 | 1 | 4/5 | 173723 | ctkr | 9 |
| Tomari 51 | courier | Brutal | 0.5 | 1449 | 1 | 5/5 | 250934 | ctkr | 9 |
| The List 54 | courier | Normal | 1.5 | 304 | 0 | 0/5 | 62399 | wisher | 9 |
| The List 54 | courier | Hard | 2.2 | 511 | 0 | 0/5 | 89854 | wisher | 9 |
| The List 54 | courier | Brutal | 4.2 | 1375 | 0 | 0/5 | 129789 | wisher | 9 |
| The Kitchen Table 57 | courier | Normal | 22.5 | 4436 | 1 | 4/1 | 1221580 | boss4 | 9 |
| The Kitchen Table 57 | courier | Hard | 0.9 | 1199 | 1 | 1/1 | 1759076 | boss4 | 9 |
| The Kitchen Table 57 | courier | Brutal | 0.9 | 1739 | 1 | 1/1 | 2540887 | boss4 | 9 |
| Block 137,209 60 | courier | Normal | 0.9 | 0 | 0 | 0/5 | 60231 | orphan | 17 |
| Block 137,209 60 | courier | Hard | 0.9 | 0 | 0 | 0/5 | 86732 | orphan | 17 |
| Block 137,209 60 | courier | Brutal | 1.7 | 0 | 0 | 0/5 | 125280 | orphan | 17 |
| The Mempool 63 | courier | Normal | 1.5 | 0 | 0 | 0/5 | 105392 | sniper | 8 |
| The Mempool 63 | courier | Hard | 2.3 | 446 | 0 | 0/5 | 151764 | sniper | 8 |
| The Mempool 63 | courier | Brutal | 3 | 2259 | 0 | 0/5 | 219215 | sniper | 8 |
| The Paper Vaults 66 | courier | Normal | 5.2 | 4766 | 1 | 3/5 | 157604 | custod | 8 |
| The Paper Vaults 66 | courier | Hard | 2.2 | 2447 | 1 | 5/5 | 226949 | custod | 8 |
| The Paper Vaults 66 | courier | Brutal | 0.7 | 1288 | 1 | 5/5 | 327815 | custod | 8 |
| Ninety-Three Blocks 69 | courier | Normal | 1.8 | 0 | 0 | 0/5 | 99508 | valid | 8 |
| Ninety-Three Blocks 69 | courier | Hard | 1.8 | 724 | 0 | 0/5 | 143291 | valid | 8 |
| Ninety-Three Blocks 69 | courier | Brutal | 3.5 | 4371 | 0 | 0/5 | 206976 | valid | 8 |
| The Room 72 | courier | Normal | 0.9 | 1801 | 1 | 1/1 | 2581971 | boss5 | 8 |
| The Room 72 | courier | Hard | 0.9 | 1242 | 1 | 1/1 | 3718038 | boss5 | 8 |
| The Room 72 | courier | Brutal | 0.5 | 1242 | 1 | 1/1 | 5370499 | boss5 | 8 |
| The Vestibule 30 | anon | Normal | 2 | 0 | 0 | 0/5 | 16485 | proxy | 18 |
| The Vestibule 30 | anon | Hard | 3 | 0 | 0 | 0/5 | 23739 | proxy | 18 |
| The Vestibule 30 | anon | Brutal | 3 | 0 | 0 | 0/5 | 34676 | proxy | 18 |
| The Hall of Minutes 33 | anon | Normal | 9.1 | 1148 | 0 | 0/5 | 32148 | director | 18 |
| The Hall of Minutes 33 | anon | Hard | 4.9 | 1998 | 1 | 12/5 | 46818 | director | 18 |
| The Hall of Minutes 33 | anon | Brutal | 4.6 | 1615 | 1 | 5/5 | 67626 | director | 18 |
| The Nine Chairs 36 | anon | Normal | 9.6 | 339 | 0 | 0/5 | 37303 | director | 27 |
| The Nine Chairs 36 | anon | Hard | 4.9 | 2160 | 1 | 10/5 | 54298 | director | 27 |
| The Nine Chairs 36 | anon | Brutal | 4.9 | 3184 | 1 | 12/5 | 78430 | director | 27 |
| Rack Nine 39 | anon | Normal | 2.7 | 0 | 0 | 0/5 | 20065 | proxy | 27 |
| Rack Nine 39 | anon | Hard | 3 | 0 | 0 | 0/5 | 28893 | proxy | 27 |
| Rack Nine 39 | anon | Brutal | 3.2 | 0 | 0 | 0/5 | 41734 | proxy | 27 |
| Still Water 42 | anon | Normal | 25 | 2206 | 0 | 2/1 | 522770 | boss3 | 9 |
| Still Water 42 | anon | Hard | 0.9 | 783 | 1 | 1/1 | 752789 | boss3 | 9 |
| Still Water 42 | anon | Brutal | 0.9 | 783 | 1 | 1/1 | 1087361 | boss3 | 9 |
| The Agreeable Mile 45 | anon | Normal | 16 | 677 | 0 | 1/5 | 48695 | wisher | 9 |
| The Agreeable Mile 45 | anon | Hard | 10 | 4122 | 1 | 5/5 | 70121 | wisher | 9 |
| The Agreeable Mile 45 | anon | Brutal | 5.6 | 4122 | 1 | 5/5 | 101286 | wisher | 9 |
| The Sofa 48 | anon | Normal | 1.9 | 182 | 0 | 0/5 | 21724 | lull | 9 |
| The Sofa 48 | anon | Hard | 2.2 | 1528 | 0 | 0/5 | 31283 | lull | 9 |
| The Sofa 48 | anon | Brutal | 3 | 2901 | 0 | 0/5 | 45187 | lull | 9 |
| Tomari 51 | anon | Normal | 8.4 | 851 | 0 | 0/5 | 133712 | ctkr | 9 |
| Tomari 51 | anon | Hard | 4.6 | 2829 | 1 | 5/5 | 192545 | ctkr | 9 |
| Tomari 51 | anon | Brutal | 4.3 | 1204 | 1 | 5/5 | 278121 | ctkr | 9 |
| The List 54 | anon | Normal | 6.7 | 1116 | 0 | 0/5 | 74834 | wisher | 9 |
| The List 54 | anon | Hard | 8.8 | 2926 | 0 | 0/5 | 107761 | wisher | 9 |
| The List 54 | anon | Brutal | 6.3 | 5284 | 1 | 4/5 | 155654 | wisher | 9 |
| The Kitchen Table 57 | anon | Normal | 10.2 | 4780 | 1 | 3/1 | 975091 | boss4 | 9 |
| The Kitchen Table 57 | anon | Hard | 5.6 | 1292 | 1 | 1/1 | 1404131 | boss4 | 9 |
| The Kitchen Table 57 | anon | Brutal | 2 | 1292 | 1 | 1/1 | 2028190 | boss4 | 9 |
| Block 137,209 60 | anon | Normal | 2.8 | 0 | 0 | 0/5 | 62220 | orphan | 17 |
| Block 137,209 60 | anon | Hard | 3 | 0 | 0 | 0/5 | 89597 | orphan | 17 |
| Block 137,209 60 | anon | Brutal | 6 | 944 | 0 | 0/5 | 129418 | orphan | 17 |
| The Mempool 63 | anon | Normal | 3.5 | 0 | 0 | 0/5 | 90239 | sniper | 8 |
| The Mempool 63 | anon | Hard | 5.9 | 722 | 0 | 0/5 | 129944 | sniper | 8 |
| The Mempool 63 | anon | Brutal | 4.3 | 1604 | 1 | 5/5 | 187697 | sniper | 8 |
| The Paper Vaults 66 | anon | Normal | 14.3 | 2642 | 0 | 0/5 | 196819 | custod | 8 |
| The Paper Vaults 66 | anon | Hard | 5.5 | 2129 | 1 | 5/5 | 283420 | custod | 8 |
| The Paper Vaults 66 | anon | Brutal | 4.8 | 1468 | 1 | 5/5 | 409384 | custod | 8 |
| Ninety-Three Blocks 69 | anon | Normal | 3 | 0 | 0 | 0/5 | 109315 | valid | 8 |
| Ninety-Three Blocks 69 | anon | Hard | 3.5 | 0 | 0 | 0/5 | 157413 | valid | 8 |
| Ninety-Three Blocks 69 | anon | Brutal | 4.1 | 1584 | 1 | 3/5 | 227375 | valid | 8 |
| The Room 72 | anon | Normal | 4.6 | 3048 | 1 | 1/1 | 2417938 | boss5 | 8 |
| The Room 72 | anon | Hard | 0.9 | 1604 | 1 | 1/1 | 3481831 | boss5 | 8 |
| The Room 72 | anon | Brutal | 0.9 | 1604 | 1 | 1/1 | 5029311 | boss5 | 8 |
| The Vestibule 30 | founder | Normal | 3.1 | 1392 | 0 | 0/5 | 6806 | proxy | 18 |
| The Vestibule 30 | founder | Hard | 5.9 | 2973 | 0 | 0/5 | 9801 | proxy | 18 |
| The Vestibule 30 | founder | Brutal | 3.5 | 4074 | 1 | 2/5 | 14365 | proxy | 18 |
| The Hall of Minutes 33 | founder | Normal | 5.9 | 4359 | 1 | 8/5 | 15989 | director | 18 |
| The Hall of Minutes 33 | founder | Hard | 2 | 2238 | 1 | 5/5 | 23024 | director | 18 |
| The Hall of Minutes 33 | founder | Brutal | 0.8 | 2238 | 1 | 5/5 | 33257 | director | 18 |
| The Nine Chairs 36 | founder | Normal | 6.1 | 4147 | 0 | 0/5 | 29940 | director | 27 |
| The Nine Chairs 36 | founder | Hard | 2.4 | 4301 | 1 | 5/5 | 43606 | director | 27 |
| The Nine Chairs 36 | founder | Brutal | 0.6 | 2227 | 1 | 5/5 | 62986 | director | 27 |
| Rack Nine 39 | founder | Normal | 5.5 | 3435 | 0 | 0/5 | 18820 | proxy | 27 |
| Rack Nine 39 | founder | Hard | 3.2 | 4740 | 1 | 4/5 | 27101 | proxy | 27 |
| Rack Nine 39 | founder | Brutal | 1.8 | 4740 | 1 | 5/5 | 39146 | proxy | 27 |
| Still Water 42 | founder | Normal | 25 | 1401 | 0 | 1/1 | 250058 | boss3 | 9 |
| Still Water 42 | founder | Hard | 0.9 | 1557 | 1 | 1/1 | 360084 | boss3 | 9 |
| Still Water 42 | founder | Brutal | 0.9 | 1557 | 1 | 1/1 | 520122 | boss3 | 9 |
| The Agreeable Mile 45 | founder | Normal | 3.5 | 636 | 0 | 0/5 | 29941 | wisher | 9 |
| The Agreeable Mile 45 | founder | Hard | 3.7 | 660 | 0 | 0/5 | 43115 | wisher | 9 |
| The Agreeable Mile 45 | founder | Brutal | 2.9 | 4584 | 1 | 9/5 | 62278 | wisher | 9 |
| The Sofa 48 | founder | Normal | 4.1 | 889 | 0 | 0/5 | 9867 | lull | 9 |
| The Sofa 48 | founder | Hard | 4.6 | 1482 | 0 | 0/5 | 14208 | lull | 9 |
| The Sofa 48 | founder | Brutal | 6.2 | 2308 | 0 | 0/5 | 20523 | lull | 9 |
| Tomari 51 | founder | Normal | 8.1 | 5036 | 1 | 4/5 | 49603 | ctkr | 9 |
| Tomari 51 | founder | Hard | 2.4 | 5036 | 1 | 5/5 | 71428 | ctkr | 9 |
| Tomari 51 | founder | Brutal | 0.9 | 1973 | 1 | 5/5 | 103174 | ctkr | 9 |
| The List 54 | founder | Normal | 3.2 | 2437 | 0 | 0/5 | 21275 | wisher | 9 |
| The List 54 | founder | Hard | 3.7 | 3941 | 0 | 0/5 | 30636 | wisher | 9 |
| The List 54 | founder | Brutal | 5.2 | 4720 | 0 | 0/5 | 44253 | wisher | 9 |
| The Kitchen Table 57 | founder | Normal | 0.9 | 2090 | 1 | 1/1 | 388768 | boss4 | 9 |
| The Kitchen Table 57 | founder | Hard | 0.9 | 2090 | 1 | 1/1 | 559827 | boss4 | 9 |
| The Kitchen Table 57 | founder | Brutal | 0.6 | 2090 | 1 | 1/1 | 808638 | boss4 | 9 |
| Block 137,209 60 | founder | Normal | 3.5 | 2742 | 0 | 0/5 | 18295 | orphan | 17 |
| Block 137,209 60 | founder | Hard | 4.3 | 6733 | 0 | 0/5 | 26345 | orphan | 17 |
| Block 137,209 60 | founder | Brutal | 2.5 | 8373 | 1 | 5/5 | 38054 | orphan | 17 |
| The Mempool 63 | founder | Normal | 2.6 | 4008 | 0 | 0/5 | 26433 | sniper | 8 |
| The Mempool 63 | founder | Hard | 2.4 | 4309 | 0 | 0/5 | 38063 | sniper | 8 |
| The Mempool 63 | founder | Brutal | 0.6 | 2739 | 1 | 5/5 | 54980 | sniper | 8 |
| The Paper Vaults 66 | founder | Normal | 5.5 | 8747 | 1 | 4/5 | 59834 | custod | 8 |
| The Paper Vaults 66 | founder | Hard | 2.8 | 8747 | 1 | 5/5 | 87489 | custod | 8 |
| The Paper Vaults 66 | founder | Brutal | 1 | 3428 | 1 | 5/5 | 126372 | custod | 8 |
| Ninety-Three Blocks 69 | founder | Normal | 3 | 5303 | 0 | 0/5 | 58782 | valid | 8 |
| Ninety-Three Blocks 69 | founder | Hard | 3 | 7296 | 1 | 1/5 | 84647 | valid | 8 |
| Ninety-Three Blocks 69 | founder | Brutal | 0.9 | 2859 | 1 | 5/5 | 122267 | valid | 8 |
| The Room 72 | founder | Normal | 0.9 | 2735 | 1 | 1/1 | 798310 | boss5 | 8 |
| The Room 72 | founder | Hard | 0.9 | 2735 | 1 | 1/1 | 1149566 | boss5 | 8 |
| The Room 72 | founder | Brutal | 0.9 | 2735 | 1 | 1/1 | 1660484 | boss5 | 8 |
| The Vestibule 30 | homesteader | Normal | 5.3 | 203 | 0 | 0/5 | 9542 | proxy | 18 |
| The Vestibule 30 | homesteader | Hard | 7.7 | 0 | 0 | 0/5 | 13741 | proxy | 18 |
| The Vestibule 30 | homesteader | Brutal | 16 | 607 | 0 | 1/5 | 20107 | proxy | 18 |
| The Hall of Minutes 33 | homesteader | Normal | 4.9 | 2088 | 0 | 0/5 | 23630 | director | 18 |
| The Hall of Minutes 33 | homesteader | Hard | 6.5 | 3521 | 0 | 0/5 | 34447 | director | 18 |
| The Hall of Minutes 33 | homesteader | Brutal | 3.2 | 3678 | 1 | 5/5 | 50367 | director | 18 |
| The Nine Chairs 36 | homesteader | Normal | 3.9 | 0 | 0 | 0/5 | 29950 | director | 27 |
| The Nine Chairs 36 | homesteader | Hard | 5 | 2763 | 0 | 0/5 | 43621 | director | 27 |
| The Nine Chairs 36 | homesteader | Brutal | 5 | 5680 | 1 | 4/5 | 63722 | director | 27 |
| Rack Nine 39 | homesteader | Normal | 4.3 | 1753 | 0 | 0/5 | 10748 | proxy | 27 |
| Rack Nine 39 | homesteader | Hard | 5.6 | 2592 | 0 | 0/5 | 15477 | proxy | 27 |
| Rack Nine 39 | homesteader | Brutal | 6.1 | 6048 | 0 | 0/5 | 22356 | proxy | 27 |
| Still Water 42 | homesteader | Normal | 11.8 | 4517 | 1 | 1/1 | 204546 | boss3 | 9 |
| Still Water 42 | homesteader | Hard | 0.9 | 1922 | 1 | 1/1 | 294546 | boss3 | 9 |
| Still Water 42 | homesteader | Brutal | 0.9 | 1922 | 1 | 1/1 | 425455 | boss3 | 9 |
| The Agreeable Mile 45 | homesteader | Normal | 4.4 | 127 | 0 | 0/5 | 25653 | wisher | 9 |
| The Agreeable Mile 45 | homesteader | Hard | 6.5 | 608 | 0 | 0/5 | 36941 | wisher | 9 |
| The Agreeable Mile 45 | homesteader | Brutal | 9.3 | 1390 | 0 | 0/5 | 53359 | wisher | 9 |
| The Sofa 48 | homesteader | Normal | 4.5 | 903 | 0 | 0/5 | 11301 | lull | 9 |
| The Sofa 48 | homesteader | Hard | 5.2 | 2971 | 0 | 0/5 | 16273 | lull | 9 |
| The Sofa 48 | homesteader | Brutal | 6.6 | 2476 | 0 | 0/5 | 23506 | lull | 9 |
| Tomari 51 | homesteader | Normal | 6.4 | 2822 | 0 | 0/5 | 48159 | ctkr | 9 |
| Tomari 51 | homesteader | Hard | 8.7 | 6742 | 0 | 0/5 | 70050 | ctkr | 9 |
| Tomari 51 | homesteader | Brutal | 3.6 | 7733 | 1 | 5/5 | 101183 | ctkr | 9 |
| The List 54 | homesteader | Normal | 5.5 | 1349 | 0 | 0/5 | 21083 | wisher | 9 |
| The List 54 | homesteader | Hard | 6.5 | 4366 | 0 | 0/5 | 30359 | wisher | 9 |
| The List 54 | homesteader | Brutal | 5.6 | 6685 | 1 | 5/5 | 43852 | wisher | 9 |
| The Kitchen Table 57 | homesteader | Normal | 8.5 | 6104 | 1 | 1/1 | 350793 | boss4 | 9 |
| The Kitchen Table 57 | homesteader | Hard | 19.2 | 8066 | 1 | 1/1 | 505141 | boss4 | 9 |
| The Kitchen Table 57 | homesteader | Brutal | 0.9 | 2180 | 1 | 1/1 | 729648 | boss4 | 9 |
| Block 137,209 60 | homesteader | Normal | 3.4 | 1631 | 0 | 0/5 | 35311 | orphan | 17 |
| Block 137,209 60 | homesteader | Hard | 4 | 4069 | 0 | 0/5 | 50848 | orphan | 17 |
| Block 137,209 60 | homesteader | Brutal | 2.1 | 5008 | 1 | 5/5 | 73447 | orphan | 17 |
| The Mempool 63 | homesteader | Normal | 5.6 | 4419 | 0 | 0/5 | 27216 | sniper | 8 |
| The Mempool 63 | homesteader | Hard | 5.7 | 8080 | 1 | 4/5 | 39191 | sniper | 8 |
| The Mempool 63 | homesteader | Brutal | 1.7 | 3605 | 1 | 5/5 | 56610 | sniper | 8 |
| The Paper Vaults 66 | homesteader | Normal | 3.2 | 3508 | 1 | 5/5 | 117379 | custod | 8 |
| The Paper Vaults 66 | homesteader | Hard | 9.4 | 8950 | 1 | 4/5 | 169026 | custod | 8 |
| The Paper Vaults 66 | homesteader | Brutal | 2.2 | 4596 | 1 | 5/5 | 244149 | custod | 8 |
| Ninety-Three Blocks 69 | homesteader | Normal | 10.6 | 5845 | 0 | 0/5 | 57026 | valid | 8 |
| Ninety-Three Blocks 69 | homesteader | Hard | 10.6 | 10071 | 1 | 3/5 | 82117 | valid | 8 |
| Ninety-Three Blocks 69 | homesteader | Brutal | 6.1 | 10032 | 1 | 11/5 | 118613 | valid | 8 |
| The Room 72 | homesteader | Normal | 11.8 | 10282 | 1 | 3/1 | 952419 | boss5 | 8 |
| The Room 72 | homesteader | Hard | 0.9 | 2779 | 1 | 1/1 | 1371484 | boss5 | 8 |
| The Room 72 | homesteader | Brutal | 0.9 | 2779 | 1 | 1/1 | 1981032 | boss5 | 8 |
| The Vestibule 30 | witness | Normal | 8.4 | 3429 | 0 | 0/5 | 8961 | proxy | 18 |
| The Vestibule 30 | witness | Hard | 5 | 5221 | 1 | 5/5 | 12904 | proxy | 18 |
| The Vestibule 30 | witness | Brutal | 3.1 | 5221 | 1 | 5/5 | 18639 | proxy | 18 |
| The Hall of Minutes 33 | witness | Normal | 4.6 | 6420 | 1 | 7/5 | 15119 | director | 18 |
| The Hall of Minutes 33 | witness | Hard | 3.8 | 6420 | 1 | 5/5 | 21771 | director | 18 |
| The Hall of Minutes 33 | witness | Brutal | 1.9 | 6420 | 1 | 5/5 | 31447 | director | 18 |
| The Nine Chairs 36 | witness | Normal | 4.1 | 5284 | 1 | 12/5 | 16903 | director | 27 |
| The Nine Chairs 36 | witness | Hard | 2.5 | 5284 | 1 | 5/5 | 24340 | director | 27 |
| The Nine Chairs 36 | witness | Brutal | 1.3 | 4641 | 1 | 5/5 | 35157 | director | 27 |
| Rack Nine 39 | witness | Normal | 8 | 5943 | 0 | 0/5 | 11347 | proxy | 27 |
| Rack Nine 39 | witness | Hard | 5 | 7851 | 1 | 5/5 | 16339 | proxy | 27 |
| Rack Nine 39 | witness | Brutal | 3 | 7851 | 1 | 5/5 | 23601 | proxy | 27 |
| Still Water 42 | witness | Normal | 5.3 | 7126 | 1 | 1/1 | 321916 | boss3 | 9 |
| Still Water 42 | witness | Hard | 0.9 | 1926 | 1 | 1/1 | 463560 | boss3 | 9 |
| Still Water 42 | witness | Brutal | 0.1 | 1926 | 1 | 1/1 | 669586 | boss3 | 9 |
| The Agreeable Mile 45 | witness | Normal | 16 | 6811 | 0 | 2/5 | 30364 | wisher | 9 |
| The Agreeable Mile 45 | witness | Hard | 7.4 | 7333 | 1 | 3/5 | 43724 | wisher | 9 |
| The Agreeable Mile 45 | witness | Brutal | 4.8 | 7333 | 1 | 5/5 | 63157 | wisher | 9 |
| The Sofa 48 | witness | Normal | 16 | 5227 | 0 | 3/5 | 11727 | lull | 9 |
| The Sofa 48 | witness | Hard | 7.7 | 5657 | 1 | 5/5 | 16887 | lull | 9 |
| The Sofa 48 | witness | Brutal | 6 | 5657 | 1 | 5/5 | 24392 | lull | 9 |
| Tomari 51 | witness | Normal | 3.7 | 6804 | 1 | 5/5 | 51070 | ctkr | 9 |
| Tomari 51 | witness | Hard | 1.6 | 5149 | 1 | 5/5 | 73541 | ctkr | 9 |
| Tomari 51 | witness | Brutal | 1.1 | 2667 | 1 | 5/5 | 106225 | ctkr | 9 |
| The List 54 | witness | Normal | 7.1 | 8536 | 1 | 5/5 | 21083 | wisher | 9 |
| The List 54 | witness | Hard | 4.7 | 8536 | 1 | 5/5 | 30359 | wisher | 9 |
| The List 54 | witness | Brutal | 3.1 | 8536 | 1 | 5/5 | 43852 | wisher | 9 |
| The Kitchen Table 57 | witness | Normal | 6.2 | 6801 | 1 | 3/1 | 440382 | boss4 | 9 |
| The Kitchen Table 57 | witness | Hard | 1 | 2665 | 1 | 1/1 | 634150 | boss4 | 9 |
| The Kitchen Table 57 | witness | Brutal | 0.1 | 1838 | 1 | 1/1 | 915994 | boss4 | 9 |
| Block 137,209 60 | witness | Normal | 4.3 | 10253 | 1 | 5/5 | 20031 | orphan | 17 |
| Block 137,209 60 | witness | Hard | 2.4 | 10253 | 1 | 5/5 | 28845 | orphan | 17 |
| Block 137,209 60 | witness | Brutal | 0.7 | 6512 | 1 | 5/5 | 41665 | orphan | 17 |
| The Mempool 63 | witness | Normal | 3.6 | 7955 | 1 | 5/5 | 23571 | sniper | 8 |
| The Mempool 63 | witness | Hard | 2.1 | 7955 | 1 | 5/5 | 33942 | sniper | 8 |
| The Mempool 63 | witness | Brutal | 0.5 | 3118 | 1 | 5/5 | 49027 | sniper | 8 |
| The Paper Vaults 66 | witness | Normal | 0.9 | 1981 | 1 | 5/5 | 117479 | custod | 8 |
| The Paper Vaults 66 | witness | Hard | 1.7 | 7330 | 1 | 5/5 | 169170 | custod | 8 |
| The Paper Vaults 66 | witness | Brutal | 0.4 | 1981 | 1 | 5/5 | 244356 | custod | 8 |
| Ninety-Three Blocks 69 | witness | Normal | 2.3 | 7548 | 1 | 5/5 | 56890 | valid | 8 |
| Ninety-Three Blocks 69 | witness | Hard | 1.3 | 5712 | 1 | 5/5 | 81921 | valid | 8 |
| Ninety-Three Blocks 69 | witness | Brutal | 0.5 | 2958 | 1 | 5/5 | 118330 | valid | 8 |
| The Room 72 | witness | Normal | 2 | 3766 | 1 | 1/1 | 816399 | boss5 | 8 |
| The Room 72 | witness | Hard | 0.9 | 4934 | 1 | 1/1 | 1175614 | boss5 | 8 |
| The Room 72 | witness | Brutal | 1.1 | 2597 | 1 | 1/1 | 1698110 | boss5 | 8 |
| The Vestibule 30 | maxi | Normal | 3.2 | 1002 | 0 | 0/5 | 10063 | proxy | 18 |
| The Vestibule 30 | maxi | Hard | 4.5 | 2236 | 0 | 0/5 | 14490 | proxy | 18 |
| The Vestibule 30 | maxi | Brutal | 2.7 | 3064 | 1 | 5/5 | 21199 | proxy | 18 |
| The Hall of Minutes 33 | maxi | Normal | 4.9 | 3952 | 1 | 4/5 | 30474 | director | 18 |
| The Hall of Minutes 33 | maxi | Hard | 4 | 3952 | 1 | 5/5 | 43882 | director | 18 |
| The Hall of Minutes 33 | maxi | Brutal | 1.3 | 2510 | 1 | 5/5 | 63386 | director | 18 |
| The Nine Chairs 36 | maxi | Normal | 5.2 | 4877 | 1 | 5/5 | 48384 | director | 27 |
| The Nine Chairs 36 | maxi | Hard | 0.9 | 1318 | 1 | 5/5 | 69673 | director | 27 |
| The Nine Chairs 36 | maxi | Brutal | 0.8 | 1911 | 1 | 5/5 | 100638 | director | 27 |
| Rack Nine 39 | maxi | Normal | 13.2 | 4299 | 1 | 1/5 | 14907 | proxy | 27 |
| Rack Nine 39 | maxi | Hard | 7 | 3611 | 0 | 0/5 | 21466 | proxy | 27 |
| Rack Nine 39 | maxi | Brutal | 3 | 4348 | 1 | 5/5 | 31351 | proxy | 27 |
| Still Water 42 | maxi | Normal | 15.9 | 4307 | 1 | 1/1 | 446828 | boss3 | 9 |
| Still Water 42 | maxi | Hard | 7.2 | 4307 | 1 | 1/1 | 643432 | boss3 | 9 |
| Still Water 42 | maxi | Brutal | 0.9 | 1164 | 1 | 1/1 | 929402 | boss3 | 9 |
| The Agreeable Mile 45 | maxi | Normal | 13.3 | 5214 | 0 | 0/5 | 43393 | wisher | 9 |
| The Agreeable Mile 45 | maxi | Hard | 5.4 | 5580 | 1 | 4/5 | 62487 | wisher | 9 |
| The Agreeable Mile 45 | maxi | Brutal | 1.2 | 3544 | 1 | 5/5 | 90258 | wisher | 9 |
| The Sofa 48 | maxi | Normal | 10.2 | 2360 | 0 | 0/5 | 27027 | lull | 9 |
| The Sofa 48 | maxi | Hard | 13.3 | 3958 | 0 | 0/5 | 38918 | lull | 9 |
| The Sofa 48 | maxi | Brutal | 5.6 | 4877 | 1 | 4/5 | 56215 | lull | 9 |
| Tomari 51 | maxi | Normal | 3.4 | 6038 | 1 | 5/5 | 142978 | ctkr | 9 |
| Tomari 51 | maxi | Hard | 2.1 | 6038 | 1 | 5/5 | 205888 | ctkr | 9 |
| Tomari 51 | maxi | Brutal | 0.5 | 1645 | 1 | 5/5 | 299874 | ctkr | 9 |
| The List 54 | maxi | Normal | 13.6 | 5713 | 1 | 2/5 | 52855 | wisher | 9 |
| The List 54 | maxi | Hard | 0.8 | 1544 | 1 | 5/5 | 76111 | wisher | 9 |
| The List 54 | maxi | Brutal | 0.5 | 3628 | 1 | 5/5 | 109938 | wisher | 9 |
| The Kitchen Table 57 | maxi | Normal | 0.9 | 1245 | 1 | 1/1 | 1227895 | boss4 | 9 |
| The Kitchen Table 57 | maxi | Hard | 0.9 | 1805 | 1 | 1/1 | 1768168 | boss4 | 9 |
| The Kitchen Table 57 | maxi | Brutal | 2 | 1245 | 1 | 1/1 | 2554021 | boss4 | 9 |
| Block 137,209 60 | maxi | Normal | 3.8 | 2537 | 0 | 0/5 | 53441 | orphan | 17 |
| Block 137,209 60 | maxi | Hard | 3.2 | 6451 | 0 | 0/5 | 76955 | orphan | 17 |
| Block 137,209 60 | maxi | Brutal | 1.1 | 3409 | 1 | 5/5 | 111158 | orphan | 17 |
| The Mempool 63 | maxi | Normal | 4.4 | 2724 | 0 | 0/5 | 60414 | sniper | 8 |
| The Mempool 63 | maxi | Hard | 1.7 | 3579 | 1 | 5/5 | 86996 | sniper | 8 |
| The Mempool 63 | maxi | Brutal | 0.5 | 1523 | 1 | 5/5 | 125661 | sniper | 8 |
| The Paper Vaults 66 | maxi | Normal | 0.8 | 1684 | 1 | 5/5 | 148587 | custod | 8 |
| The Paper Vaults 66 | maxi | Hard | 0.8 | 2442 | 1 | 5/5 | 213966 | custod | 8 |
| The Paper Vaults 66 | maxi | Brutal | 0.4 | 1684 | 1 | 5/5 | 309062 | custod | 8 |
| Ninety-Three Blocks 69 | maxi | Normal | 4 | 4010 | 0 | 0/5 | 78977 | valid | 8 |
| Ninety-Three Blocks 69 | maxi | Hard | 1.6 | 4906 | 1 | 5/5 | 113727 | valid | 8 |
| Ninety-Three Blocks 69 | maxi | Brutal | 0.8 | 2540 | 1 | 5/5 | 164272 | valid | 8 |
| The Room 72 | maxi | Normal | 0.9 | 1853 | 1 | 1/1 | 1481215 | boss5 | 8 |
| The Room 72 | maxi | Hard | 0.8 | 1853 | 1 | 1/1 | 2132950 | boss5 | 8 |
| The Room 72 | maxi | Brutal | 0.9 | 1853 | 1 | 1/1 | 3080927 | boss5 | 8 |

## Concerns a reader should check

- Died to the Normal pack: scrapper in Still Water 42 (9.9s, 5143 taken); scrapper in The Kitchen Table 57 (10.6s, 6704 taken); hacker in Still Water 42 (18.8s, 2494 taken); hacker in The Room 72 (0.9s, 1876 taken); courier in Still Water 42 (24.5s, 1471 taken); courier in The Kitchen Table 57 (22.5s, 4436 taken); courier in The Paper Vaults 66 (5.2s, 4766 taken); courier in The Room 72 (0.9s, 1801 taken); anon in The Kitchen Table 57 (10.2s, 4780 taken); anon in The Room 72 (4.6s, 3048 taken); founder in The Hall of Minutes 33 (5.9s, 4359 taken); founder in Tomari 51 (8.1s, 5036 taken); founder in The Kitchen Table 57 (0.9s, 2090 taken); founder in The Paper Vaults 66 (5.5s, 8747 taken); founder in The Room 72 (0.9s, 2735 taken); homesteader in Still Water 42 (11.8s, 4517 taken); homesteader in The Kitchen Table 57 (8.5s, 6104 taken); homesteader in The Paper Vaults 66 (3.2s, 3508 taken); homesteader in The Room 72 (11.8s, 10282 taken); witness in The Hall of Minutes 33 (4.6s, 6420 taken); witness in The Nine Chairs 36 (4.1s, 5284 taken); witness in Still Water 42 (5.3s, 7126 taken); witness in Tomari 51 (3.7s, 6804 taken); witness in The List 54 (7.1s, 8536 taken); witness in The Kitchen Table 57 (6.2s, 6801 taken); witness in Block 137,209 60 (4.3s, 10253 taken); witness in The Mempool 63 (3.6s, 7955 taken); witness in The Paper Vaults 66 (0.9s, 1981 taken); witness in Ninety-Three Blocks 69 (2.3s, 7548 taken); witness in The Room 72 (2s, 3766 taken); maxi in The Hall of Minutes 33 (4.9s, 3952 taken); maxi in The Nine Chairs 36 (5.2s, 4877 taken); maxi in Rack Nine 39 (13.2s, 4299 taken); maxi in Still Water 42 (15.9s, 4307 taken); maxi in Tomari 51 (3.4s, 6038 taken); maxi in The List 54 (13.6s, 5713 taken); maxi in The Kitchen Table 57 (0.9s, 1245 taken); maxi in The Paper Vaults 66 (0.8s, 1684 taken); maxi in The Room 72 (0.9s, 1853 taken).
- Died to the Brutal pack: scrapper in Still Water 42; scrapper in The Kitchen Table 57; scrapper in Block 137,209 60; scrapper in The Paper Vaults 66; scrapper in The Room 72; hacker in The Vestibule 30; hacker in The Hall of Minutes 33; hacker in The Nine Chairs 36; hacker in Still Water 42; hacker in Tomari 51; hacker in The Kitchen Table 57; hacker in Block 137,209 60; hacker in The Mempool 63; hacker in Ninety-Three Blocks 69; hacker in The Room 72; courier in The Hall of Minutes 33; courier in The Nine Chairs 36; courier in Still Water 42; courier in Tomari 51; courier in The Kitchen Table 57; courier in The Paper Vaults 66; courier in The Room 72; anon in The Hall of Minutes 33; anon in The Nine Chairs 36; anon in Still Water 42; anon in The Agreeable Mile 45; anon in Tomari 51; anon in The List 54; anon in The Kitchen Table 57; anon in The Mempool 63; anon in The Paper Vaults 66; anon in Ninety-Three Blocks 69; anon in The Room 72; founder in The Vestibule 30; founder in The Hall of Minutes 33; founder in The Nine Chairs 36; founder in Rack Nine 39; founder in Still Water 42; founder in The Agreeable Mile 45; founder in Tomari 51; founder in The Kitchen Table 57; founder in Block 137,209 60; founder in The Mempool 63; founder in The Paper Vaults 66; founder in Ninety-Three Blocks 69; founder in The Room 72; homesteader in The Hall of Minutes 33; homesteader in The Nine Chairs 36; homesteader in Still Water 42; homesteader in Tomari 51; homesteader in The List 54; homesteader in The Kitchen Table 57; homesteader in Block 137,209 60; homesteader in The Mempool 63; homesteader in The Paper Vaults 66; homesteader in Ninety-Three Blocks 69; homesteader in The Room 72; witness in The Vestibule 30; witness in The Hall of Minutes 33; witness in The Nine Chairs 36; witness in Rack Nine 39; witness in Still Water 42; witness in The Agreeable Mile 45; witness in The Sofa 48; witness in Tomari 51; witness in The List 54; witness in The Kitchen Table 57; witness in Block 137,209 60; witness in The Mempool 63; witness in The Paper Vaults 66; witness in Ninety-Three Blocks 69; witness in The Room 72; maxi in The Vestibule 30; maxi in The Hall of Minutes 33; maxi in The Nine Chairs 36; maxi in Rack Nine 39; maxi in Still Water 42; maxi in The Agreeable Mile 45; maxi in The Sofa 48; maxi in Tomari 51; maxi in The List 54; maxi in The Kitchen Table 57; maxi in Block 137,209 60; maxi in The Mempool 63; maxi in The Paper Vaults 66; maxi in Ninety-Three Blocks 69; maxi in The Room 72.
- Slowest Normal trash clears still up at the cap: anon The Agreeable Mile 45 16s, 1 left; witness The Agreeable Mile 45 16s, 2 left; witness The Sofa 48 16s, 3 left; anon The Paper Vaults 66 14.3s, 0 left.
- Largest Brutal/Normal time ratio: courier The Sofa 48 0.1s → 2s (×20.0); homesteader The Vestibule 30 5.3s → 16s (×3.0); courier The Agreeable Mile 45 0.7s → 2.1s (×3.0); hacker The Sofa 48 1.2s → 3.6s (×3.0).
