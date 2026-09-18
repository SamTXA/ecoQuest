const COLS = 8;
const ROWS = 5;
const TOTAL_TILES = COLS * ROWS;

const buildings = {
  house: {
    cost: 100,
    population: 5,
    pollution: 2,
    happiness: 4,
    income: 15
  },

  tree: {
    cost: 75,
    population: 0,
    pollution: -5,
    happiness: 10,
    income: 0
  },

  factory: {
    cost: 300,
    population: 2,
    pollution: 15,
    happiness: -5,
    income: 40
  },

  solar: {
    cost: 250,
    population: 1,
    pollution: -10,
    happiness: 8,
    income: 20
  },

  road: {
    cost: 50,
    population: 0,
    pollution: 0,
    happiness: 0,
    income: 0
  }
};


/* =========================
   ASSETS
========================= */

const assets = {
  grass: "assets/grass.png",
  water: "assets/water.png",
  road: "assets/road.png",
  tree: "assets/tree.png",
  factory: "assets/factory.png",
  solar: "assets/solar.png",

  houses: [
    "assets/house1.png",
    "assets/house2.png",
    "assets/house3.png",
    "assets/house4.png",
    "assets/house5.png"
  ],

  cars: [
    "assets/car1.png",
    "assets/car2.png",
    "assets/car3.png",
    "assets/car4.png",
    "assets/car5.png"
  ]
};


/* =========================
   TRANSLATIONS
========================= */

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
      "reach 50 population while keeping pollution at 20 or below.",

    yourCity: "your city",

    cityHelp:
      "select a building, then click a tile.",

    nextTurn: "next turn",
    restart: "restart",

    build: "build",
    erase: "erase building",

    house: "house",
    tree: "tree",
    factory: "factory",
    solar: "solar plant",
    road: "road",

    houseInfo:
      "+5 population · +15 income",

    treeInfo:
      "−5 pollution · +10 happiness",

    factoryInfo:
      "+2 population · +40 income",

    solarInfo:
      "−10 pollution · +8 happiness",

    roadInfo:
      "connect your city",

    insufficient:
      "not enough money.",

    occupied:
      "this tile is already occupied.",

    water:
      "you cannot build on water.",

    empty:
      "this tile is empty.",

    built:
      "building placed.",

    erased:
      "building removed.",

    turnMessage:
      "your city has advanced one turn.",

    win:
      "city objective reached.",

    pollutionWarning:
      "pollution is getting dangerously high.",

    rotation:
      "rotation"
  },


  id: {
    description:
      "bangun kota, kelola lingkungan, dan jaga warga tetap bahagia.",

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
      "capai populasi 50 sambil menjaga polusi di angka 20 atau lebih rendah.",

    yourCity: "kotamu",

    cityHelp:
      "pilih bangunan, lalu klik petak.",

    nextTurn: "giliran berikutnya",
    restart: "mulai ulang",

    build: "bangun",
    erase: "hapus bangunan",

    house: "rumah",
    tree: "pohon",
    factory: "pabrik",
    solar: "pembangkit surya",
    road: "jalan",

    houseInfo:
      "+5 populasi · +15 pendapatan",

    treeInfo:
      "−5 polusi · +10 kebahagiaan",

    factoryInfo:
      "+2 populasi · +40 pendapatan",

    solarInfo:
      "−10 polusi · +8 kebahagiaan",

    roadInfo:
      "hubungkan kotamu",

    insufficient:
      "uang tidak cukup.",

    occupied:
      "petak ini sudah ditempati.",

    water:
      "kamu tidak bisa membangun di air.",

    empty:
      "petak ini kosong.",

    built:
      "bangunan ditempatkan.",

    erased:
      "bangunan dihapus.",

    turnMessage:
      "kotamu telah maju satu giliran.",

    win:
      "tujuan kota tercapai.",

    pollutionWarning:
      "polusi mulai terlalu tinggi.",

    rotation:
      "rotasi"
  }
};


let language = "en";
let theme = "light";


/* =========================
   GAME STATE
========================= */

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


/* =========================
   HELPERS
========================= */

