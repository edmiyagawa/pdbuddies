const state = {
  data: null,
  view: "route",
  query: "",
  deck: "all",
  family: "all",
  section: "all",
  routeFromType: "room",
  routeToType: "room",
  routeFrom: "",
  routeTo: "",
  delivered: readSet("pd-delivered"),
  packed: readSet("pd-packed"),
  found: readSet("pd-found"),
};

const CHARACTER_SPRITES = [
  "snow-white",
  "cinderella",
  "tinkerbell",
  "aurora",
  "ariel",
  "belle",
  "jasmine",
  "pocahontas",
  "mulan",
  "tiana",
  "rapunzel",
  "merida",
  "elsa",
  "anna",
  "moana",
  "lineup-1",
  "lineup-2",
  "lineup-3",
  "lineup-4",
  "lineup-5",
  "lineup-6",
  "lineup-7",
  "lineup-8",
  "lineup-9",
  "lineup-10",
];

const SECTION_ORDER = { FWD: 0, MID: 1, AFT: 2, TBD: 9 };
const SECTION_LABELS = { FWD: "FWD", MID: "MID", AFT: "AFT", TBD: "TBD" };
const SECTION_LONG = { FWD: "FWD", MID: "Midship", AFT: "Aft", TBD: "Unknown" };
const SECTION_ZONES = {
  FWD: [1, 2, 7],
  MID: [3, 6, 9],
  AFT: [5, 8, 9],
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

const labels = {
  princess: "Princess",
  mickey: "Mickey",
  duffy: "Duffy",
  marvel: "Marvel",
  pixar: "Pixar",
  starwars: "Star Wars",
  stitch: "Stitch",
  pooh: "Pooh/Baymax/Olaf",
  birthday: "Birthday",
  first: "First cruise",
  anniversary: "Anniversary",
  wedding: "Wedding",
  graduation: "Graduation",
};

const DEFAULT_DATA_URL = "./data/pd-app-data.json";
const EVENT_DEFINITIONS = [
  { key: "birthday", terms: ["birthday", "bday", "born day"] },
  { key: "first", terms: ["first time", "first cruise", "first dcl", "first voyage", "maiden cruise"] },
  { key: "anniversary", terms: ["anniversary"] },
  { key: "wedding", terms: ["wedding", "honeymoon", "proposal", "engagement"] },
  { key: "graduation", terms: ["graduation", "graduate", "grad trip"] },
];
const SHEET_COLUMN_ALIASES = {
  deck: ["deck", "deck no", "deck number", "floor"],
  room: ["stateroom number", "stateroom", "room number", "room", "cabin", "cabin number"],
  names: ["names", "name", "family", "guest", "guests", "occupants", "room occupants"],
  preferred: ["preferred characters", "preferred character", "favourite characters", "favorite characters", "characters", "likes", "preference"],
  eventsText: ["special events", "special event", "events", "celebration", "celebrations", "occasion"],
  doorTheme: ["door theme", "door themes", "door", "door decor", "door decoration", "theme"],
};
const DECK_PLAN_SOURCE = "Disney Adventure deck plan, October 2025";
const DECK_PLAN_BANKS = [
  { key: "fwd", label: "FWD lift/stair lobby", short: "FWD lifts", progress: 0.34 },
  { key: "aft", label: "Aft lift/stair lobby", short: "AFT lifts", progress: 0.75 },
];
const DECK_PLAN_NOTES = {
  5: "Deck 5 is a public venue deck with dining, retail, theatre access, and lounges; follow venue signage after leaving the lift/stair lobby.",
  6: "Deck 6 is a public venue deck with Town Square, lounges, dining, retail, and Guest Services; use the central public corridor after leaving the lift/stair lobby.",
  7: "Deck 7 is a public venue deck with retail, cinemas, clubs, and Baymax/Big Hero areas; follow venue signage from the nearest lift/stair lobby.",
  8: "Deck 8 is a kids club deck with Oceaneer Club, Fairytale Hall, nursery, and activity labs; use the club corridor after leaving the lift/stair lobby.",
  9: "Deck 9 has a long side-cabin corridor with Medical Center and Animator's Table spaces inboard; use the lift/stair lobby instead of crossing through venue space.",
  10: "Deck 10 has spa, Garden Stage, dining, and shop spaces inboard; stay on the side cabin corridor until a lift/stair lobby.",
  11: "Deck 11 wraps cabins around Disney Imagination Garden and dining areas; the side corridor plus lift/stair banks are the reliable route.",
  12: "Deck 12 is mostly regular cabin corridors with FWD and AFT lift/stair lobbies.",
  13: "Deck 13 is mostly regular cabin corridors with FWD and AFT lift/stair lobbies.",
  15: "Deck 15 is mostly regular cabin corridors with FWD and AFT lift/stair lobbies.",
  16: "Deck 16 has cabins FWD and AFT around recreation spaces; use the visible lift/stair banks for vertical moves.",
  17: "Deck 17 has only a small cabin cluster near the FWD/MID recreation area; route through the closest lift/stair lobby.",
  18: "Deck 18 is an upper-deck activity and concierge deck; use outdoor signage from the nearest lift/stair lobby.",
  19: "Deck 19 is an upper-deck activity deck; use the nearest stair/lift access and follow outdoor deck signage.",
};
const SPECIAL_LOCATION_SEEDS = [
  ["Alley Cat Cafe", [7], "Dining", 0.82],
  ["Animator's Palate", [5], "Dining", 0.72],
  ["Animator's Table", [9], "Dining", 0.78],
  ["Bewitching Boba & Brews", [10], "Dining", 0.75, "port"],
  ["Bounce and Hops", [17], "Dining", 0.45],
  ["Cosmic Kebabs", [10], "Dining", 0.64, "starboard"],
  ["Enchanted Summer Restaurant", [6], "Dining", 0.66],
  ["Gramma Tala's Kitchen", [10], "Dining", 0.72, "starboard"],
  ["Hollywood Spotlight Club", [8], "Dining", 0.88],
  ["Mike & Sulley's Flavours of Asia", [10], "Dining", 0.86, "port"],
  ["Mowgli's Eatery", [10], "Dining", 0.72, "port"],
  ["Navigator's Club", [6], "Dining", 0.82],
  ["Palo Cafe", [10], "Dining", 0.91],
  ["Palo Trattoria", [10, 11], "Dining", 0.93],
  ["Pixar Market Restaurant", [17], "Dining", 0.82],
  ["Pizza Planet", [17], "Dining", 0.52, "port"],
  ["Premiere Sips & Snacks", [6], "Dining", 0.32],
  ["Stitch's Ohana Grill", [10], "Dining", 0.77, "port"],
  ["Wheezy's Freezies", [17], "Dining", 0.66, "port"],
  ["Buccaneer Bar", [6], "Bar & Lounge", 0.72],
  ["D Lounge", [7], "Bar & Lounge", 0.46, "starboard"],
  ["Garden Bar", [11], "Bar & Lounge", 0.48],
  ["Infinity Bar", [18], "Bar & Lounge", 0.18],
  ["Market Bar", [17], "Bar & Lounge", 0.64, "starboard"],
  ["Private Karaoke Rooms", [7], "Bar & Lounge", 0.48],
  ["Royal Court Lounge", [6], "Bar & Lounge", 0.58],
  ["Spellbound", [6], "Bar & Lounge", 0.54],
  ["Taverna Portorosso", [11], "Bar & Lounge", 0.84],
  ["Tiana's Bayou Lounge", [5], "Bar & Lounge", 0.58],
  ["Baymax Cinemas", [7], "Theatre & Cinema", 0.91],
  ["Garden Stage", [10], "Theatre & Cinema", 0.58],
  ["Walt Disney Theatre", [5, 6, 7], "Theatre & Cinema", 0.22],
  ["Wayfinder Bay", [10, 11], "Theatre & Cinema", 0.94],
  ["Andy's Toy Box", [8], "Kids, Tweens & Teens", 0.48],
  ["Disney's Oceaneer Club", [8], "Kids, Tweens & Teens", 0.40],
  ["Edge", [7], "Kids, Tweens & Teens", 0.74],
  ["Fairytale Hall", [8], "Kids, Tweens & Teens", 0.52],
  ["It's a Small World Nursery", [8], "Kids, Tweens & Teens", 0.28],
  ["Marvel WEB Workshop", [8], "Kids, Tweens & Teens", 0.56],
  ["Mickey & Minnie Captain's Deck", [8], "Kids, Tweens & Teens", 0.30],
  ["Vibe", [7], "Kids, Tweens & Teens", 0.78, "port"],
  ["Walt Disney Imagineering Lab", [8], "Kids, Tweens & Teens", 0.62],
  ["Bibbidi Bobbidi Boutique", [7], "Retail", 0.44, "port"],
  ["Castle Collection", [11], "Retail", 0.44],
  ["Disney Studio", [7], "Retail", 0.52],
  ["Diamonds and Wishes", [7], "Retail", 0.60],
  ["Duffy and Friends Shop", [7], "Retail", 0.86],
  ["Marvel Style Studio", [6], "Retail", 0.72],
  ["National Geographic Store", [7], "Retail", 0.88],
  ["Pics Photo Shop", [7], "Retail", 0.34],
  ["Royal Studio", [7], "Retail", 0.50],
  ["Treasures Untold", [10], "Retail", 0.76, "starboard"],
  ["World of Disney", [5], "Retail", 0.50, "port"],
  ["World of Disney Too", [5], "Retail", 0.50, "starboard"],
  ["Big Hero Arcade", [7], "Recreation", 0.76],
  ["Disney Discovery Reef", [10, 11], "Recreation", 0.74],
  ["Disney Imagination Garden", [10, 11], "Recreation", 0.56],
  ["Edge of the Bay Cafe", [7], "Recreation", 0.74],
  ["Flying Saucer Splash Zone", [17], "Recreation", 0.42, "starboard"],
  ["Groot Galaxy Spin", [18], "Recreation", 0.48],
  ["Ironcycle Test Run", [19], "Recreation", 0.52],
  ["Marvel Landing", [18], "Recreation", 0.52],
  ["Pym Quantum Racers", [18], "Recreation", 0.56],
  ["San Fransokyo Street", [7], "Recreation", 0.82],
  ["Town Square", [6], "Recreation", 0.64],
  ["Vibe Records", [7], "Recreation", 0.78],
  ["3 Wishes", [17], "Concierge", 0.20],
  ["Concierge Gym", [18], "Concierge", 0.45],
  ["Concierge Lounge", [17], "Concierge", 0.25],
  ["Concierge Lounge Outdoor", [17], "Concierge", 0.30],
  ["Concierge Reception", [17], "Concierge", 0.32],
  ["Concierge Spa", [18], "Concierge", 0.48],
  ["Concierge Sundeck", [19], "Concierge", 0.46],
  ["Palace Treasures", [17], "Concierge", 0.24],
  ["Sundeck", [19], "Upper Deck & Water Feature", 0.50],
  ["Running Track", [18], "Upper Deck & Water Feature", 0.86],
  ["Sunnyside Pool", [17], "Upper Deck & Water Feature", 0.38, "port"],
  ["Toy Story Place", [17], "Upper Deck & Water Feature", 0.66],
  ["Toy Story Splash Pad", [17], "Upper Deck & Water Feature", 0.44],
  ["Wayfinder Bar", [10], "Upper Deck & Water Feature", 0.94],
  ["Woody and Jessie's Wild Slides", [17, 18, 19], "Upper Deck & Water Feature", 0.44],
  ["Infinite Bliss Spa - Elemis at Sea", [10], "Wellness", 0.46, "port"],
  ["Fitness Centre", [10], "Wellness", 0.46, "starboard"],
  ["Fairytale Fresh Laundry", [16], "General Areas", 0.45],
  ["Guest Services", [6], "General Areas", 0.62],
  ["Medical Centre", [9], "General Areas", 0.46],
  ["Smoking Area - Outer Deck", [7], "Smoking Area", 0.18, "starboard"],
  ["Smoking Area - Concierge Lounge", [17], "Smoking Area", 0.22, "port"],
  ["Smoking Area - Marvel Landing Infinity Pool Sundeck", [18], "Smoking Area", 0.82, "port"],
];
const SPECIAL_LOCATIONS = SPECIAL_LOCATION_SEEDS.flatMap(([title, decks, category, progress, side = "center"]) => {
  return decks.map((deck) => ({
    id: `place:${slugify(`${title}-${deck}`)}`,
    kind: "place",
    title,
    deck,
    room: "",
    names: "",
    preferred: "",
    eventsText: "",
    doorTheme: "",
    families: [],
    events: [],
    category,
    progress,
    side,
    section: sectionFromProgress(progress),
  }));
});

const els = {};
let ship3dModule = null;

init();

async function init() {
  renderCharacterBackdrop();
  cacheEls();
  state.data = await loadAppData();
  hydrateControls();
  bindEvents();
  render();
}

function renderCharacterBackdrop() {
  const mount = document.getElementById("characterBackdrop");
  if (!mount) return;
  const count = window.matchMedia("(max-width: 720px)").matches ? 12 : 24;
  const selected = shuffleSprites(CHARACTER_SPRITES).slice(0, count);
  mount.innerHTML = selected.map((name, index) => {
    const isLineup = name.startsWith("lineup-");
    const left = 4 + Math.random() * 92;
    const top = 4 + Math.random() * 92;
    const width = isLineup ? 58 + Math.random() * 32 : 92 + Math.random() * 90;
    const rotation = -16 + Math.random() * 32;
    const opacity = isLineup ? 0.055 + Math.random() * 0.04 : 0.07 + Math.random() * 0.06;
    return `<img class="${isLineup ? "is-lineup" : ""}" src="./assets/characters/${name}.png" alt="" loading="lazy" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%;--sprite-width:${width.toFixed(0)}px;--sprite-rotation:${rotation.toFixed(2)}deg;--sprite-opacity:${opacity.toFixed(3)};animation-delay:${(-index * 0.3).toFixed(1)}s" />`;
  }).join("");
}

function shuffleSprites(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

async function loadAppData() {
  const fallback = scrubPrivateNames(await loadFallbackData());
  const sheetConfig = getSheetConfig();

  if (!sheetConfig.url) {
    return withSpecialLocations(withDataSource(fallback, "Local JSON", "Using the bundled spreadsheet snapshot."));
  }

  try {
    const csv = await fetchSheetCsv(sheetConfig);
    return withSpecialLocations(buildDataFromSheet(parseCsv(csv), fallback, sheetConfig));
  } catch (error) {
    console.warn("Live Google Sheet unavailable; using bundled data.", error);
    return withSpecialLocations(withDataSource(fallback, "Local backup", "Live Google Sheet could not be loaded, so the bundled snapshot is active."));
  }
}

async function loadFallbackData() {
  const response = await fetch(DEFAULT_DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load ${DEFAULT_DATA_URL}`);
  return response.json();
}

function withDataSource(data, dataSource, dataNotice) {
  return {
    ...data,
    meta: {
      ...data.meta,
      dataSource,
      dataNotice,
    },
  };
}

function withSpecialLocations(data) {
  return {
    ...data,
    places: SPECIAL_LOCATIONS,
  };
}

function getSheetConfig() {
  const params = new URLSearchParams(window.location.search);
  const configured = window.PD_SHEET_CONFIG || {};
  const url = params.get("sheet") || params.get("sheetUrl") || configured.url || "";
  const gid = params.get("gid") || params.get("sheetGid") || configured.gid || gidFromUrl(url);

  return {
    url: String(url).trim(),
    gid: String(gid || "").trim(),
  };
}

async function fetchSheetCsv(sheetConfig) {
  const csvUrl = toGoogleSheetCsvUrl(sheetConfig.url, sheetConfig.gid);
  const apiUrl = `./api/sheet?url=${encodeURIComponent(sheetConfig.url)}${sheetConfig.gid ? `&gid=${encodeURIComponent(sheetConfig.gid)}` : ""}`;
  const canUseApi = window.location.protocol !== "file:";
  const allowDirectSheet = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const candidates = [
    ...(canUseApi ? [apiUrl] : []),
    ...(allowDirectSheet ? [csvUrl] : []),
  ].filter(Boolean);
  let lastError = null;

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { cache: "no-store" });
      if (!response.ok) throw new Error(`${candidate} returned ${response.status}`);
      const text = await response.text();
      if (!text.trim()) throw new Error(`${candidate} returned an empty sheet`);
      return text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to fetch redacted Google Sheet CSV.");
}

function toGoogleSheetCsvUrl(value, preferredGid) {
  const input = String(value || "").trim();
  const inferredGid = preferredGid || gidFromUrl(input);
  const sheetId = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
  const publishedId = input.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/)?.[1];

  if (publishedId) {
    return `https://docs.google.com/spreadsheets/d/e/${publishedId}/pub?output=csv${inferredGid ? `&gid=${encodeURIComponent(inferredGid)}` : ""}`;
  }

  if (sheetId) {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv${inferredGid ? `&gid=${encodeURIComponent(inferredGid)}` : ""}`;
  }

  if (/^[a-zA-Z0-9-_]{20,}$/.test(input)) {
    return `https://docs.google.com/spreadsheets/d/${input}/gviz/tq?tqx=out:csv${inferredGid ? `&gid=${encodeURIComponent(inferredGid)}` : ""}`;
  }

  return input;
}

function gidFromUrl(value) {
  try {
    const url = new URL(value);
    return url.searchParams.get("gid") || "";
  } catch {
    return "";
  }
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((candidate) => candidate.some((value) => String(value).trim()));
}

function buildDataFromSheet(rows, fallback, sheetConfig) {
  const objects = rowsToObjects(rows);
  const fallbackByRoom = new Map((fallback.records || []).map((record) => [String(record.room), record]));
  const records = objects
    .map((row, index) => normalizeSheetRecord(row, index + 1, fallback.families, fallbackByRoom))
    .filter((record) => record.room || record.deck || record.preferred || record.eventsText || record.doorTheme);

  if (!records.length) throw new Error("The Google Sheet did not contain stateroom rows.");

  const families = fallback.families.map((family) => ({ ...family }));
  const eventBoosters = buildEventBoosters(records, fallback.eventBoosters);
  const giftKits = buildGiftKits(records, families);

  return {
    ...fallback,
    meta: buildMeta(records, sheetConfig),
    records,
    route: { byDeck: groupRecordsByDeck(records) },
    families,
    topMentions: buildTopMentions(giftKits),
    giftKits,
    eventBoosters,
  };
}

function rowsToObjects(rows) {
  const headers = (rows[0] || []).map((header) => String(header || "").trim());
  return rows.slice(1).map((row) => {
    return headers.reduce((acc, header, index) => {
      if (header) acc[header] = String(row[index] ?? "").trim();
      return acc;
    }, {});
  });
}

function normalizeSheetRecord(row, id, families, fallbackByRoom = new Map()) {
  const room = cleanRoomNumber(pickCell(row, SHEET_COLUMN_ALIASES.room));
  const explicitDeck = cleanDeckNumber(pickCell(row, SHEET_COLUMN_ALIASES.deck));
  const deck = explicitDeck || deckFromRoom(room) || "";
  const preferred = pickCell(row, SHEET_COLUMN_ALIASES.preferred);
  const eventsText = pickCell(row, SHEET_COLUMN_ALIASES.eventsText);
  const doorTheme = pickCell(row, SHEET_COLUMN_ALIASES.doorTheme);
  const fallbackRecord = fallbackByRoom.get(String(room)) || {};
  const familyKeys = classifyFamilies([preferred, doorTheme, eventsText].join(" "), families);
  const eventKeys = classifyEvents(eventsText);

  return {
    id,
    deck,
    room,
    names: "",
    preferred: "",
    eventsText: "",
    doorTheme,
    families: familyKeys.length ? familyKeys : [...(fallbackRecord.families || [])],
    events: eventKeys.length ? eventKeys : [...(fallbackRecord.events || [])],
    packed: false,
    delivered: false,
    found: false,
  };
}

function scrubPrivateNames(data) {
  const scrubRecord = (record) => ({ ...record, names: "", preferred: "", eventsText: "" });
  return {
    ...data,
    records: Array.isArray(data.records) ? data.records.map(scrubRecord) : [],
    route: data.route || {},
  };
}

function pickCell(row, aliases) {
  const entries = Object.entries(row);
  const normalizedAliases = aliases.map(normalizeHeader);
  const exact = entries.find(([header]) => normalizedAliases.includes(normalizeHeader(header)));
  if (exact) return exact[1];

  const fuzzy = entries.find(([header]) => {
    const normalized = normalizeHeader(header);
    return normalizedAliases.some((alias) => normalized.includes(alias) || alias.includes(normalized));
  });
  return fuzzy ? fuzzy[1] : "";
}

function normalizeHeader(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function cleanRoomNumber(value) {
  const text = String(value || "").trim();
  const match = text.match(/\b\d{4,5}\b/);
  return match ? match[0] : "";
}

function cleanDeckNumber(value) {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : "";
}

function deckFromRoom(room) {
  if (!room || room.length < 4) return "";
  return Number(room.slice(0, -3)) || "";
}

function classifyFamilies(text, families) {
  const haystack = String(text || "").toLowerCase();
  return families
    .filter((family) => family.terms.some((term) => haystack.includes(String(term).toLowerCase())))
    .map((family) => family.key);
}

function classifyEvents(text) {
  const haystack = String(text || "").toLowerCase();
  return EVENT_DEFINITIONS
    .filter((event) => event.terms.some((term) => haystack.includes(term)))
    .map((event) => event.key);
}

function buildMeta(records, sheetConfig) {
  const decks = [...new Set(records.map((record) => Number(record.deck)).filter(Boolean))].sort((a, b) => a - b);
  return {
    sourceFile: "Google Sheet",
    dataSource: "Google Sheet",
    dataNotice: "Live public Google Sheet loaded.",
    sheetUrl: sheetConfig.url,
    sheetGid: sheetConfig.gid,
    entryCount: records.length,
    decks,
    withDoorThemes: records.filter((record) => record.doorTheme).length,
    missingRooms: records.filter((record) => !record.room).length,
    designNote: "Live data is normalized to the same route, gift, event, and 3D ship model used by the original workbook snapshot.",
  };
}

function groupRecordsByDeck(records) {
  return records.reduce((acc, record) => {
    const key = record.deck || "TBD";
    acc[key] ||= [];
    acc[key].push(record);
    return acc;
  }, {});
}

function buildGiftKits(records, families) {
  return families.map((family) => {
    const matches = records.filter((record) => record.families.includes(family.key));
    return {
      key: family.key,
      name: family.name,
      count: matches.length,
      accent: family.accent,
      items: family.items,
      suggestedQuantity: Math.ceil(matches.length * 1.15),
      bestFor: matches.slice(0, 10).map((record) => record.room).filter(Boolean),
    };
  });
}

function buildEventBoosters(records, fallbackBoosters) {
  return fallbackBoosters.map((booster) => ({
    ...booster,
    count: records.filter((record) => record.events.includes(booster.key)).length,
  }));
}

function buildTopMentions(giftKits) {
  return giftKits
    .map((kit) => ({ "Character / IP": kit.name, Mentions: kit.count }))
    .sort((a, b) => b.Mentions - a.Mentions)
    .map((item, index) => ({ Rank: index + 1, ...item }));
}

function cacheEls() {
  [
    "heroMetrics",
    "searchInput",
    "deckFilter",
    "familyFilter",
    "sectionFilter",
    "routeFromTypeSelect",
    "routeToTypeSelect",
    "routeFromSelect",
    "routeToSelect",
    "swapRouteButton",
    "clearRouteButton",
    "routeMapPanel",
    "walkingRoutePanel",
    "deckRail",
    "routeList",
    "routeInspector",
    "giftGrid",
    "packingList",
    "boostersPanel",
    "eventSummaryGrid",
    "eventLanes",
    "ship3dMount",
    "ship3dStatus",
    "resetShip3dButton",
    "printButton",
    "markPackedButton",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function hydrateControls() {
  els.deckFilter.innerHTML = [
    `<option value="all">All decks</option>`,
    ...state.data.meta.decks.map((deck) => `<option value="${deck}">Deck ${deck}</option>`),
  ].join("");

  els.familyFilter.innerHTML = [
    `<option value="all">All groups</option>`,
    ...state.data.families.map((family) => `<option value="${family.key}">${family.name}</option>`),
  ].join("");

  els.sectionFilter.innerHTML = [
    `<option value="all">All sections</option>`,
    `<option value="FWD">FWD</option>`,
    `<option value="MID">MID</option>`,
    `<option value="AFT">AFT</option>`,
    `<option value="TBD">TBD</option>`,
  ].join("");

  const typeOptions = [
    `<option value="room">Stateroom</option>`,
    `<option value="place">Other Locations</option>`,
  ].join("");
  els.routeFromTypeSelect.innerHTML = typeOptions;
  els.routeToTypeSelect.innerHTML = typeOptions;
  syncRouteTypeControls();
  hydrateRouteTargetSelects();
}

function specialLocationOptions() {
  return (state.data.places || [])
    .slice()
    .sort(comparePlaces)
    .map((place) => `<option value="${place.id}">${escapeHtml(targetOptionLabel(place))}</option>`);
}

function roomTargetOptions() {
  return state.data.records
    .filter((record) => record.room)
    .slice()
    .sort(compareRoute)
    .map((record) => `<option value="${record.id}">${escapeHtml(targetOptionLabel(record))}</option>`);
}

function hydrateRouteTargetSelects() {
  hydrateRouteTargetSelect("from");
  hydrateRouteTargetSelect("to");
}

function hydrateRouteTargetSelect(which) {
  const type = which === "from" ? state.routeFromType : state.routeToType;
  const select = which === "from" ? els.routeFromSelect : els.routeToSelect;
  const selectedId = which === "from" ? state.routeFrom : state.routeTo;
  const placeholder = `<option value="">Select ${which === "from" ? "start" : "destination"}</option>`;
  const options = type === "place" ? specialLocationOptions() : roomTargetOptions();
  select.innerHTML = [placeholder, ...options].join("");
  if (selectedId && targetKind(selectedId) === type) {
    select.value = selectedId;
  } else {
    select.value = "";
  }
}

function syncRouteTypeControls() {
  els.routeFromTypeSelect.value = state.routeFromType;
  els.routeToTypeSelect.value = state.routeToType;
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab === button));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("is-visible"));
      document.getElementById(`${state.view}View`).classList.add("is-visible");
      render();
    });
  });

  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });

  els.deckFilter.addEventListener("change", (event) => {
    state.deck = event.target.value;
    render();
  });

  els.familyFilter.addEventListener("change", (event) => {
    state.family = event.target.value;
    render();
  });

  els.sectionFilter.addEventListener("change", (event) => {
    state.section = event.target.value;
    render();
  });

  els.routeFromTypeSelect.addEventListener("change", (event) => {
    state.routeFromType = event.target.value;
    if (targetKind(state.routeFrom) !== state.routeFromType) state.routeFrom = "";
    hydrateRouteTargetSelect("from");
    renderRoute();
  });

  els.routeToTypeSelect.addEventListener("change", (event) => {
    state.routeToType = event.target.value;
    if (targetKind(state.routeTo) !== state.routeToType) state.routeTo = "";
    hydrateRouteTargetSelect("to");
    renderRoute();
  });

  els.routeFromSelect.addEventListener("change", (event) => {
    state.routeFrom = event.target.value;
    state.routeFromType = targetKind(state.routeFrom) || state.routeFromType;
    syncRouteTypeControls();
    renderRoute();
  });

  els.routeToSelect.addEventListener("change", (event) => {
    state.routeTo = event.target.value;
    state.routeToType = targetKind(state.routeTo) || state.routeToType;
    syncRouteTypeControls();
    renderRoute();
  });

  els.swapRouteButton.addEventListener("click", () => {
    [state.routeFrom, state.routeTo] = [state.routeTo, state.routeFrom];
    [state.routeFromType, state.routeToType] = [targetKind(state.routeFrom) || state.routeFromType, targetKind(state.routeTo) || state.routeToType];
    syncRouteTypeControls();
    hydrateRouteTargetSelects();
    renderRoute();
  });

  els.clearRouteButton.addEventListener("click", () => {
    state.routeFrom = "";
    state.routeTo = "";
    hydrateRouteTargetSelects();
    renderRoute();
  });

  els.printButton.addEventListener("click", () => window.print());
  els.markPackedButton.addEventListener("click", () => {
    filteredRecords().forEach((record) => state.packed.add(String(record.id)));
    writeSet("pd-packed", state.packed);
    renderGifts();
  });

  els.resetShip3dButton.addEventListener("click", () => {
    ship3dModule?.resetShip3D?.();
  });

  window.PDApp = {
    delivered: () => state.delivered,
    filteredRecords,
    locationLine,
    roomLocation,
    deckPlanPoint,
    deckPlanVenueNote,
    toggleDelivered: (id) => toggleSet(state.delivered, "pd-delivered", id, () => {
      renderMetrics();
      if (state.view === "route") renderRoute();
    }),
  };
}

