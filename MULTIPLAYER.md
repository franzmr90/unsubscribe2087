# Playing together

Stage 5b. Parties, hostility and the rig, over the account server from `server/README.md`.
Run it, sign in on two devices, and you are in the same world.

## The rules are Diablo II's

Because they were right, and because they are the rules people already know.

- **A party is an invitation both sides agree to.** Up to eight. The leader invites; the
  invited person accepts or does not.
- **Experience is shared by level, among whoever is actually there.** Only members in the
  same district as the killer get a share, weighted by their level against the sum of the
  levels present, multiplied by Diablo II's own party bonus — 1.5× for two, 1.75× for
  three, up to 3× for eight. Somebody standing in town is not helping.
- **Quest progress is shared** with the members who are in the district when it happens.
- **Hostility is declared, not ambient.** You press a button with somebody's name on it.
  It takes them out of your party, it is announced to everyone, and **it does not come
  back** while you are both in this world. That is the whole reason it means anything.
- **Town is safe.** No damage between players in any town, ever.
- **Five seconds of grace** on entering a district, so nobody can camp a doorway.
- **Damage between players lands at 25%.** People are much harder to put down than
  machines, which is what makes a duel a fight rather than an ambush.

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
node server/test/live.js     # two real browsers against one server
```

Fourteen checks: presence, invitation, the party forming on both sides, experience actually
arriving, seeing each other in a district, hostility reaching the other player, hostility
throwing you out of the party, the stand-in appearing so skills can find it, town being
safe, chat, and that you cannot re-party with somebody you declared against.

**Two checks are currently failing**, both on the last hop of player-to-player damage: the
hit is sent and the server accepts it, but the test does not observe the defender's health
falling. Everything up to and including the stand-in being a valid target passes. This is
the known open item; see `PROGRESS.md`.

## Reporting a problem

There is a **Report** button in the heads-up display. It does not file anything when
pressed: it asks first, with the game's own four-second hold on the buttons, and then a
form that will not send until all three questions are answered — what you were doing, what
happened, and what you expected instead. Reports land in `server/data/bugs/` as one JSON
file each, carrying the district, level, class, quest state and any errors the page
recorded. Served from somewhere with no server behind it, the report goes to the clipboard
instead so it can still be passed on.