function $(id) {
  return document.getElementById(id);
}


function t(key) {
  return translations[language][key] || key;
}


function money(value) {
  return "$" + Math.round(value).toLocaleString("en-US");
}


function randomItem(array) {
  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];
}


/* =========================
   TERRAIN GENERATION
========================= */

function generateTerrain() {

  state.terrain = [];

  for (let i = 0; i < TOTAL_TILES; i++) {

    const isWater =
      Math.random() < 0.23;

    state.terrain.push(
      isWater ? "water" : "grass"
    );
  }


  /*
    Make sure there is enough
    usable land.
  */

  let grassCount =
    state.terrain.filter(
      tile => tile === "grass"
    ).length;


  while (grassCount < 24) {

    const index =
      Math.floor(
        Math.random() * TOTAL_TILES
      );

    if (
      state.terrain[index] === "water"
    ) {

      state.terrain[index] = "grass";

      grassCount++;
    }
  }
}


/* =========================
   SCREENS
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

  $("theme-select").value =
    theme;
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

  renderGrid();
  updateStats();
}


/* =========================
   BUILDING SELECTION
========================= */

function selectBuilding(type) {

  state.selected = type;

  state.erase = false;

  state.placementRotation = 0;


  document
    .querySelectorAll(".build-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.building === type
      );

    });


  $("erase-btn")
    .classList.remove("active");


  updateMessage();
}


/* =========================
   ROTATION
========================= */

function rotateBuilding() {

  if (
    !state.selected ||
    state.erase
  ) {
    return;
  }


  state.placementRotation += 90;


  if (
    state.placementRotation >= 360
  ) {
    state.placementRotation = 0;
  }


  updateMessage();
}


/* =========================
   GRID RENDERING
========================= */

function renderGrid() {

  const grid =
    $("city-grid");

  grid.innerHTML = "";


  state.tiles.forEach(
    (tileData, index) => {

      const tile =
        document.createElement("button");

      tile.type = "button";

      tile.className = "tile";


      /*
        terrain
      */

      const terrainImage =
        document.createElement("img");

      terrainImage.className =
        "terrain-image";

      terrainImage.src =
        state.terrain[index] === "water"
          ? assets.water
          : assets.grass;

      terrainImage.alt =
        state.terrain[index];


      tile.appendChild(
        terrainImage
      );


      /*
        building
      */

      if (tileData) {

        const buildingImage =
          document.createElement("img");

        buildingImage.className =
          "building-image";


        if (
          tileData.type === "house"
        ) {

          buildingImage.src =
            tileData.image;

        } else {

          buildingImage.src =
            buildings[
              tileData.type
            ].image || assets[
              tileData.type
            ];
        }


        buildingImage.alt =
          tileData.type;


        buildingImage.style.transform =
          `translate(-50%, -50%) rotate(${tileData.rotation}deg)`;


        tile.appendChild(
          buildingImage
        );
      }


      /*
        click
      */

      tile.addEventListener(
        "click",
        () => handleTileClick(index)
      );


      grid.appendChild(tile);
    }
  );


  renderCars();
}


/* =========================
   PLACE BUILDING
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


  if (
    state.terrain[index] === "water"
  ) {

    $("message").textContent =
      t("water");

    return;
  }


  if (state.tiles[index]) {

    $("message").textContent =
      t("occupied");

    return;
  }


  const building =
    buildings[state.selected];


  if (
    state.money < building.cost
  ) {

    $("message").textContent =
      t("insufficient");

    return;
  }


  state.money -=
    building.cost;

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


  /*
    Random house variant
  */

  let image = null;


  if (
    state.selected === "house"
  ) {

    image =
      randomItem(
        assets.houses
      );
  }


  state.tiles[index] = {

    type: state.selected,

    rotation:
      state.placementRotation,

    image: image
  };


  renderGrid();

  updateStats();

  updateCars();


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
    Math.floor(
      building.cost * 0.5
    );

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


  state.tiles[index] =
    null;


  renderGrid();

  updateStats();

  updateCars();


  $("message").textContent =
    t("erased");
}


