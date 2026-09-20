const $ = id => document.getElementById(id);

const COLS = 8;
const ROWS = 5;
const TOTAL_TILES = COLS * ROWS;

let language = "en";
let optionsReturnScreen = "title";
let lastFrameTime = performance.now();

const buildings = {
  house: {
    cost: 100,
    population: 5,
    pollution: 2,
    happiness: 4,
    income: 15,
    asset: "randomHouse"
  },

  tree: {
    cost: 75,
    population: 0,
    pollution: -5,
    happiness: 10,
    income: 0,
    asset: "tree.png"
  },

  factory: {
    cost: 300,
    population: 2,
    pollution: 15,
    happiness: -5,
    income: 40,
    asset: "factory.png"
  },

  solar: {
    cost: 250,
    population: 1,
    pollution: -10,
    happiness: 8,
    income: 20,
    asset: "solar.png"
  },

  road: {
    cost: 50,
    population: 0,
    pollution: 0,
    happiness: 0,
    income: 0,
    asset: "road.png"
  }
};

const translations = {
  en: {
    startSubtitle: "town building simulator",
    startDescription: "build a sustainable city while keeping pollution under control.",
    start: "start",
    options: "options",
    back: "back",
    restart: "restart",

    language: "language",
    theme: "theme",
    light: "light",
    dark: "dark",

    statsTitle: "city stats",
    money: "money",
    population: "population",
    income: "income",
    pollution: "pollution",
    happiness: "happiness",
    turn: "turn",

    objectiveTitle: "objective",
    objective: "reach 50 population while keeping pollution at 20 or below.",

    controlsTitle: "controls",
    controlSelect: "click a building, then click a tile",
    controlRotate: "r rotate",
    controlErase: "e erase mode",
    controlShortcuts: "1-5 select buildings",

    buildTitle: "build",
    house: "house",
    tree: "tree",
    factory: "factory",
    solar: "solar",
    road: "road",
    erase: "erase",

    nextTurn: "next turn",

    buildMessage: "build your city.",
    built: "building placed.",
    erased: "building removed.",
    noMoney: "not enough money.",
    selected: "selected.",
    pollutionWarning: "pollution is getting dangerously high.",
    win: "city objective reached.",
    winSubtitle: "your city reached the environmental objective.",

    finalMoney: "money",
    finalPopulation: "population",
    finalIncome: "income / turn",
    finalPollution: "pollution",
    finalHappiness: "happiness",
    finalTurns: "turns",
    finalObjective: "population ≥ 50 · pollution ≤ 20"
  },

  id: {
    startSubtitle: "simulator pembangunan kota",
    startDescription: "bangun kota berkelanjutan sambil menjaga polusi tetap terkendali.",
    start: "mulai",
    options: "opsi",
    back: "kembali",
    restart: "mulai ulang",

    language: "bahasa",
    theme: "tema",
    light: "terang",
    dark: "gelap",

    statsTitle: "statistik kota",
    money: "uang",
    population: "populasi",
    income: "pendapatan",
    pollution: "polusi",
    happiness: "kebahagiaan",
    turn: "giliran",

    objectiveTitle: "tujuan",
    objective: "capai populasi 50 sambil menjaga polusi di angka 20 atau lebih rendah.",

    controlsTitle: "kontrol",
    controlSelect: "klik bangunan, lalu klik sebuah petak",
    controlRotate: "r putar",
    controlErase: "e mode hapus",
    controlShortcuts: "1-5 pilih bangunan",

    buildTitle: "bangun",
    house: "rumah",
    tree: "pohon",
    factory: "pabrik",
    solar: "panel surya",
    road: "jalan",
    erase: "hapus",

    nextTurn: "giliran berikutnya",

    buildMessage: "bangun kotamu.",
    built: "bangunan ditempatkan.",
    erased: "bangunan dihapus.",
    noMoney: "uang tidak cukup.",
    selected: "dipilih.",
    pollutionWarning: "polusi mulai sangat tinggi.",
    win: "tujuan kota tercapai.",
    winSubtitle: "kotamu berhasil mencapai tujuan lingkungan.",

    finalMoney: "uang",
    finalPopulation: "populasi",
    finalIncome: "pendapatan / giliran",
    finalPollution: "polusi",
    finalHappiness: "kebahagiaan",
    finalTurns: "giliran",
    finalObjective: "populasi ≥ 50 · polusi ≤ 20"
  }
};


