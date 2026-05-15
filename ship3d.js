import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const SECTION_COLORS = {
  FWD: 0x9c8cbd,
  MID: 0xa06baf,
  AFT: 0x8550a0,
  TBD: 0xdaafd2,
};

const SHIP = {
  width: 5.8,
  length: 15.4,
  deckStep: 0.58,
  baseY: 0.72,
};

const SECTION_RANGES = {
  FWD: { start: -6.55, end: -2.25 },
  MID: { start: -2.15, end: 2.1 },
  AFT: { start: 2.2, end: 6.35 },
  TBD: { start: -1, end: 1 },
};
const PLAN_PROGRESS_RANGES = {
  FWD: [0.08, 0.35],
  MID: [0.35, 0.66],
  AFT: [0.66, 0.95],
  TBD: [0.35, 0.66],
};
const LIFT_BANKS = [
  { key: "fwd", label: "FWD lifts", progress: 0.34 },
  { key: "aft", label: "AFT lifts", progress: 0.75 },
];
const DECK_VOIDS = {
  9: [
    { z: -0.25, length: 2.1, width: 2.0, label: "Medical / center venue" },
    { z: 4.15, length: 2.7, width: 2.35, label: "Animator's Table" },
  ],
  10: [
    { z: -1.1, length: 2.1, width: 2.55, label: "Spa / garden" },
    { z: 2.75, length: 2.25, width: 2.35, label: "Discovery Reef" },
    { z: 5.25, length: 2.2, width: 2.55, label: "Dining / shops" },
  ],
  11: [
    { z: 0.15, length: 2.55, width: 2.25, label: "Imagination Garden" },
    { z: 4.55, length: 2.7, width: 2.4, label: "Discovery Reef / dining" },
  ],
  16: [
    { z: -0.35, length: 2.35, width: 2.15, label: "Laundry / lounge" },
    { z: 2.8, length: 2.15, width: 2.4, label: "Recreation gap" },
  ],
  17: [
    { z: -1.5, length: 3.2, width: 2.7, label: "Pool / recreation" },
    { z: 2.3, length: 2.3, width: 2.5, label: "Toy Story place" },
  ],
};

const ZONE_SIDES = {
  1: "starboard",
  2: "port",
  3: "starboard",
  5: "starboard",
  6: "port",
  7: "center",
  8: "port",
  9: "center",
};

const ZONE_PANELS = [
  { zone: 2, section: "FWD", x: -1.66, width: 1.1 },
  { zone: 7, section: "FWD", x: 0, width: 0.82 },
  { zone: 1, section: "FWD", x: 1.66, width: 1.1 },
  { zone: 6, section: "MID", x: -1.66, width: 1.1 },
  { zone: 9, section: "MID", x: 0, width: 0.82 },
  { zone: 3, section: "MID", x: 1.66, width: 1.1 },
  { zone: 8, section: "AFT", x: -1.66, width: 1.1 },
  { zone: 9, section: "AFT", x: 0, width: 0.82 },
  { zone: 5, section: "AFT", x: 1.66, width: 1.1 },
];

let sceneState = null;

export function renderShip3D({ mount, status, records, allRecords, delivered, route, onRouteChange, helpers }) {
  if (!sceneState || sceneState.mount !== mount) {
    sceneState = createScene(mount, status, helpers);
  }

  sceneState.helpers = helpers;
  sceneState.records = records;
  sceneState.allRecords = allRecords || records;
  sceneState.delivered = delivered;
  sceneState.route = route || {};
  sceneState.onRouteChange = onRouteChange;
  buildShip(sceneState);
  renderStatus(sceneState);
  sceneState.renderer.render(sceneState.scene, sceneState.camera);
}

export function resetShip3D() {
  if (!sceneState) return;
  setCameraPreset(sceneState, "front");
}