function render() {
  renderMetrics();
  if (state.view === "route") renderRoute();
  if (state.view === "gifts") renderGifts();
  if (state.view === "events") renderEvents();
}

function renderMetrics() {
  const delivered = state.delivered.size;
  const packed = state.packed.size;
  const found = state.found.size;
  els.heroMetrics.innerHTML = [
    metric(state.data.meta.entryCount, "stateroom entries"),
    metric(state.data.meta.withDoorThemes, "door themes captured"),
    metric(sectionCountsLabel(state.data.records), "FWD / MID / AFT stops"),
    metric(`${delivered}/${state.data.meta.entryCount}`, "deliveries marked"),
    metric(`${packed}/${state.data.meta.entryCount}`, "packing slips marked"),
    metric(state.data.meta.dataSource || "Local data", "data source"),
  ].join("");
}

function metric(value, label) {
  return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
}

function renderRoute() {
  const records = filteredRecords();
  renderWalkingRoute();
  renderShip3D();
  renderDeckRail(records);

  if (!records.length) {
    els.routeList.innerHTML = `<div class="empty">No staterooms match the current filters.</div>`;
  } else {
    els.routeList.innerHTML = records.map(routeCard).join("");
  }

  els.routeList.querySelectorAll("[data-deliver]").forEach((button) => {
    button.addEventListener("click", () => toggleSet(state.delivered, "pd-delivered", button.dataset.deliver, renderRoute));
  });

  renderRouteInspector(records);
}

