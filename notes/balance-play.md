# Acts III-V, played rather than walked into

**Run A.** The first sample taken with both the class fix (shapeShift costs
sats, so every hero before it was a scrapper) and the classifier fix ('mark' is
the commonest kind in the game and was being filed as a self-buff). A second
run is being taken to see whether it reproduces; nothing here should be tuned
against until it does. Seven bugs in this harness so far have each produced a
clean, plausible report, so one clean run is not evidence.

What it appears to say, in order of how much I would trust it:

- **Normal is not a difficulty.** Zero deaths in 120 fights, against four
  consecutive waves. The clearest signal here by some distance.
- **Hard and Brutal are the same difficulty.** 53% and 50% deaths, 39 and 36
  full clears. Whatever Brutal multiplies is not landing as a step above Hard.
- **The classes are closer than they look.** 8 to 19 deaths out of 45 at the
  extremes, which is an ordinary spread rather than an alarming one.

Still not to be trusted: one sample per row, so no individual district row means
much, only the aggregates. The homesteader's 4.3 distinct skills is now the
lowest in the table -- its kit is blocked while it is wearing a chassis and the
pilot does not manage that deliberately, so read its rows as a floor, the way
the witness's were before its kit stopped being mis-filed.


`node tools/balance-play.js`. Same starting hero as `tools/balance.js` -- level matched
to the district, one identified rare in each of six slots, six stims, adaptive scaling
reset -- and a pilot that spends points and web nodes on level-up, picks skills by
situation, loots and re-gears between waves, stims, dodges telegraphs and kites if its
class does. 4 waves of 5 (bosses: 1), 70s cap, one sample each.

**Read the last four columns first.** Skills is how many distinct skills the hero cast.
If it is 1, the pilot fell back to one button and the rest of the row means nothing.
Levels, web and worn are how much progression actually happened.

