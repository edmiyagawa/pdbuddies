const state = {
  data: null,
  view: "route",
  query: "",
  deck: "all",
  family: "all",
  event: "all",
  routeTheme: "all",
  routeCelebration: "all",
  section: "all",
  routeFromType: "room",
  routeToType: "room",
  routeFrom: "",
  routeTo: "",
  delivered: readSet("pd-delivered"),
  found: readSet("pd-found"),
  photos: [],
  tabThemes: readJson("pd-tab-themes", {
    route: "rapunzel",
    gifts: "elsa",
    events: "snow-white",
    photos: "ariel",
    instructions: "anna",
  }),
};

const TAB_LABELS = {
  route: "Route",
  gifts: "Gifts",
  events: "Celebration",
  photos: "Photos",
  instructions: "Instructions",
};

const COLOUR_SCHEMES = [
  { key: "snow-white", name: "Snow White", colors: ["#E34B62", "#8AC0E5", "#0A64A5", "#FFEB94", "#FFCA35"], ink: "#123653" },
  { key: "cinderella", name: "Cinderella", colors: ["#EAF2FA", "#DCEBF6", "#B9DDEE", "#7FB8DD", "#286387"], ink: "#244a67" },
  { key: "tinkerbell", name: "Tinkerbell", colors: ["#FFF9B6", "#F5F2A4", "#C3D798", "#719842", "#456F48"], ink: "#314e36" },
  { key: "aurora", name: "Aurora", colors: ["#F7D2E4", "#F4A4C7", "#E36E9A", "#D24A7A", "#F8C94B"], ink: "#723452" },
  { key: "ariel", name: "Ariel", colors: ["#A497C4", "#594597", "#C6E8BE", "#53B288", "#378D68"], ink: "#243f38" },
  { key: "belle", name: "Belle", colors: ["#FFF8C6", "#FFEFA6", "#FAD96B", "#E8B13E", "#B08A44"], ink: "#5a4100" },
  { key: "jasmine", name: "Jasmine", colors: ["#C5F1E8", "#91D9D2", "#5FB9C0", "#1FA3B9", "#F9CD4B"], ink: "#164f58" },
  { key: "pocahontas", name: "Pocahontas", colors: ["#A88091", "#F2E3C8", "#F2C46C", "#D64740", "#9C4E28"], ink: "#4f2f28" },
  { key: "mulan", name: "Mulan", colors: ["#FFF3B8", "#BFD999", "#97A977", "#314E68", "#7C4DAA"], ink: "#273d4d" },
  { key: "tiana", name: "Tiana", colors: ["#F0F4D2", "#D5E6BC", "#BBD69F", "#86AA6A", "#526A4C"], ink: "#31492d" },
  { key: "rapunzel", name: "Rapunzel", colors: ["#FADEE4", "#DAAFD2", "#9C8CBD", "#A06BAF", "#8550A0"], ink: "#3e2555" },
  { key: "merida", name: "Merida", colors: ["#C58C66", "#953B27", "#173642", "#071720", "#010608"], ink: "#173642" },
  { key: "elsa", name: "Elsa", colors: ["#D5D9EA", "#86B3CB", "#82D4ED", "#3ABAE3", "#0C77A8"], ink: "#0d3954" },
  { key: "anna", name: "Anna", colors: ["#A42384", "#7DBBB0", "#1D318B", "#1E1A62", "#050A0A"], ink: "#050a0a" },
  { key: "moana", name: "Moana", colors: ["#A6D9CA", "#F0DDB8", "#D7A47A", "#A74D37", "#3F201B"], ink: "#3f201b" },
];

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

const PHOTO_LIMIT_PER_PERSON = 5;
const PHOTO_DB_NAME = "pixie-dust-buddies";
const PHOTO_STORE_NAME = "photos";

const SECTION_ORDER = { FWD: 0, MID: 1, AFT: 2, TBD: 9 };
const SECTION_LABELS = { FWD: "FWD", MID: "MID", AFT: "AFT", TBD: "TBD" };
const SECTION_LONG = { FWD: "FWD", MID: "Midship", AFT: "Aft", TBD: "Unknown" };
const ROOM_LOCATION_OVERRIDES = {
  17098: { section: "FWD", zone: 9 },
};
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
  princess: "Princesses & Royal",
  mickey: "Mickey & Friends",
  duffy: "Duffy & Friends",
  frozen: "Frozen",
  stitch: "Stitch & Experiments",
  toystory: "Toy Story",
  pixar: "Pixar",
  marvel: "Marvel Heroes",
  starwars: "Star Wars",
  villains: "Villains",
  animals: "Zootopia",
  parks: "Disney Parks & Cruise",
  flexible: "Surprise Me!",
  doorSurprise: "Surprise!",
  birthday: "Birthday",
  first: "First cruise",
  castaway: "Castaway Club",
  anniversary: "Wedding Anniversary",
  wedding: "Wedding Anniversary",
  graduation: "Graduation",
};

