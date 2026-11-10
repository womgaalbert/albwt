// @ts-nocheck -- three's bundled JSDoc types don't resolve under this repo's checkJs.
import {
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

// The six stages of the real LangGraph agent in supabase/functions/github-analyzer.
export const STAGE_COUNT = 6;
export const STAGE_SECONDS = 3.5;
export const TOUR_SECONDS = STAGE_COUNT * STAGE_SECONDS;

const SPACING = 2.7;
const PACKETS = 6;
const QUALITY = [
  { pixelRatio: 2, shadowSize: 1024, shadows: true },
  { pixelRatio: 1.25, shadowSize: 512, shadows: true },
  { pixelRatio: 1, shadowSize: 0, shadows: false },
];

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

const stageX = (i) => (i - (STAGE_COUNT - 1) / 2) * SPACING;
const stageZ = (i) => Math.sin(i * 1.15) * 0.55;

/** Where the guided tour is at time t, in seconds. Depends on t alone. */
export function tourState(t) {
  const wrapped = ((t % TOUR_SECONDS) + TOUR_SECONDS) % TOUR_SECONDS;
  const active = Math.min(STAGE_COUNT - 1, Math.floor(wrapped / STAGE_SECONDS));
  const local = wrapped / STAGE_SECONDS - active;
  const next = (active + 1) % STAGE_COUNT;
  return {
    active,
    focus: lerp(active, next, smooth(0.86, 1, local)),
    explode: smooth(0.1, 0.3, local) * (1 - smooth(0.8, 0.96, local)),
  };
}

function coreGeometry(stage) {
  switch (stage) {
    case 0:
      return new CylinderGeometry(0.42, 0.42, 0.34, 40);
    case 1:
      return new TorusGeometry(0.34, 0.12, 18, 40);
    case 2:
      return new OctahedronGeometry(0.42);
    case 3:
      return new BoxGeometry(0.58, 0.58, 0.58);
    case 4:
      return new IcosahedronGeometry(0.44, 1);
    default:
      return new CylinderGeometry(0.28, 0.46, 0.46, 6);
  }
}

/**
 * Builds the model on a canvas. Everything visible is a function of the state
 * passed to renderAt, so the page and the video export draw identical frames.
 */
export function createScene(canvas, palette, { tier = 0, preserveDrawingBuffer = false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer, powerPreference: "high-performance" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 16 / 9, 0.1, 80);

  const hemisphere = new HemisphereLight(0xffffff, 0xffffff, 1.5);
  const sun = new DirectionalLight(0xffffff, 2.2);
  sun.position.set(-5, 11, 7);
  sun.shadow.camera.left = -11;
  sun.shadow.camera.right = 11;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  scene.add(hemisphere, sun);

  const ground = new Mesh(new PlaneGeometry(50, 30), new ShadowMaterial({ opacity: 0.2 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.34;
  ground.receiveShadow = true;
  scene.add(ground);

  const accent = new Color();
  const body = new Color();
  const plate = new Color();
  const dim = new Color();
  const scratch = new Color();

  const shaded = (roughness = 0.5, metalness = 0.15) => new MeshStandardMaterial({ roughness, metalness });
  const part = (geometry, material, y, travel) => {
    const mesh = new Mesh(geometry, material);
    mesh.position.y = y;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { y, travel };
    return mesh;
  };

  const stages = Array.from({ length: STAGE_COUNT }, (_, i) => {
    const group = new Group();
    const plateMaterial = shaded(0.7, 0.05);
    const shellMaterial = shaded(0.48, 0.3);
    const coreMaterial = shaded(0.45, 0.25);
    const base = part(new BoxGeometry(1.8, 0.18, 1.8), plateMaterial, -0.22, -0.02);
    const shell = part(new CylinderGeometry(0.74, 0.8, 0.5, 48, 1, true), shellMaterial, 0.2, 0.55);
    shellMaterial.side = 2;
    const core = part(coreGeometry(i), coreMaterial, 0.18, 1.55);
    const cap = part(new CylinderGeometry(0.76, 0.76, 0.12, 48), shellMaterial, 0.52, 2.5);
    const ledMaterial = shaded(0.45, 0);
    const led = part(new SphereGeometry(0.075, 14, 14), ledMaterial, 0.6, 2.5);
    led.position.set(0.42, 0.6, 0.42);
    group.add(base, shell, core, cap, led);
    scene.add(group);
    return { group, core, parts: [base, shell, core, cap, led], plateMaterial, shellMaterial, coreMaterial, ledMaterial };
  });

  const centres = Array.from({ length: STAGE_COUNT }, (_, i) => new Vector3(stageX(i), 0.02, stageZ(i)));
  const path = new CatmullRomCurve3(centres, false, "catmullrom", 0.35);
  const pipeMaterial = shaded(0.6, 0.1);
  const pipe = new Mesh(new TubeGeometry(path, 120, 0.055, 10, false), pipeMaterial);
  scene.add(pipe);

  // A cache hit leaves the graph at the first stage and skips the rest.
  const shortcut = new CatmullRomCurve3([
    new Vector3(stageX(0), 0.9, stageZ(0)),
    new Vector3(stageX(1), 2.3, -1.5),
    new Vector3(stageX(4), 2.3, -1.5),
    new Vector3(stageX(5), 0.9, stageZ(5)),
  ]);
  const shortcutMaterial = shaded(0.55, 0.1);
  const shortcutTube = new Mesh(new TubeGeometry(shortcut, 80, 0.028, 8, false), shortcutMaterial);
  scene.add(shortcutTube);

  const packetMaterial = shaded(0.45, 0.2);
  const packetGeometry = new SphereGeometry(0.1, 16, 16);
  const packets = Array.from({ length: PACKETS }, () => {
    const mesh = new Mesh(packetGeometry, packetMaterial);
    scene.add(mesh);
    return mesh;
  });

  const point = new Vector3();
  let width = 16;
  let height = 9;
  let currentTier = tier;

  function applyQuality(next) {
    currentTier = Math.min(QUALITY.length - 1, Math.max(0, next));
    const q = QUALITY[currentTier];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pixelRatio));
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = q.shadows;
    sun.castShadow = q.shadows;
    if (q.shadows) {
      sun.shadow.mapSize.set(q.shadowSize, q.shadowSize);
      sun.shadow.map?.dispose();
      sun.shadow.map = null;
    }
    [...stages.flatMap((s) => [s.plateMaterial, s.shellMaterial, s.coreMaterial])].forEach((m) => {
      m.needsUpdate = true;
    });
  }

  function setPalette(next) {
    accent.setStyle(next.accent);
    body.setStyle(next.body);
    plate.setStyle(next.plate);
    dim.setStyle(next.dim);
    pipeMaterial.color.copy(dim);
    packetMaterial.color.copy(accent);
    packetMaterial.emissive.copy(accent).multiplyScalar(0.45);
    hemisphere.color.setStyle(next.sky);
    hemisphere.groundColor.setStyle(next.floor);
    ground.material.opacity = next.shadow;
  }

  function resize(nextWidth, nextHeight) {
    width = Math.max(1, Math.round(nextWidth));
    height = Math.max(1, Math.round(nextHeight));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  /** state: { time, focus, active, explode, azimuth, elevation } */
  function renderAt({ time, focus, active, explode, azimuth = -0.5, elevation = 0.44 }) {
    stages.forEach((stage, i) => {
      const amount = i === active ? explode : 0;
      const away = active >= 0 && i !== active ? Math.sign(i - active) * explode * 0.75 : 0;
      stage.group.position.set(stageX(i) + away, 0, stageZ(i));
      stage.parts.forEach((mesh) => {
        mesh.position.y = mesh.userData.y + mesh.userData.travel * amount;
      });
      stage.core.scale.setScalar(lerp(0.58, 1, amount));
      stage.core.rotation.y = time * 0.7 + i;
      stage.core.rotation.x = i === 1 ? Math.PI / 2 : amount * 0.5;

      const fade = active >= 0 && i !== active ? explode * 0.55 : 0;
      stage.plateMaterial.color.copy(plate).lerp(dim, fade);
      stage.shellMaterial.color.copy(body).lerp(dim, fade);
      scratch.copy(i === active ? accent : body);
      stage.coreMaterial.color.copy(scratch).lerp(accent, i === active ? 1 : amount).lerp(dim, fade);
      stage.coreMaterial.emissive.copy(accent).multiplyScalar(i === active ? 0.28 * explode : 0);
      stage.ledMaterial.color.copy(accent).lerp(dim, fade);
      stage.ledMaterial.emissive.copy(accent).multiplyScalar(i === active ? 0.9 : 0.35 * (1 - fade));
    });

    shortcutMaterial.color.copy(dim).lerp(accent, active === 0 ? explode : 0);

    packets.forEach((mesh, k) => {
      const u = (time * 0.075 + k / PACKETS) % 1;
      path.getPointAt(u, point);
      mesh.position.copy(point);
      // Stay on the pipe while the modules step aside.
      if (active >= 0) {
        const nearest = (u * (STAGE_COUNT - 1) + 0.5) | 0;
        if (nearest !== active) mesh.position.x += Math.sign(nearest - active) * explode * 0.75;
      }
    });

    const aspectFit = Math.max(1, 1.75 / camera.aspect);
    const radius = lerp(18, 11, explode) * aspectFit;
    const targetX = lerp(-0.7, stageX(0) + focus * SPACING, Math.max(explode, 0.35 * (aspectFit - 1) + 0.0));
    const targetY = lerp(0.55, 1.25, explode);
    const cosE = Math.cos(elevation);
    camera.position.set(
      targetX + radius * Math.sin(azimuth) * cosE,
      targetY + radius * Math.sin(elevation),
      radius * Math.cos(azimuth) * cosE,
    );
    camera.lookAt(targetX, targetY, 0);
    renderer.render(scene, camera);
  }

  function dispose() {
    scene.traverse((object) => {
      object.geometry?.dispose();
      object.material?.dispose();
    });
    renderer.dispose();
    renderer.forceContextLoss();
  }

  setPalette(palette);
  applyQuality(tier);

  return {
    renderAt,
    resize,
    setPalette,
    dispose,
    setQuality: applyQuality,
    get quality() {
      return currentTier;
    },
    get lowestQuality() {
      return QUALITY.length - 1;
    },
  };
}
