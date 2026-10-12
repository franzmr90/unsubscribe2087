# Acts III–V measurement

Pack fights. One sample each. This run is after the client pass (difficulty gate, banked experience, Technomancer ward, simulator difficulty, clean unique bands).

Protocol: level matched to the district, the class build named below, identified rare weapon, armor, helm, gloves, boots and belt rolled at that level, no uniques, no hire. Adaptive scaling left on, then reset before each fight so an earlier death does not ease the next one. Trash districts spawn 5 ordinary machines of that district's first non-tick kind, on top of the hero. Boss districts spawn the act boss alone. The hero stims under half life (6 stims), casts the first skill button, and steps toward the pack. Sim time is `G.time`. Cap 16s on a pack and 25s on a boss. Damage taken is life lost plus 45% of max life per stim. Died is 1 if the hero fell. Unique pool is how many non-boss uniques `uniqEligible` allows at that machine level (the new bands).

Caps, measured on a naked Brutal hero, armor 0, resists 0, one impact hit of 200 that ignores the player-damage quarter. The Brutal resist cut is 50, so a 0 resist becomes −50 and the hit lands at 1.5× before physical reduction: pdr 0 removed 300, pdr 40 removed 180, pdr 80 removed 150 (the 50% cap). Unique pool sizes by monster level: 12→24, 27→18, 36→18, 42→21, 48→21, 57→21, 60→21, 70→20. Left counts living machines when the clock stops, including anything the pack summoned.

