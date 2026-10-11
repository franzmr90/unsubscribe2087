# What OpenDiablo2 is good for, and what it told us about our own balance

Reviewed `opendiablo2/opendiablo2` at `7f92c571` (39MB, Go).

## What it actually is — and is not

It is a reimplementation of the Diablo II **engine**: asset loading, rendering,
map generation, networking. 39k lines in `d2core`, 12k in `d2game`.

Three things it does **not** have, which matter before anyone plans to lift
anything from it:

- **No Diablo II data.** Six `.txt` files in the whole repo, all loader test
  fixtures. The real tables come from the user's own MPQ install. So Blizzard's
  numbers are not in here and cannot be copied out of here.
- **No combat or balance math.** `resist` appears only in record loaders and a
  stat test — not in any damage path. Gameplay is incomplete.
- **Nothing reusable as code.** Go, and an engine for a different game.

What it *does* have, and this is the valuable part: **173 table definitions**
in `d2core/d2records/`, carefully reverse-engineered, with field comments that
explain what each column meant. It is a documented data model for how a
shipped ARPG organised its balance.

## The one idea worth taking

D2 separates **monster identity** from **the power curve**.

`MonStats.txt` holds what a thing *is* — base stats, AI, resistances. A separate
`MonLvl.txt` holds one row per level with percentage multipliers for Hitpoints,
Damage and Experience, in three columns for Normal / Nightmare / Hell
(`monster_levels_loader.go`). Monster power at a given place is identity times
curve, and the curve is a table a designer edits without touching any monster.

Our equivalent lives inline in `spawn()` (`src/p2.js`) as two coefficients:

```
hp  = t.hp  * (1 + .42*(ml-1)) * (su?5:ch?2.8:1) * (isBoss?2.5:1) * dyn
dmg = t.dmg * (1 + .22*(ml-1)) * (ch?1.3:1) * (isBoss?1.35:1)
                               * (ml>25 ? 1+.008*(ml-25) : 1) * dyn
xp  = t.xp  * (1 + .80*(ml-1)) * (su?10:champ?4:1)
```

Three hardcoded slopes, no table, no per-act or per-difficulty column. That is
the mechanical reason "Acts III–V balance is unmeasured": there is nothing to
measure *against*. There is no artefact that states what Act IV is supposed to
feel like, so no reading can be wrong.

## What the comparison exposed in our numbers

Reading our own curves next to D2's structure produced two findings. The
first was wrong and is corrected below, which is left in place rather than
deleted because the mistake is instructive. The second is arithmetic from
`src/p2.js` and stands.

### 1. CORRECTED — area levels are already fixed per zone, as in D2

**This finding was wrong when first written, and the correction matters more
than the original claim.** I found `W.ml = G.lvl` and reported that monster
level simply tracks the player, so difficulty was constant by construction and
nobody could ever be over- or under-levelled.

There are four assignments to `W.ml`, and the main one is not that. `enter()`
uses `W.ml = zoneLevel(z)`, and

```
zoneLevel(z) = campaignLevel(z.lvl, G.diff) + (G.tier||0)*12
```

where `z.lvl` is written per zone in `ZONES`, `campaignLevel` remaps it through
`FORMULAS.ladder` (`act1:12, top:72, end:38`) and adds a flat offset per
difficulty (`hard:22, brutal:38`). So area level is fixed per zone per
difficulty, offset by tier — structurally what D2 does, and already table-driven
through the ladder.

`W.ml = G.lvl` is the **Simulator** only: an endless wave mode where scaling to
the player is the correct design. The other two assignments are the adaptive
recompute and the sim's own wave ramp.

So there is no missing area-level system, and nothing to borrow from D2 here.
The lesson is narrower than the first version of this document claimed: level
*assignment* was already fine; only the *curve* was loose.

### 2. Monsters get tanky ~1.6x faster than they get dangerous

