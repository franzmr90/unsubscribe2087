# Putting the server on a box

The whole game — single-player and multiplayer — behind one domain. About €5 a month.

Everything here is tested as far as it can be without a real machine: the unit passes
`systemd-analyze verify`, the backup script was run and its archives restored, and the
server was confirmed to write only to `DATA_DIR` and never into its own checkout.

## What you need first

1. **A box.** Hetzner CX22 (€4.51/mo) or a DigitalOcean $6 droplet. Debian or Ubuntu.
   Far more machine than this needs.
2. **A domain**, with an A record pointing at the box. Caddy gets the certificate itself
   once DNS resolves, so do this before you run the script.
3. **An SMTP account** — Resend or Postmark free tiers are plenty. Optional: without one
   the server runs fine and password-recovery mail goes to a folder instead of an inbox.

## Running it

```sh
ssh root@your-box
git clone https://github.com/franzmr90/unsubscribe2087 /tmp/u
DOMAIN=play.yourdomain.com bash /tmp/u/deploy/setup.sh
```

It installs Node and Caddy, makes an unprivileged `unsub` user, clones to
`/opt/unsubscribe2087`, **builds the game from `src/`** so a stale committed `dist/` can
never be what ships, writes `/etc/unsubscribe2087.env`, installs the unit and the nightly
backup, starts everything, and refuses to claim success unless the app actually answers.

It is idempotent. Run it again after a change and it updates the checkout and restarts.

Then add your SMTP details to `/etc/unsubscribe2087.env` and
`systemctl restart unsubscribe2087`.

## The files

| | |
|---|---|
| `setup.sh` | one-shot provisioning, safe to re-run |
| `unsubscribe2087.service` | the systemd unit, hardened |
| `Caddyfile` | TLS and the reverse proxy |
| `unsubscribe2087.env.example` | every setting, with what each one breaks if wrong |
| `backup.sh` | nightly tar of the saves, fourteen kept |

## Three things that will bite you otherwise

**`DATA_DIR` lives outside the checkout.** It is `/var/lib/unsubscribe2087`, not
`server/data`. The default is right for a laptop and wrong for a server: deploy by
re-cloning with the default and you delete every character anybody has.

**`PUBLIC_ORIGIN` must be the real https URL.** It builds the links in recovery emails and
it is what turns on `Secure` cookies. Wrong, and password recovery fails silently.

**The TLS is load-bearing, not decoration.** Browsers refuse a microphone on a plain-http
origin, so there is no voice chat without it.

Also: `MemoryDenyWriteExecute` is deliberately **not** set in the unit. Node's JIT needs
writable-executable pages and the service will not start at all with it on. That is the
sort of hardening setting that looks free and is not.

## Running it

```sh
journalctl -u unsubscribe2087 -f     # logs
systemctl restart unsubscribe2087    # after a change
node tools/bugs.js                   # what players reported from inside the game
```

To update: re-run `setup.sh`, or `git pull && ./build.sh && systemctl restart unsubscribe2087`.

## Backups

Nightly to `/var/lib/unsubscribe2087-backups`, fourteen kept. Saves are plain files, so a
restore is `tar -xzf` over the data directory with the service stopped.

**They are on the same machine**, which protects against a bad deploy and not against
losing the box. Set `BACKUP_HOOK` in the env file to an executable. It is run with the
new archive path. `rclone copy` or `rsync` is the whole hook. HOSTING.md has the lines.

## Who is allowed on

`INVITE_REQUIRED=1` is written into a fresh env file. `setup.sh` mints one 25-use code and
prints it. `ALLOWLIST` is optional emails or names. `node server/admin.js invite mint`
makes another code; `invite revoke` kills one. The running server re-reads the file.

`ADMIN_TOKEN` is generated into the env file. `online`, `kick` and `broadcast` use it.
`ban`, `unban` and `reset` write the data directory; a reset also tells a connected client
to drop its local copy.

## Voice relay

Leave `TURN_URLS` empty until someone cannot hear the group. HOSTING.md has coturn (free,
on this box) and a hosted relay (a free tier, then about $10/mo).

## One process, on purpose

Presence, games and parties are in memory and saves are files on disk, so **do not run two
copies behind a load balancer.** You would get two worlds that cannot see each other,
fighting over the same directory. A game holds eight and everything is scoped to a game, so
one process carries several hundred people across several dozen games. `MAX_PLAYERS` and
`MAX_GAMES` cap it, and one over either is refused with a message rather than degrading.
