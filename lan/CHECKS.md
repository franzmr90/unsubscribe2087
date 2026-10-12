# Running the checks on your own machine

`LAN-PLAY.md` is for playing. This is for proving the thing works, on a laptop
on a real home network — which is something a cloud container cannot do.

## The short version

```sh
cd unsubscribe-2087-lan
node server/test/run.js        # accounts, passwords, email, recovery
sh  server/test/ci.sh          # everything (needs Playwright for some, see below)
```

## What needs nothing but Node

These are pure Node and run anywhere, in seconds:

| Suite | What it covers |
|---|---|
| `run.js` | accounts, password hashing, change, recovery, email |
| `wire.js` | the hand-rolled WebSocket framing |
| `social.js` | friends, letters left while someone is offline |
| `games.js` | the lobby: making, joining, leaving, closing |
| `capacity.js` | how many games and players the box will take |
| `bug.js`, `intake.js` | the bug reporter and what it stores |
| `invite.js`, `guard.js` | invite codes, rate limits, proxy handling |
| `reconnect.js`, `admin.js` | dropping and coming back, the admin tool |
| `maps.js`, `plaus.js`, `mobs.js` | shared districts, life formulas, monster hosting |

Run one with `node server/test/<name>.js`. They print `N passed, 0 failed`.

## What needs Playwright

`live.js` and `coop.js` drive real browsers against the server. Install once:

```sh
npm install playwright
npx playwright install chromium
```

Then `node server/test/live.js`.

## The LAN suite — the one that needs your Mac

`server/test/lan.js` is the reason this file exists. It checks the home-network
path: that the server prints an address other computers can type, that someone
on the house network can make an account without an invite, and that someone
coming from outside it cannot.

It needs a host with a **real private address** — `192.168.x.x`, `10.x.x.x` or
`172.16–31.x.x`. Your Mac on your home Wi-Fi has one. A cloud container does
not: the one this was built in only had `192.0.2.2`, which is a documentation
address, so `lan.urls()` returns nothing and the suite cannot start.

```sh
node server/test/lan.js
```

**It has never been run for real.** One of its assertions was impossible on any
machine — it bound a client socket to `203.0.113.9`, a documentation address no
computer owns, so the suite crashed with `EADDRNOTAVAIL` before it reached the
browser part. That is fixed; it now shows the gate a public address through the
forwarded header instead. The other twenty-one assertions are unproven. If
something fails, that is useful — send the output.

## The two-phones check

The one that matches what the package is for: the laptop hosts, nobody plays on
it, and two phones meet in a game. Start the launcher, then from a clone of the
repo:

```sh
node tools/two-phones.js http://192.168.x.x:8087/
```

It makes two accounts, starts a hero on each, opens a game from one phone, finds
it in the lobby from the other, joins, and checks both rosters show both names
and that chat crosses. Needs Playwright.

## Playing and checking at the same time

Don't. The suites start their own servers on their own ports and write to a
temporary data directory, but `lan.js` looks at the network interfaces and the
launcher may already hold the port. Stop the launcher first.

## Where the data lives

Accounts and characters go in `Unsubscribe 2087 saves` in the home folder, outside
the kit, so a fresh unzip keeps them. The launcher prints the path on boot. An older
kit's `saves/` next to the launcher is copied there once. Delete the home-folder one
to start clean. The suites never touch it — they use a temp directory and clean up.
