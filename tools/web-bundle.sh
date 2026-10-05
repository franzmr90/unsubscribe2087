#!/usr/bin/env bash
# Builds a folder you can drag onto any static host (Netlify Drop, Cloudflare Pages,
# Surge, S3). The game is one self-contained file, so the whole site is that file
# named index.html — there is nothing else to upload and nothing to configure.
#
#   ./tools/web-bundle.sh        -> web/
set -euo pipefail
cd "$(dirname "$0")/.."

./build.sh >/dev/null

OUT=web
rm -rf "$OUT"
mkdir -p "$OUT"
cp dist/Unsubscribe-2087-standalone.html "$OUT/index.html"
# Some hosts serve 404s from this; point it back at the game rather than their default page.
cp dist/Unsubscribe-2087-standalone.html "$OUT/404.html"

bytes=$(wc -c < "$OUT/index.html")
[ "$bytes" -gt 400000 ] || { echo "the build looks truncated ($bytes bytes)" >&2; exit 1; }
grep -q '</html>' "$OUT/index.html" || { echo "the build does not end properly" >&2; exit 1; }

echo "web/ is ready — $(( bytes / 1024 ))KB, single-player only."
echo "Drag the web/ folder onto https://app.netlify.com/drop for a link in about a minute."
