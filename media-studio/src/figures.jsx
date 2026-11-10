import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, C, line, ease } from "./scenes.jsx";
import { Camera, Drift, Reveal, Crossfade, Paper, BrowserCard, ScrollCapture } from "./camera.jsx";

// Six project loops rebuilt from the owner's real figures. Nothing is drawn or
// invented: every frame is a camera move over an actual repo artefact, and no
// text is added, so the same file serves French and English.

const PAD = 44; // paper inset inside the 1280x720 frame

// Real figure aspect ratios (width / height).
const A = {
  energy: {
    fig1: 703 / 240,
    sarima: 1197 / 651,
    forecast: 1340 / 1024,
  },
  sensor: { signals: 1789 / 790, matrix: 795 / 693 },
  attention: { future: 640 / 480 },
  convnet: { samples: 564 / 493, curves: 624 / 203, matrix: 624 / 732 },
  student: { umap: 1170 / 780, network: 1560 / 1170, words: 1300 / 650 },
  site: 1440 / 2400,
};

const src = (p) => staticFile(`assets/${p}`);

/* ------------------------------------------------------------------ */
/* Temperature CSV: the real dataset drawn as a line, then the figure. */
/* ------------------------------------------------------------------ */

function useTemperatureRows() {
  const [rows, setRows] = useState(null);
  const [handle] = useState(() => delayRender("daily-min-temperatures"));
  useEffect(() => {
    fetch(staticFile("assets/attention/daily-min-temperatures.csv"))
      .then((r) => r.text())
      .then((text) => {
        const parsed = text
          .trim()
          .split(/\r?\n/)
          .slice(1)
          .map((l) => {
            const [date, temp] = l.split(",");
            return { date: date.slice(1, -1), temp: parseFloat(temp) };
          });
        setRows(parsed);
        continueRender(handle);
      })
      .catch(() => {
        setRows([]);
        continueRender(handle);
      });
  }, [handle]);
  return rows;
}

const key = (v, a, b) => (v <= a ? 0 : v >= b ? 1 : (v - a) / (b - a));