const CHARACTER_FAMILIES = [
  {
    key: "princess",
    name: "Princesses & Royal",
    terms: [
      "princess", "princesses", "royal", "snow white", "cinderella", "aurora", "sleeping beauty",
      "ariel", "little mermaid", "belle", "beauty and the beast", "jasmine", "aladdin",
      "pocahontas", "mulan", "tiana", "rapunzel", "tangled", "merida", "moana", "raya",
      "mirabel", "encanto", "sofia", "elena"
    ],
    accent: "#a06baf",
    items: ["Royal sticker sheet", "Gem-tone mini notebook", "Castle postcard", "Sparkle wand pencil", "Princess color charm"],
  },
  {
    key: "mickey",
    name: "Mickey & Friends",
    terms: [
      "mickey", "minnie", "donald", "daisy", "goofy", "pluto", "chip", "dale",
      "chip and dale", "classic", "classic disney", "sailor mickey", "ducks"
    ],
    accent: "#d8232a",
    items: ["Mickey sticker", "Nautical lanyard card", "Classic character keychain", "Red/yellow treat bag", "Captain-style magnet"],
  },
  {
    key: "duffy",
    name: "Duffy & Friends",
    terms: [
      "duffy", "shelliemay", "shellie may", "shellie", "gelatoni", "stella lou",
      "stellalou", "cookieann", "cookie ann", "olu", "olu mel", "olumel", "lina bell", "linabell"
    ],
    accent: "#9b6a43",
    items: ["Duffy mini charm", "Friendship bracelet", "Pastel bear sticker", "Nautical plush tag", "Discovery quest card"],
  },
  {
    key: "frozen",
    name: "Frozen",
    terms: ["frozen", "elsa", "anna", "olaf", "sven", "kristoff", "arendelle"],
    accent: "#3abae3",
    items: ["Snowflake sticker", "Icy blue bracelet", "Frozen mini card", "Silver sparkle pencil", "Blue treat bag"],
  },
  {
    key: "stitch",
    name: "Stitch & Experiments",
    terms: ["stitch", "angel", "lilo", "scrump", "ohana", "experiment 626", "626"],
    accent: "#168fc7",
    items: ["Blue alien sticker", "Tropical mini card", "Ohana-style bead charm", "Wave postcard", "Blue treat bag"],
  },
  {
    key: "toystory",
    name: "Toy Story",
    terms: ["toy story", "buzz", "woody", "jessie", "alien", "aliens", "forky", "bo peep", "rex", "slinky", "bullseye"],
    accent: "#ffca35",
    items: ["Toy Story sticker", "Alien green mini card", "Star command tag", "Cowboy mini note", "Puzzle activity sheet"],
  },
  {
    key: "pixar",
    name: "Pixar",
    terms: [
      "pixar", "cars", "lightning mcqueen", "mater", "monsters", "sulley", "sully", "mike wazowski",
      "nemo", "dory", "inside out", "joy", "sadness", "up", "wall-e", "walle",
      "incredibles", "coco", "turning red", "elemental", "ratatouille"
    ],
    accent: "#0d7f9f",
    items: ["Pixar sticker", "Alien green mini card", "Puzzle activity sheet", "Star command tag", "Character postcard"],
  },
  {
    key: "marvel",
    name: "Marvel Heroes",
    terms: [
      "marvel", "avengers", "superhero", "superheroes", "iron man", "spider", "spiderman",
      "spider-man", "captain america", "hulk", "thor", "black panther", "guardians",
      "groot", "rocket", "wanda", "loki", "captain marvel"
    ],
    accent: "#0a64a5",
    items: ["Hero emblem sticker", "Comic speech-bubble notepad", "Blue/red wristband", "Shield-style magnet", "Mini action stamp"],
  },
  {
    key: "starwars",
    name: "Star Wars",
    terms: [
      "star wars", "starwars", "grogu", "mandalorian", "mando", "chewbacca", "vader",
      "darth", "jedi", "lightsaber", "stormtrooper", "r2d2", "r2-d2", "bb8", "bb-8", "yoda"
    ],
    accent: "#1f2937",
    items: ["Galaxy sticker", "Saber pencil", "Space mission card", "Tiny star map", "Silver/black bag tag"],
  },
  {
    key: "villains",
    name: "Villains",
    terms: [
      "villain", "villains", "maleficent", "ursula", "cruella", "evil queen", "queen of hearts",
      "captain hook", "hook", "hades", "scar", "jafar", "dr facilier", "dr. facilier"
    ],
    accent: "#8550a0",
    items: ["Villain sticker", "Dark sparkle pencil", "Potion label card", "Purple treat bag", "Mischief mini note"],
  },
  {
    key: "animals",
    name: "Zootopia",
    terms: [
      "zootopia", "zootropolis", "judy hopps", "judy", "nick wilde", "nick",
      "flash", "clawhauser", "finnick", "gazelle"
    ],
    accent: "#ffca35",
    items: ["Zootopia sticker", "City badge card", "Carrot-orange pencil", "Animal-print mini note", "Savanna treat bag"],
  },
  {
    key: "parks",
    name: "Disney Parks & Cruise",
    terms: [
      "disney cruise", "dcl", "disney adventure", "cruise", "ship", "castle", "fireworks",
      "park", "parks", "tokyo disney", "disneyland", "disneysea", "walt disney world",
      "wdw", "any disney", "anything disney", "general disney"
    ],
    accent: "#86b3cb",
    items: ["Cruise magnet", "Castle postcard", "Fireworks sticker", "Ship mini card", "Pixie dust note"],
  },
  {
    key: "flexible",
    name: "Surprise Me!",
    terms: ["surprise", "surprise me", "anything", "any character", "no preference", "mixed", "mystery"],
    accent: "#d5d9ea",
    items: ["Assorted sticker", "Mystery mini note", "Mixed color bracelet", "Pixie dust card", "General treat bag"],
  },
];