function createScene(mount, status, helpers) {
  mount.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x092842);
  scene.fog = new THREE.Fog(0x092842, 28, 54);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.shadowMap.enabled = true;
  mount.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 100);
  const target = new THREE.Vector3(0, 3.7, 0);
  camera.position.set(8.5, 10.4, 19.2);
  camera.lookAt(target);

  const group = new THREE.Group();
  scene.add(group);

  const hemi = new THREE.HemisphereLight(0xd7f3ff, 0x0a1f33, 1.38);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffe5a0, 3.1);
  key.position.set(-8, 15, 12);
  key.castShadow = true;
  scene.add(key);

  const fill = new THREE.PointLight(0xdaafd2, 14, 42);
  fill.position.set(7, 7, -7);
  scene.add(fill);

  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 24, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x4a2c62, roughness: 0.76, metalness: 0.05 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.28;
  water.receiveShadow = true;
  scene.add(water);

  const state = {
    mount,
    status,
    helpers,
    scene,
    renderer,
    camera,
    target,
    group,
    records: [],
    allRecords: [],
    delivered: new Set(),
    route: {},
    onRouteChange: null,
    roomMeshes: new Map(),
    selectedId: null,
    yaw: -0.42,
    pitch: 0.42,
    dragging: false,
    lastX: 0,
    lastY: 0,
    frame: 0,
  };

  const resizeObserver = new ResizeObserver(() => resize(state));
  resizeObserver.observe(mount);
  state.resizeObserver = resizeObserver;

  renderer.domElement.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    renderer.domElement.setPointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.yaw -= dx * 0.006;
    state.pitch = clamp(state.pitch + dy * 0.004, 0.2, 1.12);
    updateCamera(state);
  });
  renderer.domElement.addEventListener("pointerup", (event) => {
    state.dragging = false;
    renderer.domElement.releasePointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener("click", (event) => pickRoom(state, event));
  renderer.domElement.addEventListener("wheel", (event) => {
    event.preventDefault();
    const distance = state.camera.position.distanceTo(state.target);
    const next = clamp(distance + event.deltaY * 0.014, 10, 28);
    const direction = state.camera.position.clone().sub(state.target).normalize();
    state.camera.position.copy(state.target.clone().add(direction.multiplyScalar(next)));
  }, { passive: false });

  status.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ship-deliver]");
    if (button) {
      state.helpers.toggleDelivered(button.dataset.shipDeliver);
      return;
    }
    const viewButton = event.target.closest("[data-ship-view]");
    if (viewButton) setCameraPreset(state, viewButton.dataset.shipView);
  });
  status.addEventListener("change", (event) => {
    if (!event.target.matches("[data-ship-route-from], [data-ship-route-to]")) return;
    const from = status.querySelector("[data-ship-route-from]")?.value || "";
    const to = status.querySelector("[data-ship-route-to]")?.value || "";
    state.onRouteChange?.(from, to);
  });

  setCameraPreset(state, "front");
  animate(state);
  return state;
}

function buildShip(state) {
  clearGroup(state.group);
  state.roomMeshes.clear();

  const records = state.records;
  const modelRecords = mergeRecords(records, [state.route?.from, state.route?.to].filter(Boolean));
  const decks = [...new Set(modelRecords.map((record) => Number(record.deck)).filter(Boolean))].sort((a, b) => a - b);
  const minDeck = Math.min(...decks, 9);
  const maxDeck = Math.max(...decks, 17);

  buildHull(state.group, minDeck, maxDeck);

  decks.forEach((deck) => {
    const y = deckY(deck, minDeck);
    buildDeckBand(state.group, y, deck);
  });

  records.forEach((record) => {
    const loc = state.helpers.roomLocation(record);
    const y = deckY(Number(record.deck), minDeck);
    const pos = roomPosition(record, loc);
    pos.y = y;
    const isDone = state.delivered.has(String(record.id));
    const isSelected = String(record.id) === String(state.selectedId);

    const material = roomMaterial(loc.section, isDone, isSelected);
    const room = makeRoomMarker(pos, material, isSelected);
    room.castShadow = false;
    room.receiveShadow = false;
    room.userData.record = record;
    room.userData.location = loc;
    state.group.add(room);

    state.roomMeshes.set(String(record.id), room);
  });

  if (!state.selectedId && records[0]) state.selectedId = String(records[0].id);
  if (state.selectedId && !state.roomMeshes.has(String(state.selectedId))) {
    state.selectedId = records[0] ? String(records[0].id) : null;
  }

  buildRouteOverlay(state, minDeck);
}

function mergeRecords(primary, extra) {
  const seen = new Set();
  return [...primary, ...extra].filter((record) => {
    if (!record || seen.has(String(record.id))) return false;
    seen.add(String(record.id));
    return true;
  });
}