function renderWalkingRoute() {
  const from = routeTargetById(state.routeFrom);
  const to = routeTargetById(state.routeTo);
  els.routeMapPanel.innerHTML = routeMapSvg(from, to);

  if (!from && !to) {
    els.walkingRoutePanel.innerHTML = `
      <div class="route-empty-state">
        <strong>Room and venue navigator</strong>
        <span>Pick a stateroom or other location to turn the deck plan into walking steps.</span>
      </div>
      <div class="plan-source">Deck-plan orientation from the October 2025 plan: FWD at top, AFT at bottom, Port left, Starboard right, with lift/stair lobbies as transfer points.</div>
    `;
    return;
  }

  if (!from || !to) {
    const active = from || to;
    els.walkingRoutePanel.innerHTML = `
      <div class="route-empty-state">
        <strong>${from ? `Starting at ${targetName(active)}` : `Destination set to ${targetName(active)}`}</strong>
        <span>Select the ${from ? "destination" : "starting point"} to build the walking route.</span>
      </div>
    `;
    return;
  }

  const route = computeWalkingRoute(from, to);
  els.walkingRoutePanel.innerHTML = `
    <div class="route-summary">
      <div>
        <p class="eyebrow">Walking route</p>
        <strong>${targetName(from)} to ${targetName(to)}</strong>
        <span>${route.fromLabel} to ${route.toLabel}</span>
      </div>
      <div class="route-estimate">
        <strong>${route.estimate}</strong>
        <span>${route.sameDeck ? "same deck" : `${route.deckDelta} deck${route.deckDelta === 1 ? "" : "s"}`}</span>
      </div>
    </div>
    <ol class="walking-steps">
      ${route.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
    </ol>
    <div class="route-note">${escapeHtml(route.note)}</div>
  `;
}

