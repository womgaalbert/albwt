import { OffthreadVideo, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Stage } from "./scenes.jsx";
import { Camera, Drift, Reveal, Crossfade, Paper, TiltCard, LightSweep } from "./camera.jsx";
import { TemperatureChart } from "./figures.jsx";

// Nine blog cover loops, 960x540. The three raster covers get a push-in with
// a light sweep; the six placeholder SVG covers are replaced by camera moves
// over the projects' real figures. No text is added anywhere.

const PAD = 26; // paper inset inside the 960x540 frame
const src = (p) => staticFile(`assets/${p}`);

const A = {
  raster: 1200 / 630,
  cifar: 564 / 493,
  confusion: 624 / 732,
  fig1: 703 / 240,
  forecast: 1340 / 1024,
  future: 640 / 480,
  architecture: 1600 / 920,
  demographics: 1,
  words: 1300 / 650,
  umap: 1170 / 780,
};

/* ------------------------------------------------ */
/* Raster covers: push-in 1.0 -> 1.08, drift, sweep */
/* ------------------------------------------------ */

function RasterCover({ file, sweepAt, drift = [14, 6] }) {
  return (
    <Stage>
      <Camera
        src={src(`blog/${file}`)}
        aspect={A.raster}
        at={[10, 170]}
        keyframes={[
          { at: 0, x: -drift[0], y: drift[1], scale: 1 },
          { at: 1, x: drift[0], y: -drift[1], scale: 1.08 },
        ]}
      />
      <LightSweep at={sweepAt} />
    </Stage>
  );
}

/* ------------------------------------------- */
/* Figure covers: two camera segments per slug */
/* ------------------------------------------- */

function FigureCover({ first, second }) {
  return (
    <Stage>
      <Crossfade
        items={[
          { at: [10, 78], node: <Paper pad={PAD}>{first}</Paper> },
          { at: [50, 180], node: <Paper pad={PAD}>{second}</Paper> },
        ]}
      />
    </Stage>
  );
}

function ConvNetCover() {
  return (
    <FigureCover
      first={
        <Camera
          src={src("convnet/cifar10_samples_1.png")}
          aspect={A.cifar}
          at={[10, 62]}
          inset={PAD}
          keyframes={[
            { at: 0, x: 0, y: 140, scale: 1.12 },
            { at: 1, x: 0, y: -140, scale: 1.12 },
          ]}
        />
      }
      second={
        <Camera
          src={src("convnet/confusion_matrix.png")}
          aspect={A.confusion}
          at={[50, 150]}
          inset={PAD}
          keyframes={[
            { at: 0, x: -50, y: -200, scale: 1.05 },
            { at: 1, x: 50, y: -260, scale: 1.3 },
          ]}
        />
      }
    />
  );
}

function ArimaCover() {
  return (
    <FigureCover
      first={
        <Camera
          src={src("energy/fig1.png")}
          aspect={A.fig1}
          at={[10, 60]}
          inset={PAD}
          fit="contain"
          keyframes={[
            { at: 0, x: 70, y: 0, scale: 1.15 },
            { at: 1, x: -70, y: 0, scale: 1.15 },
          ]}
        />
      }
      second={
        <Reveal
          src={src("energy/forecast_2025_2028.png")}
          aspect={A.forecast}
          at={[50, 150]}
          inset={PAD}
          to={{ x: 0, y: -42, scale: 1 }}
        />
      }
    />
  );
}

function TransformerCover() {
  return (
    <Stage>
      <Crossfade
        items={[
          { at: [10, 96], node: <TemperatureChart at={[12, 70]} /> },
          {
            at: [82, 180],
            node: (
              <Paper pad={PAD}>
                <Reveal
                  src={src("attention/transformer-future200.png")}
                  aspect={A.future}
                  at={[82, 150]}
                  inset={PAD}
                  to={{ x: 0, y: 0, scale: 1 }}
                />
              </Paper>
            ),
          },
        ]}
      />
    </Stage>
  );
}

/* The 3D agent clip, then the blog's own serverless diagrams. */
function AgentServerlessCover() {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [74, 166], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const diagrams = [
    "cache-first-rate-limit.svg",
    "pipeline.svg",
    "llm-failover.svg",
    "rate-limit-errors.svg",
  ];
  return (
    <Stage>
      <Crossfade
        items={[
          {
            at: [8, 88],
            node: (
              <OffthreadVideo
                src={staticFile("assets/site/agent-clip.mp4")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ),
          },
          {
            at: [74, 180],
            node: (
              <TiltCard pad={26} amount={1.6}>
                <div
                  style={{
                    position: "absolute",
                    inset: 22,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    gap: 16,
                    transform: `scale(${1 + p * 0.05}) translateX(${p * -14}px)`,
                  }}
                >
                  {diagrams.map((d) => (
                    <div
                      key={d}
                      style={{
                        borderRadius: 12,
                        background: "hsl(223 54% 10%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 10,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={src(`blog/agent-serverless/${d}`)}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>
              </TiltCard>
            ),
          },
        ]}
      />
    </Stage>
  );
}

function MlopsCover() {
  return (
    <FigureCover
      first={
        <Drift src={src("student/architecture.png")} aspect={A.architecture} at={[10, 62]} inset={PAD} scale={1.12} drift={[38, 22]} />
      }
      second={
        <Camera
          src={src("student/demographics_overview.png")}
          aspect={A.demographics}
          at={[50, 150]}
          inset={PAD}
          keyframes={[
            { at: 0, x: 0, y: 190, scale: 1 },
            { at: 1, x: 0, y: -190, scale: 1 },
          ]}
        />
      }
    />
  );
}

function NlpCover() {
  return (
    <FigureCover
      first={<Drift src={src("student/wordcloud_global.png")} aspect={A.words} at={[10, 62]} inset={PAD} scale={1.12} drift={[56, 14]} />}
      second={<Drift src={src("student/umap_clusters.png")} aspect={A.umap} at={[50, 150]} inset={PAD} scale={1.05} drift={[55, -50]} />}
    />
  );
}

export const BlogCovers = {
  "agents-md-open-standard-coding-agents": () => (
    <RasterCover file="agents-md-open-standard-coding-agents.webp" sweepAt={[46, 130]} />
  ),
  "gpt-6-wave-and-model-churn": () => <RasterCover file="gpt-6-wave-and-model-churn.webp" sweepAt={[70, 150]} drift={[-12, 6]} />,
  "why-ai-agents-fail-in-production": () => (
    <RasterCover file="why-ai-agents-fail-in-production.webp" sweepAt={[30, 120]} drift={[0, -8]} />
  ),
  "cnn-cifar10-from-scratch": ConvNetCover,
  "time-series-forecasting-arima": ArimaCover,
  "transformer-time-series": TransformerCover,
  "production-ai-agent-serverless": AgentServerlessCover,
  "mlops-pipeline-production": MlopsCover,
  "nlp-document-classifier-distilbert": NlpCover,
};
