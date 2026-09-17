const buildings = {
  house: {
    cost: 100,
    population: 5,
    pollution: 2,
    happiness: 4,
    income: 15,
    image: "house.png"
  },

  tree: {
    cost: 75,
    population: 0,
    pollution: -5,
    happiness: 10,
    income: 0,
    image: "tree.png"
  },

  factory: {
    cost: 300,
    population: 2,
    pollution: 15,
    happiness: -5,
    income: 40,
    image: "factory.png"
  },

  solar: {
    cost: 250,
    population: 1,
    pollution: -10,
    happiness: 8,
    income: 20,
    image: "solar.png"
  },

  road: {
    cost: 50,
    population: 0,
    pollution: 0,
    happiness: 0,
    income: 0,
    image: "road.png"
  }
};

const translations = {
  en: {
    description:
      "build a city, manage its environment, and keep your citizens happy.",
    start: "start",
    options: "options",
    back: "‹ back",
    language: "language",
    languageHelp: "choose your language",
    appearance: "appearance",
    appearanceHelp: "choose light or dark mode",
    statistics: "city statistics",
    money: "money",
    population: "population",
    income: "income / turn",
    pollution: "pollution",
    happiness: "happiness",
    objective: "objective",
    objectiveText:
      "grow your city while keeping pollution under control.",
    yourCity: "your city",
    cityHelp: "select a building, then click a tile.",
    nextTurn: "next turn",
    restart: "restart",
    build: "build",
    erase: "erase building",

    house: "house",
    tree: "tree",
    factory: "factory",
    solar: "solar plant",
    road: "road",

    houseInfo: "+5 population · +15 income",
    treeInfo: "−5 pollution · +10 happiness",
    factoryInfo: "+2 population · +40 income",
    solarInfo: "−10 pollution · +8 happiness",
    roadInfo: "connect your city",

    insufficient: "not enough money.",
    occupied: "this tile is already occupied.",
    empty: "this tile is empty.",
    built: "building placed.",
    erased: "building removed.",
    turnMessage: "your city has advanced one turn.",
    win: "city objective reached.",
    pollutionWarning: "pollution is getting dangerously high.",
    rotation: "rotation"
  },

  id: {
    description:
      "bangun kota, kelola lingkungannya, dan jaga warga tetap bahagia.",
    start: "mulai",
    options: "pengaturan",
    back: "‹ kembali",
    language: "bahasa",
    languageHelp: "pilih bahasa",
    appearance: "tampilan",
    appearanceHelp: "pilih mode terang atau gelap",
    statistics: "statistik kota",
    money: "uang",
    population: "populasi",
    income: "pendapatan / giliran",
    pollution: "polusi",
    happiness: "kebahagiaan",
    objective: "tujuan",
    objectiveText:
      "kembangkan kotamu sambil menjaga polusi tetap terkendali.",
    yourCity: "kotamu",
    cityHelp: "pilih bangunan, lalu klik petak.",
    nextTurn: "giliran berikutnya",
    restart: "mulai ulang",
    build: "bangun",
    erase: "hapus bangunan",

    house: "rumah",
    tree: "pohon",
    factory: "pabrik",
    solar: "pembangkit surya",
    road: "jalan",

    houseInfo: "+5 populasi · +15 pendapatan",
    treeInfo: "−5 polusi · +10 kebahagiaan",
    factoryInfo: "+2 populasi · +40 pendapatan",
    solarInfo: "−10 polusi · +8 kebahagiaan",
    roadInfo: "hubungkan kotamu",

    insufficient: "uang tidak cukup.",
    occupied: "petak ini sudah ditempati.",
    empty: "petak ini kosong.",
    built: "bangunan ditempatkan.",
    erased: "bangunan dihapus.",
    turnMessage: "kotamu telah maju satu giliran.",
    win: "tujuan kota tercapai.",
    pollutionWarning: "polusi mulai terlalu tinggi.",
    rotation: "rotasi"
  }
};

let language = "en";
let theme = "light";

let state = {
  money: 1000,
  population: 0,
  income: 0,
  pollution: 0,
  happiness: 50,
  turn: 0,

  selected: null,
  erase: false,

  // rotation of the building currently selected
  placementRotation: 0,

  // 40 tiles
  tiles: Array(40).fill(null)
};

function $(id) {
  return document.getElementById(id);
}

function t(key) {
  return translations[language][key] || key;
}

function money(value) {
  return "$" + Math.round(value).toLocaleString("en-US");
}

/* =========================
   SCREEN MANAGEMENT
========================= */

function showScreen(screen) {
  $("title-screen").classList.toggle(
    "is-hidden",
    screen !== "title"
  );

  $("options-screen").classList.toggle(
    "is-hidden",
    screen !== "options"
  );

  $("game-screen").classList.toggle(
    "is-hidden",
    screen !== "game"
  );
}

