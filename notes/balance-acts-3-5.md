# Acts III–V measurement

Pack fights. One sample each. This run is after the Act III–V balance pass.

Protocol: level matched to the district, the class build named below, identified rare weapon, armor, helm, gloves, boots and belt rolled at that level, no uniques, no hire. Adaptive scaling left on, then reset before each fight so an earlier death does not ease the next one. Trash districts spawn 5 ordinary machines of that district's first non-tick kind, on top of the hero. Boss districts spawn the act boss alone. The hero stims under half life (6 stims), casts the first skill button, and steps toward the pack. Sim time is `G.time`. Cap 16s on a pack and 25s on a boss. Damage taken is life lost plus 45% of max life per stim. Died is 1 if the hero fell. Unique pool is how many non-boss uniques `uniqEligible` allows at that machine level (the new bands).

Caps, measured on a naked Brutal hero, armor 0, resists 0, one impact hit of 200 that ignores the player-damage quarter. The Brutal resist cut is 50, so a 0 resist becomes −50 and the hit lands at 1.5× before physical reduction: pdr 0 removed 300, pdr 40 removed 180, pdr 80 removed 150 (the 50% cap). Unique pool sizes by monster level: 12→24, 27→18, 36→39, 42→21, 48→21, 57→21, 60→41, 70→20. Left counts living machines when the clock stops, including anything the pack summoned.

