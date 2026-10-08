# Getting a live link

## Read this first: the repository is private, and it should stay that way

`canon/` holds the manuscript of *Project Phonix* — 100 files, committed to `main`.

**Do not make this repository public to get GitHub Pages working.** That publishes the
novel, permanently: it is in the git history, so deleting the folder afterwards does not
take it back out of anyone's clone or fork.

Nothing below requires making it public. The game itself carries none of the manuscript —
`build.sh` reads only `src/`, and the built file contains zero references to it.

---

## The two real choices

|  | Free instant link | Your own server |
|---|---|---|
| **Gets you** | The single-player game | Everything: accounts, lobby, games of eight, parties, hostility, chat, voice |
| **Costs** | nothing | about €5 a month, plus a domain |
| **Time** | a minute | an evening |
| **Updates** | re-run one command | `git pull` and restart |

They are not exclusive. The free link is a good front door even after the server exists.

---

## The free instant link

The game is **one self-contained HTML file**, so the whole site is that file. No build step
on the host, no configuration, no repository.

```sh
./tools/web-bundle.sh      # writes web/
```

Then drag the `web/` folder onto **<https://app.netlify.com/drop>**. You get a URL in about
a minute, and can claim it to a free account afterwards to keep it and rename it.

Cloudflare Pages, Surge and S3 all take the same folder. Any of them is fine; the file is
static and has no server side.

To update it, re-run the script and drop it again — **onto the existing site, not a new
one**, or every player's saved character is stranded on the old URL.

**Better: stop doing this by hand.** `.github/workflows/deploy.yml` builds and deploys on
every push once two Netlify secrets are set. See `DEPLOYING-THE-GAME.md`.

**What people get:** the whole single-player game, saving progress in their own browser.
**What they do not get:** anything multiplayer. The build deliberately switches all of that
off when there is no account server behind it, so there are no broken buttons — the Party
tab and chat bar simply are not there.

### Auto-deploying from the repo

Done: `.github/workflows/deploy.yml` builds from `src/` and deploys to Netlify on every
push, production from `main` and a draft preview from anywhere else. It needs two Netlify
secrets and nothing else, and nothing is made public — see `DEPLOYING-THE-GAME.md`.

---

## Your own server, for the co-op beta

This is the only way multiplayer goes live. The same process also serves the single-player
game, so it is one link. Netlify Drop stays the single-player build: multiplayer switches
on only when this server is the thing serving the page.

What it needs, and why most hosts are wrong for it:

| Requirement | Why | Rules out |
|---|---|---|
| Exactly one process | Presence, games and parties live in memory | Anything that autoscales |
| A persistent disk | Saves are JSON files | Vercel, Netlify, Cloudflare Workers, Lambda |
| Always on | A spin-down closes every live game | Render's free tier, anything scale-to-zero |
| HTTPS | `Secure` cookies, and voice will not run without it | Plain-IP hosting |

A beta of 5–20 people fits on the smallest always-on box. Games hold eight. The process
is one Node server with no database.

### What you do, in order

You pick the host, the domain, and the DNS. The script does not create accounts or spend
money. Nothing below makes the repository public.

1. **Buy a small VPS.** Hetzner CX22 (about €4.51/mo, x86) or CAX11 (about €4/mo, ARM) is
   enough. A DigitalOcean $6 droplet is the same idea. Debian or Ubuntu. One public IPv4.
   Do not turn on autoscaling or a load balancer.
2. **Buy a domain** (about $12 a year) if you do not already have one. `play.yourdomain.com`
   is a fine name.
3. **Create an A record** for that name pointing at the box's IPv4. Wait until
   `dig +short play.yourdomain.com` prints the address. Caddy will not get a certificate
   until this resolves.
4. **SSH in as root and run the kit.** The repository is private, so use a deploy key or
   copy the checkout up yourself. Then:

   ```sh
   git clone git@github.com:franzmr90/unsubscribe2087.git /tmp/u
   DOMAIN=play.yourdomain.com bash /tmp/u/deploy/setup.sh
   ```

   It installs Node and Caddy, builds the game from `src/`, writes
   `/etc/unsubscribe2087.env` (mode 600, with a generated `ADMIN_TOKEN`), starts systemd,
   and mints one 25-use invite code. It prints that code. Give it to testers, or mint more:

   ```sh
   sudo -u unsub env DATA_DIR=/var/lib/unsubscribe2087 \
     node /opt/unsubscribe2087/server/admin.js invite mint --uses 1 --note "ada"
   ```

5. **Open https://play.yourdomain.com once** after DNS resolves, so you see Caddy finish
   the certificate. The first request can take a minute.
6. **SMTP, or accept manual recovery.** Put these in `/etc/unsubscribe2087.env` and
   `systemctl restart unsubscribe2087`:

   | Key | What |
   |---|---|
   | `SMTP_HOST` | `smtp.resend.com` or `smtp.postmarkapp.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` / `SMTP_PASS` | the provider's SMTP credentials |
   | `MAIL_FROM` | an address on a domain the provider will send for |

   Resend and Postmark both have a free tier that covers password mail for 20 people.
   With the keys empty, the server still runs. Recovery links are written to
   `/var/lib/unsubscribe2087/outbox/` and the journal. You can open that file and send the
   link yourself. That is a fine beta if you do not want to set up mail yet.
7. **Off-box backups.** Nightly archives land in `/var/lib/unsubscribe2087-backups` and
   stay on the machine, which does not help if the disk dies. Set `BACKUP_HOOK` to an
   executable that receives the archive path. Two that cost nothing beyond a place to put
   the files:

   ```sh
   # /usr/local/bin/unsubscribe2087-offbox
   #!/bin/sh
   rclone copy "$1" remote:unsubscribe-backups
   ```

   or `rsync -az "$1" you@elsewhere:/backups/`. Install rclone (or the ssh key) yourself.
   Hetzner Storage Box is about €3/mo; a second free Oracle/Cloudflare R2 bucket also works.
   The hook runs at the end of `deploy/backup.sh`.