function buildDeckBand(group, y, deck) {
  const floor = new THREE.Mesh(
    shipFootprintGeometry(),
    new THREE.MeshStandardMaterial({ color: 0xf8fbff, roughness: 0.7, metalness: 0.03, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, y - 0.22, 0);
  floor.receiveShadow = true;
  group.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f8fb, roughness: 0.52, metalness: 0.04, transparent: true, opacity: 0.78 });
  const shadowMaterial = new THREE.MeshStandardMaterial({ color: 0xcfe0e8, roughness: 0.7, metalness: 0.02, transparent: true, opacity: 0.42 });
  const portWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 12.7), wallMaterial);
  portWall.position.set(-SHIP.width / 2, y, 0.05);
  group.add(portWall);
  const starboardWall = portWall.clone();
  starboardWall.position.x = SHIP.width / 2;
  group.add(starboardWall);

  const centerCore = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.18, 10.9), shadowMaterial);
  centerCore.position.set(0, y - 0.04, 0.15);
  group.add(centerCore);

  const promenade = new THREE.Mesh(
    new THREE.BoxGeometry(5.45, 0.035, 0.05),
    new THREE.MeshBasicMaterial({ color: 0x102a43, transparent: true, opacity: 0.34 })
  );
  [-2.18, 2.16].forEach((z) => {
    const rail = promenade.clone();
    rail.position.set(0, y + 0.18, z);
    group.add(rail);
  });

  if (deck === 10 || deck === 11) buildLifeBoatRow(group, y);
  addFootprintOutline(group, y - 0.08, 0xa6bfca, 0.42);
  buildZonePanels(group, y, deck);
  buildDeckPlanVoids(group, y, deck);
  buildLiftMarkers(group, y);

  const label = makeDeckLabel(deck);
  label.position.set(-3.34, y + 0.18, -6.95);
  group.add(label);
}

function buildHull(group, minDeck, maxDeck) {
  const hullMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fbff, roughness: 0.52, metalness: 0.05 });
  const lower = new THREE.Mesh(shipFootprintExtrudeGeometry(0.42), hullMaterial);
  lower.rotation.x = -Math.PI / 2;
  lower.scale.set(1.06, 1.04, 1);
  lower.position.set(0, 0.2, -0.02);
  lower.castShadow = true;
  lower.receiveShadow = true;
  group.add(lower);

  const wallHeight = Math.max(2.9, (maxDeck - minDeck + 1) * 0.45);
  const sideMaterial = new THREE.MeshStandardMaterial({ color: 0xe8f2f6, roughness: 0.58, transparent: true, opacity: 0.28 });
  [-SHIP.width / 2 - 0.05, SHIP.width / 2 + 0.05].forEach((x) => {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallHeight, 12.7), sideMaterial);
    side.position.set(x, 2.65, 0.1);
    group.add(side);
  });

  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(5.7, 0.12, 13.25),
    new THREE.MeshStandardMaterial({ color: 0xc92a2a, roughness: 0.5 })
  );
  stripe.position.set(0, 0.2, 0.08);
  group.add(stripe);

  const navyKeel = new THREE.Mesh(
    new THREE.BoxGeometry(5.3, 0.34, 12.4),
    new THREE.MeshStandardMaterial({ color: 0x102a43, roughness: 0.62, metalness: 0.05, transparent: true, opacity: 0.72 })
  );
  navyKeel.position.set(0, -0.05, 0.35);
  group.add(navyKeel);

  const terraces = [
    { y: 5.82, z: -4.38, w: 2.35, l: 1.65, h: 0.44 },
    { y: 6.25, z: -4.92, w: 1.78, l: 1.15, h: 0.36 },
    { y: 5.65, z: 4.75, w: 2.65, l: 1.55, h: 0.28 },
  ];
  terraces.forEach((part) => {
    const deckhouse = new THREE.Mesh(
      new THREE.BoxGeometry(part.w, part.h, part.l),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.48, metalness: 0.04 })
    );
    deckhouse.position.set(0, part.y, part.z);
    deckhouse.castShadow = true;
    group.add(deckhouse);
  });

  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(2.55, 0.48, 1.18),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.48 })
  );
  bridge.position.set(0, 6.68, -5.55);
  bridge.castShadow = true;
  group.add(bridge);

  const bridgeGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.25, 0.18, 0.05),
    new THREE.MeshBasicMaterial({ color: 0x74c7e6, transparent: true, opacity: 0.72 })
  );
  bridgeGlass.position.set(0, 6.78, -6.17);
  group.add(bridgeGlass);

  const funnelMaterial = new THREE.MeshStandardMaterial({ color: 0xc2412d, roughness: 0.46 });
  [-0.55, 0.55].forEach((x) => {
    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.82, 24), funnelMaterial);
    funnel.position.set(x, 7.18, -3.55);
    funnel.castShadow = true;
    group.add(funnel);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 24), new THREE.MeshStandardMaterial({ color: 0x102a43 }));
    cap.position.set(x, 7.64, -3.55);
    group.add(cap);
  });

  buildAftPool(group);
  addFootprintOutline(group, 0.68, 0x0f344d, 0.8);
  const fwdLabel = makeSimpleLabel("FWD", "#f8fafc", 82, 32);
  fwdLabel.position.set(0, 6.05, -7.25);
  group.add(fwdLabel);
  const aftLabel = makeSimpleLabel("AFT", "#f8fafc", 82, 32);
  aftLabel.position.set(0, 0.92, 7.25);
  group.add(aftLabel);
}