| District | Class | Difficulty | Seconds | Damage taken | Died | Left | Pack life | Kind | Unique pool |
|---|---|---|---:|---:|---:|---:|---:|---|---:|
| The Vestibule 30 | scrapper | Normal | 1.6 | 0 | 0 | 0/5 | 13294 | proxy | 18 |
| The Vestibule 30 | scrapper | Hard | 2 | 0 | 0 | 0/5 | 19143 | proxy | 18 |
| The Vestibule 30 | scrapper | Brutal | 2.8 | 691 | 0 | 0/5 | 27980 | proxy | 18 |
| The Hall of Minutes 33 | scrapper | Normal | 6.1 | 577 | 0 | 0/5 | 26683 | director | 18 |
| The Hall of Minutes 33 | scrapper | Hard | 8.6 | 2923 | 0 | 0/5 | 38881 | director | 18 |
| The Hall of Minutes 33 | scrapper | Brutal | 10.1 | 4806 | 1 | 3/5 | 56826 | director | 18 |
| The Nine Chairs 36 | scrapper | Normal | 4.5 | 0 | 0 | 0/5 | 24160 | director | 39 |
| The Nine Chairs 36 | scrapper | Hard | 8 | 0 | 0 | 0/5 | 35213 | director | 39 |
| The Nine Chairs 36 | scrapper | Brutal | 12.5 | 747 | 0 | 0/5 | 51477 | director | 39 |
| Rack Nine 39 | scrapper | Normal | 3.2 | 721 | 0 | 0/5 | 13117 | proxy | 39 |
| Rack Nine 39 | scrapper | Hard | 4.7 | 1318 | 0 | 0/5 | 18888 | proxy | 39 |
| Rack Nine 39 | scrapper | Brutal | 7 | 4353 | 1 | 1/5 | 27283 | proxy | 39 |
| Still Water 42 | scrapper | Normal | 25 | 1643 | 0 | 3/1 | 389382 | boss3 | 21 |
| Still Water 42 | scrapper | Hard | 25 | 1043 | 0 | 1/1 | 560709 | boss3 | 21 |
| Still Water 42 | scrapper | Brutal | 25 | 4833 | 0 | 2/1 | 809914 | boss3 | 21 |
| The Agreeable Mile 45 | scrapper | Normal | 1.3 | 259 | 0 | 0/5 | 56940 | wisher | 21 |
| The Agreeable Mile 45 | scrapper | Hard | 1.8 | 437 | 0 | 0/5 | 81993 | wisher | 21 |
| The Agreeable Mile 45 | scrapper | Brutal | 2.2 | 701 | 0 | 0/5 | 118435 | wisher | 21 |
| The Sofa 48 | scrapper | Normal | 1.3 | 0 | 0 | 0/5 | 20867 | lull | 21 |
| The Sofa 48 | scrapper | Hard | 2.6 | 0 | 0 | 0/5 | 30049 | lull | 21 |
| The Sofa 48 | scrapper | Brutal | 3.8 | 280 | 0 | 0/5 | 43404 | lull | 21 |
| Tomari 51 | scrapper | Normal | 7 | 0 | 0 | 0/5 | 81566 | ctkr | 21 |
| Tomari 51 | scrapper | Hard | 10 | 4080 | 0 | 0/5 | 118514 | ctkr | 21 |
| Tomari 51 | scrapper | Brutal | 14 | 4898 | 0 | 0/5 | 171187 | ctkr | 21 |
| The List 54 | scrapper | Normal | 3.2 | 0 | 0 | 0/5 | 79183 | wisher | 21 |
| The List 54 | scrapper | Hard | 5.4 | 0 | 0 | 0/5 | 114023 | wisher | 21 |
| The List 54 | scrapper | Brutal | 6.4 | 1805 | 0 | 0/5 | 164700 | wisher | 21 |
| The Kitchen Table 57 | scrapper | Normal | 25 | 406 | 0 | 1/1 | 793511 | boss4 | 21 |
| The Kitchen Table 57 | scrapper | Hard | 25 | 59 | 0 | 3/1 | 1142656 | boss4 | 21 |
| The Kitchen Table 57 | scrapper | Brutal | 25 | 6674 | 0 | 2/1 | 1650504 | boss4 | 21 |
| Block 137,209 60 | scrapper | Normal | 1.4 | 0 | 0 | 0/5 | 65492 | orphan | 41 |
| Block 137,209 60 | scrapper | Hard | 1.5 | 0 | 0 | 0/5 | 94309 | orphan | 41 |
| Block 137,209 60 | scrapper | Brutal | 2.8 | 2688 | 0 | 0/5 | 136224 | orphan | 41 |
| The Mempool 63 | scrapper | Normal | 2.2 | 908 | 0 | 0/5 | 67881 | sniper | 20 |
| The Mempool 63 | scrapper | Hard | 3.8 | 2779 | 0 | 0/5 | 97749 | sniper | 20 |
| The Mempool 63 | scrapper | Brutal | 1 | 3665 | 1 | 4/5 | 141193 | sniper | 20 |
| The Paper Vaults 66 | scrapper | Normal | 7.5 | 940 | 0 | 0/5 | 200049 | custod | 20 |
| The Paper Vaults 66 | scrapper | Hard | 11.5 | 1895 | 0 | 0/5 | 288070 | custod | 20 |
| The Paper Vaults 66 | scrapper | Brutal | 7.2 | 7838 | 1 | 3/5 | 419242 | custod | 20 |
| Ninety-Three Blocks 69 | scrapper | Normal | 1.7 | 84 | 0 | 0/5 | 114794 | valid | 20 |
| Ninety-Three Blocks 69 | scrapper | Hard | 2.2 | 2898 | 0 | 0/5 | 165303 | valid | 20 |
| Ninety-Three Blocks 69 | scrapper | Brutal | 0.9 | 2147 | 1 | 3/5 | 238772 | valid | 20 |
| The Room 72 | scrapper | Normal | 25 | 1211 | 0 | 2/1 | 1825942 | boss5 | 20 |
| The Room 72 | scrapper | Hard | 25 | 2716 | 0 | 2/1 | 2629356 | boss5 | 20 |
| The Room 72 | scrapper | Brutal | 25 | 5971 | 0 | 2/1 | 3797959 | boss5 | 20 |
| The Vestibule 30 | hacker | Normal | 0.5 | 0 | 0 | 0/5 | 10769 | proxy | 18 |
| The Vestibule 30 | hacker | Hard | 0.5 | 0 | 0 | 0/5 | 15507 | proxy | 18 |
| The Vestibule 30 | hacker | Brutal | 1 | 0 | 0 | 0/5 | 22399 | proxy | 18 |
| The Hall of Minutes 33 | hacker | Normal | 3.5 | 281 | 0 | 0/5 | 36306 | director | 18 |
| The Hall of Minutes 33 | hacker | Hard | 4.2 | 798 | 0 | 0/5 | 52281 | director | 18 |
| The Hall of Minutes 33 | hacker | Brutal | 6.3 | 1350 | 0 | 0/5 | 77188 | director | 18 |
| The Nine Chairs 36 | hacker | Normal | 2.5 | 19 | 0 | 0/5 | 34360 | director | 39 |
| The Nine Chairs 36 | hacker | Hard | 3 | 0 | 0 | 0/5 | 49479 | director | 39 |
| The Nine Chairs 36 | hacker | Brutal | 5 | 1509 | 0 | 0/5 | 72258 | director | 39 |
| Rack Nine 39 | hacker | Normal | 0.7 | 0 | 0 | 0/5 | 18281 | proxy | 39 |
| Rack Nine 39 | hacker | Hard | 0.7 | 274 | 0 | 0/5 | 26325 | proxy | 39 |
| Rack Nine 39 | hacker | Brutal | 0.7 | 0 | 0 | 0/5 | 38025 | proxy | 39 |
| Still Water 42 | hacker | Normal | 25 | 1476 | 0 | 1/1 | 423671 | boss3 | 21 |
| Still Water 42 | hacker | Hard | 25 | 2551 | 0 | 1/1 | 610087 | boss3 | 21 |
| Still Water 42 | hacker | Brutal | 18.5 | 3626 | 1 | 1/1 | 881236 | boss3 | 21 |
| The Agreeable Mile 45 | hacker | Normal | 1.6 | 406 | 0 | 0/5 | 45278 | wisher | 21 |
| The Agreeable Mile 45 | hacker | Hard | 1.6 | 346 | 0 | 0/5 | 65200 | wisher | 21 |
| The Agreeable Mile 45 | hacker | Brutal | 3.2 | 1243 | 0 | 0/5 | 94178 | wisher | 21 |
| The Sofa 48 | hacker | Normal | 0 | 0 | 0 | 0/5 | 33624 | lull | 21 |
| The Sofa 48 | hacker | Hard | 0.4 | 0 | 0 | 0/5 | 48418 | lull | 21 |
| The Sofa 48 | hacker | Brutal | 0.8 | 0 | 0 | 0/5 | 69937 | lull | 21 |
| Tomari 51 | hacker | Normal | 2 | 0 | 0 | 0/5 | 111775 | ctkr | 21 |
| Tomari 51 | hacker | Hard | 2.8 | 1097 | 0 | 0/5 | 162339 | ctkr | 21 |
| Tomari 51 | hacker | Brutal | 0.8 | 1768 | 1 | 5/5 | 234489 | ctkr | 21 |
| The List 54 | hacker | Normal | 1.5 | 0 | 0 | 0/5 | 69959 | wisher | 21 |
| The List 54 | hacker | Hard | 2 | 488 | 0 | 0/5 | 100741 | wisher | 21 |
| The List 54 | hacker | Brutal | 8.5 | 1477 | 0 | 0/5 | 145515 | wisher | 21 |
| The Kitchen Table 57 | hacker | Normal | 25 | 0 | 0 | 1/1 | 1091781 | boss4 | 21 |
| The Kitchen Table 57 | hacker | Hard | 25 | 0 | 0 | 1/1 | 1572164 | boss4 | 21 |
| The Kitchen Table 57 | hacker | Brutal | 25 | 2908 | 0 | 1/1 | 2270904 | boss4 | 21 |
| Block 137,209 60 | hacker | Normal | 0.7 | 0 | 0 | 0/5 | 77820 | orphan | 41 |
| Block 137,209 60 | hacker | Hard | 0.7 | 972 | 1 | 5/5 | 112061 | orphan | 41 |
| Block 137,209 60 | hacker | Brutal | 1.4 | 1649 | 1 | 4/5 | 161866 | orphan | 41 |
| The Mempool 63 | hacker | Normal | 0.8 | 0 | 0 | 0/5 | 67610 | sniper | 20 |
| The Mempool 63 | hacker | Hard | 1.2 | 0 | 0 | 0/5 | 97358 | sniper | 20 |
| The Mempool 63 | hacker | Brutal | 1.6 | 469 | 0 | 0/5 | 140628 | sniper | 20 |
| The Paper Vaults 66 | hacker | Normal | 3.2 | 373 | 0 | 0/5 | 287478 | custod | 20 |
| The Paper Vaults 66 | hacker | Hard | 1.2 | 1111 | 1 | 5/5 | 413968 | custod | 20 |
| The Paper Vaults 66 | hacker | Brutal | 0.7 | 1611 | 1 | 5/5 | 597954 | custod | 20 |
| Ninety-Three Blocks 69 | hacker | Normal | 2.4 | 0 | 0 | 0/5 | 128576 | valid | 20 |
| Ninety-Three Blocks 69 | hacker | Hard | 2.7 | 417 | 0 | 0/5 | 185149 | valid | 20 |
| Ninety-Three Blocks 69 | hacker | Brutal | 2 | 927 | 1 | 5/5 | 267438 | valid | 20 |
| The Room 72 | hacker | Normal | 25 | 1503 | 0 | 1/1 | 2182907 | boss5 | 20 |
| The Room 72 | hacker | Hard | 22 | 3929 | 1 | 1/1 | 3143386 | boss5 | 20 |
| The Room 72 | hacker | Brutal | 3.4 | 1540 | 1 | 1/1 | 4540446 | boss5 | 20 |
| The Vestibule 30 | courier | Normal | 2.4 | 510 | 0 | 0/5 | 17768 | proxy | 18 |
| The Vestibule 30 | courier | Hard | 2.5 | 499 | 0 | 0/5 | 25586 | proxy | 18 |
| The Vestibule 30 | courier | Brutal | 3.3 | 1138 | 0 | 0/5 | 36957 | proxy | 18 |
| The Hall of Minutes 33 | courier | Normal | 3.3 | 644 | 0 | 0/5 | 53888 | director | 18 |
| The Hall of Minutes 33 | courier | Hard | 4.2 | 2080 | 0 | 0/5 | 78394 | director | 18 |
| The Hall of Minutes 33 | courier | Brutal | 0.9 | 1381 | 1 | 5/5 | 114387 | director | 18 |
| The Nine Chairs 36 | courier | Normal | 4 | 792 | 0 | 0/5 | 28667 | director | 39 |
| The Nine Chairs 36 | courier | Hard | 4.9 | 760 | 0 | 0/5 | 41280 | director | 39 |
| The Nine Chairs 36 | courier | Brutal | 5.4 | 2709 | 1 | 3/5 | 60316 | director | 39 |
| Rack Nine 39 | courier | Normal | 1.3 | 334 | 0 | 0/5 | 15596 | proxy | 39 |
| Rack Nine 39 | courier | Hard | 1.3 | 1095 | 0 | 0/5 | 22458 | proxy | 39 |
| Rack Nine 39 | courier | Brutal | 2 | 2831 | 0 | 0/5 | 32439 | proxy | 39 |
| Still Water 42 | courier | Normal | 17.9 | 0 | 0 | 0/1 | 512153 | boss3 | 21 |
| Still Water 42 | courier | Hard | 25 | 477 | 0 | 2/1 | 772539 | boss3 | 21 |
| Still Water 42 | courier | Brutal | 25 | 1432 | 0 | 2/1 | 1115890 | boss3 | 21 |
| The Agreeable Mile 45 | courier | Normal | 0.8 | 0 | 0 | 0/5 | 37247 | wisher | 21 |
| The Agreeable Mile 45 | courier | Hard | 2.1 | 0 | 0 | 0/5 | 53635 | wisher | 21 |
| The Agreeable Mile 45 | courier | Brutal | 0 | 0 | 0 | 0/0 | 0 | wisher | 21 |
| The Sofa 48 | courier | Normal | 1.1 | 0 | 0 | 0/5 | 37992 | lull | 21 |
| The Sofa 48 | courier | Hard | 1 | 0 | 0 | 0/5 | 54708 | lull | 21 |
| The Sofa 48 | courier | Brutal | 2.5 | 0 | 0 | 0/5 | 79023 | lull | 21 |
| Tomari 51 | courier | Normal | 5.4 | 0 | 0 | 0/5 | 77841 | ctkr | 21 |
| Tomari 51 | courier | Hard | 7.4 | 1807 | 0 | 0/5 | 113109 | ctkr | 21 |
| Tomari 51 | courier | Brutal | 5.3 | 4078 | 1 | 3/5 | 163380 | ctkr | 21 |
| The List 54 | courier | Normal | 0.9 | 203 | 0 | 0/5 | 67921 | wisher | 21 |
| The List 54 | courier | Hard | 0.9 | 0 | 0 | 0/5 | 97807 | wisher | 21 |
| The List 54 | courier | Brutal | 0.9 | 0 | 0 | 0/5 | 141276 | wisher | 21 |
| The Kitchen Table 57 | courier | Normal | 19.6 | 4980 | 1 | 3/1 | 1705545 | boss4 | 21 |
| The Kitchen Table 57 | courier | Hard | 11.9 | 4980 | 1 | 2/1 | 2455985 | boss4 | 21 |
| The Kitchen Table 57 | courier | Brutal | 7.1 | 4375 | 1 | 1/1 | 3547534 | boss4 | 21 |
| Block 137,209 60 | courier | Normal | 1.4 | 128 | 0 | 0/5 | 83134 | orphan | 41 |
| Block 137,209 60 | courier | Hard | 1.9 | 123 | 0 | 0/5 | 119713 | orphan | 41 |
| Block 137,209 60 | courier | Brutal | 1.9 | 0 | 0 | 0/5 | 172919 | orphan | 41 |
| The Mempool 63 | courier | Normal | 1.6 | 183 | 0 | 0/5 | 118863 | sniper | 20 |
| The Mempool 63 | courier | Hard | 1.6 | 1083 | 0 | 0/5 | 171163 | sniper | 20 |
| The Mempool 63 | courier | Brutal | 1.2 | 2869 | 1 | 4/5 | 247235 | sniper | 20 |
| The Paper Vaults 66 | courier | Normal | 5.2 | 1182 | 0 | 0/5 | 189874 | custod | 20 |
| The Paper Vaults 66 | courier | Hard | 1 | 1313 | 1 | 5/5 | 273419 | custod | 20 |
| The Paper Vaults 66 | courier | Brutal | 0.4 | 1313 | 1 | 5/5 | 394938 | custod | 20 |
| Ninety-Three Blocks 69 | courier | Normal | 1.2 | 136 | 0 | 0/5 | 170122 | valid | 20 |
| Ninety-Three Blocks 69 | courier | Hard | 1.9 | 549 | 0 | 0/5 | 244976 | valid | 20 |
| Ninety-Three Blocks 69 | courier | Brutal | 2.9 | 492 | 0 | 0/5 | 353854 | valid | 20 |
| The Room 72 | courier | Normal | 25 | 0 | 0 | 2/1 | 2762346 | boss5 | 20 |
| The Room 72 | courier | Hard | 25 | 1154 | 0 | 2/1 | 3977778 | boss5 | 20 |
| The Room 72 | courier | Brutal | 19.8 | 2711 | 1 | 3/1 | 5745680 | boss5 | 20 |
| The Vestibule 30 | anon | Normal | 2.6 | 0 | 0 | 0/5 | 12975 | proxy | 18 |
| The Vestibule 30 | anon | Hard | 3 | 0 | 0 | 0/5 | 18684 | proxy | 18 |
| The Vestibule 30 | anon | Brutal | 3.5 | 0 | 0 | 0/5 | 26988 | proxy | 18 |
| The Hall of Minutes 33 | anon | Normal | 4.8 | 0 | 0 | 0/5 | 34579 | director | 18 |
| The Hall of Minutes 33 | anon | Hard | 8.3 | 673 | 0 | 0/5 | 49794 | director | 18 |
| The Hall of Minutes 33 | anon | Brutal | 5.2 | 2094 | 1 | 5/5 | 73533 | director | 18 |
| The Nine Chairs 36 | anon | Normal | 3.2 | 0 | 0 | 0/5 | 38927 | director | 39 |
| The Nine Chairs 36 | anon | Hard | 6.4 | 0 | 0 | 0/5 | 56656 | director | 39 |
| The Nine Chairs 36 | anon | Brutal | 4.6 | 1921 | 1 | 5/5 | 82707 | director | 39 |
| Rack Nine 39 | anon | Normal | 2.4 | 0 | 0 | 0/5 | 15262 | proxy | 39 |
| Rack Nine 39 | anon | Hard | 2.7 | 0 | 0 | 0/5 | 21977 | proxy | 39 |
| Rack Nine 39 | anon | Brutal | 3.4 | 0 | 0 | 0/5 | 31744 | proxy | 39 |
| Still Water 42 | anon | Normal | 25 | 16 | 0 | 2/1 | 388216 | boss3 | 21 |
| Still Water 42 | anon | Hard | 25 | 1084 | 0 | 3/1 | 559031 | boss3 | 21 |
| Still Water 42 | anon | Brutal | 25 | 1926 | 0 | 1/1 | 807489 | boss3 | 21 |
| The Agreeable Mile 45 | anon | Normal | 5.2 | 0 | 0 | 0/5 | 42536 | wisher | 21 |
| The Agreeable Mile 45 | anon | Hard | 6.5 | 1042 | 0 | 0/5 | 61253 | wisher | 21 |
| The Agreeable Mile 45 | anon | Brutal | 6.6 | 3629 | 1 | 3/5 | 88476 | wisher | 21 |
| The Sofa 48 | anon | Normal | 2.2 | 0 | 0 | 0/5 | 16929 | lull | 21 |
| The Sofa 48 | anon | Hard | 3 | 416 | 0 | 0/5 | 24378 | lull | 21 |
| The Sofa 48 | anon | Brutal | 3 | 842 | 0 | 0/5 | 35212 | lull | 21 |
| Tomari 51 | anon | Normal | 13.6 | 3185 | 0 | 0/5 | 146220 | ctkr | 21 |
| Tomari 51 | anon | Hard | 5 | 3259 | 1 | 5/5 | 210557 | ctkr | 21 |
| Tomari 51 | anon | Brutal | 4.3 | 2011 | 1 | 10/5 | 304138 | ctkr | 21 |
| The List 54 | anon | Normal | 7.5 | 789 | 0 | 0/5 | 64866 | wisher | 21 |
| The List 54 | anon | Hard | 7 | 1147 | 0 | 0/5 | 93406 | wisher | 21 |
| The List 54 | anon | Brutal | 2.8 | 4714 | 1 | 5/5 | 134920 | wisher | 21 |
| The Kitchen Table 57 | anon | Normal | 25 | 1354 | 0 | 1/1 | 1026394 | boss4 | 21 |
| The Kitchen Table 57 | anon | Hard | 25 | 2139 | 0 | 2/1 | 1478007 | boss4 | 21 |
| The Kitchen Table 57 | anon | Brutal | 11.4 | 2700 | 1 | 2/1 | 2134899 | boss4 | 21 |
| Block 137,209 60 | anon | Normal | 3 | 0 | 0 | 0/5 | 42444 | orphan | 41 |
| Block 137,209 60 | anon | Hard | 3.3 | 0 | 0 | 0/5 | 61120 | orphan | 41 |
| Block 137,209 60 | anon | Brutal | 3.3 | 0 | 0 | 0/5 | 88284 | orphan | 41 |
| The Mempool 63 | anon | Normal | 3 | 0 | 0 | 0/5 | 73329 | sniper | 20 |
| The Mempool 63 | anon | Hard | 6.6 | 2724 | 0 | 0/5 | 105593 | sniper | 20 |
| The Mempool 63 | anon | Brutal | 4 | 1400 | 1 | 5/5 | 152524 | sniper | 20 |
| The Paper Vaults 66 | anon | Normal | 11.8 | 41 | 0 | 0/5 | 248612 | custod | 20 |
| The Paper Vaults 66 | anon | Hard | 16 | 1870 | 0 | 1/5 | 358002 | custod | 20 |
| The Paper Vaults 66 | anon | Brutal | 5 | 3255 | 1 | 6/5 | 520931 | custod | 20 |
| Ninety-Three Blocks 69 | anon | Normal | 3 | 0 | 0 | 0/5 | 80164 | valid | 20 |
| Ninety-Three Blocks 69 | anon | Hard | 3.3 | 0 | 0 | 0/5 | 115437 | valid | 20 |
| Ninety-Three Blocks 69 | anon | Brutal | 4 | 1349 | 1 | 5/5 | 166742 | valid | 20 |
| The Room 72 | anon | Normal | 25 | 2639 | 0 | 1/1 | 2278972 | boss5 | 20 |
| The Room 72 | anon | Hard | 25 | 2962 | 0 | 2/1 | 3281720 | boss5 | 20 |
| The Room 72 | anon | Brutal | 6.3 | 3321 | 1 | 1/1 | 4740262 | boss5 | 20 |
| The Vestibule 30 | founder | Normal | 6.5 | 0 | 0 | 0/5 | 6274 | proxy | 18 |
| The Vestibule 30 | founder | Hard | 9 | 0 | 0 | 0/5 | 9034 | proxy | 18 |
| The Vestibule 30 | founder | Brutal | 12.3 | 0 | 0 | 0/5 | 13049 | proxy | 18 |
| The Hall of Minutes 33 | founder | Normal | 16 | 3741 | 0 | 5/5 | 15119 | director | 18 |
| The Hall of Minutes 33 | founder | Hard | 4.1 | 1210 | 1 | 11/5 | 21771 | director | 18 |
| The Hall of Minutes 33 | founder | Brutal | 4.1 | 1755 | 1 | 10/5 | 31447 | director | 18 |
| The Nine Chairs 36 | founder | Normal | 16 | 748 | 0 | 1/5 | 16862 | director | 39 |
| The Nine Chairs 36 | founder | Hard | 4.3 | 1663 | 1 | 7/5 | 24281 | director | 39 |
| The Nine Chairs 36 | founder | Brutal | 4.4 | 3160 | 1 | 7/5 | 35073 | director | 39 |
| Rack Nine 39 | founder | Normal | 6.6 | 94 | 0 | 0/5 | 20180 | proxy | 39 |
| Rack Nine 39 | founder | Hard | 4.7 | 0 | 0 | 0/5 | 29060 | proxy | 39 |
| Rack Nine 39 | founder | Brutal | 8.2 | 0 | 0 | 0/5 | 41975 | proxy | 39 |
| Still Water 42 | founder | Normal | 25 | 72 | 0 | 2/1 | 186141 | boss3 | 21 |
| Still Water 42 | founder | Hard | 25 | 106 | 0 | 1/1 | 268044 | boss3 | 21 |
| Still Water 42 | founder | Brutal | 25 | 983 | 0 | 2/1 | 387174 | boss3 | 21 |
| The Agreeable Mile 45 | founder | Normal | 8.5 | 19 | 0 | 0/5 | 23012 | wisher | 21 |
| The Agreeable Mile 45 | founder | Hard | 13.9 | 0 | 0 | 0/5 | 33138 | wisher | 21 |
| The Agreeable Mile 45 | founder | Brutal | 11.1 | 0 | 0 | 0/5 | 48387 | wisher | 21 |
| The Sofa 48 | founder | Normal | 4.5 | 448 | 0 | 0/5 | 10749 | lull | 21 |
| The Sofa 48 | founder | Hard | 5.6 | 237 | 0 | 0/5 | 15478 | lull | 21 |
| The Sofa 48 | founder | Brutal | 8.1 | 798 | 0 | 0/5 | 22358 | lull | 21 |
| Tomari 51 | founder | Normal | 13.2 | 0 | 0 | 0/5 | 53978 | ctkr | 21 |
| Tomari 51 | founder | Hard | 16 | 0 | 0 | 0/5 | 77728 | ctkr | 21 |
| Tomari 51 | founder | Brutal | 16 | 0 | 0 | 4/5 | 113376 | ctkr | 21 |
| The List 54 | founder | Normal | 6.3 | 170 | 0 | 0/5 | 28949 | wisher | 21 |
| The List 54 | founder | Hard | 5.1 | 0 | 0 | 0/5 | 41687 | wisher | 21 |
| The List 54 | founder | Brutal | 8.3 | 0 | 0 | 0/5 | 60214 | wisher | 21 |
| The Kitchen Table 57 | founder | Normal | 25 | 0 | 0 | 3/1 | 482944 | boss4 | 21 |
| The Kitchen Table 57 | founder | Hard | 25 | 196 | 0 | 2/1 | 695439 | boss4 | 21 |
| The Kitchen Table 57 | founder | Brutal | 25 | 1510 | 0 | 3/1 | 1004523 | boss4 | 21 |
| Block 137,209 60 | founder | Normal | 7.8 | 1503 | 0 | 0/5 | 41739 | orphan | 41 |
| Block 137,209 60 | founder | Hard | 10.6 | 1688 | 0 | 0/5 | 60104 | orphan | 41 |
| Block 137,209 60 | founder | Brutal | 13.3 | 1500 | 0 | 0/5 | 86817 | orphan | 41 |
| The Mempool 63 | founder | Normal | 7.1 | 1785 | 0 | 0/5 | 25227 | sniper | 20 |
| The Mempool 63 | founder | Hard | 5.4 | 0 | 0 | 0/5 | 36327 | sniper | 20 |
| The Mempool 63 | founder | Brutal | 4.5 | 0 | 0 | 0/5 | 52472 | sniper | 20 |
| The Paper Vaults 66 | founder | Normal | 11.1 | 0 | 0 | 0/5 | 57053 | custod | 20 |
| The Paper Vaults 66 | founder | Hard | 13.9 | 0 | 0 | 0/5 | 82156 | custod | 20 |
| The Paper Vaults 66 | founder | Brutal | 16 | 0 | 0 | 4/5 | 121237 | custod | 20 |
| Ninety-Three Blocks 69 | founder | Normal | 3.5 | 0 | 0 | 0/5 | 31676 | valid | 20 |
| Ninety-Three Blocks 69 | founder | Hard | 2 | 0 | 0 | 0/5 | 45613 | valid | 20 |
| Ninety-Three Blocks 69 | founder | Brutal | 2.7 | 0 | 0 | 0/5 | 65886 | valid | 20 |
| The Room 72 | founder | Normal | 25 | 1917 | 0 | 2/1 | 538580 | boss5 | 20 |
| The Room 72 | founder | Hard | 24.6 | 2597 | 0 | 0/1 | 775554 | boss5 | 20 |
| The Room 72 | founder | Brutal | 25 | 3918 | 0 | 2/1 | 1282407 | boss5 | 20 |
| The Vestibule 30 | homesteader | Normal | 4 | 831 | 0 | 0/5 | 9919 | proxy | 18 |
| The Vestibule 30 | homesteader | Hard | 5 | 732 | 0 | 0/5 | 14284 | proxy | 18 |
| The Vestibule 30 | homesteader | Brutal | 4 | 6016 | 1 | 5/5 | 20898 | proxy | 18 |
| The Hall of Minutes 33 | homesteader | Normal | 6.3 | 3032 | 0 | 0/5 | 15119 | director | 18 |
| The Hall of Minutes 33 | homesteader | Hard | 7.7 | 4388 | 0 | 0/5 | 21771 | director | 18 |
| The Hall of Minutes 33 | homesteader | Brutal | 4.8 | 6013 | 1 | 5/5 | 33848 | director | 18 |
| The Nine Chairs 36 | homesteader | Normal | 4.8 | 0 | 0 | 0/5 | 20001 | director | 39 |
| The Nine Chairs 36 | homesteader | Hard | 7.1 | 2928 | 0 | 0/5 | 29173 | director | 39 |
| The Nine Chairs 36 | homesteader | Brutal | 9 | 5910 | 0 | 0/5 | 42680 | director | 39 |
| Rack Nine 39 | homesteader | Normal | 6.1 | 794 | 0 | 0/5 | 14232 | proxy | 39 |
| Rack Nine 39 | homesteader | Hard | 7.5 | 4296 | 0 | 0/5 | 20495 | proxy | 39 |
| Rack Nine 39 | homesteader | Brutal | 11.2 | 4442 | 0 | 0/5 | 29603 | proxy | 39 |
| Still Water 42 | homesteader | Normal | 25 | 2855 | 0 | 1/1 | 162705 | boss3 | 21 |
| Still Water 42 | homesteader | Hard | 25 | 4838 | 0 | 1/1 | 234295 | boss3 | 21 |
| Still Water 42 | homesteader | Brutal | 25 | 7017 | 0 | 1/1 | 338426 | boss3 | 21 |
| The Agreeable Mile 45 | homesteader | Normal | 4.5 | 266 | 0 | 0/5 | 31984 | wisher | 21 |
| The Agreeable Mile 45 | homesteader | Hard | 5.6 | 1103 | 0 | 0/5 | 46058 | wisher | 21 |
| The Agreeable Mile 45 | homesteader | Brutal | 7.2 | 2615 | 0 | 0/5 | 66528 | wisher | 21 |
| The Sofa 48 | homesteader | Normal | 4.5 | 464 | 0 | 0/5 | 11069 | lull | 21 |
| The Sofa 48 | homesteader | Hard | 6 | 1621 | 0 | 0/5 | 15939 | lull | 21 |
| The Sofa 48 | homesteader | Brutal | 9 | 4471 | 0 | 0/5 | 23024 | lull | 21 |
| Tomari 51 | homesteader | Normal | 7 | 3291 | 0 | 0/5 | 57645 | ctkr | 21 |
| Tomari 51 | homesteader | Hard | 6.4 | 9021 | 1 | 4/5 | 83811 | ctkr | 21 |
| Tomari 51 | homesteader | Brutal | 2.5 | 4632 | 1 | 5/5 | 121060 | ctkr | 21 |
| The List 54 | homesteader | Normal | 10.4 | 870 | 0 | 0/5 | 51927 | wisher | 21 |
| The List 54 | homesteader | Hard | 8.2 | 994 | 0 | 0/5 | 74775 | wisher | 21 |
| The List 54 | homesteader | Brutal | 9.1 | 4856 | 0 | 0/5 | 108955 | wisher | 21 |
| The Kitchen Table 57 | homesteader | Normal | 25 | 0 | 0 | 1/1 | 526562 | boss4 | 21 |
| The Kitchen Table 57 | homesteader | Hard | 25 | 1885 | 0 | 1/1 | 758250 | boss4 | 21 |
| The Kitchen Table 57 | homesteader | Brutal | 25 | 7728 | 0 | 1/1 | 1095249 | boss4 | 21 |
| Block 137,209 60 | homesteader | Normal | 4.5 | 1619 | 0 | 0/5 | 22369 | orphan | 41 |
| Block 137,209 60 | homesteader | Hard | 6.1 | 3375 | 0 | 0/5 | 32211 | orphan | 41 |
| Block 137,209 60 | homesteader | Brutal | 7.7 | 4443 | 0 | 0/5 | 46527 | orphan | 41 |
| The Mempool 63 | homesteader | Normal | 6.1 | 5723 | 0 | 0/5 | 30719 | sniper | 20 |
| The Mempool 63 | homesteader | Hard | 6.4 | 9742 | 1 | 4/5 | 44236 | sniper | 20 |
| The Mempool 63 | homesteader | Brutal | 3.4 | 9742 | 1 | 5/5 | 63897 | sniper | 20 |
| The Paper Vaults 66 | homesteader | Normal | 8.7 | 4155 | 0 | 0/5 | 112096 | custod | 20 |
| The Paper Vaults 66 | homesteader | Hard | 3 | 8590 | 1 | 5/5 | 162744 | custod | 20 |
| The Paper Vaults 66 | homesteader | Brutal | 2.1 | 5848 | 1 | 5/5 | 235075 | custod | 20 |
| Ninety-Three Blocks 69 | homesteader | Normal | 8.5 | 2301 | 0 | 0/5 | 36523 | valid | 20 |
| Ninety-Three Blocks 69 | homesteader | Hard | 12.2 | 6849 | 0 | 0/5 | 52593 | valid | 20 |
| Ninety-Three Blocks 69 | homesteader | Brutal | 10.2 | 10401 | 1 | 4/5 | 75968 | valid | 20 |
| The Room 72 | homesteader | Normal | 25 | 2404 | 0 | 3/1 | 873730 | boss5 | 20 |
| The Room 72 | homesteader | Hard | 25 | 7994 | 0 | 3/1 | 1258171 | boss5 | 20 |
| The Room 72 | homesteader | Brutal | 21.8 | 10630 | 1 | 2/1 | 1817359 | boss5 | 20 |
| The Vestibule 30 | witness | Normal | 10.4 | 1301 | 0 | 0/5 | 6274 | proxy | 18 |
| The Vestibule 30 | witness | Hard | 13.9 | 3206 | 0 | 0/5 | 9034 | proxy | 18 |
| The Vestibule 30 | witness | Brutal | 8.7 | 4681 | 1 | 5/5 | 13049 | proxy | 18 |
| The Hall of Minutes 33 | witness | Normal | 12.8 | 6242 | 1 | 2/5 | 18173 | director | 18 |
| The Hall of Minutes 33 | witness | Hard | 6.3 | 6242 | 1 | 6/5 | 26168 | director | 18 |
| The Hall of Minutes 33 | witness | Brutal | 4.7 | 6242 | 1 | 5/5 | 37799 | director | 18 |
| The Nine Chairs 36 | witness | Normal | 8.5 | 5006 | 1 | 6/5 | 16862 | director | 39 |
| The Nine Chairs 36 | witness | Hard | 7.6 | 5006 | 1 | 5/5 | 24281 | director | 39 |
| The Nine Chairs 36 | witness | Brutal | 3.5 | 5006 | 1 | 5/5 | 35073 | director | 39 |
| Rack Nine 39 | witness | Normal | 4.7 | 2783 | 0 | 0/5 | 14152 | proxy | 39 |
| Rack Nine 39 | witness | Hard | 10.8 | 7089 | 0 | 0/5 | 20379 | proxy | 39 |
| Rack Nine 39 | witness | Brutal | 4.4 | 7130 | 1 | 5/5 | 29437 | proxy | 39 |
| Still Water 42 | witness | Normal | 25 | 5717 | 0 | 3/1 | 162705 | boss3 | 21 |
| Still Water 42 | witness | Hard | 23.8 | 7944 | 1 | 2/1 | 234295 | boss3 | 21 |
| Still Water 42 | witness | Brutal | 15.9 | 7944 | 1 | 1/1 | 338426 | boss3 | 21 |
| The Agreeable Mile 45 | witness | Normal | 16 | 5321 | 0 | 1/5 | 17736 | wisher | 21 |
| The Agreeable Mile 45 | witness | Hard | 15.9 | 8673 | 1 | 2/5 | 25540 | wisher | 21 |
| The Agreeable Mile 45 | witness | Brutal | 7.1 | 8673 | 1 | 5/5 | 36891 | wisher | 21 |
| The Sofa 48 | witness | Normal | 16 | 2084 | 0 | 1/5 | 12392 | lull | 21 |
| The Sofa 48 | witness | Hard | 16 | 4332 | 0 | 2/5 | 17844 | lull | 21 |
| The Sofa 48 | witness | Brutal | 14.7 | 7789 | 1 | 3/5 | 25775 | lull | 21 |
| Tomari 51 | witness | Normal | 9.6 | 7589 | 1 | 5/5 | 40790 | ctkr | 21 |
| Tomari 51 | witness | Hard | 5 | 7589 | 1 | 5/5 | 58737 | ctkr | 21 |
| Tomari 51 | witness | Brutal | 3.6 | 7589 | 1 | 5/5 | 84842 | ctkr | 21 |
| The List 54 | witness | Normal | 16 | 3284 | 0 | 2/5 | 21083 | wisher | 21 |
| The List 54 | witness | Hard | 16 | 6722 | 0 | 3/5 | 30359 | wisher | 21 |
| The List 54 | witness | Brutal | 9.6 | 7160 | 1 | 5/5 | 43852 | wisher | 21 |
| The Kitchen Table 57 | witness | Normal | 25 | 8685 | 0 | 3/1 | 309688 | boss4 | 21 |
| The Kitchen Table 57 | witness | Hard | 16.5 | 8895 | 1 | 2/1 | 445950 | boss4 | 21 |
| The Kitchen Table 57 | witness | Brutal | 9.2 | 8895 | 1 | 2/1 | 644150 | boss4 | 21 |
| Block 137,209 60 | witness | Normal | 13.6 | 9365 | 1 | 1/5 | 18481 | orphan | 41 |
| Block 137,209 60 | witness | Hard | ERR dying | | | | | |
| Block 137,209 60 | witness | Brutal | 3.6 | 9365 | 1 | 5/5 | 38440 | orphan | 41 |
| The Mempool 63 | witness | Normal | 7.5 | 2066 | 0 | 0/5 | 43687 | sniper | 20 |
| The Mempool 63 | witness | Hard | 9.8 | 9627 | 1 | 4/5 | 62909 | sniper | 20 |
| The Mempool 63 | witness | Brutal | 4.3 | 9627 | 1 | 5/5 | 90868 | sniper | 20 |
| The Paper Vaults 66 | witness | Normal | 7 | 8532 | 1 | 5/5 | 73513 | custod | 20 |
| The Paper Vaults 66 | witness | Hard | 4.4 | 8532 | 1 | 5/5 | 105859 | custod | 20 |
| The Paper Vaults 66 | witness | Brutal | 2.8 | 8532 | 1 | 5/5 | 152908 | custod | 20 |
| Ninety-Three Blocks 69 | witness | Normal | 9.8 | 2323 | 0 | 0/5 | 47499 | valid | 20 |
| Ninety-Three Blocks 69 | witness | Hard | 7.6 | 7729 | 1 | 5/5 | 68398 | valid | 20 |
| Ninety-Three Blocks 69 | witness | Brutal | 0.5 | 2089 | 1 | 5/5 | 98797 | valid | 20 |
| The Room 72 | witness | Normal | 21 | 8665 | 1 | 3/1 | 1115350 | boss5 | 20 |
| The Room 72 | witness | Hard | 15.1 | 8665 | 1 | 2/1 | 1606103 | boss5 | 20 |
| The Room 72 | witness | Brutal | 10.6 | 8665 | 1 | 2/1 | 2319927 | boss5 | 20 |
| The Vestibule 30 | maxi | Normal | 2.7 | 957 | 0 | 0/5 | 12393 | proxy | 18 |
| The Vestibule 30 | maxi | Hard | 3.7 | 1970 | 0 | 0/5 | 17846 | proxy | 18 |
| The Vestibule 30 | maxi | Brutal | 3.1 | 3430 | 1 | 5/5 | 25777 | proxy | 18 |
| The Hall of Minutes 33 | maxi | Normal | 11.5 | 521 | 0 | 0/5 | 45334 | director | 18 |
| The Hall of Minutes 33 | maxi | Hard | 7.1 | 3719 | 1 | 5/5 | 65970 | director | 18 |
| The Hall of Minutes 33 | maxi | Brutal | 4.1 | 3266 | 1 | 11/5 | 95290 | director | 18 |
| The Nine Chairs 36 | maxi | Normal | 6.8 | 4503 | 1 | 2/5 | 30176 | director | 39 |
| The Nine Chairs 36 | maxi | Hard | 4.1 | 4558 | 1 | 10/5 | 43948 | director | 39 |
| The Nine Chairs 36 | maxi | Brutal | 3.6 | 4558 | 1 | 5/5 | 63480 | director | 39 |
| Rack Nine 39 | maxi | Normal | 2.4 | 1025 | 0 | 0/5 | 19784 | proxy | 39 |
| Rack Nine 39 | maxi | Hard | 3.6 | 2256 | 0 | 0/5 | 28489 | proxy | 39 |
| Rack Nine 39 | maxi | Brutal | 3 | 4070 | 1 | 5/5 | 41151 | proxy | 39 |
| Still Water 42 | maxi | Normal | 25 | 842 | 0 | 1/1 | 293250 | boss3 | 21 |
| Still Water 42 | maxi | Hard | 25 | 2470 | 0 | 2/1 | 422280 | boss3 | 21 |
| Still Water 42 | maxi | Brutal | 19.6 | 5931 | 1 | 3/1 | 609960 | boss3 | 21 |
| The Agreeable Mile 45 | maxi | Normal | 15 | 2762 | 0 | 0/5 | 32476 | wisher | 21 |
| The Agreeable Mile 45 | maxi | Hard | 13.6 | 4484 | 1 | 3/5 | 46765 | wisher | 21 |
| The Agreeable Mile 45 | maxi | Brutal | 8.2 | 4484 | 1 | 4/5 | 67550 | wisher | 21 |
| The Sofa 48 | maxi | Normal | 6.5 | 651 | 0 | 0/5 | 28832 | lull | 21 |
| The Sofa 48 | maxi | Hard | 16 | 2584 | 0 | 2/5 | 41518 | lull | 21 |
| The Sofa 48 | maxi | Brutal | 16 | 4727 | 0 | 1/5 | 60503 | lull | 21 |
| Tomari 51 | maxi | Normal | 6.7 | 5976 | 1 | 5/5 | 83699 | ctkr | 21 |
| Tomari 51 | maxi | Hard | 1 | 2342 | 1 | 5/5 | 120527 | ctkr | 21 |
| Tomari 51 | maxi | Brutal | 1.3 | 3795 | 1 | 5/5 | 174094 | ctkr | 21 |
| The List 54 | maxi | Normal | 13.5 | 3239 | 0 | 0/5 | 76466 | wisher | 21 |
| The List 54 | maxi | Hard | 13.5 | 5236 | 1 | 3/5 | 110111 | wisher | 21 |
| The List 54 | maxi | Brutal | 12.8 | 5236 | 1 | 4/5 | 159050 | wisher | 21 |
| The Kitchen Table 57 | maxi | Normal | 25 | 1497 | 0 | 2/1 | 1296279 | boss4 | 21 |
| The Kitchen Table 57 | maxi | Hard | 25 | 4358 | 0 | 2/1 | 1866641 | boss4 | 21 |
| The Kitchen Table 57 | maxi | Brutal | 16.4 | 5942 | 1 | 1/1 | 2696259 | boss4 | 21 |
| Block 137,209 60 | maxi | Normal | 1.5 | 1112 | 0 | 0/5 | 55878 | orphan | 41 |
| Block 137,209 60 | maxi | Hard | 3 | 2670 | 0 | 0/5 | 80464 | orphan | 41 |
| Block 137,209 60 | maxi | Brutal | 0.5 | 1786 | 1 | 5/5 | 116226 | orphan | 41 |
| The Mempool 63 | maxi | Normal | 3.6 | 2840 | 0 | 0/5 | 95596 | sniper | 20 |
| The Mempool 63 | maxi | Hard | 5.2 | 5759 | 0 | 0/5 | 137658 | sniper | 20 |
| The Mempool 63 | maxi | Brutal | 3.2 | 7015 | 1 | 5/5 | 198840 | sniper | 20 |
| The Paper Vaults 66 | maxi | Normal | 16 | 5854 | 0 | 1/5 | 190968 | custod | 20 |
| The Paper Vaults 66 | maxi | Hard | 8 | 7148 | 1 | 5/5 | 274994 | custod | 20 |
| The Paper Vaults 66 | maxi | Brutal | 3.9 | 7200 | 1 | 5/5 | 400228 | custod | 20 |
| Ninety-Three Blocks 69 | maxi | Normal | 3.2 | 1284 | 0 | 0/5 | 100452 | valid | 20 |
| Ninety-Three Blocks 69 | maxi | Hard | 7.8 | 5783 | 1 | 2/5 | 144650 | valid | 20 |
| Ninety-Three Blocks 69 | maxi | Brutal | 5.4 | 5783 | 1 | 3/5 | 208940 | valid | 20 |
| The Room 72 | maxi | Normal | 25 | 4566 | 0 | 1/1 | 1625841 | boss5 | 20 |
| The Room 72 | maxi | Hard | 22.3 | 7026 | 1 | 3/1 | 2341211 | boss5 | 20 |
| The Room 72 | maxi | Brutal | 12.4 | 7026 | 1 | 2/1 | 3381749 | boss5 | 20 |

