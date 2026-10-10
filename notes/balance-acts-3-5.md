# Acts III–V measurement

Pack fights. One sample each. This run is after the client pass (difficulty gate, banked experience, Technomancer ward, simulator difficulty, clean unique bands).

Protocol: level matched to the district, the class build named below, identified rare weapon, armor, helm, gloves, boots and belt rolled at that level, no uniques, no hire. Adaptive scaling left on, then reset before each fight so an earlier death does not ease the next one. Trash districts spawn 5 ordinary machines of that district's first non-tick kind, on top of the hero. Boss districts spawn the act boss alone. The hero stims under half life (6 stims), casts the first skill button, and steps toward the pack. Sim time is `G.time`. Cap 16s on a pack and 25s on a boss. Damage taken is life lost plus 45% of max life per stim. Died is 1 if the hero fell. Unique pool is how many non-boss uniques `uniqEligible` allows at that machine level (the new bands).

Caps, measured on a naked Brutal hero, armor 0, resists 0, one impact hit of 200 that ignores the player-damage quarter. The Brutal resist cut is 50, so a 0 resist becomes −50 and the hit lands at 1.5× before physical reduction: pdr 0 removed 300, pdr 40 removed 180, pdr 80 removed 150 (the 50% cap). Unique pool sizes by monster level: 12→24, 27→18, 36→18, 42→21, 48→21, 57→21, 60→21, 70→20. Left counts living machines when the clock stops, including anything the pack summoned.

