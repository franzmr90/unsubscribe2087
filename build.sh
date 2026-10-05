#!/bin/sh
# Stitches src/ into the single-file game. Order matters: p11 must follow p10, p12 must follow p4.
# Writes two files that must stay in step:
#   dist/unsubscribe.html                  - fragment for the claude.ai Artifact (no doctype/html/head/body)
#   dist/Unsubscribe-2087-standalone.html  - the same page wrapped so it opens from the filesystem
# The wrapper swaps the fragment's bare <title> (its first line) for a real <head>.
cd "$(dirname "$0")/src" || exit 1
ORDER="p1.js p2.js p5.js p6.js p7.js p8.js p9.js p10.js p11.js p3.js p4.js p12.js"
mkdir -p ../dist ../.tmp
{ echo '(()=>{'; cat $ORDER; echo '})();'; } > ../.tmp/all.js
node --check ../.tmp/all.js || exit 1
{ cat p0.html; echo '<script>'; cat ../.tmp/all.js; echo '</script>'; } > ../dist/unsubscribe.html
{ printf '%s\n' '<!doctype html>'
  printf '%s\n' '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"><meta name="theme-color" content="#050409"><title>Unsubscribe 2087</title><style>html,body{margin:0;height:100%;background:#050409;overflow:hidden}</style></head><body>'
  tail -n +2 ../dist/unsubscribe.html
  printf '%s' '</body></html>'
} > ../dist/Unsubscribe-2087-standalone.html
wc -c ../dist/unsubscribe.html ../dist/Unsubscribe-2087-standalone.html
