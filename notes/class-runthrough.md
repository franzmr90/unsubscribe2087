# Class run-through

Started from `cursor/merc-portal-3941` at `8b4d792` (merc attacks, portal returns to the cast tile). Eight classes, phone viewport 390×844, headless Chromium against `dist/Unsubscribe-2087-standalone.html`.

`tools/classes.js` creates a character, reads the walkthrough, casts every skill, levels, equips, enters the first zone of each act, hires a Kestrel bodyguard, opens a portal and comes back, drinks a stim, and saves. `tools/classes-deep.js` is the assertion pass: energy and recovery read before the clock runs, bare-hand damage against the card, a champion against Acqui-hire, the death screen, and the shitcoiner refuse.

Costs and cooldowns of every active that is allowed to fire match the card at rank 1. Rank 10 recovery is 80% of the card. No console errors. No skill-sheet text overflow at this width. The Maximalist stays hidden on the title until the story unlock.

A first measurement showed every hit at 2.5×. That was Incognito’s opening strike (`ambM` 2.5 for 0.15s) left over, because a scripted cast does not tick the timer down. Cleared in the harness. It is not a player bug.

## Fixed

| Class | Issue | Severity | Repro | Cause |
|---|---|---|---|---|
| Founder | Acqui-hire card said champions resist until level 5 | major | Open the card at rank 1 | The engine skips a champion while `L<5`, and `L` is the skill rank. The card said level. |
| Runner | Signed For’s own hit included the +30% | major | Rank 1, bare hands, one machine in reach | The mark was set, then `hit` ran, so the printed 350% was dealt at 455% |
| Anon | Dox’s own hit included the +30% | major | Rank 1, bare hands, one machine in reach | Same order. The card’s “120% now” was dealt at 156% |

Acqui-hire’s check is unchanged: a champion refuses at rank 1 and converts at rank 5. Signed For and Dox still apply the mark; a later hit is +30%. The opening hit is the printed percent.

## Scrapper

No defect filed.

Stop Sign at rank 1 is 145% of a bare-hand swing (4.35 on a 2–4 sheet). Iron Hide is +8% armour and +4% life once there is armour to multiply. Lunch Pail’s learn button is present and disabled at level 1 in Act I, and the point is not spent. Movement and a basic hit landed in Acts I–V. A bodyguard hired from the merc tab in town landed a hit. Portal out and back closed both ends on the cast tile.

## Technomancer

No defect filed.

Arc Chain, Spark Lance, Null Nova, Watchdog, Black Storm, Botnet, Ground Fault, Packet Storm, Step Back, and Kill Dash Nine spend the printed energy and start the printed recovery. Schema at rank 1 is +8% Surge when Surge is the schema and the passive is switched on. Cipher Ward is 6% energy cost reduction. Overclock is 3% faster recovery and +1 energy per second. Zero Day is +3% deadly strike.

## Runner

Signed For, fixed above. Nothing else filed.

Fleet Step’s haste reads 2.3s at rank 1 before the clock (1.5s after 0.8s of ticks). Missed Connection marks one machine for 4.25s at rank 1. Second Drop toasts “You have not thrown anything” and does not spend when nothing has been thrown. Scatter Shot, Lure, Tack Strip, Rush Order, Return to Sender, and Manifest fire.

## Anon

Dox, fixed above. Nothing else filed.

Proxy Hop’s stab multiplies by the deadly-strike factor, so the damage matches “always a deadly strike.” The float does not add the crit mark. That is listed under decisions, not changed. Incognito is 3.3s of stealth at rank 1. Logic Bomb and Zip Bomb land. The Dump and We Were Never Here toast their empty-handed lines and do not spend.

## Founder

Acqui-hire copy, fixed above. Nothing else filed.

Crunch lasts 9s at rank 1. Mech Suit lasts 11s. A champion stays an enemy at rank 1 and joins at rank 5. Non-Compete binds one machine for 5.3s. Layoffs, Garden Leave, and Liquidation toast when there is nobody to spend, and they do not spend energy. Term Sheet still summons an empty-handed officer and says so. Interns, Cease & Desist, Contractors, and Chief of Staff summon.

Mech Suit also heals 30% of maximum life (67 in the measurement). The card does not say that. Left for a decision.

## Homesteader

No defect filed.

