# D2MOO: what the real Diablo II code says about our balance

Reviewed `ThePhrozenKeep/D2MOO` at `5596f5cb` (18MB, C++).

This is a different and better source than OpenDiablo2. OD2 is a reimplementation
that ships table *schemas* and no game logic. D2MOO is a function-level
re-implementation of Diablo II's own DLLs — the actual arithmetic, matched to the
original's methods and ordinals. Where OD2 told us how the tables were shaped,
this tells us what the game did with them.

It still ships no Blizzard data (the original assets are required to run it), so
the numbers remain unavailable. The logic does not.

---

## 1. Validated: our drop scaling is Diablo's, exactly

`DROP_GetTreasureClassItem` (`source/D2Game/src/ITEMS/Items.cpp:2150`):

```c
double noDropRatio = (double)nNoDrop / (double)(nChance + nNoDrop);
const double baseRatio = noDropRatio;
for (int32_t i = nPlayerCount - 1; i > 0; --i) noDropRatio *= baseRatio;
const double inverseRatio = 1.0 - noDropRatio;
nNoDrop = (int32_t)((double)nChance / inverseRatio * (1.0 - inverseRatio));
```

That reduces to `nChance * r^n / (1 - r^n)` where `r = no/(no+rest)`.

Ours, `partyNoWeight` in `src/p2.js`:

```js
const stay = no/(no+rest), want = Math.pow(stay, n);
return rest * want / (1 - want);
```

The same expression. Checked numerically across 150 combinations of our real
`TC` weights and party sizes 1-8: maximum difference **0.98**, entirely
accounted for by D2 truncating to `int32`. Nothing to do here, and worth
knowing it is right.

## 2. Not applicable: the two stats D2 scales that we don't

`DATATBLS_CalculateMonsterStatsByLevel` (`source/D2Common/src/DataTbls/MonsterTbls.cpp:561`)
scales **five** things off MonLvl: HP, **AC** (defence), XP, **TH** (to-hit) and
damage. We scale three.

The missing two are defence and accuracy — and **they do not apply to us,
because we have no accuracy system.** There is no hit-chance roll anywhere in
the game: every `miss` in `src/p2.js` is in a comment, `P.atk` is the player's
swing cooldown, and `ET`'s `atk` field is the monster's seconds-between-swings.
Attacks always land.

Recorded so that nobody reads "D2 scales five, we scale three" and adds two
columns to `FORMULAS.monLvl` that nothing could consume.

It does sharpen the divergence already noted in the MonLvl work: monster DPS is
`dmg / atk`, and `atk` does not scale either, so DPS tracks damage at +22% a
level against life at +42%. There is no accuracy term quietly making up the
difference.

## 3. Decision: D2 clamps the level table, we extrapolate

```c
if (nLevel > sgptDataTables->nMonLvlTxtRecordCount - 1)
    nLevel = sgptDataTables->nMonLvlTxtRecordCount - 1;
```

D2 clamps to the last row. Our `monLvl()` continues past row 99 using the
slopes the rows were generated from, which was the right choice for a refactor
that had to change nothing — but it was not a balance decision, and it is one
now that the table exists. Brutal plus a few tiers goes past 99, and today that
means life keeps climbing +42% a level forever with nothing to stop it.

Clamping at 99 is one line and is what the game this one is modelled on does.

## 4. Gap worth taking: a monster can opt out of the curve

Every branch of that function is guarded by `MONSTATSFLAGINDEX_NORATIO`:

```c
if (pMonStatsTxtRecord->dwMonStatsFlags & gdwBitMasks[MONSTATSFLAGINDEX_NORATIO])
    pMonStatsInit->nMinHP = pMonStatsTxtRecord->nMinHP[nDifficulty];   // absolute
else
    pMonStatsInit->nMinHP = DATATBLS_ApplyRatio(pMonLvlTxtRecord->dwHP[...], ...);
```

A monster can declare that the level curve does not apply to it, and its stats
are then taken as written. That is how Diablo's act bosses get hand-set numbers.

We have no such thing. A boss is `t.hp * monLvl(ml)[0] * 2.5`, so a boss in
brutal Act V (`ml` 63) carries roughly **27x its ET life, times 2.5** — about
67x. Tuning a boss means guessing a multiplier against a base that moves with
every level, which is a fair description of why `CLAUDE.md` lists boss4 and
boss5 tuning as first guesses.

A `noRatio: 1` flag on an `ET` entry, making `spawn` take `t.hp` and `t.dmg` as
absolute, would let those two be set to a number someone chose and measured.
Small change, and it makes the hardest fights in the game the ones that are
directly tunable.

## 5. Gap: our drop count is read at the moment of death

D2 freezes it on the monster instead (`Items.cpp:2142`):

```c
uint32_t nPlayerCount = (PLAYER_GetPlayerCount(pGame) - nPartyMembers) / 2 + nPartyMembers;
nPlayerCount = std::min<uint32_t>(nPlayerCount,
    std::max(STATLIST_UnitGetStatValue(pMonster, STAT_MONSTER_PLAYERCOUNT, 0), 1));
```

`STAT_MONSTER_PLAYERCOUNT` is set when the monster is created, and the live
count is capped by it. So a kill pays out according to how busy the game was
when the thing spawned, not when it died.

Ours (`partyDropN`, `src/p13.js`) reads `MP.roster` at drop time. Three
consequences, in order of how much they matter:

- **Someone arriving just before a kill inflates the drop.** Park a boss, call
  in friends, kill it. D2's snapshot is specifically what prevents this.
- **Someone leaving mid-fight deflates it**, which is the same unfairness
  pointing the other way and is the one players notice.
- No cap. D2 clamps party members to 8 (`std::min(..., 8)`); ours returns
  `close + floor(away/2)` with nothing stopping it.

The fix is the same shape as D2's: stamp the count on the entity in `spawn`
and take `Math.min(live, stamped)` when it drops.

## 6. Smaller: who counts as half

D2 gives half weight to every player **not in your party and level**, including
players elsewhere in the game. Ours gives half weight only to players in *other
zones*, and nothing at all to a non-party player standing next to you.

So in ours a stranger in your zone contributes zero, and in D2 they contribute a
half. Defensible either way — ours rewards partying up more sharply — but it is
a difference nobody chose, and if solo-but-populated games should feel richer,
this is the knob.

---

## Order I would do these in

1. **Snapshot the drop count at spawn** (5). It is a fairness bug players feel,
   and the fix is four lines.
2. **`noRatio` for bosses** (4). Unblocks the boss tuning `CLAUDE.md` calls a
   guess, and makes the balance bot's boss numbers mean something.
3. **Decide the table tail** (3) — clamp or keep extrapolating. One line, but
   make it on purpose.
4. **Cap the drop count at 8** (5, third bullet). One line.
5. Leave (6) unless populated solo games should drop more.

Nothing here needs D2's data, and nothing needs a line of its code.