function renderDeckRail(records) {
  const counts = countBy(state.data.records, "deck");
  els.deckRail.innerHTML = [
    deckButton("all", "All", state.data.meta.entryCount),
    ...state.data.meta.decks.map((deck) => deckButton(String(deck), deck, counts[deck] || 0)),
  ].join("");
  els.deckRail.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.deck = button.dataset.deck;
      els.deckFilter.value = state.deck;
      render();
    });
  });
}

function deckButton(value, label, count) {
  return `
    <button class="deck-button ${state.deck === value ? "is-active" : ""}" data-deck="${value}" type="button">
      <strong>${label}</strong>
      <span>${count} stops</span>
    </button>
  `;
}

function routeCard(record) {
  const done = state.delivered.has(String(record.id));
  const location = roomLocation(record);
  const routeRole = selectedRouteRole(record);
  return `
    <article class="route-card ${routeRole ? `is-${routeRole}` : ""}">
      <div class="card-head">
        <div>
          <div class="room">
            Deck ${record.deck} ${record.room ? `Room ${record.room}` : "Room TBD"}
            ${routeRole ? `<span class="route-role">${routeRole === "start" ? "Start" : "Destination"}</span>` : ""}
          </div>
          <div class="route-meta">${locationLine(location)}</div>
        </div>
        <button class="status-toggle ${done ? "is-on" : ""}" data-deliver="${record.id}" type="button">
          ${done ? "Delivered" : "Mark delivered"}
        </button>
      </div>
      <div class="badges">${badges([...record.families, ...record.events])}</div>
      <p class="card-line"><strong>Theme cues:</strong> ${escapeHtml(themeCue(record))}</p>
      <p class="subtext"><strong>Celebration cues:</strong> ${escapeHtml(eventCue(record))}</p>
      <p class="subtext"><strong>Door:</strong> ${escapeHtml(record.doorTheme || "No door theme listed")}</p>
    </article>
  `;
}