let state = {
  money: 1000,
  population: 0,
  income: 0,
  pollution: 0,
  happiness: 50,
  turn: 0,

  selected: null,
  erase: false,
  placementRotation: 0,

  tiles: Array(TOTAL_TILES).fill(null),
  terrain: Array(TOTAL_TILES).fill("grass"),

  cars: [],
  animationFrame: null
};


/* ==================== TRANSLATION ==================== */

function t(key) {
  return translations[language][key] || key;
}

function setText(id, key) {
  const element = $(id);
  if (element) {
    element.textContent = t(key);
  }
}

function applyLanguage() {
  document.documentElement.lang = language;

  setText("start-subtitle", "startSubtitle");
  setText("start-description", "startDescription");
  setText("start-btn", "start");
  setText("cover-options-btn", "options");

  setText("options-title", "options");
  setText("language-label", "language");
  setText("theme-label", "theme");
  setText("options-back", "back");

  setText("game-options-btn", "options");
  setText("restart-btn", "restart");

  setText("stats-title", "statsTitle");
  setText("money-label", "money");
  setText("population-label", "population");
  setText("income-label", "income");
  setText("pollution-label", "pollution");
  setText("happiness-label", "happiness");
  setText("turn-label", "turn");

  setText("objective-title", "objectiveTitle");
  setText("objective-text", "objective");

  setText("controls-title", "controlsTitle");
  setText("control-select", "controlSelect");
  setText("control-rotate", "controlRotate");
  setText("control-erase", "controlErase");
  setText("control-shortcuts", "controlShortcuts");

  setText("build-title", "buildTitle");

  setText("house-name", "house");
  setText("tree-name", "tree");
  setText("factory-name", "factory");
  setText("solar-name", "solar");
  setText("road-name", "road");

  setText("erase-btn", "erase");
  setText("next-turn-btn", "nextTurn");

  setText("win-title", "win");
  setText("win-subtitle", "winSubtitle");

  setText("final-money-label", "finalMoney");
  setText("final-population-label", "finalPopulation");
  setText("final-income-label", "finalIncome");
  setText("final-pollution-label", "finalPollution");
  setText("final-happiness-label", "finalHappiness");
  setText("final-turns-label", "finalTurns");
  setText("final-objective", "finalObjective");
  setText("win-restart-btn", "restart");

  updateStats();

  if (!state.selected && !state.erase) {
    $("message").textContent = t("buildMessage");
  }
}


/* ==================== THEME ==================== */

function applyTheme() {
  const theme = $("theme-select").value;

  document.body.classList.toggle(
    "dark",
    theme === "dark"
  );
}


/* ==================== SCREENS ==================== */

function showScreen(screen) {
  const screens = {
    title: "title-screen",
    options: "options-screen",
    game: "game-screen",
    win: "win-screen"
  };

  Object.entries(screens).forEach(([name, id]) => {
    $(id).classList.toggle(
      "is-hidden",
      name !== screen
    );
  });
}


/* ==================== TERRAIN ==================== */

function generateTerrain() {
  const terrain = Array(TOTAL_TILES).fill("grass");

  const waterCount = Math.floor(
    TOTAL_TILES * 0.23
  );

  const indexes = [...Array(TOTAL_TILES).keys()];

  for (
    let i = indexes.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] =
      [indexes[j], indexes[i]];
  }

  for (let i = 0; i < waterCount; i++) {
    terrain[indexes[i]] = "water";
  }

  let grassCount = terrain.filter(
    t => t === "grass"
  ).length;

  while (grassCount < 24) {
    const waterIndexes = terrain
      .map((value, index) =>
        value === "water" ? index : -1
      )
      .filter(index => index !== -1);

    if (!waterIndexes.length) break;

    const index =
      waterIndexes[
        Math.floor(
          Math.random() *
          waterIndexes.length
        )
      ];

    terrain[index] = "grass";
    grassCount++;
  }

  return terrain;
}


