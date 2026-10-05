#!/bin/sh
# Stitches src/ into the single-file game. Order matters: p11 must follow p10, p12 must follow p4.
cd "$(dirname "$0")/src" || exit 1
ORDER="p1.js p2.js p5.js p6.js p7.js p8.js p9.js p10.js p11.js p3.js p4.js p12.js"
mkdir -p ../dist ../.tmp
{ echo '(()=>{'; cat $ORDER; echo '})();'; } > ../.tmp/all.js
node --check ../.tmp/all.js || exit 1
{ cat p0.html; echo '<script>'; cat ../.tmp/all.js; echo '</script>'; } > ../dist/unsubscribe.html
wc -c ../dist/unsubscribe.html