function renderRouteInspector(records) {
  const total = records.length || 1;
  const delivered = records.filter((record) => state.delivered.has(String(record.id))).length;
  const deckCounts = countBy(records, "deck");
  const sectionCounts = countByLocation(records);
  const max = Math.max(1, ...Object.values(deckCounts));
  els.routeInspector.innerHTML = `
    <h3>Route status</h3>
    <div class="progress" aria-label="Delivery progress"><span style="width:${(delivered / total) * 100}%"></span></div>
    <p class="subtext">${delivered} of ${records.length} visible staterooms delivered.</p>
    <h3>Walk order</h3>
    ${shipZoneMap()}
    <p class="subtext">Read room numbers as deck + zone + final two room digits. Example: 16132 = Deck 16, Zone 1, Room 32. ${DECK_PLAN_SOURCE} places FWD at the top, AFT at the bottom, Port left, Starboard right, and repeated lift/stair lobbies as transfer points.</p>
    <div class="section-stack">
      ${["FWD", "MID", "AFT", "TBD"].filter((section) => sectionCounts[section]).map((section) => `
        <div class="section-row">
          <strong>${section}</strong>
          <span>${sectionCounts[section]} stops</span>
        </div>
      `).join("")}
    </div>
    <h3>Deck load</h3>
    <div class="deck-stack">
      ${Object.entries(deckCounts).sort((a, b) => Number(a[0]) - Number(b[0])).map(([deck, count]) => `
        <div class="deck-row">
          <strong>${deck}</strong>
          <div class="deck-bar"><span style="width:${(count / max) * 100}%"></span></div>
          <span>${count}</span>
        </div>
      `).join("")}
    </div>
    <h3>Fast packing cue</h3>
    <p class="subtext">${topFamilies(records).map(([key, count]) => `${labels[key] || key}: ${count}`).join("<br>") || "No character groups in view."}</p>
  `;
}

function renderGifts() {
  const records = filteredRecords();
  els.giftGrid.innerHTML = state.data.giftKits.map((kit) => `
    <article class="kit" style="--kit-color:${kit.accent}">
      <p class="eyebrow">${kit.name}</p>
      <div class="kit-count"><strong>${kit.suggestedQuantity}</strong><span>pack</span></div>
      <p class="subtext">${kit.count} matching rooms plus a small buffer.</p>
      <ul>${kit.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `).join("");

  els.packingList.innerHTML = records.length ? records.map(packingCard).join("") : `<div class="empty">No packing slips match the current filters.</div>`;
  els.packingList.querySelectorAll("[data-pack]").forEach((button) => {
    button.addEventListener("click", () => toggleSet(state.packed, "pd-packed", button.dataset.pack, renderGifts));
  });

  els.boostersPanel.innerHTML = `
    <h3>Celebration boosters</h3>
    <p class="subtext">Pack these add-ons for rooms tagged with birthdays, anniversaries, first cruises, and other celebrations.</p>
    <ul>
      ${state.data.eventBoosters.filter((booster) => booster.count > 0).map((booster) => `<li><strong>${booster.name}:</strong> ${booster.count} rooms. ${booster.items.map(escapeHtml).join(", ")}.</li>`).join("")}
    </ul>
  `;
}

function packingCard(record) {
  const items = recommendedItems(record);
  const packed = state.packed.has(String(record.id));
  const location = roomLocation(record);
  return `
    <article class="packing-card">
      <div>
        <div class="room">${record.room ? `Room ${record.room}` : "Room TBD"} <span class="subtext">Deck ${record.deck}</span></div>
        <div class="route-meta">${locationLine(location)}</div>
        <div class="badges">${badges([...record.families, ...record.events])}</div>
        <div class="item-chips">${items.map((item) => `<span class="item-chip">${escapeHtml(item)}</span>`).join("")}</div>
      </div>
      <button class="status-toggle ${packed ? "is-on" : ""}" data-pack="${record.id}" type="button">
        ${packed ? "Packed" : "Pack"}
      </button>
    </article>
  `;
}

function recommendedItems(record) {
  const items = [];
  record.families.forEach((key) => {
    const kit = state.data.giftKits.find((candidate) => candidate.key === key);
    if (kit) items.push(kit.items[0]);
  });
  record.events.forEach((key) => {
    const booster = state.data.eventBoosters.find((candidate) => candidate.key === key);
    if (booster) items.push(booster.items[0]);
  });
  return [...new Set(items)].slice(0, 6);
}

function themeCue(record) {
  return record.families.length
    ? record.families.map((key) => labels[key] || key).join(", ")
    : "No character group tagged";
}

function eventCue(record) {
  return record.events.length
    ? record.events.map((key) => labels[key] || key).join(", ")
    : "No celebration tagged";
}

