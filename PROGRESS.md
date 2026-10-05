# PROGRESS

Working log for the story + production-quality pass described in `PLAN.md`.
Last updated mid-session; see `git log` for the authoritative order.

---

## Done

### Build
- **`build.sh` now writes both dist files.** It previously wrote only
  `dist/unsubscribe.html`, so `dist/Unsubscribe-2087-standalone.html` could drift
  silently. The wrapper swaps the fragment's bare `<title>` line for a real `<head>`;
  verified it reproduces the previously committed standalone byte for byte.
- **`tools/patch.py`** — assert-then-replace helper. Every edit must match its anchor
  exactly once or the whole script aborts before writing. All source edits in this
  session went through it.
- **`tools/smoke.js`** — boots `dist/unsubscribe.html` under Playwright, walks all 34
  zones, renders every sheet tab, fails on any page error. `node tools/smoke.js [outdir]`.
  Currently: 34/34 zones, no errors.

### Story — the three machines (PLAN 1.1)
The novel's own notes name the three machines as the thing readers lose track of. The
game made it worse: two of the three had no name, and the kind machine and the hostile
one were both "a machine that chooses what people see".

- **Phonix is named**, from the opening cinematic onward. Her *nature* is still the
  Act IV reveal; only the name moved earlier.
- **The difference between her and MANDATE is stated once, plainly**, in INTRO slide 3.
- **Act III ending now says the slab was a room, not the mind.** The Act IV intro had
  been assuming the player already knew this.
- **STILLWATER** is named in Act V by the Old Drive, and the town's name finally pays
  off — Gramps wonders about it in Act I, the Old Drive answers it in Act V.
- **PROVIDENCE**'s reveal keeps its place but now says who built it, when, and why.
- The Curator's boss title is now `The Curator · Phonix`.

### Story — the Story tab (PLAN 1.2)
New `story` sheet tab (`STORYDEX` in `src/p11.js`, rendered in `src/p4.js`). Five
sections: the three machines, what happened before you were born, money, vocabulary,
people. Entries unlock from existing save state (`G.act2..5`, `G.q.*`, `G.module`,
`G.sq`) — **no new save fields were needed for unlocking**, so old saves work. Seen
entries are tracked in `G.sdx` and new ones carry a cyan "new" flag plus a dot on the
tab. Locked entries show their title and where to go and find out, so the tab doubles as
a signpost. A toast five seconds after the opening points first-timers at it
(`sdxNudge()`, guarded by `G.sdxTold`).

### Story — canon weight in Acts I–III (PLAN 1.4)
Eight new memos and eleven new gossip lines carrying beats the game only had in Acts
IV–V: Halloran (right for twenty years, gained nothing), Natalya's refusal at eleven at
night, the nine days, the town's name. Per the novel's own rule that **the opposition
gets one argument nobody refutes**, Mr. Float gets a memo making the case for credit, and
another memo states what hard money cost Ines's father. Neither is answered anywhere.

### Renderer (PLAN 2.1, 2.2, 2.5)
- **Ambient light rework.** `AMBC` tints the shadow veil per style; a source-atop pass
  tints the veil inside coloured lights so lamps warm their surroundings; a broad weak
  fill light sits under the player's lamp with strength derived from the floor palette's
  luminance (`TX.fill`), so dark zones lift and pale ones don't blow out. Falloff is
  wider and softer; the vignette was pulled back from .5 to .34.
- **Per-zone weather** (`WX` + `weather()`) replaces the single mote field: rain, data-
  rain, embers, dust, sinking letters, spores, drifting blobs. Two layers; the near one
  parallaxes against the camera.
- **Twelve new floor-detail and seven new wall-face styles** (`FD`, `WD`) for zones that
  used to borrow another style's art. `floorDetail`/`faceDetail` now take the real style
  as a last argument and branch on it before the old `like`-based code.
- **Floor palettes that rendered as black lifted**: chain, mempool, blocks, room, vault,
  still, lake. Chain walls toned down now that they are visible.
- **`zoneMusic()` hardened** — it resolved a track key through `STY[...].like` and would
  throw if a style stopped borrowing one.

---

## In flight / next

In `PLAN.md` order, not yet started:

- **2.3 Backdrop depth** — `backdrop()` has four kinds, each one flat layer. Needs a
  mid-ground silhouette band so distance reads.
- **2.4 Rim light** on player, companions and enemies from the nearest light source.
- **2.6 Boss silhouettes** — `boss4` (The Curator) still draws the Act I VP sprite with a
  `:)` / `:(` faceplate, and `boss5` (PROVIDENCE) reuses the Act III `mono` slab. Both
  should be distinct.
- **1.3 Act seams** — partly done via the act-complete dialogs; the act *intros* could
  still restate the spine for a player returning after a week.
- **1.5 Quest and item text pass** — quest `d` strings mostly carry their why already;
  the uniques referencing the book have not been audited.

---

## Not done, and why

- **Acts III–V balance is still unmeasured.** The pre-existing known gap. I did not
  write a balance bot; `tools/smoke.js` proves the game runs, not that it is tuned.
- **Cloud/account save paths are still untested.** Unchanged from before — they need a
  signed-in browser, which this environment does not have. The one save-shaped change I
  made (`G.sdx`, `G.sdxTold`) is additive and absent-safe: `sdxUnseen()` and `sdxSeen()`
  both tolerate a missing object, so an old save loads and simply shows every entry as
  new.
- **No new art assets.** There are none in the project and none can be made; everything
  above is drawing code.

## Things to know if you pick this up cold

- **Patch with `tools/patch.py`, not by hand.** Source lines are hundreds of characters
  long and a sloppy `sed` will silently hit the wrong one.
- **`tools/smoke-acts.js` is stale** — its input path is `/home/claude/unsubscribe.html`,
  which does not exist here. I left it alone rather than guess at the author's setup;
  `tools/smoke.js` is the one that runs.
- **Screenshots lie unless the fog is lifted.** Entering a zone opens a dialog, and
  `update()` does not run while a dialog is up, so `W.seen` stays empty and the map draws
  nothing. Dismiss `#dBtns button:not([disabled])` *and* move the player before you judge
  a frame. I lost a while to this.
- **`STY[style].like` is load-bearing for three things**: the texture base, the prop set
  in `drawObj`, and the music track in `zoneMusic`. Removing it to give a style its own
  art breaks audio. Keep `like` and override via `FD`/`WD` instead.