| District | Class | Difficulty | Seconds | Damage taken | Died | Left | Pack life | Kind | Unique pool |
|---|---|---|---:|---:|---:|---:|---:|---|---:|
| The Vestibule 30 | scrapper | Normal | 0 | 0 | 0 | 0/5 | 4274 | proxy | 18 |
| The Vestibule 30 | scrapper | Hard | 1.5 | 573 | 0 | 0/5 | 25383 | proxy | 21 |
| The Vestibule 30 | scrapper | Brutal | 2.2 | 0 | 0 | 0/5 | 37994 | proxy | 21 |
| The Hall of Minutes 33 | scrapper | Normal | 0.8 | 0 | 0 | 0/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | scrapper | Hard | 6.8 | 3303 | 0 | 0/5 | 65304 | director | 21 |
| The Hall of Minutes 33 | scrapper | Brutal | 2.6 | 2148 | 1 | 5/5 | 97255 | director | 21 |
| The Nine Chairs 36 | scrapper | Normal | 0.4 | 0 | 0 | 0/5 | 10547 | director | 18 |
| The Nine Chairs 36 | scrapper | Hard | 4 | 1203 | 0 | 0/5 | 120554 | director | 21 |
| The Nine Chairs 36 | scrapper | Brutal | 6.8 | 2551 | 0 | 0/5 | 177136 | director | 21 |
| Rack Nine 39 | scrapper | Normal | 16 | 139 | 0 | 2/5 | 5477 | proxy | 18 |
| Rack Nine 39 | scrapper | Hard | 6.3 | 4679 | 1 | 5/5 | 14723 | proxy | 21 |
| Rack Nine 39 | scrapper | Brutal | 2 | 2276 | 1 | 5/5 | 28449 | proxy | 20 |
| Still Water 42 | scrapper | Normal | 5.2 | 0 | 0 | 0/1 | 98944 | boss3 | 18 |
| Still Water 42 | scrapper | Hard | 25 | 360 | 0 | 1/1 | 809793 | boss3 | 21 |
| Still Water 42 | scrapper | Brutal | 25 | 4197 | 0 | 3/1 | 1194665 | boss3 | 20 |
| The Agreeable Mile 45 | scrapper | Normal | 16 | 0 | 0 | 2/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | scrapper | Hard | 10.6 | 5064 | 1 | 4/5 | 25296 | wisher | 21 |
| The Agreeable Mile 45 | scrapper | Brutal | 1.8 | 2466 | 1 | 5/5 | 48378 | wisher | 20 |
| The Sofa 48 | scrapper | Normal | 0 | 0 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | scrapper | Hard | 2.2 | 826 | 0 | 0/5 | 94734 | lull | 21 |
| The Sofa 48 | scrapper | Brutal | 3.2 | 2600 | 0 | 0/5 | 138049 | lull | 20 |
| Tomari 51 | scrapper | Normal | 1.3 | 0 | 0 | 0/5 | 19284 | ctkr | 18 |
| Tomari 51 | scrapper | Hard | 14 | 2800 | 0 | 0/5 | 242803 | ctkr | 21 |
| Tomari 51 | scrapper | Brutal | 2.3 | 4018 | 1 | 5/5 | 354941 | ctkr | 20 |
| The List 54 | scrapper | Normal | 6.4 | 0 | 0 | 0/5 | 11946 | wisher | 18 |
| The List 54 | scrapper | Hard | 16 | 2952 | 0 | 1/5 | 29263 | wisher | 21 |
| The List 54 | scrapper | Brutal | 4 | 5603 | 1 | 5/5 | 54938 | wisher | 20 |
| The Kitchen Table 57 | scrapper | Normal | 7.4 | 0 | 0 | 0/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | scrapper | Hard | 25 | 0 | 0 | 1/1 | 1475238 | boss4 | 21 |
| The Kitchen Table 57 | scrapper | Brutal | 25 | 856 | 0 | 2/1 | 2166207 | boss4 | 20 |
| Block 137,209 60 | scrapper | Normal | 0 | 0 | 0 | 0/5 | 10245 | orphan | 18 |
| Block 137,209 60 | scrapper | Hard | 3.8 | 850 | 0 | 0/5 | 92665 | orphan | 21 |
| Block 137,209 60 | scrapper | Brutal | 0.4 | 3148 | 1 | 5/5 | 135833 | orphan | 20 |
| The Mempool 63 | scrapper | Normal | 16 | 841 | 0 | 6/5 | 12069 | sniper | 18 |
| The Mempool 63 | scrapper | Hard | 3.2 | 6532 | 1 | 5/5 | 28185 | sniper | 21 |
| The Mempool 63 | scrapper | Brutal | 0.6 | 3283 | 1 | 5/5 | 52063 | sniper | 20 |
| The Paper Vaults 66 | scrapper | Normal | 0.9 | 0 | 0 | 0/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | scrapper | Hard | 2.2 | 3423 | 1 | 5/5 | 577742 | custod | 21 |
| The Paper Vaults 66 | scrapper | Brutal | 0.5 | 3418 | 1 | 5/5 | 130998 | custod | 20 |
| Ninety-Three Blocks 69 | scrapper | Normal | 9 | 126 | 0 | 0/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | scrapper | Hard | 16 | 7446 | 0 | 1/5 | 37550 | valid | 21 |
| Ninety-Three Blocks 69 | scrapper | Brutal | 8.5 | 7963 | 1 | 4/5 | 68611 | valid | 20 |
| The Room 72 | scrapper | Normal | 25 | 39 | 0 | 3/1 | 289037 | boss5 | 18 |
| The Room 72 | scrapper | Hard | 25 | 4717 | 0 | 3/1 | 648728 | boss5 | 21 |
| The Room 72 | scrapper | Brutal | 22.4 | 8165 | 1 | 3/1 | 1181310 | boss5 | 20 |
| The Vestibule 30 | hacker | Normal | 0 | 0 | 0 | 0/5 | 4274 | proxy | 18 |
| The Vestibule 30 | hacker | Hard | 0.7 | 0 | 0 | 0/5 | 23189 | proxy | 21 |
| The Vestibule 30 | hacker | Brutal | 0.7 | 874 | 1 | 5/5 | 34827 | proxy | 21 |
| The Hall of Minutes 33 | hacker | Normal | 16 | 1177 | 0 | 2/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | hacker | Hard | 4.4 | 1926 | 1 | 5/5 | 28103 | director | 21 |
| The Hall of Minutes 33 | hacker | Brutal | 1.2 | 954 | 1 | 5/5 | 55228 | director | 21 |
| The Nine Chairs 36 | hacker | Normal | 0 | 0 | 0 | 0/5 | 10547 | director | 18 |
| The Nine Chairs 36 | hacker | Hard | 1.6 | 0 | 0 | 0/5 | 106390 | director | 21 |
| The Nine Chairs 36 | hacker | Brutal | 3 | 917 | 0 | 0/5 | 156677 | director | 21 |
| Rack Nine 39 | hacker | Normal | 2.7 | 88 | 0 | 0/5 | 5477 | proxy | 18 |
| Rack Nine 39 | hacker | Hard | 4.9 | 2289 | 1 | 6/5 | 14723 | proxy | 21 |
| Rack Nine 39 | hacker | Brutal | 0.7 | 1110 | 1 | 5/5 | 28449 | proxy | 20 |
| Still Water 42 | hacker | Normal | 25 | 570 | 0 | 1/1 | 98944 | boss3 | 18 |
| Still Water 42 | hacker | Hard | 17 | 2430 | 1 | 2/1 | 261299 | boss3 | 21 |
| Still Water 42 | hacker | Brutal | 1.9 | 1186 | 1 | 1/1 | 502252 | boss3 | 20 |
| The Agreeable Mile 45 | hacker | Normal | 11.6 | 200 | 0 | 0/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | hacker | Hard | 14 | 2629 | 1 | 5/5 | 25296 | wisher | 21 |
| The Agreeable Mile 45 | hacker | Brutal | 0.7 | 1267 | 1 | 5/5 | 48378 | wisher | 20 |
| The Sofa 48 | hacker | Normal | 4.8 | 347 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | hacker | Hard | 6.8 | 2612 | 1 | 5/5 | 13468 | lull | 21 |
| The Sofa 48 | hacker | Brutal | 1.6 | 1341 | 1 | 5/5 | 25512 | lull | 20 |
| Tomari 51 | hacker | Normal | 0 | 0 | 0 | 0/5 | 19284 | ctkr | 18 |
| Tomari 51 | hacker | Hard | 4 | 2771 | 1 | 5/5 | 251068 | ctkr | 21 |
| Tomari 51 | hacker | Brutal | 0.6 | 1423 | 1 | 5/5 | 90278 | ctkr | 20 |
| The List 54 | hacker | Normal | 0 | 0 | 0 | 0/5 | 11946 | wisher | 18 |
| The List 54 | hacker | Hard | 3.1 | 0 | 0 | 0/5 | 196259 | wisher | 21 |
| The List 54 | hacker | Brutal | 4.4 | 745 | 0 | 0/5 | 286019 | wisher | 20 |
| The Kitchen Table 57 | hacker | Normal | 25 | 0 | 0 | 1/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | hacker | Hard | 25 | 2014 | 0 | 2/1 | 423034 | boss4 | 21 |
| The Kitchen Table 57 | hacker | Brutal | 8.5 | 1605 | 1 | 2/1 | 787587 | boss4 | 20 |
| Block 137,209 60 | hacker | Normal | 2.4 | 0 | 0 | 0/5 | 10245 | orphan | 18 |
| Block 137,209 60 | hacker | Hard | 2.8 | 1899 | 1 | 5/5 | 24193 | orphan | 21 |
| Block 137,209 60 | hacker | Brutal | 0.6 | 1653 | 1 | 5/5 | 44863 | orphan | 20 |
| The Mempool 63 | hacker | Normal | 10.8 | 3460 | 0 | 0/5 | 12069 | sniper | 18 |
| The Mempool 63 | hacker | Hard | 1 | 1774 | 1 | 5/5 | 28185 | sniper | 21 |
| The Mempool 63 | hacker | Brutal | 0.5 | 1735 | 1 | 5/5 | 52063 | sniper | 20 |
| The Paper Vaults 66 | hacker | Normal | 8.7 | 0 | 0 | 0/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | hacker | Hard | 4.5 | 3229 | 1 | 5/5 | 71183 | custod | 21 |
| The Paper Vaults 66 | hacker | Brutal | 0.7 | 1809 | 1 | 5/5 | 130998 | custod | 20 |
| Ninety-Three Blocks 69 | hacker | Normal | 3.8 | 0 | 0 | 0/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | hacker | Hard | 2.5 | 2256 | 1 | 5/5 | 37550 | valid | 21 |
| Ninety-Three Blocks 69 | hacker | Brutal | 0.7 | 1891 | 1 | 5/5 | 68611 | valid | 20 |
| The Room 72 | hacker | Normal | 25 | 0 | 0 | 1/1 | 289037 | boss5 | 18 |
| The Room 72 | hacker | Hard | 25 | 4417 | 0 | 2/1 | 648728 | boss5 | 21 |
| The Room 72 | hacker | Brutal | 9.8 | 2167 | 1 | 2/1 | 1181310 | boss5 | 20 |
| The Vestibule 30 | courier | Normal | 0.1 | 0 | 0 | 0/5 | 4274 | proxy | 18 |
| The Vestibule 30 | courier | Hard | 2.1 | 120 | 0 | 0/5 | 22570 | proxy | 21 |
| The Vestibule 30 | courier | Brutal | 2.9 | 776 | 0 | 0/5 | 33932 | proxy | 21 |
| The Hall of Minutes 33 | courier | Normal | 4.3 | 0 | 0 | 0/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | courier | Hard | 4.1 | 2358 | 1 | 11/5 | 28103 | director | 21 |
| The Hall of Minutes 33 | courier | Brutal | 0.7 | 1138 | 1 | 5/5 | 55228 | director | 21 |
| The Nine Chairs 36 | courier | Normal | 0 | 0 | 0 | 0/5 | 10547 | director | 18 |
| The Nine Chairs 36 | courier | Hard | 3.4 | 2139 | 0 | 0/5 | 116651 | director | 21 |
| The Nine Chairs 36 | courier | Brutal | 0.8 | 1497 | 1 | 5/5 | 171499 | director | 21 |
| Rack Nine 39 | courier | Normal | 6.6 | 389 | 0 | 0/5 | 5477 | proxy | 18 |
| Rack Nine 39 | courier | Hard | 3.2 | 2703 | 1 | 5/5 | 14723 | proxy | 21 |
| Rack Nine 39 | courier | Brutal | 0.4 | 1324 | 1 | 5/5 | 28449 | proxy | 20 |
| Still Water 42 | courier | Normal | 2.6 | 0 | 0 | 0/1 | 98944 | boss3 | 18 |
| Still Water 42 | courier | Hard | 25 | 397 | 0 | 2/1 | 747953 | boss3 | 21 |
| Still Water 42 | courier | Brutal | 20 | 2970 | 1 | 3/1 | 1105340 | boss3 | 20 |
| The Agreeable Mile 45 | courier | Normal | 11.9 | 711 | 0 | 0/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | courier | Hard | 6.7 | 2944 | 1 | 5/5 | 25296 | wisher | 21 |
| The Agreeable Mile 45 | courier | Brutal | 1.2 | 1866 | 1 | 5/5 | 48378 | wisher | 20 |
| The Sofa 48 | courier | Normal | 2.3 | 0 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | courier | Hard | 4.4 | 1688 | 0 | 0/5 | 13468 | lull | 21 |
| The Sofa 48 | courier | Brutal | 3.2 | 3401 | 1 | 5/5 | 25512 | lull | 20 |
| Tomari 51 | courier | Normal | 16 | 2233 | 0 | 5/5 | 19284 | ctkr | 18 |
| Tomari 51 | courier | Hard | 2.4 | 3567 | 1 | 5/5 | 47876 | ctkr | 21 |
| Tomari 51 | courier | Brutal | 0.8 | 1693 | 1 | 5/5 | 90278 | ctkr | 20 |
| The List 54 | courier | Normal | 0 | 0 | 0 | 0/5 | 11946 | wisher | 18 |
| The List 54 | courier | Hard | 2.6 | 0 | 0 | 0/5 | 232035 | wisher | 21 |
| The List 54 | courier | Brutal | 4.5 | 1832 | 0 | 0/5 | 337695 | wisher | 20 |
| The Kitchen Table 57 | courier | Normal | 1.4 | 0 | 0 | 0/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | courier | Hard | 25 | 3157 | 0 | 3/1 | 3603029 | boss4 | 21 |
| The Kitchen Table 57 | courier | Brutal | 7.4 | 3797 | 1 | 1/1 | 5239683 | boss4 | 20 |
| Block 137,209 60 | courier | Normal | 5.9 | 163 | 0 | 0/5 | 10245 | orphan | 18 |
| Block 137,209 60 | courier | Hard | 5.2 | 3961 | 1 | 5/5 | 24193 | orphan | 21 |
| Block 137,209 60 | courier | Brutal | 0.8 | 1967 | 1 | 5/5 | 44863 | orphan | 20 |
| The Mempool 63 | courier | Normal | 6.1 | 115 | 0 | 0/5 | 12069 | sniper | 18 |
| The Mempool 63 | courier | Hard | 1.9 | 4047 | 1 | 5/5 | 28185 | sniper | 21 |
| The Mempool 63 | courier | Brutal | 0.4 | 2062 | 1 | 5/5 | 52063 | sniper | 20 |
| The Paper Vaults 66 | courier | Normal | 16 | 87 | 0 | 4/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | courier | Hard | 1 | 2276 | 1 | 5/5 | 71183 | custod | 21 |
| The Paper Vaults 66 | courier | Brutal | 0.6 | 2151 | 1 | 5/5 | 130998 | custod | 20 |
| Ninety-Three Blocks 69 | courier | Normal | 3.7 | 0 | 0 | 0/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | courier | Hard | 3.6 | 4535 | 1 | 4/5 | 37550 | valid | 21 |
| Ninety-Three Blocks 69 | courier | Brutal | 0.7 | 2248 | 1 | 5/5 | 68611 | valid | 20 |
| The Room 72 | courier | Normal | 2.6 | 23 | 0 | 0/1 | 289037 | boss5 | 18 |
| The Room 72 | courier | Hard | ERR timeout | | | | | |
| The Room 72 | courier | Brutal | 1.1 | 2883 | 1 | 1/1 | 8228313 | boss5 | 20 |
| The Vestibule 30 | anon | Normal | 0.4 | 0 | 0 | 0/5 | 4274 | proxy | 18 |
| The Vestibule 30 | anon | Hard | 3 | 0 | 0 | 0/5 | 30005 | proxy | 21 |
| The Vestibule 30 | anon | Brutal | 3.2 | 0 | 0 | 0/5 | 44672 | proxy | 21 |
| The Hall of Minutes 33 | anon | Normal | 0.7 | 0 | 0 | 0/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | anon | Hard | 6 | 363 | 0 | 0/5 | 57685 | director | 21 |
| The Hall of Minutes 33 | anon | Brutal | 4.9 | 1212 | 1 | 11/5 | 86250 | director | 21 |
| The Nine Chairs 36 | anon | Normal | 2.2 | 0 | 0 | 0/5 | 10547 | director | 18 |
| The Nine Chairs 36 | anon | Hard | 7.8 | 2026 | 0 | 0/5 | 46555 | director | 21 |
| The Nine Chairs 36 | anon | Brutal | 4.5 | 1337 | 1 | 5/5 | 70249 | director | 21 |
| Rack Nine 39 | anon | Normal | 0.6 | 0 | 0 | 0/5 | 5477 | proxy | 18 |
| Rack Nine 39 | anon | Hard | 3 | 0 | 0 | 0/5 | 33961 | proxy | 21 |
| Rack Nine 39 | anon | Brutal | 3.8 | 0 | 0 | 0/5 | 50490 | proxy | 20 |
| Still Water 42 | anon | Normal | 25 | 6 | 0 | 2/1 | 98944 | boss3 | 18 |
| Still Water 42 | anon | Hard | 25 | 2229 | 0 | 2/1 | 261299 | boss3 | 21 |
| Still Water 42 | anon | Brutal | 24.3 | 3395 | 1 | 3/1 | 502252 | boss3 | 20 |
| The Agreeable Mile 45 | anon | Normal | 0.8 | 0 | 0 | 0/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | anon | Hard | 4.8 | 1454 | 0 | 0/5 | 49294 | wisher | 21 |
| The Agreeable Mile 45 | anon | Brutal | 3.2 | 3227 | 1 | 4/5 | 73570 | wisher | 20 |
| The Sofa 48 | anon | Normal | 0.5 | 0 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | anon | Hard | 2.2 | 526 | 0 | 0/5 | 33572 | lull | 21 |
| The Sofa 48 | anon | Brutal | 3 | 1608 | 0 | 0/5 | 49704 | lull | 20 |
| Tomari 51 | anon | Normal | 3 | 0 | 0 | 0/5 | 19284 | ctkr | 18 |
| Tomari 51 | anon | Hard | 6.3 | 1913 | 1 | 4/5 | 102924 | ctkr | 21 |
| Tomari 51 | anon | Brutal | 4.5 | 1723 | 1 | 6/5 | 90278 | ctkr | 20 |
| The List 54 | anon | Normal | 16 | 129 | 0 | 3/5 | 11946 | wisher | 18 |
| The List 54 | anon | Hard | 6.4 | 3853 | 1 | 5/5 | 29263 | wisher | 21 |
| The List 54 | anon | Brutal | 0.6 | 1816 | 1 | 5/5 | 54938 | wisher | 20 |
| The Kitchen Table 57 | anon | Normal | 25 | 303 | 0 | 3/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | anon | Hard | 17.9 | 4019 | 1 | 2/1 | 423034 | boss4 | 21 |
| The Kitchen Table 57 | anon | Brutal | 5.9 | 1910 | 1 | 1/1 | 787587 | boss4 | 20 |
| Block 137,209 60 | anon | Normal | 0.6 | 0 | 0 | 0/5 | 10245 | orphan | 18 |
| Block 137,209 60 | anon | Hard | 3 | 0 | 0 | 0/5 | 96019 | orphan | 21 |
| Block 137,209 60 | anon | Brutal | 4.3 | 2267 | 1 | 3/5 | 140677 | orphan | 20 |
| The Mempool 63 | anon | Normal | 0.8 | 0 | 0 | 0/5 | 12069 | sniper | 18 |
| The Mempool 63 | anon | Hard | 6.8 | 1245 | 0 | 0/5 | 178112 | sniper | 21 |
| The Mempool 63 | anon | Brutal | 4.2 | 2162 | 1 | 5/5 | 259543 | sniper | 20 |
| The Paper Vaults 66 | anon | Normal | 3 | 0 | 0 | 0/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | anon | Hard | 4.3 | 2221 | 1 | 5/5 | 221652 | custod | 21 |
| The Paper Vaults 66 | anon | Brutal | 4.3 | 2189 | 1 | 5/5 | 130998 | custod | 20 |
| Ninety-Three Blocks 69 | anon | Normal | 0.3 | 0 | 0 | 0/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | anon | Hard | 3.3 | 0 | 0 | 0/5 | 250463 | valid | 21 |
| Ninety-Three Blocks 69 | anon | Brutal | 3.3 | 0 | 0 | 0/5 | 364654 | valid | 20 |
| The Room 72 | anon | Normal | 25 | 143 | 0 | 3/1 | 289037 | boss5 | 18 |
| The Room 72 | anon | Hard | 20.6 | 5089 | 1 | 3/1 | 648728 | boss5 | 21 |
| The Room 72 | anon | Brutal | 4.4 | 2375 | 1 | 1/1 | 1181310 | boss5 | 20 |
| The Vestibule 30 | founder | Normal | 16 | 0 | 0 | 5/5 | 4274 | proxy | 18 |
| The Vestibule 30 | founder | Hard | 16 | 0 | 0 | 5/5 | 12489 | proxy | 21 |
| The Vestibule 30 | founder | Brutal | 6.1 | 3249 | 1 | 5/5 | 24693 | proxy | 21 |
| The Hall of Minutes 33 | founder | Normal | 16 | 0 | 0 | 5/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | founder | Hard | 8.6 | 3508 | 1 | 6/5 | 28103 | director | 21 |
| The Hall of Minutes 33 | founder | Brutal | 1.1 | 1801 | 1 | 5/5 | 55228 | director | 21 |
| The Nine Chairs 36 | founder | Normal | 16 | 41 | 0 | 6/5 | 10547 | director | 18 |
| The Nine Chairs 36 | founder | Hard | 11.1 | 3918 | 1 | 12/5 | 29477 | director | 21 |
| The Nine Chairs 36 | founder | Brutal | 0.9 | 1925 | 1 | 5/5 | 57590 | director | 21 |
| Rack Nine 39 | founder | Normal | 16 | 0 | 0 | 5/5 | 5477 | proxy | 18 |
| Rack Nine 39 | founder | Hard | 9 | 4003 | 1 | 5/5 | 14723 | proxy | 21 |
| Rack Nine 39 | founder | Brutal | 0.7 | 2050 | 1 | 5/5 | 28449 | proxy | 20 |
| Still Water 42 | founder | Normal | 25 | 96 | 0 | 3/1 | 98944 | boss3 | 18 |
| Still Water 42 | founder | Hard | 25 | 1079 | 0 | 3/1 | 261299 | boss3 | 21 |
| Still Water 42 | founder | Brutal | 25 | 1763 | 0 | 3/1 | 502252 | boss3 | 20 |
| The Agreeable Mile 45 | founder | Normal | 16 | 0 | 0 | 4/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | founder | Hard | 16 | 699 | 0 | 5/5 | 25296 | wisher | 21 |
| The Agreeable Mile 45 | founder | Brutal | 16 | 1531 | 0 | 5/5 | 48378 | wisher | 20 |
| The Sofa 48 | founder | Normal | 2.2 | 8 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | founder | Hard | 5.2 | 289 | 0 | 0/5 | 15194 | lull | 21 |
| The Sofa 48 | founder | Brutal | 8.3 | 0 | 0 | 0/5 | 25512 | lull | 20 |
| Tomari 51 | founder | Normal | 6.3 | 0 | 0 | 0/5 | 19284 | ctkr | 18 |
| Tomari 51 | founder | Hard | 16 | 0 | 0 | 3/5 | 106750 | ctkr | 21 |
| Tomari 51 | founder | Brutal | 16 | 0 | 0 | 4/5 | 158420 | ctkr | 20 |
| The List 54 | founder | Normal | 16 | 65 | 0 | 4/5 | 11946 | wisher | 18 |
| The List 54 | founder | Hard | 16 | 830 | 0 | 5/5 | 29263 | wisher | 21 |
| The List 54 | founder | Brutal | 16 | 802 | 0 | 5/5 | 54938 | wisher | 20 |
| The Kitchen Table 57 | founder | Normal | 25 | 55 | 0 | 3/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | founder | Hard | 25 | 598 | 0 | 3/1 | 423034 | boss4 | 21 |
| The Kitchen Table 57 | founder | Brutal | 25 | 3396 | 0 | 3/1 | 787587 | boss4 | 20 |
| Block 137,209 60 | founder | Normal | 16 | 0 | 0 | 3/5 | 10245 | orphan | 18 |
| Block 137,209 60 | founder | Hard | 14.9 | 6563 | 1 | 5/5 | 24193 | orphan | 21 |
| Block 137,209 60 | founder | Brutal | 1.2 | 3255 | 1 | 5/5 | 44863 | orphan | 20 |
| The Mempool 63 | founder | Normal | 1.7 | 0 | 0 | 0/5 | 12069 | sniper | 18 |
| The Mempool 63 | founder | Hard | 4.9 | 0 | 0 | 0/5 | 59930 | sniper | 21 |
| The Mempool 63 | founder | Brutal | 6.6 | 0 | 0 | 0/5 | 88836 | sniper | 20 |
| The Paper Vaults 66 | founder | Normal | 16 | 0 | 0 | 5/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | founder | Hard | 16 | 0 | 0 | 6/5 | 71183 | custod | 21 |
| The Paper Vaults 66 | founder | Brutal | 1.2 | 4016 | 1 | 5/5 | 130998 | custod | 20 |
| Ninety-Three Blocks 69 | founder | Normal | 1.1 | 0 | 0 | 0/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | founder | Hard | 4.4 | 0 | 0 | 0/5 | 112870 | valid | 21 |
| Ninety-Three Blocks 69 | founder | Brutal | 4.8 | 0 | 0 | 0/5 | 165908 | valid | 20 |
| The Room 72 | founder | Normal | 25 | 81 | 0 | 2/1 | 289037 | boss5 | 18 |
| The Room 72 | founder | Hard | 25 | 2153 | 0 | 3/1 | 648728 | boss5 | 21 |
| The Room 72 | founder | Brutal | 25 | 4577 | 0 | 2/1 | 1181310 | boss5 | 20 |
| The Vestibule 30 | homesteader | Normal | 12 | 599 | 0 | 0/5 | 4274 | proxy | 18 |
| The Vestibule 30 | homesteader | Hard | 6.5 | 4711 | 1 | 5/5 | 12489 | proxy | 21 |
| The Vestibule 30 | homesteader | Brutal | 3 | 4459 | 1 | 5/5 | 24693 | proxy | 21 |
| The Hall of Minutes 33 | homesteader | Normal | 16 | 274 | 0 | 5/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | homesteader | Hard | 10.4 | 5088 | 1 | 7/5 | 28103 | director | 21 |
| The Hall of Minutes 33 | homesteader | Brutal | 2.1 | 2447 | 1 | 5/5 | 55228 | director | 21 |
| The Nine Chairs 36 | homesteader | Normal | 2.4 | 10 | 0 | 0/5 | 10547 | director | 18 |
| The Nine Chairs 36 | homesteader | Hard | 6.4 | 3197 | 0 | 0/5 | 49011 | director | 21 |
| The Nine Chairs 36 | homesteader | Brutal | 5.4 | 5513 | 1 | 5/5 | 73796 | director | 21 |
| Rack Nine 39 | homesteader | Normal | 16 | 1070 | 0 | 5/5 | 5477 | proxy | 18 |
| Rack Nine 39 | homesteader | Hard | 5 | 5472 | 1 | 5/5 | 14723 | proxy | 21 |
| Rack Nine 39 | homesteader | Brutal | 3 | 5472 | 1 | 5/5 | 28449 | proxy | 20 |
| Still Water 42 | homesteader | Normal | 25 | 378 | 0 | 3/1 | 98944 | boss3 | 18 |
| Still Water 42 | homesteader | Hard | 19.4 | 6173 | 1 | 3/1 | 261299 | boss3 | 21 |
| Still Water 42 | homesteader | Brutal | 12.3 | 5813 | 1 | 2/1 | 502252 | boss3 | 20 |
| The Agreeable Mile 45 | homesteader | Normal | 2.7 | 0 | 0 | 0/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | homesteader | Hard | 9.1 | 2124 | 0 | 0/5 | 54274 | wisher | 21 |
| The Agreeable Mile 45 | homesteader | Brutal | 13.4 | 8091 | 0 | 0/5 | 80763 | wisher | 20 |
| The Sofa 48 | homesteader | Normal | 2.4 | 23 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | homesteader | Hard | 5.9 | 2584 | 0 | 0/5 | 15544 | lull | 21 |
| The Sofa 48 | homesteader | Brutal | 1.7 | 3741 | 1 | 5/5 | 25512 | lull | 20 |
| Tomari 51 | homesteader | Normal | 16 | 369 | 0 | 5/5 | 19284 | ctkr | 18 |
| Tomari 51 | homesteader | Hard | 7.7 | 6902 | 1 | 6/5 | 47876 | ctkr | 21 |
| Tomari 51 | homesteader | Brutal | 1.9 | 3506 | 1 | 5/5 | 90278 | ctkr | 20 |
| The List 54 | homesteader | Normal | 16 | 170 | 0 | 5/5 | 11946 | wisher | 18 |
| The List 54 | homesteader | Hard | 15.1 | 7406 | 1 | 5/5 | 29263 | wisher | 21 |
| The List 54 | homesteader | Brutal | 4 | 7167 | 1 | 5/5 | 54938 | wisher | 20 |
| The Kitchen Table 57 | homesteader | Normal | 25 | 345 | 0 | 3/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | homesteader | Hard | 16.6 | 7691 | 1 | 2/1 | 423034 | boss4 | 21 |
| The Kitchen Table 57 | homesteader | Brutal | 3.9 | 3838 | 1 | 1/1 | 787587 | boss4 | 20 |
| Block 137,209 60 | homesteader | Normal | 16 | 2331 | 0 | 5/5 | 10245 | orphan | 18 |
| Block 137,209 60 | homesteader | Hard | 3.8 | 8230 | 1 | 5/5 | 24193 | orphan | 21 |
| Block 137,209 60 | homesteader | Brutal | 1.9 | 4024 | 1 | 5/5 | 44863 | orphan | 20 |
| The Mempool 63 | homesteader | Normal | 1.5 | 0 | 0 | 0/5 | 12069 | sniper | 18 |
| The Mempool 63 | homesteader | Hard | 6.3 | 8226 | 1 | 3/5 | 111841 | sniper | 21 |
| The Mempool 63 | homesteader | Brutal | 1.8 | 4201 | 1 | 5/5 | 52063 | sniper | 20 |
| The Paper Vaults 66 | homesteader | Normal | 8.2 | 0 | 0 | 0/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | homesteader | Hard | 6.7 | 8691 | 1 | 5/5 | 88615 | custod | 21 |
| The Paper Vaults 66 | homesteader | Brutal | 2 | 4376 | 1 | 5/5 | 130998 | custod | 20 |
| Ninety-Three Blocks 69 | homesteader | Normal | 16 | 848 | 0 | 5/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | homesteader | Hard | 5.8 | 9075 | 1 | 5/5 | 37550 | valid | 21 |
| Ninety-Three Blocks 69 | homesteader | Brutal | 2 | 4533 | 1 | 5/5 | 68611 | valid | 20 |
| The Room 72 | homesteader | Normal | 25 | 72 | 0 | 3/1 | 289037 | boss5 | 18 |
| The Room 72 | homesteader | Hard | 25 | 9787 | 0 | 3/1 | 648728 | boss5 | 21 |
| The Room 72 | homesteader | Brutal | 8.4 | 6111 | 1 | 2/1 | 1181310 | boss5 | 20 |
| The Vestibule 30 | witness | Normal | 14 | 247 | 0 | 0/5 | 4274 | proxy | 18 |
| The Vestibule 30 | witness | Hard | 9.4 | 4763 | 1 | 5/5 | 12489 | proxy | 21 |
| The Vestibule 30 | witness | Brutal | 1.1 | 2248 | 1 | 5/5 | 24693 | proxy | 21 |
| The Hall of Minutes 33 | witness | Normal | 16 | 1580 | 0 | 2/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | witness | Hard | 4.3 | 4565 | 1 | 10/5 | 28103 | director | 21 |
| The Hall of Minutes 33 | witness | Brutal | 1.1 | 2883 | 1 | 5/5 | 55228 | director | 21 |
| The Nine Chairs 36 | witness | Normal | 16 | 267 | 0 | 2/5 | 10547 | director | 18 |
| The Nine Chairs 36 | witness | Hard | 4.1 | 3938 | 1 | 12/5 | 29477 | director | 21 |
| The Nine Chairs 36 | witness | Brutal | 1.2 | 3201 | 1 | 5/5 | 57590 | director | 21 |
| Rack Nine 39 | witness | Normal | 16 | 457 | 0 | 2/5 | 5477 | proxy | 18 |
| Rack Nine 39 | witness | Hard | 7 | 5636 | 1 | 4/5 | 14723 | proxy | 21 |
| Rack Nine 39 | witness | Brutal | 2 | 5199 | 1 | 5/5 | 28449 | proxy | 20 |
| Still Water 42 | witness | Normal | 25 | 154 | 0 | 2/1 | 98944 | boss3 | 18 |
| Still Water 42 | witness | Hard | 23.7 | 6176 | 1 | 3/1 | 261299 | boss3 | 21 |
| Still Water 42 | witness | Brutal | 7.8 | 4329 | 1 | 1/1 | 502252 | boss3 | 20 |
| The Agreeable Mile 45 | witness | Normal | 16 | 214 | 0 | 2/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | witness | Hard | 9.7 | 6341 | 1 | 6/5 | 25296 | wisher | 21 |
| The Agreeable Mile 45 | witness | Brutal | 3.2 | 6031 | 1 | 5/5 | 48378 | wisher | 20 |
| The Sofa 48 | witness | Normal | 2.4 | 29 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | witness | Hard | 16 | 6121 | 0 | 1/5 | 31950 | lull | 21 |
| The Sofa 48 | witness | Brutal | 7.9 | 6645 | 1 | 4/5 | 47362 | lull | 20 |
| Tomari 51 | witness | Normal | 16 | 186 | 0 | 4/5 | 19284 | ctkr | 18 |
| Tomari 51 | witness | Hard | 10.2 | 6943 | 1 | 5/5 | 47876 | ctkr | 21 |
| Tomari 51 | witness | Brutal | 1.1 | 3447 | 1 | 5/5 | 90278 | ctkr | 20 |
| The List 54 | witness | Normal | 16 | 312 | 0 | 2/5 | 11946 | wisher | 18 |
| The List 54 | witness | Hard | 9.5 | 7312 | 1 | 5/5 | 29263 | wisher | 21 |
| The List 54 | witness | Brutal | 2.7 | 7063 | 1 | 5/5 | 54938 | wisher | 20 |
| The Kitchen Table 57 | witness | Normal | 25 | 217 | 0 | 3/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | witness | Hard | 22.4 | 7553 | 1 | 3/1 | 423034 | boss4 | 21 |
| The Kitchen Table 57 | witness | Brutal | 3.3 | 3667 | 1 | 1/1 | 787587 | boss4 | 20 |
| Block 137,209 60 | witness | Normal | 16 | 456 | 0 | 2/5 | 10245 | orphan | 18 |
| Block 137,209 60 | witness | Hard | 4.4 | 7290 | 1 | 5/5 | 24193 | orphan | 21 |
| Block 137,209 60 | witness | Brutal | 0.9 | 3589 | 1 | 5/5 | 44863 | orphan | 20 |
| The Mempool 63 | witness | Normal | 16 | 347 | 0 | 2/5 | 12069 | sniper | 18 |
| The Mempool 63 | witness | Hard | 5.2 | 6778 | 1 | 5/5 | 28185 | sniper | 21 |
| The Mempool 63 | witness | Brutal | 0.7 | 3481 | 1 | 5/5 | 52063 | sniper | 20 |
| The Paper Vaults 66 | witness | Normal | 16 | 547 | 0 | 4/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | witness | Hard | 5.4 | 7261 | 1 | 5/5 | 71183 | custod | 21 |
| The Paper Vaults 66 | witness | Brutal | 0.9 | 3631 | 1 | 5/5 | 130998 | custod | 20 |
| Ninety-Three Blocks 69 | witness | Normal | 16 | 207 | 0 | 4/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | witness | Hard | 8.6 | 7333 | 1 | 4/5 | 37550 | valid | 21 |
| Ninety-Three Blocks 69 | witness | Brutal | 1.1 | 3766 | 1 | 5/5 | 68611 | valid | 20 |
| The Room 72 | witness | Normal | 25 | 0 | 0 | 3/1 | 289037 | boss5 | 18 |
| The Room 72 | witness | Hard | 25 | 2178 | 0 | 3/1 | 1490394 | boss5 | 21 |
| The Room 72 | witness | Brutal | 20 | 7641 | 1 | 3/1 | 2201643 | boss5 | 20 |
| The Vestibule 30 | maxi | Normal | 4.2 | 123 | 0 | 0/5 | 4274 | proxy | 18 |
| The Vestibule 30 | maxi | Hard | 9.8 | 3165 | 0 | 0/5 | 12489 | proxy | 21 |
| The Vestibule 30 | maxi | Brutal | 4.7 | 2967 | 1 | 6/5 | 24693 | proxy | 21 |
| The Hall of Minutes 33 | maxi | Normal | 0.8 | 38 | 0 | 0/5 | 9842 | director | 18 |
| The Hall of Minutes 33 | maxi | Hard | 2.9 | 1083 | 0 | 0/5 | 86188 | director | 21 |
| The Hall of Minutes 33 | maxi | Brutal | 4 | 3035 | 0 | 0/5 | 127421 | director | 21 |
| The Nine Chairs 36 | maxi | Normal | 0.4 | 0 | 0 | 0/5 | 10547 | director | 18 |
| The Nine Chairs 36 | maxi | Hard | 2.4 | 1349 | 0 | 0/5 | 88160 | director | 21 |
| The Nine Chairs 36 | maxi | Brutal | 2.4 | 2120 | 1 | 2/5 | 130345 | director | 21 |
| Rack Nine 39 | maxi | Normal | 0.2 | 0 | 0 | 0/5 | 5477 | proxy | 18 |
| Rack Nine 39 | maxi | Hard | 1 | 354 | 0 | 0/5 | 83750 | proxy | 21 |
| Rack Nine 39 | maxi | Brutal | 1.9 | 1157 | 0 | 0/5 | 122409 | proxy | 20 |
| Still Water 42 | maxi | Normal | 25 | 106 | 0 | 1/1 | 98944 | boss3 | 18 |
| Still Water 42 | maxi | Hard | 25 | 4087 | 0 | 2/1 | 261299 | boss3 | 21 |
| Still Water 42 | maxi | Brutal | 18.9 | 4165 | 1 | 3/1 | 502252 | boss3 | 20 |
| The Agreeable Mile 45 | maxi | Normal | 0.3 | 10 | 0 | 0/5 | 9741 | wisher | 18 |
| The Agreeable Mile 45 | maxi | Hard | 4.1 | 1357 | 0 | 0/5 | 102192 | wisher | 21 |
| The Agreeable Mile 45 | maxi | Brutal | 6.6 | 4234 | 0 | 0/5 | 149979 | wisher | 20 |
| The Sofa 48 | maxi | Normal | 0 | 0 | 0 | 0/5 | 5348 | lull | 18 |
| The Sofa 48 | maxi | Hard | 2.2 | 530 | 0 | 0/5 | 71607 | lull | 21 |
| The Sofa 48 | maxi | Brutal | 2.4 | 1370 | 0 | 0/5 | 104645 | lull | 20 |
| Tomari 51 | maxi | Normal | 14.2 | 421 | 0 | 0/5 | 19284 | ctkr | 18 |
| Tomari 51 | maxi | Hard | 5.9 | 4883 | 1 | 5/5 | 47876 | ctkr | 21 |
| Tomari 51 | maxi | Brutal | 0.8 | 2240 | 1 | 5/5 | 90278 | ctkr | 20 |
| The List 54 | maxi | Normal | 0.3 | 0 | 0 | 0/5 | 11946 | wisher | 18 |
| The List 54 | maxi | Hard | 2 | 1045 | 0 | 0/5 | 235547 | wisher | 21 |
| The List 54 | maxi | Brutal | 3 | 3117 | 0 | 0/5 | 342769 | wisher | 20 |
| The Kitchen Table 57 | maxi | Normal | 5.9 | 39 | 0 | 0/1 | 177073 | boss4 | 18 |
| The Kitchen Table 57 | maxi | Hard | 19.4 | 4842 | 1 | 2/1 | 2936272 | boss4 | 21 |
| The Kitchen Table 57 | maxi | Brutal | 4.1 | 2462 | 1 | 1/1 | 787587 | boss4 | 20 |
| Block 137,209 60 | maxi | Normal | 0.3 | 0 | 0 | 0/5 | 10245 | orphan | 18 |
| Block 137,209 60 | maxi | Hard | 2.3 | 346 | 0 | 0/5 | 141500 | orphan | 21 |
| Block 137,209 60 | maxi | Brutal | 3.6 | 2545 | 0 | 0/5 | 206372 | orphan | 20 |
| The Mempool 63 | maxi | Normal | 5.9 | 255 | 0 | 0/5 | 12069 | sniper | 18 |
| The Mempool 63 | maxi | Hard | 4.7 | 5624 | 1 | 5/5 | 28185 | sniper | 21 |
| The Mempool 63 | maxi | Brutal | 0.9 | 2677 | 1 | 5/5 | 52063 | sniper | 20 |
| The Paper Vaults 66 | maxi | Normal | 0.4 | 0 | 0 | 0/5 | 30804 | custod | 18 |
| The Paper Vaults 66 | maxi | Hard | 2.6 | 1067 | 0 | 0/5 | 529287 | custod | 21 |
| The Paper Vaults 66 | maxi | Brutal | 0.9 | 2796 | 1 | 5/5 | 770161 | custod | 20 |
| Ninety-Three Blocks 69 | maxi | Normal | 0.2 | 0 | 0 | 0/5 | 16575 | valid | 18 |
| Ninety-Three Blocks 69 | maxi | Hard | 1 | 523 | 0 | 0/5 | 208524 | valid | 21 |
| Ninety-Three Blocks 69 | maxi | Brutal | 1.5 | 570 | 0 | 0/5 | 304075 | valid | 20 |
| The Room 72 | maxi | Normal | 7 | 0 | 0 | 0/1 | 289037 | boss5 | 18 |
| The Room 72 | maxi | Hard | 25 | 2300 | 0 | 1/1 | 3806542 | boss5 | 21 |
| The Room 72 | maxi | Brutal | 25 | 4307 | 0 | 1/1 | 5547190 | boss5 | 20 |

