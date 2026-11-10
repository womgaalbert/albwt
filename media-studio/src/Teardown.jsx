import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { createScene, tourState } from "../../src/components/three/scene.js";

// The same model and tour the site runs, drawn frame by frame for video export.
// Values from the .dark theme in src/index.css.
const PALETTE = {
  accent: "hsl(172,100%,42%)",
  body: "hsl(217,18%,72%)",
  plate: "hsl(219,40%,22%)",
  dim: "hsl(219,53%,29%)",
  sky: "hsl(0,0%,100%)",
  floor: "hsl(219,40%,24%)",
  shadow: 0.4,
};

export function Teardown() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useLayoutEffect(() => {
    const scene = createScene(canvasRef.current, PALETTE, { tier: 0, preserveDrawingBuffer: true });
    scene.resize(width, height);
    sceneRef.current = scene;
    return () => scene.dispose();
  }, [width, height]);

  useLayoutEffect(() => {
    const time = frame / fps;
    sceneRef.current.renderAt({ time, ...tourState(time) });
  }, [frame, fps]);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 60% 15%, hsl(221 52% 15%), hsl(223 54% 8%))" }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width, height }} />
    </AbsoluteFill>
  );
}
