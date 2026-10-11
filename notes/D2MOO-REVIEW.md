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

---

# Part two: a second pass for feel, not balance

Asked what else is in here to make the game run smoother. Two findings worth
acting on, and four candidates checked and rejected — the rejections are
recorded because each is the kind of thing that looks like an obvious gap
until you check what our game actually does.

## 7. Our monsters track you perfectly, every frame

D2 gives every monster an **AI delay**: `aidel`, `aidel(N)`, `aidel(H)` in
MonStats (`MonsterTbls.cpp:250`), read per difficulty and applied in
`MonsterMode.cpp:1096`. A monster re-decides every N frames, not every frame.
That delay is most of why Diablo's monsters feel like they are reacting to you
rather than attached to you, and it is what makes kiting a skill rather than a
formality.

Our AI tick (`src/p2.js:1703`) recomputes the vector to the target and steers
along it **every single frame**:

```js
const dx=T.x-e.x, dy=T.y-e.y, d=Math.hypot(dx,dy)||1, t=ET[e.k];
...
mv(e, dx/d*sp, dy/d*sp);
```

There is a windup before damage (`e.wind`) and a cooldown between swings
(`e.atk`), so attacks are telegraphed — but *movement* is frame-perfect
pursuit. Nothing a player does can make a monster commit to a wrong heading,
because it never commits to a heading at all.

The change is small: give a monster a decision timer and a stored heading, and
only recompute the heading when the timer expires. A tenth of a second is
enough to feel different; the value belongs per monster in `ET` so a hound can
be twitchy and a hull ponderous.

This is a feel change, not a refactor. It will alter every fight in the game
and it will move the balance numbers, so it wants doing *before* the balance
bot runs, not after.

## 8. Crowd control and leech do not weaken on higher difficulties

`DifficultyLevelRecord` carries five divisors beside the resistance penalty:

```
MonsterColdDivisor, MonsterFreezeDivisor, AiCurseDivisor,
LifeStealDivisor, ManaStealDivisor
```

On Nightmare and Hell, Diablo divides how long your cold and freeze hold, how
long your curses last, and how much life and mana you leech. Difficulty does
not only make monsters bigger; it makes your control over them weaker.

Ours has the resistance half of that and not the rest. `resPen()`
(`src/p10.js`) returns 0 / 20 / 50 by difficulty, and that is the whole of it:

- `e.stun = Math.max(e.stun, X)` everywhere, with no difficulty term.
- leech is `heal(d * Math.min(e.mp?4:15, lc) / 100)` (`src/p2.js:551`), a flat
  percentage of damage with no difficulty term.

So a stun or leech build keeps every bit of its strength into brutal, against
monsters whose life has grown far faster than their damage. Leech is the
sharper one: it pays a percentage of damage dealt, and damage dealt grows with
the monster's health pool, so its absolute return *rises* as the game goes on.

That is a plausible mechanical account of a late game that is either trivial or
punishing depending on build, which is what an unmeasured Act III-V tends to
feel like. A `ccDiv()` and `leechDiv()` beside `resPen()` would be the same
shape as the thing that is already there.

## Checked and rejected

- **The experience penalty for out-levelling content.** D2 pays 13/256 of an
  experience award at ten levels above the monster
  (`SUnitDmg.cpp`, `SUNITDMG_ComputeExperienceGain`). We need no equivalent:
  our experience scales off *zone* level, so Act I always pays Act I rates
  however high you are. Different mechanism, same outcome.
- **Scaling monster defence and accuracy by level.** D2 scales five stats off
  MonLvl; we scale three. The missing two are defence and to-hit, and there is
  no accuracy system in our game at all to consume them — every `miss` in
  `p2.js` is a comment.
- **A Faster Hit Recovery stat.** In D2 being hit-locked is how you die, so
  gear that shortens it is sought after. Ours sets `P.hitStun=.45` on any
  damage, but it gates exactly one skill index and never the player's attack or
  movement. There is no hit-lock, so there is nothing for gear to answer.
- **Porting any of the AI itself.** `AiThink.cpp` is 17,590 lines of
  per-monster behaviour. The transferable idea is the delay in finding 7, not
  the code.

## Revised order

1. Snapshot the drop count at spawn (finding 5) — fairness bug, four lines.
2. Monster decision delay (7) — biggest change to how the game feels, and it
   must land before any balance measurement is taken.
3. Difficulty divisors for control and leech (8) — the other half of a system
   half of which already exists.
4. `noRatio` for bosses (4), then the table tail (3), then the drop cap.