| District | Class | Difficulty | Seconds | Damage taken | Died | Left | Pack life | Kind | Unique pool |
|---|---|---|---:|---:|---:|---:|---:|---|---:|
| The Vestibule 30 | scrapper | Normal | 2.4 | 0 | 0 | 0/5 | 12537 | proxy | 18 |
| The Vestibule 30 | scrapper | Hard | 3.2 | 477 | 0 | 0/5 | 18053 | proxy | 18 |
| The Vestibule 30 | scrapper | Brutal | 4.3 | 1007 | 0 | 0/5 | 26077 | proxy | 18 |
| The Hall of Minutes 33 | scrapper | Normal | 6 | 0 | 0 | 0/5 | 20993 | director | 18 |
| The Hall of Minutes 33 | scrapper | Hard | 9.5 | 2824 | 0 | 0/5 | 30618 | director | 18 |
| The Hall of Minutes 33 | scrapper | Brutal | 5.8 | 2732 | 1 | 4/5 | 44789 | director | 18 |
| The Nine Chairs 36 | scrapper | Normal | 2.2 | 0 | 0 | 0/5 | 45930 | director | 18 |
| The Nine Chairs 36 | scrapper | Hard | 3.5 | 0 | 0 | 0/5 | 66825 | director | 18 |
| The Nine Chairs 36 | scrapper | Brutal | 4.8 | 3681 | 0 | 0/5 | 97518 | director | 18 |
| Rack Nine 39 | scrapper | Normal | 2.7 | 730 | 0 | 0/5 | 23217 | proxy | 18 |
| Rack Nine 39 | scrapper | Hard | 4.3 | 2305 | 0 | 0/5 | 33433 | proxy | 18 |
| Rack Nine 39 | scrapper | Brutal | 5.7 | 5315 | 1 | 1/5 | 48292 | proxy | 18 |
| Still Water 42 | scrapper | Normal | 21.7 | 1547 | 0 | 0/1 | 481595 | boss3 | 21 |
| Still Water 42 | scrapper | Hard | 25 | 5491 | 0 | 2/1 | 726779 | boss3 | 21 |
| Still Water 42 | scrapper | Brutal | 17.8 | 6360 | 1 | 2/1 | 1049792 | boss3 | 21 |
| The Agreeable Mile 45 | scrapper | Normal | 0.6 | 0 | 0 | 0/5 | 71191 | wisher | 21 |
| The Agreeable Mile 45 | scrapper | Hard | 0.9 | 386 | 0 | 0/5 | 102515 | wisher | 21 |
| The Agreeable Mile 45 | scrapper | Brutal | 1.6 | 55 | 0 | 0/5 | 148077 | wisher | 21 |
| The Sofa 48 | scrapper | Normal | 1.1 | 207 | 0 | 0/5 | 25282 | lull | 21 |
| The Sofa 48 | scrapper | Hard | 1.6 | 350 | 0 | 0/5 | 36406 | lull | 21 |
| The Sofa 48 | scrapper | Brutal | 7.6 | 2808 | 0 | 0/5 | 52587 | lull | 21 |
| Tomari 51 | scrapper | Normal | 11.5 | 2412 | 0 | 0/5 | 119216 | ctkr | 21 |
| Tomari 51 | scrapper | Hard | 6.8 | 6612 | 1 | 3/5 | 173133 | ctkr | 21 |
| Tomari 51 | scrapper | Brutal | 1 | 2591 | 1 | 5/5 | 250081 | ctkr | 21 |
| The List 54 | scrapper | Normal | 1 | 415 | 0 | 0/5 | 74792 | wisher | 21 |
| The List 54 | scrapper | Hard | 1.5 | 728 | 0 | 0/5 | 107700 | wisher | 21 |
| The List 54 | scrapper | Brutal | 3 | 2253 | 0 | 0/5 | 155567 | wisher | 21 |
| The Kitchen Table 57 | scrapper | Normal | 25 | 4861 | 0 | 3/1 | 905685 | boss4 | 21 |
| The Kitchen Table 57 | scrapper | Hard | 25 | 7143 | 0 | 3/1 | 1304187 | boss4 | 21 |
| The Kitchen Table 57 | scrapper | Brutal | 21.1 | 7922 | 1 | 3/1 | 1883826 | boss4 | 21 |
| Block 137,209 60 | scrapper | Normal | 2 | 0 | 0 | 0/5 | 66549 | orphan | 21 |
| Block 137,209 60 | scrapper | Hard | 3 | 0 | 0 | 0/5 | 95831 | orphan | 21 |
| Block 137,209 60 | scrapper | Brutal | 4 | 2669 | 0 | 0/5 | 138423 | orphan | 21 |
| The Mempool 63 | scrapper | Normal | 2.2 | 44 | 0 | 0/5 | 81363 | sniper | 20 |
| The Mempool 63 | scrapper | Hard | 2.2 | 773 | 0 | 0/5 | 117163 | sniper | 20 |
| The Mempool 63 | scrapper | Brutal | 4.5 | 5598 | 0 | 0/5 | 169235 | sniper | 20 |
| The Paper Vaults 66 | scrapper | Normal | 14.5 | 1974 | 0 | 0/5 | 146385 | custod | 20 |
| The Paper Vaults 66 | scrapper | Hard | 16 | 5765 | 0 | 1/5 | 210794 | custod | 20 |
| The Paper Vaults 66 | scrapper | Brutal | 0.4 | 2188 | 1 | 5/5 | 306874 | custod | 20 |
| Ninety-Three Blocks 69 | scrapper | Normal | 1.7 | 1051 | 0 | 0/5 | 108937 | valid | 20 |
| Ninety-Three Blocks 69 | scrapper | Hard | 2.4 | 4999 | 0 | 0/5 | 156869 | valid | 20 |
| Ninety-Three Blocks 69 | scrapper | Brutal | 0.5 | 2765 | 1 | 5/5 | 226588 | valid | 20 |
| The Room 72 | scrapper | Normal | 25 | 4422 | 0 | 2/1 | 1355619 | boss5 | 20 |
| The Room 72 | scrapper | Hard | 25 | 6992 | 0 | 2/1 | 1952092 | boss5 | 20 |
| The Room 72 | scrapper | Brutal | 21.7 | 10438 | 1 | 2/1 | 2819688 | boss5 | 20 |
| The Vestibule 30 | hacker | Normal | 0.7 | 0 | 0 | 0/5 | 12669 | proxy | 18 |
| The Vestibule 30 | hacker | Hard | 11.4 | 1939 | 1 | 2/5 | 18243 | proxy | 18 |
| The Vestibule 30 | hacker | Brutal | 1.9 | 240 | 0 | 0/5 | 26351 | proxy | 18 |
| The Hall of Minutes 33 | hacker | Normal | 1.5 | 0 | 0 | 0/5 | 35546 | director | 18 |
| The Hall of Minutes 33 | hacker | Hard | 1.5 | 0 | 0 | 0/5 | 51186 | director | 18 |
| The Hall of Minutes 33 | hacker | Brutal | 3.3 | 1156 | 0 | 0/5 | 74756 | director | 18 |
| The Nine Chairs 36 | hacker | Normal | 1.4 | 0 | 0 | 0/5 | 51744 | director | 18 |
| The Nine Chairs 36 | hacker | Hard | 2.4 | 0 | 0 | 0/5 | 75267 | director | 18 |
| The Nine Chairs 36 | hacker | Brutal | 3.8 | 2587 | 1 | 4/5 | 109813 | director | 18 |
| Rack Nine 39 | hacker | Normal | 0.6 | 0 | 0 | 0/5 | 34759 | proxy | 18 |
| Rack Nine 39 | hacker | Hard | 0.4 | 0 | 0 | 0/5 | 50052 | proxy | 18 |
| Rack Nine 39 | hacker | Brutal | 0.8 | 0 | 0 | 0/5 | 72298 | proxy | 18 |
| Still Water 42 | hacker | Normal | 25 | 0 | 0 | 1/1 | 366542 | boss3 | 21 |
| Still Water 42 | hacker | Hard | 25 | 0 | 0 | 1/1 | 527820 | boss3 | 21 |
| Still Water 42 | hacker | Brutal | 25 | 1827 | 0 | 1/1 | 762407 | boss3 | 21 |
| The Agreeable Mile 45 | hacker | Normal | 3.6 | 148 | 0 | 0/5 | 46928 | wisher | 21 |
| The Agreeable Mile 45 | hacker | Hard | 5.4 | 420 | 0 | 0/5 | 67576 | wisher | 21 |
| The Agreeable Mile 45 | hacker | Brutal | 8.3 | 1304 | 0 | 0/5 | 97610 | wisher | 21 |
| The Sofa 48 | hacker | Normal | 1.6 | 0 | 0 | 0/5 | 23664 | lull | 21 |
| The Sofa 48 | hacker | Hard | 1.2 | 0 | 0 | 0/5 | 34076 | lull | 21 |
| The Sofa 48 | hacker | Brutal | 3.2 | 522 | 0 | 0/5 | 49220 | lull | 21 |
| Tomari 51 | hacker | Normal | 1.8 | 0 | 0 | 0/5 | 83443 | ctkr | 21 |
| Tomari 51 | hacker | Hard | 4.5 | 2896 | 1 | 5/5 | 121236 | ctkr | 21 |
| Tomari 51 | hacker | Brutal | 2.1 | 926 | 1 | 5/5 | 175118 | ctkr | 21 |
| The List 54 | hacker | Normal | 1.4 | 0 | 0 | 0/5 | 70917 | wisher | 21 |
| The List 54 | hacker | Hard | 1.9 | 133 | 0 | 0/5 | 102120 | wisher | 21 |
| The List 54 | hacker | Brutal | 3 | 438 | 0 | 0/5 | 147507 | wisher | 21 |
| The Kitchen Table 57 | hacker | Normal | 25 | 25 | 0 | 1/1 | 1318804 | boss4 | 21 |
| The Kitchen Table 57 | hacker | Hard | 25 | 671 | 0 | 1/1 | 1899078 | boss4 | 21 |
| The Kitchen Table 57 | hacker | Brutal | 25 | 3690 | 0 | 1/1 | 2743112 | boss4 | 21 |
| Block 137,209 60 | hacker | Normal | 0.6 | 0 | 0 | 0/5 | 49275 | orphan | 21 |
| Block 137,209 60 | hacker | Hard | 1.2 | 0 | 0 | 0/5 | 70956 | orphan | 21 |
| Block 137,209 60 | hacker | Brutal | 1.8 | 0 | 0 | 0/5 | 102492 | orphan | 21 |
| The Mempool 63 | hacker | Normal | 1.9 | 49 | 0 | 0/5 | 79277 | sniper | 20 |
| The Mempool 63 | hacker | Hard | 4 | 1681 | 0 | 0/5 | 114159 | sniper | 20 |
| The Mempool 63 | hacker | Brutal | 2.3 | 2954 | 1 | 5/5 | 164897 | sniper | 20 |
| The Paper Vaults 66 | hacker | Normal | 5.9 | 0 | 0 | 0/5 | 218277 | custod | 20 |
| The Paper Vaults 66 | hacker | Hard | 6.3 | 4354 | 1 | 6/5 | 314318 | custod | 20 |
| The Paper Vaults 66 | hacker | Brutal | 1 | 1206 | 1 | 5/5 | 454016 | custod | 20 |
| Ninety-Three Blocks 69 | hacker | Normal | 2.4 | 0 | 0 | 0/5 | 89733 | valid | 20 |
| Ninety-Three Blocks 69 | hacker | Hard | 5.1 | 2493 | 0 | 0/5 | 129215 | valid | 20 |
| Ninety-Three Blocks 69 | hacker | Brutal | 2.1 | 1108 | 1 | 5/5 | 186644 | valid | 20 |
| The Room 72 | hacker | Normal | 25 | 0 | 0 | 1/1 | 2239604 | boss5 | 20 |
| The Room 72 | hacker | Hard | 25 | 2154 | 0 | 1/1 | 3225030 | boss5 | 20 |
| The Room 72 | hacker | Brutal | 18 | 3419 | 1 | 1/1 | 4658376 | boss5 | 20 |
| The Vestibule 30 | courier | Normal | 0.6 | 68 | 0 | 0/5 | 10929 | proxy | 18 |
| The Vestibule 30 | courier | Hard | 1.1 | 0 | 0 | 0/5 | 15738 | proxy | 18 |
| The Vestibule 30 | courier | Brutal | 1.6 | 545 | 0 | 0/5 | 22733 | proxy | 18 |
| The Hall of Minutes 33 | courier | Normal | 2 | 218 | 0 | 0/5 | 39588 | director | 18 |
| The Hall of Minutes 33 | courier | Hard | 3 | 709 | 0 | 0/5 | 57007 | director | 18 |
| The Hall of Minutes 33 | courier | Brutal | 4 | 2055 | 0 | 0/5 | 83236 | director | 18 |
| The Nine Chairs 36 | courier | Normal | 4 | 0 | 0 | 0/5 | 36886 | director | 18 |
| The Nine Chairs 36 | courier | Hard | 5.9 | 2538 | 0 | 0/5 | 53692 | director | 18 |
| The Nine Chairs 36 | courier | Brutal | 4.4 | 3478 | 1 | 3/5 | 78391 | director | 18 |
| Rack Nine 39 | courier | Normal | 1 | 0 | 0 | 0/5 | 20629 | proxy | 18 |
| Rack Nine 39 | courier | Hard | 1.5 | 0 | 0 | 0/5 | 29705 | proxy | 18 |
| Rack Nine 39 | courier | Brutal | 2.2 | 0 | 0 | 0/5 | 42907 | proxy | 18 |
| Still Water 42 | courier | Normal | 5.7 | 0 | 0 | 0/1 | 312407 | boss3 | 21 |
| Still Water 42 | courier | Hard | 6.3 | 0 | 0 | 0/1 | 473429 | boss3 | 21 |
| Still Water 42 | courier | Brutal | 10.7 | 1666 | 0 | 0/1 | 718500 | boss3 | 21 |
| The Agreeable Mile 45 | courier | Normal | 1.8 | 217 | 0 | 0/5 | 61731 | wisher | 21 |
| The Agreeable Mile 45 | courier | Hard | 1.4 | 371 | 0 | 0/5 | 88892 | wisher | 21 |
| The Agreeable Mile 45 | courier | Brutal | 1 | 1221 | 1 | 4/5 | 128400 | wisher | 21 |
| The Sofa 48 | courier | Normal | 0.8 | 0 | 0 | 0/5 | 26028 | lull | 21 |
| The Sofa 48 | courier | Hard | 2.6 | 0 | 0 | 0/5 | 37481 | lull | 21 |
| The Sofa 48 | courier | Brutal | 3.2 | 0 | 0 | 0/5 | 54139 | lull | 21 |
| Tomari 51 | courier | Normal | 8.4 | 2383 | 0 | 0/5 | 95272 | ctkr | 21 |
| Tomari 51 | courier | Hard | 0.5 | 1059 | 1 | 5/5 | 138398 | ctkr | 21 |
| Tomari 51 | courier | Brutal | 1 | 2012 | 1 | 5/5 | 199908 | ctkr | 21 |
| The List 54 | courier | Normal | 1.8 | 387 | 0 | 0/5 | 60638 | wisher | 21 |
| The List 54 | courier | Hard | 3.3 | 1286 | 0 | 0/5 | 87318 | wisher | 21 |
| The List 54 | courier | Brutal | 5.5 | 2853 | 0 | 0/5 | 126127 | wisher | 21 |
| The Kitchen Table 57 | courier | Normal | 25 | 613 | 0 | 2/1 | 1471500 | boss4 | 21 |
| The Kitchen Table 57 | courier | Hard | 25 | 896 | 0 | 2/1 | 2118960 | boss4 | 21 |
| The Kitchen Table 57 | courier | Brutal | 21.8 | 5039 | 1 | 2/1 | 3060720 | boss4 | 21 |
| Block 137,209 60 | courier | Normal | 0.8 | 0 | 0 | 0/5 | 53692 | orphan | 21 |
| Block 137,209 60 | courier | Hard | 1.5 | 0 | 0 | 0/5 | 77316 | orphan | 21 |
| Block 137,209 60 | courier | Brutal | 1.5 | 601 | 0 | 0/5 | 111679 | orphan | 21 |
| The Mempool 63 | courier | Normal | 1.5 | 0 | 0 | 0/5 | 83431 | sniper | 20 |
| The Mempool 63 | courier | Hard | 2.3 | 1863 | 0 | 0/5 | 120141 | sniper | 20 |
| The Mempool 63 | courier | Brutal | 0.7 | 2001 | 1 | 5/5 | 173536 | sniper | 20 |
| The Paper Vaults 66 | courier | Normal | 7.5 | 463 | 0 | 0/5 | 249323 | custod | 20 |
| The Paper Vaults 66 | courier | Hard | 10 | 2808 | 0 | 0/5 | 359025 | custod | 20 |
| The Paper Vaults 66 | courier | Brutal | 2.8 | 1976 | 1 | 5/5 | 522420 | custod | 20 |
| Ninety-Three Blocks 69 | courier | Normal | 1 | 0 | 0 | 0/5 | 101473 | valid | 20 |
| Ninety-Three Blocks 69 | courier | Hard | 1 | 0 | 0 | 0/5 | 146122 | valid | 20 |
| Ninety-Three Blocks 69 | courier | Brutal | 1.9 | 0 | 0 | 0/5 | 211065 | valid | 20 |
| The Room 72 | courier | Normal | 25 | 3919 | 0 | 1/1 | 2777691 | boss5 | 20 |
| The Room 72 | courier | Hard | 18.2 | 5939 | 1 | 1/1 | 3999875 | boss5 | 20 |
| The Room 72 | courier | Brutal | 3.2 | 2327 | 1 | 1/1 | 5777597 | boss5 | 20 |
| The Vestibule 30 | anon | Normal | 3 | 0 | 0 | 0/5 | 13718 | proxy | 18 |
| The Vestibule 30 | anon | Hard | 2.7 | 0 | 0 | 0/5 | 19753 | proxy | 18 |
| The Vestibule 30 | anon | Brutal | 3.6 | 0 | 0 | 0/5 | 28533 | proxy | 18 |
| The Hall of Minutes 33 | anon | Normal | 5.1 | 0 | 0 | 0/5 | 43579 | director | 18 |
| The Hall of Minutes 33 | anon | Hard | 4.9 | 670 | 1 | 5/5 | 63422 | director | 18 |
| The Hall of Minutes 33 | anon | Brutal | 4.6 | 1273 | 1 | 5/5 | 91609 | director | 18 |
| The Nine Chairs 36 | anon | Normal | 7 | 0 | 0 | 0/5 | 35744 | director | 18 |
| The Nine Chairs 36 | anon | Hard | 16 | 3362 | 0 | 1/5 | 52034 | director | 18 |
| The Nine Chairs 36 | anon | Brutal | 4.8 | 1805 | 1 | 5/5 | 75976 | director | 18 |
| Rack Nine 39 | anon | Normal | 2.7 | 0 | 0 | 0/5 | 29625 | proxy | 18 |
| Rack Nine 39 | anon | Hard | 3 | 0 | 0 | 0/5 | 42660 | proxy | 18 |
| Rack Nine 39 | anon | Brutal | 3.6 | 0 | 0 | 0/5 | 61620 | proxy | 18 |
| Still Water 42 | anon | Normal | 25 | 781 | 0 | 1/1 | 473979 | boss3 | 21 |
| Still Water 42 | anon | Hard | 25 | 1655 | 0 | 1/1 | 682529 | boss3 | 21 |
| Still Water 42 | anon | Brutal | 25 | 2361 | 0 | 1/1 | 985876 | boss3 | 21 |
| The Agreeable Mile 45 | anon | Normal | 3.9 | 0 | 0 | 0/5 | 28372 | wisher | 21 |
| The Agreeable Mile 45 | anon | Hard | 4.8 | 0 | 0 | 0/5 | 40856 | wisher | 21 |
| The Agreeable Mile 45 | anon | Brutal | 9.1 | 157 | 0 | 0/5 | 59014 | wisher | 21 |
| The Sofa 48 | anon | Normal | 1.8 | 0 | 0 | 0/5 | 25060 | lull | 21 |
| The Sofa 48 | anon | Hard | 3 | 464 | 0 | 0/5 | 44060 | lull | 21 |
| The Sofa 48 | anon | Brutal | 3 | 939 | 0 | 0/5 | 63643 | lull | 21 |
| Tomari 51 | anon | Normal | 7.5 | 1310 | 0 | 0/5 | 86826 | ctkr | 21 |
| Tomari 51 | anon | Hard | 7.1 | 3589 | 1 | 5/5 | 126145 | ctkr | 21 |
| Tomari 51 | anon | Brutal | 4.2 | 1407 | 1 | 5/5 | 182209 | ctkr | 21 |
| The List 54 | anon | Normal | 4.6 | 1792 | 0 | 0/5 | 76167 | wisher | 21 |
| The List 54 | anon | Hard | 1 | 1272 | 1 | 5/5 | 109680 | wisher | 21 |
| The List 54 | anon | Brutal | 0.6 | 2417 | 1 | 5/5 | 158426 | wisher | 21 |
| The Kitchen Table 57 | anon | Normal | 25 | 83 | 0 | 2/1 | 765566 | boss4 | 21 |
| The Kitchen Table 57 | anon | Hard | 25 | 527 | 0 | 2/1 | 1102415 | boss4 | 21 |
| The Kitchen Table 57 | anon | Brutal | 21.6 | 1697 | 1 | 2/1 | 1592377 | boss4 | 21 |
| Block 137,209 60 | anon | Normal | 3 | 0 | 0 | 0/5 | 66961 | orphan | 21 |
| Block 137,209 60 | anon | Hard | 3.2 | 0 | 0 | 0/5 | 96424 | orphan | 21 |
| Block 137,209 60 | anon | Brutal | 4.4 | 3202 | 1 | 4/5 | 139280 | orphan | 21 |
| The Mempool 63 | anon | Normal | 5 | 423 | 0 | 0/5 | 106943 | sniper | 20 |
| The Mempool 63 | anon | Hard | 4.7 | 4544 | 1 | 9/5 | 153998 | sniper | 20 |
| The Mempool 63 | anon | Brutal | 4 | 1228 | 1 | 5/5 | 222442 | sniper | 20 |
| The Paper Vaults 66 | anon | Normal | 7.4 | 0 | 0 | 0/5 | 154716 | custod | 20 |
| The Paper Vaults 66 | anon | Hard | 11.7 | 0 | 0 | 0/5 | 222790 | custod | 20 |
| The Paper Vaults 66 | anon | Brutal | 4.2 | 1817 | 1 | 5/5 | 324318 | custod | 20 |
| Ninety-Three Blocks 69 | anon | Normal | 3 | 0 | 0 | 0/5 | 138722 | valid | 20 |
| Ninety-Three Blocks 69 | anon | Hard | 4.8 | 232 | 0 | 0/5 | 199760 | valid | 20 |
| Ninety-Three Blocks 69 | anon | Brutal | 8.7 | 2828 | 0 | 0/5 | 288542 | valid | 20 |
| The Room 72 | anon | Normal | 25 | 2281 | 0 | 1/1 | 2931005 | boss5 | 20 |
| The Room 72 | anon | Hard | 17.6 | 4365 | 1 | 2/1 | 4220647 | boss5 | 20 |
| The Room 72 | anon | Brutal | 4.2 | 1947 | 1 | 1/1 | 6096490 | boss5 | 20 |
| The Vestibule 30 | founder | Normal | 3.4 | 0 | 0 | 0/5 | 6274 | proxy | 18 |
| The Vestibule 30 | founder | Hard | 3.8 | 0 | 0 | 0/5 | 9034 | proxy | 18 |
| The Vestibule 30 | founder | Brutal | 6.6 | 0 | 0 | 0/5 | 13049 | proxy | 18 |
| The Hall of Minutes 33 | founder | Normal | 8.7 | 0 | 0 | 0/5 | 20776 | director | 18 |
| The Hall of Minutes 33 | founder | Hard | 9.4 | 0 | 0 | 0/5 | 29917 | director | 18 |
| The Hall of Minutes 33 | founder | Brutal | 15 | 0 | 0 | 0/5 | 43769 | director | 18 |
| The Nine Chairs 36 | founder | Normal | 8.9 | 0 | 0 | 0/5 | 25669 | director | 18 |
| The Nine Chairs 36 | founder | Hard | 12.6 | 0 | 0 | 0/5 | 37404 | director | 18 |
| The Nine Chairs 36 | founder | Brutal | 16 | 759 | 0 | 1/5 | 54668 | director | 18 |
| Rack Nine 39 | founder | Normal | 8 | 350 | 0 | 0/5 | 13930 | proxy | 18 |
| Rack Nine 39 | founder | Hard | 6.4 | 0 | 0 | 0/5 | 20059 | proxy | 18 |
| Rack Nine 39 | founder | Brutal | 9.5 | 0 | 0 | 0/5 | 28975 | proxy | 18 |
| Still Water 42 | founder | Normal | 25 | 220 | 0 | 2/1 | 204446 | boss3 | 21 |
| Still Water 42 | founder | Hard | 25 | 1957 | 0 | 3/1 | 294402 | boss3 | 21 |
| Still Water 42 | founder | Brutal | 25 | 912 | 0 | 1/1 | 425247 | boss3 | 21 |
| The Agreeable Mile 45 | founder | Normal | 7.8 | 0 | 0 | 0/5 | 18944 | wisher | 21 |
| The Agreeable Mile 45 | founder | Hard | 8.7 | 0 | 0 | 0/5 | 27280 | wisher | 21 |
| The Agreeable Mile 45 | founder | Brutal | 14.6 | 0 | 0 | 0/5 | 39404 | wisher | 21 |
| The Sofa 48 | founder | Normal | 7.4 | 0 | 0 | 0/5 | 14104 | lull | 21 |
| The Sofa 48 | founder | Hard | 7.9 | 0 | 0 | 0/5 | 20310 | lull | 21 |
| The Sofa 48 | founder | Brutal | 10.6 | 689 | 0 | 0/5 | 29336 | lull | 21 |
| Tomari 51 | founder | Normal | 14.5 | 0 | 0 | 0/5 | 64779 | ctkr | 21 |
| Tomari 51 | founder | Hard | 16 | 0 | 0 | 3/5 | 94160 | ctkr | 21 |
| Tomari 51 | founder | Brutal | 16 | 0 | 0 | 3/5 | 136009 | ctkr | 21 |
| The List 54 | founder | Normal | 5.9 | 51 | 0 | 0/5 | 38051 | wisher | 21 |
| The List 54 | founder | Hard | 4 | 195 | 0 | 0/5 | 54793 | wisher | 21 |
| The List 54 | founder | Brutal | 6.4 | 0 | 0 | 0/5 | 79145 | wisher | 21 |
| The Kitchen Table 57 | founder | Normal | 25 | 141 | 0 | 3/1 | 351106 | boss4 | 21 |
| The Kitchen Table 57 | founder | Hard | 25 | 291 | 0 | 2/1 | 505593 | boss4 | 21 |
| The Kitchen Table 57 | founder | Brutal | 25 | 238 | 0 | 3/1 | 730301 | boss4 | 21 |
| Block 137,209 60 | founder | Normal | 9.4 | 1161 | 0 | 0/5 | 39215 | orphan | 21 |
| Block 137,209 60 | founder | Hard | 4.5 | 0 | 0 | 0/5 | 56469 | orphan | 21 |
| Block 137,209 60 | founder | Brutal | 6.1 | 0 | 0 | 0/5 | 81566 | orphan | 21 |
| The Mempool 63 | founder | Normal | 4 | 0 | 0 | 0/5 | 44491 | sniper | 20 |
| The Mempool 63 | founder | Hard | 3.6 | 0 | 0 | 0/5 | 64067 | sniper | 20 |
| The Mempool 63 | founder | Brutal | 5.6 | 0 | 0 | 0/5 | 92542 | sniper | 20 |
| The Paper Vaults 66 | founder | Normal | 12.2 | 0 | 0 | 0/5 | 102671 | custod | 20 |
| The Paper Vaults 66 | founder | Hard | 15 | 0 | 0 | 0/5 | 147846 | custod | 20 |
| The Paper Vaults 66 | founder | Brutal | 16 | 0 | 0 | 3/5 | 215340 | custod | 20 |
| Ninety-Three Blocks 69 | founder | Normal | 5 | 0 | 0 | 0/5 | 74570 | valid | 20 |
| Ninety-Three Blocks 69 | founder | Hard | 4.9 | 0 | 0 | 0/5 | 107380 | valid | 20 |
| Ninety-Three Blocks 69 | founder | Brutal | 6 | 0 | 0 | 0/5 | 155105 | valid | 20 |
| The Room 72 | founder | Normal | 25 | 0 | 0 | 2/1 | 1341018 | boss5 | 20 |
| The Room 72 | founder | Hard | 25 | 0 | 0 | 1/1 | 1931067 | boss5 | 20 |
| The Room 72 | founder | Brutal | 25 | 291 | 0 | 1/1 | 2789318 | boss5 | 20 |
| The Vestibule 30 | homesteader | Normal | 5.6 | 2644 | 0 | 0/5 | 10919 | proxy | 18 |
| The Vestibule 30 | homesteader | Hard | 8.3 | 5469 | 0 | 0/5 | 15723 | proxy | 18 |
| The Vestibule 30 | homesteader | Brutal | 4.7 | 5565 | 1 | 5/5 | 22712 | proxy | 18 |
| The Hall of Minutes 33 | homesteader | Normal | 5.4 | 0 | 0 | 0/5 | 28868 | director | 18 |
| The Hall of Minutes 33 | homesteader | Hard | 7 | 1812 | 0 | 0/5 | 42056 | director | 18 |
| The Hall of Minutes 33 | homesteader | Brutal | 6.7 | 6334 | 1 | 5/5 | 61451 | director | 18 |
| The Nine Chairs 36 | homesteader | Normal | 4 | 734 | 0 | 0/5 | 18656 | director | 18 |
| The Nine Chairs 36 | homesteader | Hard | 5.2 | 2229 | 0 | 0/5 | 27220 | director | 18 |
| The Nine Chairs 36 | homesteader | Brutal | 6.4 | 6109 | 1 | 2/5 | 39836 | director | 18 |
| Rack Nine 39 | homesteader | Normal | 5.4 | 1502 | 0 | 0/5 | 13434 | proxy | 18 |
| Rack Nine 39 | homesteader | Hard | 7 | 3702 | 0 | 0/5 | 19345 | proxy | 18 |
| Rack Nine 39 | homesteader | Brutal | 4.2 | 7268 | 1 | 5/5 | 27943 | proxy | 18 |
| Still Water 42 | homesteader | Normal | 25 | 1970 | 0 | 1/1 | 176897 | boss3 | 21 |
| Still Water 42 | homesteader | Hard | 25 | 4802 | 0 | 2/1 | 254732 | boss3 | 21 |
| Still Water 42 | homesteader | Brutal | 25 | 4722 | 0 | 1/1 | 367946 | boss3 | 21 |
| The Agreeable Mile 45 | homesteader | Normal | 6.6 | 2205 | 0 | 0/5 | 16556 | wisher | 21 |
| The Agreeable Mile 45 | homesteader | Hard | 10.4 | 4028 | 0 | 0/5 | 23841 | wisher | 21 |
| The Agreeable Mile 45 | homesteader | Brutal | 8.2 | 8562 | 1 | 4/5 | 34437 | wisher | 21 |
| The Sofa 48 | homesteader | Normal | 1.8 | 306 | 0 | 0/5 | 9939 | lull | 21 |
| The Sofa 48 | homesteader | Hard | 2.4 | 759 | 0 | 0/5 | 14313 | lull | 21 |
| The Sofa 48 | homesteader | Brutal | 3.4 | 1170 | 0 | 0/5 | 20674 | lull | 21 |
| Tomari 51 | homesteader | Normal | 8.1 | 3054 | 0 | 0/5 | 49956 | ctkr | 21 |
| Tomari 51 | homesteader | Hard | 9.1 | 8369 | 1 | 2/5 | 72657 | ctkr | 21 |
| Tomari 51 | homesteader | Brutal | 3.1 | 6334 | 1 | 5/5 | 104949 | ctkr | 21 |
| The List 54 | homesteader | Normal | 5.8 | 1611 | 0 | 0/5 | 23163 | wisher | 21 |
| The List 54 | homesteader | Hard | 8.6 | 3422 | 0 | 0/5 | 33355 | wisher | 21 |
| The List 54 | homesteader | Brutal | 12.3 | 5486 | 0 | 0/5 | 48180 | wisher | 21 |
| The Kitchen Table 57 | homesteader | Normal | 25 | 1760 | 0 | 2/1 | 670242 | boss4 | 21 |
| The Kitchen Table 57 | homesteader | Hard | 25 | 2443 | 0 | 1/1 | 965148 | boss4 | 21 |
| The Kitchen Table 57 | homesteader | Brutal | 25 | 5361 | 0 | 2/1 | 1394103 | boss4 | 21 |
| Block 137,209 60 | homesteader | Normal | 7.2 | 8717 | 1 | 2/5 | 19793 | orphan | 21 |
| Block 137,209 60 | homesteader | Hard | 4.5 | 4205 | 0 | 0/5 | 28502 | orphan | 21 |
| Block 137,209 60 | homesteader | Brutal | 4.9 | 8717 | 1 | 5/5 | 41170 | orphan | 21 |
| The Mempool 63 | homesteader | Normal | 11.6 | 7986 | 1 | 1/5 | 21961 | sniper | 20 |
| The Mempool 63 | homesteader | Hard | 5.9 | 10552 | 1 | 4/5 | 31623 | sniper | 20 |
| The Mempool 63 | homesteader | Brutal | 2.9 | 10552 | 1 | 5/5 | 45678 | sniper | 20 |
| The Paper Vaults 66 | homesteader | Normal | 5.7 | 2061 | 0 | 0/5 | 83788 | custod | 20 |
| The Paper Vaults 66 | homesteader | Hard | 2.5 | 3696 | 1 | 5/5 | 120655 | custod | 20 |
| The Paper Vaults 66 | homesteader | Brutal | 2.1 | 3696 | 1 | 5/5 | 174279 | custod | 20 |
| Ninety-Three Blocks 69 | homesteader | Normal | 10 | 3924 | 0 | 0/5 | 30395 | valid | 20 |
| Ninety-Three Blocks 69 | homesteader | Hard | 14.9 | 8084 | 0 | 0/5 | 43769 | valid | 20 |
| Ninety-Three Blocks 69 | homesteader | Brutal | 9.2 | 9972 | 1 | 5/5 | 63222 | valid | 20 |
| The Room 72 | homesteader | Normal | 25 | 0 | 0 | 1/1 | 664556 | boss5 | 20 |
| The Room 72 | homesteader | Hard | 25 | 1702 | 0 | 2/1 | 956961 | boss5 | 20 |
| The Room 72 | homesteader | Brutal | 25 | 2236 | 0 | 1/1 | 1382277 | boss5 | 20 |
| The Vestibule 30 | witness | Normal | 5.4 | 1493 | 0 | 0/5 | 10968 | proxy | 18 |
| The Vestibule 30 | witness | Hard | 10.7 | 3554 | 0 | 0/5 | 15794 | proxy | 18 |
| The Vestibule 30 | witness | Brutal | 5.1 | 5095 | 1 | 5/5 | 22814 | proxy | 18 |
| The Hall of Minutes 33 | witness | Normal | 13.4 | 5805 | 1 | 6/5 | 16839 | director | 18 |
| The Hall of Minutes 33 | witness | Hard | 7.2 | 5805 | 1 | 5/5 | 24248 | director | 18 |
| The Hall of Minutes 33 | witness | Brutal | 4.1 | 5805 | 1 | 8/5 | 35025 | director | 18 |
| The Nine Chairs 36 | witness | Normal | 16 | 3898 | 0 | 1/5 | 16862 | director | 18 |
| The Nine Chairs 36 | witness | Hard | 11.4 | 6334 | 1 | 6/5 | 24281 | director | 18 |
| The Nine Chairs 36 | witness | Brutal | 5.2 | 6334 | 1 | 7/5 | 35073 | director | 18 |
| Rack Nine 39 | witness | Normal | 16 | 4679 | 0 | 1/5 | 8714 | proxy | 18 |
| Rack Nine 39 | witness | Hard | 12.5 | 6111 | 0 | 0/5 | 12548 | proxy | 18 |
| Rack Nine 39 | witness | Brutal | 6.8 | 8314 | 1 | 5/5 | 18125 | proxy | 18 |
| Still Water 42 | witness | Normal | 25 | 4322 | 0 | 3/1 | 334543 | boss3 | 21 |
| Still Water 42 | witness | Hard | 22 | 6116 | 1 | 3/1 | 481742 | boss3 | 21 |
| Still Water 42 | witness | Brutal | 14.1 | 6116 | 1 | 2/1 | 695849 | boss3 | 21 |
| The Agreeable Mile 45 | witness | Normal | 16 | 2188 | 0 | 2/5 | 28642 | wisher | 21 |
| The Agreeable Mile 45 | witness | Hard | 16 | 4052 | 0 | 3/5 | 41244 | wisher | 21 |
| The Agreeable Mile 45 | witness | Brutal | 8.8 | 6664 | 1 | 5/5 | 59574 | wisher | 21 |
| The Sofa 48 | witness | Normal | 16 | 3108 | 0 | 2/5 | 8989 | lull | 21 |
| The Sofa 48 | witness | Hard | 16 | 5440 | 0 | 3/5 | 12944 | lull | 21 |
| The Sofa 48 | witness | Brutal | 15.7 | 7404 | 1 | 4/5 | 18697 | lull | 21 |
| Tomari 51 | witness | Normal | 16 | 3915 | 0 | 6/5 | 54038 | ctkr | 21 |
| Tomari 51 | witness | Hard | 16 | 7803 | 0 | 5/5 | 77814 | ctkr | 21 |
| Tomari 51 | witness | Brutal | 9 | 9043 | 1 | 5/5 | 112399 | ctkr | 21 |
| The List 54 | witness | Normal | 16 | 3312 | 0 | 2/5 | 43030 | wisher | 21 |
| The List 54 | witness | Hard | 14.2 | 6310 | 0 | 0/5 | 61964 | wisher | 21 |
| The List 54 | witness | Brutal | 7.4 | 7592 | 1 | 5/5 | 89503 | wisher | 21 |
| The Kitchen Table 57 | witness | Normal | 25 | 2582 | 0 | 3/1 | 377294 | boss4 | 21 |
| The Kitchen Table 57 | witness | Hard | 25 | 5758 | 0 | 3/1 | 543304 | boss4 | 21 |
| The Kitchen Table 57 | witness | Brutal | 21.5 | 7840 | 1 | 3/1 | 784773 | boss4 | 21 |
| Block 137,209 60 | witness | Normal | 9.1 | 7361 | 0 | 0/5 | 24634 | orphan | 21 |
| Block 137,209 60 | witness | Hard | 5.9 | 9232 | 1 | 5/5 | 35472 | orphan | 21 |
| Block 137,209 60 | witness | Brutal | 0.6 | 3618 | 1 | 5/5 | 51238 | orphan | 21 |
| The Mempool 63 | witness | Normal | 9 | 2684 | 0 | 0/5 | 36367 | sniper | 20 |
| The Mempool 63 | witness | Hard | 8.7 | 7833 | 1 | 5/5 | 52368 | sniper | 20 |
| The Mempool 63 | witness | Brutal | 6 | 7833 | 1 | 5/5 | 75642 | sniper | 20 |
| The Paper Vaults 66 | witness | Normal | 16 | 5551 | 0 | 6/5 | 105896 | custod | 20 |
| The Paper Vaults 66 | witness | Hard | 8.3 | 7437 | 1 | 5/5 | 152490 | custod | 20 |
| The Paper Vaults 66 | witness | Brutal | 4.2 | 7437 | 1 | 5/5 | 220263 | custod | 20 |
| Ninety-Three Blocks 69 | witness | Normal | 8 | 0 | 0 | 0/5 | 76951 | valid | 20 |
| Ninety-Three Blocks 69 | witness | Hard | 11.9 | 892 | 0 | 0/5 | 110809 | valid | 20 |
| Ninety-Three Blocks 69 | witness | Brutal | 8.4 | 7333 | 1 | 5/5 | 160058 | valid | 20 |
| The Room 72 | witness | Normal | 25 | 6719 | 0 | 3/1 | 1055386 | boss5 | 20 |
| The Room 72 | witness | Hard | 25 | 7466 | 0 | 3/1 | 1519756 | boss5 | 20 |
| The Room 72 | witness | Brutal | 8.5 | 7629 | 1 | 2/1 | 2195204 | boss5 | 20 |
| The Vestibule 30 | maxi | Normal | 3.1 | 324 | 0 | 0/5 | 12914 | proxy | 18 |
| The Vestibule 30 | maxi | Hard | 6.5 | 781 | 0 | 0/5 | 18596 | proxy | 18 |
| The Vestibule 30 | maxi | Brutal | 7.1 | 3679 | 1 | 1/5 | 26861 | proxy | 18 |
| The Hall of Minutes 33 | maxi | Normal | 8 | 2239 | 0 | 0/5 | 41654 | director | 18 |
| The Hall of Minutes 33 | maxi | Hard | 4.9 | 3682 | 1 | 5/5 | 60625 | director | 18 |
| The Hall of Minutes 33 | maxi | Brutal | 4.1 | 3682 | 1 | 9/5 | 87569 | director | 18 |
| The Nine Chairs 36 | maxi | Normal | 8.2 | 4551 | 1 | 2/5 | 42021 | director | 18 |
| The Nine Chairs 36 | maxi | Hard | 4.2 | 4603 | 1 | 9/5 | 61148 | director | 18 |
| The Nine Chairs 36 | maxi | Brutal | 3.4 | 4603 | 1 | 5/5 | 88325 | director | 18 |
| Rack Nine 39 | maxi | Normal | 3.4 | 884 | 0 | 0/5 | 27421 | proxy | 18 |
| Rack Nine 39 | maxi | Hard | 5.4 | 2309 | 0 | 0/5 | 39487 | proxy | 18 |
| Rack Nine 39 | maxi | Brutal | 3.6 | 3530 | 1 | 5/5 | 57036 | proxy | 18 |
| Still Water 42 | maxi | Normal | 25 | 2982 | 0 | 3/1 | 320765 | boss3 | 21 |
| Still Water 42 | maxi | Hard | 25 | 3413 | 0 | 2/1 | 461901 | boss3 | 21 |
| Still Water 42 | maxi | Brutal | 17.1 | 4758 | 1 | 2/1 | 667191 | boss3 | 21 |
| The Agreeable Mile 45 | maxi | Normal | 16 | 2114 | 0 | 1/5 | 49342 | wisher | 21 |
| The Agreeable Mile 45 | maxi | Hard | 16 | 3365 | 0 | 3/5 | 71052 | wisher | 21 |
| The Agreeable Mile 45 | maxi | Brutal | 7.6 | 4451 | 1 | 5/5 | 102631 | wisher | 21 |
| The Sofa 48 | maxi | Normal | 10.2 | 399 | 0 | 0/5 | 18820 | lull | 21 |
| The Sofa 48 | maxi | Hard | 13.4 | 1518 | 0 | 0/5 | 27101 | lull | 21 |
| The Sofa 48 | maxi | Brutal | 16 | 3937 | 0 | 2/5 | 39146 | lull | 21 |
| Tomari 51 | maxi | Normal | 16 | 3957 | 0 | 1/5 | 102632 | ctkr | 21 |
| Tomari 51 | maxi | Hard | 9.1 | 6649 | 1 | 5/5 | 149074 | ctkr | 21 |
| Tomari 51 | maxi | Brutal | 5.6 | 6649 | 1 | 5/5 | 215329 | ctkr | 21 |
| The List 54 | maxi | Normal | 9.6 | 2703 | 0 | 0/5 | 97024 | wisher | 21 |
| The List 54 | maxi | Hard | 16 | 2698 | 0 | 3/5 | 139714 | wisher | 21 |
| The List 54 | maxi | Brutal | 8.4 | 5680 | 1 | 4/5 | 201809 | wisher | 21 |
| The Kitchen Table 57 | maxi | Normal | 25 | 5125 | 0 | 3/1 | 922217 | boss4 | 21 |
| The Kitchen Table 57 | maxi | Hard | 17.6 | 5990 | 1 | 2/1 | 1327992 | boss4 | 21 |
| The Kitchen Table 57 | maxi | Brutal | 7.5 | 4533 | 1 | 1/1 | 1918210 | boss4 | 21 |
| Block 137,209 60 | maxi | Normal | 3.6 | 3059 | 0 | 0/5 | 52667 | orphan | 21 |
| Block 137,209 60 | maxi | Hard | 4.4 | 6286 | 1 | 5/5 | 75840 | orphan | 21 |
| Block 137,209 60 | maxi | Brutal | 2.1 | 6286 | 1 | 5/5 | 109546 | orphan | 21 |
| The Mempool 63 | maxi | Normal | 2.6 | 2650 | 0 | 0/5 | 61848 | sniper | 20 |
| The Mempool 63 | maxi | Hard | 3.1 | 4542 | 1 | 3/5 | 89061 | sniper | 20 |
| The Mempool 63 | maxi | Brutal | 2.6 | 6001 | 1 | 5/5 | 128644 | sniper | 20 |
| The Paper Vaults 66 | maxi | Normal | 12.7 | 3515 | 0 | 0/5 | 172314 | custod | 20 |
| The Paper Vaults 66 | maxi | Hard | 6.1 | 6075 | 1 | 5/5 | 248132 | custod | 20 |
| The Paper Vaults 66 | maxi | Brutal | 3.6 | 6127 | 1 | 5/5 | 361168 | custod | 20 |
| Ninety-Three Blocks 69 | maxi | Normal | 3 | 488 | 0 | 0/5 | 78326 | valid | 20 |
| Ninety-Three Blocks 69 | maxi | Hard | 5.2 | 1691 | 0 | 0/5 | 112790 | valid | 20 |
| Ninety-Three Blocks 69 | maxi | Brutal | 6.5 | 6320 | 1 | 3/5 | 162919 | valid | 20 |
| The Room 72 | maxi | Normal | 25 | 2537 | 0 | 3/1 | 3495072 | boss5 | 20 |
| The Room 72 | maxi | Hard | 25 | 6211 | 0 | 3/1 | 5032903 | boss5 | 20 |
| The Room 72 | maxi | Brutal | 19.8 | 7252 | 1 | 2/1 | 7269749 | boss5 | 20 |

