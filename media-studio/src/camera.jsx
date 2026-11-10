import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Camera moves over real figures: pans, zooms, wipes and crossfades.
// Pure functions of the current frame, so the same pieces compose in every loop.
// No text is added anywhere — axis labels and titles belong to the real artifact.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ease = Easing.inOut(Easing.cubic);

const key = (value, min, max) => {
  if (value <= min) return 0;
  if (value >= max) return 1;
  return (value - min) / (max - min);
};

/**
 * Places an image of `aspect` inside a W x H frame so it covers (or contains)
 * the frame, centred on the given offsets, scaled by `scale`. x/y offset the
 * image centre from the frame centre in px.
 */
export function place(W, H, aspect, { x = 0, y = 0, scale = 1 }, fit = "cover") {
  const base = fit === "contain" ? Math.min(W / aspect, H) : Math.max(W / aspect, H);
  const width = base * aspect * scale;
  const height = base * scale;
  return { left: W / 2 + x - width / 2, top: H / 2 + y - height / 2, width, height };
}

/** Offsets that keep an image point (ax, ay as fractions) pinned to the frame centre. */
export function pin(W, H, aspect, scale, [ax = 0.5, ay = 0.5], fit = "cover") {
  const { width, height } = place(W, H, aspect, { scale }, fit);
  return { x: width * (0.5 - ax), y: height * (0.5 - ay) };
}

/** Samples keyframes [{at, x, y, scale}] over the segment [a, b], easing each span. */
function sampleKeyframes(frame, [a, b], keyframes) {
  if (keyframes.length === 1) return keyframes[0];
  const p = key((frame - a) / (b - a), 0, 1);
  let i = 0;
  while (i < keyframes.length - 2 && p > keyframes[i + 1].at) i += 1;
  const k0 = keyframes[i];
  const k1 = keyframes[i + 1];
  const span = k1.at - k0.at || 1;
  const t = ease(key((p - k0.at) / span, 0, 1));
  const lerp = (v0, v1) => v0 + (v1 - v0) * t;
  return { x: lerp(k0.x, k1.x), y: lerp(k0.y, k1.y), scale: lerp(k0.scale, k1.scale) };
}

/**
 * One image with keyframed pan/zoom: [{at, x, y, scale}] with at in 0..1.
 * Runs over frames [a, b] of `at`; before a it holds the first keyframe and
 * after b the last, so segments can sit inside crossfades.
 * `inset` shrinks the working area (for figures inside a padded Paper card);
 * `anchor` ([ax, ay] image fractions) pins that image point to the area centre
 * and any keyframe x/y act as drift on top of it.
 */
export function Camera({ src, aspect, at, keyframes, inset = 0, anchor, fit = "cover", style }) {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const w = W - inset * 2;
  const h = H - inset * 2;
  const pos = sampleKeyframes(frame, at, keyframes);
  if (anchor) {
    const pinned = pin(w, h, aspect, pos.scale, anchor, fit);
    pos.x += pinned.x;
    pos.y += pinned.y;
  }
  const box = place(w, h, aspect, pos, fit);
  return (
    <div style={{ position: "absolute", inset, overflow: "hidden" }}>
      <Img src={src} style={{ position: "absolute", ...box, ...style }} />
    </div>
  );
}

/** A fixed frame that zooms a little and drifts — the gentle "slow drift". */
export function Drift({ src, aspect, at, scale = 1.15, drift = [40, 26], inset = 0, anchor = [0.5, 0.5], fit = "cover" }) {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const w = W - inset * 2;
  const h = H - inset * 2;
  const p = ease(key((frame - at[0]) / (at[1] - at[0]), 0, 1));
  const from = { ...pin(w, h, aspect, scale, anchor, fit), scale };
  const to = { x: from.x - drift[0], y: from.y - drift[1], scale: scale * 1.07 };
  const pos = {
    x: from.x + (to.x - from.x) * p,
    y: from.y + (to.y - from.y) * p,
    scale: from.scale + (to.scale - from.scale) * p,
  };
  const box = place(w, h, aspect, pos, fit);
  return (
    <div style={{ position: "absolute", inset, overflow: "hidden" }}>
      <Img src={src} style={{ position: "absolute", ...box }} />
    </div>
  );
}

