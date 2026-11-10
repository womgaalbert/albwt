#!/usr/bin/env bash
# Renders every Remotion loop, then finishes it for the web with FFmpeg.
# Run from media-studio/: bash render.sh
#
# Project loops and covers are rebuilt from the owner's real figures; run
# bash fetch-sources.sh first if media-studio/public/assets/ is missing.
set -euo pipefail

SITE=..

mkdir -p out
mkdir -p "$SITE/public/videos/projects" "$SITE/public/videos/blog" "$SITE/public/videos/about"

# loop <id> <scale> <crf> <output> <poster>
loop() {
  local id=$1 scale=$2 crf=$3 output=$4 poster=$5
  npx remotion render src/index.js "$id" "out/$id.mp4" --codec=h264 --crf=16 --log=error
  ffmpeg -y -v error -i "out/$id.mp4" -vf "scale=$scale:flags=lanczos" \
    -c:v libx264 -preset slow -crf "$crf" -pix_fmt yuv420p -movflags +faststart -an \
    "$output"
  # Mid-loop, when the scene is fully drawn.
  ffmpeg -y -v error -ss 4.6 -i "out/$id.mp4" -frames:v 1 -vf "scale=$scale:flags=lanczos" \
    -c:v libwebp -quality 82 "$poster"
}

# Project loops: 640x360 under 250 KB each, under their current names.
for id in energy-arima-forecasting bfrb-sensor-fusion transformer-time-series convnet-cifar10 student-plurilingual-databricks portfolio-website; do
  # Screenshot loops compress worst; give the portfolio one a touch more.
  crf=27
  [ "$id" = "portfolio-website" ] && crf=28
  loop "$id" 640:360 "$crf" "$SITE/public/videos/projects/$id-loop.mp4" "$SITE/public/images/projects/$id-poster.webp"
done

# The 3D agent: full tour for social use (stays in out/), plus the site's no-WebGL poster.
npx remotion render src/index.js agent-teardown out/agent-teardown.mp4 --gl=angle --codec=h264 --crf=18 --log=error
ffmpeg -y -v error -ss 16.3 -i out/agent-teardown.mp4 -frames:v 1 -vf "scale=1280:720:flags=lanczos" \
  -c:v libwebp -quality 82 "$SITE/public/images/agent-teardown-poster.webp"

# The 6-second cut shown on the Services cards.
ffmpeg -y -v error -ss 9 -t 6 -i out/agent-teardown.mp4 -vf "scale=640:360:flags=lanczos" \
  -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart -an \
  "$SITE/public/videos/projects/agent-teardown-loop.mp4"

# Blog covers: 960x540 under 400 KB each, poster next to the cover images.
for slug in agents-md-open-standard-coding-agents gpt-6-wave-and-model-churn why-ai-agents-fail-in-production cnn-cifar10-from-scratch time-series-forecasting-arima transformer-time-series production-ai-agent-serverless mlops-pipeline-production nlp-document-classifier-distilbert; do
  loop "blog-$slug" 960:540 28 "$SITE/public/videos/blog/$slug-loop.mp4" "$SITE/public/images/blog/$slug-poster.webp"
done

# The About portrait: 384x512 under 200 KB (poster is the existing webp).
loop portrait 384:512 28 "$SITE/public/videos/about/portrait-loop.mp4" "out/portrait-poster.webp"
rm -f out/portrait-poster.webp

# Social share image from the Portfolio composition (1200x630).
npx remotion still src/index.js portfolio-website out/og-src.png --frame=90 --log=error
ffmpeg -y -v error -i out/og-src.png -vf "scale=1200:675:flags=lanczos,crop=1200:630:0:22" "$SITE/public/og-default.png"

# Contact sheet of every loop (12 frames each, 4x3), for review before wiring in.
mkdir -p out/contact-sheets
sheet() { # sheet <video> <out>
  ffmpeg -y -v error -i "$1" -vf "fps=2,tile=4x3:padding=6:color=black,scale=1600:-2" -frames:v 1 "$2"
}
sheet "$SITE/public/videos/projects/energy-arima-forecasting-loop.mp4" out/contact-sheets/energy.png
sheet "$SITE/public/videos/projects/bfrb-sensor-fusion-loop.mp4" out/contact-sheets/bfrb.png
sheet "$SITE/public/videos/projects/transformer-time-series-loop.mp4" out/contact-sheets/transformer.png
sheet "$SITE/public/videos/projects/convnet-cifar10-loop.mp4" out/contact-sheets/convnet.png
sheet "$SITE/public/videos/projects/student-plurilingual-databricks-loop.mp4" out/contact-sheets/student.png
sheet "$SITE/public/videos/projects/portfolio-website-loop.mp4" out/contact-sheets/portfolio.png
sheet "$SITE/public/videos/projects/agent-teardown-loop.mp4" out/contact-sheets/agent.png
for slug in agents-md-open-standard-coding-agents gpt-6-wave-and-model-churn why-ai-agents-fail-in-production cnn-cifar10-from-scratch time-series-forecasting-arima transformer-time-series production-ai-agent-serverless mlops-pipeline-production nlp-document-classifier-distilbert; do
  sheet "$SITE/public/videos/blog/$slug-loop.mp4" "out/contact-sheets/blog-$slug.png"
done
sheet "$SITE/public/videos/about/portrait-loop.mp4" out/contact-sheets/portrait.png
echo "contact sheets in out/contact-sheets/"