## Concerns a reader should check

- Died to the Normal pack: homesteader in Block 137,209 60 (7.2s, 8717 taken); homesteader in The Mempool 63 (11.6s, 7986 taken); witness in The Hall of Minutes 33 (13.4s, 5805 taken); maxi in The Nine Chairs 36 (8.2s, 4551 taken).
- Died to the Brutal pack: scrapper in The Hall of Minutes 33; scrapper in Rack Nine 39; scrapper in Still Water 42; scrapper in Tomari 51; scrapper in The Kitchen Table 57; scrapper in The Paper Vaults 66; scrapper in Ninety-Three Blocks 69; scrapper in The Room 72; hacker in The Nine Chairs 36; hacker in Tomari 51; hacker in The Mempool 63; hacker in The Paper Vaults 66; hacker in Ninety-Three Blocks 69; hacker in The Room 72; courier in The Nine Chairs 36; courier in The Agreeable Mile 45; courier in Tomari 51; courier in The Kitchen Table 57; courier in The Mempool 63; courier in The Paper Vaults 66; courier in The Room 72; anon in The Hall of Minutes 33; anon in The Nine Chairs 36; anon in Tomari 51; anon in The List 54; anon in The Kitchen Table 57; anon in Block 137,209 60; anon in The Mempool 63; anon in The Paper Vaults 66; anon in The Room 72; homesteader in The Vestibule 30; homesteader in The Hall of Minutes 33; homesteader in The Nine Chairs 36; homesteader in Rack Nine 39; homesteader in The Agreeable Mile 45; homesteader in Tomari 51; homesteader in Block 137,209 60; homesteader in The Mempool 63; homesteader in The Paper Vaults 66; homesteader in Ninety-Three Blocks 69; witness in The Vestibule 30; witness in The Hall of Minutes 33; witness in The Nine Chairs 36; witness in Rack Nine 39; witness in Still Water 42; witness in The Agreeable Mile 45; witness in The Sofa 48; witness in Tomari 51; witness in The List 54; witness in The Kitchen Table 57; witness in Block 137,209 60; witness in The Mempool 63; witness in The Paper Vaults 66; witness in Ninety-Three Blocks 69; witness in The Room 72; maxi in The Vestibule 30; maxi in The Hall of Minutes 33; maxi in The Nine Chairs 36; maxi in Rack Nine 39; maxi in Still Water 42; maxi in The Agreeable Mile 45; maxi in Tomari 51; maxi in The List 54; maxi in The Kitchen Table 57; maxi in Block 137,209 60; maxi in The Mempool 63; maxi in The Paper Vaults 66; maxi in Ninety-Three Blocks 69; maxi in The Room 72.
- Slowest Normal trash clears still up at the cap: witness The Nine Chairs 36 16s, 1 left; witness Rack Nine 39 16s, 1 left; witness The Agreeable Mile 45 16s, 2 left; witness The Sofa 48 16s, 2 left; witness Tomari 51 16s, 6 left.
- Largest Brutal/Normal time ratio: scrapper The Sofa 48 1.1s → 7.6s (×6.9); courier The Sofa 48 0.8s → 3.2s (×4.0); courier The List 54 1.8s → 5.5s (×3.1); scrapper The List 54 1s → 3s (×3.0).