| ml | HP × | DMG × | XP × | time-to-kill | threat | xp per effort |
|----|------|-------|------|--------------|--------|---------------|
| 1  | 1.0  | 1.0   | 1.0  | 1.0          | 1.0    | 1.00 |
| 10 | 4.8  | 3.0   | 8.2  | 4.8          | 3.0    | 1.72 |
| 20 | 9.0  | 5.2   | 16.2 | 9.0          | 5.2    | 1.80 |
| 30 | 13.2 | 7.7   | 24.2 | 13.2         | 7.7    | 1.84 |
| 40 | 17.4 | 10.7  | 32.2 | 17.4         | 10.7   | 1.85 |

HP at +42%/level against damage at +22%/level means that by level 40 a monster
has **1.62× more health relative to its damage** than it did at level 1. The
predicted late-game feel is long fights that are not especially threatening —
exactly the complaint one would expect from unmeasured Acts III–V.

XP compounds the same way from the other side: at +80%/level it outruns HP at
+42%, so **experience per unit of effort rises 1.85× over the game**. Because
`ml` follows player level, that is a positive feedback loop — faster levelling
raises monster level, which pays more XP per kill.

Neither of these is necessarily wrong. Both are currently accidents of three
numbers chosen inline, rather than decisions anyone recorded.

## Concretely useful, in order of value

1. ~~**Write the curve down as a table.**~~ **DONE** — `FORMULAS.monLvl`, 99
   rows, one per level, four columns. The slopes turned out to be duplicated in
   **nine places across four files**, not just `spawn()`, which made the case
   stronger than this document first put it. `tools/monlvl-check.js` proves the
   table reproduces the old arithmetic bit-identically (600 values, `===`, over
   levels 1-150) and that real spawns scale by the table's own ratios.

   The refactor also surfaced a disagreement already in the game: the +0.8%
   per level damage kink past level 25 is applied when a monster spawns, but
   the adaptive-difficulty target (`dynFor`) and the bounty scaler both compute
   expected damage *without* it. The table carries both numbers rather than
   unifying them, because unifying would change the balance. That is now a
   visible decision for whoever wants to make it.

2. **Decide the HP-to-damage ratio on purpose.** Flat is the easy fix: make the
   damage slope track the HP slope. Or keep the divergence deliberately and say
   so. Either way it stops being an accident.

3. **Rewrite the balance bot.** `CLAUDE.md` notes it "stalls on dialog locks and
   needs a rewrite". That is now a solved problem: the `clearUI` pattern in
   `tools/fx-sheets.js`, `skill-shots.js`, `skill-aim.js`, `gear-doll.js` and
   `pop-badge.js` clears scenes and locked dialogs reliably, and `skill-aim.js`
   shows the per-case state reset needed to stop one measurement contaminating
   the next. A bot that walks each zone, fights a fixed sample, and reports
   time-to-kill, damage-taken-per-second and XP-per-minute against the table from
   (1) is a day's work on top of what exists.

4. **Borrow the treasure-class vocabulary, not the numbers.** Ours already has
   the important part — `partyNoWeight` is D2's NoDrop mechanic, where more
   players lowers the no-drop weight and raises effective drops. D2 additionally
   nests treasure classes so one class can reference another, which is how it
   gets graded drops without a table per monster. Our `TC` is flat
   (`no/gold/item/stim` plus a quality block per entry). Nesting would be worth
   it only if the table grows.

5. **The calc-string idea.** `d2common/d2calculation` parses D2's little formula
   language, which is how skill descriptions and effects stay data rather than
   code. Our skills already do this better — `d:L=>` template functions are
   typed, debuggable JS. No action; noted so nobody re-invents it.

## What not to do

Do not plan to extract D2's balance numbers from this repo. They are not in it.
If the real tables are wanted they come from a Diablo II install, and copying
Blizzard's values into a shipping game is a licensing question, not a technical
one. The schema is the reusable part, and the schema is public knowledge
documented in these 173 files.