function buildZonePanels(group, y, deck) {
  ZONE_PANELS.forEach((panel) => {
    const isDeck9Special = panel.zone === 9 && Number(deck) === 9;
    const section = isDeck9Special ? "MID" : panel.section;
    const range = SECTION_RANGES[section] || SECTION_RANGES.TBD;
    const length = Math.max(0.8, range.end - range.start - 0.16);
    const opacity = isDeck9Special && panel.section === "AFT" ? 0.04 : 0.16;
    const zone = new THREE.Mesh(
      new THREE.PlaneGeometry(panel.width, length),
      new THREE.MeshBasicMaterial({ color: SECTION_COLORS[section], transparent: true, opacity, side: THREE.DoubleSide })
    );
    zone.rotation.x = -Math.PI / 2;
    zone.position.set(panel.x, y - 0.095, (range.start + range.end) / 2);
    group.add(zone);
  });

  const centerLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.035, 12.9),
    new THREE.MeshBasicMaterial({ color: 0x102a43, transparent: true, opacity: 0.24 })
  );
  centerLine.position.set(0, y - 0.07, 0);
  group.add(centerLine);
}

function buildLiftMarkers(group, y) {
  LIFT_BANKS.forEach((bank) => {
    const z = planProgressToZ(bank.progress);
    const lift = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.12, 0.64),
      new THREE.MeshStandardMaterial({ color: 0x314657, roughness: 0.62, transparent: true, opacity: 0.86 })
    );
    lift.position.set(0, y + 0.04, z);
    group.add(lift);
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.22, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xdbeafe, transparent: true, opacity: 0.58 })
    );
    core.position.set(0, y + 0.18, z);
    group.add(core);
  });
}

function buildDeckPlanVoids(group, y, deck) {
  (DECK_VOIDS[Number(deck)] || []).forEach((voidSpace) => {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(voidSpace.width, 0.08, voidSpace.length),
      new THREE.MeshBasicMaterial({ color: 0xe5edf2, transparent: true, opacity: 0.36 })
    );
    block.position.set(0, y + 0.012, voidSpace.z);
    group.add(block);
  });
}

function buildLifeBoatRow(group, y) {
  const boatMaterial = new THREE.MeshStandardMaterial({ color: 0xf4a23a, roughness: 0.48, metalness: 0.04 });
  [-1, 1].forEach((side) => {
    [-1.25, -0.35, 0.55, 1.45].forEach((z) => {
      const boat = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.62), boatMaterial);
      boat.position.set(side * (SHIP.width / 2 + 0.18), y + 0.1, z);
      boat.castShadow = true;
      group.add(boat);
    });
  });
}

function buildAftPool(group) {
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.44, 0.035, 42),
    new THREE.MeshBasicMaterial({ color: 0x69d6ef, transparent: true, opacity: 0.72 })
  );
  pool.rotation.x = Math.PI / 2;
  pool.position.set(0, 5.84, 4.72);
  group.add(pool);
}

