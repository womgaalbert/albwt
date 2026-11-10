#!/usr/bin/env bash
# Downloads the real figures behind the Remotion loops from the owner's public
# repos, plus local copies of the images the site already ships.
#
# Everything lands in media-studio/public/assets/ (git-ignored), which is what
# Remotion's staticFile() serves. Run from media-studio/: bash fetch-sources.sh
set -euo pipefail

cd "$(dirname "$0")"
ASSETS=public/assets
RAW=https://raw.githubusercontent.com/womgaalbert
SITE=..

mkdir -p "$ASSETS/energy" "$ASSETS/convnet" "$ASSETS/attention" "$ASSETS/student" "$ASSETS/bfrb" "$ASSETS/blog/agent-serverless"

get() { # get <repo> <path> <dest>
  curl -fL --retry 3 -sS "$RAW/$1/HEAD/$2" -o "$3"
  echo "  $3"
}

echo "== Energy-ARIMA-Forecasting"
get Energy-ARIMA-Forecasting images/fig1.png "$ASSETS/energy/fig1.png"
get Energy-ARIMA-Forecasting images/decomposition.png "$ASSETS/energy/decomposition.png"
get Energy-ARIMA-Forecasting images/forecast_zoom1.png "$ASSETS/energy/forecast_zoom1.png"
get Energy-ARIMA-Forecasting images/sarima_fit_2010_2025.png "$ASSETS/energy/sarima_fit_2010_2025.png"
get Energy-ARIMA-Forecasting images/forecast_2025_2028.png "$ASSETS/energy/forecast_2025_2028.png"

echo "== Convnet-On-CIFAR-10"
get Convnet-On-CIFAR-10 images/cifar10_samples_1.png "$ASSETS/convnet/cifar10_samples_1.png"
get Convnet-On-CIFAR-10 "images/ConvNetLearningCurves_Loss%26Accuracy.png" "$ASSETS/convnet/learning_curves.png"
get Convnet-On-CIFAR-10 images/confusion_matrixCifar10.png "$ASSETS/convnet/confusion_matrix.png"
get Convnet-On-CIFAR-10 images/prediction_label.png "$ASSETS/convnet/prediction_label.png"
get Convnet-On-CIFAR-10 images/roc_curve_Cifar10.png "$ASSETS/convnet/roc_curve.png"

echo "== transformer-time-series-prediction"
get transformer-time-series-prediction docs/transformer-future200.png "$ASSETS/attention/transformer-future200.png"
get transformer-time-series-prediction daily-min-temperatures.csv "$ASSETS/attention/daily-min-temperatures.csv"

echo "== Student-Plurilingual-Representation-French-Learning-Databricks"
S=Student-Plurilingual-Representation-French-Learning-Databricks
get "$S" deploy_cloud/reports/demographics/demographics_overview.png "$ASSETS/student/demographics_overview.png"
get "$S" deploy_cloud/reports/demographics/demographics_langues.png "$ASSETS/student/demographics_langues.png"
get "$S" deploy_cloud/reports/h1/descriptive/umap_clusters.png "$ASSETS/student/umap_clusters.png"
get "$S" deploy_cloud/reports/h1/descriptive/network_cooccurrence.png "$ASSETS/student/network_cooccurrence.png"
get "$S" deploy_cloud/reports/h1/descriptive/heatmap_cooccurrence.png "$ASSETS/student/heatmap_cooccurrence.png"
get "$S" deploy_cloud/reports/h1/descriptive/wordcloud_global.png "$ASSETS/student/wordcloud_global.png"

echo "== Detect-Behavior-with-Sensor-Data (notebook for extraction)"
get Detect-Behavior-with-Sensor-Data notebooks/Detect_Behavior_with_Sensor_Data.ipynb "$ASSETS/bfrb/notebook.json"
node extract-notebook-figures.mjs "$ASSETS/bfrb/notebook.json" "$ASSETS/bfrb"
rm -f "$ASSETS/bfrb/notebook.json"

echo "== Local copies from the site repo"
cp "$SITE/public/images/projects/student-plurilingual-databricks/image1.png" "$ASSETS/student/architecture.png" && echo "  student/architecture.png"
cp "$SITE/public/images/blog/agents-md-open-standard-coding-agents.webp" "$ASSETS/blog/agents-md-open-standard-coding-agents.webp" && echo "  blog/agents-md-open-standard-coding-agents.webp"
cp "$SITE/public/images/blog/gpt-6-wave-and-model-churn.webp" "$ASSETS/blog/gpt-6-wave-and-model-churn.webp" && echo "  blog/gpt-6-wave-and-model-churn.webp"
cp "$SITE/public/images/blog/why-ai-agents-fail-in-production.webp" "$ASSETS/blog/why-ai-agents-fail-in-production.webp" && echo "  blog/why-ai-agents-fail-in-production.webp"
cp "$SITE/public/images/blog/agent-serverless/"*.svg "$ASSETS/blog/agent-serverless/" && echo "  blog/agent-serverless/*.svg"
cp "$SITE/public/images/albert-womga.jpg" "$ASSETS/portrait.jpg" && echo "  portrait.jpg"

echo "== 3D agent clip (for the serverless blog cover)"
if [ -f out/agent-teardown.mp4 ]; then
  ffmpeg -y -v error -ss 9 -t 6 -i out/agent-teardown.mp4 -an -c copy "$ASSETS/site/agent-clip.mp4" && echo "  site/agent-clip.mp4"
else
  echo "  skipped: out/agent-teardown.mp4 missing (run bash render.sh first)"
fi

echo "done"
