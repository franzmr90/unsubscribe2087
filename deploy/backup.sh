#!/usr/bin/env bash
# A copy of the save directory. Installed to /usr/local/bin/unsubscribe2087-backup and
# run nightly by cron. Saves are plain files, so this is just tar.
#
# It keeps copies on the same machine, which protects against a bad deploy but not
# against losing the machine. Copy them somewhere else — see the end of this file.
set -euo pipefail
DATA="${DATA_DIR:-/var/lib/unsubscribe2087}"
DEST="${BACKUP_DIR:-/var/lib/unsubscribe2087-backups}"
KEEP="${BACKUP_KEEP:-14}"

[ -d "$DATA" ] || { echo "no data directory at $DATA" >&2; exit 1; }
mkdir -p "$DEST"

stamp=$(date -u +%Y%m%d-%H%M%S)
out="$DEST/unsubscribe2087-$stamp.tar.gz"

# Written to a temporary name and moved, so a half-finished archive is never mistaken
# for a good one — the same reason the server writes its saves through a rename.
tar -czf "$out.part" -C "$(dirname "$DATA")" "$(basename "$DATA")"
mv "$out.part" "$out"

ls -1t "$DEST"/unsubscribe2087-*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f

echo "$out ($(du -h "$out" | cut -f1)), $(ls -1 "$DEST"/unsubscribe2087-*.tar.gz | wc -l) kept"

# To get them off the machine, add one line to the cron entry, e.g.
#   rclone copy "$DEST" remote:unsubscribe-backups
#   rsync -az "$DEST/" you@elsewhere:/backups/unsubscribe/
