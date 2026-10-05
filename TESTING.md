# Playtesting Unsubscribe 2087

Three ways to run it, depending on what you want to test.

| | What you get | What you don't |
|---|---|---|
| **Open `dist/Unsubscribe-2087-standalone.html`** | The whole single-player game | Accounts, multiplayer |
| **`node server/server.js`** | Everything | Nothing |
| **The published Artifact** | The whole single-player game | Accounts, multiplayer |

Progress is kept in the browser's own storage in the first and third, so it survives a
reload but does not follow you to another device. Only the server does that.

---

## Running the full thing

```sh
./build.sh                 # after any change to src/
node server/server.js      # http://localhost:8087
```

Make an account on the panel that appears, and play. To test together, open a **second
browser profile** (or an incognito window — a second tab of the same profile shares the
session cookie and will sign you in as the same person) and make a second account.

One makes a game from the Party tab, the other joins it from the lobby.

### Testing from your phone, on the same network

Find your machine's address on the network (`ipconfig getifaddr en0` on macOS,
`hostname -I` on Linux), then:

```sh
PUBLIC_ORIGIN=http://192.168.1.50:8087 node server/server.js
```

and open that address on the phone. **Setting `PUBLIC_ORIGIN` matters** — it is what the
links in emails use.

**Voice will not work this way**, and this is a browser rule rather than a bug:
`http://localhost` counts as a secure context, but `http://192.168.1.50` does not, and the
microphone is refused outright. The game will say so. To test voice across devices, give it
a certificate:

```sh
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout /tmp/u2087.key -out /tmp/u2087.crt \
  -subj "/CN=192.168.1.50" \
  -addext "subjectAltName=IP:192.168.1.50"

TLS_KEY=/tmp/u2087.key TLS_CERT=/tmp/u2087.crt \
PUBLIC_ORIGIN=https://192.168.1.50:8087 node server/server.js
```

Each device will warn once about the self-signed certificate. Accept it and voice works.

---

## What is worth testing, roughly in order of how likely it is to be wrong

### Known to be unmeasured

These are the honest gaps. If something feels wrong here, it probably is.

1. **Acts III–V balance.** Never measured, by anybody. Districts 12–33. If a fight feels
   trivial or impossible, that is real information and nobody else has it.
2. **The eleven new uniques in Acts IV–V.** Strong by design; nothing has checked whether
   they are *too* strong. Four Thousand Two Hundred and Eleven, Eighty-Two Minutes, Ten
   Minutes and the rest.
3. **boss4 (The Curator) and boss5 (PROVIDENCE).** First-guess numbers.
4. **The companion, and party-pressure.** How the tag-along feels to have around; whether
   the difficulty adjusts at a sensible pace.
5. **Difficulty scaling in a game of more than two.** Nightmare and Hell, with four or more
   people, has only been tested by arithmetic.

### Worth a careful look

6. **The story, read by somebody who has not read the novel.** The whole point of the first
   pass. Do the three machines stay distinct? Does the Story tab help or clutter?
7. **The market.** Nonce's counter. Does the chart teach anything? Is the spread legible?
   Does Mr. Float's loan make the liquidation obvious *before* you take it?
8. **The lobby and a game's whole life.** Make one, have somebody join, play, leave, come
   back. Close it by logging off.
9. **Voice.** Does it fade sensibly as somebody walks off your screen? Does muting work?
10. **Hostility.** It is deliberately irreversible. Does that feel right or merely annoying?

### Things that are tested but only by machines

Every one of these has automated coverage, so a failure here is a surprise worth reporting
immediately: account creation, password recovery, saves following you between devices,
party experience sharing, town safety, the player cap, the report button.

---

## Filing what you find

Use the **Report** button in the game. It asks three questions and will not send until all
three are answered — what you were doing, what happened, and what you should have expected.
The third is the one that makes a report actionable.

Reports carry the district, your level and class, the game and difficulty, how many people
were in it, and any errors the page recorded. Read them back with:

```sh
node tools/bugs.js             # the last 20, newest first
node tools/bugs.js 50 --full   # more, with the full state and every error
node tools/bugs.js --json      # for piping somewhere else
```

They are one JSON file each under `server/data/bugs/`.

Playing on the Artifact or from a file, there is no server to file to, so the report goes to
your clipboard instead and you can paste it wherever.

---

## Running the automated tests

```sh
node tools/smoke.js            # boots, walks all 34 districts, renders every tab
node tools/smoke-acts.js       # walks the prequel and Acts IV–V, including the ending
node server/test/run.js        # 39 — accounts, saves, recovery, CSRF, rate limits
node server/test/games.js      # 26 — the lobby and the life of a game
node server/test/live.js       # 24 — two real browsers: parties, hostility, damage
node server/test/bug.js        # 15 — the report button
node server/test/capacity.js   #  5 — the player ceiling
node server/test/disclaimer.js # 11 — the card at the front
```

All of them pass on the current build. The browser ones need Playwright with Chromium; the
rest need nothing at all.

---

## If something breaks while you are testing

- **A script that drives the page cannot click anything.** The disclaimer card holds the
  screen for about seven seconds. Anything automating the page calls `__g.skipDisc()` first;
  all the tests and tools in this repo already do.
- **The page is blank or the district does not draw.** Entering a district opens a dialog,
  and the game does not advance while one is up. Dismiss it and move before deciding
  anything is broken — this has fooled me more than once.
- **You cannot sign in as two people.** A second tab shares the session cookie. Use a second
  browser profile or an incognito window.
- **The microphone button does nothing.** You are on `http://` and not on `localhost`. See
  above.
- **A game vanished.** A game is its players. When the last one leaves or logs off it is
  over, by design.
- **Saves disappeared.** Signed out, progress lives only in that browser. Signed in, it
  follows the account. The two are separate on purpose.