/**
 * Left-to-right wipe over a figure, so a plot appears to "draw" itself.
 * The image sits at its final position; only the visible window grows.
 */
export function Reveal({ src, aspect, at, to, inset = 0, fit = "cover", style }) {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const w = W - inset * 2;
  const h = H - inset * 2;
  const p = Easing.out(Easing.cubic)(key((frame - at[0]) / (at[1] - at[0]), 0, 1));
  const box = place(w, h, aspect, to, fit);
  return (
    <div style={{ position: "absolute", inset, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${p * 100}%`, overflow: "hidden" }}>
        <Img src={src} style={{ position: "absolute", ...box, ...style }} />
        {p > 0 && p < 1 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: -2,
              width: 4,
              background: "linear-gradient(180deg, transparent, hsl(172 80% 55% / 0.9), transparent)",
              boxShadow: "0 0 18px hsl(172 80% 55% / 0.8)",
            }}
          />
        )}
      </div>
    </div>
  );
}

/** Crossfades between segments [{at: [a, b], node}]. Segments may overlap. */
export function Crossfade({ items, fade = 14 }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {items.map((item, i) => {
        const [a, b] = item.at;
        const opacity = Math.min(
          interpolate(frame, [a, a + fade], [0, 1], clamp),
          interpolate(frame, [b - fade, b], [1, 0], clamp),
        );
        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            {item.node}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}

/** White "paper" card on the dark Stage, so figures read as artefacts. */
export function Paper({ children, pad = 40 }) {
  return (
    <AbsoluteFill style={{ padding: pad }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 20,
          overflow: "hidden",
          background: "hsl(210 40% 98%)",
          boxShadow: "0 26px 70px rgb(0 0 0 / 0.45)",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}

/** A browser window frame (traffic lights only, no text) around a capture. */
export function BrowserCard({ children, pad = 44 }) {
  return (
    <AbsoluteFill style={{ padding: pad }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 18,
          overflow: "hidden",
          background: "hsl(210 40% 98%)",
          boxShadow: "0 30px 70px rgb(0 0 0 / 0.5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 42,
            background: "hsl(223 54% 12%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 15px",
            zIndex: 2,
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: 6, background: "#f87171" }} />
          <span style={{ width: 11, height: 11, borderRadius: 6, background: "#fbbf24" }} />
          <span style={{ width: 11, height: 11, borderRadius: 6, background: "#34d399" }} />
        </div>
        <div style={{ position: "absolute", inset: "42px 0 0 0", background: "hsl(210 40% 98%)" }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
}

/** Vertical pan down a tall capture, as if scrolling the page. */
export function ScrollCapture({ src, aspect, at, w, h, from = 0, to = -1, style }) {
  const frame = useCurrentFrame();
  const p = ease(key((frame - at[0]) / (at[1] - at[0]), 0, 1));
  const imgH = w / aspect;
  const end = to < 0 ? h - imgH : to;
  const top = from + (end - from) * p;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img src={src} style={{ position: "absolute", left: 0, top, width: w, height: imgH, ...style }} />
    </div>
  );
}

/** A soft diagonal light sweep across the frame. */
export function LightSweep({ at, strength = 0.15 }) {
  const frame = useCurrentFrame();
  const p = key((frame - at[0]) / (at[1] - at[0]), 0, 1);
  const x = -50 + p * 150;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${x}%`,
          width: "36%",
          transform: "skewX(-12deg)",
          background: `linear-gradient(90deg, transparent, rgb(255 255 255 / ${strength}) 45%, rgb(255 255 255 / ${strength * 1.4}) 50%, rgb(255 255 255 / ${strength}) 55%, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Rounded frame with a slow 3D tilt, for cards that should feel held. */
export function TiltCard({ children, pad = 36, amount = 2 }) {
  const frame = useCurrentFrame();
  const phase = ((frame % 180) / 180) * Math.PI * 2;
  const rx = Math.sin(phase * 0.75) * amount * 0.5;
  const ry = Math.cos(phase) * amount;
  return (
    <AbsoluteFill style={{ padding: pad, perspective: 1200 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
          borderRadius: 18,
          overflow: "hidden",
          background: "hsl(223 54% 8%)",
          boxShadow: "0 30px 70px rgb(0 0 0 / 0.55)",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