/* ==================== BUILDING ASSETS ==================== */

function getBuildingAsset(type) {
  if (type === "house") {
    const houseNumber =
      Math.floor(Math.random() * 5) + 1;

    return `house${houseNumber}.png`;
  }

  return buildings[type].asset;
}


/* ==================== GRID ==================== */

function renderGrid() {
  const grid = $("city-grid");

  grid.innerHTML = "";

  state.tiles.forEach((building, index) => {
    const tile = document.createElement("div");

    tile.className = "tile";
    tile.dataset.index = index;

    const terrainImage =
      document.createElement("img");

    terrainImage.className =
      "terrain-image";

    terrainImage.src =
      `assets/${state.terrain[index]}.png`;

    terrainImage.alt =
      state.terrain[index];

    tile.appendChild(terrainImage);


    if (building) {
      const buildingImage =
        document.createElement("img");

      buildingImage.src =
        `assets/${building.asset}`;

      buildingImage.alt = building.type;

      if (building.type === "road") {
        buildingImage.className =
          "road-image";

        buildingImage.style.transform =
          `rotate(${building.rotation}deg)`;
      } else {
        buildingImage.className =
          "building-image";

        buildingImage.style.transform =
          `translate(-50%, -50%) rotate(${building.rotation}deg)`;
      }

      tile.appendChild(buildingImage);
    }

    tile.addEventListener(
      "click",
      () => handleTileClick(index)
    );

    grid.appendChild(tile);
  });

  renderCars();
}


/* ==================== TILE ACTION ==================== */

function handleTileClick(index) {

  if (state.erase) {
    eraseBuilding(index);
    return;
  }

  if (!state.selected) {
    $("message").textContent =
      t("buildMessage");

    return;
  }

  if (state.tiles[index]) {
    return;
  }

  const type = state.selected;
  const building = buildings[type];

  if (state.money < building.cost) {
    $("message").textContent =
      t("noMoney");

    return;
  }

  state.money -= building.cost;

  state.population +=
    building.population;

  state.pollution +=
    building.pollution;

  state.happiness +=
    building.happiness;

  state.income +=
    building.income;

  state.happiness =
    Math.max(
      0,
      Math.min(
        100,
        state.happiness
      )
    );

  state.tiles[index] = {
    type,
    asset: getBuildingAsset(type),
    rotation: state.placementRotation
  };

  renderGrid();
  updateStats();
  updateCars();

  if (checkWin()) {
    return;
  }

  if (state.pollution >= 100) {
    $("message").textContent =
      t("pollutionWarning");
  } else {
    $("message").textContent =
      t("built");
  }
}


/* ==================== ERASE ==================== */

function eraseBuilding(index) {
  const building = state.tiles[index];

  if (!building) {
    return;
  }

  const data = buildings[building.type];

  state.money +=
    Math.floor(data.cost * 0.5);

  state.population -=
    data.population;

  state.pollution -=
    data.pollution;

  state.happiness -=
    data.happiness;

  state.income -=
    data.income;

  state.population =
    Math.max(0, state.population);

  state.pollution =
    Math.max(0, state.pollution);

  state.income =
    Math.max(0, state.income);

  state.happiness =
    Math.max(
      0,
      Math.min(
        100,
        state.happiness
      )
    );

  state.tiles[index] = null;

  renderGrid();
  updateStats();
  updateCars();

  $("message").textContent =
    t("erased");
}


/* ==================== STATS ==================== */

