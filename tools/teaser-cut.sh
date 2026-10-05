#!/usr/bin/env bash
# Assembles the clips recorded by teaser-record.js into one file.
#   ./tools/teaser-cut.sh [dir]        default /tmp/teaser  ->  <dir>/teaser.mp4
#
# Each clip is trimmed to the offset the recorder wrote into manifest.json — recordVideo
# captures from the moment the page opens, so the front of every clip is menus. Segments
# are normalised to one size and frame rate, then concatenated. Cuts are hard between
# action and fade through black on the cards, which is what the pacing wants.
set -euo pipefail
cd "$(dirname "$0")/.."
DIR="${1:-/tmp/teaser}"
W=540; H=960; FPS=30
WORK="$DIR/seg"; rm -rf "$WORK"; mkdir -p "$WORK"

command -v ffmpeg >/dev/null || { echo "ffmpeg is not installed" >&2; exit 1; }
[ -f "$DIR/manifest.json" ] || { echo "no manifest.json in $DIR — run teaser-record.js first" >&2; exit 1; }

# name<TAB>kind<TAB>start<TAB>dur, in order
node -e '
const m=require("'"$DIR"'/manifest.json");
for(const k of Object.keys(m).sort())
  console.log([k,m[k].kind,m[k].start||0,m[k].dur].join("\t"));
' > "$WORK/list.tsv"

n=0
while IFS=$'\t' read -r name kind start dur; do
  n=$((n+1))
  out="$WORK/$(printf '%02d' $n).mp4"
  if [ "$kind" = "card" ]; then
    # A card holds, fading up and out, so the eye has somewhere to rest between fights.
    ffmpeg -nostdin -loglevel error -loop 1 -t "$dur" -i "$DIR/$name.png" \
      -vf "scale=$W:$H,fade=t=in:st=0:d=0.45,fade=t=out:st=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-0.45}'):d=0.45,format=yuv420p" \
      -r $FPS -c:v libx264 -preset slow -crf 18 -y "$out"
  else
    ffmpeg -nostdin -loglevel error -ss "$start" -t "$dur" -i "$DIR/$name.webm" \
      -vf "scale=$W:$H:force_original_aspect_ratio=increase,crop=$W:$H,fps=$FPS,format=yuv420p" \
      -r $FPS -c:v libx264 -preset slow -crf 18 -an -y "$out"
  fi
  echo "  $(printf '%02d' $n)  $name  ${dur}s"
done < "$WORK/list.tsv"

ls "$WORK"/*.mp4 | sort | sed "s/^/file '/;s/$/'/" > "$WORK/concat.txt"
# A silent AAC track: the trailer has no sound, and some players handle a file with no
# audio stream at all badly. Add music over the top later if you want it.
ffmpeg -nostdin -loglevel error -f concat -safe 0 -i "$WORK/concat.txt" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -shortest \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 64k \
  -movflags +faststart -y "$DIR/teaser.mp4"

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DIR/teaser.mp4")
size=$(du -h "$DIR/teaser.mp4" | cut -f1)
echo
echo "$DIR/teaser.mp4 — ${dur%.*}s, $size, ${W}x${H}"
