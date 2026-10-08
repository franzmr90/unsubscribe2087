#!/usr/bin/env bash
# Provisions a fresh Debian or Ubuntu box. Run as root:
#
#   DOMAIN=play.example.com REPO=https://github.com/you/unsubscribe2087 \
#     bash deploy/setup.sh
#
# TURN=1 also installs coturn on this box and fills TURN_URLS when that key is empty.
# Idempotent: safe to run again after a change. It never touches DATA_DIR, and it
# does not rotate a TURN password that is already in the env file.
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
  token=$(openssl rand -hex 24)
  sed -i "s|^ADMIN_TOKEN=.*|ADMIN_TOKEN=$token|" "$ENVF"
  chmod 600 "$ENVF"
  echo "wrote $ENVF — add your SMTP details to it"
  echo "ADMIN_TOKEN is in that file. online/kick/broadcast need it."
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

say "turn"
if [ "${TURN:-}" = "1" ]; then
  apt-get install -y -qq coturn
  if [ -f /etc/default/coturn ]; then
    if grep -q '^#\?TURNSERVER_ENABLED=' /etc/default/coturn; then
      sed -i 's/^#\?TURNSERVER_ENABLED=.*/TURNSERVER_ENABLED=1/' /etc/default/coturn
    else
      echo 'TURNSERVER_ENABLED=1' >> /etc/default/coturn
    fi
  fi
  turn_user="$(awk -F= '$1=="TURN_USER" && $2!=""{print substr($0, index($0,"=")+1); exit}' "$ENVF" 2>/dev/null || true)"
  turn_pass="$(awk -F= '$1=="TURN_PASS" && $2!=""{print substr($0, index($0,"=")+1); exit}' "$ENVF" 2>/dev/null || true)"
  [ -n "$turn_user" ] || turn_user=unsub
  [ -n "$turn_pass" ] || turn_pass="$(openssl rand -hex 16)"
  cat > /etc/turnserver.conf <<EOF
listening-port=3478
fingerprint
lt-cred-mech
realm=${DOMAIN}
user=${turn_user}:${turn_pass}
no-cli
no-tls
no-dtls
min-port=49160
max-port=49200
EOF
  systemctl enable coturn
  systemctl restart coturn
  urls_set=0
  if [ -f "$ENVF" ] && awk -F= '$1=="TURN_URLS" && $2!=""{found=1} END{exit !found}' "$ENVF"; then
    urls_set=1
  fi
  if [ "$urls_set" = 0 ]; then
    tmpenv="$(mktemp)"
    awk -v url="turn:${DOMAIN}:3478" -v user="$turn_user" -v pass="$turn_pass" '
      BEGIN { u=0; p=0; l=0 }
      $0 ~ /^TURN_URLS=/ { print "TURN_URLS=" url; l=1; next }
      $0 ~ /^TURN_USER=/ { print "TURN_USER=" user; u=1; next }
      $0 ~ /^TURN_PASS=/ { print "TURN_PASS=" pass; p=1; next }
      { print }
      END {
        if (!l) print "TURN_URLS=" url
        if (!u) print "TURN_USER=" user
        if (!p) print "TURN_PASS=" pass
      }
    ' "$ENVF" > "$tmpenv"
    cat "$tmpenv" > "$ENVF"
    rm -f "$tmpenv"
    chmod 600 "$ENVF"
    echo "wrote TURN_URLS=turn:${DOMAIN}:3478 into $ENVF"
  else
    echo "TURN_URLS already set, left $ENVF alone"
  fi
  echo "coturn on 3478, relay udp 49160-49200. Open those ports."
else
  echo "TURN not requested. Voice stays on public STUN. Re-run with TURN=1 for coturn."
fi

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

say "invite"
existing=$(sudo -u unsub env DATA_DIR="$DATA" "$NODE_BIN" "$APP/server/admin.js" invite list || true)
if printf '%s\n' "$existing" | grep -q '^       '; then
  bootstrap='(already minted — node server/admin.js invite list)'
  echo "invite codes already exist"
else
  bootstrap=$(sudo -u unsub env DATA_DIR="$DATA" "$NODE_BIN" "$APP/server/admin.js" invite mint --uses 25 --note bootstrap)
  echo "bootstrap invite (25 uses): $bootstrap"
fi

if [ "${TURN:-}" = "1" ]; then
  turn_line="5. coturn is installed. Open udp/tcp 3478 and udp 49160-49200. ICE comes from TURN_URLS in $ENVF."
else
  turn_line="5. Voice uses public STUN until you re-run with TURN=1 (coturn on this box: udp/tcp 3478 and udp 49160-49200). See HOSTING.md."
fi

cat <<DONE

Done.

  https://$DOMAIN            once DNS points here, Caddy gets the certificate on its own
  journalctl -u unsubscribe2087 -f    logs
  systemctl restart unsubscribe2087   after a change

Still to do by hand:
  1. Point an A record for $DOMAIN at this machine, then open https://$DOMAIN once.
  2. Hand the bootstrap invite to your testers: $bootstrap
     More codes: sudo -u unsub env DATA_DIR=$DATA node $APP/server/admin.js invite mint
  3. Put SMTP details in $ENVF, then restart. Without them, password
     recovery mail goes to $DATA/outbox instead of anybody's inbox.
  4. Set BACKUP_HOOK in $ENVF so the nightly archive leaves this machine.
  $turn_line
DONE
