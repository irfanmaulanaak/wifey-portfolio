import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// 3D accents built in Blender (source: assets-src/portfolio-3d.blend).
// Each canvas only renders while it is on screen. Reduced motion gets one still frame.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const loader = new GLTFLoader();
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

window.addEventListener('pointermove', (event) => {
  pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

const materials = {
  Ink: () => new THREE.MeshStandardMaterial({ color: 0x1c1c1c, metalness: 0.35, roughness: 0.32 }),
  Taupe: () => new THREE.MeshStandardMaterial({ color: 0xb3aca2, metalness: 1, roughness: 0.24 }),
  Paper: () => new THREE.MeshStandardMaterial({ color: 0xf3f1eb, metalness: 0, roughness: 0.45 }),
  Glass: () => new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.16,
    clearcoat: 1, clearcoatRoughness: 0, depthWrite: false
  })
};

const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function createStage(canvas, { fov = 32, z = 10 } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-4, 6, 8);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, z);

  const stage = { renderer, scene, camera, canvas, width: 1, height: 1, visible: false, update: null };

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    stage.width = w;
    stage.height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    stage.onResize?.();
    if (reduceMotion.matches) stage.renderOnce();
  }
  new ResizeObserver(resize).observe(canvas);

  // Half the visible width and height at z = 0, used to place models relative to the canvas edges.
  stage.halfView = () => {
    const h = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    return { x: h * camera.aspect, y: h };
  };

  stage.renderOnce = () => {
    stage.update?.(performance.now() / 1000, true);
    renderer.render(scene, camera);
  };

  new IntersectionObserver(([entry]) => {
    stage.visible = entry.isIntersecting;
    if (stage.visible) stage.onEnter?.();
    ensureLoop();
  }, { rootMargin: '120px 0px' }).observe(canvas);

  stages.push(stage);
  resize();
  return stage;
}

const stages = [];
let frame = 0;

function loop(ms) {
  const t = ms / 1000;
  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;
  let active = 0;
  stages.forEach((stage) => {
    if (!stage.visible || !stage.update) return;
    active += 1;
    stage.update(t, false);
    stage.renderer.render(stage.scene, stage.camera);
  });
  frame = active ? requestAnimationFrame(loop) : 0;
}

function ensureLoop() {
  if (reduceMotion.matches) {
    stages.forEach((stage) => stage.visible && stage.update && stage.renderOnce());
    return;
  }
  if (!frame) frame = requestAnimationFrame(loop);
}

function loadModel(stage, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      gltf.scene.traverse((node) => {
        if (!node.isMesh) return;
        const make = materials[node.material?.name];
        if (make) node.material = make();
      });
      stage.canvas.classList.add('is-ready');
      resolve(gltf.scene);
    }, undefined, reject);
  });
}

// Scroll progress of an element: 0 when its top reaches the bottom of the viewport, 1 when its bottom leaves the top.
function scrollProgress(el) {
  const rect = el.getBoundingClientRect();
  return clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
}

async function heroMagnifier() {
  const canvas = document.querySelector('.scene-hero');
  const stage = canvas && createStage(canvas, { fov: 30, z: 12 });
  if (!stage) return;
  const model = await loadModel(stage, './assets/3d/magnifier.glb');
  const pivot = new THREE.Group();
  // Centre the lens on the pivot so the glass is what moves around the page.
  pivot.add(model);
  stage.scene.add(pivot);
  const hero = canvas.closest('.hero');
  const start = performance.now() / 1000;

  function place() {
    const view = stage.halfView();
    const narrow = stage.width < 700;
    pivot.userData.base = new THREE.Vector3(view.x * (narrow ? 0.5 : 0.52), view.y * (narrow ? -0.4 : 0.2), 0);
    pivot.userData.size = narrow ? 0.62 : Math.min(1.35, view.x / 5.2);
  }
  stage.onResize = place;
  place();

  stage.update = (t, still) => {
    const intro = still ? 1 : easeOutCubic(clamp01((t - start) / 1.8));
    const scroll = scrollProgress(hero);
    const base = pivot.userData.base;
    // A slow figure-eight, like a lens scanning a results page.
    const sweepX = still ? 0 : Math.sin(t * 0.45) * 0.6;
    const sweepY = still ? 0 : Math.sin(t * 0.9) * 0.25;
    pivot.position.set(
      base.x + sweepX + pointer.x * 0.35 + (1 - intro) * 2.5,
      base.y + sweepY - pointer.y * 0.25 + scroll * 3.2,
      0
    );
    pivot.scale.setScalar(pivot.userData.size * (0.7 + 0.3 * intro));
    pivot.rotation.set(
      0.18 + pointer.y * 0.2,
      -0.45 + pointer.x * 0.35 + (still ? 0 : Math.sin(t * 0.5) * 0.18),
      -0.12 + scroll * 1.1 - (1 - intro) * 0.9
    );
  };
  ensureLoop();
}

