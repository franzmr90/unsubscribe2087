# Publishing the game automatically

Every push that touches `src/` now builds the game and deploys it to Netlify. No dragging
folders, no rebuilding by hand.

| Branch | What happens |
|---|---|
| `main`, or run by hand from the Actions tab | **Production** — the real URL |
| Any other branch | A **draft deploy** with its own preview URL. Production is untouched. |

## Two secrets, once

Repository **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Where to get it |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Netlify → avatar → **User settings** → **Applications** → **Personal access tokens** → New access token |
| `NETLIFY_SITE_ID` | Netlify → your site → **Site configuration** → **Site information** → **Site ID** |

That is the whole setup. The workflow fails with a clear message if either is missing,
rather than deploying nothing and reporting success.

## Why not a public mirror repo

The first plan was a second, public repository holding only the built file, with Netlify
watching it. Deploying straight from Actions does the same job with one less moving part,
and — more to the point — **`canon/` never has to be kept out of anywhere**, because
nothing is ever made public. The repository stays private by construction rather than by
careful mirroring.

If you later want the source public for its own sake, that is a separate decision, and
`canon/` would need removing from the history first — not just from the files.

## What it checks before deploying

A truncated or broken build would deploy perfectly happily, so the workflow refuses unless:

- the file exists and is over 400KB (a truncated build is much smaller)
- it contains the game canvas
- it ends with a closing `</html>`
- **it contains no manuscript text** — a last line of defence on the thing that would
  actually matter if the build process ever changed

It also builds from `src/` rather than shipping the committed `dist/`, so a stale build
cannot go out by accident.

## Deploying by hand anyway

Still works, and is useful when you want to ship without a commit:

```sh
./tools/web-bundle.sh                 # writes web/
npx netlify-cli deploy --prod --dir web
```

Or drag `web/` onto <https://app.netlify.com/drop> — **onto the existing site, not a new
one**. A new site means a new URL, and every player's saved character is tied to the old one.

## Note on GitHub Pages

`.github/workflows/pages.yml` was removed. Pages on a private repository needs a paid plan,
so it would have failed on every push and left a red cross in the Actions tab for no
reason. Netlify is doing the job.