function renderEvents() {
  const records = filteredRecords();
  const eventKeys = ["birthday", "anniversary", "first"];
  const eventRecords = eventKeys.map((key) => ({
    key,
    label: labels[key] || key,
    accent: eventAccent(key),
    records: records.filter((record) => record.events.includes(key)).sort(compareRoute),
  }));

  els.eventSummaryGrid.innerHTML = eventRecords.map((group) => `
    <article class="event-summary-card" style="--event-accent:${group.accent}">
      <p class="eyebrow">${escapeHtml(group.label)}</p>
      <div class="kit-count"><strong>${group.records.length}</strong><span>rooms</span></div>
      <p class="subtext">${eventBoosterLine(group.key)}</p>
    </article>
  `).join("");

  els.eventLanes.innerHTML = eventRecords.map((group) => `
    <section class="event-lane" style="--event-accent:${group.accent}">
      <div class="mini-heading">
        <h3>${escapeHtml(group.label)}</h3>
        <span class="subtext">${group.records.length} matching room${group.records.length === 1 ? "" : "s"}</span>
      </div>
      <div class="event-card-list">
        ${group.records.length ? group.records.map(eventCard).join("") : `<div class="empty">No visible ${escapeHtml(group.label.toLowerCase())} rooms match the current filters.</div>`}
      </div>
    </section>
  `).join("");
}

function eventCard(record) {
  const location = roomLocation(record);
  return `
    <article class="event-card">
      <div>
        <div class="room">${record.room ? `Room ${record.room}` : "Room TBD"} <span class="subtext">Deck ${record.deck}</span></div>
        <div class="route-meta">${locationLine(location)}</div>
        <p class="card-line">${escapeHtml(record.doorTheme || themeCue(record))}</p>
        <div class="badges">${badges(record.events)}</div>
      </div>
      <div class="item-chips">${recommendedItems(record).map((item) => `<span class="item-chip">${escapeHtml(item)}</span>`).join("")}</div>
    </article>
  `;
}

function eventBoosterLine(key) {
  const booster = state.data.eventBoosters.find((candidate) => candidate.key === key);
  return booster ? booster.items.map(escapeHtml).join(", ") : "Add a small celebration booster.";
}

function eventAccent(key) {
  return {
    birthday: "#E34B62",
    anniversary: "#FFCA35",
    first: "#0A64A5",
  }[key] || "#8AC0E5";
}

async function renderShip3D() {
  els.ship3dStatus.innerHTML = `
    <h3>Loading 3D ship</h3>
    <p class="subtext">Building decks and rooms from the current filters.</p>
  `;
  ship3dModule ||= await import("./ship3d.js?v=rapunzel-route-2");
  ship3dModule.renderShip3D({
    mount: els.ship3dMount,
    status: els.ship3dStatus,
    records: filteredRecords(),
    allRecords: [...state.data.records, ...(state.data.places || [])],
    delivered: state.delivered,
    route: {
      fromId: state.routeFrom,
      toId: state.routeTo,
      from: routeTargetById(state.routeFrom),
      to: routeTargetById(state.routeTo),
    },
    onRouteChange: (fromId, toId) => {
      state.routeFrom = fromId;
      state.routeTo = toId;
      state.routeFromType = targetKind(fromId) || state.routeFromType;
      state.routeToType = targetKind(toId) || state.routeToType;
      syncRouteTypeControls();
      hydrateRouteTargetSelects();
      renderShip3D();
    },
    helpers: {
      roomLocation,
      locationLine,
      deckPlanPoint,
      toggleDelivered: window.PDApp.toggleDelivered,
    },
  });
}

function computeWalkingRoute(from, to) {
  const fromLoc = roomLocation(from);
  const toLoc = roomLocation(to);
  const fromPlan = deckPlanPoint(from, fromLoc);
  const toPlan = deckPlanPoint(to, toLoc);
  const fromBank = nearestDeckPlanBank(fromPlan);
  const toBank = nearestDeckPlanBank(toPlan);
  const transferBank = chooseTransferBank(fromPlan, toPlan);
  const sameDeck = Number(fromLoc.deck) === Number(toLoc.deck);
  const sameSection = fromLoc.section === toLoc.section;
  const sameZone = fromLoc.zone && toLoc.zone && fromLoc.zone === toLoc.zone;
  const deckDelta = Math.abs(Number(fromLoc.deck || 0) - Number(toLoc.deck || 0));
  const sectionDelta = Math.abs((SECTION_ORDER[fromLoc.section] ?? 0) - (SECTION_ORDER[toLoc.section] ?? 0));
  const roomDelta = Math.abs(Number(fromLoc.roomSuffix || 0) - Number(toLoc.roomSuffix || 0));
  const bankDelta = Math.abs(fromPlan.progress - toPlan.progress);
  const estimate = Math.max(1, Math.ceil(1 + deckDelta * 0.75 + sectionDelta * 0.9 + bankDelta * 3 + roomDelta / 42));
  const steps = [];

  steps.push(`Start at ${targetName(from)}: Deck ${fromLoc.deck}, ${SECTION_LONG[fromLoc.section]}, ${fromPlan.sideLabel} side.`);

  if (String(from.id) === String(to.id)) {
    steps.push("You are already at the selected destination.");
    return {
      sameDeck: true,
      deckDelta: 0,
      estimate: "0 min",
      fromLabel: routeLocationLabel(fromLoc),
      toLabel: routeLocationLabel(toLoc),
      steps,
      note: "Pick a different destination when you are ready to keep walking.",
    };
  }

  if (sameDeck && sameZone) {
    steps.push(`Stay inside Zone ${fromLoc.zone}; follow the same side corridor from room ending ${padRoomSuffix(fromLoc.roomSuffix)} toward ${padRoomSuffix(toLoc.roomSuffix)}.`);
  } else if (sameDeck) {
    steps.push(`Walk along the ${fromPlan.sideLabel} cabin corridor to the ${transferBank.label}.`);
    if (fromPlan.side !== toPlan.side) {
      steps.push(`Use the cross-corridor at the ${transferBank.short} to move from ${fromPlan.sideLabel} to ${toPlan.sideLabel}.`);
    }
    if (!sameSection) {
      steps.push(`Continue along the main corridor toward ${SECTION_LABELS[toLoc.section]}.`);
    }
    steps.push(destinationApproachStep(to, toLoc, toPlan));
  } else {
    const direction = Number(toLoc.deck) > Number(fromLoc.deck) ? "up" : "down";
    steps.push(`Move to the ${fromBank.label} on Deck ${fromLoc.deck}; it is the closest vertical core for this room block.`);
    steps.push(`Take the lift or stairs ${direction} to Deck ${toLoc.deck}.`);
    if (fromBank.key !== toBank.key) {
      steps.push(`On Deck ${toLoc.deck}, follow the center corridor from ${fromBank.short} toward ${toBank.short}.`);
    } else {
      steps.push(`Exit at ${toBank.short} on Deck ${toLoc.deck}.`);
    }
    steps.push(destinationApproachStep(to, toLoc, toPlan));
  }

  steps.push(`Arrive at ${targetName(to)}.`);
  const note = deckPlanRouteNote(from, to, sameDeck, sameSection);

  return {
    sameDeck,
    deckDelta,
    estimate: `${estimate}-${estimate + 1} min`,
    fromLabel: routeLocationLabel(fromLoc),
    toLabel: routeLocationLabel(toLoc),
    steps,
    note,
  };
}

function destinationApproachStep(to, toLoc, toPlan) {
  if (to.kind === "place") {
    return `Head to the ${toPlan.sideLabel} side of Deck ${toLoc.deck} and look for ${targetName(to)} in the ${SECTION_LONG[toLoc.section]} area.`;
  }
  return `Enter Zone ${toLoc.zone} on the ${toPlan.sideLabel} side and follow room numbers to ${padRoomSuffix(toLoc.roomSuffix)}.`;
}