function buildRouteOverlay(state, minDeck) {
  const from = state.route?.from;
  const to = state.route?.to;
  if (!from || !to) return;

  const fromLocation = state.helpers.roomLocation(from);
  const toLocation = state.helpers.roomLocation(to);
  const fromPosition = routeRoomPoint(from, fromLocation, minDeck);
  const toPosition = routeRoomPoint(to, toLocation, minDeck);
  const routeY = (record) => deckY(Number(record.deck), minDeck) + 0.4;
  const y1 = routeY(from);
  const y2 = routeY(to);
  const liftZ = nearestLiftZ(fromPosition.z, toPosition.z);
  const points = [
    fromPosition,
    new THREE.Vector3(0, y1, fromPosition.z),
  ];

  if (Math.abs(fromPosition.z - liftZ) > 0.12 || Number(from.deck) !== Number(to.deck)) {
    points.push(new THREE.Vector3(0, y1, liftZ));
  }
  if (Number(from.deck) !== Number(to.deck)) {
    points.push(new THREE.Vector3(0, y2, liftZ));
  }
  if (Math.abs(toPosition.z - liftZ) > 0.12 || Number(from.deck) !== Number(to.deck)) {
    points.push(new THREE.Vector3(0, y2, toPosition.z));
  }
  points.push(toPosition);

  const routeMaterial = new THREE.MeshBasicMaterial({ color: 0xfadee4, transparent: true, opacity: 0.98, depthTest: false });
  const liftMaterial = new THREE.MeshBasicMaterial({ color: 0xdaafd2, transparent: true, opacity: 0.96, depthTest: false });
  points.slice(1).forEach((point, index) => {
    const previous = points[index];
    const isLift = Math.abs(previous.x - point.x) < 0.01 && Math.abs(previous.z - point.z) < 0.01 && Math.abs(previous.y - point.y) > 0.08;
    addRouteSegment(state.group, previous, point, isLift ? liftMaterial : routeMaterial, isLift ? 0.075 : 0.065);
  });

  points.forEach((point, index) => addRouteNode(state.group, point, index === 0 ? 0xdaafd2 : (index === points.length - 1 ? 0x9c8cbd : 0xfadee4)));
  addRouteLabel(state.group, fromPosition.clone().add(new THREE.Vector3(0, 0.38, 0)), "A", "#DAAFD2");
  addRouteLabel(state.group, toPosition.clone().add(new THREE.Vector3(0, 0.38, 0)), "B", "#9C8CBD");
}

function routeRoomPoint(record, location, minDeck) {
  const position = roomPosition(record, location);
  position.y = deckY(Number(record.deck), minDeck);
  const roomY = position.y + 0.08 + (position.side === "center" ? 0.13 : 0);
  const sideOffset = position.side === "port" ? 0.34 : (position.side === "starboard" ? -0.34 : 0);
  return new THREE.Vector3(position.x + sideOffset, roomY + 0.34, position.z);
}

function nearestLiftZ(...values) {
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return LIFT_BANKS
    .map((bank) => planProgressToZ(bank.progress))
    .sort((a, b) => Math.abs(average - a) - Math.abs(average - b))[0];
}

function addRouteSegment(group, from, to, material, radius) {
  const direction = to.clone().sub(from);
  const length = direction.length();
  if (length < 0.02) return;
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 16);
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.copy(from.clone().add(to).multiplyScalar(0.5));
  cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  cylinder.renderOrder = 30;
  group.add(cylinder);
}

function addRouteNode(group, point, color) {
  const node = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 20, 20),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.98, depthTest: false })
  );
  node.position.copy(point);
  node.renderOrder = 31;
  group.add(node);
}

function addRouteLabel(group, point, text, color) {
  const label = makeSimpleLabel(text, color, 72, 72, 42, 0.36, 0.36);
  label.position.copy(point);
  label.material.depthTest = false;
  label.renderOrder = 32;
  group.add(label);
}

function roomMaterial(section, isDone, isSelected) {
  return new THREE.MeshStandardMaterial({
    color: isDone ? 0xfadee4 : (SECTION_COLORS[section] || SECTION_COLORS.TBD),
    emissive: isDone ? 0xa06baf : (isSelected ? 0xdaafd2 : 0x3e2555),
    emissiveIntensity: isDone ? 0.75 : (isSelected ? 0.48 : 0.08),
    roughness: 0.42,
    metalness: 0.02,
  });
}

function makeRoomMarker(position, material, isSelected) {
  const geometry = position.side === "center"
    ? new THREE.BoxGeometry(isSelected ? 0.28 : 0.2, isSelected ? 0.24 : 0.16, isSelected ? 0.28 : 0.2)
    : new THREE.BoxGeometry(0.055, isSelected ? 0.22 : 0.15, isSelected ? 0.26 : 0.19);
  const room = new THREE.Mesh(geometry, material);
  room.position.set(position.x, position.y + 0.08, position.z);
  if (position.side === "center") {
    room.position.y += 0.13;
  }
  return room;
}

