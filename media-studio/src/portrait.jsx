import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { interpolate } from "remotion";
import { Camera, LightSweep } from "./camera.jsx";

// The About portrait, 576x768. Understated: a push-in of 1.0 -> 1.06 pinned on
// the face, a faint light sweep, and a fade to the photo's own white so the
// loop point is invisible on the light About card.

const ASPECT = 1200 / 1600;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export function PortraitLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const opacity = interpolate(frame, [0, 14, D - 18, D - 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "hsl(210 40% 98%)" }}>
      <AbsoluteFill style={{ opacity }}>
        <Camera
          src={staticFile("assets/portrait.jpg")}
          aspect={ASPECT}
          at={[0, D - 18]}
          anchor={[0.5, 0.26]}
          keyframes={[
            { at: 0, x: 0, y: 0, scale: 1 },
            { at: 1, x: 0, y: 0, scale: 1.06 },
          ]}
        />
        <LightSweep at={[70, 140]} strength={0.09} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