Cold Frame, Strays, the Bull, the hedge, and Kill Frost place what the cards name. Wear the Hound, Wear the Hull, and Wear What You Killed set the form. Shed, Compost, Salt the Earth, and Slaughter Weight refuse, with the toast, when there is nothing to spend. Go Feral at rank 1 is +45% (`feral` 1.45). A −28% move-speed reading on Rootbound was the hull form left on from Wear What You Killed, not the passive.

Cold Frame’s card says “2.2 paces across” and the patch radius is 2.2. If “across” means the width, the patch is twice the sentence. Left for a decision.

## Witness

No defect filed.

With a full page, Look adds Testimony, The Sentence’s delay at rank 1 is 0.48s, and Correction restores the last loss once and remembers the district. An empty Record toasts “The page is blank” and does not spend. The same toast is not reprinted inside one scripted burst, because identical toasts are swallowed for 1.5s of frame time. Margin, Filed, The Footnote, Colophon, and Named Party show on the sheet at rank 1. The Footnote also cuts maximum life 4% (399 to 383).

Pull the Thread multiplies by `1 + level × 0.012`. Publish multiplies by `1 + level × 0.01`. Neither factor is on the card. Left for a decision.

## The Maximalist

No defect filed. Hidden on the title until `ACC.maxi` is set, then the tree opens.

The Halving at rank 1 removes 9.2% of current life and will not pass the 35% floor (1000 life to 908). The Dip ignores the next hit, including a hostile one. Blessed Hashrate fires five projectiles. Cite Your Sources toasts “No aura is on” and does not spend when no aura is up. Toxic Maximalism, Marked to Market, and Proof of Work are the auras and cost 0. Twenty-One Million is +8% armour at rank 1, the same rule as Iron Hide. Tick Tock Next Block needs play mode for about 900ms; its nine swings and the block use `setTimeout`, so a test that leaves play mode early sees no damage. In play it lands.

Toxic Maximalism also sets a haste timer. Any haste above zero is +50% move speed, and the card only prints attack speed and damage. Left for a decision. Blessed Hashrate spirals, so one machine standing directly ahead can be missed. Left for a decision.

## Cross-class

Checked on every class, and not filed:

- Title lists the seven unlocked classes. Names are not clipped at 390×844. The first town offers “Before you go” (Basics, Advanced, Not now). The HUD is up in play.
- A level-up grants one skill point and five attribute points. One Vitality point is +4 life (130 to 134 at level 1).
- A level 5 character cannot wear a level 20 weapon (“Needs level 20”). A worn weapon changes the sheet.
- Acts I–V early zones (1, 7, 12, 22, 28): enter, step, and a basic hit. No stuck pathing in the scripted step.
- Portal cast in the field, step off, step on, town, return to the cast tile, both ends gone. Stim heals from 40% life and spends one charge.
- Kestrel bodyguard hires from the merc tab in town and lands a hit. Vendors: Brenda offers Trade. A quest-tagged kill advances the flag (Neighbourhood Watch 1 to 2). Save and `applySave` restore class and level.
- Declaring hostility toward another player clears your own cast portal and marks them. The party tab is absent when the account server is not connected (`mpOn` is false). That is the intended offline page, not a missing button.
- Death names the town on the button (“Rise in Stillwater Commons”) and the district in the note.
- Shitcoiner refuse, after the three-second lock: “No. There is bitcoin, and there is everything else.” The shill aggros and the toast is “Maxi! Dinosaur! Get him!”

## Decisions, not changed

| Topic | What the run saw | Why it was left |
|---|---|---|
| Mech Suit heal | +30% maximum life on cast, not on the card | Could be intentional sustain. Removing it is a balance change. |
| Toxic Maximalism move speed | Aura sets haste, and any haste is +50% run speed | The card prints attack speed and damage only. Adding the sentence, or dropping the haste, is a design call. |
| Pull the Thread and Publish | Extra `1 + level × 0.012` and `1 + level × 0.01` | Not printed. Changing either number retunes Witness. |
| Cold Frame “across” | Radius 2.2, card says 2.2 paces across | Diameter versus radius. Needs a wording or a radius decision. |
| Blessed Hashrate | Five shots, spiral, a foe in front can be missed | The card says they spiral and do not stop. A guaranteed forward shot would be new behavior. |
| Proxy Hop crit mark | Damage uses the deadly-strike multiplier; the float may omit “!” | The number matches the card. The bang is presentation. |
| Acts III–V balance | Entered and fought. Not measured for time-to-kill | Known gap. No number was retuned. |
| Party tab offline | Absent without the account server | Expected. Cloud save, lockbox, and character switching were not part of this pass. |