function roomPosition(record, location) {
  const deck = Number(record.deck);
  const planPoint = deckPlanPoint(record, location);
  const z = planProgressToZ(planPoint.progress);
  const side = planPoint.side || zoneSide(deck, location.zone);
  const suffix = Number.isFinite(location.roomSuffix) ? location.roomSuffix : 50;
  const parityNudge = suffix % 2 === 0 ? -0.07 : 0.07;
  const xBySide = {
    port: -SHIP.width / 2 - 0.055,
    starboard: SHIP.width / 2 + 0.055,
    center: parityNudge,
  };
  return {
    x: xBySide[side] ?? 0,
    z,
    side,
    y: 0,
  };
}

function deckPlanPoint(record, location) {
  const helperPoint = sceneState?.helpers?.deckPlanPoint?.(record, location);
  if (helperPoint) return helperPoint;
  const section = location.section === "TBD" ? "MID" : location.section;
  const [start, end] = PLAN_PROGRESS_RANGES[section] || PLAN_PROGRESS_RANGES.TBD;
  const suffix = Number.isFinite(location.roomSuffix) ? location.roomSuffix : 50;
  const ratio = clamp((suffix - 1) / 98, 0.02, 0.98);
  return {
    progress: start + (end - start) * ratio,
  };
}

function planProgressToZ(progress) {
  return -6.55 + clamp(progress, 0.04, 0.96) * 12.9;
}

function zoneSide(deck, zone) {
  if (zone === 9 && Number(deck) !== 9) return "center";
  return ZONE_SIDES[zone] || "center";
}

function shipFootprintGeometry() {
  return new THREE.ShapeGeometry(shipFootprintShape(), 48);
}

function shipFootprintExtrudeGeometry(depth) {
  return new THREE.ExtrudeGeometry(shipFootprintShape(), {
    depth,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.09,
    bevelThickness: 0.08,
    curveSegments: 24,
  });
}

function shipFootprintShape() {
  const halfWidth = 2.72;
  const halfLength = 7.05;
  const nose = 1.15;
  const tail = 0.72;
  const shape = new THREE.Shape();
  shape.moveTo(0, -halfLength);
  shape.quadraticCurveTo(halfWidth, -halfLength + nose * 0.2, halfWidth, -halfLength + nose);
  shape.lineTo(halfWidth, halfLength - tail);
  shape.quadraticCurveTo(halfWidth, halfLength, 0, halfLength);
  shape.quadraticCurveTo(-halfWidth, halfLength, -halfWidth, halfLength - tail);
  shape.lineTo(-halfWidth, -halfLength + nose);
  shape.quadraticCurveTo(-halfWidth, -halfLength + nose * 0.2, 0, -halfLength);
  return shape;
}

function addFootprintOutline(group, y, color, opacity) {
  const points = shipFootprintPoints().map((point) => new THREE.Vector3(point.x, y, point.y));
  points.push(points[0].clone());
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  group.add(line);
}

function shipFootprintPoints() {
  return shipFootprintShape().getPoints(64);
}

function makeDeckLabel(deck) {
  return makeSimpleLabel(`Deck ${deck}`, "#9fc2d1", 128, 48, 24, 1.24, 0.44);
}