## Concerns a reader should check

- Died to the Normal pack: courier in The Kitchen Table 57 (19.6s, 4980 taken); witness in The Hall of Minutes 33 (12.8s, 6242 taken); witness in The Nine Chairs 36 (8.5s, 5006 taken); witness in Tomari 51 (9.6s, 7589 taken); witness in Block 137,209 60 (13.6s, 9365 taken); witness in The Paper Vaults 66 (7s, 8532 taken); witness in The Room 72 (21s, 8665 taken); maxi in The Nine Chairs 36 (6.8s, 4503 taken); maxi in Tomari 51 (6.7s, 5976 taken).
- Died to the Brutal pack: scrapper in The Hall of Minutes 33; scrapper in Rack Nine 39; scrapper in The Mempool 63; scrapper in The Paper Vaults 66; scrapper in Ninety-Three Blocks 69; hacker in Still Water 42; hacker in Tomari 51; hacker in Block 137,209 60; hacker in The Paper Vaults 66; hacker in Ninety-Three Blocks 69; hacker in The Room 72; courier in The Hall of Minutes 33; courier in The Nine Chairs 36; courier in Tomari 51; courier in The Kitchen Table 57; courier in The Mempool 63; courier in The Paper Vaults 66; courier in The Room 72; anon in The Hall of Minutes 33; anon in The Nine Chairs 36; anon in The Agreeable Mile 45; anon in Tomari 51; anon in The List 54; anon in The Kitchen Table 57; anon in The Mempool 63; anon in The Paper Vaults 66; anon in Ninety-Three Blocks 69; anon in The Room 72; founder in The Hall of Minutes 33; founder in The Nine Chairs 36; homesteader in The Vestibule 30; homesteader in The Hall of Minutes 33; homesteader in Tomari 51; homesteader in The Mempool 63; homesteader in The Paper Vaults 66; homesteader in Ninety-Three Blocks 69; homesteader in The Room 72; witness in The Vestibule 30; witness in The Hall of Minutes 33; witness in The Nine Chairs 36; witness in Rack Nine 39; witness in Still Water 42; witness in The Agreeable Mile 45; witness in The Sofa 48; witness in Tomari 51; witness in The List 54; witness in The Kitchen Table 57; witness in Block 137,209 60; witness in The Mempool 63; witness in The Paper Vaults 66; witness in Ninety-Three Blocks 69; witness in The Room 72; maxi in The Vestibule 30; maxi in The Hall of Minutes 33; maxi in The Nine Chairs 36; maxi in Rack Nine 39; maxi in Still Water 42; maxi in The Agreeable Mile 45; maxi in Tomari 51; maxi in The List 54; maxi in The Kitchen Table 57; maxi in Block 137,209 60; maxi in The Mempool 63; maxi in The Paper Vaults 66; maxi in Ninety-Three Blocks 69; maxi in The Room 72.
- Slowest Normal trash clears still up at the cap: founder The Hall of Minutes 33 16s, 5 left; founder The Nine Chairs 36 16s, 1 left; witness The Agreeable Mile 45 16s, 1 left; witness The Sofa 48 16s, 1 left; witness The List 54 16s, 2 left.
- Largest Brutal/Normal time ratio: hacker The List 54 1.5s → 8.5s (×5.7); scrapper The Sofa 48 1.3s → 3.8s (×2.9); scrapper The Nine Chairs 36 4.5s → 12.5s (×2.8); maxi The Sofa 48 6.5s → 16s (×2.5).
