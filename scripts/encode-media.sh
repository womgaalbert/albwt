#!/usr/bin/env bash
# Rebuilds every web video, poster and WebP image from the full-size sources.
#
# Sources live in media-src/ (git-ignored, local only). Outputs go to public/.
# Run from the repo root: bash scripts/encode-media.sh
#
# Card loops are silent, cut from the best shots, and cropped so the captions
# burned into the source videos don't appear in a small silent card.
set -euo pipefail

SRC=media-src/videos
OUT=public/videos
IMG=public/images

mkdir -p "$OUT/projects"

# loop <source> <output-name> <crop w:h:x:y> <start-end>...
loop() {
  local src=$1 name=$2 crop=$3
  shift 3
  local filter="" labels="" i=0
  for seg in "$@"; do
    filter+="[0:v]trim=start=${seg%-*}:end=${seg#*-},setpts=PTS-STARTPTS,crop=$crop,scale=640:360:flags=lanczos,fps=30,setsar=1[v$i];"
    labels+="[v$i]"
    i=$((i + 1))
  done
  filter+="${labels}concat=n=$i:v=1:a=0[out]"
  ffmpeg -y -v error -i "$src" -filter_complex "$filter" -map "[out]" \
    -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart -an \
    "$OUT/projects/$name-loop.mp4"
  ffmpeg -y -v error -ss 0.6 -i "$OUT/projects/$name-loop.mp4" -frames:v 1 \
    -c:v libwebp -quality 80 "$IMG/projects/$name-poster.webp"
}

# full <source> <output-name> <scale>
full() {
  ffmpeg -y -v error -i "$1" -map 0:v:0 -map 0:a:0 \
    -vf "scale=$3:flags=lanczos" \
    -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
    -c:a aac -b:a 96k -movflags +faststart \
    "$OUT/projects/$2.mp4"
}

# Crops keep the top of the frame and drop the caption strip below it.
loop "$SRC/projects/cleary-cleaning.mp4" cleary-cleaning 1382:778:269:0 4-6 10-14
loop "$SRC/projects/cmavocat-presentation-60s.mp4" cmavocat 1690:950:115:0 5.5-8 15.5-18 40.5-43
# Mialine is portrait: a landscape band below its titles, above its captions.
loop "$SRC/projects/mialine-presentation-60s.mp4" mialine 1080:608:0:815 35-37 22-24 42-44 15-17

full "$SRC/projects/cleary-cleaning.mp4" cleary-cleaning 1280:720
full "$SRC/projects/cmavocat-presentation-60s.mp4" cmavocat-presentation-60s 1280:720
full "$SRC/projects/mialine-presentation-60s.mp4" mialine-presentation-60s 720:1280

# Hero loop, shown at 512px wide at most.
ffmpeg -y -v error -i "$SRC/hero-loop.mp4" -vf "scale=1024:576:flags=lanczos" \
  -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart -an \
  "$OUT/hero-loop.mp4"

# webp <input> <output> [width]
webp() {
  local args=()
  if [ -n "${3:-}" ]; then args=(-vf "scale=$3:-2:flags=lanczos"); fi
  ffmpeg -y -v error -i "$1" "${args[@]}" -c:v libwebp -quality 80 "$2"
}

webp "$IMG/hero-poster.jpg" "$IMG/hero-poster.webp" 1024
webp "$IMG/albert-womga.jpg" "$IMG/albert-womga-192.webp" 192
webp "$IMG/albert-womga.jpg" "$IMG/albert-womga-384.webp" 384
webp "$IMG/projects/student-plurilingual-databricks.png" "$IMG/projects/student-plurilingual-databricks.webp"
