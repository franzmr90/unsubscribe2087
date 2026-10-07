#!/usr/bin/env bash
# Provisions a fresh Debian or Ubuntu box. Run as root:
#
#   DOMAIN=play.example.com REPO=https://github.com/you/unsubscribe2087 \
#     bash deploy/setup.sh
#
# Idempotent: safe to run again after a change. It never touches DATA_DIR.
set -euo pipefail

DOMAIN="${DOMAIN:-}"
REPO="${REPO:-https://github.com/franzmr90/unsubscribe2087}"
BRANCH="${BRANCH:-main}"
APP=/opt/unsubscribe2087
DATA=/var/lib/unsubscribe2087
ENVF=/etc/unsubscribe2087.env

[ "$(id -u)" = 0 ] || { echo "run as root" >&2; exit 1; }
[ -n "$DOMAIN" ] || { echo "set DOMAIN=your.domain" >&2; exit 1; }

say() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

say "packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git ca-certificates debian-keyring debian-archive-keyring apt-transport-https gnupg

say "node"
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
node --version

say "caddy"
if ! command -v caddy >/dev/null; then
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt \
    > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq
  apt-get install -y -qq caddy
fi

say "user and directories"
id -u unsub >/dev/null 2>&1 || useradd --system --home "$APP" --shell /usr/sbin/nologin unsub
mkdir -p "$DATA"
chown -R unsub:unsub "$DATA"
chmod 750 "$DATA"

say "code"
if [ -d "$APP/.git" ]; then
  git -C "$APP" fetch --depth 1 origin "$BRANCH"
  git -C "$APP" reset --hard "origin/$BRANCH"
else
  git clone --depth 1 -b "$BRANCH" "$REPO" "$APP"
fi
chown -R unsub:unsub "$APP"
# The game is built from source so a stale committed dist can never be what ships.
su unsub -s /bin/bash -c "cd $APP && ./build.sh" >/dev/null
echo "built $(wc -c < "$APP/dist/unsubscribe.html") bytes"

say "configuration"
if [ ! -f "$ENVF" ]; then
  sed "s|yourdomain.com|$DOMAIN|g" "$APP/deploy/unsubscribe2087.env.example" > "$ENVF"
  chmod 600 "$ENVF"
  echo "wrote $ENVF — add your SMTP details to it"
else
  echo "$ENVF already exists, left alone"
fi

# The unit needs an absolute path to node, and where that is depends on how node was
# installed. Resolve it rather than hoping.
NODE_BIN="$(command -v node)"
sed "s|^ExecStart=.*|ExecStart=$NODE_BIN server/server.js|" \
  "$APP/deploy/unsubscribe2087.service" > /etc/systemd/system/unsubscribe2087.service
chmod 644 /etc/systemd/system/unsubscribe2087.service
echo "node at $NODE_BIN"
sed "s|yourdomain.com|$DOMAIN|g" "$APP/deploy/Caddyfile" > /etc/caddy/Caddyfile
mkdir -p /var/log/caddy && chown caddy:caddy /var/log/caddy

say "backups"
install -m 755 "$APP/deploy/backup.sh" /usr/local/bin/unsubscribe2087-backup
cat > /etc/cron.d/unsubscribe2087 <<CRON
# A copy of the save directory every night, fourteen kept.
17 4 * * * root /usr/local/bin/unsubscribe2087-backup >/dev/null 2>&1
CRON

say "services"
systemctl daemon-reload
systemctl enable --now unsubscribe2087
systemctl reload caddy || systemctl restart caddy
sleep 2

say "check"
systemctl --no-pager --lines=0 status unsubscribe2087 | head -4 || true
code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8087/ || echo 000)
echo "local http: $code"
[ "$code" = 200 ] || { echo "the app is not answering — journalctl -u unsubscribe2087 -n 50" >&2; exit 1; }

cat <<DONE

Done.

  https://$DOMAIN            once DNS points here, Caddy gets the certificate on its own
  journalctl -u unsubscribe2087 -f    logs
  systemctl restart unsubscribe2087   after a change

Still to do by hand:
  1. Point an A record for $DOMAIN at this machine.
  2. Put your SMTP details in $ENVF, then restart. Without them, password
     recovery mail goes to $DATA/outbox instead of anybody's inbox.
  3. Copy the backups off this machine — they are in $DATA/../unsubscribe2087-backups.
DONE