const DEFAULT_DATA_URL = "./data/pd-app-data.json";
const EVENT_DEFINITIONS = [
  { key: "birthday", terms: ["birthday", "bday", "born day"] },
  { key: "first", terms: ["first time", "first cruise", "first dcl", "first voyage", "maiden cruise"] },
  { key: "castaway", terms: ["castaway", "castaway club", "second time", "second cruise", "second disney cruise", "second dcl cruise", "2nd cruise", "2nd disney cruise", "2nd dcl", "third cruise", "third disney cruise", "3rd cruise", "returning cruiser", "repeat cruiser", "not first cruise", "more than one time"] },
  { key: "anniversary", terms: ["anniversary"] },
  { key: "wedding", terms: ["wedding", "honeymoon", "proposal", "engagement"] },
  { key: "graduation", terms: ["graduation", "graduate", "grad trip"] },
];
const CELEBRATION_ORDER = ["birthday", "anniversary", "first", "castaway", "graduation"];
const EXTRA_EVENT_BOOSTERS = [
  {
    key: "castaway",
    name: "Castaway Club booster",
    items: ["Welcome back card", "Castaway Club tag", "Nautical sticker", "Blue ribbon"],
  },
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
  registerServiceWorker();
  renderCharacterBackdrop();
  cacheEls();
  syncViewFromHash();
  hydrateThemeMenu();
  applyTabThemes();
  state.data = await loadAppData();
  state.photos = await loadPhotos();
  hydrateControls();
  bindEvents();
  render();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!["http:", "https:"].includes(window.location.protocol)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Pixie Dust Buddies offline cache could not be registered.", error);
    });
  });
}

function syncViewFromHash() {
  const hashView = String(window.location.hash || "").replace(/^#/, "").replace(/View$/, "");
  if (["route", "gifts", "events", "photos", "instructions"].includes(hashView)) {
    state.view = hashView;
  }
  document.body.dataset.view = state.view;
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === state.view));
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("is-visible", view.id === `${state.view}View`));
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
    const width = isLineup ? 76 + Math.random() * 44 : 118 + Math.random() * 110;
    const rotation = -16 + Math.random() * 32;
    return `<img class="${isLineup ? "is-lineup" : ""}" src="./assets/characters/${name}.png" alt="" loading="lazy" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%;--sprite-width:${width.toFixed(0)}px;--sprite-rotation:${rotation.toFixed(2)}deg;animation-delay:${(-index * 0.3).toFixed(1)}s" />`;
  }).join("");
}

