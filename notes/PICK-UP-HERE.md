# Where to pick up

Branch `claude/unsubscribe-2087-story-fb99ov`, all pushed. Working from the ten
items in `notes/AUDIT-2026-10-10.md`, in the priority order agreed on.

## Done

| # | Item | Outcome |
|---|---|---|
| 1 | Branch triage | 130 branches were four chains. `all-hands-look-3887` merged: the All-Hands cabinet, the StarCraft eggs, item skills, stat requirements, the desk mouse. 77 carry nothing -- list and command in `notes/dead-branches.md`. |
| 2 | Label and bubble collisions | `LBOX` in `render()`; names and bubbles take a slot. Town square went from 7 overlapping pairs to 0. `tools/label-space.js`. |
| 3 | Drop frequency by party size | **Already done** in the merged work. `partyNoWeight` matches D2's `1 - 0.75^n` exactly at every size, 1 to 8. Covered in `server/test/live.js`. Nothing was needed. |
| 4 | Readability at eight players | `mpDraw` was the one piece of world text that never claimed room; fixed. `tools/eight-up.js` proves eight names place and Thin still drops other people's casts. Frame cost is a non-issue: 1.0ms median with eight. |
| 8 | Stranded side content | Landed with the #1 merge. |

## Next, in order

**5. Hostility friction.** Only `safeUntil` exists. D2 also had: hostility declared
in town only, a level floor, a cooldown before it takes effect, and town portals
destroyed on declaring. `server/lib/live.js` holds the hostility state;
`src/p13.js` holds `mpHostileTo` and the declare path. A day's work, and the one
place where a design call is wanted before building: how punishing to make it.

**6. Items: truncation and badge overlap.** Cheap. The Items sheet is in `p4.js`,
`drawSheet()` under `tab==='items'`.

**7. Tree glyphs legible at 390px.** Cheap. `glyph()` in `p3.js`, skill tree in `p4.js`.

**9. A second secret class, found not unlocked.** New content, a day.

**10. Compare-on-hover for gear.** Mostly delivered already by the +/-% badges. Last.

## Open, not blocked on me

- **Branch deletion is refused from a cloud session.** Pushing works; deleting a
  ref returns HTTP 403, and the GitHub tools here have no branch-delete call. The
  verified list and a one-line command are in `notes/dead-branches.md`. Run it
  from a clone with push rights. `all-hands-look-3887` is merged now, so it can go
  too, making 78.
- **`tools/vfx-wire-check.js` fails on main and is not my doing.** It expects skill
  effect mappings -- anon 1 a trail, witness 12 a patch -- that live only on
  `cursor/skill-vfx-wire-3941`. The check landed, its table did not. Merge that
  branch or port the SKV change. It is off the delete list for this reason.
- **`server/test/lan.js` has never been run for real.** It needs a host with an
  RFC1918 address; this container only has a documentation address. It is meant
  for the MacBook. One assertion in it was impossible on any machine (it bound a
  client socket to 203.0.113.9) and is fixed, but the other 21 are unproven.
- **`tools/classes.js` fails here only.** The build loads a Google Font and this
  sandbox intercepts TLS, so the browser logs a certificate error and the check
  treats any console error as failure. Zero FAIL lines; it passes on a normal
  network.
- **`text/GAME-TEXT.md` and `.docx` are yours to edit by hand.** Import with
  `node tools/text/import.js`, and `tools/text/roundtrip.js` proves export,
  import, build and smoke still agree. Regenerate with `node tools/text/export.js`.

## State

546 server assertions (526 + 20 deploy), twelve content checks, `label-space`,
`eight-up`, 34/34 zones, acts walk clean. Build 357KB gzipped, up from 241KB
before the merge.