8. **TURN, only if voice fails for someone.** Default voice uses Google's public STUN and
   no relay. People on strict NATs (some mobile carriers, some university networks) will
   not hear each other. Two options:

   | | Cost | What you do |
   |---|---|---|
   | **coturn on this same box** | €0, plus the bandwidth of the audio | `apt install coturn`, open 3478, set `TURN_URLS=turn:play.yourdomain.com:3478` and a user/pass. For 20 people the audio is small. |
   | **Hosted TURN** | Metered.ca has a free 20 GB/mo tier, then about $10/mo. Twilio's Network Traversal is billed per GB, a few dollars at this size. | Put their url, username and credential in `TURN_URLS`, `TURN_USER`, `TURN_PASS` and restart. |

   The server sends those to the browser on connect. Audio still does not pass through
   Node. Leave the keys empty until a tester actually cannot hear anyone.

### Values that have to be right

`/etc/unsubscribe2087.env` is the whole configuration. `deploy/unsubscribe2087.env.example`
comments every key.

| Key | Beta value |
|---|---|
| `PUBLIC_ORIGIN` | `https://play.yourdomain.com` exactly. Wrong, and recovery links and Secure cookies break. |
| `TRUST_PROXY` | `1`, because Caddy is in front. |
| `DATA_DIR` | `/var/lib/unsubscribe2087`, outside the checkout. |
| `INVITE_REQUIRED` | `1`. Without it, and with no codes and no allowlist, registration is open. |
| `ALLOWLIST` | Optional emails or names that skip the code. |
| `ADMIN_TOKEN` | Generated by setup. `online`, `kick`, `broadcast` refuse to run without it. |
| `WS_REQUIRE_ORIGIN` | `1`. A page on another site cannot open the socket. |
| `DEBUG_HOOKS` | Leave unset. The test hooks (`window.__g`, the Options testing buttons) stay off on the public host. |
| `GITHUB_TOKEN` | Empty until you want reports to open issues. Fine-grained, this repo only, Issues read and write. |
| `BUG_REPO` | `franzmr90/unsubscribe2087`. That is the default when the key is omitted. |
| `BUG_WEBHOOK_URL` | Optional. From a Grok Bot routine's webhook panel. |
| `BUG_WEBHOOK_KEY` | The panel's secret. Sent with each notice. |
| `BUG_WEBHOOK_KEY_HEADER` | `Authorization` unless the panel names a different header. |

### Running it after the first night

```sh
journalctl -u unsubscribe2087 -f          # includes a [live] stats line each minute
node /opt/unsubscribe2087/server/admin.js online
node /opt/unsubscribe2087/server/admin.js kick "Some Name"
node /opt/unsubscribe2087/server/admin.js ban "Some Name" --reason "needed"
node /opt/unsubscribe2087/server/admin.js unban "Some Name"
node /opt/unsubscribe2087/server/admin.js reset "Some Name" --slot all
node /opt/unsubscribe2087/server/admin.js broadcast "Server restarting in one minute."
node /opt/unsubscribe2087/server/admin.js bugs
```

The file commands (`invite`, `ban`, `reset`) read `DATA_DIR`. On the box, prefix them with
`sudo -u unsub env DATA_DIR=/var/lib/unsubscribe2087` so the files stay owned by the
service user. `online`, `kick` and `broadcast` talk to the running process and need
`ADMIN_TOKEN`, which the CLI reads from `/etc/unsubscribe2087.env` when you run it as root.

To update: `bash deploy/setup.sh` again with the same `DOMAIN`, or
`git -C /opt/unsubscribe2087 pull && ./build.sh && systemctl restart unsubscribe2087`.
A stale tab is told to reload; the server sends the build id on connect.

**One process, on purpose.** Do not run two copies. Saves are files and presence is memory.

### Bug intake

The in-game reporter already writes a file under `$DATA_DIR/bugs`. With `GITHUB_TOKEN`
unset, that is the whole feature. Setting the token adds two steps that never delay the
player's "Filed" reply: open a GitHub issue, then optionally tell a webhook.

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
   Resource owner is your user. Repository access is **Only select repositories**, and the
   only one is `unsubscribe2087`. Permissions: **Issues, read and write**. Leave every
   other permission at No access. Put the token in `GITHUB_TOKEN`.
2. On the repository, create two labels: `bug-report` and `auto-intake`. The server also
   tries to create them on the first report. A token that cannot create labels still
   files the issue once the labels exist.
3. `BUG_REPO` stays `franzmr90/unsubscribe2087` unless you are pointed at a fork.
4. Webhook: open the Grok Bot routine's webhook panel. Copy its URL into `BUG_WEBHOOK_URL`
   and its secret into `BUG_WEBHOOK_KEY`. If the panel says the secret belongs in
   `Authorization`, leave `BUG_WEBHOOK_KEY_HEADER` unset — the server sends
   `Bearer <key>`. If the panel names some other header, set `BUG_WEBHOOK_KEY_HEADER` to
   that name and the server sends the key raw.

Only a signed-in account opens an issue. A report filed before login still lands in
`bugs/`. The same account can open or update five issues an hour, and the whole server
fifty. Past either cap the report is saved and marked `queued`. A repeat of the same
error, in the same district, on the same build, comments on the open issue instead of
opening another one.

`node server/admin.js bugs` prints recent reports and, when intake ran, the issue link.
A `[live]` line once a minute includes `bugFail=`, which counts GitHub and webhook
failures since the process started. The report itself never includes an email, an IP,
a token, or an invite code.
