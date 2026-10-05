# The Unsubscribe 2087 server

A small account server, so a handful of people can play on their own devices and keep
their characters. It serves the game as well, which is how the game ends up talking to it.

**There is nothing to install.** No `package.json`, no dependencies, no build step. Node 18
or newer, and:

```sh
node server/server.js          # http://localhost:8087
```

It serves `dist/unsubscribe.html` from the current build, so `./build.sh` and a reload is
the whole edit loop.

## What it does

| | |
|---|---|
| Accounts | name + password, 8 characters minimum, scrypt hashed |
| Email | optional, and the only route to recovery or a mailed backup |
| Recovery | one-time link, 30 minutes, invalidated on use |
| Change password | requires the current one, signs out every other device |
| Email backup | mails you the whole account as the JSON the game writes |
| Restore | upload that JSON back |
| Delete | requires the password, removes the account and every character |
| Saves | the game's existing account-save path, pointed here |

## How it reaches the game without touching the game

The game already knows how to save to an account. It asks the page for
`window.claude.use('user')` and `window.claude.use('db')`, then reads and writes documents
through `collection(…).doc(id).get() / .set() / .delete()`. That interface is the entire
contract.

So `server/public/cloud-shim.js` implements that interface against this server, and the
server injects it into the page ahead of the game bundle. **No game source changes.** The
same `dist/unsubscribe.html` runs here, as an Artifact, and from a file — each one finds
whatever account system is present, or none, and falls back to `localStorage`.

The shim also draws the sign-in panel, because the game has no idea accounts exist.

## Configuration

All optional; all environment variables.

| Variable | Default | |
|---|---|---|
| `PORT` | `8087` | |
| `PUBLIC_ORIGIN` | `http://localhost:$PORT` | **Set this in production.** It builds the links in emails, and an `https://` value is what turns on `Secure` cookies. |
| `DATA_DIR` | `server/data` | |
| `TRUST_PROXY` | off | `1` to read `X-Forwarded-For`. Only behind a proxy that sets it — otherwise clients forge their own rate-limit identity. |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` `SMTP_SECURE` | none | No host configured means mail is written to `data/outbox/` and logged instead, so recovery can still be walked through. `SMTP_SECURE=1` for implicit TLS on 465; otherwise STARTTLS. |
| `MAIL_FROM` | `no-reply@localhost` | |

## Storage

`DATA_DIR` holds `users.json`, `sessions.json`, `tokens.json` and `docs/<account>/<doc>.json`.
Plain files, written to a temp name and renamed over the target so a crash cannot truncate
one. **Backup is `cp -r`.** A database would have been a dependency, a build step and a
migration story, for a server whose whole population fits in a room.

## Security notes

- scrypt (N=16384, r=8, p=1), parameters stored beside each hash so they can be raised
  later without invalidating anybody's password.
- Session cookie is opaque, `HttpOnly`, `SameSite=Lax`, `Secure` when the origin is https.
  Only its SHA-256 is stored, so a leaked data directory does not hand over live sessions.
- Writes need the session's CSRF token in an `X-CSRF` header — the second lock behind
  `SameSite`.
- Reset and verification tokens are single use, 30 minutes, and stored hashed.
- `/api/forgot` answers identically whether or not the address is known, and login answers
  identically for a wrong name and a wrong password, so neither is an account directory.
  A failed login still runs a scrypt hash, so the timing matches too.
- Rate limits on register, login (per address *and* per account name), recovery and backup.
- Document ids are filtered to `[A-Za-z0-9_.:-]`, so no client can name its way out of its
  own directory, and the account is taken from the session rather than from the request.

## Tests

```sh
node server/test/run.js
```

39 checks over a throwaway data directory: registration and validation, the document store
and its isolation between accounts, CSRF, path traversal, login, password change and the
session invalidation it causes, recovery end to end (the link is read back out of the
outbox, exactly as a person reads it out of an inbox), single-use tokens, backup, restore,
deletion, static serving and rate limiting. No network, no SMTP, no browser.

## Deploying it

Any host that runs Node and gives you a disk. Put it behind a TLS terminator, set
`PUBLIC_ORIGIN` to the https URL, set `TRUST_PROXY=1`, point SMTP at a relay, and run it
under something that restarts it. There is no clustering: it holds state in memory and
writes files, so run **one** process.