/* =========================
   THEME
========================= */

function applyTheme() {
  document.body.classList.toggle(
    "dark",
    theme === "dark"
  );

  $("theme-select").value = theme;
}

/* =========================
   LANGUAGE
========================= */

function applyLanguage() {
  $("cover-description").textContent =
    t("description");

  $("language-label").textContent =
    t("language");

  $("language-help").textContent =
    t("languageHelp");

  $("theme-label").textContent =
    t("appearance");

  $("theme-help").textContent =
    t("appearanceHelp");

  $("options-title").textContent =
    t("options");

  $("options-back").textContent =
    t("back");

  $("start-btn").textContent =
    t("start");

  $("cover-options-btn").textContent =
    t("options");

  $("stats-title").textContent =
    t("statistics");

  $("money-label").textContent =
    t("money");

  $("population-label").textContent =
    t("population");

  $("income-label").textContent =
    t("income");

  $("pollution-label").textContent =
    t("pollution");

  $("happiness-label").textContent =
    t("happiness");

  $("objective-title").textContent =
    t("objective");

  $("objective-text").textContent =
    t("objectiveText");

  $("city-name").textContent =
    t("yourCity");

  $("city-help").textContent =
    t("cityHelp");

  $("next-turn-btn").textContent =
    t("nextTurn");

  $("restart-btn").textContent =
    t("restart");

  $("build-title").textContent =
    t("build");

  $("erase-btn").textContent =
    t("erase");

  $("house-name").textContent =
    t("house");

  $("tree-name").textContent =
    t("tree");

  $("factory-name").textContent =
    t("factory");

  $("solar-name").textContent =
    t("solar");

  $("road-name").textContent =
    t("road");

  $("house-info").textContent =
    t("houseInfo");

  $("tree-info").textContent =
    t("treeInfo");

  $("factory-info").textContent =
    t("factoryInfo");

  $("solar-info").textContent =
    t("solarInfo");

  $("road-info").textContent =
    t("roadInfo");

  $("language-select").value =
    language;

  renderGrid();
  updateStats();
}

/* =========================
   BUILDING SELECTION
========================= */

function selectBuilding(type) {
  state.selected = type;
  state.erase = false;

  // every new building starts at 0°
  state.placementRotation = 0;

  document
    .querySelectorAll(".build-item")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.building === type
      );
    });

  $("erase-btn").classList.remove("active");

  updateMessage();
  updateStats();
}

/* =========================
   ROTATION
========================= */

function rotateBuilding() {
  if (!state.selected || state.erase) {
    return;
  }

  state.placementRotation += 90;

  if (state.placementRotation >= 360) {
    state.placementRotation = 0;
  }

  updateMessage();
}

/* =========================
   GRID
========================= */

function renderGrid() {
  const grid = $("city-grid");

  grid.innerHTML = "";

  state.tiles.forEach((tileData, index) => {
    const tile = document.createElement("button");

    tile.className = "tile";
    tile.type = "button";

    if (tileData) {
      const image =
        document.createElement("img");

      image.src =
        buildings[tileData.type].image;

      image.alt =
        tileData.type;

      // APPLY ROTATION HERE
      image.style.transform =
        `rotate(${tileData.rotation}deg)`;

      tile.appendChild(image);

      if (tileData.type === "road") {
        tile.classList.add("road");
      }
    }

    tile.addEventListener(
      "click",
      () => handleTileClick(index)
    );

    grid.appendChild(tile);
  });
}

/* =========================
   TILE ACTION
========================= */