function updateStats() {
  $("money").textContent =
    moneyFormat(state.money);

  $("population").textContent =
    state.population;

  $("income").textContent =
    moneyFormat(state.income);

  $("pollution").textContent =
    state.pollution;

  $("happiness").textContent =
    state.happiness;

  $("turn").textContent =
    state.turn;


  $("money-fill").style.width =
    `${Math.min(
      100,
      Math.max(0, state.money / 20)
    )}%`;

  $("population-fill").style.width =
    `${Math.min(
      100,
      state.population * 2
    )}%`;

  $("income-fill").style.width =
    `${Math.min(
      100,
      state.income
    )}%`;

  $("pollution-fill").style.width =
    `${Math.min(
      100,
      state.pollution
    )}%`;

  $("happiness-fill").style.width =
    `${state.happiness}%`;
}

function moneyFormat(value) {
  return `$${Math.max(
    0,
    Math.floor(value)
  ).toLocaleString("en-US")}`;
}


/* ==================== NEXT TURN ==================== */

function nextTurn() {
  state.turn++;

  state.money += state.income;

  const pollutionPenalty =
    Math.floor(
      state.pollution / 12
    );

  state.happiness -=
    pollutionPenalty;

  state.happiness =
    Math.max(
      0,
      Math.min(
        100,
        state.happiness
      )
    );

  updateStats();
  updateCars();

  if (checkWin()) {
    return;
  }

  if (state.pollution >= 100) {
    $("message").textContent =
      t("pollutionWarning");
  } else {
    $("message").textContent =
      t("buildMessage");
  }
}


/* ==================== WIN ==================== */

function checkWin() {
  if (
    state.population >= 50 &&
    state.pollution <= 20
  ) {
    showWinScreen();
    return true;
  }

  return false;
}

function showWinScreen() {
  if (state.animationFrame) {
    cancelAnimationFrame(
      state.animationFrame
    );

    state.animationFrame = null;
  }

  $("final-money").textContent =
    moneyFormat(state.money);

  $("final-population").textContent =
    state.population;

  $("final-income").textContent =
    moneyFormat(state.income);

  $("final-pollution").textContent =
    state.pollution;

  $("final-happiness").textContent =
    state.happiness;

  $("final-turns").textContent =
    state.turn;

  showScreen("win");
}


/* ==================== BUILD SELECTION ==================== */

function selectBuilding(type) {
  state.selected = type;
  state.erase = false;

  document
    .querySelectorAll(".build-item")
    .forEach(button => {
      button.classList.toggle(
        "selected",
        button.dataset.building === type
      );
    });

  $("erase-btn").classList.remove(
    "selected"
  );

  $("message").textContent =
    `${t(type)} ${t("selected")}`;
}

function toggleErase() {
  state.erase = !state.erase;

  state.selected = null;

  document
    .querySelectorAll(".build-item")
    .forEach(button => {
      button.classList.remove("selected");
    });

  $("erase-btn").classList.toggle(
    "selected",
    state.erase
  );

  $("message").textContent =
    state.erase
      ? `${t("erase")} ${t("selected")}`
      : t("buildMessage");
}


/* ==================== ROTATION ==================== */

function rotateSelected() {
  if (
    !state.selected &&
    !state.erase
  ) {
    return;
  }

  state.placementRotation =
    (state.placementRotation + 90) % 360;

  $("message").textContent =
    `${t("selected")} ${state.placementRotation}°`;
}


/* ==================== CARS ==================== */

function isRoad(index) {
  return (
    index >= 0 &&
    index < TOTAL_TILES &&
    state.tiles[index] &&
    state.tiles[index].type === "road"
  );
}

function getNeighbors(index) {
  const row =
    Math.floor(index / COLS);

  const col =
    index % COLS;

  const neighbors = [];

  if (col > 0) {
    neighbors.push({
      index: index - 1,
      direction: "left"
    });
  }

  if (col < COLS - 1) {
    neighbors.push({
      index: index + 1,
      direction: "right"
    });
  }

  if (row > 0) {
    neighbors.push({
      index: index - COLS,
      direction: "up"
    });
  }

  if (row < ROWS - 1) {
    neighbors.push({
      index: index + COLS,
      direction: "down"
    });
  }

  return neighbors;
}

