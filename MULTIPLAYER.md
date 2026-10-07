# Playing together

Stage 5b. Parties, hostility and the rig, over the account server from `server/README.md`.
Run it, sign in on two devices, and you are in the same world.

## A game holds eight

Everything below happens inside a **game**. Anyone can open one from the lobby with a name,
a difficulty and an optional password; it appears in everyone else's lobby and holds eight
people. A game is its own world — its own districts, its own monsters, its own difficulty.

Join a game, play, leave it, and you land back in the lobby. **A game is its players**: when
the last one leaves or logs off, it is over and stops being listed.

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

**Muting somebody mutes all of them** — their voice and their typing both.

## The rig

The Simulator takes a party. The leader books it, either way:

- **Waves, together** — everyone fights the same wave, and the first to clear it moves
  everybody on. The server holds the wave number and the seed, so every client generates
  the same waves.
- **Duelling** — the rig is the one place a fight between players costs nothing, because
  the game already knows that nothing in there is real. You still have to declare against
  each other first, or you will both swing at nothing.

## What the server is authoritative over, and what it is not

**It decides:** who exists, who is in which party, who is hostile to whom, who is in which
district, how experience is split, whether two players are allowed to fight at all, and
the Simulator's wave number and seed.

**It does not decide:** monsters, or damage. Each client simulates its own monsters, and an
attack that lands is an attack your client says landed. The server checks that the two of
you are permitted to fight, scales the damage and passes it on, but it cannot tell a real
hit from an invented one.

**This is cheatable, and it is written here rather than hidden.** A modified client could
claim hits it did not land. It is the right trade for a server meant for a few people who
know each other, and it is the wrong trade for a public ladder. Making it otherwise means
an authoritative simulation — the server running `update()` and owning every monster — and
that is a rewrite of the game loop, not a patch to it.

## How it is built

- One WebSocket per player, at `/live`, authenticated by the same session cookie as
  everything else. Refused at the handshake if the session is not valid.
- `server/lib/ws.js` is RFC 6455 in the standard library: handshake, text frames, ping and
  pong. Still no dependencies.
- `server/lib/live.js` holds the whole social model. It is about three hundred lines and
  there is no database behind it — presence is in memory, and when the server restarts
  everybody reconnects.
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

The remaining limit is **one process**: presence is in memory and saves are files on disk,
so running several copies behind a load balancer would give you several servers that cannot
see each other, fighting over the same directory. Run one. Several hundred people across
several dozen games is a reasonable expectation for it; it has not been load-tested, and
that is the honest caveat.

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