function shuffleSprites(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

async function loadAppData() {
  const fallback = withPreferredCharacterCategories(scrubPrivateNames(await loadFallbackData()));
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

function withPreferredCharacterCategories(data) {
  const records = (data.records || []).map((record) => {
    const families = classifyFamilies(record.preferred, CHARACTER_FAMILIES);
    return {
      ...record,
      families: families.length ? families : [...(record.families || [])].filter((key) => CHARACTER_FAMILIES.some((family) => family.key === key)),
      doorThemes: classifyDoorThemes(record.doorTheme),
      events: normalizeCelebrationKeys(record.events || []),
    };
  });
  const families = CHARACTER_FAMILIES.map((family) => ({ ...family }));
  const giftKits = buildGiftKits(records, families);

  return {
    ...data,
    records,
    route: { byDeck: groupRecordsByDeck(records) },
    families,
    topMentions: buildTopMentions(giftKits),
    giftKits,
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
    .map((row, index) => normalizeSheetRecord(row, index + 1, CHARACTER_FAMILIES, fallbackByRoom))
    .filter((record) => record.room || record.deck || record.preferred || record.eventsText || record.doorTheme);

  if (!records.length) throw new Error("The Google Sheet did not contain stateroom rows.");

  const families = CHARACTER_FAMILIES.map((family) => ({ ...family }));
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
  const familyKeys = classifyFamilies(preferred, families);
  const eventKeys = classifyEvents(eventsText);
  const doorThemeKeys = classifyDoorThemes(doorTheme);

  return {
    id,
    deck,
    room,
    names: "",
    preferred: "",
    eventsText: "",
    doorTheme,
    families: familyKeys.length ? familyKeys : [...(fallbackRecord.families || [])],
    doorThemes: doorThemeKeys.length ? doorThemeKeys : [...(fallbackRecord.doorThemes || [])],
    events: eventKeys.length ? eventKeys : [...(fallbackRecord.events || [])],
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

function normalizedMatchText(value) {
  return ` ${String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
}

function includesTerm(haystack, term) {
  const needle = normalizedMatchText(term).trim();
  return needle ? haystack.includes(` ${needle} `) : false;
}

function classifyFamilies(text, families) {
  const haystack = normalizedMatchText(text);
  return families
    .filter((family) => family.terms.some((term) => includesTerm(haystack, term)))
    .map((family) => family.key);
}

function classifyDoorThemes(text) {
  const value = String(text || "").trim();
  if (!value) return [];
  const categories = classifyFamilies(value, CHARACTER_FAMILIES);
  return categories.length ? categories : ["doorSurprise"];
}

function classifyEvents(text) {
  const haystack = String(text || "").toLowerCase();
  const keys = EVENT_DEFINITIONS
    .filter((event) => event.terms.some((term) => haystack.includes(term)))
    .map((event) => event.key);
  const normalized = normalizeCelebrationKeys(keys);
  return normalized.includes("castaway") ? normalized.filter((key) => key !== "first") : normalized;
}

function normalizeCelebrationKeys(keys) {
  return [...new Set((keys || []).map((key) => key === "wedding" ? "anniversary" : key))];
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
      suggestedQuantity: matches.length,
      bestFor: matches.slice(0, 10).map((record) => record.room).filter(Boolean),
    };
  });
}

function buildEventBoosters(records, fallbackBoosters) {
  const boosters = [...fallbackBoosters, ...EXTRA_EVENT_BOOSTERS]
    .filter((booster, index, all) => all.findIndex((candidate) => candidate.key === booster.key) === index);
  return boosters.map((booster) => ({
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
    "routeQuickFilters",
    "walkingRoutePanel",
    "deckRail",
    "routeList",
    "routeInspector",
    "giftGrid",
    "packingList",
    "boostersPanel",
    "eventSummaryGrid",
    "eventLanes",
    "photoForm",
    "photoStateroomInput",
    "photoRoomOptions",
    "photoCaptionInput",
    "photoFileInput",
    "photoStatus",
    "photoGallery",
    "ship3dMount",
    "ship3dStatus",
    "resetShip3dButton",
    "printButton",
    "themeMenuButton",
    "themeMenuPanel",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function hydrateThemeMenu() {
  const options = COLOUR_SCHEMES
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((scheme) => `<option value="${scheme.key}">${scheme.name}</option>`)
    .join("");
  document.querySelectorAll("[data-theme-select]").forEach((select) => {
    const tab = select.dataset.themeSelect;
    select.innerHTML = options;
    select.value = state.tabThemes[tab] || defaultThemeForTab(tab);
  });
}

function defaultThemeForTab(tab) {
  return {
    route: "rapunzel",
    gifts: "elsa",
    events: "snow-white",
    photos: "ariel",
    instructions: "anna",
  }[tab] || "rapunzel";
}

function applyTabThemes() {
  Object.keys(TAB_LABELS).forEach((tab) => applyTabTheme(tab));
  const current = getScheme(state.tabThemes[state.view] || defaultThemeForTab(state.view));
  document.body.style.setProperty("--active-tab-color", current.colors[4]);
  document.body.style.setProperty("--active-tab-rgb", hexToRgb(current.colors[4]).join(", "));
}

function applyTabTheme(tab) {
  const view = document.getElementById(`${tab}View`);
  if (!view) return;
  const scheme = getScheme(state.tabThemes[tab] || defaultThemeForTab(tab));
  const [soft, mid, accent, primary, deep] = scheme.colors;
  view.dataset.scheme = scheme.key;
  setThemeVar(view, tab, "soft-rgb", soft);
  setThemeVar(view, tab, "mid-rgb", mid);
  setThemeVar(view, tab, "accent-rgb", accent);
  setThemeVar(view, tab, "primary-rgb", deep);
  setViewSpecificThemeVars(view, tab, scheme);
}

function setViewSpecificThemeVars(view, tab, scheme) {
  const [soft, mid, accent, primary, deep] = scheme.colors;
  const ink = scheme.ink || deep;
  if (tab === "route") {
    setVars(view, {
      "--route-cream": "#fffdfd",
      "--route-blush": soft,
      "--route-mauve": mid,
      "--route-lavender": accent,
      "--route-orchid": primary,
      "--route-plum": deep,
      "--route-ink": ink,
      "--route-shadow": `0 16px 36px rgba(${hexToRgb(deep).join(", ")}, 0.16)`,
    });
  }
  if (tab === "gifts") {
    setVars(view, {
      "--gifts-ice": soft,
      "--gifts-frost": mid,
      "--gifts-snow": accent,
      "--gifts-aqua": primary,
      "--gifts-deep": deep,
      "--gifts-ink": ink,
      "--gifts-shadow": `0 16px 36px rgba(${hexToRgb(deep).join(", ")}, 0.14)`,
    });
  }
  if (tab === "events") {
    setVars(view, {
      "--events-red": primary,
      "--events-sky": mid,
      "--events-blue": deep,
      "--events-cream": soft,
      "--events-gold": accent,
      "--events-ink": ink,
    });
  }
  if (tab === "photos") {
    setVars(view, {
      "--photos-lavender": soft,
      "--photos-purple": primary,
      "--photos-seafoam": mid,
      "--photos-green": accent,
      "--photos-deep": deep,
      "--photos-ink": ink,
    });
  }
  if (tab === "instructions") {
    setVars(view, {
      "--instructions-magenta": primary,
      "--instructions-teal": mid,
      "--instructions-blue": accent,
      "--instructions-violet": deep,
      "--instructions-black": ink,
      "--instructions-ink": ink,
    });
  }
}

function setThemeVar(node, tab, name, color) {
  node.style.setProperty(`--${tab}-${name}`, hexToRgb(color).join(", "));
}

function setVars(node, vars) {
  Object.entries(vars).forEach(([name, value]) => node.style.setProperty(name, value));
}

function getScheme(key) {
  return COLOUR_SCHEMES.find((scheme) => scheme.key === key) || COLOUR_SCHEMES[0];
}

function hexToRgb(hex) {
  const value = String(hex || "#000000").replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((char) => `${char}${char}`).join("")
    : value.padEnd(6, "0").slice(0, 6);
  return [0, 2, 4].map((index) => parseInt(normalized.slice(index, index + 2), 16));
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

  const hasTbdSection = state.data.records.some((record) => roomLocation(record).section === "TBD");
  els.sectionFilter.innerHTML = [
    `<option value="all">All sections</option>`,
    `<option value="FWD">FWD</option>`,
    `<option value="MID">MID</option>`,
    `<option value="AFT">AFT</option>`,
    ...(hasTbdSection ? [`<option value="TBD">TBD</option>`] : []),
  ].join("");

  const typeOptions = [
    `<option value="room">Stateroom</option>`,
    `<option value="place">Other Locations</option>`,
  ].join("");
  els.routeFromTypeSelect.innerHTML = typeOptions;
  els.routeToTypeSelect.innerHTML = typeOptions;
  syncRouteTypeControls();
  hydrateRouteTargetSelects();
  els.photoRoomOptions.innerHTML = state.data.records
    .map((record) => normalizeStateroom(record.room))
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b))
    .map((room) => `<option value="${escapeHtml(room)}"></option>`)
    .join("");
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
      document.body.dataset.view = state.view;
      applyTabThemes();
      history.replaceState(null, "", `#${state.view}View`);
      render();
    });
  });

  els.themeMenuButton.addEventListener("click", () => {
    const isOpen = !els.themeMenuPanel.hidden;
    els.themeMenuPanel.hidden = isOpen;
    els.themeMenuButton.setAttribute("aria-expanded", String(!isOpen));
  });

  document.querySelectorAll("[data-theme-select]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const tab = event.target.dataset.themeSelect;
      state.tabThemes[tab] = event.target.value;
      writeJson("pd-tab-themes", state.tabThemes);
      applyTabThemes();
    });
  });

  document.addEventListener("click", (event) => {
    if (els.themeMenuPanel.hidden) return;
    if (event.target.closest(".theme-menu")) return;
    els.themeMenuPanel.hidden = true;
    els.themeMenuButton.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || els.themeMenuPanel.hidden) return;
    els.themeMenuPanel.hidden = true;
    els.themeMenuButton.setAttribute("aria-expanded", "false");
    els.themeMenuButton.focus();
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

  els.photoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addPhotoFromForm();
  });

  els.photoGallery.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-photo]");
    if (!button) return;
    await deletePhoto(button.dataset.deletePhoto);
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
  if (state.view === "photos") renderPhotos();
}