## Concerns a reader should check

- Died to the Brutal pack: scrapper in The Hall of Minutes 33; scrapper in Rack Nine 39; scrapper in The Agreeable Mile 45; scrapper in Tomari 51; scrapper in The List 54; scrapper in Block 137,209 60; scrapper in The Mempool 63; scrapper in The Paper Vaults 66; scrapper in Ninety-Three Blocks 69; scrapper in The Room 72; hacker in The Vestibule 30; hacker in The Hall of Minutes 33; hacker in Rack Nine 39; hacker in Still Water 42; hacker in The Agreeable Mile 45; hacker in The Sofa 48; hacker in Tomari 51; hacker in The Kitchen Table 57; hacker in Block 137,209 60; hacker in The Mempool 63; hacker in The Paper Vaults 66; hacker in Ninety-Three Blocks 69; hacker in The Room 72; courier in The Hall of Minutes 33; courier in The Nine Chairs 36; courier in Rack Nine 39; courier in Still Water 42; courier in The Agreeable Mile 45; courier in The Sofa 48; courier in Tomari 51; courier in The Kitchen Table 57; courier in Block 137,209 60; courier in The Mempool 63; courier in The Paper Vaults 66; courier in Ninety-Three Blocks 69; courier in The Room 72; anon in The Hall of Minutes 33; anon in The Nine Chairs 36; anon in Still Water 42; anon in The Agreeable Mile 45; anon in Tomari 51; anon in The List 54; anon in The Kitchen Table 57; anon in Block 137,209 60; anon in The Mempool 63; anon in The Paper Vaults 66; anon in The Room 72; founder in The Vestibule 30; founder in The Hall of Minutes 33; founder in The Nine Chairs 36; founder in Rack Nine 39; founder in Block 137,209 60; founder in The Paper Vaults 66; homesteader in The Vestibule 30; homesteader in The Hall of Minutes 33; homesteader in The Nine Chairs 36; homesteader in Rack Nine 39; homesteader in Still Water 42; homesteader in The Sofa 48; homesteader in Tomari 51; homesteader in The List 54; homesteader in The Kitchen Table 57; homesteader in Block 137,209 60; homesteader in The Mempool 63; homesteader in The Paper Vaults 66; homesteader in Ninety-Three Blocks 69; homesteader in The Room 72; witness in The Vestibule 30; witness in The Hall of Minutes 33; witness in The Nine Chairs 36; witness in Rack Nine 39; witness in Still Water 42; witness in The Agreeable Mile 45; witness in The Sofa 48; witness in Tomari 51; witness in The List 54; witness in The Kitchen Table 57; witness in Block 137,209 60; witness in The Mempool 63; witness in The Paper Vaults 66; witness in Ninety-Three Blocks 69; witness in The Room 72; maxi in The Vestibule 30; maxi in The Nine Chairs 36; maxi in Still Water 42; maxi in Tomari 51; maxi in The Kitchen Table 57; maxi in The Mempool 63; maxi in The Paper Vaults 66.
- Slowest Normal trash clears still up at the cap: scrapper Rack Nine 39 16s, 2 left; scrapper The Agreeable Mile 45 16s, 2 left; scrapper The Mempool 63 16s, 6 left; hacker The Hall of Minutes 33 16s, 2 left; courier Tomari 51 16s, 5 left.
- Largest Brutal/Normal time ratio: courier The Vestibule 30 0.1s → 2.9s (×29.0); maxi The Agreeable Mile 45 0.3s → 6.6s (×22.0); scrapper The Nine Chairs 36 0.4s → 6.8s (×17.0); maxi Block 137,209 60 0.3s → 3.6s (×12.0).