function deckPlanRouteNote(from, to, sameDeck, sameSection) {
  const source = `Based on ${DECK_PLAN_SOURCE}.`;
  const fromNote = deckPlanVenueNote(from.deck);
  const toNote = !sameDeck ? deckPlanVenueNote(to.deck) : "";
  if (sameDeck && sameSection) {
    return `${source} Shortest delivery move: stay in the side cabin corridor and use room numbers as your guide. ${fromNote}`;
  }
  return [source, fromNote, toNote].filter(Boolean).join(" ");
}

function routeMapSvg(from, to) {
  const fromPoint = from ? routeMapPoint(from) : null;
  const toPoint = to ? routeMapPoint(to) : null;
  const pathPoints = routeMapPath(fromPoint, toPoint);
  const routeTitle = from && to
    ? `${targetName(from)} to ${targetName(to)}`
    : "Select two destinations";
  const deckLabel = from && to
    ? (String(from.deck) === String(to.deck) ? `Deck ${from.deck}` : `Deck ${from.deck} to Deck ${to.deck}`)
    : "Deck-plan route image";
  const liftLabel = from && to && String(from.deck) !== String(to.deck)
    ? `<text x="502" y="154" class="route-map-small">Lift: Deck ${escapeSvg(from.deck)} to ${escapeSvg(to.deck)}</text>`
    : "";

  return `
    <svg class="route-map" viewBox="0 0 760 300" role="img" aria-label="${escapeHtml(routeTitle)} route map">
      <defs>
        <marker id="routeArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill="#8550A0"></path>
        </marker>
        <filter id="pinShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#8550A0" flood-opacity="0.2"></feDropShadow>
        </filter>
      </defs>
      <rect x="0" y="0" width="760" height="300" rx="8" fill="#FFFAFC"></rect>
      <g transform="translate(0,0)">
        <path d="M380 18 C478 20 508 52 508 82 L508 232 C508 266 462 282 380 284 C298 282 252 266 252 232 L252 82 C252 52 282 20 380 18 Z" fill="#ffffff" stroke="#DAAFD2" stroke-width="2"></path>
        ${routeMapBand("FWD", 50, 112, "#FADEE4")}
        ${routeMapBand("MID", 124, 186, "#DAAFD2")}
        ${routeMapBand("AFT", 198, 260, "#9C8CBD")}
        <rect x="356" y="48" width="48" height="212" rx="8" fill="#8550A0" opacity="0.08"></rect>
        <rect x="346" y="113" width="68" height="18" rx="5" fill="#8550A0" opacity="0.72"></rect>
        <rect x="346" y="187" width="68" height="18" rx="5" fill="#8550A0" opacity="0.72"></rect>
        <text x="380" y="126" class="route-map-lift">LIFT</text>
        <text x="380" y="200" class="route-map-lift">LIFT</text>
        <text x="380" y="42" class="route-map-end">FWD</text>
        <text x="380" y="278" class="route-map-end">AFT</text>
        <text x="274" y="34" class="route-map-side">PORT</text>
        <text x="486" y="34" class="route-map-side">STARBOARD</text>
        <line x1="380" y1="50" x2="380" y2="260" stroke="#8550A0" stroke-width="2" stroke-dasharray="4 8" opacity="0.28"></line>
        ${pathPoints.length ? routeMapPathMarkup(pathPoints) : ""}
        ${fromPoint ? routePin(fromPoint, "start", targetName(from)) : ""}
        ${toPoint ? routePin(toPoint, "end", targetName(to)) : ""}
      </g>
      <g>
        <text x="32" y="44" class="route-map-title">${escapeSvg(routeTitle)}</text>
        <text x="32" y="68" class="route-map-small">${escapeSvg(deckLabel)}</text>
        <text x="32" y="104" class="route-map-key">Start</text>
        <circle cx="94" cy="99" r="7" fill="#DAAFD2"></circle>
        <text x="32" y="128" class="route-map-key">Destination</text>
        <circle cx="128" cy="123" r="7" fill="#9C8CBD"></circle>
        <text x="32" y="166" class="route-map-small">Path follows corridors, venues, and lift banks.</text>
        ${liftLabel}
      </g>
    </svg>
  `;
}

function routeMapBand(label, y, height, color) {
  const zoneText = label === "FWD" ? "2  ·  7  ·  1" : (label === "MID" ? "6  ·  9  ·  3" : "8  ·  9  ·  5");
  return `
    <rect x="272" y="${y}" width="216" height="${height}" rx="18" fill="${color}" opacity="0.42"></rect>
    <text x="380" y="${y + 23}" class="route-map-section">${label}</text>
    <text x="380" y="${y + height - 12}" class="route-map-zones">${zoneText}</text>
  `;
}

function routeMapPoint(record) {
  const location = roomLocation(record);
  const plan = deckPlanPoint(record, location);
  const sideX = {
    port: 306,
    center: 380,
    starboard: 454,
  };
  return {
    x: sideX[plan.side] || 380,
    y: planProgressToRouteY(plan.progress),
    section: location.section,
    deck: location.deck,
    zone: location.zone,
    progress: plan.progress,
    bank: nearestDeckPlanBank(plan),
  };
}

function routeMapPath(fromPoint, toPoint) {
  if (!fromPoint || !toPoint) return [];
  if (Math.abs(fromPoint.y - toPoint.y) < 12 && Math.abs(fromPoint.x - toPoint.x) < 16) {
    return [fromPoint, { x: fromPoint.x + 24, y: fromPoint.y - 18 }, toPoint];
  }
  const bank = chooseTransferBank(fromPoint, toPoint);
  const bankY = planProgressToRouteY(bank.progress);
  return [
    fromPoint,
    { x: 380, y: fromPoint.y },
    { x: 380, y: bankY },
    { x: 380, y: toPoint.y },
    toPoint,
  ];
}

function routeMapPathMarkup(points) {
  const d = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  return `
    <path d="${d}" fill="none" stroke="#8550A0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" marker-end="url(#routeArrow)"></path>
    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"></path>
  `;
}

function routePin(point, type, labelText) {
  const fill = type === "start" ? "#DAAFD2" : "#9C8CBD";
  const label = type === "start" ? "A" : "B";
  const labelX = point.x + (point.x > 400 ? -74 : 18);
  const anchor = point.x > 400 ? "end" : "start";
  const readableLabel = truncateLabel(labelText, 22);
  return `
    <g filter="url(#pinShadow)">
      <circle cx="${point.x}" cy="${point.y}" r="13" fill="${fill}" stroke="#ffffff" stroke-width="4"></circle>
      <text x="${point.x}" y="${point.y + 5}" class="route-map-pin">${label}</text>
    </g>
    <text x="${labelX}" y="${point.y + 5}" text-anchor="${anchor}" class="route-map-room">${escapeSvg(readableLabel)}</text>
  `;
}

function selectedRouteRole(record) {
  if (String(record.id) === String(state.routeFrom)) return "start";
  if (String(record.id) === String(state.routeTo)) return "destination";
  return "";
}

function recordById(id) {
  if (!id || !state.data) return null;
  return state.data.records.find((record) => String(record.id) === String(id)) || null;
}

function routeTargetById(id) {
  if (!id || !state.data) return null;
  if (String(id).startsWith("place:")) {
    return (state.data.places || []).find((place) => place.id === id) || null;
  }
  return recordById(id);
}

function targetKind(id) {
  if (!id) return "";
  return String(id).startsWith("place:") ? "place" : "room";
}

function targetName(target) {
  if (!target) return "destination";
  return target.kind === "place" ? target.title : `Room ${target.room}`;
}

function targetOptionLabel(target) {
  if (target.kind === "place") return `${target.title} · Deck ${target.deck} · ${target.category}`;
  const location = roomLocation(target);
  return `Room ${target.room} · Deck ${target.deck} · ${SECTION_LABELS[location.section]}`;
}