function renderMetrics() {
  const total = state.data.meta.entryCount;
  const delivered = state.data.records.filter((record) => state.delivered.has(String(record.id))).length;
  const remainingRecords = state.data.records.filter((record) => !state.delivered.has(String(record.id)));
  const remaining = Math.max(0, total - delivered);
  const progress = total ? Math.round((delivered / total) * 100) : 0;
  els.heroMetrics.innerHTML = [
    metric(`${delivered}/${state.data.meta.entryCount}`, "Pixie Dusted"),
    metric(remaining, "remaining rooms"),
    metric(`${progress}%`, "completion"),
    metric(sectionCountsLabel(remainingRecords), "remaining FWD / MID / AFT"),
  ].join("");
}

function metric(value, label) {
  return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
}

function renderRoute() {
  const baseRecords = filteredRecords();
  const records = filteredRecords({ includeRouteFilters: true });
  renderWalkingRoute();
  renderShip3D();
  renderDeckRail(records);
  renderRouteQuickFilters(baseRecords);

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

function renderRouteQuickFilters(records) {
  const themeKeys = visibleKeys(records, (record) => record.families, state.data.families.map((family) => family.key));
  const celebrationKeys = visibleKeys(records, (record) => record.events, CELEBRATION_ORDER);
  els.routeQuickFilters.innerHTML = `
    ${routeFilterGroup("Character", "theme", state.routeTheme, themeKeys, (key) => routeFilterCount(records, "theme", key))}
    ${routeFilterGroup("Celebration", "celebration", state.routeCelebration, celebrationKeys, (key) => routeFilterCount(records, "celebration", key))}
  `;
  els.routeQuickFilters.querySelectorAll("[data-route-filter-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.routeFilterType;
      if (type === "theme") state.routeTheme = button.dataset.routeFilterValue;
      if (type === "celebration") state.routeCelebration = button.dataset.routeFilterValue;
      renderRoute();
    });
  });
}