function findRoadPath(start, end) {
  const queue = [start];
  const cameFrom = new Map();

  cameFrom.set(start, null);

  while (queue.length) {
    const current = queue.shift();

    if (current === end) {
      break;
    }

    for (const neighbor of getNeighbors(current)) {
      if (
        !isRoad(neighbor.index) ||
        cameFrom.has(neighbor.index)
      ) {
        continue;
      }

      cameFrom.set(
        neighbor.index,
        current
      );

      queue.push(neighbor.index);
    }
  }

  if (!cameFrom.has(end)) {
    return null;
  }

  const path = [];
  let current = end;

  while (current !== null) {
    path.unshift(current);
    current =
      cameFrom.get(current);
  }

  return path;
}

function createCar() {
  const roads = [];

  state.tiles.forEach(
    (tile, index) => {
      if (
        tile &&
        tile.type === "road"
      ) {
        roads.push(index);
      }
    }
  );

  if (roads.length < 2) {
    return null;
  }

  const start =
    roads[
      Math.floor(
        Math.random() * roads.length
      )
    ];

  let end =
    roads[
      Math.floor(
        Math.random() * roads.length
      )
    ];

  let attempts = 0;

  while (
    end === start &&
    attempts < 20
  ) {
    end =
      roads[
        Math.floor(
          Math.random() * roads.length
        )
      ];

    attempts++;
  }

  const path =
    findRoadPath(start, end);

  if (!path || path.length < 2) {
    return null;
  }

  const carNumber =
    Math.floor(
      Math.random() * 5
    ) + 1;

  return {
    path,
    progress: 0,
    speed:
      0.00012 +
      Math.random() * 0.00006,
    asset:
      `car${carNumber}.png`
  };
}

function updateCars() {
  const desired =
    state.population > 0
      ? Math.min(
          8,
          Math.floor(
            state.population / 5
          )
        )
      : 0;

  if (desired === 0) {
    state.cars = [];
    return;
  }

  state.cars =
    state.cars.filter(car =>
      car.path.every(isRoad)
    );

  while (
    state.cars.length < desired
  ) {
    const car = createCar();

    if (!car) break;

    state.cars.push(car);
  }

  if (state.cars.length > desired) {
    state.cars.length = desired;
  }

  startCarAnimation();
}

function getCarPosition(car) {
  const maxSegment =
    car.path.length - 1;

  const segment =
    Math.min(
      Math.floor(car.progress),
      maxSegment - 1
    );

  const local =
    car.progress - segment;

  const a =
    car.path[segment];

  const b =
    car.path[segment + 1];

  const ar =
    Math.floor(a / COLS);

  const ac =
    a % COLS;

  const br =
    Math.floor(b / COLS);

  const bc =
    b % COLS;

  let x =
    (ac + 0.5) / COLS;

  let y =
    (ar + 0.5) / ROWS;

  let rotation = 0;

  if (bc > ac) {
    x =
      ((ac + 0.5 + local) / COLS);

    y -=
      0.16 / ROWS;

    rotation = 0;
  } else if (bc < ac) {
    x =
      ((ac + 0.5 - local) / COLS);

    y +=
      0.16 / ROWS;

    rotation = 180;
  } else if (br > ar) {
    y =
      ((ar + 0.5 + local) / ROWS);

    x +=
      0.16 / COLS;

    rotation = 90;
  } else {
    y =
      ((ar + 0.5 - local) / ROWS);

    x -=
      0.16 / COLS;

    rotation = -90;
  }

  return {
    x,
    y,
    rotation
  };
}

