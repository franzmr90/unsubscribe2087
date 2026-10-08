# Playing together

Stage 5b. Parties, hostility and the rig, over the account server from `server/README.md`.
Run it, sign in on two devices, and you are in the same world.

## A game holds eight

Everything below happens inside a **game**. Anyone can open one from the lobby with a name,
a difficulty and an optional password; it appears in everyone else's lobby and holds eight
people. A game is its own world — its own districts, its own monsters, its own difficulty.

Join a game, play, leave it, and you land back in the lobby. **A game is its players**: when
the last one leaves or logs off, it is over and stops being listed. A dropped connection
holds your place in the game and the party for 45 seconds, then lets go. The client keeps
trying to reconnect and asks to be let back in if the game is still there.

A game is one map. The server issues a seed for each district, each tier, and each
redraw (a subpoena or the bull field). Both clients draw that district from the seed, so
the rooms, the spawn points, the waypoints and the town's residents match. A character's
own districts, saved on that character, are not used while the game is up and are not
overwritten by it. Gramps still holds the act gate on each character. The machines
are shared too: one player in the district (the host, whoever arrived first and is
still there) moves them, and the server keeps the one pool of hit points. A kill pays
experience from that pool. Loot is still rolled on your own client, for you and for
the party members standing in the district. The Simulator's wave number and its wave
seed are shared. The boss-rush lineup is still whoever that character has beaten.

Scoping to a game of eight is also what makes the server safe to post publicly. Every cost
— the roster, the movement fan-out, the chat — is bounded by the size of a game rather than
by the number of people on the server.

### Difficulty

Chosen when the game is made and fixed for its life, as Diablo II's were.

| | Monster health | Monster damage | Experience |
|---|---|---|---|
| **Normal** | 1× | 1× | 1× |
| **Nightmare** | 2.5× | 1.6× | 1.8× |
| **Hell** | 5× | 2.4× | 2.8× |

On top of that, **every extra person in the game adds half again** to monster health and to
what monsters are worth — so eight people face monsters four and a half times tougher than
one person does, and are paid for it. This is the number of people in the *game*, not in
your party.

These multiply into `partyH()` and `partyD()`, the multipliers the game already had for its
companion pressure, so nothing else in the combat maths changed.

## The rules are Diablo II's

Because they were right, and because they are the rules people already know.

- **A party is an invitation both sides agree to**, inside a game. Up to eight. The leader
  invites; the invited person accepts or does not. You can be in a game with seven other
  people and in a party with none of them.
- **Experience is shared by level, among whoever is actually there.** Only members in the
  same district as the killer get a share, weighted by their level against the sum of the
  levels present. The pool is a third again the kill (×1.35), the same on a party of two
  as on a party of eight. Somebody standing in town is not helping.
- **Quest progress is shared** with the members who are in the district when it happens.
  Hearing Gramps close an act is not one of those shares. The next act stays shut on
  each character until that character has heard him. A party mate who has heard it can
  go on. One who has not stays where they are: Gramps is in that act's town, and the
  quest log points at him. A save that already walked on is not pulled back. The skipped
  line is marked heard, and Gramps talks about the act they are in.
- **Hostility is declared, not ambient.** You press a button with somebody's name on it,
  in town, once a minute, and both of you need to be level 9. It takes them out of your
  party and it is announced. Outside a town you can fight. Standing down, also in town,
  stops only your own swings; theirs remain, so the party does not come back while either
  flag is still up. Leave the game and both flags are gone.
- **Town is safe.** No damage between players in any town, ever.
- **Five seconds of grace** on entering a district, so nobody can camp a doorway.
- **Damage between players lands at 25%**, then armour, the same as a machine hit.
  Game difficulty and companion pressure do not multiply it. People are much harder to
  put down than machines, which is what makes a duel a fight rather than an ambush.

## Talking

**Text goes to the whole game**, wherever anybody is standing. One channel on purpose: two
means half of what gets said goes to the wrong one. The bar is on screen rather than in a
menu, collapsed to a small **SAY** button that carries a dot when something has been said.

