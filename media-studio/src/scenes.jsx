import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

// Shared shell for every loop: the dark band background, a faint grid, and a
// fade at both ends so the loop point is invisible. Camera work over the real
// figures happens inside (camera.jsx); no captions are added anywhere, so the
// same file serves French and English.

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

// Values from src/index.css (the dark-band tokens).
export const C = {
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
export const ease = Easing.inOut(Easing.cubic);

export function useLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  return { f: frame, D, phase: (frame / D) * Math.PI * 2 };
}

// Content fades at both ends over a constant background, so the loop point is invisible.
export function Stage({ children }) {
  const { f, D } = useLoop();
  const { width: W, height: H } = useVideoConfig();
  const opacity = interpolate(f, [0, 16, D - 16, D - 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 70% 20%, ${C.bg}, ${C.bgDeep})`, fontFamily }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke={C.grid} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
      </svg>
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}

export const line = (points) => points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