function renderCars() {
  document
    .querySelectorAll(".car")
    .forEach(car =>
      car.remove()
    );

  const grid =
    $("city-grid");

  state.cars.forEach(car => {
    if (
      car.path.length < 2
    ) {
      return;
    }

    const position =
      getCarPosition(car);

    const image =
      document.createElement("img");

    image.className = "car";
    image.src =
      `assets/${car.asset}`;

    image.style.left =
      `${position.x * 100}%`;

    image.style.top =
      `${position.y * 100}%`;

    image.style.transform =
      `translate(-50%, -50%) rotate(${position.rotation}deg)`;

    grid.appendChild(image);
  });
}

function animateCars(now) {
  if (
    document
      .getElementById("game-screen")
      .classList.contains("is-hidden")
  ) {
    state.animationFrame = null;
    return;
  }

  const delta =
    Math.min(
      40,
      now - lastFrameTime
    );

  lastFrameTime = now;

  state.cars.forEach(car => {
    car.progress +=
      car.speed * delta;

    if (
      car.progress >=
      car.path.length - 1
    ) {
      car.progress = 0;
    }
  });

  renderCars();

  state.animationFrame =
    requestAnimationFrame(
      animateCars
    );
}

function startCarAnimation() {
  if (state.animationFrame) {
    return;
  }

  lastFrameTime =
    performance.now();

  state.animationFrame =
    requestAnimationFrame(
      animateCars
    );
}


/* ==================== RESTART ==================== */

function restartGame() {
  if (state.animationFrame) {
    cancelAnimationFrame(
      state.animationFrame
    );

    state.animationFrame = null;
  }

  state = {
    money: 1000,
    population: 0,
    income: 0,
    pollution: 0,
    happiness: 50,
    turn: 0,

    selected: null,
    erase: false,
    placementRotation: 0,

    tiles:
      Array(TOTAL_TILES).fill(null),

    terrain:
      generateTerrain(),

    cars: [],
    animationFrame: null
  };

  document
    .querySelectorAll(".build-item")
    .forEach(button =>
      button.classList.remove(
        "selected"
      )
    );

  $("erase-btn").classList.remove(
    "selected"
  );

  showScreen("game");

  $("message").textContent =
    t("buildMessage");

  renderGrid();
  updateStats();
}


/* ==================== EVENT LISTENERS ==================== */

$("start-btn").addEventListener(
  "click",
  () => {
    restartGame();
  }
);

$("cover-options-btn")
  .addEventListener(
    "click",
    () => {
      optionsReturnScreen =
        "title";

      showScreen("options");
    }
  );

$("game-options-btn")
  .addEventListener(
    "click",
    () => {
      optionsReturnScreen =
        "game";

      showScreen("options");
    }
  );

$("options-back")
  .addEventListener(
    "click",
    () => {
      showScreen(
        optionsReturnScreen
      );
    }
  );

$("language-select")
  .addEventListener(
    "change",
    event => {
      language =
        event.target.value;

      applyLanguage();
    }
  );

$("theme-select")
  .addEventListener(
    "change",
    () => {
      applyTheme();
    }
  );

$("next-turn-btn")
  .addEventListener(
    "click",
    nextTurn
  );

$("restart-btn")
  .addEventListener(
    "click",
    restartGame
  );

$("win-restart-btn")
  .addEventListener(
    "click",
    restartGame
  );

document
  .querySelectorAll(".build-item")
  .forEach(button => {
    button.addEventListener(
      "click",
      () => {
        selectBuilding(
          button.dataset.building
        );
      }
    );
  });

$("erase-btn")
  .addEventListener(
    "click",
    toggleErase
  );


/* ==================== KEYBOARD ==================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key.toLowerCase() === "r"
    ) {
      rotateSelected();
    }

    if (
      event.key.toLowerCase() === "e"
    ) {
      toggleErase();
    }

    const shortcuts = {
      "1": "house",
      "2": "tree",
      "3": "factory",
      "4": "solar",
      "5": "road"
    };

    if (
      shortcuts[event.key]
    ) {
      selectBuilding(
        shortcuts[event.key]
      );
    }
  }
);


/* ==================== START ==================== */

state.terrain =
  generateTerrain();

applyTheme();
applyLanguage();
renderGrid();
updateStats();