| District | Class | Difficulty | Waves | Seconds | Damage taken | Died | Left | Skills | Casts | Levels | Web | Took/Wore |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| zone 12 | scrapper | Normal | 4/4 | 5.1 | 12 | 0 | 0 | 5 | 7 | 0 | 3 | 4/0 |
| zone 12 | scrapper | Hard | 4/4 | 21.1 | 4861 | 0 | 0 | 7 | 32 | 1 | 3 | 3/0 |
| zone 12 | scrapper | Brutal | 4/4 | 27.4 | 6507 | 0 | 0 | 5 | 37 | 1 | 3 | 1/0 |
| zone 13 | scrapper | Normal | 2/4 | 70 | 550 | 0 | 2 | 5 | 22 | 0 | 3 | 4/1 |
| zone 13 | scrapper | Hard | 0/4 | 5.8 | 7263 | 1 | 5 | 5 | 10 | 0 | 3 | 0/0 |
| zone 13 | scrapper | Brutal | 4/4 | 29 | 2158 | 0 | 0 | 7 | 47 | 1 | 3 | 7/0 |
| zone 14 | scrapper | Normal | 1/4 | 70 | 1153 | 0 | 1 | 6 | 62 | 0 | 3 | 0/1 |
| zone 14 | scrapper | Hard | 4/4 | 14.4 | 1296 | 0 | 0 | 7 | 25 | 2 | 3 | 0/0 |
| zone 14 | scrapper | Brutal | 0/4 | 2.2 | 3565 | 1 | 5 | 5 | 6 | 0 | 3 | 0/0 |
| zone 15 | scrapper | Normal | 4/4 | 2.9 | 8 | 0 | 0 | 5 | 7 | 0 | 3 | 0/1 |
| zone 15 | scrapper | Hard | 4/4 | 16.6 | 6943 | 0 | 0 | 7 | 31 | 0 | 3 | 0/1 |
| zone 15 | scrapper | Brutal | 0/4 | 7.5 | 10325 | 1 | 5 | 5 | 10 | 0 | 3 | 0/0 |
| zone 22 | scrapper | Normal | 4/4 | 5.4 | 23 | 0 | 0 | 7 | 13 | 0 | 3 | 0/1 |
| zone 22 | scrapper | Hard | 4/4 | 11.9 | 2881 | 0 | 0 | 7 | 19 | 1 | 3 | 0/2 |
| zone 22 | scrapper | Brutal | 4/4 | 32.7 | 8713 | 0 | 0 | 7 | 48 | 1 | 3 | 0/1 |
| zone 23 | scrapper | Normal | 0/4 | 70 | 898 | 0 | 3 | 5 | 7 | 0 | 3 | 0/0 |
| zone 23 | scrapper | Hard | 0/4 | 20.2 | 12855 | 1 | 5 | 5 | 7 | 0 | 3 | 0/0 |
| zone 23 | scrapper | Brutal | 4/4 | 8.4 | 819 | 0 | 0 | 7 | 20 | 1 | 3 | 0/1 |
| zone 24 | scrapper | Normal | 4/4 | 9.7 | 390 | 0 | 0 | 8 | 16 | 0 | 3 | 0/0 |
| zone 24 | scrapper | Hard | 0/4 | 18.2 | 12160 | 1 | 5 | 6 | 31 | 0 | 3 | 0/0 |
| zone 24 | scrapper | Brutal | 4/4 | 36.6 | 10161 | 0 | 0 | 8 | 57 | 0 | 3 | 0/1 |
| zone 25 | scrapper | Normal | 4/4 | 3.5 | 46 | 0 | 0 | 6 | 9 | 0 | 3 | 0/0 |
| zone 25 | scrapper | Hard | 0/4 | 27.7 | 16435 | 1 | 5 | 6 | 29 | 0 | 3 | 0/0 |
| zone 25 | scrapper | Brutal | 0/4 | 41.6 | 13869 | 1 | 5 | 6 | 44 | 0 | 3 | 0/0 |
| zone 28 | scrapper | Normal | 4/4 | 8.2 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0/0 |
| zone 28 | scrapper | Hard | 2/4 | 9.8 | 10698 | 1 | 5 | 6 | 16 | 0 | 3 | 0/0 |
| zone 28 | scrapper | Brutal | 4/4 | 33.1 | 19381 | 0 | 0 | 6 | 44 | 0 | 3 | 0/1 |
| zone 29 | scrapper | Normal | 4/4 | 2.5 | 109 | 0 | 0 | 6 | 8 | 0 | 3 | 0/0 |
| zone 29 | scrapper | Hard | 0/4 | 10.4 | 16189 | 1 | 5 | 6 | 13 | 0 | 3 | 0/0 |
| zone 29 | scrapper | Brutal | 4/4 | 8.2 | 522 | 0 | 0 | 6 | 18 | 1 | 3 | 0/0 |
| zone 30 | scrapper | Normal | 1/4 | 70 | 8743 | 0 | 1 | 8 | 9 | 0 | 3 | 0/1 |
| zone 30 | scrapper | Hard | 0/4 | 14.3 | 14633 | 1 | 5 | 6 | 22 | 0 | 3 | 0/0 |
| zone 30 | scrapper | Brutal | 4/4 | 27.1 | 3383 | 0 | 0 | 6 | 36 | 0 | 3 | 0/1 |
| zone 31 | scrapper | Normal | 4/4 | 21.1 | 511 | 0 | 0 | 6 | 32 | 0 | 3 | 0/1 |
| zone 31 | scrapper | Hard | 0/4 | 22.6 | 19899 | 1 | 5 | 6 | 28 | 0 | 3 | 0/0 |
| zone 31 | scrapper | Brutal | 4/4 | 7 | 1502 | 0 | 0 | 6 | 11 | 1 | 3 | 0/1 |
| zone 16 | scrapper | Normal | 0/4 | 70 | 221 | 0 | 1 | 5 | 49 | 0 | 3 | 0/0 |
| zone 16 | scrapper | Hard | 0/4 | 48.8 | 10419 | 1 | 1 | 3 | 13 | 0 | 3 | 0/0 |
| zone 16 | scrapper | Brutal | 0/4 | 70 | 173 | 0 | 1 | 3 | 7 | 0 | 3 | 0/0 |
| zone 26 | scrapper | Normal | 1/4 | 70 | 116 | 0 | 1 | 4 | 7 | 0 | 3 | 0/1 |
| zone 26 | scrapper | Hard | 0/4 | 56.1 | 31099 | 1 | 1 | 6 | 44 | 0 | 3 | 0/0 |
| zone 26 | scrapper | Brutal | 0/4 | 70 | 9843 | 0 | 1 | 6 | 43 | 0 | 3 | 0/0 |
| zone 32 | scrapper | Normal | 1/4 | 70 | 75 | 0 | 1 | 4 | 9 | 0 | 3 | 0/0 |
| zone 32 | scrapper | Hard | — | — | — | — | — | — | — | — | — | setup |
| zone 32 | scrapper | Brutal | 0/4 | 22.4 | 18943 | 1 | 1 | 6 | 19 | 0 | 3 | 0/0 |
| zone 12 | hacker | Normal | 4/4 | 32.5 | 4174 | 0 | 0 | 7 | 54 | 1 | 3 | 0/2 |
| zone 12 | hacker | Hard | 0/4 | 2.7 | 972 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 12 | hacker | Brutal | 0/4 | 2.7 | 924 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 13 | hacker | Normal | 4/4 | 5.5 | 304 | 0 | 0 | 7 | 14 | 0 | 3 | 0/3 |
| zone 13 | hacker | Hard | 4/4 | 11.3 | 887 | 0 | 0 | 7 | 23 | 1 | 3 | 0/1 |
| zone 13 | hacker | Brutal | 0/4 | 2.5 | 1046 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 14 | hacker | Normal | 4/4 | 43.7 | 2011 | 0 | 0 | 7 | 75 | 0 | 3 | 0/1 |
| zone 14 | hacker | Hard | 0/4 | 7.2 | 3400 | 1 | 5 | 7 | 16 | 0 | 3 | 0/0 |
| zone 14 | hacker | Brutal | 0/4 | 2.5 | 1388 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 15 | hacker | Normal | 4/4 | 15.6 | 395 | 0 | 0 | 7 | 29 | 0 | 3 | 0/1 |
| zone 15 | hacker | Hard | 4/4 | 19.3 | 2029 | 0 | 0 | 7 | 37 | 0 | 3 | 0/1 |
| zone 15 | hacker | Brutal | 1/4 | 1 | 1237 | 1 | 3 | 7 | 7 | 0 | 3 | 0/0 |
| zone 22 | hacker | Normal | 4/4 | 65.6 | 986 | 0 | 0 | 7 | 108 | 0 | 3 | 0/2 |
| zone 22 | hacker | Hard | 0/4 | 2.6 | 1267 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 22 | hacker | Brutal | 0/4 | 13.3 | 5281 | 1 | 5 | 7 | 31 | 0 | 3 | 0/0 |
| zone 23 | hacker | Normal | 4/4 | 13.3 | 177 | 0 | 0 | 7 | 28 | 0 | 3 | 0/1 |
| zone 23 | hacker | Hard | 4/4 | 42.2 | 7389 | 0 | 0 | 7 | 78 | 0 | 3 | 0/1 |
| zone 23 | hacker | Brutal | 0/4 | 4.4 | 1699 | 1 | 5 | 7 | 11 | 0 | 3 | 0/0 |
| zone 24 | hacker | Normal | 4/4 | 65.3 | 0 | 0 | 0 | 7 | 122 | 0 | 3 | 0/3 |
| zone 24 | hacker | Hard | 4/4 | 3 | 467 | 0 | 0 | 7 | 9 | 1 | 3 | 0/1 |
| zone 24 | hacker | Brutal | 0/4 | 2.9 | 1423 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 25 | hacker | Normal | 4/4 | 3.6 | 0 | 0 | 0 | 7 | 11 | 0 | 3 | 0/2 |
| zone 25 | hacker | Hard | 4/4 | 13.9 | 612 | 0 | 0 | 7 | 26 | 1 | 3 | 0/2 |
| zone 25 | hacker | Brutal | 0/4 | 2.8 | 1640 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 28 | hacker | Normal | 4/4 | 21.7 | 0 | 0 | 0 | 7 | 39 | 0 | 3 | 0/2 |
| zone 28 | hacker | Hard | 4/4 | 2 | 0 | 0 | 0 | 7 | 9 | 0 | 3 | 0/1 |
| zone 28 | hacker | Brutal | 4/4 | 5.4 | 1800 | 0 | 0 | 7 | 14 | 0 | 3 | 0/2 |
| zone 29 | hacker | Normal | 4/4 | 27.5 | 0 | 0 | 0 | 7 | 49 | 0 | 3 | 0/1 |
| zone 29 | hacker | Hard | 0/4 | 3.6 | 2594 | 1 | 5 | 7 | 10 | 0 | 3 | 0/0 |
| zone 29 | hacker | Brutal | 4/4 | 3.5 | 0 | 0 | 0 | 7 | 10 | 0 | 3 | 0/1 |
| zone 30 | hacker | Normal | 4/4 | 1.6 | 0 | 0 | 0 | 7 | 8 | 0 | 3 | 0/3 |
| zone 30 | hacker | Hard | 0/4 | 5.1 | 4749 | 1 | 5 | 7 | 12 | 0 | 3 | 0/0 |
| zone 30 | hacker | Brutal | 0/4 | 4.2 | 2780 | 1 | 5 | 7 | 11 | 0 | 3 | 0/0 |
| zone 31 | hacker | Normal | 4/4 | 22 | 0 | 0 | 0 | 7 | 49 | 0 | 3 | 0/0 |
| zone 31 | hacker | Hard | 0/4 | 3.2 | 1891 | 1 | 5 | 7 | 10 | 0 | 3 | 0/0 |
| zone 31 | hacker | Brutal | 4/4 | 2.7 | 0 | 0 | 0 | 7 | 9 | 1 | 3 | 0/1 |
| zone 16 | hacker | Normal | 1/4 | 70 | 13 | 0 | 1 | 4 | 7 | 0 | 3 | 0/0 |
| zone 16 | hacker | Hard | 0/4 | 1.4 | 1186 | 1 | 1 | 4 | 4 | 0 | 3 | 0/0 |
| zone 16 | hacker | Brutal | 0/4 | 41.9 | 4444 | 1 | 1 | 4 | 56 | 0 | 3 | 0/0 |
| zone 26 | hacker | Normal | 0/4 | 70 | 0 | 0 | 1 | 4 | 91 | 0 | 3 | 0/0 |
| zone 26 | hacker | Hard | 0/4 | 70 | 7476 | 0 | 1 | 4 | 91 | 0 | 3 | 0/0 |
| zone 26 | hacker | Brutal | 0/4 | 42.6 | 7619 | 1 | 1 | 5 | 67 | 0 | 3 | 0/0 |
| zone 32 | hacker | Normal | 0/4 | 70 | 51 | 0 | 1 | 4 | 31 | 0 | 3 | 0/0 |
| zone 32 | hacker | Hard | 0/4 | 5.8 | 2957 | 1 | 1 | 4 | 9 | 0 | 3 | 0/0 |
| zone 32 | hacker | Brutal | 0/4 | 70 | 2688 | 0 | 1 | 4 | 186 | 0 | 3 | 0/0 |
| zone 12 | courier | Normal | 4/4 | 3 | 0 | 0 | 0 | 5 | 6 | 0 | 3 | 0/0 |
| zone 12 | courier | Hard | 0/4 | 5.1 | 2470 | 1 | 5 | 5 | 8 | 0 | 3 | 0/0 |
| zone 12 | courier | Brutal | 4/4 | 10.9 | 1218 | 0 | 0 | 5 | 13 | 1 | 3 | 0/0 |
| zone 13 | courier | Normal | 1/4 | 70 | 4871 | 0 | 5 | 5 | 41 | 0 | 3 | 0/0 |
| zone 13 | courier | Hard | 0/4 | 5.6 | 3560 | 1 | 5 | 5 | 8 | 0 | 3 | 0/0 |
| zone 13 | courier | Brutal | 1/4 | 8.8 | 4329 | 1 | 3 | 5 | 11 | 0 | 3 | 0/0 |
| zone 14 | courier | Normal | 4/4 | 2.7 | 0 | 0 | 0 | 5 | 6 | 0 | 3 | 0/0 |
| zone 14 | courier | Hard | 1/4 | 33.7 | 9131 | 1 | 4 | 5 | 27 | 0 | 3 | 0/0 |
| zone 14 | courier | Brutal | 0/4 | 11.1 | 4132 | 1 | 5 | 5 | 14 | 0 | 3 | 0/0 |
| zone 15 | courier | Normal | 4/4 | 2.4 | 0 | 0 | 0 | 5 | 6 | 0 | 3 | 0/0 |
| zone 15 | courier | Hard | 1/4 | 13 | 5054 | 1 | 5 | 5 | 13 | 0 | 3 | 0/0 |
| zone 15 | courier | Brutal | 4/4 | 10.8 | 1194 | 0 | 0 | 5 | 13 | 1 | 3 | 0/1 |
| zone 22 | courier | Normal | 4/4 | 3 | 6 | 0 | 0 | 5 | 7 | 0 | 3 | 0/1 |
| zone 22 | courier | Hard | 0/4 | 7 | 4999 | 1 | 5 | 5 | 8 | 0 | 3 | 0/0 |
| zone 22 | courier | Brutal | 4/4 | 10.4 | 2603 | 0 | 0 | 5 | 12 | 0 | 3 | 0/1 |
| zone 23 | courier | Normal | 4/4 | 2.9 | 51 | 0 | 0 | 5 | 6 | 0 | 3 | 0/0 |
| zone 23 | courier | Hard | 0/4 | 14.9 | 5256 | 1 | 5 | 5 | 7 | 0 | 3 | 0/0 |
| zone 23 | courier | Brutal | 4/4 | 32.6 | 4606 | 0 | 0 | 5 | 20 | 0 | 3 | 0/0 |
| zone 24 | courier | Normal | 4/4 | 3 | 0 | 0 | 0 | 8 | 9 | 0 | 3 | 0/2 |
| zone 24 | courier | Hard | 4/4 | 56.5 | 10796 | 0 | 0 | 8 | 74 | 1 | 3 | 0/1 |
| zone 24 | courier | Brutal | 0/4 | 3.6 | 2272 | 1 | 3 | 8 | 9 | 0 | 3 | 0/0 |
| zone 25 | courier | Normal | 4/4 | 7 | 33 | 0 | 0 | 8 | 13 | 0 | 3 | 0/0 |
| zone 25 | courier | Hard | 3/4 | 50.5 | 5694 | 1 | 3 | 8 | 62 | 0 | 3 | 0/0 |
| zone 25 | courier | Brutal | 0/4 | 13 | 5136 | 1 | 5 | 8 | 17 | 0 | 3 | 0/0 |
| zone 28 | courier | Normal | 4/4 | 13.7 | 98 | 0 | 0 | 8 | 22 | 0 | 3 | 0/1 |
| zone 28 | courier | Hard | 4/4 | 6.8 | 4513 | 0 | 0 | 8 | 18 | 0 | 3 | 0/1 |
| zone 28 | courier | Brutal | 0/4 | 4.7 | 1983 | 1 | 2 | 8 | 10 | 0 | 3 | 0/0 |
| zone 29 | courier | Normal | 4/4 | 8.8 | 231 | 0 | 0 | 8 | 16 | 0 | 3 | 0/2 |
| zone 29 | courier | Hard | 1/4 | 4.5 | 2263 | 1 | 2 | 8 | 10 | 0 | 3 | 0/0 |
| zone 29 | courier | Brutal | 4/4 | 2.2 | 0 | 0 | 0 | 8 | 9 | 1 | 3 | 0/0 |
| zone 30 | courier | Normal | 3/4 | 70 | 1345 | 0 | 1 | 8 | 91 | 0 | 3 | 0/1 |
| zone 30 | courier | Hard | 0/4 | 7.9 | 6526 | 1 | 5 | 8 | 13 | 0 | 3 | 0/0 |
| zone 30 | courier | Brutal | 4/4 | 8.6 | 2235 | 0 | 0 | 8 | 18 | 0 | 3 | 0/0 |
| zone 31 | courier | Normal | 4/4 | 26.1 | 260 | 0 | 0 | 8 | 42 | 0 | 3 | 0/0 |
| zone 31 | courier | Hard | 1/4 | 14 | 7528 | 1 | 5 | 8 | 28 | 0 | 3 | 0/0 |
| zone 31 | courier | Brutal | 0/4 | 25.1 | 8237 | 1 | 3 | 8 | 31 | 0 | 3 | 0/0 |
| zone 16 | courier | Normal | 0/4 | 70 | 740 | 0 | 1 | 3 | 22 | 0 | 3 | 0/0 |
| zone 16 | courier | Hard | 0/4 | 22.9 | 4897 | 1 | 1 | 3 | 8 | 0 | 3 | 0/0 |
| zone 16 | courier | Brutal | 0/4 | 70 | 2025 | 0 | 1 | 3 | 8 | 0 | 3 | 0/0 |
| zone 26 | courier | Normal | 0/4 | 70 | 4159 | 0 | 1 | 6 | 44 | 0 | 3 | 0/0 |
| zone 26 | courier | Hard | 0/4 | 23.8 | 5717 | 1 | 1 | 8 | 26 | 0 | 3 | 0/0 |
| zone 26 | courier | Brutal | 0/4 | 70 | 1201 | 0 | 1 | 5 | 22 | 0 | 3 | 0/0 |
| zone 32 | courier | Normal | 0/4 | 70 | 0 | 0 | 1 | 5 | 5 | 0 | 3 | 0/0 |
| zone 32 | courier | Hard | 0/4 | 21.5 | 7464 | 1 | 1 | 5 | 18 | 0 | 3 | 0/0 |
| zone 32 | courier | Brutal | 0/4 | 70 | 2760 | 0 | 1 | 5 | 14 | 0 | 3 | 0/0 |
| zone 12 | anon | Normal | 4/4 | 14.5 | 177 | 0 | 0 | 7 | 17 | 0 | 3 | 0/0 |
| zone 12 | anon | Hard | 4/4 | 24.8 | 5109 | 0 | 0 | 7 | 34 | 1 | 3 | 0/0 |
| zone 12 | anon | Brutal | 4/4 | 5.4 | 474 | 0 | 0 | 7 | 9 | 0 | 3 | 0/0 |
| zone 13 | anon | Normal | 4/4 | 1.5 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 13 | anon | Hard | 0/4 | 4.9 | 1565 | 1 | 5 | 7 | 9 | 0 | 3 | 0/0 |
| zone 13 | anon | Brutal | 4/4 | 3.4 | 0 | 0 | 0 | 7 | 8 | 1 | 3 | 0/1 |
| zone 14 | anon | Normal | 4/4 | 3.1 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 14 | anon | Hard | 4/4 | 8.8 | 3317 | 0 | 0 | 7 | 11 | 1 | 3 | 0/0 |
| zone 14 | anon | Brutal | 4/4 | 6.8 | 2762 | 0 | 0 | 7 | 11 | 1 | 3 | 0/0 |
| zone 15 | anon | Normal | 4/4 | 1.5 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 15 | anon | Hard | 4/4 | 3.1 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 15 | anon | Brutal | 0/4 | 8.1 | 5696 | 1 | 5 | 7 | 12 | 0 | 3 | 0/0 |
| zone 22 | anon | Normal | 4/4 | 38 | 188 | 0 | 0 | 7 | 15 | 0 | 3 | 0/2 |
| zone 22 | anon | Hard | 0/4 | 23.2 | 5870 | 1 | 1 | 5 | 5 | 0 | 3 | 0/0 |
| zone 22 | anon | Brutal | 4/4 | 31.5 | 2828 | 0 | 0 | 7 | 18 | 0 | 3 | 0/0 |
| zone 23 | anon | Normal | 4/4 | 0.7 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/2 |
| zone 23 | anon | Hard | 2/4 | 70 | 4694 | 0 | 1 | 7 | 10 | 1 | 3 | 0/0 |
| zone 23 | anon | Brutal | 4/4 | 14 | 4623 | 0 | 0 | 7 | 14 | 1 | 3 | 0/3 |
| zone 24 | anon | Normal | 4/4 | 1.1 | 0 | 0 | 0 | 9 | 9 | 0 | 3 | 0/1 |
| zone 24 | anon | Hard | 4/4 | 7.7 | 605 | 0 | 0 | 9 | 17 | 1 | 3 | 0/2 |
| zone 24 | anon | Brutal | 4/4 | 6.3 | 0 | 0 | 0 | 9 | 14 | 1 | 3 | 0/1 |
| zone 25 | anon | Normal | 4/4 | 3 | 20 | 0 | 0 | 9 | 9 | 0 | 3 | 0/0 |
| zone 25 | anon | Hard | 4/4 | 6.2 | 805 | 0 | 0 | 9 | 14 | 1 | 3 | 0/1 |
| zone 25 | anon | Brutal | 0/4 | 19.2 | 8014 | 1 | 5 | 9 | 23 | 0 | 3 | 0/0 |
| zone 28 | anon | Normal | 4/4 | 1.2 | 0 | 0 | 0 | 9 | 9 | 0 | 3 | 0/0 |
| zone 28 | anon | Hard | 4/4 | 6.2 | 2170 | 0 | 0 | 9 | 15 | 0 | 3 | 0/1 |
| zone 28 | anon | Brutal | 4/4 | 7.7 | 1245 | 0 | 0 | 9 | 12 | 0 | 3 | 0/0 |
| zone 29 | anon | Normal | 4/4 | 3 | 0 | 0 | 0 | 9 | 10 | 0 | 3 | 0/1 |
| zone 29 | anon | Hard | 4/4 | 7.5 | 0 | 0 | 0 | 9 | 15 | 1 | 3 | 0/0 |
| zone 29 | anon | Brutal | 0/4 | 5.6 | 3677 | 1 | 5 | 9 | 13 | 0 | 3 | 0/0 |
| zone 30 | anon | Normal | 4/4 | 43.6 | 34 | 0 | 0 | 9 | 31 | 0 | 3 | 0/0 |
| zone 30 | anon | Hard | 4/4 | 3.6 | 0 | 0 | 0 | 9 | 9 | 0 | 3 | 0/0 |
| zone 30 | anon | Brutal | 4/4 | 6.3 | 899 | 0 | 0 | 9 | 15 | 1 | 3 | 0/0 |
| zone 31 | anon | Normal | 4/4 | 1.4 | 0 | 0 | 0 | 9 | 9 | 0 | 3 | 0/0 |
| zone 31 | anon | Hard | 4/4 | 3.7 | 0 | 0 | 0 | 9 | 10 | 1 | 3 | 0/0 |
| zone 31 | anon | Brutal | 4/4 | 3.7 | 0 | 0 | 0 | 9 | 11 | 0 | 3 | 0/0 |
| zone 16 | anon | Normal | 1/4 | 70 | 6 | 0 | 1 | 2 | 3 | 1 | 3 | 0/0 |
| zone 16 | anon | Hard | 0/4 | 70 | 400 | 0 | 1 | 2 | 6 | 0 | 3 | 0/0 |
| zone 16 | anon | Brutal | 0/4 | 17.3 | 5035 | 1 | 1 | 2 | 7 | 0 | 3 | 0/0 |
| zone 26 | anon | Normal | 2/4 | 70 | 5 | 0 | 1 | 3 | 3 | 0 | 3 | 0/0 |
| zone 26 | anon | Hard | 0/4 | 70 | 14477 | 0 | 1 | 6 | 29 | 0 | 3 | 0/0 |
| zone 26 | anon | Brutal | 0/4 | 2.8 | 2079 | 1 | 1 | 3 | 3 | 0 | 3 | 0/0 |
| zone 32 | anon | Normal | 0/4 | 70 | 350 | 0 | 1 | 6 | 25 | 0 | 3 | 0/0 |
| zone 32 | anon | Hard | 1/4 | 70 | 100 | 0 | 1 | 3 | 5 | 0 | 3 | 0/1 |
| zone 32 | anon | Brutal | 0/4 | 10.8 | 3783 | 1 | 1 | 3 | 6 | 0 | 3 | 0/0 |
| zone 12 | founder | Normal | 4/4 | 9.5 | 0 | 0 | 0 | 5 | 7 | 1 | 3 | 0/2 |
| zone 12 | founder | Hard | 0/4 | 25.5 | 7598 | 1 | 5 | 6 | 15 | 0 | 3 | 0/0 |
| zone 12 | founder | Brutal | 0/4 | 25.5 | 7092 | 1 | 5 | 6 | 15 | 0 | 3 | 0/0 |
| zone 13 | founder | Normal | 3/4 | 70 | 774 | 0 | 1 | 6 | 33 | 0 | 3 | 0/0 |
| zone 13 | founder | Hard | 0/4 | 10.3 | 6779 | 1 | 5 | 5 | 7 | 0 | 3 | 0/0 |
| zone 13 | founder | Brutal | 0/4 | 6.5 | 2401 | 1 | 5 | 5 | 5 | 0 | 3 | 0/0 |
| zone 14 | founder | Normal | 1/4 | 70 | 946 | 0 | 5 | 6 | 35 | 0 | 3 | 0/0 |
| zone 14 | founder | Hard | 4/4 | 41.6 | 6488 | 0 | 0 | 5 | 25 | 1 | 3 | 0/0 |
| zone 14 | founder | Brutal | 0/4 | 34.3 | 9095 | 1 | 5 | 5 | 24 | 0 | 3 | 0/0 |
| zone 15 | founder | Normal | 4/4 | 26.2 | 382 | 0 | 0 | 5 | 17 | 0 | 3 | 0/1 |
| zone 15 | founder | Hard | 4/4 | 20.2 | 407 | 0 | 0 | 5 | 12 | 0 | 3 | 0/1 |
| zone 15 | founder | Brutal | 0/4 | 4.8 | 3289 | 1 | 5 | 5 | 5 | 0 | 3 | 0/0 |
| zone 22 | founder | Normal | 4/4 | 18.7 | 70 | 0 | 0 | 5 | 12 | 0 | 3 | 0/0 |
| zone 22 | founder | Hard | 0/4 | 15.9 | 10846 | 1 | 5 | 5 | 10 | 0 | 3 | 0/0 |
| zone 22 | founder | Brutal | 0/4 | 70 | 0 | 0 | 5 | 5 | 5 | 0 | 3 | 0/0 |
| zone 23 | founder | Normal | 2/4 | 70 | 439 | 0 | 3 | 6 | 26 | 0 | 3 | 0/1 |
| zone 23 | founder | Hard | 4/4 | 17.9 | 721 | 0 | 0 | 5 | 10 | 0 | 3 | 0/0 |
| zone 23 | founder | Brutal | 0/4 | 15.4 | 12123 | 1 | 5 | 6 | 9 | 0 | 3 | 0/0 |
| zone 24 | founder | Normal | 3/4 | 70 | 1400 | 0 | 5 | 9 | 55 | 0 | 3 | 0/0 |
| zone 24 | founder | Hard | 4/4 | 41.5 | 1198 | 0 | 0 | 9 | 40 | 0 | 3 | 0/0 |
| zone 24 | founder | Brutal | 0/4 | 27.7 | 10942 | 1 | 1 | 9 | 21 | 0 | 3 | 0/0 |
| zone 25 | founder | Normal | 3/4 | 70 | 68 | 0 | 4 | 9 | 51 | 0 | 3 | 0/2 |
| zone 25 | founder | Hard | 3/4 | 48.8 | 11716 | 1 | 4 | 9 | 38 | 0 | 3 | 0/4 |
| zone 25 | founder | Brutal | 0/4 | 70 | 7594 | 0 | 2 | 9 | 31 | 0 | 3 | 0/0 |
| zone 28 | founder | Normal | 4/4 | 50 | 1510 | 0 | 0 | 9 | 43 | 0 | 3 | 0/1 |
| zone 28 | founder | Hard | 4/4 | 22.3 | 1604 | 0 | 0 | 9 | 25 | 0 | 3 | 0/1 |
| zone 28 | founder | Brutal | 1/4 | 5.8 | 13343 | 1 | 5 | 8 | 8 | 1 | 3 | 0/0 |
| zone 29 | founder | Normal | 4/4 | 13 | 52 | 0 | 0 | 9 | 14 | 0 | 3 | 0/1 |
| zone 29 | founder | Hard | 4/4 | 29.2 | 11980 | 0 | 0 | 8 | 31 | 0 | 3 | 0/0 |
| zone 29 | founder | Brutal | 0/4 | 12.5 | 14107 | 1 | 2 | 9 | 11 | 0 | 3 | 0/0 |
| zone 30 | founder | Normal | 2/4 | 70 | 0 | 0 | 4 | 8 | 8 | 0 | 3 | 0/0 |
| zone 30 | founder | Hard | 3/4 | 70 | 16319 | 0 | 3 | 9 | 53 | 0 | 3 | 0/0 |
| zone 30 | founder | Brutal | 2/4 | 34.6 | 15569 | 1 | 5 | 9 | 29 | 0 | 3 | 0/0 |
| zone 31 | founder | Normal | 4/4 | 8.3 | 5 | 0 | 0 | 8 | 15 | 0 | 3 | 0/1 |
| zone 31 | founder | Hard | 4/4 | 23.2 | 9686 | 0 | 0 | 9 | 27 | 1 | 3 | 0/0 |
| zone 31 | founder | Brutal | 1/4 | 3.9 | 5107 | 1 | 5 | 8 | 8 | 0 | 3 | 0/1 |
| zone 16 | founder | Normal | 0/4 | 70 | 26 | 0 | 1 | 2 | 5 | 0 | 3 | 0/0 |
| zone 16 | founder | Hard | 0/4 | 70 | 6343 | 0 | 1 | 5 | 21 | 0 | 3 | 0/0 |
| zone 16 | founder | Brutal | 0/4 | 11.9 | 6790 | 1 | 1 | 2 | 3 | 0 | 3 | 0/0 |
| zone 26 | founder | Normal | 0/4 | 70 | 489 | 0 | 1 | 9 | 39 | 0 | 3 | 0/0 |
| zone 26 | founder | Hard | 0/4 | 27.8 | 13767 | 1 | 1 | 5 | 18 | 0 | 3 | 0/0 |
| zone 26 | founder | Brutal | 0/4 | 60.6 | 12404 | 1 | 1 | 6 | 34 | 0 | 3 | 0/0 |
| zone 32 | founder | Normal | 0/4 | 70 | 601 | 0 | 1 | 5 | 46 | 0 | 3 | 0/0 |
| zone 32 | founder | Hard | 0/4 | 17.5 | 17007 | 1 | 1 | 5 | 11 | 0 | 3 | 0/0 |
| zone 32 | founder | Brutal | 0/4 | 70 | 1049 | 0 | 1 | 5 | 49 | 0 | 3 | 0/0 |
| zone 12 | homesteader | Normal | 4/4 | 7.4 | 61 | 0 | 0 | 4 | 6 | 0 | 3 | 0/0 |
| zone 12 | homesteader | Hard | 0/4 | 12.1 | 7939 | 1 | 5 | 4 | 7 | 0 | 3 | 0/0 |
| zone 12 | homesteader | Brutal | 0/4 | 30.6 | 8018 | 1 | 5 | 4 | 7 | 0 | 3 | 0/0 |
| zone 13 | homesteader | Normal | 2/4 | 70 | 1049 | 0 | 5 | 4 | 38 | 0 | 3 | 0/0 |
| zone 13 | homesteader | Hard | 0/4 | 11.9 | 9277 | 1 | 5 | 4 | 9 | 0 | 3 | 0/0 |
| zone 13 | homesteader | Brutal | 0/4 | 24 | 8634 | 1 | 5 | 4 | 17 | 0 | 3 | 0/0 |
| zone 14 | homesteader | Normal | 4/4 | 12.8 | 263 | 0 | 0 | 4 | 11 | 0 | 3 | 0/0 |
| zone 14 | homesteader | Hard | 1/4 | 52.6 | 10491 | 1 | 5 | 4 | 42 | 0 | 3 | 0/1 |
| zone 14 | homesteader | Brutal | 0/4 | 46.8 | 9684 | 1 | 5 | 4 | 36 | 0 | 3 | 0/0 |
| zone 15 | homesteader | Normal | 4/4 | 6.6 | 56 | 0 | 0 | 4 | 6 | 0 | 3 | 0/0 |
| zone 15 | homesteader | Hard | 4/4 | 7.7 | 555 | 0 | 0 | 4 | 7 | 2 | 3 | 0/0 |
| zone 15 | homesteader | Brutal | 4/4 | 16.5 | 8776 | 0 | 0 | 4 | 9 | 0 | 3 | 0/0 |
| zone 22 | homesteader | Normal | 0/4 | 70 | 663 | 0 | 4 | 4 | 40 | 0 | 3 | 0/0 |
| zone 22 | homesteader | Hard | 0/4 | 19.6 | 11670 | 1 | 5 | 4 | 17 | 0 | 3 | 0/0 |
| zone 22 | homesteader | Brutal | 0/4 | 70 | 11948 | 0 | 5 | 4 | 47 | 0 | 3 | 0/0 |
| zone 23 | homesteader | Normal | 2/4 | 70 | 519 | 0 | 3 | 4 | 39 | 3 | 3 | 0/0 |
| zone 23 | homesteader | Hard | 3/4 | 70 | 7674 | 0 | 2 | 4 | 27 | 4 | 3 | 0/0 |
| zone 23 | homesteader | Brutal | 4/4 | 43.9 | 12953 | 0 | 0 | 4 | 15 | 4 | 3 | 0/0 |
| zone 24 | homesteader | Normal | 4/4 | 14.8 | 92 | 0 | 0 | 5 | 11 | 0 | 3 | 0/0 |
| zone 24 | homesteader | Hard | 0/4 | 5.1 | 12558 | 1 | 5 | 5 | 6 | 0 | 3 | 0/0 |
| zone 24 | homesteader | Brutal | 4/4 | 43.7 | 10316 | 0 | 0 | 5 | 22 | 0 | 3 | 0/0 |
| zone 25 | homesteader | Normal | 2/4 | 70 | 552 | 0 | 5 | 5 | 47 | 0 | 3 | 0/0 |
| zone 25 | homesteader | Hard | 0/4 | 15.3 | 13054 | 1 | 5 | 5 | 15 | 0 | 3 | 0/0 |
| zone 25 | homesteader | Brutal | 0/4 | 70 | 14596 | 0 | 5 | 5 | 61 | 0 | 3 | 0/0 |
| zone 28 | homesteader | Normal | 4/4 | 62.7 | 4742 | 0 | 0 | 5 | 55 | 0 | 3 | 0/0 |
| zone 28 | homesteader | Hard | 4/4 | 13.2 | 7572 | 0 | 0 | 5 | 13 | 0 | 3 | 0/0 |
| zone 28 | homesteader | Brutal | 0/4 | 3.1 | 14556 | 1 | 5 | 5 | 6 | 0 | 3 | 0/0 |
| zone 29 | homesteader | Normal | 0/4 | 70 | 1391 | 0 | 2 | 5 | 26 | 0 | 3 | 0/0 |
| zone 29 | homesteader | Hard | 4/4 | 13 | 7346 | 0 | 0 | 5 | 14 | 0 | 3 | 0/0 |
| zone 29 | homesteader | Brutal | 0/4 | 4 | 14464 | 1 | 5 | 5 | 6 | 0 | 3 | 0/0 |
| zone 30 | homesteader | Normal | 0/4 | 70 | 3189 | 0 | 4 | 5 | 60 | 0 | 3 | 0/0 |
| zone 30 | homesteader | Hard | 0/4 | 13.6 | 14454 | 1 | 5 | 5 | 14 | 0 | 3 | 0/0 |
| zone 30 | homesteader | Brutal | 0/4 | 16.7 | 15412 | 1 | 5 | 5 | 16 | 0 | 3 | 0/0 |
| zone 31 | homesteader | Normal | 0/4 | 70 | 3866 | 0 | 2 | 5 | 72 | 1 | 3 | 0/0 |
| zone 31 | homesteader | Hard | 4/4 | 20.4 | 11788 | 0 | 0 | 5 | 18 | 5 | 3 | 0/0 |
| zone 31 | homesteader | Brutal | 0/4 | 4.1 | 15626 | 1 | 5 | 5 | 6 | 1 | 3 | 0/0 |
| zone 16 | homesteader | Normal | 0/4 | 70 | 103 | 0 | 1 | 4 | 13 | 1 | 3 | 0/0 |
| zone 16 | homesteader | Hard | 0/4 | 70 | 6652 | 0 | 1 | 4 | 13 | 1 | 3 | 0/0 |
| zone 16 | homesteader | Brutal | 0/4 | 15.7 | 10777 | 1 | 1 | 1 | 2 | 1 | 3 | 0/0 |
| zone 26 | homesteader | Normal | 0/4 | 70 | 468 | 0 | 1 | 5 | 19 | 0 | 3 | 0/0 |
| zone 26 | homesteader | Hard | 0/4 | 25.8 | 13704 | 1 | 1 | 2 | 7 | 0 | 3 | 0/0 |
| zone 26 | homesteader | Brutal | 0/4 | 70 | 12979 | 0 | 1 | 5 | 19 | 0 | 3 | 0/0 |
| zone 32 | homesteader | Normal | 0/4 | 70 | 164 | 0 | 1 | 5 | 28 | 0 | 3 | 0/0 |
| zone 32 | homesteader | Hard | 0/4 | 31.8 | 16498 | 1 | 1 | 2 | 8 | 0 | 3 | 0/0 |
| zone 32 | homesteader | Brutal | 0/4 | 70 | 8209 | 0 | 1 | 5 | 25 | 0 | 3 | 0/0 |
| zone 12 | witness | Normal | 4/4 | 43.2 | 224 | 0 | 0 | 5 | 58 | 0 | 3 | 0/0 |
| zone 12 | witness | Hard | 0/4 | 13.1 | 8255 | 1 | 5 | 4 | 16 | 0 | 3 | 0/0 |
| zone 12 | witness | Brutal | 0/4 | 21.6 | 8657 | 1 | 5 | 3 | 13 | 0 | 3 | 0/0 |
| zone 13 | witness | Normal | 4/4 | 49.1 | 149 | 0 | 0 | 4 | 36 | 0 | 3 | 0/0 |
| zone 13 | witness | Hard | 0/4 | 11.7 | 8334 | 1 | 4 | 4 | 16 | 0 | 3 | 0/0 |
| zone 13 | witness | Brutal | 1/4 | 38.7 | 8652 | 1 | 5 | 5 | 62 | 0 | 3 | 0/0 |
| zone 14 | witness | Normal | 2/4 | 70 | 626 | 0 | 1 | 5 | 103 | 0 | 3 | 0/1 |
| zone 14 | witness | Hard | 1/4 | 50.1 | 10379 | 1 | 3 | 4 | 70 | 0 | 3 | 0/0 |
| zone 14 | witness | Brutal | 0/4 | 70 | 5082 | 0 | 3 | 4 | 24 | 0 | 3 | 0/0 |
| zone 15 | witness | Normal | 3/4 | 70 | 318 | 0 | 3 | 5 | 101 | 0 | 3 | 0/1 |
| zone 15 | witness | Hard | 2/4 | 44.5 | 10713 | 1 | 5 | 4 | 57 | 0 | 3 | 0/0 |
| zone 15 | witness | Brutal | 0/4 | 70 | 4674 | 0 | 2 | 4 | 12 | 0 | 3 | 0/0 |
| zone 22 | witness | Normal | 3/4 | 70 | 275 | 0 | 4 | 4 | 97 | 0 | 3 | 0/0 |
| zone 22 | witness | Hard | 0/4 | 70 | 4194 | 0 | 5 | 3 | 7 | 0 | 3 | 0/0 |
| zone 22 | witness | Brutal | 1/4 | 59.2 | 12676 | 1 | 1 | 4 | 84 | 0 | 3 | 0/2 |
| zone 23 | witness | Normal | 0/4 | 70 | 2052 | 0 | 4 | 4 | 56 | 0 | 3 | 0/0 |
| zone 23 | witness | Hard | 1/4 | 70 | 2006 | 0 | 1 | 4 | 69 | 0 | 3 | 0/0 |
| zone 23 | witness | Brutal | 0/4 | 12.5 | 12969 | 1 | 3 | 4 | 18 | 0 | 3 | 0/0 |
| zone 24 | witness | Normal | 2/4 | 70 | 801 | 0 | 3 | 5 | 97 | 0 | 3 | 0/0 |
| zone 24 | witness | Hard | 1/4 | 34.3 | 12124 | 1 | 4 | 4 | 51 | 0 | 3 | 0/0 |
| zone 24 | witness | Brutal | 0/4 | 70 | 2142 | 0 | 3 | 4 | 41 | 0 | 3 | 0/0 |
| zone 25 | witness | Normal | 3/4 | 70 | 271 | 0 | 3 | 4 | 105 | 0 | 3 | 0/0 |
| zone 25 | witness | Hard | 3/4 | 50.5 | 12957 | 1 | 4 | 4 | 70 | 0 | 3 | 0/0 |
| zone 25 | witness | Brutal | 2/4 | 70 | 2896 | 0 | 1 | 5 | 97 | 0 | 3 | 0/0 |
| zone 28 | witness | Normal | 4/4 | 19.7 | 179 | 0 | 0 | 5 | 32 | 0 | 3 | 0/0 |
| zone 28 | witness | Hard | 2/4 | 29.6 | 13794 | 1 | 5 | 4 | 43 | 0 | 3 | 0/0 |
| zone 28 | witness | Brutal | 0/4 | 70 | 2881 | 0 | 2 | 4 | 25 | 0 | 3 | 0/0 |
| zone 29 | witness | Normal | 4/4 | 18.4 | 214 | 0 | 0 | 5 | 27 | 0 | 3 | 0/0 |
| zone 29 | witness | Hard | 0/4 | 15.6 | 13200 | 1 | 5 | 4 | 18 | 0 | 3 | 0/0 |
| zone 29 | witness | Brutal | 0/4 | 70 | 12625 | 0 | 2 | 4 | 23 | 0 | 3 | 0/0 |
| zone 30 | witness | Normal | 3/4 | 70 | 558 | 0 | 1 | 5 | 72 | 0 | 3 | 0/0 |
| zone 30 | witness | Hard | 0/4 | 23.3 | 13368 | 1 | 4 | 4 | 38 | 0 | 3 | 0/0 |
| zone 30 | witness | Brutal | 1/4 | 70 | 6395 | 0 | 3 | 4 | 107 | 0 | 3 | 0/0 |
| zone 31 | witness | Normal | 3/4 | 70 | 511 | 0 | 5 | 5 | 97 | 0 | 3 | 0/0 |
| zone 31 | witness | Hard | 2/4 | 24.2 | 15502 | 1 | 3 | 4 | 35 | 0 | 3 | 0/0 |
| zone 31 | witness | Brutal | 2/4 | 48.3 | 14894 | 1 | 4 | 4 | 68 | 1 | 3 | 0/0 |
| zone 16 | witness | Normal | 0/4 | 70 | 84 | 0 | 1 | 5 | 35 | 0 | 3 | 0/0 |
| zone 16 | witness | Hard | 0/4 | 70 | 1842 | 0 | 1 | 4 | 46 | 0 | 3 | 0/0 |
| zone 16 | witness | Brutal | 0/4 | 39.3 | 11480 | 1 | 1 | 4 | 53 | 0 | 3 | 0/0 |
| zone 26 | witness | Normal | 1/4 | 70 | 189 | 0 | 1 | 4 | 42 | 0 | 3 | 0/0 |
| zone 26 | witness | Hard | 0/4 | 70 | 14788 | 0 | 1 | 4 | 106 | 0 | 3 | 0/0 |
| zone 26 | witness | Brutal | 0/4 | 40.6 | 13158 | 1 | 1 | 4 | 62 | 0 | 3 | 0/0 |
| zone 32 | witness | Normal | 0/4 | 70 | 223 | 0 | 1 | 4 | 63 | 0 | 3 | 0/0 |
| zone 32 | witness | Hard | 0/4 | 70 | 7616 | 0 | 1 | 4 | 100 | 0 | 3 | 0/0 |
| zone 32 | witness | Brutal | 0/4 | 66.6 | 13109 | 1 | 1 | 4 | 89 | 0 | 3 | 0/0 |
| zone 12 | maxi | Normal | 4/4 | 1.1 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 12 | maxi | Hard | 4/4 | 26.3 | 4349 | 0 | 0 | 8 | 53 | 1 | 3 | 0/0 |
| zone 12 | maxi | Brutal | 4/4 | 3.3 | 1473 | 0 | 0 | 8 | 12 | 0 | 3 | 0/0 |
| zone 13 | maxi | Normal | 4/4 | 3.7 | 20 | 0 | 0 | 8 | 12 | 0 | 3 | 0/1 |
| zone 13 | maxi | Hard | 4/4 | 30.1 | 5939 | 0 | 0 | 8 | 67 | 1 | 3 | 0/0 |
| zone 13 | maxi | Brutal | 4/4 | 6.5 | 1921 | 0 | 0 | 8 | 18 | 1 | 3 | 0/0 |
| zone 14 | maxi | Normal | 4/4 | 2.8 | 6 | 0 | 0 | 8 | 9 | 0 | 3 | 0/0 |
| zone 14 | maxi | Hard | 4/4 | 11.1 | 1274 | 0 | 0 | 8 | 23 | 2 | 3 | 0/1 |
| zone 14 | maxi | Brutal | 4/4 | 13.6 | 1967 | 0 | 0 | 8 | 33 | 1 | 3 | 0/0 |
| zone 15 | maxi | Normal | 4/4 | 1.1 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 15 | maxi | Hard | 4/4 | 22.4 | 3319 | 0 | 0 | 8 | 56 | 1 | 3 | 0/1 |
| zone 15 | maxi | Brutal | 4/4 | 3.9 | 344 | 0 | 0 | 8 | 12 | 0 | 3 | 0/0 |
| zone 22 | maxi | Normal | 4/4 | 1.7 | 29 | 0 | 0 | 8 | 8 | 0 | 3 | 0/0 |
| zone 22 | maxi | Hard | 3/4 | 70 | 5349 | 0 | 4 | 8 | 46 | 0 | 3 | 0/1 |
| zone 22 | maxi | Brutal | 0/4 | 12.1 | 9321 | 1 | 1 | 8 | 15 | 0 | 3 | 0/0 |
| zone 23 | maxi | Normal | 4/4 | 1.7 | 3 | 0 | 0 | 8 | 8 | 0 | 3 | 0/1 |
| zone 23 | maxi | Hard | 0/4 | 23.1 | 10143 | 1 | 4 | 8 | 17 | 0 | 3 | 0/0 |
| zone 23 | maxi | Brutal | 0/4 | 70 | 2008 | 0 | 2 | 8 | 32 | 0 | 3 | 0/0 |
| zone 24 | maxi | Normal | 4/4 | 2.3 | 2 | 0 | 0 | 9 | 9 | 0 | 3 | 0/1 |
| zone 24 | maxi | Hard | 1/4 | 48.1 | 16187 | 1 | 5 | 9 | 116 | 0 | 3 | 0/1 |
| zone 24 | maxi | Brutal | 2/4 | 70 | 4386 | 0 | 5 | 9 | 136 | 0 | 3 | 0/0 |
| zone 25 | maxi | Normal | 4/4 | 1.1 | 5 | 0 | 0 | 7 | 10 | 0 | 3 | 0/0 |
| zone 25 | maxi | Hard | 0/4 | 70 | 13847 | 0 | 1 | 9 | 87 | 0 | 3 | 0/0 |
| zone 25 | maxi | Brutal | 4/4 | 3.3 | 958 | 0 | 0 | 9 | 13 | 1 | 3 | 0/1 |
| zone 28 | maxi | Normal | 4/4 | 1.1 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/1 |
| zone 28 | maxi | Hard | 2/4 | 62.2 | 12424 | 1 | 5 | 9 | 151 | 0 | 3 | 0/0 |
| zone 28 | maxi | Brutal | 4/4 | 24.2 | 2705 | 0 | 0 | 9 | 55 | 0 | 3 | 0/0 |
| zone 29 | maxi | Normal | 4/4 | 13.9 | 149 | 0 | 0 | 9 | 31 | 0 | 3 | 0/1 |
| zone 29 | maxi | Hard | 4/4 | 1.1 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 29 | maxi | Brutal | 1/4 | 3.5 | 5342 | 1 | 3 | 9 | 13 | 0 | 3 | 0/0 |
| zone 30 | maxi | Normal | 4/4 | 1.3 | 0 | 0 | 0 | 7 | 7 | 0 | 3 | 0/0 |
| zone 30 | maxi | Hard | 4/4 | 9.3 | 2101 | 0 | 0 | 9 | 21 | 1 | 3 | 0/0 |
| zone 30 | maxi | Brutal | 0/4 | 7.3 | 11751 | 1 | 5 | 9 | 23 | 0 | 3 | 0/0 |
| zone 31 | maxi | Normal | 4/4 | 9.7 | 153 | 0 | 0 | 9 | 28 | 0 | 3 | 0/0 |
| zone 31 | maxi | Hard | 4/4 | 28.3 | 10880 | 0 | 0 | 9 | 64 | 0 | 3 | 0/0 |
| zone 31 | maxi | Brutal | 0/4 | 4.5 | 13156 | 1 | 5 | 9 | 13 | 0 | 3 | 0/0 |
| zone 16 | maxi | Normal | 1/4 | 70 | 0 | 0 | 1 | 3 | 3 | 1 | 3 | 0/1 |
| zone 16 | maxi | Hard | 0/4 | 70 | 11244 | 0 | 1 | 8 | 55 | 0 | 3 | 0/0 |
| zone 16 | maxi | Brutal | 0/4 | 9.2 | 3350 | 1 | 1 | 4 | 9 | 0 | 3 | 0/0 |
| zone 26 | maxi | Normal | 0/4 | 70 | 80 | 0 | 1 | 5 | 28 | 0 | 3 | 0/0 |
| zone 26 | maxi | Hard | 0/4 | 55.9 | 11221 | 1 | 1 | 9 | 57 | 0 | 3 | 0/0 |
| zone 26 | maxi | Brutal | 1/4 | 70 | 332 | 0 | 1 | 5 | 12 | 0 | 3 | 0/0 |
| zone 32 | maxi | Normal | 0/4 | 70 | 105 | 0 | 1 | 5 | 54 | 0 | 3 | 0/0 |
| zone 32 | maxi | Hard | 0/4 | 59.7 | 13302 | 1 | 1 | 5 | 25 | 0 | 3 | 0/0 |
| zone 32 | maxi | Brutal | 1/4 | 70 | 0 | 0 | 1 | 4 | 4 | 1 | 3 | 0/1 |

## Totals

| Difficulty | Samples | Died | Cleared every wave | Mean distinct skills cast |
|---|---:|---:|---:|---:|
| Normal | 120 | 0 (0%) | 69 | 6.0 |
| Hard | 119 | 63 (53%) | 39 | 6.1 |
| Brutal | 120 | 60 (50%) | 36 | 6.0 |

| Class | Died (all difficulties) | Mean distinct skills |
|---|---:|---:|
| scrapper | 14/44 | 5.7 |
| hacker | 19/45 | 6.4 |
| courier | 19/45 | 6.2 |
| anon | 8/45 | 7.0 |
| founder | 18/45 | 6.6 |
| homesteader | 17/45 | 4.3 |
| witness | 18/45 | 4.2 |
| maxi | 10/45 | 7.6 |