**Voice is whoever can see you.** With a microphone open you are heard by anybody who has
you on their screen, in their district, fading out over a short band at the edge so people
do not pop in and out. The pan follows which side of their screen you are on, so a voice
arrives from the direction the person is standing in. Walk off the edge and they lose you.

It is a WebRTC mesh: each pair of people holds one connection and sends audio directly.
**The server carries only the handshake** — the audio never touches it, which is why talking
costs the server nothing, and why eight is the right number, since each person holds seven
connections and that is the comfortable limit for a mesh.

It needs **https** (`getUserMedia` will not run otherwise) and uses public STUN servers. A
minority behind strict NATs would need a TURN relay, which is not configured and does cost
bandwidth; those people simply will not connect to some peers.

**Muting somebody mutes their voice and their typing in the game.** A whisper still arrives.

## The rig

The Simulator takes a party. The leader books it, either way:

- **Waves, together** — everyone fights the same wave number, and the first to clear it
  moves everybody on. The server holds the wave number and a seed. Each wave is drawn from
  that seed, and the same host-and-hit-point rules apply as in a district.
- **Duelling** — the rig is the one place a fight between players costs nothing, because
  the game already knows that nothing in there is real. You still have to declare against
  each other first, or you will both swing at nothing.

## What the server is authoritative over, and what it is not

**It decides:** who exists, who is in which party, who is hostile to whom, who is in which
district, the layout seed for that district, how experience is split, whether two players
are allowed to fight at all, the Simulator's wave number and wave seed, and the hit points
of a machine in a game. A kill's experience is paid from that hit-point pool. It also refuses
experience, player damage, quest flags and saves that are outside a coarse bound.

**The host client still moves the machines.** The server does not run their AI. That is
the whole of why a small box can hold several games: the soak of twenty walking players
sat near one percent of a core, and copying `update()` onto the server would spend the
box on pathfinding. When the host leaves the district, the next person there is handed
the positions and carries on. A guest's blows go to the server as numbers, clamped to
the machine's max life, and the bar you see is the number that comes back.

**This is still cheatable, and it is written here rather than hidden.** The host can
describe a swing that did not happen, and a guest can report a hit from across the
district; the server checks the size, not the distance. A modified client can also still
send the old party-experience packet (memos use it, and it stays capped). It is the right
trade for a few people who know each other, and the wrong trade for a public ladder.
Owning the AI as well means the server running `update()`, which is a rewrite of the
game loop, not a patch to it. A cast portal is still that character's.

## How it is built

- One WebSocket per player, at `/live`, authenticated by the same session cookie as
  everything else. Refused at the handshake if the session is not valid.
- `server/lib/ws.js` is RFC 6455 in the standard library: handshake, text frames, ping and
  pong. Still no dependencies.
- `server/lib/live.js` holds games, parties, hostility and who is on. Those live in memory.
  When the server restarts, everybody reconnects and the open games are gone.
- `server/lib/social.js` holds the friends list and the offline letter box, as files beside
  the saves, outside the emailed document backup. A friendship and a letter survive that
  restart. Friends and asks stop at twenty-five; a block sits past that. The box holds
  forty letters for thirty days, and a letter is a whisper sent while they were off. An
  online whisper is handed across the socket and then forgotten. There is no player
  directory: a whisper to someone who is not a friend gets the same line as a name that
  is not registered.
- `src/p13.js` is the client half, loaded last so everything else is in scope. **It is
  inert unless the page is being served by the account server**, which is why the same
  build still runs as an Artifact and from a file with no multiplayer at all.

### The one idea worth knowing

A hostile player is inserted into `W.ents` as an inert stand-in. It does not think, it does
not push other entities around, and it does not die there — its own client decides that.
But because it is in `W.ents`, **every skill, projectile and area effect in the game already
hits it**, with no per-skill PvP code anywhere. `dmgEnemy` spots the stand-in and routes the
damage to the server instead of applying it.

