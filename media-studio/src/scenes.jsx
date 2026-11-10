import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

// Illustrative motion only: curves and bars are drawn, not measured, so no scene
// shows a metric. No captions either, so the same loop works in French and English.

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

// Values from src/index.css (the dark-band tokens).
const C = {
  bg: "hsl(221 52% 13%)",
  bgDeep: "hsl(223 54% 8%)",
  grid: "hsl(210 40% 98% / 0.07)",
  teal: "hsl(172 80% 55%)",
  blue: "hsl(205 100% 72%)",
  violet: "hsl(258 90% 78%)",
  amber: "hsl(38 92% 62%)",
  white: "hsl(210 40% 98%)",
  dim: "hsl(217 18% 72%)",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ease = Easing.inOut(Easing.cubic);

function useLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  return { f: frame, D, phase: (frame / D) * Math.PI * 2 };
}

// Content fades at both ends over a constant background, so the loop point is invisible.
function Stage({ children }) {
  const { f, D } = useLoop();
  const opacity = interpolate(f, [0, 16, D - 16, D - 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 70% 20%, ${C.bg}, ${C.bgDeep})`, fontFamily }}>
      <svg width="1280" height="720" style={{ position: "absolute" }}>
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke={C.grid} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1280" height="720" fill="url(#grid)" />
      </svg>
      <AbsoluteFill style={{ opacity }}>
        <svg width="1280" height="720" style={{ position: "absolute" }}>
          {children}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

const line = (points) => points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

export function Energy() {
  const { f } = useLoop();
  const p = interpolate(f, [12, 128], [0, 1], { ...clamp, easing: ease });
  const split = 0.74;
  const X = (t) => 100 + t * 1080;
  const Y = (t) => 590 - (t * t * 220 + t * 70 + Math.sin(t * 46) * (6 + 16 * t) + Math.sin(t * 13) * 9);
  const range = (a, b) => (b <= a ? [] : Array.from({ length: 121 }, (_, i) => a + ((b - a) * i) / 120));

  const history = range(0, Math.min(p, split)).map((t) => [X(t), Y(t)]);
  const ahead = range(split, p);
  const forecast = ahead.map((t) => [X(t), Y(t)]);
  const spread = (t) => (t - split) * 340;
  const cone = [...ahead.map((t) => [X(t), Y(t) - spread(t)]), ...[...ahead].reverse().map((t) => [X(t), Y(t) + spread(t)])];
  const tip = X(p) && [X(p), Y(p)];

  return (
    <Stage>
      <line x1="100" y1="610" x2="1180" y2="610" stroke={C.dim} strokeOpacity="0.5" strokeWidth="2" />
      <line x1={X(split)} y1="210" x2={X(split)} y2="610" stroke={C.dim} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" />
      {cone.length > 2 && <path d={`${line(cone)}Z`} fill={C.teal} fillOpacity="0.16" />}
      {history.length > 1 && <path d={line(history)} fill="none" stroke={C.blue} strokeWidth="5" strokeLinejoin="round" />}
      {forecast.length > 1 && <path d={line(forecast)} fill="none" stroke={C.teal} strokeWidth="6" strokeDasharray="14 9" />}
      {p > 0 && <circle cx={tip[0]} cy={tip[1]} r="11" fill={p > split ? C.teal : C.blue} />}
      <text x="100" y="660" fill={C.dim} fontSize="30" fontWeight="600">1939</text>
      <text x={X(split)} y="660" fill={C.dim} fontSize="30" fontWeight="600" textAnchor="middle">2025</text>
    </Stage>
  );
}

export function Sensor() {
  const { f, D, phase } = useLoop();
  const channels = [
    { y: 300, color: C.teal, a: 34, k: [3, 7] },
    { y: 400, color: C.blue, a: 26, k: [5, 11] },
    { y: 500, color: C.amber, a: 30, k: [2, 9] },
  ];
  const windowX = interpolate(f, [0, D], [90, 700]);
  const wave = (c) =>
    line(Array.from({ length: 181 }, (_, i) => {
      const t = i / 180;
      const y = c.y + Math.sin(t * Math.PI * 2 * c.k[0] + phase * 2) * c.a + Math.sin(t * Math.PI * 2 * c.k[1] - phase * 3) * c.a * 0.35;
      return [90 + t * 840, y];
    }));
  const pulse = 0.5 + 0.5 * Math.sin(phase * 4);

  return (
    <Stage>
      {channels.map((c) => (
        <path key={c.y} d={wave(c)} fill="none" stroke={c.color} strokeWidth="4.5" strokeLinejoin="round" />
      ))}
      <rect x={windowX} y="238" width="230" height="324" rx="16" fill={C.white} fillOpacity="0.07" stroke={C.white} strokeOpacity="0.75" strokeWidth="3" strokeDasharray="12 9" />
      {channels.map((c) => (
        <path key={`j${c.y}`} d={`M930 ${c.y} C1000 ${c.y} 1010 400 1072 400`} fill="none" stroke={c.color} strokeWidth="3.5" strokeOpacity="0.7" />
      ))}
      <circle cx="1120" cy="400" r={60 + pulse * 12} fill={C.teal} fillOpacity="0.14" />
      <circle cx="1120" cy="400" r="48" fill={C.teal} />
      <text x="1120" y="412" fill={C.bgDeep} fontSize="32" fontWeight="800" textAnchor="middle">LSTM</text>
    </Stage>
  );
}

export function Attention() {
  const { f, D, phase } = useLoop();
  const count = 22;
  const px = (i) => 110 + (i / (count - 1)) * 1060;
  const py = (i) => 500 + Math.sin(i * 0.72) * 52 + Math.sin(i * 0.23) * 34;
  const query = interpolate(f, [12, D - 12], [7, count - 1], { ...clamp, easing: ease });
  const q = Math.round(query);
  // Weights rise for nearby points and for points one cycle back.
  const weight = (i) => 0.12 + 0.88 * Math.max(Math.exp(-((q - i) ** 2) / 5), 0.7 * Math.exp(-((q - i - 9) ** 2) / 4));
  const breathe = 0.85 + 0.15 * Math.sin(phase * 3);

  return (
    <Stage>
      {Array.from({ length: q }, (_, i) => {
        const w = weight(i);
        const mid = (px(i) + px(q)) / 2;
        const lift = 250 - Math.abs(q - i) * 3;
        return (
          <path key={i} d={`M${px(i)} ${py(i)} Q${mid} ${lift} ${px(q)} ${py(q)}`} fill="none" stroke={C.violet} strokeWidth={1.5 + w * 6} strokeOpacity={w * breathe} />
        );
      })}
      <path d={line(Array.from({ length: count }, (_, i) => [px(i), py(i)]))} fill="none" stroke={C.dim} strokeOpacity="0.45" strokeWidth="3" />
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={px(i)} cy={py(i)} r={i === q ? 17 : 7 + weight(i) * 7} fill={i === q ? C.teal : i < q ? C.violet : C.dim} fillOpacity={i <= q ? 1 : 0.45} />
      ))}
    </Stage>
  );
}

export function ConvNet() {
  const { f, phase } = useLoop();
  const cell = 34;
  const gridX = 90;
  const gridY = 262;
  const tint = (x, y) => {
    const v = Math.sin(x * 0.9) + Math.cos(y * 0.8) + Math.sin((x + y) * 0.5);
    return `hsl(${200 + v * 34} 72% ${44 + v * 9}%)`;
  };
  const steps = 36;
  const step = Math.floor(interpolate(f, [12, 168], [0, steps - 0.01], clamp));
  const kx = step % 6;
  const ky = Math.floor(step / 6);
  const layers = [
    { x: 480, h: 300, n: 5 },
    { x: 650, h: 220, n: 4 },
    { x: 800, h: 150, n: 3 },
  ];
  const winner = Math.floor(interpolate(f, [0, 180], [0, 9.99], clamp));

  return (
    <Stage>
      {Array.from({ length: 64 }, (_, i) => (
        <rect key={i} x={gridX + (i % 8) * cell} y={gridY + Math.floor(i / 8) * cell} width={cell - 3} height={cell - 3} rx="3" fill={tint(i % 8, Math.floor(i / 8))} />
      ))}
      <rect x={gridX + kx * cell - 3} y={gridY + ky * cell - 3} width={cell * 3 + 3} height={cell * 3 + 3} rx="6" fill={C.amber} fillOpacity="0.22" stroke={C.amber} strokeWidth="5" />
      {layers.map((l, li) =>
        Array.from({ length: l.n }, (_, i) => (
          <rect
            key={`${li}-${i}`}
            x={l.x + i * 15}
            y={398 - l.h / 2 - i * 11}
            width="82"
            height={l.h}
            rx="8"
            fill={li === 0 ? C.blue : li === 1 ? C.teal : C.violet}
            fillOpacity={0.3 + 0.45 * (0.5 + 0.5 * Math.sin(phase * 3 - li * 1.3 - i * 0.5))}
            stroke={C.white}
            strokeOpacity="0.4"
          />
        )),
      )}
      {Array.from({ length: 10 }, (_, i) => {
        const distance = Math.min(Math.abs(i - winner), 10 - Math.abs(i - winner));
        const width = 40 + 132 * Math.exp(-(distance ** 2) / 2.2);
        return <rect key={i} x="1010" y={262 + i * 28} width={width} height="19" rx="9" fill={i === winner ? C.amber : C.dim} fillOpacity={i === winner ? 1 : 0.45} />;
      })}
    </Stage>
  );
}

export function Portfolio() {
  const { f } = useLoop();
  const rise = (start) => ({
    opacity: interpolate(f, [start, start + 16], [0, 1], clamp),
    transform: `translateY(${interpolate(f, [start, start + 16], [22, 0], { ...clamp, easing: ease })}px)`,
  });
  const cards = [C.teal, C.blue, C.violet];

  return (
    <Stage>
      <rect x="230" y="190" width="820" height="470" rx="20" fill={C.white} fillOpacity="0.06" stroke={C.white} strokeOpacity="0.28" strokeWidth="2.5" />
      <path d="M230 246H1050" stroke={C.white} strokeOpacity="0.2" strokeWidth="2" />
      {["hsl(0 84% 64%)", "hsl(45 93% 58%)", "hsl(142 70% 50%)"].map((color, i) => (
        <circle key={color} cx={266 + i * 30} cy="218" r="9" fill={color} />
      ))}
      <text x="640" y="229" fill={C.dim} fontSize="26" fontWeight="600" textAnchor="middle">albert.womga.io</text>
      <g style={rise(22)}>
        <rect x="280" y="284" width="380" height="36" rx="10" fill={C.white} />
        <rect x="280" y="336" width="520" height="18" rx="9" fill={C.dim} fillOpacity="0.65" />
        <rect x="280" y="364" width="440" height="18" rx="9" fill={C.dim} fillOpacity="0.65" />
      </g>
      <g style={rise(48)}>
        <rect x="280" y="408" width="180" height="46" rx="23" fill={C.teal} />
      </g>
      {cards.map((color, i) => (
        <g key={color} style={rise(74 + i * 16)}>
          <rect x={280 + i * 244} y="484" width="228" height="140" rx="14" fill={color} fillOpacity="0.2" stroke={color} strokeOpacity="0.8" strokeWidth="2.5" />
          <rect x={304 + i * 244} y="512" width="130" height="16" rx="8" fill={color} />
          <rect x={304 + i * 244} y="544" width="176" height="12" rx="6" fill={C.dim} fillOpacity="0.6" />
          <rect x={304 + i * 244} y="568" width="146" height="12" rx="6" fill={C.dim} fillOpacity="0.6" />
        </g>
      ))}
    </Stage>
  );
}
