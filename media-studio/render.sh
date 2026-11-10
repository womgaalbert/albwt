#!/usr/bin/env bash
# Renders every Remotion loop, then finishes it for the web with FFmpeg.
# Run from media-studio/: bash render.sh
set -euo pipefail

SITE=..
mkdir -p out

for id in energy-arima-forecasting bfrb-sensor-fusion transformer-time-series convnet-cifar10 portfolio-website; do
  npx remotion render src/index.js "$id" "out/$id.mp4" --codec=h264 --crf=16 --log=error
  ffmpeg -y -v error -i "out/$id.mp4" -vf "scale=640:360:flags=lanczos" \
    -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -an \
    "$SITE/public/videos/projects/$id-loop.mp4"
  # Mid-loop, when the scene is fully drawn.
  ffmpeg -y -v error -ss 4.6 -i "out/$id.mp4" -frames:v 1 -vf "scale=640:360:flags=lanczos" \
    -c:v libwebp -quality 82 "$SITE/public/images/projects/$id-poster.webp"
done

# The 3D agent: full tour for social use (stays in out/), plus the site's no-WebGL poster.
npx remotion render src/index.js agent-teardown out/agent-teardown.mp4 --gl=angle --codec=h264 --crf=18 --log=error
ffmpeg -y -v error -ss 16.3 -i out/agent-teardown.mp4 -frames:v 1 -vf "scale=1280:720:flags=lanczos" \
  -c:v libwebp -quality 82 "$SITE/public/images/agent-teardown-poster.webp"