function routeFilterGroup(title, type, active, keys, countForKey) {
  const allLabel = type === "theme" ? "All characters" : "All celebrations";
  return `
    <section class="route-filter-group">
      <div class="route-filter-title">${title}</div>
      <div class="route-filter-chips">
        <button class="route-filter-chip ${active === "all" ? "is-active" : ""}" data-route-filter-type="${type}" data-route-filter-value="all" type="button">
          <span>${allLabel}</span>
          <strong>${countForKey("all")}</strong>
        </button>
        ${keys.map((key) => `
          <button class="route-filter-chip ${active === key ? "is-active" : ""}" data-route-filter-type="${type}" data-route-filter-value="${escapeHtml(key)}" type="button">
            <span>${escapeHtml(labels[key] || key)}</span>
            <strong>${countForKey(key)}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function visibleKeys(records, pickKeys, preferredOrder) {
  const available = new Set(records.flatMap((record) => pickKeys(record) || []));
  return preferredOrder.filter((key) => available.has(key));
}

function routeFilterCount(records, type, key) {
  if (key === "all") return records.length;
  return records.filter((record) => type === "theme" ? record.families.includes(key) : record.events.includes(key)).length;
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
          Pixie Dusted
        </button>
      </div>
      ${routeCardPills("Character", record.families, "No character tagged")}
      ${routeCardPills("Celebration", record.events, "No celebration tagged")}
      ${routeCardPills("Door theme", record.doorThemes || [], "No door theme listed")}
    </article>
  `;
}

function routeCardPills(label, keys, emptyLabel) {
  return `
    <div class="route-card-pills">
      <strong>${escapeHtml(label)}:</strong>
      <div class="route-filter-chips">
        ${keys.length
          ? keys.map((key) => `<span class="route-filter-chip is-active"><span>${escapeHtml(labels[key] || key)}</span></span>`).join("")
          : `<span class="route-filter-chip"><span>${escapeHtml(emptyLabel)}</span></span>`}
      </div>
    </div>
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
  els.giftGrid.innerHTML = [
    `<button class="kit kit-filter ${state.family === "all" ? "is-active" : ""}" data-gift-family="all" type="button" style="--kit-color:var(--gifts-deep)">
      <p class="eyebrow">All categories</p>
      <div class="kit-count"><strong>${filteredRecordsByFamily("all").length}</strong><span>rooms</span></div>
    </button>`,
    ...state.data.giftKits.map((kit) => `
    <button class="kit kit-filter ${state.family === kit.key ? "is-active" : ""}" data-gift-family="${kit.key}" type="button" style="--kit-color:${kit.accent}">
      <p class="eyebrow">${kit.name}</p>
      <div class="kit-count"><strong>${kit.suggestedQuantity}</strong><span>rooms</span></div>
    </button>
  `),
  ].join("");

  els.giftGrid.querySelectorAll("[data-gift-family]").forEach((button) => {
    button.addEventListener("click", () => {
      state.family = button.dataset.giftFamily;
      els.familyFilter.value = state.family;
      render();
    });
  });

  els.packingList.innerHTML = records.length ? records.map(packingCard).join("") : `<div class="empty">No packing slips match the current filters.</div>`;

  els.boostersPanel.innerHTML = `
    <h3>Celebration boosters</h3>
    <p class="subtext">Pack these add-ons for rooms tagged with birthdays, anniversaries, first cruises, and other celebrations.</p>
    <ul>
      ${state.data.eventBoosters.filter((booster) => booster.count > 0).map((booster) => `<li><strong>${booster.name}:</strong> ${booster.count} rooms. ${booster.items.map(escapeHtml).join(", ")}.</li>`).join("")}
    </ul>
  `;
}

function filteredRecordsByFamily(familyKey) {
  return state.data.records
    .filter((record) => state.deck === "all" || String(record.deck) === state.deck)
    .filter((record) => familyKey === "all" || record.families.includes(familyKey))
    .filter((record) => state.section === "all" || roomLocation(record).section === state.section)
    .filter((record) => matchesQuery(record));
}

function packingCard(record) {
  const items = recommendedItems(record);
  const location = roomLocation(record);
  return `
    <article class="packing-card">
      <div>
        <div class="room">${record.room ? `Room ${record.room}` : "Room TBD"} <span class="subtext">Deck ${record.deck}</span></div>
        <div class="route-meta">${locationLine(location)}</div>
        <div class="badges">${badges([...record.families, ...record.events])}</div>
        <div class="item-chips">${items.map((item) => `<span class="item-chip">${escapeHtml(item)}</span>`).join("")}</div>
      </div>
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

function doorThemeCue(record) {
  return (record.doorThemes || []).length
    ? record.doorThemes.map((key) => labels[key] || key).join(", ")
    : "No door theme listed";
}

function renderEvents() {
  const records = filteredRecords();
  const eventKeys = visibleKeys(records, (record) => record.events, CELEBRATION_ORDER);
  if (state.event !== "all" && !eventKeys.includes(state.event)) {
    state.event = "all";
  }
  const eventRecords = eventKeys.map((key) => ({
    key,
    label: labels[key] || key,
    accent: eventAccent(key),
    records: records.filter((record) => record.events.includes(key)).sort(compareRoute),
  }));
  const visibleEventRecords = state.event === "all"
    ? eventRecords
    : eventRecords.filter((group) => group.key === state.event);
  const allEventRooms = uniqueRecords(eventRecords.flatMap((group) => group.records)).length;

  els.eventSummaryGrid.innerHTML = [
    `<button class="event-summary-card event-filter ${state.event === "all" ? "is-active" : ""}" data-event-filter="all" type="button" style="--event-accent:var(--events-blue)">
      <p class="eyebrow">All celebrations</p>
      <div class="kit-count"><strong>${allEventRooms}</strong><span>rooms</span></div>
    </button>`,
    ...eventRecords.map((group) => `
    <button class="event-summary-card event-filter ${state.event === group.key ? "is-active" : ""}" data-event-filter="${group.key}" type="button" style="--event-accent:${group.accent}">
      <p class="eyebrow">${escapeHtml(group.label)}</p>
      <div class="kit-count"><strong>${group.records.length}</strong><span>rooms</span></div>
    </button>
  `),
  ].join("");

  els.eventSummaryGrid.querySelectorAll("[data-event-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.event = button.dataset.eventFilter;
      renderEvents();
    });
  });

  els.eventLanes.innerHTML = visibleEventRecords.map((group) => `
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

function uniqueRecords(records) {
  return [...new Map(records.map((record) => [String(record.id), record])).values()];
}

function renderPhotos() {
  const photos = state.photos.slice().sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  const counts = countPhotosByStateroom(state.photos);
  els.photoStatus.textContent = photos.length
    ? `${photos.length} photo${photos.length === 1 ? "" : "s"} saved on this device. Limit: ${PHOTO_LIMIT_PER_PERSON} per stateroom.`
    : `Limit: ${PHOTO_LIMIT_PER_PERSON} photos per stateroom on this device.`;
  els.photoGallery.innerHTML = photos.length ? photos.map((photo) => `
    <article class="photo-card">
      <img src="${escapeHtml(photo.image)}" alt="${escapeHtml(photo.caption)}" loading="lazy" />
      <div>
        <div class="photo-card-head">
          <strong>Stateroom ${escapeHtml(photoStateroom(photo) || "Unknown")}</strong>
          <span>${counts[stateroomKey(photoStateroom(photo))] || 0}/${PHOTO_LIMIT_PER_PERSON}</span>
        </div>
        <p>${escapeHtml(photo.caption)}</p>
        <button class="ghost" data-delete-photo="${escapeHtml(photo.id)}" type="button">Remove</button>
      </div>
    </article>
  `).join("") : `<div class="empty">No photos uploaded on this device yet.</div>`;
}

async function addPhotoFromForm() {
  const room = normalizeStateroom(els.photoStateroomInput.value);
  const caption = els.photoCaptionInput.value.trim();
  const file = els.photoFileInput.files?.[0];
  if (!room || !caption || !file) return;
  if (!file.type.startsWith("image/")) {
    els.photoStatus.textContent = "Please choose an image file.";
    return;
  }
  if (!isKnownStateroom(room)) {
    els.photoStatus.textContent = `Stateroom ${room} is not in the current records. Please check the number.`;
    return;
  }

  const key = stateroomKey(room);
  const existing = state.photos.filter((photo) => stateroomKey(photoStateroom(photo)) === key).length;
  if (existing >= PHOTO_LIMIT_PER_PERSON) {
    els.photoStatus.textContent = `Stateroom ${room} already has ${PHOTO_LIMIT_PER_PERSON} photos on this device.`;
    return;
  }

  const image = await fileToDataUrl(file);
  const photo = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    room,
    caption,
    image,
    createdAt: Date.now(),
  };
  await savePhoto(photo);
  state.photos = await loadPhotos();
  els.photoForm.reset();
  els.photoStatus.textContent = `Added photo for stateroom ${room}.`;
  renderPhotos();
}

async function deletePhoto(id) {
  await removePhoto(id);
  state.photos = await loadPhotos();
  renderPhotos();
}

function countPhotosByStateroom(photos) {
  return photos.reduce((acc, photo) => {
    const key = stateroomKey(photoStateroom(photo));
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function photoStateroom(photo) {
  return normalizeStateroom(photo.room || photo.stateroom || photo.person);
}

function normalizeStateroom(value) {
  return String(value || "").replace(/\D/g, "");
}

function stateroomKey(value) {
  return normalizeStateroom(value);
}

function isKnownStateroom(room) {
  const key = stateroomKey(room);
  return state.data.records.some((record) => stateroomKey(record.room) === key);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Unable to read photo."));
    reader.readAsDataURL(file);
  });
}

function openPhotoDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Photo storage is unavailable in this browser."));
      return;
    }

    const request = indexedDB.open(PHOTO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        db.createObjectStore(PHOTO_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Unable to open photo storage."));
  });
}

