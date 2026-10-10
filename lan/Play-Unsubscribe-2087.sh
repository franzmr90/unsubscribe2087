#!/bin/bash
# Double-click on Linux, or run it in a terminal. The Mac launcher is this same file.
cd "$(dirname "$0")" || exit 1

say() { printf '%s\n' "$*"; }

if ! command -v node >/dev/null 2>&1; then
  say "Node.js is not installed, so the game cannot start."
  say ""
  say "Install Node.js 18 or newer, then run this file again."
  say "  Mac:     https://nodejs.org  — download the LTS installer and open the .pkg."
  say "  Linux:   the copy in your software store is often too old."
  say "           Use the installer from https://nodejs.org, or NodeSource's Node 22."
  say "  Windows: use Play-Unsubscribe-2087.bat instead of this file."
  say ""
  say "If a Mac said this file could not be opened: right-click it, choose Open, then Open again."
  exit 1
fi

major="$(node -p 'Number(process.versions.node.split(".")[0])' 2>/dev/null || echo 0)"
if [ "${major}" -lt 18 ]; then
  say "Node.js is installed, but it is too old ($(node -v))."
  say "Install version 18 or newer from https://nodejs.org and run this file again."
  exit 1
fi

say "If a firewall window appears, allow Node.js on private networks only."
say "Public networks should stay blocked. Details are in LAN-PLAY.md."
say "Leave this window open. Closing it stops the game for everyone."
say ""

mkdir -p saves
export LAN=1
export PORT="${PORT:-8087}"
export DATA_DIR="$PWD/saves"
unset GITHUB_TOKEN TLS_KEY TLS_CERT INVITE_REQUIRED INVITE_CODES ALLOWLIST BUG_WEBHOOK_URL BUG_WEBHOOK_KEY PUBLIC_ORIGIN
node server/server.js
status=$?
echo ""
echo "The game stopped."
if [ -t 0 ]; then
  read -r -p "Press return to close. " _
fi
exit "$status"