/** The 3650-row Melbourne daily min temperatures drawn left to right. */
export function TemperatureChart({ at }) {
  const rows = useTemperatureRows();
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  if (!rows || rows.length < 2) return null;
  const p = ease(key(frame - at[0], 0, at[1] - at[0]));
  const m = { l: 90, r: 40, t: 54, b: 64 };
  const temps = rows.map((r) => r.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const X = (i) => m.l + (i / (rows.length - 1)) * (W - m.l - m.r);
  const Y = (v) => m.t + (1 - (v - min) / (max - min)) * (H - m.t - m.b);
  const d = line(rows.map((r, i) => [X(i), Y(r.temp)]));
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <line x1={m.l} y1={H - m.b} x2={W - m.r} y2={H - m.b} stroke={C.dim} strokeOpacity="0.35" strokeWidth="2" />
      <path
        d={d}
        fill="none"
        stroke={C.blue}
        strokeWidth="3.5"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - p}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------- */
/* Energy: fig1 pan -> SARIMA fit push-in -> forecast revealed    */
/* ------------------------------------------------------------- */

export function Energy() {
  return (
    <Stage>
      <Crossfade
        items={[
          {
            at: [10, 78],
            node: (
              <Paper pad={PAD}>
                <Camera
                  src={src("energy/fig1.png")}
                  aspect={A.energy.fig1}
                  at={[10, 62]}
                  inset={PAD}
                  fit="contain"
                  keyframes={[
                    { at: 0, x: 70, y: 0, scale: 1.15 },
                    { at: 1, x: -70, y: 0, scale: 1.15 },
                  ]}
                />
              </Paper>
            ),
          },
          {
            at: [50, 126],
            node: (
              <Paper pad={PAD}>
                <Camera
                  src={src("energy/sarima_fit_2010_2025.png")}
                  aspect={A.energy.sarima}
                  at={[50, 110]}
                  inset={PAD}
                  keyframes={[
                    { at: 0, x: -40, y: 0, scale: 1.25 },
                    { at: 1, x: 50, y: -15, scale: 1.45 },
                  ]}
                />
              </Paper>
            ),
          },
          {
            at: [98, 180],
            node: (
              <Paper pad={PAD}>
                <Reveal
                  src={src("energy/forecast_2025_2028.png")}
                  aspect={A.energy.forecast}
                  at={[98, 150]}
                  inset={PAD}
                  to={{ x: 0, y: -64, scale: 1 }}
                />
              </Paper>
            ),
          },
        ]}
      />
    </Stage>
  );
}

/* ---------------------------------------------------------- */
/* Sensor (BFRB): raw channels pan -> XGBoost matrix diagonal  */
/* ---------------------------------------------------------- */

export function Sensor() {
  return (
    <Stage>
      <Crossfade
        items={[
          {
            at: [10, 108],
            node: (
              <Paper pad={PAD}>
                <Camera
                  src={src("bfrb/fig-1.png")}
                  aspect={A.sensor.signals}
                  at={[10, 92]}
                  inset={PAD}
                  keyframes={[
                    { at: 0, x: 200, y: 0, scale: 1.1 },
                    { at: 1, x: -200, y: 0, scale: 1.1 },
                  ]}
                />
              </Paper>
            ),
          },
          {
            at: [82, 180],
            node: (
              <Paper pad={PAD}>
                <Camera
                  src={src("bfrb/fig-6.png")}
                  aspect={A.sensor.matrix}
                  at={[82, 162]}
                  inset={PAD}
                  keyframes={[
                    { at: 0, x: -60, y: 60, scale: 1.2 },
                    { at: 1, x: 60, y: -60, scale: 1.5 },
                  ]}
                />
              </Paper>
            ),
          },
        ]}
      />
    </Stage>
  );
}

/* -------------------------------------------------------- */
/* Attention (Transformer): dataset line -> figure revealed  */
/* -------------------------------------------------------- */

export function Attention() {
  return (
    <Stage>
      <Crossfade
        items={[
          { at: [10, 100], node: <TemperatureChart at={[12, 72]} /> },
          {
            at: [86, 180],
            node: (
              <Paper pad={PAD}>
                <Reveal
                  src={src("attention/transformer-future200.png")}
                  aspect={A.attention.future}
                  at={[86, 148]}
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

/* ------------------------------------------------------- */
/* ConvNet: sample grid pan -> curves reveal -> push-in     */
/* ------------------------------------------------------- */

export function ConvNet() {
  return (
    <Stage>
      <Crossfade
        items={[
          {
            at: [10, 78],
            node: (
              <Paper pad={PAD}>
                <Camera
                  src={src("convnet/cifar10_samples_1.png")}
                  aspect={A.convnet.samples}
                  at={[10, 60]}
                  inset={PAD}
                  keyframes={[
                    { at: 0, x: 0, y: 190, scale: 1.12 },
                    { at: 1, x: 0, y: -190, scale: 1.12 },
                  ]}
                />
              </Paper>
            ),
          },
          {
            at: [48, 122],
            node: (
              <Paper pad={PAD}>
                <Reveal
                  src={src("convnet/learning_curves.png")}
                  aspect={A.convnet.curves}
                  at={[48, 104]}
                  inset={PAD}
                  fit="contain"
                  to={{ x: 0, y: 0, scale: 1 }}
                />
              </Paper>
            ),
          },
          {
            at: [96, 180],
            node: (
              <Paper pad={PAD}>
                <Camera
                  src={src("convnet/confusion_matrix.png")}
                  aspect={A.convnet.matrix}
                  at={[96, 150]}
                  inset={PAD}
                  keyframes={[
                    { at: 0, x: -80, y: -230, scale: 1 },
                    { at: 1, x: 80, y: -280, scale: 1.28 },
                  ]}
                />
              </Paper>
            ),
          },
        ]}
      />
    </Stage>
  );
}

/* ------------------------------------------------------ */
/* Student Plurilingual: UMAP -> network -> word cloud     */
/* ------------------------------------------------------ */

export function StudentPlurilingual() {
  return (
    <Stage>
      <Crossfade
        items={[
          {
            at: [10, 78],
            node: (
              <Paper pad={PAD}>
                <Drift src={src("student/umap_clusters.png")} aspect={A.student.umap} at={[10, 62]} inset={PAD} scale={1.04} drift={[70, -60]} />
              </Paper>
            ),
          },
          {
            at: [50, 126],
            node: (
              <Paper pad={PAD}>
                <Drift src={src("student/network_cooccurrence.png")} aspect={A.student.network} at={[50, 110]} inset={PAD} scale={1.15} drift={[56, 46]} />
              </Paper>
            ),
          },
          {
            at: [98, 180],
            node: (
              <Paper pad={PAD}>
                <Drift src={src("student/wordcloud_global.png")} aspect={A.student.words} at={[98, 150]} inset={PAD} scale={1.08} drift={[70, 16]} />
              </Paper>
            ),
          },
        ]}
      />
    </Stage>
  );
}

/* ------------------------------------------------------ */
/* Portfolio: real screenshots scrolling in a browser card */
/* ------------------------------------------------------ */

function Scroll({ name, at }) {
  return (
    <BrowserCard pad={PAD}>
      <ScrollCapture src={src(`site/${name}-light.png`)} aspect={A.site} at={at} w={1192} h={590} />
    </BrowserCard>
  );
}

export function Portfolio() {
  return (
    <Stage>
      <Crossfade
        items={[
          { at: [10, 78], node: <Scroll name="home" at={[10, 62]} /> },
          { at: [50, 126], node: <Scroll name="projects" at={[50, 110]} /> },
          { at: [98, 180], node: <Scroll name="sandbox" at={[98, 150]} /> },
        ]}
      />
    </Stage>
  );
}
