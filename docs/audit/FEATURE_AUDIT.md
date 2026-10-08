# Feature audit — Unsubscribe 2087

Audited tree: `cursor/input-layout-3941` at `c188878` (the tip of the open draft stack through PR #100). Date: 2026-10-08. This pass did not change gameplay code. Harnesses under `tools/audit-*.js` and these notes are the only additions.

Claim sources read for the inventory: `README.md`, `CLAUDE.md`, `PROGRESS.md`, `PLAN.md`, `TESTING.md`, `HANDOFF.md`, `HOSTING.md`, `MULTIPLAYER.md`, `LAN-PLAY.md`, `notes/`, in-game copy in `src/p4.js` (controls, walkthrough, options), skill and item and quest text in `src/p1.js` and `src/p11.js`, the systems those files implement, `tools/` (including the text exporter), and the titles and bodies of PRs #1–#100 on `franzmr90/unsubscribe2087`. A passing unit test was not treated as proof. Grades below come from Playwright on system Chrome, a two-client LAN server, and direct runs of the text tools.

`notes/codebase-inventory.md` still describes six classes. The build has eight, and 89 unique definitions. Where that note and the code disagree, the code and the play session are what got graded.

## Counts

238 features.

| Grade | Count |
|---|---|
| Works | 170 |
| Partially works | 12 |
| Broken | 1 |
| Not actually built | 4 |
| Couldn't verify | 51 |

The 170 includes all 120 skills. Each active skill set a cooldown when its gate was satisfied, and each passive took a rank. Shed and Correction refuse until you are wearing a chassis or have a loss to correct. Both succeeded once that was true.

## Top 15 problems, by player impact

1. **Hard and Brutal experience does not match the table or the walkthrough.** At machine level 1 a kill paid 5.89 experience on Normal and 11.54 on Brutal (about 1.96×). `DIFFS.xp` says 1.45× for Brutal, and the “How hard” page says the harder modes pay experience to match. `gainXp` never reads `DIFFS.xp`. The kill uses `e.xpM` from `src/p7.js`, which scales with the square root of the already-multiplied life and damage. Grade: Partially works.
2. **Right-click casts in place and can miss a machine left-click would hit.** The order became `cast`. Life stayed 11.385. A left click on a machine in the same pass dropped life from 11.385 to 0.54. Grade: Partially works. Hint: `setMouseOrder` in `src/p2.js`.
3. **Hostile reaches the other player, and a damaging hit was not observed.** The flag showed on the second client. Entering a wilderness district right after that left no stand-in, so no life was lost. A town lock after declaring is a likely reason they were not together yet. Grade: Partially works. Hint: `mpHurt` in `src/p13.js`.
4. **Brenda’s pack sale shows a price and does not pay on the first click.** The button became “Sell everything in the pack · ₡39”. Credits stayed 1000 and the item stayed in the bag. The control arms, then sells on the second click. Grade: Partially works. Hint: `sellArm` in `src/p4.js`.
5. **Town trade swaps items, and the server stores the ids the clients send.** Two honest clients exchanged a helm and a ring. The server does not take the items into its own hands first. Grade: Partially works. Hint: trade confirm in `server/lib/live.js`.
6. **The desktop skill badge always reads F1.** `paintMouseSlots` writes the literal text `F1` on the right slot for every binding. The codex tells you to use F1 through F8. Grade: Partially works. Hint: `paintMouseSlots` in `src/p4.js`.
7. **The Word export dies after a successful markdown write.** `tools/text/export.js` wrote 4408 entries, then `pandoc` was missing (`spawnSync pandoc ENOENT`). No `text/GAME-TEXT.docx`. The process exits in failure. Grade: Broken. Hint: `writeDoc` in `tools/text/export.js`.
8. **`npm run text:roundtrip` cannot start from a clean tree.** It imports `text/GAME-TEXT.md` before any export, so the first error is “no such file”. It then runs `tools/smoke.js`, which wants Playwright’s bundled Chromium. This host has system Chrome and does not have that browser. After an export, a no-op import reported changed 0. Grade: Partially works.
9. **Most unique specials were not shown to do anything in play.** Level bands leaked 0 uniques across the early and late cuts, and the six item skills plus Striker’s Vigil changed the character. The other named procs were not triggered. Many uniques are stat lines only. Grade: Partially works.
10. **Act bosses at the levels used had roughly 51k, 82k, 144k, 182k, and 228k life.** Their quests completed under god mode. Whether a Normal character can learn Acts III–V was not played. PR #92 and `CLAUDE.md` still call that tuning a first guess. Grade: Couldn't verify for learnability. The life totals are from this session.
11. **Drag-to-aim starts a reticle and was not finished as a ground cast.** `beginAim` returned aiming. A press, drag, and release of a ground skill onto the world was not done. That is the behavior PR #99 adds, and it is the tip of this stack. Grade: Partially works.
12. **The phone HUD is present, and the stick was not used to fight.** On a 390×800 touch viewport the stick is shown (width 206) and the mouse slots are hidden. Thumb buttons were not tapped against a machine. Grade: Partially works for phone combat. The layout itself works.
13. **A shared map seed and shared monster life were not shown to match.** PRs #87 and #88 describe both. The seed check read `W.seed`, which is not the field (`mpMapSpec` / `mpMapLatest` in `src/p13.js`). No monster’s life was read on both clients. Grade: Couldn't verify.
14. **Public notes undercount the game.** `notes/codebase-inventory.md` says six classes. `PROGRESS.md` undercounts uniques. The title screen offers seven classes, the eighth unlocks after the story, and `UNI` has 89 entries. A new reader of those notes will audit the wrong game.
15. **Companion combat, hireling combat after the hire, party pressure, the boss rush, Bull Run, and the subpoena were not played.** The bodyguard can be hired and appears. `CLAUDE.md` already marks companion feel and boss4/boss5 tuning as first guesses.

## What was played

Desktop (1280×800) and touch (390×800, `hasTouch`) through Playwright, `executablePath` set to `/usr/local/bin/google-chrome`. The bundled Playwright Chromium is not installed, so `tools/desktop-controls.js` and `tools/smoke.js` cannot launch here. That failure is the test runner, not the game.

Single player used `window.__g` to change class, zone, items, and difficulty, and also used the real buttons for the skill sheet, the web, Brenda, the merc sheet, the options toggle, the ending dialog (after its 4 second lock), and the bug form (after its 4 second lock). Click-to-move was `mouseClick` on a world tile. A screen click at the projected pixel landed on the top bar and is not counted as a failed walk.

Two clients registered on `server/server.js` with `LAN=1`, created a game, joined, partied, shared a kill’s experience, received a Maximalist aura, swapped items in town, and declared hostile. Screenshots are in `docs/audit/evidence/` and the key frames are also under `/opt/cursor/artifacts/audit/`.

The first long harness mis-graded several rows (a click on the HUD, a market balance compared after it was overwritten, an ending clicked during the 4 second lock, Shed and Correction cast without their gates). Later runs replaced those grades. The checklist uses the later result.

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
| Layout follows the last real input inside one session | Partially works | PR #100 title and body | Auto mode chose mouse on a desktop viewport and touch on a phone viewport. A mid-session switch, mouse then a touch, was not played. |
| Left click on open ground walks there | Works | README; src/p2.js setMouseOrder; PR #83 | mouseClick on a walkable world tile: order move, distance 5.7 to 0.37. An earlier screen click landed on the top bar (#tbs, y≈66) and did not walk. That was the click target, not the walk order. |
| Left click on a machine walks in and strikes | Works | README; PR #83 | Order atk. Machine life 11.385 to 0.54. Evidence: `docs/audit/evidence/04-click-attack.png`. |
| Right click casts the right-slot skill without stepping | Partially works | README; src/p4.js CTRL; src/p2.js setMouseOrder | The order became cast. The machine's life stayed 11.385, on a setup where left click did reduce life. Stand-still cast does not close distance, so a pointer outside swing reach whiffs. Likely location: setMouseOrder in src/p2.js. |
| Number key 1 fires the bound left slot | Works | src/p4.js keydown Digit1; codex CTRL | Digit1 set the skill cooldown from 0 to 0.3. |
| F1 through F8 bind a skill and recall it in a fight | Couldn't verify | src/p4.js CTRL; paintMouseSlots | Those keys were not pressed. See the badge row for what the slot actually paints. |
| Right-slot badge shows which F-key is bound | Partially works | src/p4.js paintMouseSlots; codex | The badge text is the literal string F1 whenever the layout is mouse, for every binding. The tooltip says F1 through F8. Likely location: paintMouseSlots in src/p4.js, the line that sets the badge to F1. |
| Mouse wheel cycles the right-slot bindings | Couldn't verify | src/p4.js CTRL | The wheel was not turned. |
| Shift-click swings or casts without a step | Couldn't verify | src/p4.js CTRL | Shift was not held. |
| WASD and the arrow keys walk | Couldn't verify | src/p4.js CTRL; README | Movement that was played was click-to-move. The key path was not pressed. |
| Space, Q, E, T, I, B, C, H, Esc, and Alt do what the codex says | Couldn't verify | src/p4.js CTRL | Codex lists Space swing, Q stim, Shift dodge, E use, T portal, I or B pack, C hero, H guide, Esc close, Alt ground names. Those keys were not pressed. Tab's map flag was toggled on its own row. |
| Hold a mouse button to keep walking or casting | Couldn't verify | src/p4.js CTRL | Hold-to-repeat was not held down. |
| Drag to aim a ground skill | Partially works | PR #99; src/p4.js beginAim; OPT.aim | With aim set to drag, beginAim returned aiming true. A press, drag onto the ground, and release of a real ground skill was not completed. |
| Touch stick and thumb buttons fight | Partially works | README; codex touch string | The stick and the attack, skill, stim, and dodge buttons are on the phone HUD. The stick was not dragged and the buttons were not tapped against a machine. Evidence: `docs/audit/evidence/13-touch-hud.png`. |
| Codex on a desk does not tell you to use a joystick | Works | src/p4.js CTRL; tools/controls-copy.js; PR #100 | The open codex contains left-click walk and strike copy and does not mention the stick. Evidence: `docs/audit/evidence/sheet-codex.png`. |

### classes

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Eight classes exist, each with fifteen skills | Works | src/p1.js CLS; notes/PLAN-eight-classes.md | 120 skills were ranked or cast. notes/codebase-inventory.md still says six classes. That note is stale. |
| The Maximalist stays off the title until the story is finished | Works | src/p12.js maxiCheck | After q25 is complete, maxiCheck sets the account flag and the class can be started. |
| A skill point from the skill sheet raises a rank | Works | src/p4.js data-learn | Selecting a node and clicking learn moved rank 0 to 1. Evidence: `docs/audit/evidence/sheet-skills.png`. |
| The passive web accepts a point | Works | src/p7.js WARMS; src/p4.js data-web | Clicking the first node of an arm (data-web 0_1) placed it. Points 19 to 18. The plus button is not in the tree until that first node exists. |
| Homesteader Shed leaves a worn chassis | Works | src/p2.js hsShed | A sweep that cast Shed with no chassis got why=no. After Wear the Hull, Shed cleared the form and set a cooldown. The gate is the chassis. |
| Witness Correction heals a recorded loss once per district | Works | src/p2.js witness skill 6 | A sweep with no recorded loss got why=no. After life was dropped to 30, Correction raised it to 70 and set corrZi. |
| Skill forks, the dodge stat, and the passive cap | Couldn't verify | src/p7.js; src/p2.js hurt | Fork choices were not picked. Dodge is a roll inside hurt and was not forced. Only one web point was spent, so the cap was not hit. |
| Doctrines, weapon families, and class uniques | Couldn't verify | src/p10.js DOCS, FAM | The data is in the build. No doctrine was selected and no class-unique drop was identified in play. The Maximalist has no weapon-family table. |
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
| Sysadmin, node runner, and hound can be hired | Couldn't verify | src/p1.js MERCS | The same sheet offers them. Only the bodyguard was hired. |
| A hireling fights, recalls, and can be revived for a fee | Couldn't verify | PR #80; Kestrel gossip; PR hireling recall | The bodyguard appeared. It was not watched attacking, recalled, or revived. |
| Tag-along companion and the Founder leash | Couldn't verify | src/p10.js; CLAUDE.md | CLAUDE.md marks companion feel and party-pressure steps as first guesses. Neither was walked. |

### items

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| The Cipher Mantle casts an Enigma-style Teleport | Works | src/p12.js ISK 100; src/p1.js unique cipher | Worn unique, item skill on. Cast moved the character 4 tiles (10.5 to 14.5) and set cooldown 0.85. Evidence: `docs/audit/evidence/06-teleport.png`. |
| The other five item skills fire while that unique is worn | Works | src/p12.js ISK 101–105 | Call, book, ledger, bear, and chair each fired on a second pass that set the mode and the slot. The first pass reported them off because that setup was missing. |
| Striker’s Vigil 2-piece and 3-piece bonuses | Works | src/p1.js SETS; src/p2.js calc | Two pieces: +20% damage. Three pieces: +1 skills and the vigil proc flag. Pieces need an affix array or calc throws. |
| Magic and rare affixes, and unique drops stay inside their level band | Works | src/p1.js AFX, UNI; src/p2.js uniqEligible; PR #85 | 34 affix keys, 89 unique definitions, 16 unique rolls. At machine level 8, 24 uniques were eligible. At 70, 20 were eligible. Cross-band leaks: 0. PROGRESS.md’s unique count is lower than the table. |
| Unique specials beyond the six item skills and the one set | Partially works | src/p1.js UNI | Bands and the six item skills work. Named combat hooks (Eighty-Two Minutes, Ten Minutes, and the rest) were not played. A large share of the uniques are stat lines with no special proc. |
| Charms and magic-find diminishing returns | Couldn't verify | src/p7.js; MFK | The tables are in the build. No charm was socketed and no magic-find curve was measured on a drop. |

### economy

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Credits are the town money and sats are the scarce money | Works | README; src/p8.js PERS; memos | Both moved in play: a merc hire spent credits, and a market buy added sats. The game does not treat sats as the only currency. |
| Brenda’s shop opens and shows a price | Works | src/p4.js shop; src/p8.js PERS | Talk offers Trade, Leave, and Talk about money. The trade sheet showed credits and a pack price. Evidence: `docs/audit/evidence/07-brenda.png`. |
| Selling the pack to Brenda pays the printed price | Partially works | src/p4.js sellArm; PR #78 | One click relabelled the button to “Sell everything in the pack · ₡39” and left credits at 1000 with the item still in the bag. The control arms on the first click and sells on the second. The confirm click was not completed. Likely location: sellArm in src/p4.js. |
| Buying five sats from Nonce’s market | Works | src/p8.js mktTrade | Quote filled. Credits went from 10000000 to 9999413. Sats became 5. The fee was inside the total. An earlier “no change” result compared the balance after it had been overwritten. |
| Selling sats, a resting bid, and a filled order | Couldn't verify | src/p8.js; PRs on the market | Only a market buy was submitted. |
| Death fee, and no fee on a hardcore death | Couldn't verify | src/p2.js deathFee; PR no HC fee | deathFee returns 0 when G.hc is set. No character was killed in town to read the notice. |
| Web respec, shape shift, and skill-point refund spend sats | Couldn't verify | src/p7.js; PRs | The costs are in the code (a full web refund is 5 sats). None of those buttons were paid. |
| Mr. Float’s loan and pledge | Couldn't verify | src/p8.js; PR Float pledge | The conversation exists in the money systems. It was not opened. |
| Subscriptions, social credit, and shitcoiners | Couldn't verify | src/p8.js | Systems are in the build. No bill was paid and no social-credit score was read in play. |
| Nodes, proof-of-work shrines, Bull Run, and the subpoena as sats sinks | Couldn't verify | src/p6.js; src/p7.js; src/p10.js | The districts can be entered. No node was run, no shrine was clicked, and no Bull Run or subpoena payment was made. |
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
| The Simulator and the boss rush | Couldn't verify | ZONES sim; src/p6.js | The Simulator is zone 6 and can be entered. A sim run and a boss rush were not played. Drops in the sim are discarded by kill(). |
| Bull Run and the subpoena as places you play | Couldn't verify | zones 19 and 20; src/p10.js | Both indexes are in the 34 that entered. Their puzzles and payments were not played. |
| The 2015 prequel | Couldn't verify | zone 33; src/p11.js | The zone enters. The cage story was not read through. |
| Acts III–V are tuned so a Normal character can learn the bosses | Couldn't verify | PR #92; CLAUDE.md known gaps | Bosses spawned and their quests completed under god mode, at life totals in the tens and hundreds of thousands. That is not a learnability play. The project notes still call this tuning a first guess. |
| Raising the tier after Act I adds 12 machine levels | Couldn't verify | src/p4.js walkthrough How hard; G.tier | The walkthrough says so. More on the transit gate was not used. |

### difficulty

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Hard and Brutal raise monster life | Works | src/p6.js DIFFS; src/p2.js spawn | A zone-1 tick: Normal life about 477, Brutal about 992. Ratio 2.08, which is 2.6/1.25. |
| Hard and Brutal pay the experience the walkthrough describes | Partially works | src/p4.js How hard; src/p6.js DIFFS.xp; src/p7.js xpM; src/p2.js gainXp | Walkthrough: Hard and Brutal “pay experience to match.” DIFFS.xp is 1, 1.2, and 1.45. A kill at machine level 1 awarded 5.89 on Normal and 11.54 on Brutal, ratio 1.96. gainXp never reads DIFFS.xp. The kill uses e.xpM, and xpM is sqrt(actual life × damage / the unscaled baseline) / 1.27, so the life and damage multipliers leak into experience. Likely location: xpM in src/p7.js and gainXp in src/p2.js. |
| Hard opens after Act V on Normal, Brutal after Act V on Hard | Couldn't verify | src/p4.js How hard | The options copy says so. The gates were not clicked on a finished Act V character. |
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
| One map seed per game district | Couldn't verify | server/lib/live.js; PR #87 | The check read W.seed, which is not a field. The seed lives on mpMapLatest / mpMapSpec in src/p13.js and was not compared. |
| Shared monster hit points inside a game | Couldn't verify | PR #88; server/lib/live.js | No monster’s life was read on both clients during one fight. |
| Chat, friends, and letters | Couldn't verify | src/p13.js; PR friends and letters | The panels exist. No message was sent and no letter was left for an offline account. |
| Invites, reconnect, and the cheap caps that gate the beta | Couldn't verify | PR #86; server | A party invite inside an already-open game worked. Account invites, reconnect after a drop, and the caps were not exercised. |
| Proximity voice | Couldn't verify | src/p13.js WebRTC; MULTIPLAYER.md | The party sheet has a microphone button. This host has no microphone, and no TURN server was configured. |
| LAN mode flag on the served page | Works | LAN-PLAY.md; lan/Play-Unsubscribe-2087.sh | With LAN=1 the page reported the server flag and the LAN flag, and the account-save title. |

### pvp

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Declaring hostile reaches the other client | Works | src/p13.js data-mph; notes/pvp-hostility.md | After standing in town, the other client saw the hostile flag. Evidence: `docs/audit/evidence/23-hostile.png`. |
| A hostile hit reduces the other player’s life | Partially works | src/p13.js mpHurt; PVP_SCALE 0.25 | The flag arrived. Entering a wilderness district immediately afterwards left the other client with no stand-in, so no blow landed and no life was lost. A town lock after declaring is a likely reason they were not in the same place yet. Likely location: mpHurt in src/p13.js and the hostile portal lock. |
| A formal duel separate from the hostile flag | Couldn't verify | notes/pvp-hostility.md | Hostile was the path played. A duel challenge was not sent. |

### trade

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| Town trade swaps the offered items | Works | src/p13.js trade panel; server/lib/live.js; PR #95 | Both sides offered, accepted, and confirmed. A helm and a ring changed owners. Evidence: `docs/audit/evidence/22-trade.png`. |
| The server holds the items in escrow | Partially works | server/lib/live.js; MULTIPLAYER.md safe trading | An honest pair of clients did swap. The server records the item ids the clients send. It does not take the items into its own custody first. Likely location: the trade confirm path in server/lib/live.js. |

### lan

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| The Node server serves the game for a home LAN | Works | LAN-PLAY.md; server/server.js | Two browsers played against 127.0.0.1 with LAN=1. That is the same server the launcher starts. |
| Windows and macOS double-click launchers | Couldn't verify | lan/Play-Unsubscribe-2087.bat; lan/Play-Unsubscribe-2087.command | This host is Linux. The shell launcher was not the thing started. Node was required directly. |

### server

| Feature | Grade | Claim source | Notes |
|---|---|---|---|
| SMTP account recovery | Couldn't verify | server; HOSTING.md | SMTP_HOST was unset. No recovery mail was sent. |
| Public beta: WAN soak, coturn, and host handoff | Couldn't verify | PR #90; HOSTING.md | Needs a public host and a TURN server. This pass was localhost only. |
| The server is authoritative over monsters and damage | Not actually built | CLAUDE.md; MULTIPLAYER.md | The project states this plainly. Clients still decide monster life and hit damage. Shared life is a separate, unverified packet. |
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
| Export writes a Word document | Broken | tools/text/export.js writeDoc | After the markdown and the catalog are written, writeDoc runs pandoc. pandoc is not installed. The process throws spawnSync pandoc ENOENT and text/GAME-TEXT.docx is never created. Expected: a docx next to the markdown. Likely location: writeDoc in tools/text/export.js. |
| Importing the exported markdown changes nothing | Works | tools/text/import.js | changed: 0, unchanged: 4408, skipped: 0. |
| npm run text:roundtrip on a clean tree | Partially works | tools/text/roundtrip.js; package.json | The script imports text/GAME-TEXT.md without exporting first, so a clean tree fails with “no such file”. After an export, the no-op import works. The script then runs tools/smoke.js, which launches Playwright’s bundled Chromium. That browser is not installed on this host. System Chrome is what the audit harnesses use. |


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

These need a person, a network, or a session this host does not have:

- Artifact / claude.ai cloud saves.
- GitHub issue filing (`GITHUB_TOKEN` unset). The local JSON bug file did save.
- SMTP recovery mail.
- Proximity voice (no microphone) and a public TURN / coturn.
- WAN soak and host handoff (PR #90).
- Windows and macOS launcher double-click.
- Hearing the procedural audio (the context started).
- Hardcore death, the Hard/Brutal unlock gates, and a full Act III–V fight without god mode.
- Friends, offline letters, reconnect, and the beta caps.
- Shared map seed and shared monster life, as a comparison of the two clients.
- Lightning sats and the auction house are absent on purpose (`CLAUDE.md`). They are graded Not actually built, not left unverified.

## Appendix E — Harness traps that are not player bugs

- `newGame` then `enter` before `ensureG` throws in `raidCheck` (`G.nodes`) and the codex (`G.st.wf`). The player boot calls `ensureG`.
- Dialogs lock their buttons for up to 4 seconds. The ending and the bug ask use that long lock.
- `kill` splices the entity and leaves `hp` unchanged.
- `castWhy` is inside the IIFE. A successful cast shows up as `P.cd[i] > 0` immediately after `castIndex`, before `update` drains it.
- The account server reads `DATA_DIR` when the module loads. `tools/audit-mp.js` now sets that variable before `require('../server/server')`.