function makeSimpleLabel(text, color, width, height, fontSize = 22, scaleX = 0.9, scaleY = 0.36) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.font = `800 ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, Math.round(height * 0.68));
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(scaleX, scaleY, 1);
  return sprite;
}

function renderStatus(state) {
  const deliveredCount = state.records.filter((record) => state.delivered.has(String(record.id))).length;
  const selected = state.selectedId ? state.records.find((record) => String(record.id) === String(state.selectedId)) : null;
  const selectedLocation = selected ? state.helpers.roomLocation(selected) : null;
  const routeFrom = state.route?.from || null;
  const routeTo = state.route?.to || null;
  const routeReady = Boolean(routeFrom && routeTo);
  state.status.innerHTML = `
    <h3>3D ship status</h3>
    <div class="progress"><span style="width:${state.records.length ? (deliveredCount / state.records.length) * 100 : 0}%"></span></div>
    <p class="subtext">${deliveredCount} of ${state.records.length} visible rooms delivered.</p>
    <div class="ship3d-legend">
      <span><i class="legend-fwd"></i>FWD</span>
      <span><i class="legend-mid"></i>MID</span>
      <span><i class="legend-aft"></i>AFT</span>
      <span><i class="legend-done"></i>Done</span>
      <span><i class="legend-route"></i>Route</span>
      <span><i class="legend-lift"></i>Lift</span>
    </div>
    <div class="ship3d-views" aria-label="3D camera views">
      <button type="button" data-ship-view="front">Front</button>
      <button type="button" data-ship-view="top">Top</button>
      <button type="button" data-ship-view="side">Side</button>
    </div>
    <div class="ship3d-route-card">
      <p class="eyebrow">3D route</p>
      ${routeReady ? `
        <div class="section-row"><strong>From</strong><span>${escapeHtml(targetName(routeFrom))}</span></div>
        <div class="section-row"><strong>To</strong><span>${escapeHtml(targetName(routeTo))}</span></div>
      ` : ""}
      <p class="subtext">${routeReady ? "Blush is walking; mauve is vertical lift travel." : "Choose From and To in the Route planner above to draw the Rapunzel-toned path through corridors and lift cores."}</p>
    </div>
    ${selected ? `
      <div class="selected-room">
        <p class="eyebrow">Selected room</p>
        <h3>${selected.room ? `Room ${escapeHtml(selected.room)}` : "Room TBD"}</h3>
        <p class="subtext">${escapeHtml(state.helpers.locationLine(selectedLocation))}</p>
        <button class="status-toggle ${state.delivered.has(String(selected.id)) ? "is-on" : ""}" data-ship-deliver="${selected.id}" type="button">
          ${state.delivered.has(String(selected.id)) ? "Delivered" : "Mark delivered"}
        </button>
      </div>
    ` : `<p class="subtext">Click a room marker to inspect it.</p>`}
    <p class="subtext">The model follows the Disney Adventure deck-plan orientation: FWD bow, AFT stern, port left, starboard right, and lift banks as transfer cores.</p>
  `;
}

function targetName(target) {
  if (!target) return "destination";
  return target.kind === "place" ? target.title : `Room ${target.room}`;
}

function pickRoom(state, event) {
  const rect = state.renderer.domElement.getBoundingClientRect();
  const pointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, state.camera);
  const hits = raycaster.intersectObjects([...state.roomMeshes.values()], false);
  if (!hits.length) return;
  state.selectedId = String(hits[0].object.userData.record.id);
  buildShip(state);
  renderStatus(state);
}

function deckY(deck, minDeck) {
  return SHIP.baseY + (deck - minDeck) * SHIP.deckStep;
}

function resize(state) {
  const width = state.mount.clientWidth || 1;
  const height = state.mount.clientHeight || 1;
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(width, height);
}

function updateCamera(state) {
  const distance = state.camera.position.distanceTo(state.target);
  const x = Math.sin(state.yaw) * Math.cos(state.pitch) * distance;
  const z = Math.cos(state.yaw) * Math.cos(state.pitch) * distance;
  const y = Math.sin(state.pitch) * distance;
  state.camera.position.copy(state.target.clone().add(new THREE.Vector3(x, y, z)));
  state.camera.lookAt(state.target);
}

function animate(state) {
  state.frame = requestAnimationFrame(() => animate(state));
  state.renderer.render(state.scene, state.camera);
}

function setCameraPreset(state, preset) {
  const positions = {
    front: { position: new THREE.Vector3(8.6, 10.2, 19.6), target: new THREE.Vector3(0, 3.55, 0), yaw: 0.42, pitch: 0.42 },
    top: { position: new THREE.Vector3(0, 28, 0.2), target: new THREE.Vector3(0, 3.2, 0), yaw: 0, pitch: 1.09 },
    side: { position: new THREE.Vector3(15.8, 7.8, 0), target: new THREE.Vector3(0, 3.45, 0), yaw: Math.PI / 2, pitch: 0.36 },
  };
  const next = positions[preset] || positions.front;
  state.target.copy(next.target);
  state.camera.position.copy(next.position);
  state.camera.lookAt(state.target);
  state.yaw = next.yaw;
  state.pitch = next.pitch;
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose?.());
    } else {
      child.material?.dispose?.();
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
