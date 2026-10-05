# PROGRESS

Working log for the story + production-quality pass described in `PLAN.md`.
See `git log` for the authoritative order of changes.

**Published.** The Artifact at <https://claude.ai/artifact/5i4v5MTCPoKQjHbi14NCxg> carries
this work (version 56). `./build.sh` writes both dist files; republishing after further
edits just means publishing `dist/unsubscribe.html` to that same URL again.

---

## Done

### Build and tooling
- **`build.sh` writes both dist files.** It previously wrote only
  `dist/unsubscribe.html`, so `dist/Unsubscribe-2087-standalone.html` could drift
  silently. The wrapper swaps the fragment's bare `<title>` line for a real `<head>`;
  verified it reproduces the previously committed standalone byte for byte.
- **`tools/patch.py`** — assert-then-replace helper. Every edit must match its anchor
  exactly once or the script aborts before writing anything. All source edits in this
  session went through it; nothing was hand-edited.
- **`tools/smoke.js`** — boots `dist/unsubscribe.html` under Playwright, walks all 34
  zones, renders every sheet tab, fails on any page error. `node tools/smoke.js [outdir]`.
  Currently 34/34 zones, no errors.
- **`tools/smoke-acts.js` un-stalled.** Its input path pointed at a machine that is not
  this one. It now reads `dist/`, defaults its output to a temp folder, reads the dialog
  title from the right element, and exits non-zero on a page error. It walks the prequel
  and Acts IV–V end to end, including the three-way ending, clean.

### Story — the three machines (PLAN 1.1)
The novel's own notes name the three machines as what readers lose track of. The game
made it worse: two of the three had no name, and the kind machine and the hostile one
were both "a machine that chooses what people see".

- **Phonix is named**, from the title screen and opening cinematic onward. Her *nature*
  is still the Act IV reveal; only the name moved earlier.
- **The difference between her and MANDATE is stated once, plainly**, in INTRO slide 3
  and again in the title blurb — which previously opened on "The Gentle Years ended in
  2035", meaning nothing to a non-reader and not saying who ended them.
- **Act III's ending says the slab was a room, not the mind.** The Act IV intro had been
  assuming the player already knew this.
- **STILLWATER** is named in Act V by the Old Drive, and the town's name pays off —
  Gramps wonders about it in Act I, the Old Drive answers it in Act V.
- **PROVIDENCE**'s reveal keeps its place but now says who built it, when and why.
- The Curator's boss title is `The Curator · Phonix`. Vale and the Act II ending now name
  Phonix instead of saying "she" to a player who has no referent for it.

### Story — the Story tab (PLAN 1.2)
New `story` sheet tab (`STORYDEX` in `src/p11.js`, rendered in `src/p4.js`). Five
sections: the three machines, what happened before you were born, money, vocabulary,
people. **Entries unlock from existing save state** (`G.act2..5`, `G.q.*`, `G.module`,
`G.sq`) — no new save fields were needed for unlocking, so old saves work. Seen entries
are tracked in `G.sdx`; new ones carry a cyan flag plus a dot on the tab. Locked entries
show their title and where to go and find out, so the tab doubles as a signpost. A toast
five seconds after the opening points first-timers at it (`sdxNudge()`, guarded by
`G.sdxTold`).

### Story — canon weight in Acts I–III (PLAN 1.4)
Eight new memos and eleven new gossip lines carrying beats the game only had in Acts
IV–V: Halloran, Natalya's refusal at eleven at night, the nine days, the town's name.
Per the novel's own rule that **the opposition gets one argument nobody refutes**,
Mr. Float gets a memo making the case for credit, and another states what hard money cost
Ines's father. Neither is answered anywhere in the game.

### Story — items (PLAN 1.5)
**Acts IV and V had no uniques at all.** The highest item level in the game was 34; those
districts run 45–72, so the two acts the book is actually about paid worse than Act III.
Eleven new uniques fill it, each carrying a beat the fight cannot stop to tell: The Eleven
Pages, Out Where, Nurse's Hours, Four Thousand Two Hundred and Eleven, Eighty-Two Minutes,
Ten Minutes, Not Your Keys, Uncertain Knowledge, Twenty-One Million, plus a boss drop each
for The Curator and PROVIDENCE. Two needed real engine hooks (`tenmin`: +60% against an
untouched machine; `e82`: guaranteed deadly strikes for 3s after a dodge) and both are
verified firing. The rest use existing affix/grant machinery. The endgame unique pool now
grows 33 → 41 distinct items between item level 47 and 72.

