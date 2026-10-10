# All-Hands

Plan only. Nothing here changes combat, the rig, or the save. It is a platform brawler that lives in the Simulator, beside the waves and the duel, and it is not those.

Read against `f42a599` (PR #121, `cursor/stat-req-build-3887`). Rates, weights, and knockback are a first guess.

The cabinet’s name is **All-Hands**. The plaque on it says **MANDATORY FUN**. Players will call it the cabinet. This note does not use Nintendo’s name, moves, or stage names. The family resemblance is the rule underneath: a percent that becomes a launch, a ring-out, a small cast, and a room that misbehaves.

## Pitch

Three ways to make it this game, and not a costume on somebody else’s.

1. **The percent is a share price.** A hit does not fill a red damage number. It prints a price on you. At 0 you are book value and you barely slide. Past 100 you are overvalued, and the same tap that did nothing at 20 delists you. Ring-out is the blast zone eating a ticker, not a life bar reaching zero. Light fighters are penny stocks. The Scrapper is a blue chip. The math is ordinary knockback. The fiction is why the number gets dangerous as it climbs, which is the whole toy.

2. **A final is a hostile takeover, not a bigger jab.** For a few seconds you spend their quarter: their specials, their weight, their bad recovery. Or their last four inputs are read back into them as a deposition. The Maximalist’s version is the Halving, and it cuts his price too. Nobody gets a laser that is their neutral special with the numbers turned up.

3. **The Nipper is weather.** The current tree has no Nipper string. This is the job that gag gets, so a later pass does not invent a second dog. A small white dog with a gramophone collar crosses the stage once a match, steals the exhibit you were about to grab, and nips the last point off whoever is about to ring out. The toast is “The Nipper took the last point.” Hitting the dog prints a one-sat HOA fine. The rig voids the fine before it reaches the purse, because nothing in the Simulator is real. The Nipper has no stock and cannot win a match. Unlocking it as a fighter, later, is a joke with one move.

**Recommend 1 as the spine.** Ship the price, the delisting, and four honest movesets. Keep 2 for the full cabinet, with one loud simple final in the first playable. Draw the Nipper once a match in that first playable, and do not let anyone play as the dog until the four fighters are fun.

## Why it is in the rig

Unity shipped a peripheral with the visors in 2061, a bounded conflict simulator, so a team would hit each other instead of the building. The plaque is still on the machine in the back of the Simulator:

> MANDATORY FUN
> A bounded conflict simulator
> Property of Unity People Systems
> Do not unplug. Unplugging is a write-up.

The rig already tells the truth about the room: a duel in there costs nothing, because nothing in it is real. The cabinet is the same promise with platforms. Waves stay waves. The hostility duel stays the ARPG fight, at 25% of a blow, in a district. All-Hands does not use `hit`, `hurt`, or `pdmg`. It does not pay experience, credits, or sats. It does not wear the character’s weapon, level, or attributes. A level-1 Scrapper and a level-80 Scrapper are the same blue chip. That is the point of a cabinet. The campaign’s power stays in the campaign.

Gramps, if he ever gets a line, calls it the thing in the back of the rig that still thinks a meeting can be won. MVP does not need the line. A button on the rig panel is enough: “The cabinet in the back.”

## The rule

Side view. Flat stage, two blast zones left and right, one above, one below. Up to four bodies. A match is stocks, not a life bar.

Each fighter has a **price**, starting at 0. A hit adds its print to the price and applies a launch. The launch grows with the price. Leaving the camera rect spends a stock and delists you. You come back at price 0, from a ledger at the top, unable to be hit for 1.5s. At 0 stocks you are out. Last person with a stock is written up as the winner. The minutes blame whoever rang out last.

```
print      = the move's flat number (about 4 for a jab, 9 for a sweet special, 14 for a smash)
price'     = price + print
growth     = price < 100 ? 1 : 1.8          // overvalued
knockback  = (kBase + price' * kGrowth * growth) * (100 / weight)
kBase      = 30 for a jab, 70 for a sweet special, 110 for a final's one hit
kGrowth    = 0.45 for a jab, 0.9 for a special, 1.3 for a final hit
launch     = knockback along the move's angle, plus up to 18° of drift if the defender holds a direction
hitstun    = clamp(knockback * 0.012, 0.08, 0.55) seconds
```

Weight is the market cap. A higher weight resists the launch. It does not add damage. Gravity is shared except where a move says otherwise. These numbers want a playtest more than they want another column. If a Runner at 80 price survives a Scrapper smash, raise `kGrowth` before touching weights. If everyone dies to a jab at 40, lower it.

| Fighter | Weight | Run | Air jumps | Notes |
|---|---|---|---|---|
| Scrapper | 118 | 1.0 | 1 | Blue chip. Earthbreaker is the recovery. |
| The Maximalist | 112 | 1.05 | 1 | Story-locked, same as the class. |
| Homesteader | 108 | 0.95 | 1 | Hull, later, cannot air-jump. |
| Founder | 100 | 1.0 | 1 | The intern is the recovery, and the intern can be hit. |
| Witness | 96 | 0.9 | 1 | Hangs in a sentence. Poor horizontal. |
| Anon | 86 | 1.15 | 2 | Mines do not care about facing. |
| Technomancer | 78 | 1.05 | 2 | Dies offstage. The bolt is the point. |
| Runner | 72 | 1.3 | 2 | Penny stock. Fleet Step is a recovery and a personality. |
| Nipper (later) | 40 | 1.4 | 2 | No stocks. Weather that learned to jump. |

A **parry** replaces a long shield, because a phone has few buttons. Tap Dodge as a hit would land and you take no print and they flinch. Hold Dodge and you “park the agenda”: a short guard, and the facilitator adds 4 price a second for not engaging. Turtling fills your own ticker. That is the whole anti-camp.

Directional influence is the 18° above. There is no tech-chase vocabulary in the MVP. A ledge is a magnet: touch the side of the stage while falling and you grab, then a button pulls you up. No edge-hogging rules until four people are actually falling off.

## Controls

The stick moves. It does not jump. Jump is its own button, so up-special and jump stop sharing a gesture. That is the decision that makes a phone able to recover.

| | Desktop, one player | Desktop, two on one machine | Phone |
|---|---|---|---|
| Move | WASD or arrows | P1 WASD, P2 arrows | The existing stick |
| Jump | Space, hold for the full hop, tap for the short | P1 Space, P2 Right Shift | Jump button, same tap and hold |
| Attack | J, or the left click with the sheet closed | P1 J, P2 K | Attack |
| Special | K | P1 K, P2 L | Special |
| Dodge / parry | Shift, as now | P1 Shift, P2 Right Ctrl | Dodge, as now |

Special plus a direction is the side, up, or down special. Special with the stick neutral is the neutral special. Attack while dashing is the dash attack. Attack in the air is the air attack. There is no tilt versus smash split in the MVP. One Attack button is the honest phone. The full cabinet can add a held Attack as the slow swing for Scrapper and Maximalist only, if the tap already feels thin.

Touch layout stays the thumb row the game already has: Attack, Special, Jump, Dodge, and the stick on the left. No fifth gesture. Drag-to-aim is an ARPG ground-skill idea and does not come into the cabinet. The stage is small enough that a direction on the stick is the aim.

Keyboard-only local co-op is the MVP’s second player. A gamepad can be a later binding on the same four verbs. LAN is not a control scheme. It is a mode, and it is not in the MVP.

## Movesets

Every class gets a jab, a dash attack, an air attack, four specials, and a final. Damage numbers below are the print, not ARPG weapon percents. Recovery is named on purpose: if the up special is bad, the class is bad offstage, and that is allowed.

The kit is translated from the skills they already have. A move that needs a summon, a page, or a stance uses a cabinet-sized version of it. Nothing reads Might, Reflex, Vitality, Bandwidth, or the weapon in the doll.

### Scrapper

Close, heavy, honest.

| | Name | What it does |
|---|---|---|
| Jab | Stop Sign | A wide swing, print 5. The second hit of a three-hit string stumbles. |
| Dash | Picket Rush | A short untouchable rush, print 8, stops at a body. |
| Air | The swing | The sign, under him, print 7. Spikes only on the first frames. |
| Neutral | War Horn | A shout. Nearby prices take 6 and a brief flinch. He gains nothing. |
| Side | Hurl | Scrap goes through bodies, print 7. |
| Up | Earthbreaker | He leaves the ground and comes down. Rising hit 4, landing 11. This is how he gets back, and it is slow. |
| Down | Lunch Pail | Sets the pail. Standing near it sheds 3 price a second, him and anyone else, until the pail is empty or hit. |
| Final | Call the Strike | A horn. Bodies closer to the edge are pulled in. Bodies already central are pushed. One hit, print 12, high kBase. |

### Technomancer

Fragile, and the bolt is the game.

| | Name | What it does |
|---|---|---|
| Jab | Spark | A stub of lightning, print 3, fast. |
| Dash | Step Back, forward | She blinks a short way along the stick and the arrival shocks, print 6. |
| Air | Lance | A diagonal bolt, print 7. |
| Neutral | Arc Chain | Hits the nearest other body and leaps once, print 6 each. |
| Side | Spark Lance | A piercing line, print 8. The next Arc Chain within 2s prints 3 more. |
| Up | Kill Dash Nine | A vertical bolt that carries her a short way. Print 9 on the way up. Whiff it offstage and she keeps falling. |
| Down | Ground Fault | A patch of floor, 2s, print 3 twice. She cannot walk while she lays it. |
| Final | Black Storm | A column on one body. Three shards, print 6 each, then a launch. |

### Runner

The penny stock. She wins by not being where the print is.

| | Name | What it does |
|---|---|---|
| Jab | One blade | Print 3. |
| Dash | Fleet Step | The dash. Untouchable, no print, a lot of ground. |
| Air | Scatter | Three blades downward, print 3 each. |
| Neutral | Signed For | A single heavy throw, print 10, and the next hit on that body prints 2 extra. |
| Side | Return to Sender | A blade that goes out and comes back, print 5 each way. |
| Up | Second Drop | She throws a parcel up and rides it, then it bursts, print 8. The recovery. |
| Down | Tack Strip | Spikes on the floor for 3s. Walking on them adds 2 price and kills your run. |
| Final | Missed Connection | Marks one body. If it rings out within 4s she appears at the ledger in its place and keeps her stock. If it does not, she wasted it. |

### Anon

Traps, then a knife.

| | Name | What it does |
|---|---|---|
| Jab | The knife | Print 4. From behind, print 7. |
| Dash | Proxy Hop | Appears behind the nearest body and stabs, print 8. |
| Air | The same knife | Print 5. |
| Neutral | Logic Bomb | A mine, up to two. Print 12 when someone walks over it. A mine is a body and can be hit. |
| Side | Zip Bomb | A slow parcel, print 5, then three smaller bursts of 4. |
| Up | Dead Drop | A mark. Use again to appear there. One mark. It does not explode. The recovery, if you remembered to leave one. |
| Down | Honeypot | A lure. The next dash toward it from an opponent is pulled in, then it bursts for 10. |
| Final | We Were Never Here | Every mine goes off, and Anon cannot be hit for 1.5s. With no mine, it still hides him, and that is all. |

### Founder

The workforce does the dying. He is ordinary until someone else is on the screen wearing a lanyard.

| | Name | What it does |
|---|---|---|
| Jab | The bolt | Print 3. He should be ashamed of it. |
| Dash | Non-Compete | A short bind on one body, print 4, they face him for 0.6s. |
| Air | Cease | A small shock under him, print 5. |
| Neutral | Interns | One intern, up to two. An intern walks, jabs for 3, and steps in front of a hit aimed at him. |
| Side | Contractors | A drone shot, print 6. One drone. |
| Up | The intern throws him | The recovery. If the intern is hit during it, he falls and the intern is gone. |
| Down | Layoffs | Every intern and drone explodes, print 9 each, and he sheds 8 price. Empty staff, nothing happens. |
| Final | Mech Suit | For 4s his jab is a slam, print 8, and his weight is 140. Then the suit comes off wherever he is, including offstage. |

### Homesteader

A body, a patch of ground, a thing that does not love them.

| | Name | What it does |
|---|---|---|
| Jab | The shot | Print 4. |
| Dash | The Bull | A charge, print 8. The bull does not stop for him. |
| Air | Shed | He drops out of whatever he was doing. No print. Useful, and a little sad. |
| Neutral | Cold Frame | A rust patch, print 2 every half second, slows. Two patches. |
| Side | Hedgerow | A short wall. It blocks him too. |
| Up | Wear the Hound | He becomes the hound for 3s: faster, lighter (weight 80), a bite for 6. No Cold Frame while it lasts. |
| Down | Salt the Earth | Every patch bursts, print 8, and is gone. |
| Final | Slaughter Weight | The hound, if it is out, becomes a patch under the nearest enemy and he is himself again. The patch prints 4 a second for 3s. |

### Witness

Slow. The page is the weapon. Record fills on its own, one point a second, cap 20. Getting hit spends nothing. Casting does.

| | Name | What it does |
|---|---|---|
| Jab | Look | Marks a body. The mark is Testimony, up to 4. The jab itself prints 3. |
| Dash | The Sentence | Spends Record. Delays their next action by a beat and prints 4. |
| Air | The notebook | Print 4, under him. |
| Neutral | Pull the Thread | Spends the page. One hit, print 4 plus 3 for each Testimony on that body. Empty page, nothing, and the page is not spent. |
| Side | Cross-reference | Spends 10. Copies the last move that hit him onto the marked body, at a small print. |
| Up | Redaction | He hangs for 0.7s, untouchable, then drops. The recovery. It does not move him sideways. |
| Down | Correction | Once a stock. Spends the page and sheds price equal to the last print he took. An empty page corrects nothing. |
| Final | Publish | Consumes every Testimony on screen. Each point is a hit of 5, then his Record is 0. |

### The Maximalist

Unlocked when the story flag already unlocks the class. The cabinet does not spoil him. Everything he does launches as if it were Sound: no type chart, because the cabinet has no types. The joke survives as copy on the card.

| | Name | What it does |
|---|---|---|
| Jab | Tick Tock | Three quick hits of 2. The fourth is the block, print 8. |
| Dash | Orange Pill | A charge through, print 7, and he is untouchable during it. |
| Air | Have Fun Staying Poor | Close, print 9, a flinch. It does not miss a body in the arc. |
| Neutral | Toxic Maximalism | A stance. His run goes to 1.3 and his jab prints 1 more. Another neutral leaves the stance. |
| Side | Cite Your Sources | A volley, three hits of 4. Only while the stance is up. No stance, he swings the jab. |
| Up | Blessed Hashrate | Hammers spiral up and carry him. Print 5 on the way. The recovery. |
| Down | The Dip | He ignores the next hit. He has to choose the moment. It does not fire when he is already launched. |
| Final | The Halving | Every body at price 50 or more, including him, is set to half that price and launched. Under 50, they only flinch. |

## The rest of the roster

Not in the first playable. Each one is a kit of four specials and a reason to exist. Weights are a guess beside the class table.

| Fighter | How you unlock them | The joke that has to survive |
|---|---|---|
| Brenda | Win a quarterly on The Book | Her neutral is a price tag. The number on the tag is the print. Her final marks everything you are “wearing” in the cabinet, which is nothing, and launches you for the insult. |
| Nonce | Win one on the vault stage | Coins as projectiles. They are pictures. They are not sats. His up special is a block you can stand on for one beat. |
| Wren | Open ten of her boxes in the campaign, or win an Agenda card | A sealed box. The odds are posted. The law was repealed. The box is still random: pie, filing, or the attachment. |
| Kestrel | Buy a body back from her once | Her recovery brings you to the ledge **at the price you died with**. The buyback is faithful and worse. Her final drops the opponent’s body back onto the stage from the top. |
| Gramps | Hear him close an act | Heavy, slow, one air jump that barely is. His neutral is a story: a grounded body near him flinches, because they listened. His down special is a bean row, a platform. |
| Mr. Float | Take a loan in the campaign, or refuse one | Neutral lends you −30 price and then adds 8 a second for 6s. Side special is a margin call that only launches a body over 80. His up special is bad on purpose. He says so. |
| Pryce | Decline his offer in Act I | Neutral throws an offer. A struck body gets a one-button choice: accept, and he gains a stock while you shed 20 price; decline, and the offer explodes for 14. He has four parachutes. The up special spends one. |
| Vale | Finish Act II | She prints small. Her aura, for a second, walks you toward her, because you want to agree. The final is the line she already has: she finds out what you want, and then she is kind. What you want, in the cabinet, is to jump. The button is real. The landing is a blast zone. |
| The Curator | Finish the kitchen | She apologises when she hits you, and the apology is a second hit of 4. Once a match she asks if you are proud of her. The answer buttons are the hitboxes. Either answer prints 10. Silence prints 6 and she looks sad, which is also a hitbox. |
| Defrag Prime | Clear Rack Nine | Sorts by price. Down special swaps the highest price’s position with the lowest. The final files the highest price at the edge of the stage, already launched outward. |
| MANDATE | Finish Act III | Does not walk. The stage does. You do not delist MANDATE with knockback. You fill a patience meter by hitting the offers it sends, or you fall into a hole it opens in the floor. A different win rule. Build it last, or it will eat the cabinet. |
| PROVIDENCE | Finish the story | Reads your last two seconds of inputs and answers with the counter. The final offers you a prize to step off the stage yourself. The prize is credits. Credits do not exist in the cabinet. People will press it anyway. |
| The Nipper | Survive the dog crossing the stage in ten matches | One special, Mine. It takes the exhibit and leaves. Weight 40. It still has no stocks. A match against the Nipper is a timer: the dog wins if it is the last thing on the screen when the minutes end, which is the only way a thing with no stocks wins. |

Bosses keep their names. They are not costumes of anyone else’s roster.

## Stages

One stage in the MVP. The others are the full cabinet. Each hazard is a platform that moves, or a floor that leaves, or a wind. None of them roll ARPG damage.

| Stage | What it is | Hazard |
|---|---|---|
| The Book | A collapsing exchange order book. Columns of bids are the platforms. | A column winks out when its bid is pulled. Standing on it means falling. The ticker on the back wall prints everyone’s price, large, because that is the UI. **MVP stage.** |
| Mt. Gaux | A cold vault door in a mountain of other people’s coins. | The door cycles. Inside, you cannot be delisted and you cannot leave until the timelock opens. People will camp it. The camp is the hazard. |
| The HOA | A long table, nameplates, a pitcher of water. | Passing a motion tilts the table. Gramps in the audience is a wind box when his line fires, about every 12s. |
| The Scroll | The floor is terms of service, moving left. | Stand still and you are filed off the left blast zone. An “I agree” button in the middle is a spring. |
| The Kitchen Table | Her kitchen. Coffee she cannot drink. | Cups are items and platforms. The question, when it comes, pauses movement for the answers and for nothing else. |
| Rack Nine | Fans and a white floor. | The fans are a sideways wind that swaps direction when anyone crosses 100 price. |
| The Room | Almost empty. | The blast zones creep in by a hand’s width every 15s. PROVIDENCE is winning on points even when it is not on the stage. |
| The Glass Cathedral | Pryce’s desk on a platform, a long way up. | The desk is the only floor that stays. Everything else is atrium. |

## Exhibits

Items, in the cabinet’s mouth. They spawn on a timer in the full game, never in the MVP. Holding one means your hands are full: Attack throws it, Special is dark until it is gone.

| Exhibit | The parody | What it does |
|---|---|---|
| Two Large Pies | The anniversary in the memo, 22 May 2010, and the food that heals in that other game. They spawn as a pair, because it was two pies. | Catch one and eat it: shed 15 price. Throw one: a slow sticky hit, print 6, and for 3s that body’s side specials come out mirrored. |
| hello.jpg | The attachment. | Throw it unopened and it is a small burst, print 9. Open it and you are stunned for 1s by a picture of the Nipper. Everyone opens it. |
| The Bound Copy | The heavy blunt exhibit. A filing you could swing. | One slow swing, enormous kBase, print 6. Then it comes apart into clauses and is gone. |
| The Golden Parachute | Pryce’s armor, as a joke you can hold. | For 4s your fall is a third of normal. It does not stop a sideways delisting. |
| The Term Sheet | Mr. Float, pocket-sized. | On pickup you shed 25 price and then gain 6 a second for 5s. The card says the rate. People will still take it at 10 price. |
| Brenda’s Tag Gun | A price that sticks. | The next body you hit keeps a tag. For 6s every print on them is 2 higher. |

No exhibit mints a sat, a credit, a charm with stats, or a campaign item. The Bound Copy is not a maul. The pies are not food in Stillwater.

## Modes

| Mode | Players | Rule | When |
|---|---|---|---|
| Quarterly | 1–4 local, or 1 plus bots | 3 stocks. The Book. Last stock wins. | MVP, two humans on one keyboard, or one human and a bot. Phone is one human and a bot. |
| The Minutes | 2–4 | Two minutes. Most delistings wins. If nobody rings out, the minutes blame the highest price for wasting the hour, and that person loses. | Full |
| Break the KPIs | Solo | Ten targets, 45 seconds, one stage with no blast zone. Targets are OKRs. They hop. Miss one and the review says so. A clear posts a time. | Second milestone. It teaches the kits without a second player. |
| The Agenda | Solo or two | Eight short cards. “Delist Mr. Float before the loan comes due.” “Stand on the Scroll for twenty seconds without jumping.” “Eat both pies in one stock.” | Full |
| The table | 2–4 over the LAN | Same as Quarterly. One client is the facilitator and sends prices and launches, the way the Simulator host already sends a wave. | After local Quarterly is fun. Not before. |

Bots in the MVP dodge a telegraph they can see and walk toward you. They do not parry. They do not final. A bot Founder never remembers Layoffs. That is enough bot to practice a recovery.

The existing party cap is eight, in a game, for the ARPG. The cabinet’s cap is four because a platform and four bodies is the picture, and because the phone screen cannot show eight prices. A fifth local player is a spectator, or the Nipper.

## What it pays

Nothing that `calc` reads.

The save grows one object, `G.offsite`, created the first time you press the button. Old saves do not get it until then. Fields: `played`, `wins` by fighter id, `bestKpi` (a time or null), `nipperSeen`, `fighters` (ids you may pick). No restamp of items, attributes, or corpses.

The reward for a win is a line in the Codex, “Minutes of the offsite,” and a nameplate the LAN card can show: Attended. The minutes blame the loser by name if they were a local slot, and blame “the other side” if they were a bot.

A belt charm is the wrong prize. A charm with no affix still takes a slot on a belt that is already the scarce one, and that is a campaign cost. Do not drop “The Minutes” into `G.cslots`. Do not add magic find, a skill point, or a sat. `G.simBest` stays the wave counter. The cabinet keeps `G.offsite` and leaves the Simulator’s best wave alone.

Cosmetics that are safe later: a visor tint drawn only in town and only on your own client, a plaque color on the doll that is not a rarity color, a gossip line. None of these are stats. If a later pass wants a charm anyway, it is a 1-cell charm with an empty affix list, flavor text only, and `charmApply` must keep skipping empty affixes. Default is the Codex page.

## MVP, full, never

**MVP, one playable.**

- The button on the rig panel. Entering sets `mode` to `offsite` and leaves the district loaded underneath, paused.
- The Book. Three stocks. Prices, knockback, delisting, the ledge magnet, the parry tap, the parking guard.
- Four fighters: Scrapper, Technomancer, Runner, Anon. Jab, dash, air, four specials, and one final each that is just a loud hit (the takeover rule can wait).
- One human and a bot. Two humans, one keyboard.
- Phone: stick plus the four buttons, against a bot.
- The Nipper crosses once. Hitting it toasts the voided fine.
- Exit returns to the rig. No payout.
- A test that two weights and one hit put the lighter body across a fixture rect.

**Full cabinet.** The other four classes. Takeover finals. The rest of the roster, unlocked on the table above. The other stages. Exhibits. Break the KPIs, the Minutes, the Agenda. The Nipper as a joke fighter. LAN for four, host-facilitated.

**Never.**

- Campaign stats, experience, credits, sats that stick, durability, or a charm with a number.
- Using the cabinet to unlock the Maximalist, or any boss, before the story does.
- Isometric platforms. The walker does not become a jumper.
- Nintendo’s names, likenesses, or stage layouts with the serial filed off.
- A fifth attack button on the phone.
- Rollback, prediction, or an authoritative damage server. The ARPG server is not that, and this note does not make it one.
- Spawning the cabinet inside a district, a quest, or a boss room.

## Tech

The page is one IIFE. `build.sh` concatenates `formulas.js` then p1, p2, p5, p6, p7, p8, p9, p10, p11, p3, p4, p12, p13. A cabinet file wants to be last, so it can call `toast`, `sfx`, `mode`, and `G` at runtime. Add `src/offsite.js` at the end of `ORDER`. Do not put fighters on `W.ents`. Do not call `hit`.

Own state is `AH`: bodies, stage colliders, prices, stocks, exhibits, a clock. `W` stays the paused district. At the top of the frame, when `mode==='offsite'`, run `offsiteTick` and `drawOffsite` and return before the isometric update. The canvas is the one p3 already uses. The draw is rectangles, the existing class colors, and a ticker. No new asset pipeline.

Physics is a fixed step, 60Hz, with an accumulator, so a hitch on a phone does not become a launch. Semi-implicit Euler. Gravity, a short hop and a full hop from tap versus hold, a double jump where the table allows it. Hitboxes are circles in that side view.

The knockback function belongs in `formulas.js`, next to the other pure numbers, so a test can call it without the canvas. `tools/offsite.js` loads the built page, starts a quarterly against a bot that does not move, applies one scripted smash at a known price, and asserts the Runner leaves the rect while the Scrapper does not. A second check asserts `G.sats`, `G.credits`, `G.xp`, and the equipped weapon are unchanged across enter and exit.

LAN, when it exists, is a new message, not the district position sync. One client, the facilitator, simulates `AH` and sends prices, stocks, and positions. The others render and send buttons. That is the same shape as the Simulator host sending a wave, and it has the same flaw on purpose: the host’s machine is the truth. Desync is a dropped match, not a corrupted save. Do not route cabinet hits through the ARPG damage messages.

Saves: `G.offsite` is absent until the first button press. `ensureG` does not invent wins. Leaving a match writes `played` and, on a win, the fighter id.

## Risks

| Risk | Why it hurts | What to do |
|---|---|---|
| The kits are a second game | Eight full movesets will bury the ARPG work | MVP is four fighters and one stage. The doc’s other rows are a menu, not a promise to build them in one pass. |
| Knockback feels wrong | The first numbers are a guess | Tune `kGrowth` and the overvalued 1.8 before adding moves. The fixture test locks a direction, not a vibe. |
| Phone specials | Up, side, and down have to share a stick with walking | Jump is a button. The stick never jumps. If playtesters still special the wrong way, the MVP can drop down-special onto a double-tap of Special before it adds a button. |
| Turtling | A guard that is free becomes the game | Parking the agenda prints price onto you. |
| LAN | The server does not simulate blows today | Local first. Facilitator-host later. No rollback project. |
| Rewards leak into `calc` | A charm, a sat, or a skill point would make the cabinet mandatory | Codex and a nameplate. The voided Nipper fine is the joke that keeps the purse clean. |
| MANDATE and PROVIDENCE | A boss who does not play by stocks will define the mode | They are last. Quarterly must be fun with no bosses on it. |
| The Maximalist | He is a story reveal | Grey him out until the flag. The cabinet does not mention the kit in the select screen before that. |
| Joke density | A stage that is only a caption is not a stage | Every stage above has a floor that moves. The caption is the ticker, which is also the price UI. |
| Scope of the Nipper | A playable dog is a fifth design | Weather first. Fighter only after ten matches have survived the crossing. |

## Recommendation

Build All-Hands as a cabinet in the back of the Simulator. The percent is a share price, ring-out is a delisting, and past 100 the same hit launches. Four fighters in the first playable: Scrapper, Technomancer, Runner, Anon. One stage, The Book. Stocks, a parry, a guard that prices you for hiding, local play for two on one keyboard, and a bot. The Nipper crosses the stage and costs a sat the rig refunds. No campaign reward but a Codex page and a nameplate.

The full cabinet adds the other classes, takeover finals, the NPC and boss roster, the stages and exhibits in the tables, Break the KPIs, and a host-facilitated LAN table for four.

## Alternative A — the same toy, without the ticker

Use a plain percent and call the blast zone a blast zone. Same weights, same moves, faster to explain, and less of this game. The price fiction is a skin on the same formula, so a prototype can print “80%” for a week if the ticker art is in the way. The recommendation is still the price, because a number that gets more dangerous as it climbs is the satire and the mechanic at once.

## Alternative B — an isometric duel with the kits

Use the hostility rules already in the rig. No jump, no ring-out. It is cheaper, and it is a mode the game already has. It is not the thing this note is for.

## Decisions this note is making

- The cabinet is a third plug on the rig, not a district and not a replacement for the duel.
- Level, gear, and attributes do not enter.
- Jump is a button. The stick does not jump.
- Parking a guard raises your price.
- Rewards are words and a nameplate.
- The Nipper is specified here because the tree does not have one yet.
- MANDATE is a different rule and waits until Quarterly is already fun.