/* =========================
   ROAD NETWORK
========================= */

function isRoad(index) {

  return (
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


  if (row > 0) {

    const up =
      index - COLS;

    if (isRoad(up)) {
      neighbors.push(up);
    }
  }


  if (row < ROWS - 1) {

    const down =
      index + COLS;

    if (isRoad(down)) {
      neighbors.push(down);
    }
  }


  if (col > 0) {

    const left =
      index - 1;

    if (isRoad(left)) {
      neighbors.push(left);
    }
  }


  if (col < COLS - 1) {

    const right =
      index + 1;

    if (isRoad(right)) {
      neighbors.push(right);
    }
  }


  return neighbors;
}


/* =========================
   FIND ROAD PATH
========================= */

function findRoadPath(start, end) {

  const queue = [start];

  const previous = {};

  previous[start] = null;


  while (queue.length > 0) {

    const current =
      queue.shift();


    if (current === end) {
      break;
    }


    const neighbors =
      getNeighbors(current);


    neighbors.forEach(
      neighbor => {

        if (
          previous[neighbor] ===
          undefined
        ) {

          previous[neighbor] =
            current;

          queue.push(neighbor);
        }

      }
    );
  }


  if (
    previous[end] ===
    undefined
  ) {

    return [];
  }


  const path = [];

  let current = end;


  while (current !== null) {

    path.unshift(current);

    current =
      previous[current];
  }


  return path;
}


/* =========================
   CAR SYSTEM
========================= */

function getRoads() {

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


  return roads;
}


function getDesiredCarCount() {

  const roads =
    getRoads();


  if (
    state.population <= 0 ||
    roads.length < 2
  ) {

    return 0;
  }


  /*
    roughly one car per
    5 residents.
  */

  return Math.min(
    8,
    Math.max(
      1,
      Math.floor(
        state.population / 5
      )
    )
  );
}


function createCar() {

  const roads =
    getRoads();


  if (roads.length < 2) {
    return null;
  }


  const start =
    randomItem(roads);


  let end =
    randomItem(roads);


  let attempts = 0;


  while (
    end === start &&
    attempts < 20
  ) {

    end =
      randomItem(roads);

    attempts++;
  }


  const path =
    findRoadPath(
      start,
      end
    );


  if (path.length < 2) {
    return null;
  }


  return {

    path: path,

    segment: 0,

    progress:
      Math.random(),

    speed:
      0.000035 +
      Math.random() * 0.00002,

    lane:
      Math.random() < 0.5
        ? -1
        : 1,

    image:
      randomItem(
        assets.cars
      )
  };
}


function updateCars() {

  const desired =
    getDesiredCarCount();


  while (
    state.cars.length <
    desired
  ) {

    const car =
      createCar();


    if (!car) {
      break;
    }


    state.cars.push(car);
  }


  while (
    state.cars.length >
    desired
  ) {

    state.cars.pop();
  }


  renderCars();
}


/* =========================
   CAR POSITION
========================= */

function getCarPosition(car) {

  if (
    car.path.length < 2
  ) {

    return null;
  }


  const current =
    car.path[car.segment];

  const next =
    car.path[
      car.segment + 1
    ];


  if (
    current === undefined ||
    next === undefined
  ) {

    return null;
  }


  const currentX =
    current % COLS;

  const currentY =
    Math.floor(
      current / COLS
    );


  const nextX =
    next % COLS;

  const nextY =
    Math.floor(
      next / COLS
    );


  let x =
    currentX +
    (
      nextX -
      currentX
    ) *
    car.progress;


  let y =
    currentY +
    (
      nextY -
      currentY
    ) *
    car.progress;


  /*
    Lane positioning.

    horizontal road:
      offset vertically

    vertical road:
      offset horizontally

    This keeps cars away
    from the exact center.
  */

  const dx =
    nextX - currentX;

  const dy =
    nextY - currentY;


  const laneOffset =
    0.16 * car.lane;


  if (dx !== 0) {
    y += laneOffset;
  }


  if (dy !== 0) {
    x += laneOffset;
  }


  return {
    x,
    y,
    dx,
    dy
  };
}


/* =========================
   CAR RENDERING
========================= */

function renderCars() {

  const grid =
    $("city-grid");


  document
    .querySelectorAll(".city-car")
    .forEach(
      car => car.remove()
    );


  state.cars.forEach(
    car => {

      const position =
        getCarPosition(car);


      if (!position) {
        return;
      }


      const image =
        document.createElement("img");


      image.src =
        car.image;

      image.alt =
        "car";

      image.className =
        "city-car";


      /*
        Position inside the
        8 x 5 grid.
      */

      image.style.left =
        (
          (position.x + 0.5) /
          COLS *
          100
        ) + "%";


      image.style.top =
        (
          (position.y + 0.5) /
          ROWS *
          100
        ) + "%";


      /*
        Cars are drawn pointing
        right in the source asset.

        Rotate depending on
        direction of travel.
      */

      let rotation = 0;


      if (
        position.dx > 0
      ) {

        rotation = 0;

      } else if (
        position.dx < 0
      ) {

        rotation = 180;

      } else if (
        position.dy > 0
      ) {

        rotation = 90;

      } else if (
        position.dy < 0
      ) {

        rotation = 270;
      }


      image.style.transform =
        `translate(-50%, -50%) rotate(${rotation}deg)`;


      grid.appendChild(image);
    }
  );
}


/* =========================
   CAR ANIMATION
========================= */

function animateCars() {

  state.cars.forEach(
    car => {

      car.progress +=
        car.speed;


      if (
        car.progress >= 1
      ) {

        car.progress = 0;

        car.segment++;


        /*
          reached the end
          of the route
        */

        if (
          car.segment >=
          car.path.length - 1
        ) {

          const replacement =
            createCar();


          if (replacement) {

            Object.assign(
              car,
              replacement
            );

          } else {

            car.segment = 0;
            car.progress = 0;
          }
        }
      }
    }
  );


  renderCars();


  state.animationFrame =
    requestAnimationFrame(
      animateCars
    );
}


/* =========================
   NEXT TURN
========================= */

function nextTurn() {

  state.turn++;

  state.money +=
    state.income;


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


  if (
    state.population >= 50 &&
    state.pollution <= 20
  ) {

    $("message").textContent =
      t("win");

    return;
  }


  if (
    state.pollution >= 100
  ) {

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
   RESTART / NEW CITY
========================= */

function restartGame() {

  if (
    state.animationFrame
  ) {

    cancelAnimationFrame(
      state.animationFrame
    );
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
      Array(TOTAL_TILES).fill("grass"),

    cars: [],

    animationFrame: null
  };


  generateTerrain();


  $("message").textContent = "";


  document
    .querySelectorAll(".build-item")
    .forEach(button =>
      button.classList.remove(
        "active"
      )
    );


  $("erase-btn")
    .classList.remove("active");


  renderGrid();

  updateStats();


  state.animationFrame =
    requestAnimationFrame(
      animateCars
    );
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


/* =========================
   ERASE
========================= */

$("erase-btn").addEventListener(
  "click",
  () => {

    state.erase =
      !state.erase;

    state.selected = null;

    state.placementRotation = 0;


    document
      .querySelectorAll(".build-item")
      .forEach(button =>
        button.classList.remove(
          "active"
        )
      );


    $("erase-btn")
      .classList.toggle(
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
   BUILDING BUTTONS
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
   LANGUAGE
========================= */

$("language-select").addEventListener(
  "change",
  event => {

    language =
      event.target.value;

    applyLanguage();
  }
);


/* =========================
   THEME
========================= */

$("theme-select").addEventListener(
  "change",
  event => {

    theme =
      event.target.value;

    applyTheme();
  }
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.target.tagName === "SELECT" ||
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {

      return;
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


    if (
      event.key.toLowerCase() === "r"
    ) {

      rotateBuilding();
    }


    if (
      event.key.toLowerCase() === "e"
    ) {

      $("erase-btn").click();
    }
  }
);


/* =========================
   INITIALIZE
========================= */

applyTheme();

applyLanguage();

showScreen("title");