### Renderer (PLAN 2.1–2.6)
- **Ambient light rework.** `AMBC` tints the shadow veil per style; a source-atop pass
  tints the veil inside coloured lights so lamps warm their surroundings instead of
  cutting grey holes; a broad weak fill light sits under the player's lamp with strength
  derived from the floor palette's luminance (`TX.fill`), so dark zones lift and pale ones
  (Rack Nine, the Vaults, the Mezzanine) don't wash out. Falloff is wider and softer; the
  vignette was pulled back from .5 to .34.
- **Per-zone weather** (`WX` + `weather()`) replaces the single mote field: rain,
  data-rain, embers, dust, sinking letters, spores, drifting blobs. Two layers; the near
  one parallaxes against the camera.
- **Twelve new floor-detail and seven new wall-face styles** (`FD`, `WD`) for zones that
  borrowed another style's art, each drawing the sentence in its own zone intro.
- **Floor palettes that rendered as black lifted**: chain, mempool, blocks, room, vault,
  still, lake. The chain's walls were toned down once they became visible.
- **Layered parallax backdrops.** Each of the four backdrop kinds now has three silhouette
  bands at three parallax rates with lit windows in the far ones.
- **Rim light** on figures and heavy frames from the zone's own light colour; contact
  shadows are a soft spread plus a tight core.
- **The Curator and PROVIDENCE have their own silhouettes.** boss4 was drawing the Act I
  Vice-President with a text-glyph face; boss5 reused the Act III slab unchanged. The
  Curator keeps the executive frame (her intro says it is the only body these machines
  know how to build) but with open hands, a drawn smile that flattens below half life, and
  six attending lights. PROVIDENCE is a taller slab fanned by the forty-one ways it has
  modelled the conversation going; the fan goes out as its life does.
- **`zoneMusic()` hardened** — it resolved a track key through `STY[...].like` and threw
  when a style stopped borrowing one.

**Performance.** The first cut of the backdrop work dropped the chain zone from 52 to 29
fps under software rendering, because two full-screen gradient rasterisations per frame
cost more than every other backdrop draw combined. The static part of each backdrop and
the vignette are now baked once per style and viewport and blitted; the veil-tint pass
skips anything smaller than a real lamp; the densest particle fields were trimmed. Final
measurement: **45–48 fps against a 46–52 fps baseline** across zones 1, 3, 13 and 28.

---

## Not done, and why

- **Acts III–V balance is still unmeasured.** The pre-existing known gap, untouched. I did
  not write a balance bot; `tools/smoke.js` proves the game runs, not that it is tuned.
  The eleven new uniques are first-guess numbers in the same sense boss4/boss5 already
  were — they are strong, and nothing has measured whether they are *too* strong.
- **Cloud/account save paths are still untested.** Unchanged from before; they need a
  signed-in browser, which this environment does not have. The save-shaped changes I made
  (`G.sdx`, `G.sdxTold`) are additive and absent-safe: `sdxUnseen()` and `sdxSeen()` both
  tolerate a missing object, so an old save loads and simply shows every entry as new.
- **Companion feel and party-pressure step logic** — untouched. Still first guesses.
- **No new art assets.** There are none in the project and none can be made; everything
  above is drawing code.
- **Acts I–III quest *structure*** is unchanged. I rewrote framing text, not quest design.
  The quests are still all "go to district N and break the named thing", which is fine for
  a Diablo-like but is the place to look if you want the acts to feel less uniform.

---

## Things to know if you pick this up cold

- **Patch with `tools/patch.py`, not by hand.** Source lines run to hundreds of characters
  and a sloppy `sed` will silently hit the wrong one. The helper refuses to write unless
  every anchor matched exactly once.
- **Screenshots lie unless the fog is lifted.** Entering a zone opens a dialog, and
  `update()` does not run while a dialog is up, so `W.seen` stays empty and the map draws
  nothing at all — you get a backdrop and a floating player and conclude the zone is
  broken. Dismiss every `#dBtns button:not([disabled])` (some lock for 4s) *and* move the
  player before judging a frame. I lost a while to this.
- **`STY[style].like` is load-bearing for three things**: the texture base, the prop set in
  `drawObj`, and the music track in `zoneMusic`. Removing it to give a style its own art
  breaks audio. Keep `like` and override the drawing via `FD`/`WD` instead.
- **A unique's `sp` string is display text only.** The actual effect is keyed on the
  unique's `id` as `S.sp.<id>` and has to be coded wherever it applies. A new unique with a
  new `id` and a prose `sp` will read correctly and do nothing. Either hook it or use
  `sp:null` with strong mods and a `grant`, which is generic and needs no code.
- **Republishing** needs the live artifact read first; the tool refuses a blind publish,
  and the gate wants the saved copy actually read through with the Read tool.
