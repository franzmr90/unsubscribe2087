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

## Your own server, for the whole game

This is the only way the multiplayer goes live, and it also serves the single-player game,
so it is one link for everything.

What it needs, and why most hosts are wrong for it:

| Requirement | Why | Rules out |
|---|---|---|
| Exactly one process | Presence, games and parties live in memory | Anything that autoscales |
| A persistent disk | Saves are JSON files | Vercel, Netlify, Cloudflare Workers, Lambda |
| Always on | A spin-down closes every live game | Render's free tier, anything scale-to-zero |
| HTTPS | `Secure` cookies, and voice will not run without it | Plain-IP hosting |

So: a small, boring, always-on box.

1. A domain, about $12 a year.
2. **Hetzner CX22** (€4.51/mo) or a **DigitalOcean** $6 droplet. Far more than this needs.
3. **Caddy** in front — it gets and renews the TLS certificate on its own, in about four
   lines of config. This is what makes voice chat work at all.
4. **systemd** to keep it running and restart it on boot.
5. **SMTP** for password recovery — Resend or Postmark free tiers are plenty. Without one
   the server still runs; recovery links land in `server/data/outbox/` instead.
6. A cron'd copy of the data directory, somewhere else. It is only files.

Then:

```sh
PUBLIC_ORIGIN=https://yourdomain TRUST_PROXY=1 DATA_DIR=/var/lib/unsubscribe \
  node server/server.js
```

**Set `DATA_DIR` outside the checkout.** It defaults to `server/data`, which is fine
locally and dangerous on a server: redeploy by re-cloning and you wipe every save.

**The deploy kit is written**: see `deploy/` — a one-shot `setup.sh`, a hardened systemd
unit, a Caddyfile, an annotated env template and a nightly backup. `deploy/README.md` walks
through it.