function handleTileClick(index) {
  if (state.erase) {
    eraseBuilding(index);
    return;
  }

  if (!state.selected) {
    $("message").textContent =
      t("cityHelp");

    return;
  }

  if (state.tiles[index]) {
    $("message").textContent =
      t("occupied");

    return;
  }

  const building =
    buildings[state.selected];

  if (state.money < building.cost) {
    $("message").textContent =
      t("insufficient");

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

  state.pollution =
    Math.max(
      0,
      state.pollution
    );

  // SAVE THE ROTATION WITH THE BUILDING
  state.tiles[index] = {
    type: state.selected,
    rotation: state.placementRotation
  };

  renderGrid();
  updateStats();

  $("message").textContent =
    t("built");
}

/* =========================
   ERASE
========================= */

function eraseBuilding(index) {
  const tile =
    state.tiles[index];

  if (!tile) {
    $("message").textContent =
      t("empty");

    return;
  }

  const building =
    buildings[tile.type];

  state.money +=
    Math.floor(building.cost * 0.5);

  state.population -=
    building.population;

  state.pollution -=
    building.pollution;

  state.happiness -=
    building.happiness;

  state.income -=
    building.income;

  state.population =
    Math.max(
      0,
      state.population
    );

  state.pollution =
    Math.max(
      0,
      state.pollution
    );

  state.happiness =
    Math.max(
      0,
      Math.min(
        100,
        state.happiness
      )
    );

  state.income =
    Math.max(
      0,
      state.income
    );

  state.tiles[index] = null;

  renderGrid();
  updateStats();

  $("message").textContent =
    t("erased");
}

/* =========================
   NEXT TURN
========================= */

function nextTurn() {
  state.turn++;

  state.money += state.income;

  // pollution slowly affects happiness
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

  if (
    state.population >= 50 &&
    state.pollution <= 20
  ) {
    $("message").textContent =
      t("win");

    return;
  }

  if (state.pollution >= 100) {
    $("message").textContent =
      t("pollutionWarning");

    return;
  }

  $("message").textContent =
    t("turnMessage");
}

/* =========================
   STATS
========================= */

function updateStats() {
  $("money").textContent =
    money(state.money);

  $("population").textContent =
    state.population;

  $("income").textContent =
    money(state.income);

  $("pollution").textContent =
    state.pollution;

  $("happiness").textContent =
    state.happiness;

  $("turn-label").textContent =
    `turn ${state.turn}`;

  // progress bars

  $("money-fill").style.width =
    Math.min(
      100,
      state.money / 20
    ) + "%";

  $("pollution-fill").style.width =
    Math.min(
      100,
      state.pollution
    ) + "%";

  $("happiness-fill").style.width =
    state.happiness + "%";

  document
    .querySelectorAll(".build-item")
    .forEach(button => {
      const type =
        button.dataset.building;

      button.classList.toggle(
        "disabled",
        state.money <
          buildings[type].cost
      );

      button.classList.toggle(
        "active",
        state.selected === type &&
        !state.erase
      );
    });
}

/* =========================
   MESSAGE
========================= */

function updateMessage() {
  if (!state.selected) {
    $("message").textContent = "";
    return;
  }

  const building =
    buildings[state.selected];

  $("message").textContent =
    `${t(state.selected)} · ${money(building.cost)} · ${t("rotation")}: ${state.placementRotation}°`;
}

/* =========================
   RESTART
========================= */

function restartGame() {
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

    tiles: Array(40).fill(null)
  };

  $("message").textContent = "";

  renderGrid();
  updateStats();

  document
    .querySelectorAll(".build-item")
    .forEach(button =>
      button.classList.remove("active")
    );

  $("erase-btn")
    .classList.remove("active");
}

/* =========================
   BUTTON EVENTS
========================= */

$("start-btn").addEventListener(
  "click",
  () => {
    restartGame();
    showScreen("game");
  }
);

$("cover-options-btn").addEventListener(
  "click",
  () => {
    showScreen("options");
  }
);

$("options-back").addEventListener(
  "click",
  () => {
    showScreen("title");
  }
);

$("game-options-btn").addEventListener(
  "click",
  () => {
    showScreen("options");
  }
);

$("restart-btn").addEventListener(
  "click",
  restartGame
);

$("next-turn-btn").addEventListener(
  "click",
  nextTurn
);

$("erase-btn").addEventListener(
  "click",
  () => {
    state.erase = !state.erase;
    state.selected = null;

    state.placementRotation = 0;

    document
      .querySelectorAll(".build-item")
      .forEach(button =>
        button.classList.remove("active")
      );

    $("erase-btn").classList.toggle(
      "active",
      state.erase
    );

    $("message").textContent =
      state.erase
        ? t("erase")
        : "";

    updateStats();
  }
);

/* =========================
   BUILD BUTTONS
========================= */

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

/* =========================
   SETTINGS
========================= */

$("language-select").addEventListener(
  "change",
  event => {
    language =
      event.target.value;

    applyLanguage();
  }
);

$("theme-select").addEventListener(
  "change",
  event => {
    theme =
      event.target.value;

    applyTheme();
  }
);

/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener(
  "keydown",
  event => {
    // don't activate shortcuts while using a select/input
    if (
      event.target.tagName === "SELECT" ||
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    // 1 = house
    if (event.key === "1") {
      selectBuilding("house");
    }

    // 2 = tree
    if (event.key === "2") {
      selectBuilding("tree");
    }

    // 3 = factory
    if (event.key === "3") {
      selectBuilding("factory");
    }

    // 4 = solar
    if (event.key === "4") {
      selectBuilding("solar");
    }

    // 5 = road
    if (event.key === "5") {
      selectBuilding("road");
    }

    // R = rotate 90°
    if (
      event.key.toLowerCase() === "r"
    ) {
      rotateBuilding();
    }

    // E = erase mode
    if (
      event.key.toLowerCase() === "e"
    ) {
      $("erase-btn").click();
    }
  }
);

/* =========================
   STARTUP
========================= */

applyTheme();
applyLanguage();
renderGrid();
updateStats();
showScreen("title");