function comparePlaces(a, b) {
  return String(a.title).localeCompare(String(b.title), undefined, { sensitivity: "base" })
    || Number(a.deck) - Number(b.deck)
    || String(a.category).localeCompare(String(b.category), undefined, { sensitivity: "base" });
}

function sectionsBetween(fromSection, toSection) {
  const sections = ["FWD", "MID", "AFT"];
  const fromIndex = sections.indexOf(fromSection);
  const toIndex = sections.indexOf(toSection);
  if (fromIndex === -1 || toIndex === -1) return [fromSection, toSection].filter(Boolean);
  const step = fromIndex <= toIndex ? 1 : -1;
  const path = [];
  for (let index = fromIndex; index !== toIndex + step; index += step) {
    path.push(sections[index]);
  }
  return path;
}

function sideLabel(zone) {
  return ZONE_SIDES[zone] || "center";
}

function deckPlanPoint(record, location = roomLocation(record)) {
  if (record.kind === "place") {
    const side = record.side || "center";
    const progress = clamp(Number(record.progress ?? 0.5), 0.04, 0.96);
    return {
      deck: Number(record.deck || location.deck || 0),
      zone: null,
      section: record.section || sectionFromProgress(progress),
      side,
      sideLabel: side === "center" ? "center" : side,
      progress,
    };
  }
  const section = location.section === "TBD" ? "MID" : location.section;
  const suffix = Number.isFinite(location.roomSuffix) ? location.roomSuffix : 50;
  const side = sideLabel(location.zone);
  const ranges = {
    FWD: [0.08, 0.35],
    MID: [0.35, 0.66],
    AFT: [0.66, 0.95],
    TBD: [0.35, 0.66],
  };
  const [start, end] = ranges[section] || ranges.TBD;
  const ratio = clamp((suffix - 1) / 98, 0.02, 0.98);
  return {
    deck: Number(record.deck || location.deck || 0),
    zone: location.zone,
    section,
    side,
    sideLabel: side === "center" ? "center" : side,
    progress: start + (end - start) * ratio,
  };
}

function nearestDeckPlanBank(point) {
  return DECK_PLAN_BANKS
    .slice()
    .sort((a, b) => Math.abs(point.progress - a.progress) - Math.abs(point.progress - b.progress))[0];
}

function chooseTransferBank(fromPoint, toPoint) {
  const averageProgress = (fromPoint.progress + toPoint.progress) / 2;
  return DECK_PLAN_BANKS
    .slice()
    .sort((a, b) => Math.abs(averageProgress - a.progress) - Math.abs(averageProgress - b.progress))[0];
}

function planProgressToRouteY(progress) {
  return 42 + clamp(progress, 0.04, 0.96) * 236;
}

function deckPlanVenueNote(deck) {
  return DECK_PLAN_NOTES[Number(deck)] || "Use the nearest lift/stair lobby shown on the deck plan, then follow the cabin-side room numbers.";
}

function sectionFromProgress(progress) {
  if (progress < 0.35) return "FWD";
  if (progress < 0.66) return "MID";
  return "AFT";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateLabel(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function zonePositionLabel(zone) {
  const side = sideLabel(zone);
  return side === "center" ? "center corridor" : `${side} side`;
}

function routeLocationLabel(location) {
  if (location.isPlace) return `Deck ${location.deck}, ${SECTION_LABELS[location.section]}, other location`;
  if (location.section === "TBD") return "location TBD";
  return `Deck ${location.deck}, ${SECTION_LABELS[location.section]}, Zone ${location.zone}, ${sideLabel(location.zone)}`;
}

function padRoomSuffix(value) {
  return String(value).padStart(2, "0");
}

function escapeSvg(value) {
  return escapeHtml(value);
}

function filteredRecords() {
  return state.data.records
    .filter((record) => state.deck === "all" || String(record.deck) === state.deck)
    .filter((record) => state.family === "all" || record.families.includes(state.family))
    .filter((record) => state.section === "all" || roomLocation(record).section === state.section)
    .filter((record) => matchesQuery(record))
    .sort(compareRoute);
}

function matchesQuery(record) {
  if (!state.query) return true;
  const location = roomLocation(record);
  const safeTags = [...record.families, ...record.events].map((key) => labels[key] || key);
  return [record.room, record.doorTheme, record.deck, location.section, location.zone, ...safeTags]
    .join(" ")
    .toLowerCase()
    .includes(state.query);
}

function compareRoute(a, b) {
  const locA = roomLocation(a);
  const locB = roomLocation(b);
  return (Number(a.deck || 999) - Number(b.deck || 999))
    || (SECTION_ORDER[locA.section] - SECTION_ORDER[locB.section])
    || zoneRank(locA) - zoneRank(locB)
    || locA.roomSuffix - locB.roomSuffix
    || Number(a.id || 0) - Number(b.id || 0);
}

function roomLocation(record) {
  if (record.kind === "place") {
    const progress = clamp(Number(record.progress ?? 0.5), 0.04, 0.96);
    return {
      deck: Number(record.deck || 0),
      zone: null,
      roomSuffix: Math.round(progress * 100),
      section: record.section || sectionFromProgress(progress),
      isPlace: true,
    };
  }
  const rawRoom = String(record.room || "").trim();
  const match = rawRoom.match(/^(\d+)(\d)(\d{2})$/);
  if (!match) {
    return { deck: record.deck || null, zone: null, roomSuffix: 999, section: "TBD" };
  }
  const zone = Number(match[2]);
  const roomSuffix = Number(match[3]);
  return {
    deck: Number(match[1]),
    zone,
    roomSuffix,
    section: sectionForZone(Number(record.deck || match[1]), zone),
  };
}

function sectionForZone(deck, zone) {
  if ([1, 2, 7].includes(zone)) return "FWD";
  if ([3, 6].includes(zone)) return "MID";
  if (zone === 9) return Number(deck) === 9 ? "MID" : "AFT";
  if ([5, 8].includes(zone)) return "AFT";
  return "TBD";
}

function zoneRank(location) {
  const zones = SECTION_ZONES[location.section] || [];
  const index = zones.indexOf(location.zone);
  return index === -1 ? 99 : index;
}

function locationLine(location) {
  if (location.isPlace) return `${location.section} · other location`;
  if (location.section === "TBD") return "Zone TBD · Section TBD";
  return `${location.section} · Zone ${location.zone} · Room ${String(location.roomSuffix).padStart(2, "0")}`;
}

function sectionCountsLabel(records) {
  const counts = countByLocation(records);
  return `${counts.FWD || 0} / ${counts.MID || 0} / ${counts.AFT || 0}`;
}

function countByLocation(records) {
  return records.reduce((acc, record) => {
    const section = roomLocation(record).section;
    acc[section] = (acc[section] || 0) + 1;
    return acc;
  }, {});
}

function shipZoneMap() {
  return `
    <div class="zone-map" aria-label="Ship section map">
      <div class="zone-map-label">FWD</div>
      <div class="zone-row fwd"><span>2</span><span>7</span><span>1</span></div>
      <div class="lift">LIFT</div>
      <div class="zone-row mid"><span>6</span><span>9*</span><span>3</span></div>
      <div class="lift">LIFT</div>
      <div class="zone-row aft"><span>8</span><span>9</span><span>5</span></div>
      <div class="zone-map-label">AFT</div>
    </div>
  `;
}

function badges(keys) {
  return [...new Set(keys)].map((key) => `<span class="badge">${labels[key] || key}</span>`).join("");
}

function topFamilies(records) {
  const counts = {};
  records.forEach((record) => {
    record.families.forEach((key) => {
      counts[key] = (counts[key] || 0) + 1;
    });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function countBy(records, key) {
  return records.reduce((acc, record) => {
    const value = record[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toggleSet(set, storageKey, id, callback) {
  if (set.has(String(id))) {
    set.delete(String(id));
  } else {
    set.add(String(id));
  }
  writeSet(storageKey, set);
  renderMetrics();
  callback();
}

function readSet(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return new Set();
  }
}

function writeSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
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
