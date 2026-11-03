#!/bin/sh
# The server suites. No browser except live.js, which needs a build and Playwright.
set -e
cd "$(dirname "$0")/../.."
node server/test/run.js
node server/test/wire.js
node server/test/social.js
node server/test/games.js
node server/test/capacity.js
node server/test/bug.js
node server/test/intake.js
node server/test/disclaimer.js
node server/test/maxi.js
node server/test/invite.js
node server/test/guard.js
node server/test/reconnect.js
node server/test/admin.js
node server/test/maps.js
node server/test/plaus.js
node deploy/dry-run.js
node server/test/mobs.js
node server/test/coop.js
node server/test/live.js
node server/test/accounts.js
node tools/soak.js --bots 20 --seconds 8 --check
# Last on purpose: it needs a host with an RFC1918 address, so it cannot run in a cloud
# container, and `set -e` used to let it abort everything after it -- which is how the
# four browser suites above went unrun for a while.
node server/test/lan.js