The other thing worth knowing: the network clock is **not** the game loop. `update()` stops
while a dialog or a sheet is open, and somebody reading their inventory has not left the
district and is not invulnerable. Position, stand-ins and incoming damage all run on their
own 100ms interval.

## Tests

```sh
node server/test/games.js    # the lobby and the life of a game — no browser
node server/test/live.js     # two real browsers against one server
```

**games.js, 26 checks:** landing in the lobby, making a game with a name and a difficulty,
the difficulty and the player count both biting, others seeing it listed, joining, the
roster being the game, text reaching everybody, the voice handshake being relayed to the
right person, the ninth player turned away, a locked game refusing the wrong password and
accepting the right one, leaving landing you back in the lobby, and logging off closing the
game.

**live.js, 24 checks:** making and joining a game from two real browsers, the difficulty
scaling reaching the combat maths, invitation, the party forming on both sides, experience
actually arriving, seeing each other in a district, hostility reaching the other player and
throwing you out of the party, the stand-in appearing so skills can find it, damage crossing
between players and being scaled down, town being safe, chat, that you cannot re-party with
somebody you declared against, and that leaving puts you back in the lobby with the
difficulty dropping back.

```sh
node server/test/capacity.js # the ceiling, with no browser
```

Five more: joining up to the ceiling, the refusal one over it, that the refusal says what
to do, that somebody leaving makes room again, and that a socket with no account never gets
past the handshake.

All sixteen live checks and all five capacity checks pass.

One of them found a real bug worth naming: `P.inv`, the brief invulnerability after walking
through a door, only ticks down inside `update()` — which stops while a dialog or a sheet is
open. A player sitting in a menu kept it indefinitely. The server's five-second grace is the
authority for a fight between players, so a hit it has already allowed is no longer gated on
the local invulnerability as well.

## How many people can play at once

Games are capped at 8, and everything per-player is scoped to a game, so the per-player cost
no longer grows with how busy the server is:

- **Movement fan-out** goes through a per-district index, so answering a position update
  costs the number of people in that district of that game — at most seven.
- **The roster** is the game, not the server: eight entries, coalesced to at most five a
  second.
- **Voice** costs nothing at all; it is peer to peer.

Two ceilings sit above that, both of which refuse clearly rather than degrading:
`MAX_PLAYERS` (default 400) and `MAX_GAMES` (default 200). One over either gets told what
happened and what to do, and keeps playing alone.

The remaining limit is **one process**: presence is in memory, and saves, friends and the letter box are files on disk,
so running several copies behind a load balancer would give you several servers that cannot
see each other, fighting over the same directory. Run one. Several hundred people across
several dozen games is a reasonable expectation for it. `node tools/soak.js` puts twenty
headless players through movement, chat, party traffic and a thin combat loop (host
reports, others hit) and prints latency, CPU, memory, messages per second, and how many
hit-point updates came back. The server is not simulating the machines. The host client is.

## Reporting a problem

There is a **Report** button in the heads-up display. It does not file anything when
pressed: it asks first, with the game's own four-second hold on the buttons, and then a
form that will not send until all three questions are answered — what you were doing, what
happened, and what you expected instead. Reports land in `server/data/bugs/` as one JSON
file each, carrying the district, level, class, quest state and any errors the page
recorded. Served from somewhere with no server behind it, the report goes to the clipboard
instead so it can still be passed on.

## On the Artifact, and from a file

The same build runs in three places and finds whatever is there:

| | Accounts | Games, chat, voice | Report button |
|---|---|---|---|
| **The account server** | yes | yes | files to the server |
| **A claude.ai Artifact** | the host's own account store | **none** | to the clipboard |
| **A file on disk** | `localStorage` only | none | to the clipboard |

The multiplayer half is gated on `window.__u2087server`, a marker only this server's shim
sets. Testing for `window.claude` would not do — the Artifact host provides one of those
too, and the game would sit there trying to open a socket to a host that has never heard of
it. With the marker absent there is no Party tab, no chat bar, no socket attempt and no
difficulty scaling, and the game is exactly what it was before any of this existed.