async function withPhotoStore(mode, action) {
  const db = await openPhotoDb();
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      db.close();
      fn(value);
    };
    const transaction = db.transaction(PHOTO_STORE_NAME, mode);
    const store = transaction.objectStore(PHOTO_STORE_NAME);
    const request = action(store);
    request.onsuccess = () => finish(resolve, request.result);
    request.onerror = () => finish(reject, request.error || new Error("Photo storage request failed."));
    transaction.onerror = () => finish(reject, transaction.error || new Error("Photo storage transaction failed."));
    transaction.onabort = () => finish(reject, transaction.error || new Error("Photo storage transaction was cancelled."));
  });
}

async function loadPhotos() {
  try {
    return await withPhotoStore("readonly", (store) => store.getAll());
  } catch (error) {
    console.warn(error);
    return [];
  }
}

async function savePhoto(photo) {
  await withPhotoStore("readwrite", (store) => store.put(photo));
}

async function removePhoto(id) {
  await withPhotoStore("readwrite", (store) => store.delete(id));
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
    anniversary: "#FFEB94",
    first: "#0A64A5",
    castaway: "#8AC0E5",
    graduation: "#FFCA35",
  }[key] || "#8AC0E5";
}

async function renderShip3D() {
  els.ship3dStatus.innerHTML = `
    <h3>Loading 3D ship</h3>
    <p class="subtext">Building decks and rooms from the current filters.</p>
  `;
  ship3dModule ||= await import("./ship3d.js?v=adventure-ship-render-1");
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

function filteredRecords({ includeRouteFilters = false } = {}) {
  return state.data.records
    .filter((record) => state.deck === "all" || String(record.deck) === state.deck)
    .filter((record) => state.family === "all" || record.families.includes(state.family))
    .filter((record) => !includeRouteFilters || state.routeTheme === "all" || record.families.includes(state.routeTheme))
    .filter((record) => !includeRouteFilters || state.routeCelebration === "all" || record.events.includes(state.routeCelebration))
    .filter((record) => state.section === "all" || roomLocation(record).section === state.section)
    .filter((record) => matchesQuery(record))
    .sort(compareRoute);
}

function matchesQuery(record) {
  if (!state.query) return true;
  const location = roomLocation(record);
  const safeTags = [...record.families, ...(record.doorThemes || []), ...record.events].map((key) => labels[key] || key);
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
  const override = ROOM_LOCATION_OVERRIDES[rawRoom] || {};
  const zone = Number(override.zone || match[2]);
  const roomSuffix = Number(match[3]);
  return {
    deck: Number(match[1]),
    zone,
    roomSuffix,
    section: override.section || sectionForZone(Number(record.deck || match[1]), zone),
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

function readJson(key, fallback) {
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(key) || "{}") };
  } catch {
    return { ...fallback };
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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
