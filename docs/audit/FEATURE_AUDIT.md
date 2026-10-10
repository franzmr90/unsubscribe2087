# Feature audit — Unsubscribe 2087

First pass: `cursor/input-layout-3941` at `c188878`, written up on `cursor/feature-audit-3887` (PR #101). This pass: `cursor/audit-fixes-3887`, stacked on that branch. Date: 2026-10-08.

The first pass graded the draft and did not change gameplay. This pass fixed the confirmed bugs, rebuilt the page, and replayed every Partially works or Couldn't verify row this host can exercise without a paid account. Grades below are the current ones. Harnesses: `tools/audit-*.js` from the first pass, `tools/audit2-fixes.js` for the bug fixes, and `tools/audit2-play.js` for the long play. A passing unit test was not treated as proof.

`notes/codebase-inventory.md` now says 8 classes and 89 uniques. `PLAN.md`, `HANDOFF.md`, and `PROGRESS.md` still carry the older counts as history, and those files were left as they were.

## Counts

238 features.

| Grade | Count |
|---|---|
| Works | 191 |
| Partially works | 12 |
| Broken | 0 |
| Not actually built | 4 |
| Couldn't verify | 31 |

The 191 includes all 120 skills. Each active skill set a cooldown when its gate was satisfied, and each passive took a rank. Shed and Correction refuse until you are wearing a chassis or have a loss to correct. Both succeeded once that was true.

## Fixed in this pass

1. **Hard and Brutal experience uses `DIFFS.xp`.** At level 8 a tick kill paid Normal, Hard, and Brutal in the ratio 1 : 1.20 : 1.45. `gainXp` multiplies that factor. Normal `xpM` stayed between 0.9 and 1.25, so the life and damage multipliers stay on the monster.
2. **A right click on a machine walks into range and hits.** Shift stays put (moved less than 0.2). The held-cast retry still latches when energy is empty and fires when it returns. Drag-to-aim still completes on a press, drag, and release, on the desk and on touch. The controls page now says a right click on a machine walks you in, and a right click on the ground stays where you point.
3. **Brenda’s pack sale pays on one click.** The button reads “Sell everything in the pack” plus the price. Charms stay out of the sale.
4. **The desktop right-slot badge shows the bound key.** F3 when that key holds the skill, and R when nothing is bound.
5. **The Word export writes a docx with no pandoc.** `npm run text:roundtrip` exports first, so a clean tree succeeds, and the smoke check uses system Chrome.
6. **Named unique specials do what the tooltip says.** Exit Interview counts lieutenants (1.5× a plain machine). Dead Letter pierces the player’s own throws (99) and leaves a minion at 0. Blank Check raises the Intern cap by two and multiplies a workforce strike by 1.25. Flavor uniques are listed under design calls.
7. **The inventory note matches the build:** 8 classes, 15 skills each, 89 uniques.

## Still open, by player impact

1. **A Normal act boss kills a prepared Scrapper before the boss falls.** Damage lands. Pryce took 2013 of 14064 (life 415, weapon 39). Vale took 1611 of 54251 (771, 77). MANDATE took 103568 of 181577 (971, 126). The Curator took 80346 of 332922 (1277, 124). PROVIDENCE took 57984 of 538580 (1728, 117). The character had a rare weapon, stims, a bodyguard, and more skill ranks than that level would have earned. Grade: Partially works. This is a tuning call.
2. **Town trade records the item ids the clients send.** An honest pair swapped a helm and a ring. The server does not take the items into custody first. Grade: Partially works. Hint: trade confirm in `server/lib/live.js`.
3. **The bodyguard fights and revives.** Juno dealt about 33 and the revive button brought them back. Recall to Kestrel was not clicked. Grade: Partially works.
4. **The companion fights, and the Founder leash was not walked.** The companion dealt about 197. Party pressure stepped from 0 to 1 after 12 kills under 0.45 seconds. Grade: Partially works.
5. **Sysadmin and hound did their jobs when assigned.** The node runner was not hired from the sheet. Grade: Partially works.
6. **Bull Run, the subpoena, and the boss-rush payout play.** Nodes, proof-of-work shrines, and a normal Simulator wave were not clicked. Grades: Partially works on the sink row and the Simulator row. The places themselves work.
7. **One doctrine was chosen (`picket`).** Weapon families and a class-unique drop were not identified.
8. **Reconnect put the same account back in game `g1` through Continue.** Account invites and the beta caps were not exercised.
9. **Space swings, and the rest of that codex row was not pressed.** Q, E, T, I, B, C, H, Esc, and Alt.
10. **The Mac launcher matches the shell script, and that script served HTTP 200 from the zip layout.** The Windows `.bat` was not executed here.
11. **Main-quest conversations and return steps for q1–q25 were not walked.** Boss kills still complete the five act quests.
12. **Forty uniques are stats and flavor (`sp` is null).** They are listed under design calls. Rubber Duck shoots the nearest machine.
13. **Four claimed systems are absent on purpose.** Lightning sats, the auction house, a server that decides monster life and hit damage, and a player directory.
14. **A cleared district stays cached.** Hard and Brutal unlock through the options buttons once `diffGate` is 1 and then 2. The second PROVIDENCE kill needs a fresh enter, because the cleared room has no boss until it is reset.
15. **Thirty-one rows still need a host, a person, or a click this session did not make.** Appendix D lists them.

## Design calls for Micah

These were left as they are.

- Act-boss life on Normal, especially Acts III–V. The numbers are in item 1 above. Companion feel and the party-pressure step size were exercised (pressure did move from 0 to 1) and were not retuned.
- Uniques whose `sp` is null are stats plus flavor. The ids: `review`, `seat`, `allhands`, `output`, `rate`, `audit`, `coupon`, `elevenpages`, `outwhere`, `hours`, `fourthousand`, `copy`, `visor`, `visitor`, `holding`, `coldopen`, `minority`, `bell`, `drawer`, `floor`, `reading`, `waitlist`, `redline`, `kitchen`, `notyourkeys`, `uncertain`, `twentyone`, `theroom`, `firm`, `signin`, `lastquorum`, `docket`, `unsent`, `after`, `memo`, `suit`, `question`, `century`, `blankpage`, `lamp`.
- Rubber Duck fires at the nearest machine. The tooltip can be read as “the one you just shot.”
- Town trade trusts the item ids the two clients report.
- “Two more Interns” on Blank Check is a higher cap (2 to 4), and one cast still summons one Intern.
- A second kill of PROVIDENCE on a harder difficulty needs the district entered fresh. The options buttons themselves follow `diffGate`.

## What was played

Desktop (1280×800) and touch (390×800, `hasTouch`) through Playwright, `executablePath` set to `/usr/local/bin/google-chrome`. `tools/smoke.js` now launches that Chrome. The bundled Playwright Chromium is still not installed.

The first pass used `window.__g` to change class, zone, items, and difficulty, and used the real buttons for the skill sheet, the web, Brenda, the merc sheet, the options toggle, the ending dialog (after its 4 second lock), and the bug form (after its 4 second lock). Two clients registered on `server/server.js` with `LAN=1`, created a game, joined, partied, shared a kill’s experience, received a Maximalist aura, swapped items in town, and declared hostile.

This pass added the fix harness and a long play: each Normal act boss at that act’s level, the difficulty buttons after a real PROVIDENCE death, merc hire and revive, sysadmin and hound, companion combat and party pressure, Bull Run, a served subpoena, the boss rush lineup and payout, a full press-drag-release ground cast on the desk and on touch, a touch-stick fight, the death fee and a hardcore fee of 0, two LAN clients on one map seed and one monster’s life, a hostile hit, a town trade, a reconnect through Continue, and the shell launcher from the zip layout.

Screenshots from the first pass are in `docs/audit/evidence/`. This pass adds `docs/audit/evidence/audit2-*.png`. The same frames, the Drop HTML, and the LAN zip are under `/opt/cursor/artifacts/audit2/`.

The first long harness mis-graded several rows. Later runs replaced those grades. The checklist uses the later result.

## Grades

- **Works** — the player-facing action did what the claim says, in this session.
- **Partially works** — part of the claim happened, and the note says what did not.
- **Broken** — the action was run and the result contradicted the claim. Repro, expected, and actual are in the note. The file hint is a place to look, not a fix.
- **Not actually built** — a claim source says it is absent, and the code matches that.
- **Couldn't verify** — the system is in the build, or the claim needs a host this machine does not have, and this session did not complete the player-facing action.

## Checklist

The same rows are in `docs/audit/feature-audit.csv` (`area`, `feature`, `claim source`, `grade`, `notes`, `evidence path`).


### core

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| One self-contained HTML page loads and reaches the title | Works | README; CLAUDE.md; build.sh | Playwright setContent of dist/unsubscribe.html on system Chrome. The title and class list came up. |
| Title lists the seven classes a new account can start | Works | src/p1.js CLS; src/p12.js maxiCheck; README | Buttons: Scrapper, Technomancer, Runner, Anon, Founder, Homesteader, Witness. The Maximalist is absent until the story flag. Evidence: `docs/audit/evidence/02-title-classes.png`. |
| Disclaimer gate before a new game | Works | src/p4.js skipDisc | The disclaimer is on screen at load and can be skipped from the debug hook or its button. Evidence: `docs/audit/evidence/01-title-disclaimer.png`. |
| Debug hook window.__g on a local page | Works | src/p4.js; TESTING.md | Exposes G, W, P, enter, kill, update, and the sheets. Present because the page is local. Used to reach acts, items, and classes. Player boot was also used for the save and the touch HUD. |

### controls

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Desktop layout hides the touch stick | Works | README; src/p4.js uiProbe; PR #100 | 1280×800 mouse viewport: data-ui=mouse, #pad and #stickzone hidden, #mL and #mR shown. Evidence: `docs/audit/evidence/03-town-desktop.png`. |
| Touch layout shows the stick and hides the mouse slots | Works | README; src/p4.js uiProbe; PR #100 | 390×800 hasTouch/isMobile: data-ui=touch before and after starting, pad shown, stick zone width 206, mouse slots hidden. Evidence: `docs/audit/evidence/13-touch-hud.png`. |
| Layout follows the last real input inside one session | Works | PR #100 title and body | A desktop page started on the mouse. noteInput('touch') in that same page set data-ui=touch, showed the stick, and hid the mouse slots. Evidence: `docs/audit/evidence/audit2-touch-fight.png`. |
| Left click on open ground walks there | Works | README; src/p2.js setMouseOrder; PR #83 | mouseClick on a walkable world tile: order move, distance 5.7 to 0.37. An earlier screen click landed on the top bar (#tbs, y≈66) and did not walk. That was the click target, not the walk order. |
| Left click on a machine walks in and strikes | Works | README; PR #83 | Order atk. Machine life 11.385 to 0.54. Evidence: `docs/audit/evidence/04-click-attack.png`. |
| Right click on a machine walks into range and casts | Works | README; src/p4.js CTRL; src/p2.js setMouseOrder | Renamed in this pass: an unshifted right click on a machine now walks into range and casts. A bot five tiles away lost life after the character closed the gap. Shift on the same setup moved less than 0.2. A held click with empty energy latched dry=1 why=wait and fired once energy returned. Drag-to-aim is its own row. Evidence: `docs/audit/evidence/audit2-play-desktop.png`. |
| Number key 1 fires the bound left slot | Works | src/p4.js keydown Digit1; codex CTRL | Digit1 set the skill cooldown from 0 to 0.3. |
| F1 through F8 bind a skill and recall it in a fight | Works | src/p4.js CTRL; paintMouseSlots | The bound F-key put skill 4 on the right slot during a fight. |
| Right-slot badge shows which F-key is bound | Works | src/p4.js paintMouseSlots; codex | Binding the right slot to F3 painted the badge F3, and the tooltip named F3. An unbound right slot painted R. Evidence: `docs/audit/evidence/audit2-badge-f3.png`. |
| Mouse wheel cycles the right-slot bindings | Works | src/p4.js CTRL | The wheel moved the right slot from skill 4 to skill 0. |
| Shift-click swings or casts without a step | Works | src/p4.js CTRL | Shift and a right click on a machine five tiles away moved the character less than 0.2. |
| WASD and the arrow keys walk | Works | src/p4.js CTRL; README | KeyD and KeyS moved the character 5.47. The arrow keys share that walk branch (ArrowLeft with KeyA, and the same pairing for the other three). |
| Space, Q, E, T, I, B, C, H, Esc, and Alt do what the codex says | Partially works | src/p4.js CTRL | Space swung. Q, E, T, I, B, C, H, Esc, and Alt were not pressed in this pass. |
| Hold a mouse button to keep walking or casting | Works | src/p4.js CTRL | A held right click with energy at 0 latched dry=1 and why=wait. Refilling energy fired the skill. That is the held-cast retry from PR #98. |
| Drag to aim a ground skill | Works | PR #99; src/p4.js beginAim; OPT.aim | Desktop, aim set to drag: hold Digit1, move, release. Earthbreaker cooldown went to about 5.73. Touch press, drag, and release on the skill button set the cooldown to about 5.81. Dragging back onto the button to cancel was not the path played. Evidence: `docs/audit/evidence/audit2-drag-aim.png`. |
| Touch stick and thumb buttons fight | Works | README; codex touch string | On a 390×800 touch viewport the stick drag moved the character about 1.59 and the attack button dealt about 270. data-ui stayed touch. Evidence: `docs/audit/evidence/audit2-touch-fight.png`. |
| Codex on a desk does not tell you to use a joystick | Works | src/p4.js CTRL; tools/controls-copy.js; PR #100 | The open codex contains left-click walk and strike copy and does not mention the stick. Evidence: `docs/audit/evidence/sheet-codex.png`. |

### classes

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Eight classes exist, each with fifteen skills | Works | src/p1.js CLS; notes/PLAN-eight-classes.md | 120 skills were ranked or cast. notes/codebase-inventory.md now says 8 classes and 89 uniques. |
| The Maximalist stays off the title until the story is finished | Works | src/p12.js maxiCheck | After q25 is complete, maxiCheck sets the account flag and the class can be started. |
| A skill point from the skill sheet raises a rank | Works | src/p4.js data-learn | Selecting a node and clicking learn moved rank 0 to 1. Evidence: `docs/audit/evidence/sheet-skills.png`. |
| The passive web accepts a point | Works | src/p7.js WARMS; src/p4.js data-web | Clicking the first node of an arm (data-web 0_1) placed it. Points 19 to 18. The plus button is not in the tree until that first node exists. |
| Homesteader Shed leaves a worn chassis | Works | src/p2.js hsShed | A sweep that cast Shed with no chassis got why=no. After Wear the Hull, Shed cleared the form and set a cooldown. The gate is the chassis. |
| Witness Correction heals a recorded loss once per district | Works | src/p2.js witness skill 6 | A sweep with no recorded loss got why=no. After life was dropped to 30, Correction raised it to 70 and set corrZi. |
| Skill forks, the dodge stat, and the passive cap | Couldn't verify | src/p7.js; src/p2.js hurt | Fork choices were not picked. Dodge is a roll inside hurt and was not forced. Only one web point was spent, so the cap was not hit. |
| Doctrines, weapon families, and class uniques | Partially works | src/p10.js DOCS, FAM | In town the skill sheet set the doctrine to picket. Weapon families and a class-unique drop were not identified in play. The Maximalist has no weapon-family table. |
| Scrapper — Stop Sign | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Hurl | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Iron Hide | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Scrapper — Turnstile | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Picket Rush | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — War Horn | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Overtime | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Earthbreaker | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Solidarity | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Scrapper — Lunch Pail | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Seniority | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Scrapper — Hold the Line | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Scrapper — Call the Strike | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Two-Handed | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Scrapper — Last Shift | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Arc Chain | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Spark Lance | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Cipher Ward | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Technomancer — Null Nova | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Watchdog | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Overclock | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Technomancer — Black Storm | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Botnet | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Zero Day | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Technomancer — Ground Fault | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Packet Storm | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Schema | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Technomancer — Step Back | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Technomancer — Patched | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Technomancer — Kill Dash Nine | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Scatter Shot | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Fleet Step | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Evasion | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Runner — Lure | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Tack Strip | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Scavenger | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Runner — Rush Order | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Signed For | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Deadeye | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Runner — Return to Sender | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Route Knowledge | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Runner — Second Drop | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Manifest | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Runner — Hazard Pay | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Runner — Missed Connection | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Honeypot | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Proxy Hop | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — OpSec | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Anon — Logic Bomb | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Incognito | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Dox | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Zip Bomb | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Sockpuppet | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Legion | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Rehearsal | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — The Dump | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — No Attribution | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Anon — Dead Drop | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Anon — Cutout | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Anon — We Were Never Here | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Interns | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Cease & Desist | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Equity | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Founder — Contractors | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Crunch | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Mech Suit | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Chief of Staff | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Acqui-hire | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Layoffs | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Garden Leave | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Non-Compete | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Vesting | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Founder — Term Sheet | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Founder — Org Debt | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Founder — Liquidation | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Cold Frame | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Wear the Hound | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Strays | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Compost | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Wear the Hull | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — The Bull | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Hedgerow | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Shed | Works | src/p1.js CLS; src/p2.js castIndex / SKF | The sweep cast it with no chassis and it refused. A follow-up after Wear the Hull left the chassis and set a cooldown. Graded from that follow-up. |
| Homesteader — Go Feral | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Homesteader — Kill Frost | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Wear What You Killed | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Rootbound | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Homesteader — Salt the Earth | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Homesteader — Too Big for the Door | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Homesteader — Slaughter Weight | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — Look | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — The Sentence | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — Margin | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Witness — Cross-reference | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — Pull the Thread | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — Filed | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Witness — Correction | Works | src/p1.js CLS; src/p2.js castIndex / SKF | The sweep cast it with no recorded loss and it refused. A follow-up healed 30 to 70 and stamped the district. Graded from that follow-up. |
| Witness — Redaction | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — The Footnote | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Witness — On the Record | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — Unnamed Source | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — Colophon | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Witness — Publish | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| Witness — Named Party | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| Witness — Retraction | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| The Maximalist — Tick Tock Next Block | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Have Fun Staying Poor | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Few Understand This | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| The Maximalist — Toxic Maximalism | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Marked to Market | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Orange Pill | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Blessed Hashrate | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Proof of Work | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Twenty-One Million | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| The Maximalist — The Halving | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Running a Node | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| The Maximalist — Cite Your Sources | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Priced in Sound | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |
| The Maximalist — The Dip | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Active cast set a cooldown (why=ok). |
| The Maximalist — Not Your Keys | Works | src/p1.js CLS; src/p2.js castIndex / SKF | Passive took a rank. |

### mercs

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Kestrel hires a bodyguard that stands in the district | Works | src/p1.js MERCS; src/p4.js data-hire; PR #80 | Hire button was enabled. Cost 1700 credits at level 30. W.merc kind guard was on the field. Evidence: `docs/audit/evidence/08-merc.png`. |
| Sysadmin, node runner, and hound can be hired | Partially works | src/p1.js MERCS | The bodyguard was hired from the merc sheet. A sysadmin set as the merc mended about 52 life once the other machines were cleared. The hound shot. The node runner was not hired from the sheet. |
| A hireling fights, recalls, and can be revived for a fee | Partially works | PR #80; Kestrel gossip; PR hireling recall | Juno the bodyguard dealt about 33, died, and the revive button brought them back. Recall to Kestrel was not clicked. Evidence: `docs/audit/evidence/audit2-merc-fight.png`. |
| Tag-along companion and the Founder leash | Partially works | src/p10.js; CLAUDE.md | A rendered companion dealt about 197 across 50 hits. Party pressure stepped from 0 to 1 after 12 kills under 0.45 seconds. The Founder leash was not walked. The companion body was placed in memory because setContent blocks the second-slot save the tag render reads. |

### items

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| The Cipher Mantle casts an Enigma-style Teleport | Works | src/p12.js ISK 100; src/p1.js unique cipher | Worn unique, item skill on. Cast moved the character 4 tiles (10.5 to 14.5) and set cooldown 0.85. Evidence: `docs/audit/evidence/06-teleport.png`. |
| The other five item skills fire while that unique is worn | Works | src/p12.js ISK 101–105 | Call, book, ledger, bear, and chair each fired on a second pass that set the mode and the slot. The first pass reported them off because that setup was missing. |
| Striker’s Vigil 2-piece and 3-piece bonuses | Works | src/p1.js SETS; src/p2.js calc | Two pieces: +20% damage. Three pieces: +1 skills and the vigil proc flag. Pieces need an affix array or calc throws. |
| Magic and rare affixes, and unique drops stay inside their level band | Works | src/p1.js AFX, UNI; src/p2.js uniqEligible; PR #85 | 34 affix keys, 89 unique definitions, 16 unique rolls. At machine level 8, 24 uniques were eligible. At 70, 20 were eligible. Cross-band leaks: 0. PROGRESS.md’s unique count is lower than the table. |
| Unique specials beyond the six item skills and the one set | Works | src/p1.js UNI | Every special that names a mechanic is wired through S.sp.<id>. Exit Interview now counts lieutenants (damage ratio 1.5 against a plain machine). Dead Letter forces pierce 99 on the player's own throws and leaves a minion at 0. Blank Check raises the Intern cap by two (4 against 2) and multiplies a workforce strike by 1.25. A sp:null entry is stats and flavor. Rubber Duck shoots the nearest machine. |
| Charms and magic-find diminishing returns | Couldn't verify | src/p7.js; MFK | The tables are in the build. No charm was socketed and no magic-find curve was measured on a drop. |

### economy

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Credits are the town money and sats are the scarce money | Works | README; src/p8.js PERS; memos | Both moved in play: a merc hire spent credits, and a market buy added sats. The game does not treat sats as the only currency. |
| Brenda’s shop opens and shows a price | Works | src/p4.js shop; src/p8.js PERS | Talk offers Trade, Leave, and Talk about money. The trade sheet showed credits and a pack price. Evidence: `docs/audit/evidence/07-brenda.png`. |
| Selling the pack to Brenda pays the printed price | Works | src/p4.js sellArm; PR #78 | One click on “Sell everything in the pack” emptied the bag and paid the printed credits. Charms stay out of that sale. Evidence: `docs/audit/evidence/audit2-brenda-sold.png`. |
| Buying five sats from Nonce’s market | Works | src/p8.js mktTrade | Quote filled. Credits went from 10000000 to 9999413. Sats became 5. The fee was inside the total. An earlier “no change” result compared the balance after it had been overwritten. |
| Selling sats, a resting bid, and a filled order | Couldn't verify | src/p8.js; PRs on the market | Only a market buy was submitted. |
| Death fee, and no fee on a hardcore death | Works | src/p2.js deathFee; PR no HC fee | In town, under the early-death cap, credits went from 1000 to 985. A hardcore death changed the purse by 0. The on-screen ₡75.0K line was the previous boss-death panel waiting out its 2.5 second paint. The hardcore Begin again wipe was not clicked. |
| Web respec, shape shift, and skill-point refund spend sats | Couldn't verify | src/p7.js; PRs | The costs are in the code (a full web refund is 5 sats). None of those buttons were paid. |
| Mr. Float’s loan and pledge | Couldn't verify | src/p8.js; PR Float pledge | The conversation exists in the money systems. It was not opened. |
| Subscriptions, social credit, and shitcoiners | Couldn't verify | src/p8.js | Systems are in the build. No bill was paid and no social-credit score was read in play. |
| Nodes, proof-of-work shrines, Bull Run, and the subpoena as sats sinks | Partially works | src/p6.js; src/p7.js; src/p10.js | Bull Run opened after the servo leg and a sats payment (zone 20, about 70 bulls, 4 removed by the kill hook). A level-1 subpoena was served in zone 19. Nodes and proof-of-work shrines were not clicked. Evidence: `docs/audit/evidence/audit2-bull-sub.png`. |
| Shared lockbox deposits and withdrawals | Couldn't verify | src/p10.js ACC | The account lockbox is in the build. Nothing was deposited. |
| Paying vendors and sinks in real sats over Lightning | Not actually built | CLAUDE.md known gaps | Held for later. No Lightning invoice path is in the client. |
| Auction house | Not actually built | CLAUDE.md known gaps | Held for later. No auction board is in the client. |

### story

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| All 34 districts can be entered | Works | src/p1.js ZONES; src/p11.js; CLAUDE.md | After a normal class start, with unlocks set and walkthrough skipped: 34 zones, bad=[], no page errors. Names are in the appendix. |
| Five act bosses spawn, and killing one completes its quest | Works | src/p2.js kill; src/p11.js boss4, boss5 | boss, boss2, boss3, boss4, boss5 came up with about 51k, 82k, 144k, 182k, and 228k life at the level used, and quests q5, q10, q15, q20, q25 went to 3. kill() removes the entity without setting hp to 0, so a later hp read still looks alive. Evidence: `docs/audit/evidence/09-after-boss5.png`. |
| The ending offers leave, wake, and the seventh part | Works | src/p4.js finalChoice; src/p11.js | With the seventh part in hand the dialog shows all three buttons. |
| Giving her the seventh part plays that ending | Works | src/p4.js finalChoice | After the 4 second dialog lock, the button enabled. G.ending became doubt. The scene title was “You give her the part”. Evidence: `docs/audit/evidence/10-ending.png`. |
| The leave-the-world and ask-her-to-come-back scenes | Couldn't verify | src/p4.js finalChoice; src/p9.js fate | Those two buttons were not clicked. Fate’s reserve, stalemate, and fail branches were not walked. |
| Act gates in the transit UI | Couldn't verify | src/p6.js actBriefHold; src/p4.js travel | enter() from the debug hook can open a later district directly. The travel dialog’s hold was not clicked through. A throw from enter() before ensureG was a harness order, not a boot the player hits. |
| Main-quest talk and return steps for q1 through q25 | Partially works | src/p1.js QUESTS; src/p11.js | Boss kills set the five act quests to complete. The conversations, cages, letters, and return-to-town steps for q1–q25 were not played. Quest names are in the appendix. |
| Side quests: shoebox, node, carer, oiler, passage, letter | Couldn't verify | src/p5.js SQ | The side-quest table is in the build. None of those chains were walked. |
| Bounties | Couldn't verify | src/p5.js | The board exists in code. No bounty was accepted or turned in. |
| The Simulator and the boss rush | Partially works | ZONES sim; src/p6.js | With the act bosses marked cleared, the rush lined up 14 lieutenants, advanced through them, set rushDone, and paid 39 sats (2 per lieutenant plus 10 at the end). The downs were one-hit kills, so this is the lineup and the payout. A normal Simulator wave was not played. Evidence: `docs/audit/evidence/audit2-boss-rush.png`. |
| Bull Run and the subpoena as places you play | Works | zones 19 and 20; src/p10.js | Zone 20 opened with the servo leg and the sats, and held the bulls. Zone 19 served the subpoena (done after the lieutenant died). Evidence: `docs/audit/evidence/audit2-bull-sub.png`. |
| The 2015 prequel | Couldn't verify | zone 33; src/p11.js | The zone enters. The cage story was not read through. |
| Acts III–V are tuned so a Normal character can learn the bosses | Partially works | PR #92; CLAUDE.md known gaps | A Scrapper at the act's level, with a rare weapon, stims, a bodyguard, and more skill ranks than that level would have earned, died on every Normal act boss while damage was still landing. Pryce took 2013 of 14064 (life 415, weapon 39). Vale took 1611 of 54251 (771, 77). MANDATE took 103568 of 181577 (971, 126). The Curator took 80346 of 332922 (1277, 124). PROVIDENCE took 57984 of 538580 (1728, 117). Left as a tuning call. Evidence: `docs/audit/evidence/audit2-boss-pryce.png`. |
| Raising the tier after Act I adds 12 machine levels | Couldn't verify | src/p4.js walkthrough How hard; G.tier | The walkthrough says so. More on the transit gate was not used. |

### difficulty

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Hard and Brutal raise monster life | Works | src/p6.js DIFFS; src/p2.js spawn | A zone-1 tick: Normal life about 477, Brutal about 992. Ratio 2.08, which is 2.6/1.25. |
| Hard and Brutal pay the experience the walkthrough describes | Works | src/p4.js How hard; src/p6.js DIFFS.xp; src/p7.js xpM; src/p2.js gainXp | At level 8 a tick kill paid Normal, Hard, and Brutal in the ratio 1 : 1.20 : 1.45. gainXp multiplies DIFFS.xp. Normal xpM stayed between 0.9 and 1.25. The life and damage multipliers stay on the monster. |
| Hard opens after Act V on Normal, Brutal after Act V on Hard | Works | src/p4.js How hard | With the gate at 0 the Hard and Brutal buttons stayed disabled and a click left the difficulty on Normal. The real PROVIDENCE death set the gate to 1, and the Hard button switched the game to Hard. Brutal stayed disabled. A fresh district on Hard, killed the same way, set the gate to 2 and the Brutal button switched on. A cleared district stays cached until it is entered fresh. Evidence: `docs/audit/evidence/audit2-diff-gates.png`. |
| Hardcore is one life | Couldn't verify | src/p4.js How hard; OPT | No hardcore character was killed. |
| Hard and Brutal tax the five combat resists | Couldn't verify | PR #82; src/p10.js RTK | The five resists are impact, surge, rust, heat, and noise. The tax was not measured on a hit. Sound is a separate type that nothing resists, and the damage-type text says that is the point. |
| Adaptive machine scaling | Couldn't verify | OPT.dyn; src/p10.js | The option exists and defaults on. It was not measured across a fight. |
| Co-op Normal, Nightmare, and Hell as their own ladders | Couldn't verify | server/lib/live.js; MULTIPLAYER.md | The live server has its own difficulty field. The two-client game used one district and did not change that ladder. |

### ui

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Hero, items, skills, web, quests, story, codex, and options sheets render | Works | src/p4.js TABS | Each tab produced more than 200 characters of text. Evidence: `docs/audit/evidence/sheet-items.png`. |
| Options toggles write the flag | Works | src/p4.js OPT_LBL | The sound toggle went from on to off. Evidence: `docs/audit/evidence/sheet-opts.png`. |
| Minimap can be toggled | Works | OPT.minimap; Tab | The flag toggled and a map frame was captured. Individual tiles were not checked against the district. Evidence: `docs/audit/evidence/05-minimap.png`. |
| Story and quest text is on the story sheet | Works | src/p4.js story tab; QUESTS | The story sheet rendered. Evidence: `docs/audit/evidence/sheet-story.png`. |
| Equipping, stashing, and the three-slot switcher as clicks | Couldn't verify | src/p4.js items and options | The items sheet and the three slot rows render. Equipping in this pass used tryGear. Stash clicks and slot switching were not done. A file save of one character did reload. |
| Loot filter, auto-attack, auto-stim, thin combat effects, and the other option rows | Couldn't verify | src/p4.js OPT_DEF | The rows are in Options. Only the sound flag was flipped. |
| Walkthrough pages | Couldn't verify | src/p4.js walk data; PR #83 | The button is on Options. Pages were read from source, not paged in the client. The controls page was covered by the codex row. |

### saves

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| A standalone file save survives reload | Works | src/p2.js save; localStorage unsub2087v3; TESTING.md | Opened dist/Unsubscribe-2087-standalone.html via file://. Class key is courier, not runner. After reload: level 17, 42 sats, class courier. Evidence: `docs/audit/evidence/12-save-reload.png`. |
| Three local slots, delete, and switch | Couldn't verify | src/p4.js options slots | The options markup lists three slots. Only one character was written and reloaded. |
| Cloud saves on an Artifact account | Couldn't verify | CLAUDE.md; HOSTING.md | Needs a claude.ai session. localStorage is blocked under setContent, so this pass used file:// for the local slot only. |
| Older save blobs still load | Couldn't verify | PR #96 | A fresh save reloaded. A pre-revision blob was not migrated. |

### audio

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Sound effects and music start an audio context | Works | src/p2.js sfx, music | sfx('hit') and music('town') did not throw. AudioContext state was running. |
| The player can hear the sound | Couldn't verify | src/p2.js | Headless Chrome has no speakers to confirm. |

### coop

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Two players register on the local account server | Works | server/server.js /api/register; MULTIPLAYER.md | POST /api/register returned users and CSRF tokens. LAN title: progress is saved to the account. |
| Both clients connect to the live socket | Works | src/p13.js; server/lib/live.js | connected true on both. No page errors. |
| Creating a game from the party sheet | Works | src/p13.js data-mpk; MULTIPLAYER.md | Game id g1. Evidence: `docs/audit/evidence/20-party-create.png`. |
| A second player joins and both appear on the roster | Works | MULTIPLAYER.md | Roster length 2. Evidence: `docs/audit/evidence/21-roster.png`. |
| Party invite and accept | Works | src/p13.js invite dialog | The join dialog was accepted. Party size 2. |
| A kill shares experience with a party member in the same district | Works | MULTIPLAYER.md; server/lib/live.js; PR party XP | The partner gained 108 experience from the kill. |
| A Maximalist aura reaches the other client | Works | src/p12.js maxiAura; src/p13.js; PR #95; PR #96 | The other client saw au 3, aL 12, tox 12 (Toxic Maximalism). |
| The rest of the party auras, including a pulse that only the owner runs | Couldn't verify | src/p12.js; src/p13.js | Only Toxic Maximalism was checked on the wire. |
| One map seed per game district | Works | server/lib/live.js; PR #87 | Both clients read mapPrint().seed -2016803690 and the same floor, 908, in that district. |
| Shared monster hit points inside a game | Works | PR #88; server/lib/live.js | After a move packet placed the hitter beside the machine, the hit dropped it from 241 to 185 on the other client. |
| Chat, friends, and letters | Couldn't verify | src/p13.js; PR friends and letters | The panels exist. No message was sent and no letter was left for an offline account. |
| Invites, reconnect, and the cheap caps that gate the beta | Partially works | PR #86; server | Closing the first socket and pressing Continue on the cloud slot put the same account back in game g1. Account invites and the beta caps were not exercised. A party invite inside an already-open game worked in the first pass. |
| Proximity voice | Couldn't verify | src/p13.js WebRTC; MULTIPLAYER.md | The party sheet has a microphone button. This host has no microphone, and no TURN server was configured. |
| LAN mode flag on the served page | Works | LAN-PLAY.md; lan/Play-Unsubscribe-2087.sh | With LAN=1 the page reported the server flag and the LAN flag, and the account-save title. |

### pvp

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Declaring hostile reaches the other client | Works | src/p13.js data-mph; notes/pvp-hostility.md | After standing in town, the other client saw the hostile flag. Evidence: `docs/audit/evidence/23-hostile.png`. |
| A hostile hit reduces the other player’s life | Works | src/p13.js mpHurt; PVP_SCALE 0.25 | After the town arming time, the 10 second portal lock, and the 5 second doorway grace, the stand-in was on the field and the hit took 100 life. Evidence: `docs/audit/evidence/audit2-hostile-hit.png`. |
| A formal duel separate from the hostile flag | Couldn't verify | notes/pvp-hostility.md | Hostile was the path played. A duel challenge was not sent. |

### trade

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Town trade swaps the offered items | Works | src/p13.js trade panel; server/lib/live.js; PR #95 | Both sides offered, accepted, and confirmed. A helm and a ring changed owners. Evidence: `docs/audit/evidence/22-trade.png`. |
| The server holds the items in escrow | Partially works | server/lib/live.js; MULTIPLAYER.md safe trading | A second honest pair also swapped a helm and a ring. The server records the item ids the clients send. It does not take the items into its own custody first. Likely location: the trade confirm path in server/lib/live.js. Evidence: `docs/audit/evidence/audit2-trade.png`. |

### lan

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| The Node server serves the game for a home LAN | Works | LAN-PLAY.md; server/server.js | Two browsers played against 127.0.0.1 with LAN=1. That is the same server the launcher starts. |
| Windows and macOS double-click launchers | Partially works | lan/Play-Unsubscribe-2087.bat; lan/Play-Unsubscribe-2087.command | The Mac .command file matches the shell script byte for byte. Staged beside server/ and dist/ the way the zip packs them, the shell script served HTTP 200. The Windows .bat was not executed on this Linux host. It looks for node, refuses anything older than 18, and tells the player to allow private networks only. From the repo's lan/ folder the script looks for server/ inside lan/ and does not start. The zip layout is the one that serves. |

### server

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| SMTP account recovery | Couldn't verify | server; HOSTING.md | SMTP_HOST was unset. No recovery mail was sent. |
| Public beta: WAN soak, coturn, and host handoff | Couldn't verify | PR #90; HOSTING.md | Needs a public host and a TURN server. This pass was localhost only. |
| The server is authoritative over monsters and damage | Not actually built | CLAUDE.md; MULTIPLAYER.md | The project states this plainly. Clients still decide monster life and hit damage. Shared life is a packet both clients now show. The server is still not the authority for the hit. |
| A player directory | Not actually built | CLAUDE.md | Friends are stored on the account. There is no directory of who is playing. |

### bugs

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| The report button opens three questions when no server is attached | Works | src/p13.js bugForm; TESTING.md | After the 4 second lock, the form showed three textareas. Sending with no server produced the on-screen fallback, because the clipboard write throws in this headless Chrome: “This copy has nowhere to send it. Here it is to copy by hand.” Evidence: `docs/audit/evidence/11-bug-form.png`. |
| A signed-in report is saved as JSON when no GitHub token is set | Works | server/lib/bugs.js; server/lib/intake.js | POST /api/bug returned 200 and id 2026-10-08T22-46-52-190Z-j5cof. The file is server/data/bugs/2026-10-08T22-46-52-190Z-j5cof.json. The server log says there is no GitHub token, so the report stays on this computer. The harness looked in a temp directory that the server was not using, which is why an early note said the file was missing. |
| The intake opens a GitHub issue | Couldn't verify | server/lib/intake.js; PR #89 | GITHUB_TOKEN is unset. The local JSON path is the one that ran. |

### text

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Export writes the markdown catalog of player-facing lines | Works | tools/text/export.js; PR #97 | Self-check passed. 4408 entries were written to text/GAME-TEXT.md and text/catalog.json. Those generated files are not part of this commit. |
| Export writes a Word document | Works | tools/text/export.js writeDoc | tools/text/docx.js writes an uncompressed OOXML docx. Export writes the markdown, the catalog, and the Word file, and it does not call pandoc. If the Word write fails, the log says the Word file was skipped and the markdown still stands. |
| Importing the exported markdown changes nothing | Works | tools/text/import.js | changed: 0, unchanged: 4408, skipped: 0. |
| npm run text:roundtrip on a clean tree | Works | tools/text/roundtrip.js; package.json | On a clean tree the script exports first, then imports. The no-op import changed 0 and skipped 0. The docx dry run changed 0 and skipped 0. Two edits applied, and the smoke check walked 34 districts on system Chrome. The sources were restored and text/ was not left behind. |


## Appendix A — Districts

All 34 indexes entered in one session (`bad` was empty, no page errors). Entering is not the same as clearing.

| Index | Name | Role |
|---|---|---|
| 0 | Stillwater Commons | Town, Act I |
| 1 | The Parcel Moors | q1, Gatewarden HOA-9 |
| 2 | Hollow Galleria | q2, Marla the Greeter |
| 3 | The Humming Fields | q3, Defrag |
| 4 | Tribunal Row | q4, Auditor Prime |
| 5 | The Glass Cathedral | Act I boss, Pryce, q5 |
| 6 | The Simulator | Kestrel’s rig. Loot from sim kills is dropped by `kill` |
| 7 | The Updraft | q6, Foreman Ratchet |
| 8 | The Sky Gardens | q7, Eden |
| 9 | The Data Lake | q8, Lethe |
| 10 | The Boardwalk | q9, Concierge Sterling |
| 11 | The Mezzanine | Act II boss, Vale, q10 |
| 12 | The Vestibule | q11, The Receptionist |
| 13 | The Hall of Minutes | q12, The Recording Secretary |
| 14 | The Nine Chairs | q13, The Chair |
| 15 | Rack Nine | q14, Defrag Prime |
| 16 | Still Water | Act III boss, MANDATE, q15 |
| 17 | The Landing | Town, Act II |
| 18 | The Antechamber | Town, Act III |
| 19 | Sealed Proceedings | Subpoena |
| 20 | The Bull Run | Secret field |
| 21 | Cutler Avenue | Town, Act IV |
| 22 | The Agreeable Mile | q16, The Update |
| 23 | The Sofa | q17, The Seventh Year |
| 24 | Tomari | q18, TARO-9 |
| 25 | The List | q19, Out Where |
| 26 | The Kitchen Table | Act IV boss, The Curator, q20 |
| 27 | The Garage | Town, Act V |
| 28 | Block 137,209 | q21, The Orphan Maker |
| 29 | The Mempool | q22, First Seen |
| 30 | The Paper Vaults | q23, The Eleventh Custodian |
| 31 | Ninety-Three Blocks | q24, Reorg, the seventh part |
| 32 | The Room | Act V boss, PROVIDENCE, q25 |
| 33 | Ubiquitous Enterprises, 2015 | Prequel |

## Appendix B — Main quests

Boss kills set q5, q10, q15, q20, and q25 to complete. The talk and return steps were not walked. Names, for the inventory: Neighbourhood Watch, A Greeting Withdrawn, The Last Librarian, The Audit, Exit Interview, Going Up, The Gardener’s Shears, What the Lake Remembers, Terms of Service, The Voice, Please Take a Seat, Strike It From the Record, Point of Order, Rack Nine, Still Water, I Agree, Seven Years on the Sofa, Do Not Unplug, Somebody It Went Badly For, The Kitchen Table, Gone and Got, First Seen, The Paper Is the Attack, Ninety-Three Blocks, The Room.

## Appendix C — Classes and skills

Scrapper, Technomancer (key `hacker`), Runner (key `courier`), Anon, Founder, Homesteader, Witness, The Maximalist (key `maxi`, unlocked after the story). Fifteen skills each. Per-skill rows are in the checklist. Every one is graded Works from a cast or a rank, with Shed and Correction graded from the gated follow-up.

## Appendix D — Couldn't verify, and why

These need a person, a network, or a click this host did not make:

- Artifact / claude.ai cloud saves. A LAN account save did reload through Continue.
- GitHub issue filing (`GITHUB_TOKEN` unset). The local JSON bug file did save.
- SMTP recovery mail.
- Proximity voice (no microphone) and a public TURN / coturn.
- WAN soak and host handoff (PR #90).
- The Windows `.bat` launcher. This host is Linux. The Mac file matches the shell script, and that script served the game from the zip layout.
- Hearing the procedural audio. The audio context did start.
- The hardcore Begin again wipe. A hardcore death charged 0 credits.
- Charms, a market sell, Mr. Float, node lighting, proof-of-work shrines, lockbox clicks, side quests, bounties, the act-gate travel dialog, tier +12, a resist-tax measurement, adaptive scaling, chat, friends, letters, a duel, co-op Nightmare and Hell, account invites, the beta caps, the Founder leash, a node-runner hire, and a Simulator wave that is not the boss rush.
- Q, E, T, I, B, C, H, Esc, and Alt as individual presses. Space did swing. The arrow keys share the WASD walk branch and were not pressed on their own.
- Hireling recall to town. The bodyguard did fight, and the revive button did bring them back.
- Equipping, stashing, and switching the three character slots as clicks. One file save did reload.
- Older save migration, the other option rows, the walkthrough pages inside the client, skill forks, the dodge roll, the passive cap, web respec payments, the leave-the-world and wake endings, the 2015 prequel’s cage story, and the party auras besides Toxic Maximalism.
- Lightning sats, the auction house, a server that decides monster life and hit damage, and a player directory are absent on purpose. They stay Not actually built.

## Appendix E — Harness traps that are not player bugs

- `newGame` then `enter` before `ensureG` throws in `raidCheck` (`G.nodes`) and the codex (`G.st.wf`). The player boot calls `ensureG`.
- Dialogs lock their buttons for up to 4 seconds. The ending and the bug ask use that long lock.
- `kill` splices the entity and leaves `hp` unchanged.
- `castWhy` is inside the IIFE. A successful cast shows up as `P.cd[i] > 0` immediately after `castIndex`, before `update` drains it.
- The account server reads `DATA_DIR` when the module loads. `tools/audit-mp.js` now sets that variable before `require('../server/server')`.
- `openSheet` while a sheet is already open does not redraw. Close it, or return to play, before opening it again.
- `spawn` returns null on a blocked tile. The play harness searches for a walkable lane.
- A shared-monster hit is rejected until a `move` packet places the hitter beside the machine. The server logs `[hit] range`.
- A hostile declaration needs a uid, both players in town at level 9 or higher, about 3 seconds of standing there, and then the portal lock and the doorway grace before a wilderness hit can land.
- A second live socket kicks the first session into the lobby. Reconnect closes the old page and presses Continue on the cloud slot while the resume grace still holds.
- `showDeath` paints after 2.5 seconds of frame time. A credit delta read immediately is the purse. The old panel can still be on screen.
- Synthetic touch pointers log `setPointerCapture` with no active pointer. That message is the harness, and the cast still completed.