async function experienceGrowth() {
  const canvas = document.querySelector('.scene-growth');
  const stage = canvas && createStage(canvas, { fov: 28, z: 13 });
  if (!stage) return;
  const model = await loadModel(stage, './assets/3d/growth.glb');
  const box = new THREE.Box3().setFromObject(model);
  const centre = box.getCenter(new THREE.Vector3());
  model.position.sub(centre);
  const pivot = new THREE.Group();
  pivot.add(model);
  stage.scene.add(pivot);

  const bars = [];
  let line = null;
  let tip = null;
  model.traverse((node) => {
    if (node.name.startsWith('Bar_')) bars.push(node);
    if (node.name === 'Arrow_Line') line = node;
    if (node.name === 'Arrow_Tip') tip = node;
  });
  bars.sort((a, b) => a.name.localeCompare(b.name));
  const lineMesh = line && (line.isMesh ? line : line.getObjectByProperty('isMesh', true));
  const lineCount = lineMesh ? (lineMesh.geometry.index?.count ?? lineMesh.geometry.attributes.position.count) : 0;
  const tipScale = tip ? tip.scale.clone() : null;
  let startedAt = null;

  stage.onEnter = () => { if (startedAt === null) startedAt = performance.now() / 1000; };
  if (stage.visible) stage.onEnter();

  stage.update = (t, still) => {
    const elapsed = still ? 99 : (startedAt === null ? 0 : t - startedAt);
    bars.forEach((bar, i) => {
      const p = clamp01((elapsed - 0.15 - i * 0.16) / 0.9);
      bar.scale.y = Math.max(0.001, easeOutBack(p));
    });
    const draw = easeOutCubic(clamp01((elapsed - 0.7) / 1.1));
    if (lineMesh) lineMesh.geometry.setDrawRange(0, Math.floor(lineCount * draw / 3) * 3);
    if (tip) tip.scale.copy(tipScale).multiplyScalar(easeOutBack(clamp01((elapsed - 1.65) / 0.45)) || 0.001);

    const scale = Math.min(1, stage.halfView().x / 3.2);
    pivot.scale.setScalar(scale);
    pivot.rotation.set(
      0.1 + pointer.y * 0.12,
      -0.5 + pointer.x * 0.3 + (still ? 0 : Math.sin(t * 0.4) * 0.12),
      0
    );
    pivot.position.y = still ? 0 : Math.sin(t * 0.8) * 0.08;
  };
  ensureLoop();
}

async function contactChain() {
  const canvas = document.querySelector('.scene-chain');
  const stage = canvas && createStage(canvas, { fov: 30, z: 9 });
  if (!stage) return;
  const model = await loadModel(stage, './assets/3d/chain.glb');
  // The dark link disappears on the dark panel, so it gets the light paper finish here.
  const lightLink = model.getObjectByName('Link_B');
  lightLink?.traverse((node) => { if (node.isMesh) node.material = materials.Paper(); });
  const box = new THREE.Box3().setFromObject(model);
  model.position.sub(box.getCenter(new THREE.Vector3()));
  const pivot = new THREE.Group();
  pivot.add(model);
  stage.scene.add(pivot);

  // Hovering a contact link spins the chain faster: every link you open is a new connection.
  let boost = 0;
  let boostTarget = 0;
  let spin = 0;
  let last = null;
  document.querySelectorAll('.contact-links a').forEach((link) => {
    link.addEventListener('pointerenter', () => { boostTarget = 1; });
    link.addEventListener('pointerleave', () => { boostTarget = 0; });
    link.addEventListener('focus', () => { boostTarget = 1; });
    link.addEventListener('blur', () => { boostTarget = 0; });
  });

  stage.update = (t, still) => {
    const dt = last === null ? 0 : Math.min(0.05, t - last);
    last = t;
    boost += (boostTarget - boost) * 0.06;
    spin += dt * (0.35 + boost * 2.2);
    pivot.scale.setScalar(Math.min(1, stage.halfView().x / 1.9));
    pivot.rotation.set(
      0.35 + pointer.y * 0.2,
      still ? 0.5 : spin,
      -0.35 + pointer.x * 0.15
    );
    pivot.position.y = still ? 0 : Math.sin(t * 1.1) * 0.12;
  };
  ensureLoop();
}

reduceMotion.addEventListener('change', ensureLoop);
[heroMagnifier, experienceGrowth, contactChain].forEach((init) => {
  init().catch(() => {
    // Leave the page as it was if WebGL or the model is unavailable.
  });
});
