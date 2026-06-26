const gamePanel = document.querySelector("#gamePanel");
const contextPanel = document.querySelector("#contextPanel");
const gameTitle = document.querySelector("#gameTitle");
const gameGenre = document.querySelector("#gameGenre");
const homeButton = document.querySelector("#homeButton");
const restartButton = document.querySelector("#restartButton");
const navItems = Array.from(document.querySelectorAll(".nav-item"));

const metricEls = {
  oneLabel: document.querySelector("#metricOneLabel"),
  oneValue: document.querySelector("#metricOneValue"),
  twoLabel: document.querySelector("#metricTwoLabel"),
  twoValue: document.querySelector("#metricTwoValue"),
  threeLabel: document.querySelector("#metricThreeLabel"),
  threeValue: document.querySelector("#metricThreeValue")
};

const catalog = [
  { id: "snake", title: "Snake Run", genre: "Arcade", bestKey: "gamehub.snake.best" },
  { id: "memory", title: "Memory Match", genre: "Puzzle", bestKey: "gamehub.memory.best" },
  { id: "poople", title: "Poople", genre: "Word", bestKey: "gamehub.poople.steps.best" },
  { id: "angle", title: "Guess the Angle", genre: "Precision", bestKey: "gamehub.angle.hotcold.best" },
  { id: "connect4", title: "Connect 4", genre: "Strategy", bestKey: "gamehub.connect4.best" },
  { id: "world", title: "World Countries", genre: "Geography", bestKey: "gamehub.world.best" },
  { id: "shape", title: "Country Shape", genre: "Geography", bestKey: "gamehub.shape.best" },
  { id: "tictactoe", title: "Tic Tac Toe", genre: "Strategy", bestKey: "gamehub.tictactoe.best" },
  { id: "target", title: "Reflex Grid", genre: "Reflex", bestKey: "gamehub.target.best" }
];

const renderers = {
  hub: renderHub,
  snake: renderSnake,
  memory: renderMemory,
  poople: renderPoople,
  angle: renderAngle,
  connect4: renderConnect4,
  world: renderWorld,
  shape: renderCountryShape,
  tictactoe: renderTicTacToe,
  target: renderTarget
};

const poopleTarget = "POOP";
const pooplePuzzles = [
  { start: "BOOK", path: ["BOOK", "COOK", "COOP", "POOP"] },
  { start: "FISH", path: ["FISH", "FIST", "LIST", "LOST", "LOOT", "LOOP", "POOP"] },
  { start: "GAME", path: ["GAME", "DAME", "DOME", "DOLE", "DOLL", "POLL", "POOL", "POOP"] },
  { start: "WARM", path: ["WARM", "WORM", "WORD", "WOOD", "FOOD", "FOOL", "POOL", "POOP"] },
  { start: "MOON", path: ["MOON", "LOON", "LOOP", "POOP"] },
  { start: "TUNE", path: ["TUNE", "TONE", "TOME", "DOME", "DOLE", "DOLL", "POLL", "POOL", "POOP"] },
  { start: "RACE", path: ["RACE", "RACK", "ROCK", "ROOK", "COOK", "COOP", "POOP"] },
  { start: "HARD", path: ["HARD", "WARD", "WORD", "WOOD", "FOOD", "FOOL", "POOL", "POOP"] },
  { start: "SOUL", path: ["SOUL", "FOUL", "FOOL", "POOL", "POOP"] },
  { start: "LIVE", path: ["LIVE", "LOVE", "DOVE", "DOLE", "DOLL", "POLL", "POOL", "POOP"] },
  { start: "SAND", path: ["SAND", "HAND", "HARD", "WARD", "WORD", "WOOD", "FOOD", "FOOL", "POOL", "POOP"] },
  { start: "MATH", path: ["MATH", "MATE", "MARE", "MORE", "PORE", "POLE", "POLL", "POOL", "POOP"] },
  { start: "BARN", path: ["BARN", "BORN", "BORE", "PORE", "POLE", "POLL", "POOL", "POOP"] },
  { start: "LAMP", path: ["LAMP", "LIMP", "LISP", "LIST", "LOST", "LOOT", "LOOP", "POOP"] },
  { start: "COLD", path: ["COLD", "CORD", "WORD", "WOOD", "FOOD", "FOOL", "POOL", "POOP"] },
  { start: "PEAR", path: ["PEAR", "BEAR", "BOAR", "BOOR", "POOR", "POOP"] },
  { start: "DIRT", path: ["DIRT", "DART", "DARN", "BARN", "BORN", "BORE", "PORE", "POLE", "POLL", "POOL", "POOP"] },
  { start: "MILK", path: ["MILK", "MILL", "PILL", "POLL", "POOL", "POOP"] },
  { start: "FIRE", path: ["FIRE", "FIRM", "FORM", "FOAM", "LOAM", "LOOM", "LOOP", "POOP"] },
  { start: "STAR", path: ["STAR", "SOAR", "BOAR", "BOOR", "POOR", "POOP"] },
  { start: "RAIN", path: ["RAIN", "PAIN", "PAIL", "PALL", "POLL", "POOL", "POOP"] },
  { start: "LUCK", path: ["LUCK", "LACK", "RACK", "ROCK", "ROOK", "COOK", "COOP", "POOP"] },
  { start: "HAND", path: ["HAND", "HARD", "WARD", "WORD", "WOOD", "FOOD", "FOOL", "POOL", "POOP"] },
  { start: "LEAF", path: ["LEAF", "LOAF", "LOAM", "LOOM", "LOOP", "POOP"] },
  { start: "WILD", path: ["WILD", "WILL", "PILL", "POLL", "POOL", "POOP"] },
  { start: "BELL", path: ["BELL", "BOLL", "POLL", "POOL", "POOP"] },
  { start: "TALL", path: ["TALL", "TOLL", "POLL", "POOL", "POOP"] },
  { start: "CATS", path: ["CATS", "COTS", "COPS", "COOS", "COOP", "POOP"] },
  { start: "PINE", path: ["PINE", "PONE", "PORE", "POLE", "POLL", "POOL", "POOP"] },
  { start: "DUCK", path: ["DUCK", "DOCK", "ROCK", "ROOK", "COOK", "COOP", "POOP"] }
];

const poopleExtraWords = [
  "BARE", "BARK", "BOLD", "BOLT", "BOOM", "BOON", "BOOT", "BOUT", "BOWL", "BROW",
  "CARD", "CARE", "CORK", "CORM", "CORN", "COWL", "DOLL", "DOOR", "DORM", "DOWN",
  "FALL", "FARM", "FAST", "FELL", "FELT", "FIST", "FOLD", "FORK", "FORT", "FOWL",
  "GOLD", "GOOD", "GOON", "GOOP", "HALL", "HOLD", "HOOD", "HOOK", "HOOP", "HOOT",
  "LAND", "LANE", "LAST", "LENT", "LILT", "LION", "LOAD", "LOAN", "LOCK", "LOGO",
  "LOOK", "LORE", "LOUD", "MALL", "MILD", "MOLD", "MOOD", "MOOR", "MORN", "NOON",
  "PARK", "PART", "PEEK", "PEEL", "PEEP", "PERT", "PINK", "PLAN", "PLOD", "PLOP",
  "PLOT", "POET", "POKE", "POMP", "POND", "PONY", "POUF", "POUR", "PROD", "PROW",
  "ROAD", "ROAM", "ROAR", "ROLL", "ROOM", "ROOT", "ROPE", "ROSE", "SOCK", "SOLO",
  "SORT", "SOUR", "TALK", "TELL", "TILL", "TOLD", "TOOL", "TOOT", "TORN", "WALL"
];

const poopleWords = new Set([
  poopleTarget,
  ...poopleExtraWords,
  ...pooplePuzzles.flatMap((puzzle) => puzzle.path)
]);

const worldCountryGroups = {
  Africa: [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
    "Central African Republic", "Chad", "Comoros", "Congo", "Democratic Republic of the Congo",
    "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia",
    "Ghana", "Guinea", "Guinea-Bissau", "Cote d'Ivoire", "Kenya", "Lesotho", "Liberia", "Libya",
    "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia",
    "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone",
    "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda",
    "Zambia", "Zimbabwe"
  ],
  Asia: [
    "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia",
    "China", "Cyprus", "East Timor", "Georgia", "India", "Indonesia", "Iran", "Iraq", "Israel",
    "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia",
    "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan", "Palestine",
    "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "Syria",
    "Taiwan", "Tajikistan", "Thailand", "Turkey", "Turkmenistan", "United Arab Emirates",
    "Uzbekistan", "Vietnam", "Yemen"
  ],
  Europe: [
    "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria",
    "Croatia", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
    "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania",
    "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia",
    "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia",
    "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"
  ],
  "North America": [
    "Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Canada", "Costa Rica", "Cuba",
    "Dominica", "Dominican Republic", "El Salvador", "Grenada", "Guatemala", "Haiti", "Honduras",
    "Jamaica", "Mexico", "Nicaragua", "Panama", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Trinidad and Tobago", "United States"
  ],
  "South America": [
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Paraguay", "Peru",
    "Suriname", "Uruguay", "Venezuela"
  ],
  Oceania: [
    "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "New Zealand",
    "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"
  ]
};

const worldAliases = {
  "Bahamas": ["The Bahamas"],
  "Bosnia and Herzegovina": ["Bosnia", "Bosnia Herzegovina"],
  "Cabo Verde": ["Cape Verde"],
  "Central African Republic": ["CAR", "Central African Rep"],
  "Congo": ["Republic of the Congo", "Congo Republic", "Congo-Brazzaville"],
  "Cote d'Ivoire": ["Ivory Coast", "Cote dIvoire"],
  "Czechia": ["Czech Republic"],
  "Democratic Republic of the Congo": ["DRC", "Congo DR", "Congo-Kinshasa", "Democratic Republic Congo"],
  "Dominican Republic": ["Dominican Rep"],
  "East Timor": ["Timor-Leste", "Timor Leste"],
  "Eswatini": ["Swaziland"],
  "Gambia": ["The Gambia"],
  "Guinea-Bissau": ["Guinea Bissau"],
  "Laos": ["Lao", "Lao PDR"],
  "Micronesia": ["Federated States of Micronesia"],
  "Myanmar": ["Burma"],
  "North Korea": ["DPRK"],
  "North Macedonia": ["Macedonia"],
  "Palestine": ["State of Palestine"],
  "Russia": ["Russian Federation"],
  "Saint Kitts and Nevis": ["St Kitts and Nevis", "Saint Kitts", "St Kitts"],
  "Saint Lucia": ["St Lucia"],
  "Saint Vincent and the Grenadines": ["St Vincent and the Grenadines", "Saint Vincent", "St Vincent"],
  "Sao Tome and Principe": ["Sao Tome", "Sao Tome Principe"],
  "South Korea": ["Republic of Korea", "Korea Republic", "ROK"],
  "Syria": ["Syrian Arab Republic"],
  "Tanzania": ["United Republic of Tanzania"],
  "Turkey": ["Turkiye"],
  "United Arab Emirates": ["UAE"],
  "United Kingdom": ["UK", "Great Britain", "Britain", "England"],
  "United States": ["United States of America", "USA", "US", "U.S.", "U.S.A.", "America"],
  "Vatican City": ["Vatican", "Holy See"],
  "Vietnam": ["Viet Nam"]
};

const worldCountries = Object.entries(worldCountryGroups).flatMap(([continent, countries]) => (
  countries.map((name) => ({ name, continent, aliases: worldAliases[name] || [] }))
));
const worldScopeAll = "World";
const worldScopeOptions = [worldScopeAll, ...Object.keys(worldCountryGroups)];
const worldAnswerMap = buildWorldAnswerMap();
const worldAnswerKeys = Array.from(worldAnswerMap.keys());
const worldMapCountries = Array.isArray(window.WORLD_MAP_COUNTRIES) ? window.WORLD_MAP_COUNTRIES : [];
const worldMapCountryByName = new Map(worldMapCountries.map((country) => [country.name, country]));
const shapeCountries = worldCountries.map((country) => {
  const mapCountry = worldMapCountryByName.get(country.name);
  if (!mapCountry || !mapCountry.path) {
    return null;
  }

  return {
    ...country,
    path: mapCountry.path,
    marker: mapCountry.marker,
    bounds: getPathBounds(mapCountry.path)
  };
}).filter((country) => country && country.bounds);

let currentGame = "hub";
let cleanupCurrent = null;

document.querySelector("#brandButton").addEventListener("click", () => loadGame("hub"));
homeButton.addEventListener("click", () => loadGame("hub"));
restartButton.addEventListener("click", () => loadGame(currentGame));

navItems.forEach((item) => {
  item.addEventListener("click", () => loadGame(item.dataset.game));
});

loadGame(initialGameFromLocation());

function initialGameFromLocation() {
  const hashGame = window.location.hash.replace(/^#/, "");
  const queryGame = new URLSearchParams(window.location.search).get("game") || "";
  if (renderers[hashGame]) {
    return hashGame;
  }
  if (renderers[queryGame]) {
    return queryGame;
  }
  return "hub";
}

function loadGame(id) {
  if (!renderers[id]) {
    return;
  }

  if (cleanupCurrent) {
    cleanupCurrent();
    cleanupCurrent = null;
  }

  currentGame = id;
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.game === id));
  homeButton.hidden = id === "hub";
  restartButton.hidden = id === "hub";
  renderers[id]();
}

function setHeader(title, genre) {
  gameTitle.textContent = title;
  gameGenre.textContent = genre;
}

function setMetrics(firstLabel, firstValue, secondLabel, secondValue, thirdLabel, thirdValue) {
  metricEls.oneLabel.textContent = firstLabel;
  metricEls.oneValue.textContent = firstValue;
  metricEls.twoLabel.textContent = secondLabel;
  metricEls.twoValue.textContent = secondValue;
  metricEls.threeLabel.textContent = thirdLabel;
  metricEls.threeValue.textContent = thirdValue;
}

function setContext(title, rows) {
  const rowMarkup = rows.map((row) => `
    <div class="stat-row">
      <span>${row.label}</span>
      <strong>${row.value}</strong>
    </div>
  `).join("");

  contextPanel.innerHTML = `
    <h2>${title}</h2>
    <div class="stat-list">${rowMarkup}</div>
  `;
}

function getBest(key, fallback = 0) {
  const stored = Number(localStorage.getItem(key));
  return Number.isFinite(stored) && stored > 0 ? stored : fallback;
}

function setBest(key, value, compare = "high") {
  const current = getBest(key);
  const shouldWrite = compare === "low"
    ? current === 0 || value < current
    : value > current;

  if (shouldWrite) {
    localStorage.setItem(key, String(value));
    return value;
  }

  return current;
}

function totalBest() {
  return catalog.reduce((sum, game) => sum + getBest(game.bestKey), 0);
}

function renderHub() {
  setHeader("GameHub", "Vanilla Arcade");
  setMetrics("Games", catalog.length, "Best Total", totalBest(), "State", "Ready");

  gamePanel.innerHTML = `
    <div class="hub-grid">
      ${catalog.map((game) => gameCardMarkup(game)).join("")}
    </div>
  `;

  gamePanel.querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => loadGame(button.dataset.play));
  });

  setContext("Best Board", catalog.map((game) => ({
    label: game.title,
    value: bestLabel(game.id)
  })));
}

function gameCardMarkup(game) {
  return `
    <article class="game-card">
      ${previewMarkup(game.id)}
      <div>
        <h2>${game.title}</h2>
        <p class="card-meta"><span>${game.genre}</span><span>${bestLabel(game.id)}</span></p>
      </div>
      <button class="play-button" type="button" data-play="${game.id}">Play</button>
    </article>
  `;
}

function previewMarkup(id) {
  if (id === "snake") {
    return '<div class="game-preview preview-snake" aria-hidden="true"></div>';
  }

  if (id === "memory") {
    return `
      <div class="game-preview preview-memory" aria-hidden="true">
        ${Array.from({ length: 16 }, () => "<span></span>").join("")}
      </div>
    `;
  }

  if (id === "poople") {
    const previewWords = ["BOOK", "COOK", "COOP", "POOP"];
    return `
      <div class="game-preview preview-poople" aria-hidden="true">
        ${previewWords.flatMap((word) => word.split("")).map((letter) => `<span>${letter}</span>`).join("")}
      </div>
    `;
  }

  if (id === "angle") {
    return '<div class="game-preview preview-angle" aria-hidden="true"><span></span></div>';
  }

  if (id === "connect4") {
    return `
      <div class="game-preview preview-connect" aria-hidden="true">
        ${Array.from({ length: 42 }, (_, index) => `<span class="${connectPreviewClass(index)}"></span>`).join("")}
      </div>
    `;
  }

  if (id === "world") {
    return `
      <div class="game-preview preview-world" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `;
  }

  if (id === "shape") {
    return '<div class="game-preview preview-shape" aria-hidden="true"><span></span></div>';
  }

  if (id === "tictactoe") {
    return `
      <div class="game-preview preview-ttt" aria-hidden="true">
        <span>X</span><span></span><span>O</span>
        <span></span><span>X</span><span></span>
        <span>O</span><span></span><span>X</span>
      </div>
    `;
  }

  return '<div class="game-preview preview-target" aria-hidden="true"></div>';
}

function connectPreviewClass(index) {
  const coral = new Set([35, 36, 37, 38]);
  const yellow = new Set([28, 29, 30, 31, 39, 40]);
  if (coral.has(index)) {
    return "is-coral";
  }
  if (yellow.has(index)) {
    return "is-yellow";
  }
  return "";
}

function bestLabel(id) {
  const game = catalog.find((item) => item.id === id);
  const best = getBest(game.bestKey);

  if (!best) {
    return "Best 0";
  }

  if (id === "memory") {
    return `Best ${best} moves`;
  }

  if (id === "poople") {
    return `Best ${best} steps`;
  }

  return `Best ${best}`;
}

function renderSnake() {
  const game = catalog.find((item) => item.id === "snake");
  const size = 18;
  const state = {
    snake: [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 13, y: 9 },
    score: 0,
    best: getBest(game.bestKey),
    alive: true
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="canvas-shell">
      <div class="snake-wrap">
        <canvas class="snake-canvas" id="snakeCanvas" width="540" height="540"></canvas>
        <div class="d-pad" aria-label="Snake controls">
          <span class="pad-button empty"></span>
          <button class="pad-button" type="button" data-dir="up" aria-label="Up"><span class="control-arrow up"></span></button>
          <span class="pad-button empty"></span>
          <button class="pad-button" type="button" data-dir="left" aria-label="Left"><span class="control-arrow left"></span></button>
          <span class="pad-button empty"></span>
          <button class="pad-button" type="button" data-dir="right" aria-label="Right"><span class="control-arrow right"></span></button>
          <span class="pad-button empty"></span>
          <button class="pad-button" type="button" data-dir="down" aria-label="Down"><span class="control-arrow down"></span></button>
          <span class="pad-button empty"></span>
        </div>
      </div>
    </div>
  `;

  const canvas = gamePanel.querySelector("#snakeCanvas");
  const ctx = canvas.getContext("2d");
  let timer = window.setInterval(tick, 120);

  gamePanel.querySelectorAll("[data-dir]").forEach((button) => {
    button.addEventListener("click", () => setSnakeDirection(button.dataset.dir, state));
  });

  const keyHandler = (event) => {
    const keyMap = {
      ArrowUp: "up",
      w: "up",
      W: "up",
      ArrowDown: "down",
      s: "down",
      S: "down",
      ArrowLeft: "left",
      a: "left",
      A: "left",
      ArrowRight: "right",
      d: "right",
      D: "right"
    };

    if (keyMap[event.key]) {
      event.preventDefault();
      setSnakeDirection(keyMap[event.key], state);
    }
  };

  window.addEventListener("keydown", keyHandler);
  updateSnakeStats(state);
  drawSnake(ctx, state, size);

  cleanupCurrent = () => {
    if (timer) {
      window.clearInterval(timer);
    }
    window.removeEventListener("keydown", keyHandler);
  };

  function tick() {
    state.direction = state.nextDirection;
    const head = state.snake[0];
    const nextHead = {
      x: head.x + state.direction.x,
      y: head.y + state.direction.y
    };

    const eatsFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
    const bodyToCheck = eatsFood ? state.snake : state.snake.slice(0, -1);
    const hitsWall = nextHead.x < 0 || nextHead.x >= size || nextHead.y < 0 || nextHead.y >= size;
    const hitsSelf = bodyToCheck.some((part) => part.x === nextHead.x && part.y === nextHead.y);

    if (hitsWall || hitsSelf) {
      state.alive = false;
      window.clearInterval(timer);
      timer = null;
      updateSnakeStats(state);
      drawSnake(ctx, state, size);
      return;
    }

    state.snake.unshift(nextHead);

    if (eatsFood) {
      state.score += 10;
      state.best = setBest(game.bestKey, state.score);
      state.food = nextFood(state.snake, size);
    } else {
      state.snake.pop();
    }

    updateSnakeStats(state);
    drawSnake(ctx, state, size);
  }
}

function setSnakeDirection(direction, state) {
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const next = directions[direction];
  if (!next) {
    return;
  }

  const reverse = next.x + state.direction.x === 0 && next.y + state.direction.y === 0;
  if (!reverse) {
    state.nextDirection = next;
  }
}

function updateSnakeStats(state) {
  setMetrics("Score", state.score, "Best", state.best, "Length", state.snake.length);
  setContext("Run Board", [
    { label: "Score", value: state.score },
    { label: "Best", value: state.best },
    { label: "State", value: state.alive ? "Live" : "Done" }
  ]);
}

function drawSnake(ctx, state, size) {
  const width = ctx.canvas.width;
  const cell = width / size;

  ctx.clearRect(0, 0, width, width);
  ctx.fillStyle = "#111418";
  ctx.fillRect(0, 0, width, width);

  ctx.strokeStyle = "rgba(255,255,255,0.055)";
  ctx.lineWidth = 1;
  for (let index = 0; index <= size; index += 1) {
    const pos = Math.round(index * cell) + 0.5;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, width);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(width, pos);
    ctx.stroke();
  }

  state.snake.forEach((part, index) => {
    const pad = index === 0 ? 4 : 6;
    ctx.fillStyle = index === 0 ? "#f4d35e" : "#00a676";
    roundedRect(ctx, part.x * cell + pad, part.y * cell + pad, cell - pad * 2, cell - pad * 2, 8);
    ctx.fill();
  });

  ctx.fillStyle = "#f25c54";
  ctx.beginPath();
  ctx.arc(state.food.x * cell + cell / 2, state.food.y * cell + cell / 2, cell * 0.28, 0, Math.PI * 2);
  ctx.fill();

  if (!state.alive) {
    ctx.fillStyle = "rgba(17, 20, 24, 0.72)";
    ctx.fillRect(0, 0, width, width);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 44px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Done", width / 2, width / 2);
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function nextFood(snake, size) {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size)
    };
  } while (snake.some((part) => part.x === food.x && part.y === food.y));
  return food;
}

function renderMemory() {
  const game = catalog.find((item) => item.id === "memory");
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const state = {
    deck: shuffle([...Array(8).keys(), ...Array(8).keys()]),
    flipped: [],
    matched: new Set(),
    moves: 0,
    locked: false,
    best: getBest(game.bestKey),
    done: false,
    active: true,
    pendingFlip: null
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="memory-shell">
      <div class="memory-board" id="memoryBoard"></div>
    </div>
  `;

  const board = gamePanel.querySelector("#memoryBoard");
  board.addEventListener("click", (event) => {
    const button = event.target.closest(".memory-card");
    if (!button) {
      return;
    }
    flipMemoryCard(Number(button.dataset.index), state, renderBoard, game.bestKey);
  });

  renderBoard();
  cleanupCurrent = () => {
    state.active = false;
    if (state.pendingFlip) {
      window.clearTimeout(state.pendingFlip);
    }
  };

  function renderBoard() {
    board.innerHTML = state.deck.map((value, index) => {
      const isOpen = state.flipped.includes(index);
      const isMatched = state.matched.has(index);
      return `
        <button class="memory-card ${isOpen ? "is-open" : ""} ${isMatched ? "is-matched" : ""}" type="button" data-index="${index}" aria-label="Card ${index + 1}">
          <span class="memory-face memory-back"></span>
          <span class="memory-face memory-front">
            <span class="memory-token token-${value}">${letters[value]}</span>
          </span>
        </button>
      `;
    }).join("");

    const pairs = state.matched.size / 2;
    setMetrics("Pairs", `${pairs}/8`, "Moves", state.moves, "Best", state.best || 0);
    setContext("Match Board", [
      { label: "Pairs", value: `${pairs}/8` },
      { label: "Moves", value: state.moves },
      { label: "State", value: state.done ? "Done" : "Live" }
    ]);
  }
}

function flipMemoryCard(index, state, renderBoard, bestKey) {
  if (!state.active || state.locked || state.done || state.flipped.includes(index) || state.matched.has(index)) {
    return;
  }

  state.flipped.push(index);
  renderBoard();

  if (state.flipped.length < 2) {
    return;
  }

  state.moves += 1;
  const [first, second] = state.flipped;
  if (state.deck[first] === state.deck[second]) {
    state.matched.add(first);
    state.matched.add(second);
    state.flipped = [];
    state.done = state.matched.size === state.deck.length;

    if (state.done) {
      state.best = setBest(bestKey, state.moves, "low");
    }

    renderBoard();
    return;
  }

  state.locked = true;
  renderBoard();
  state.pendingFlip = window.setTimeout(() => {
    if (!state.active) {
      return;
    }
    state.flipped = [];
    state.locked = false;
    state.pendingFlip = null;
    renderBoard();
  }, 520);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function renderPoople() {
  const game = catalog.find((item) => item.id === "poople");
  const puzzle = dailyPooplePuzzle();
  const state = {
    path: [puzzle.start],
    message: "Ready",
    hintCount: 0,
    best: getBest(game.bestKey),
    solved: puzzle.start === poopleTarget
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="poople-shell">
      <div class="poople-goal" aria-label="Poople target">
        <span>${puzzle.start}</span>
        <strong>${poopleTarget}</strong>
      </div>
      <div class="poople-ladder" id="poopleLadder" aria-label="Poople word ladder"></div>
      <form class="poople-form" id="poopleForm">
        <label class="sr-only" for="poopleInput">Next word</label>
        <input class="poople-input" id="poopleInput" name="poopleInput" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="WORD">
        <div class="poople-actions">
          <button class="play-button" type="submit">Enter</button>
          <button class="mode-button" id="poopleHintButton" type="button">Hint</button>
        </div>
      </form>
      <p class="poople-status" id="poopleStatus" aria-live="polite"></p>
    </div>
  `;

  const ladder = gamePanel.querySelector("#poopleLadder");
  const form = gamePanel.querySelector("#poopleForm");
  const input = gamePanel.querySelector("#poopleInput");
  const hintButton = gamePanel.querySelector("#poopleHintButton");
  const status = gamePanel.querySelector("#poopleStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.solved) {
      return;
    }

    const nextWord = cleanPoopleInput(input.value);
    const result = validatePoopleMove(currentPoopleWord(state), nextWord);
    state.message = result.message;

    if (result.valid) {
      state.path.push(nextWord);
      input.value = "";
      state.message = nextWord === poopleTarget ? "Solved" : "Accepted";

      if (nextWord === poopleTarget) {
        state.solved = true;
        state.best = setBest(game.bestKey, poopleSteps(state), "low");
      }
    }

    renderBoard();
  });

  input.addEventListener("input", () => {
    input.value = cleanPoopleInput(input.value);
  });

  hintButton.addEventListener("click", () => {
    if (state.solved) {
      return;
    }

    const hint = nextPoopleHint(currentPoopleWord(state));
    state.hintCount += 1;
    state.message = hint ? `Try ${hint}` : "No hint from here";
    renderBoard();
    input.focus();
  });

  renderBoard();
  input.focus();

  cleanupCurrent = null;

  function renderBoard() {
    ladder.innerHTML = state.path.map((word, index) => poopleRowMarkup(word, state.path[index - 1], index === 0)).join("");
    input.disabled = state.solved;
    hintButton.disabled = state.solved;
    status.textContent = state.message;

    setMetrics("Steps", poopleSteps(state), "Best", state.best || 0, "Current", currentPoopleWord(state));
    setContext("Poople Board", [
      { label: "Start", value: puzzle.start },
      { label: "Target", value: poopleTarget },
      { label: "Hints", value: state.hintCount },
      { label: "State", value: state.solved ? "Done" : "Live" }
    ]);
  }
}

function dailyPooplePuzzle() {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const dayIndex = Math.floor(today / 86400000);
  return pooplePuzzles[dayIndex % pooplePuzzles.length];
}

function currentPoopleWord(state) {
  return state.path[state.path.length - 1];
}

function poopleSteps(state) {
  return Math.max(0, state.path.length - 1);
}

function cleanPoopleInput(value) {
  return value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
}

function validatePoopleMove(current, nextWord) {
  if (nextWord.length !== 4) {
    return { valid: false, message: "Use 4 letters" };
  }

  if (nextWord === current) {
    return { valid: false, message: "Change one letter" };
  }

  if (countLetterDifferences(current, nextWord) !== 1) {
    return { valid: false, message: "Change exactly one letter" };
  }

  if (!poopleWords.has(nextWord)) {
    return { valid: false, message: "Word not in list" };
  }

  return { valid: true, message: "Accepted" };
}

function countLetterDifferences(first, second) {
  let differences = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] !== second[index]) {
      differences += 1;
    }
  }
  return differences;
}

function poopleRowMarkup(word, previousWord, isStart) {
  const cells = word.split("").map((letter, index) => {
    const isChanged = !isStart && previousWord && previousWord[index] !== letter;
    const isTarget = word === poopleTarget;
    return `<span class="poople-tile ${isChanged ? "is-changed" : ""} ${isTarget ? "is-target" : ""}">${letter}</span>`;
  }).join("");

  return `<div class="poople-row ${isStart ? "is-start" : ""}">${cells}</div>`;
}

function nextPoopleHint(current) {
  const dailyPath = dailyPooplePuzzle().path;
  const currentIndex = dailyPath.indexOf(current);
  if (currentIndex >= 0 && dailyPath[currentIndex + 1]) {
    return dailyPath[currentIndex + 1];
  }

  const route = findPoopleRoute(current, poopleTarget);
  return route && route[1] ? route[1] : "";
}

function findPoopleRoute(start, target) {
  const queue = [[start]];
  const visited = new Set([start]);
  const words = Array.from(poopleWords);

  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (current === target) {
      return path;
    }

    words.forEach((word) => {
      if (!visited.has(word) && countLetterDifferences(current, word) === 1) {
        visited.add(word);
        queue.push([...path, word]);
      }
    });
  }

  return null;
}

function renderAngle() {
  const game = catalog.find((item) => item.id === "angle");
  const maxRounds = 10;
  const state = {
    target: randomAngle(),
    score: 0,
    solvedRounds: 0,
    attempts: 0,
    previousDiff: null,
    best: getBest(game.bestKey),
    lastGuess: "",
    lastSolved: "",
    feedback: "--",
    history: [],
    done: false,
    message: "Guess 0 to 360"
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="angle-shell">
      <svg class="angle-board" id="angleBoard" viewBox="0 0 360 260" role="img" aria-label="Angle to guess">
        <line class="angle-base" x1="180" y1="130" x2="292" y2="130"></line>
        <path class="angle-arc" id="angleArc"></path>
        <line class="angle-ray" id="angleRay" x1="180" y1="130"></line>
        <circle class="angle-pin" cx="180" cy="130" r="7"></circle>
      </svg>
      <form class="angle-form" id="angleForm">
        <label class="sr-only" for="angleInput">Angle guess</label>
        <input class="angle-input" id="angleInput" type="number" min="0" max="360" step="1" inputmode="numeric" placeholder="0-360">
        <button class="play-button" id="angleSubmit" type="submit">Guess</button>
      </form>
      <div class="angle-history" id="angleHistory" aria-label="Angle guesses"></div>
      <p class="angle-status" id="angleStatus" aria-live="polite"></p>
    </div>
  `;

  const angleRay = gamePanel.querySelector("#angleRay");
  const angleArc = gamePanel.querySelector("#angleArc");
  const form = gamePanel.querySelector("#angleForm");
  const input = gamePanel.querySelector("#angleInput");
  const submit = gamePanel.querySelector("#angleSubmit");
  const history = gamePanel.querySelector("#angleHistory");
  const status = gamePanel.querySelector("#angleStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.done) {
      return;
    }

    const guess = Number(input.value);
    if (!Number.isFinite(guess) || guess < 0 || guess > 360) {
      state.message = "Use 0 to 360";
      renderBoard();
      return;
    }

    const roundedGuess = Math.round(guess);
    const normalizedGuess = normalizeAngle(roundedGuess);
    const diff = circularAngleDiff(normalizedGuess, state.target);
    const feedback = angleFeedback(diff, state.previousDiff);
    state.attempts += 1;
    state.lastGuess = `${roundedGuess}`;
    state.feedback = feedback;
    state.history.push({ guess: roundedGuess, feedback, diff });
    input.value = "";

    if (diff === 0) {
      const solvedTarget = state.target;
      const points = Math.max(10, 120 - (state.attempts - 1) * 10);
      state.score += points;
      state.solvedRounds += 1;
      state.best = setBest(game.bestKey, state.score);
      state.lastSolved = `${solvedTarget}`;

      if (state.solvedRounds >= maxRounds) {
        state.done = true;
        state.message = `Done, ${state.score} points`;
      } else {
        state.target = randomAngle();
        state.attempts = 0;
        state.previousDiff = null;
        state.feedback = "--";
        state.history = [];
        state.message = `Correct, it was ${solvedTarget}. New angle ready`;
      }
    } else {
      state.previousDiff = diff;
      state.message = feedback;
    }

    renderBoard();
  });

  renderBoard();
  input.focus();
  cleanupCurrent = null;

  function renderBoard() {
    drawAngle(angleRay, angleArc, state.target);
    input.disabled = state.done;
    submit.disabled = state.done;
    history.innerHTML = state.history.map((entry) => `
      <span class="angle-chip ${angleFeedbackClass(entry.feedback)}">${entry.guess}</span>
    `).join("");
    status.textContent = state.message;
    setMetrics("Score", state.score, "Best", state.best, "Round", `${Math.min(state.solvedRounds + 1, maxRounds)}/${maxRounds}`);
    setContext("Angle Board", [
      { label: "Attempts", value: state.attempts },
      { label: "Last Guess", value: state.lastGuess || "--" },
      { label: "Feedback", value: state.feedback },
      { label: "Last Target", value: state.lastSolved || "--" },
      { label: "State", value: state.done ? "Done" : "Live" }
    ]);
  }
}

function randomAngle() {
  return Math.floor(Math.random() * 360);
}

function drawAngle(ray, arc, degrees) {
  const vertex = { x: 180, y: 130 };
  const rayLength = 96;
  const arcRadius = 46;
  const rayEnd = anglePoint(vertex, rayLength, degrees);
  const arcEnd = anglePoint(vertex, arcRadius, degrees);
  const largeArc = degrees > 180 ? 1 : 0;

  ray.setAttribute("x2", rayEnd.x.toFixed(2));
  ray.setAttribute("y2", rayEnd.y.toFixed(2));
  arc.setAttribute("d", degrees === 0
    ? ""
    : `M ${vertex.x + arcRadius} ${vertex.y} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEnd.x.toFixed(2)} ${arcEnd.y.toFixed(2)}`);
}

function anglePoint(vertex, length, degrees) {
  const radians = degrees * Math.PI / 180;
  return {
    x: vertex.x + Math.cos(radians) * length,
    y: vertex.y - Math.sin(radians) * length
  };
}

function normalizeAngle(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function circularAngleDiff(first, second) {
  const raw = Math.abs(normalizeAngle(first) - normalizeAngle(second));
  return Math.min(raw, 360 - raw);
}

function angleFeedback(diff, previousDiff) {
  if (diff === 0) {
    return "Correct";
  }

  if (previousDiff === null) {
    if (diff <= 5) {
      return "Burning hot";
    }
    if (diff <= 15) {
      return "Hot";
    }
    if (diff <= 35) {
      return "Warm";
    }
    if (diff <= 75) {
      return "Cool";
    }
    return "Cold";
  }

  if (diff < previousDiff) {
    return "Hotter";
  }

  if (diff > previousDiff) {
    return "Colder";
  }

  return "Same temp";
}

function angleFeedbackClass(feedback) {
  if (feedback === "Correct" || feedback === "Burning hot" || feedback === "Hotter" || feedback === "Hot") {
    return "is-hot";
  }

  if (feedback === "Warm" || feedback === "Same temp") {
    return "is-warm";
  }

  return "is-cold";
}

function renderConnect4() {
  const game = catalog.find((item) => item.id === "connect4");
  const rows = 6;
  const cols = 7;
  const state = {
    board: createConnectBoard(rows, cols),
    player: 1,
    p1Wins: 0,
    p2Wins: 0,
    best: getBest(game.bestKey),
    done: false,
    message: "P1 turn"
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="connect-shell">
      <div class="connect-board" id="connectBoard" aria-label="Connect 4 board"></div>
      <button class="mode-button connect-next" id="connectNext" type="button" disabled>Next Round</button>
      <p class="connect-status" id="connectStatus" aria-live="polite"></p>
    </div>
  `;

  const board = gamePanel.querySelector("#connectBoard");
  const nextButton = gamePanel.querySelector("#connectNext");
  const status = gamePanel.querySelector("#connectStatus");

  board.addEventListener("click", (event) => {
    const cell = event.target.closest(".connect-cell");
    if (!cell || state.done) {
      return;
    }

    const col = Number(cell.dataset.col);
    const row = dropConnectPiece(state.board, col, state.player);
    if (row === -1) {
      state.message = "Column full";
      renderBoard();
      return;
    }

    if (connectHasWin(state.board, row, col, state.player)) {
      state.done = true;
      state.message = `${connectPlayerName(state.player)} wins`;
      if (state.player === 1) {
        state.p1Wins += 1;
        state.best = setBest(game.bestKey, state.p1Wins);
      } else {
        state.p2Wins += 1;
      }
    } else if (connectIsFull(state.board)) {
      state.done = true;
      state.message = "Draw";
    } else {
      state.player = state.player === 1 ? 2 : 1;
      state.message = `${connectPlayerName(state.player)} turn`;
    }

    renderBoard();
  });

  nextButton.addEventListener("click", () => {
    state.board = createConnectBoard(rows, cols);
    state.player = state.player === 1 ? 2 : 1;
    state.done = false;
    state.message = `${connectPlayerName(state.player)} turn`;
    renderBoard();
  });

  renderBoard();
  cleanupCurrent = null;

  function renderBoard() {
    board.innerHTML = state.board.map((row, rowIndex) => row.map((value, colIndex) => `
      <button class="connect-cell ${value ? `is-p${value}` : ""}" type="button" data-row="${rowIndex}" data-col="${colIndex}" aria-label="Column ${colIndex + 1}, row ${rowIndex + 1}" ${state.done ? "disabled" : ""}>
        <span></span>
      </button>
    `).join("")).join("");

    nextButton.disabled = !state.done;
    status.textContent = state.message;
    setMetrics("P1 Wins", state.p1Wins, "P2 Wins", state.p2Wins, "Turn", state.done ? "Done" : connectPlayerName(state.player));
    setContext("Connect Board", [
      { label: "Best P1", value: state.best },
      { label: "P1 Wins", value: state.p1Wins },
      { label: "P2 Wins", value: state.p2Wins },
      { label: "State", value: state.message }
    ]);
  }
}

function createConnectBoard(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function dropConnectPiece(board, col, player) {
  for (let row = board.length - 1; row >= 0; row -= 1) {
    if (!board[row][col]) {
      board[row][col] = player;
      return row;
    }
  }
  return -1;
}

function connectHasWin(board, row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  return directions.some(([rowStep, colStep]) => {
    const total = 1
      + connectCount(board, row, col, rowStep, colStep, player)
      + connectCount(board, row, col, -rowStep, -colStep, player);
    return total >= 4;
  });
}

function connectCount(board, row, col, rowStep, colStep, player) {
  let total = 0;
  let nextRow = row + rowStep;
  let nextCol = col + colStep;

  while (
    nextRow >= 0
    && nextRow < board.length
    && nextCol >= 0
    && nextCol < board[0].length
    && board[nextRow][nextCol] === player
  ) {
    total += 1;
    nextRow += rowStep;
    nextCol += colStep;
  }

  return total;
}

function connectIsFull(board) {
  return board[0].every(Boolean);
}

function connectPlayerName(player) {
  return player === 1 ? "P1" : "P2";
}

function renderWorld() {
  const game = catalog.find((item) => item.id === "world");
  const duration = 15 * 60;
  const mapWidth = 960;
  const mapHeight = 500;
  const mapMinZoom = 1;
  const mapMaxZoom = 8;
  const mapZoomStep = 1.35;
  const state = {
    started: false,
    practice: false,
    done: false,
    revealed: false,
    timeLeft: duration,
    guessed: new Set(),
    scope: worldScopeAll,
    best: getBest(worldBestKey(worldScopeAll)),
    last: "",
    message: "Ready",
    timer: null,
    showBorders: true,
    showMarkers: true,
    showLabels: true,
    mapZoom: 1,
    mapPanX: 0,
    mapPanY: 0
  };
  let mapPointerId = null;
  let lastMapPoint = null;

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="world-shell">
      <div class="world-controls">
        <button class="play-button" id="worldStart" type="button">Start</button>
        <button class="mode-button" id="worldPractice" type="button">Practice</button>
        <button class="mode-button" id="worldGiveUp" type="button" disabled>Give Up</button>
        <label class="world-scope-control" for="worldScope">
          <span>Scope</span>
          <select class="world-scope-select" id="worldScope">
            ${worldScopeOptions.map((scope) => `<option value="${scope}">${worldScopeLabel(scope)}</option>`).join("")}
          </select>
        </label>
        <label class="world-toggle">
          <input id="worldBorders" type="checkbox" checked>
          <span>Borders</span>
        </label>
        <label class="world-toggle">
          <input id="worldMarkers" type="checkbox" checked>
          <span>Markers</span>
        </label>
        <label class="world-toggle">
          <input id="worldLabels" type="checkbox" checked>
          <span>Labels</span>
        </label>
      </div>
      <form class="world-form" id="worldForm">
        <label class="world-label" for="worldInput">Enter country:</label>
        <input class="world-input" id="worldInput" autocomplete="off" spellcheck="false" disabled>
      </form>
      <div class="world-map" id="worldMap" aria-label="Region progress"></div>
      <div class="world-answers" id="worldAnswers" aria-label="Countries"></div>
      <p class="world-status" id="worldStatus" aria-live="polite"></p>
    </div>
  `;

  const startButton = gamePanel.querySelector("#worldStart");
  const practiceButton = gamePanel.querySelector("#worldPractice");
  const giveUpButton = gamePanel.querySelector("#worldGiveUp");
  const scopeSelect = gamePanel.querySelector("#worldScope");
  const bordersToggle = gamePanel.querySelector("#worldBorders");
  const markersToggle = gamePanel.querySelector("#worldMarkers");
  const labelsToggle = gamePanel.querySelector("#worldLabels");
  const form = gamePanel.querySelector("#worldForm");
  const input = gamePanel.querySelector("#worldInput");
  const map = gamePanel.querySelector("#worldMap");
  const answers = gamePanel.querySelector("#worldAnswers");
  const status = gamePanel.querySelector("#worldStatus");

  startButton.addEventListener("click", () => {
    state.started = true;
    state.message = "Go";
    startButton.disabled = true;
    giveUpButton.disabled = false;
    input.disabled = false;
    input.focus();
    if (!state.practice) {
      state.timer = window.setInterval(() => {
        state.timeLeft -= 1;
        if (state.timeLeft <= 0) {
          state.timeLeft = 0;
          finishWorldGame(state, "Time");
        }
        renderBoard();
      }, 1000);
    }
    renderBoard();
  });

  practiceButton.addEventListener("click", () => {
    if (state.started) {
      return;
    }
    state.practice = !state.practice;
    state.message = state.practice ? "Practice" : "Ready";
    renderBoard();
  });

  giveUpButton.addEventListener("click", () => {
    finishWorldGame(state, "Revealed");
    state.revealed = true;
    renderBoard();
  });

  scopeSelect.addEventListener("change", () => {
    if (state.started) {
      return;
    }

    state.scope = scopeSelect.value;
    state.guessed.clear();
    state.revealed = false;
    state.done = false;
    state.timeLeft = duration;
    state.last = "";
    state.message = "Ready";
    state.best = getBest(worldBestKey(state.scope));
    state.mapZoom = 1;
    state.mapPanX = 0;
    state.mapPanY = 0;
    renderBoard();
  });

  bordersToggle.addEventListener("change", () => {
    state.showBorders = bordersToggle.checked;
    renderBoard();
  });

  markersToggle.addEventListener("change", () => {
    state.showMarkers = markersToggle.checked;
    renderBoard();
  });

  labelsToggle.addEventListener("change", () => {
    state.showLabels = labelsToggle.checked;
    renderBoard();
  });

  map.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-map-action]");
    if (!actionButton) {
      return;
    }

    event.preventDefault();
    const center = { x: mapWidth / 2, y: mapHeight / 2 };
    if (actionButton.dataset.mapAction === "zoom-in") {
      zoomWorldMap(state.mapZoom * mapZoomStep, center);
    } else if (actionButton.dataset.mapAction === "zoom-out") {
      zoomWorldMap(state.mapZoom / mapZoomStep, center);
    } else if (actionButton.dataset.mapAction === "reset") {
      resetWorldMapView();
    }
  });

  map.addEventListener("wheel", (event) => {
    const stage = event.target.closest(".world-map-stage");
    if (!stage || event.target.closest(".world-map-tools")) {
      return;
    }

    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.18 : 1 / 1.18;
    zoomWorldMap(state.mapZoom * factor, getMapPoint(stage, event));
  }, { passive: false });

  map.addEventListener("pointerdown", (event) => {
    const stage = event.target.closest(".world-map-stage");
    if (!stage || event.target.closest(".world-map-tools") || (event.button && event.button !== 0)) {
      return;
    }

    event.preventDefault();
    mapPointerId = event.pointerId;
    lastMapPoint = getMapPoint(stage, event);
    stage.classList.add("is-panning");
    stage.setPointerCapture(event.pointerId);
  });

  map.addEventListener("pointermove", (event) => {
    if (mapPointerId !== event.pointerId || !lastMapPoint) {
      return;
    }

    const stage = map.querySelector(".world-map-stage");
    if (!stage) {
      return;
    }

    const point = getMapPoint(stage, event);
    state.mapPanX += point.x - lastMapPoint.x;
    state.mapPanY += point.y - lastMapPoint.y;
    lastMapPoint = point;
    clampWorldMapView();
    applyWorldMapTransform();
  });

  map.addEventListener("pointerup", endWorldMapPan);
  map.addEventListener("pointercancel", endWorldMapPan);
  map.addEventListener("lostpointercapture", endWorldMapPan);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    attemptAnswer(true);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      attemptAnswer(true);
    }
  });

  input.addEventListener("input", () => {
    attemptAnswer(false);
  });

  function getWorldMapTransform() {
    return `translate(${formatMapNumber(state.mapPanX)} ${formatMapNumber(state.mapPanY)}) scale(${formatMapNumber(state.mapZoom)})`;
  }

  function formatMapNumber(value) {
    return Number(value.toFixed(3));
  }

  function getWorldMarkerRadius(isActive) {
    const visualRadius = isActive ? 5.4 : 4.5;
    return formatMapNumber(visualRadius / state.mapZoom);
  }

  function getWorldLabelFontSize() {
    return formatMapNumber(15 / state.mapZoom);
  }

  function getWorldLabelOffset() {
    return formatMapNumber(-14 / state.mapZoom);
  }

  function getWorldLabelStrokeWidth() {
    return formatMapNumber(3.5 / state.mapZoom);
  }

  function getMapPoint(stage, event) {
    const svg = stage.querySelector(".world-svg");
    const rect = (svg || stage).getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return { x: mapWidth / 2, y: mapHeight / 2 };
    }

    return {
      x: ((event.clientX - rect.left) / rect.width) * mapWidth,
      y: ((event.clientY - rect.top) / rect.height) * mapHeight
    };
  }

  function clampWorldMapView() {
    state.mapZoom = Math.min(mapMaxZoom, Math.max(mapMinZoom, state.mapZoom));

    const minX = mapWidth - (mapWidth * state.mapZoom);
    const minY = mapHeight - (mapHeight * state.mapZoom);
    state.mapPanX = Math.min(0, Math.max(minX, state.mapPanX));
    state.mapPanY = Math.min(0, Math.max(minY, state.mapPanY));

    if (state.mapZoom === mapMinZoom) {
      state.mapPanX = 0;
      state.mapPanY = 0;
    }
  }

  function applyWorldMapTransform() {
    const viewport = map.querySelector(".world-map-viewport");
    if (viewport) {
      viewport.setAttribute("transform", getWorldMapTransform());
    }

    map.querySelectorAll(".world-country-marker").forEach((marker) => {
      const isActive = marker.classList.contains("is-found") || marker.classList.contains("is-missed");
      marker.setAttribute("r", getWorldMarkerRadius(isActive));
    });

    map.querySelectorAll(".world-country-label").forEach((label) => {
      label.setAttribute("dy", getWorldLabelOffset());
      label.setAttribute("font-size", getWorldLabelFontSize());
      label.setAttribute("stroke-width", getWorldLabelStrokeWidth());
    });

    const zoomLevel = map.querySelector("#worldZoomLevel");
    if (zoomLevel) {
      zoomLevel.textContent = `${Math.round(state.mapZoom * 100)}%`;
    }

    const zoomOutButton = map.querySelector('[data-map-action="zoom-out"]');
    const zoomInButton = map.querySelector('[data-map-action="zoom-in"]');
    if (zoomOutButton) {
      zoomOutButton.disabled = state.mapZoom <= mapMinZoom;
    }
    if (zoomInButton) {
      zoomInButton.disabled = state.mapZoom >= mapMaxZoom;
    }
  }

  function zoomWorldMap(nextZoom, center) {
    const previousZoom = state.mapZoom;
    const clampedZoom = Math.min(mapMaxZoom, Math.max(mapMinZoom, nextZoom));
    if (clampedZoom === previousZoom) {
      return;
    }

    const contentX = (center.x - state.mapPanX) / previousZoom;
    const contentY = (center.y - state.mapPanY) / previousZoom;
    state.mapZoom = clampedZoom;
    state.mapPanX = center.x - (contentX * state.mapZoom);
    state.mapPanY = center.y - (contentY * state.mapZoom);
    clampWorldMapView();
    applyWorldMapTransform();
  }

  function resetWorldMapView() {
    state.mapZoom = 1;
    state.mapPanX = 0;
    state.mapPanY = 0;
    applyWorldMapTransform();
  }

  function endWorldMapPan(event) {
    if (mapPointerId !== event.pointerId) {
      return;
    }

    const stage = map.querySelector(".world-map-stage");
    if (stage) {
      stage.classList.remove("is-panning");
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    }
    mapPointerId = null;
    lastMapPoint = null;
  }

  function attemptAnswer(force) {
    if (!state.started || state.done) {
      return;
    }

    const normalized = normalizeWorldAnswer(input.value);
    const activeCountryNames = new Set(getWorldScopeCountries(state.scope).map((item) => item.name));
    const country = lookupWorldCountry(input.value);
    if (!country || state.guessed.has(country.name)) {
      return;
    }

    if (!activeCountryNames.has(country.name)) {
      if (force) {
        state.message = `${country.name} is outside ${worldScopeLabel(state.scope)}`;
        input.value = "";
        renderBoard();
      }
      return;
    }

    if (!force && isAmbiguousWorldAnswer(normalized, country, state.guessed, activeCountryNames)) {
      return;
    }

    state.guessed.add(country.name);
    state.last = country.name;
    state.message = country.name;
    input.value = "";
    state.best = setBest(worldBestKey(state.scope), state.guessed.size);

    if (state.guessed.size === activeCountryNames.size) {
      finishWorldGame(state, "Perfect");
    }

    renderBoard();
  }

  renderBoard();
  cleanupCurrent = () => {
    if (state.timer) {
      window.clearInterval(state.timer);
    }
  };

  function renderBoard() {
    const activeCountries = getWorldScopeCountries(state.scope);
    const activeCountryNames = new Set(activeCountries.map((country) => country.name));
    const activeContinents = state.scope === worldScopeAll ? Object.keys(worldCountryGroups) : [state.scope];
    const byContinent = activeCountries.reduce((groups, country) => {
      groups[country.continent].push(country);
      return groups;
    }, Object.fromEntries(activeContinents.map((continent) => [continent, []])));

    const continentSummaries = Object.entries(byContinent).map(([continent, countries]) => {
      const count = countries.filter((country) => state.guessed.has(country.name)).length;
      const percent = Math.round((count / countries.length) * 100);
      return { continent, countries, count, percent };
    });

    map.innerHTML = `
      <div class="world-map-stage ${state.showBorders ? "has-borders" : "no-borders"} ${state.showMarkers ? "has-markers" : "no-markers"} ${state.showLabels ? "has-labels" : "no-labels"}">
        <div class="world-map-tools" aria-label="Map controls">
          <button class="world-map-tool" data-map-action="zoom-out" type="button" aria-label="Zoom out" title="Zoom out">-</button>
          <span class="world-map-zoom" id="worldZoomLevel">${Math.round(state.mapZoom * 100)}%</span>
          <button class="world-map-tool" data-map-action="zoom-in" type="button" aria-label="Zoom in" title="Zoom in">+</button>
          <button class="world-map-tool is-reset" data-map-action="reset" type="button" aria-label="Reset map" title="Reset map">Reset</button>
        </div>
        <svg class="world-svg" viewBox="0 0 960 500" role="img" aria-label="World countries map">
          <g class="world-map-viewport" transform="${getWorldMapTransform()}">
            <rect class="world-ocean" x="0" y="0" width="960" height="500" rx="18"></rect>
            <path class="world-graticule" d="M0 83.3 H960 M0 166.7 H960 M0 250 H960 M0 333.3 H960 M0 416.7 H960 M160 0 V500 M320 0 V500 M480 0 V500 M640 0 V500 M800 0 V500"></path>
            <g class="world-country-layer">
              ${worldMapCountries.map((country) => {
                const isTarget = activeCountryNames.has(country.name);
                const isGuessed = state.guessed.has(country.name);
                const isMissed = state.revealed && isTarget && !isGuessed;
                const classes = [
                  "world-country-shape",
                  !isTarget ? "is-outside" : "",
                  isGuessed ? "is-found" : "",
                  isMissed ? "is-missed" : ""
                ].filter(Boolean).join(" ");
                const title = isTarget
                  ? (isGuessed || state.revealed ? country.name : "Hidden country")
                  : "Outside selected scope";
                return `
                  <path class="${classes}" data-country="${country.name}" d="${country.path}">
                    <title>${title}</title>
                  </path>
                `;
              }).join("")}
            </g>
            <g class="world-marker-layer">
              ${worldMapCountries.map((country) => {
                const isTarget = activeCountryNames.has(country.name);
                const isGuessed = state.guessed.has(country.name);
                const isMissed = state.revealed && isTarget && !isGuessed;
                const [x, y] = country.marker || [];
                if (!isTarget || !Number.isFinite(x) || !Number.isFinite(y)) {
                  return "";
                }

                const classes = [
                  "world-country-marker",
                  isGuessed ? "is-found" : "",
                  isMissed ? "is-missed" : ""
                ].filter(Boolean).join(" ");
                const radius = getWorldMarkerRadius(isGuessed || isMissed);
                const title = isGuessed || state.revealed ? country.name : "Country marker";
                return `
                  <circle class="${classes}" data-country="${country.name}" cx="${x}" cy="${y}" r="${radius}">
                    <title>${title}</title>
                  </circle>
                `;
              }).join("")}
            </g>
            <g class="world-label-layer">
              ${worldMapCountries.map((country) => {
                const isGuessed = state.guessed.has(country.name);
                const [x, y] = country.marker || [];
                if (!activeCountryNames.has(country.name) || !isGuessed || !Number.isFinite(x) || !Number.isFinite(y)) {
                  return "";
                }

                return `
                  <text class="world-country-label" data-country="${country.name}" x="${x}" y="${y}" dy="${getWorldLabelOffset()}" font-size="${getWorldLabelFontSize()}" stroke-width="${getWorldLabelStrokeWidth()}">${country.name}</text>
                `;
              }).join("")}
            </g>
            ${worldMapCountries.length ? "" : `
              <text class="world-map-missing" x="480" y="250" text-anchor="middle">Map data unavailable</text>
            `}
          </g>
        </svg>
      </div>
      <div class="world-region-meters">
        ${continentSummaries.map(({ continent, count, countries, percent }) => `
          <div class="world-region-meter">
            <span>${continent}</span>
            <strong>${count}/${countries.length}</strong>
            <i style="width: ${percent}%"></i>
          </div>
        `).join("")}
      </div>
    `;

    answers.innerHTML = Object.entries(byContinent).map(([continent, countries]) => `
      <section class="world-region">
        <h2>${continent}</h2>
        <div class="world-country-grid">
          ${countries.map((country) => {
            const isGuessed = state.guessed.has(country.name);
            const isMissed = state.revealed && !isGuessed;
            return `
              <span class="world-country ${isGuessed ? "is-found" : ""} ${isMissed ? "is-missed" : ""}">
                ${isGuessed || state.revealed ? country.name : "----"}
              </span>
            `;
          }).join("")}
        </div>
      </section>
    `).join("");

    input.disabled = !state.started || state.done;
    startButton.disabled = state.started;
    giveUpButton.disabled = !state.started || state.done;
    practiceButton.classList.toggle("is-active", state.practice);
    practiceButton.disabled = state.started;
    scopeSelect.disabled = state.started;
    scopeSelect.value = state.scope;
    bordersToggle.checked = state.showBorders;
    markersToggle.checked = state.showMarkers;
    labelsToggle.checked = state.showLabels;
    status.textContent = state.message;
    applyWorldMapTransform();

    setMetrics("Score", `${state.guessed.size}/${activeCountries.length}`, "Best", state.best, "Timer", state.practice ? "Practice" : formatWorldTime(state.timeLeft));
    setContext("World Board", [
      { label: "Mode", value: state.practice ? "Practice" : "Timed" },
      { label: "Scope", value: worldScopeLabel(state.scope) },
      { label: "Remaining", value: activeCountries.length - state.guessed.size },
      { label: "Last", value: state.last || "--" },
      { label: "State", value: state.done ? "Done" : state.started ? "Live" : "Ready" }
    ]);
  }
}

function finishWorldGame(state, message) {
  state.done = true;
  state.message = message;
  state.best = setBest(worldBestKey(state.scope || worldScopeAll), state.guessed.size);
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function worldScopeLabel(scope) {
  return scope === worldScopeAll ? "World" : scope;
}

function worldBestKey(scope) {
  if (scope === worldScopeAll) {
    return "gamehub.world.best";
  }

  return `gamehub.world.best.${normalizeWorldAnswer(scope).replace(/\s/g, "-")}`;
}

function getWorldScopeCountries(scope) {
  if (scope === worldScopeAll || !worldCountryGroups[scope]) {
    return worldCountries;
  }

  return worldCountries.filter((country) => country.continent === scope);
}

function buildWorldAnswerMap() {
  const map = new Map();
  worldCountries.forEach((country) => {
    [country.name, ...country.aliases].forEach((answer) => {
      const normalized = normalizeWorldAnswer(answer);
      if (normalized) {
        map.set(normalized, country);
        map.set(normalized.replace(/\s/g, ""), country);
      }
    });
  });
  return map;
}

function lookupWorldCountry(value) {
  const normalized = normalizeWorldAnswer(value);
  return worldAnswerMap.get(normalized) || worldAnswerMap.get(normalized.replace(/\s/g, "")) || null;
}

function isAmbiguousWorldAnswer(normalized, country, guessed, activeCountryNames = null) {
  if (!normalized) {
    return false;
  }

  return worldAnswerKeys.some((key) => {
    const other = worldAnswerMap.get(key);
    return key !== normalized
      && key.startsWith(normalized)
      && other
      && other.name !== country.name
      && (!activeCountryNames || activeCountryNames.has(other.name))
      && !guessed.has(other.name);
  });
}

function normalizeWorldAnswer(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/^the\s+/, "")
    .trim();
}

function formatWorldTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function renderCountryShape() {
  const game = catalog.find((item) => item.id === "shape");
  const maxRounds = 20;
  const state = {
    scope: worldScopeAll,
    mode: "type",
    rotate: false,
    pool: [],
    used: new Set(),
    current: null,
    choices: [],
    missedChoices: new Set(),
    score: 0,
    best: getBest(game.bestKey),
    streak: 0,
    completed: 0,
    roundLimit: maxRounds,
    wrong: 0,
    hintUsed: false,
    locked: false,
    done: false,
    angle: 0,
    last: "--",
    message: "Name the silhouette"
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="shape-shell">
      <div class="shape-controls">
        <button class="play-button" id="shapeNewSet" type="button">New Set</button>
        <label class="world-scope-control" for="shapeScope">
          <span>Scope</span>
          <select class="world-scope-select" id="shapeScope">
            ${worldScopeOptions.map((scope) => `<option value="${scope}">${worldScopeLabel(scope)}</option>`).join("")}
          </select>
        </label>
        <label class="world-toggle">
          <input id="shapeMcq" type="checkbox">
          <span>MCQ</span>
        </label>
        <label class="world-toggle">
          <input id="shapeRotate" type="checkbox">
          <span>Rotate</span>
        </label>
        <button class="mode-button" id="shapeHint" type="button">Hint</button>
        <button class="mode-button" id="shapeSkip" type="button">Skip</button>
        <button class="mode-button" id="shapeNext" type="button" disabled>Next</button>
      </div>
      <div class="shape-card" id="shapeCard" aria-label="Country silhouette"></div>
      <form class="shape-form" id="shapeForm">
        <label class="sr-only" for="shapeInput">Country name</label>
        <input class="shape-input" id="shapeInput" autocomplete="off" spellcheck="false" placeholder="Country name">
        <button class="play-button" id="shapeSubmit" type="submit">Guess</button>
      </form>
      <div class="shape-choices" id="shapeChoices" aria-label="Country choices"></div>
      <p class="shape-status" id="shapeStatus" aria-live="polite"></p>
    </div>
  `;

  const newSetButton = gamePanel.querySelector("#shapeNewSet");
  const scopeSelect = gamePanel.querySelector("#shapeScope");
  const mcqToggle = gamePanel.querySelector("#shapeMcq");
  const rotateToggle = gamePanel.querySelector("#shapeRotate");
  const hintButton = gamePanel.querySelector("#shapeHint");
  const skipButton = gamePanel.querySelector("#shapeSkip");
  const nextButton = gamePanel.querySelector("#shapeNext");
  const card = gamePanel.querySelector("#shapeCard");
  const form = gamePanel.querySelector("#shapeForm");
  const input = gamePanel.querySelector("#shapeInput");
  const submitButton = gamePanel.querySelector("#shapeSubmit");
  const choices = gamePanel.querySelector("#shapeChoices");
  const status = gamePanel.querySelector("#shapeStatus");

  newSetButton.addEventListener("click", resetShapeSet);

  scopeSelect.addEventListener("change", () => {
    state.scope = scopeSelect.value;
    resetShapeSet();
  });

  mcqToggle.addEventListener("change", () => {
    state.mode = mcqToggle.checked ? "mcq" : "type";
    state.message = state.mode === "mcq" ? "Pick the country" : "Name the silhouette";
    renderBoard();
    focusShapeInput();
  });

  rotateToggle.addEventListener("change", () => {
    state.rotate = rotateToggle.checked;
    if (state.current && !state.locked && !state.done) {
      state.angle = randomShapeAngle(state.rotate);
    }
    renderBoard();
  });

  hintButton.addEventListener("click", () => {
    if (!state.current || state.locked || state.done) {
      return;
    }

    state.hintUsed = true;
    state.message = `${state.current.continent}, starts with ${state.current.name[0]}`;
    renderBoard();
    focusShapeInput();
  });

  skipButton.addEventListener("click", () => {
    if (!state.current || state.locked || state.done) {
      return;
    }

    finishShapeRound(false, `Skipped: ${state.current.name}`);
  });

  nextButton.addEventListener("click", () => {
    if (state.done) {
      resetShapeSet();
      return;
    }

    if (state.locked) {
      startShapeRound();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.mode !== "type" || !state.current || state.locked || state.done) {
      return;
    }

    const guess = input.value.trim();
    if (!guess) {
      state.message = "Type a country";
      renderBoard();
      return;
    }

    const country = lookupWorldCountry(guess);
    input.value = "";
    if (country && country.name === state.current.name) {
      finishShapeRound(true, `Correct: ${state.current.name}`);
      return;
    }

    registerShapeMiss(country ? `Not ${country.name}` : "Try again");
  });

  choices.addEventListener("click", (event) => {
    const button = event.target.closest("[data-shape-choice]");
    if (!button || state.mode !== "mcq" || !state.current || state.locked || state.done) {
      return;
    }

    const countryName = button.dataset.shapeChoice;
    if (countryName === state.current.name) {
      finishShapeRound(true, `Correct: ${state.current.name}`);
      return;
    }

    state.missedChoices.add(countryName);
    registerShapeMiss("Nope, try another");
  });

  resetShapeSet();
  cleanupCurrent = null;

  function resetShapeSet() {
    state.pool = getShapeScopeCountries(state.scope);
    state.used = new Set();
    state.score = 0;
    state.streak = 0;
    state.completed = 0;
    state.roundLimit = Math.min(maxRounds, state.pool.length);
    state.best = getBest(game.bestKey);
    state.done = false;
    state.locked = false;
    state.current = null;
    state.last = "--";
    state.message = state.pool.length ? "Name the silhouette" : "No country shapes here";

    if (!state.pool.length) {
      renderBoard();
      return;
    }

    startShapeRound();
  }

  function startShapeRound() {
    if (state.completed >= state.roundLimit) {
      state.done = true;
      state.locked = true;
      state.message = `Set complete: ${state.score}/${state.roundLimit}`;
      renderBoard();
      return;
    }

    const country = pickShapeCountry();
    if (!country) {
      state.done = true;
      state.locked = true;
      state.message = `Set complete: ${state.score}/${state.roundLimit}`;
      renderBoard();
      return;
    }

    state.current = country;
    state.used.add(country.name);
    state.choices = buildShapeChoices(country, state.pool);
    state.missedChoices.clear();
    state.wrong = 0;
    state.hintUsed = false;
    state.locked = false;
    state.angle = randomShapeAngle(state.rotate);
    state.message = state.mode === "mcq" ? "Pick the country" : "Name the silhouette";
    renderBoard();
    focusShapeInput();
  }

  function pickShapeCountry() {
    const available = state.pool.filter((country) => !state.used.has(country.name));
    if (!available.length) {
      return null;
    }

    return available[Math.floor(Math.random() * available.length)];
  }

  function finishShapeRound(success, message) {
    state.locked = true;
    state.completed += 1;
    state.last = state.current ? state.current.name : "--";

    if (success) {
      state.score += 1;
      state.streak = state.wrong ? 0 : state.streak + 1;
      state.best = setBest(game.bestKey, state.score);
    } else {
      state.streak = 0;
    }

    state.done = state.completed >= state.roundLimit;
    state.message = state.done ? `${message}. Set complete: ${state.score}/${state.roundLimit}` : message;
    renderBoard();
  }

  function registerShapeMiss(message) {
    state.wrong += 1;
    state.streak = 0;

    if (state.wrong >= 3) {
      finishShapeRound(false, `Answer: ${state.current.name}`);
      return;
    }

    state.message = `${message}. ${3 - state.wrong} tries left`;
    renderBoard();
    focusShapeInput();
  }

  function renderBoard() {
    const isTypeMode = state.mode === "type";
    scopeSelect.value = state.scope;
    mcqToggle.checked = state.mode === "mcq";
    rotateToggle.checked = state.rotate;

    form.classList.toggle("is-hidden", !isTypeMode);
    choices.classList.toggle("is-hidden", isTypeMode);
    input.disabled = !isTypeMode || state.locked || state.done || !state.current;
    submitButton.disabled = input.disabled;
    hintButton.disabled = state.locked || state.done || !state.current;
    skipButton.disabled = state.locked || state.done || !state.current;
    nextButton.disabled = !state.locked && !state.done;
    nextButton.textContent = state.done ? "New Set" : "Next";

    card.innerHTML = state.current ? shapeCardMarkup(state.current) : `
      <div class="shape-empty">No country shapes available</div>
    `;

    choices.innerHTML = state.mode === "mcq" ? state.choices.map((country) => {
      const isCorrect = state.locked && country.name === state.current.name;
      const isWrong = state.missedChoices.has(country.name);
      const classes = [
        "shape-choice",
        isCorrect ? "is-correct" : "",
        isWrong ? "is-wrong" : ""
      ].filter(Boolean).join(" ");
      return `
        <button class="${classes}" type="button" data-shape-choice="${country.name}" ${state.locked || state.done || isWrong ? "disabled" : ""}>
          ${country.name}
        </button>
      `;
    }).join("") : "";

    status.textContent = state.message;

    const round = state.done || state.locked
      ? `${state.completed}/${state.roundLimit || maxRounds}`
      : `${Math.min(state.completed + 1, state.roundLimit || maxRounds)}/${state.roundLimit || maxRounds}`;
    setMetrics("Score", `${state.score}/${state.roundLimit || maxRounds}`, "Best", state.best, "Round", round);
    setContext("Shape Board", [
      { label: "Mode", value: state.mode === "mcq" ? "MCQ" : "Type" },
      { label: "Scope", value: worldScopeLabel(state.scope) },
      { label: "Streak", value: state.streak },
      { label: "Rotation", value: state.rotate ? `${state.angle} deg` : "Off" },
      { label: "Hint", value: state.hintUsed ? "Used" : "Ready" },
      { label: "Last", value: state.last }
    ]);
  }

  function shapeCardMarkup(country) {
    const viewBox = getShapeViewBox(country, state.angle);
    const bounds = country.bounds;
    const transform = state.angle
      ? `rotate(${svgNumber(state.angle)} ${svgNumber(bounds.cx)} ${svgNumber(bounds.cy)})`
      : "";
    return `
      <svg class="shape-svg" viewBox="${viewBox}" role="img" aria-label="Country silhouette">
        <g class="shape-transform" transform="${transform}">
          <path class="shape-path ${state.locked ? "is-revealed" : ""}" d="${country.path}"></path>
        </g>
      </svg>
      <div class="shape-reveal ${state.locked || state.done ? "is-visible" : ""}">${country.name}</div>
    `;
  }

  function focusShapeInput() {
    if (state.mode === "type" && !state.locked && !state.done) {
      input.focus();
    }
  }
}

function getPathBounds(path) {
  const values = (path.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
  if (values.length < 2) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let index = 0; index < values.length - 1; index += 2) {
    const x = values[index];
    const y = values[index + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      continue;
    }

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(0.1, maxX - minX),
    height: Math.max(0.1, maxY - minY),
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2
  };
}

function getShapeScopeCountries(scope) {
  if (scope === worldScopeAll || !worldCountryGroups[scope]) {
    return shapeCountries;
  }

  return shapeCountries.filter((country) => country.continent === scope);
}

function buildShapeChoices(current, pool) {
  const size = Math.min(4, pool.length);
  const distractors = shuffleShapeList(pool.filter((country) => country.name !== current.name)).slice(0, size - 1);
  return shuffleShapeList([current, ...distractors]);
}

function shuffleShapeList(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function randomShapeAngle(enabled) {
  return enabled ? Math.floor(Math.random() * 360) : 0;
}

function getShapeViewBox(country, angle) {
  const bounds = country.bounds;
  const needsRotationPad = angle !== 0;
  const longestSide = Math.max(bounds.width, bounds.height);
  const pad = Math.max(longestSide * 0.16, 0.7);

  if (!needsRotationPad) {
    return [
      svgNumber(bounds.minX - pad),
      svgNumber(bounds.minY - pad),
      svgNumber(bounds.width + pad * 2),
      svgNumber(bounds.height + pad * 2)
    ].join(" ");
  }

  const diagonal = Math.hypot(bounds.width, bounds.height);
  const side = Math.max(diagonal * 1.36, longestSide + 1.4, 1.8);
  return [
    svgNumber(bounds.cx - side / 2),
    svgNumber(bounds.cy - side / 2),
    svgNumber(side),
    svgNumber(side)
  ].join(" ");
}

function svgNumber(value) {
  return Number(value.toFixed(3));
}

function renderTicTacToe() {
  const game = catalog.find((item) => item.id === "tictactoe");
  const state = {
    board: Array(9).fill(""),
    mode: "bot",
    turn: "X",
    done: false,
    xWins: 0,
    best: getBest(game.bestKey),
    pendingBot: null
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="ttt-shell">
      <div class="mode-switch" role="group" aria-label="Mode">
        <button class="mode-button is-active" type="button" data-mode="bot">Bot</button>
        <button class="mode-button" type="button" data-mode="duo">Duo</button>
      </div>
      <div class="ttt-board" id="tttBoard" aria-label="Tic Tac Toe board"></div>
    </div>
  `;

  const board = gamePanel.querySelector("#tttBoard");
  const modeButtons = Array.from(gamePanel.querySelectorAll("[data-mode]"));

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.pendingBot) {
        window.clearTimeout(state.pendingBot);
        state.pendingBot = null;
      }
      state.mode = button.dataset.mode;
      state.board = Array(9).fill("");
      state.turn = "X";
      state.done = false;
      modeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderBoard();
    });
  });

  board.addEventListener("click", (event) => {
    const cell = event.target.closest(".ttt-cell");
    if (!cell || state.done) {
      return;
    }

    const index = Number(cell.dataset.index);
    if (state.board[index] || (state.mode === "bot" && state.turn !== "X")) {
      return;
    }

    playTicTacToeMove(index, state, game.bestKey);
    renderBoard();

    if (state.mode === "bot" && !state.done && state.turn === "O") {
      state.pendingBot = window.setTimeout(() => {
        playTicTacToeMove(chooseBotMove(state.board), state, game.bestKey);
        state.pendingBot = null;
        renderBoard();
      }, 260);
    }
  });

  renderBoard();

  cleanupCurrent = () => {
    if (state.pendingBot) {
      window.clearTimeout(state.pendingBot);
    }
  };

  function renderBoard() {
    board.innerHTML = state.board.map((mark, index) => `
      <button class="ttt-cell" type="button" data-index="${index}" data-mark="${mark}" aria-label="Cell ${index + 1}">${mark}</button>
    `).join("");

    const result = ticTacToeResult(state.board);
    const stateLabel = result.winner
      ? `${result.winner} wins`
      : result.draw
        ? "Draw"
        : `${state.turn} turn`;

    setMetrics("X Wins", state.xWins, "Best", state.best, "State", stateLabel);
    setContext("Round Board", [
      { label: "Mode", value: state.mode === "bot" ? "Bot" : "Duo" },
      { label: "X Wins", value: state.xWins },
      { label: "State", value: stateLabel }
    ]);
  }
}

function playTicTacToeMove(index, state, bestKey) {
  if (index < 0 || state.board[index]) {
    return;
  }

  state.board[index] = state.turn;
  const result = ticTacToeResult(state.board);

  if (result.winner || result.draw) {
    state.done = true;
    if (result.winner === "X") {
      state.xWins += 1;
      state.best = setBest(bestKey, state.xWins);
    }
    return;
  }

  state.turn = state.turn === "X" ? "O" : "X";
}

function ticTacToeResult(board) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const line of wins) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], draw: false };
    }
  }

  return { winner: "", draw: board.every(Boolean) };
}

function chooseBotMove(board) {
  const open = board.map((mark, index) => mark ? null : index).filter((index) => index !== null);
  const winningMove = findOutcomeMove(board, "O");
  if (winningMove !== -1) {
    return winningMove;
  }

  const blockMove = findOutcomeMove(board, "X");
  if (blockMove !== -1) {
    return blockMove;
  }

  if (!board[4]) {
    return 4;
  }

  const corners = [0, 2, 6, 8].filter((index) => !board[index]);
  if (corners.length) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return open[Math.floor(Math.random() * open.length)];
}

function findOutcomeMove(board, mark) {
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) {
      continue;
    }
    const copy = [...board];
    copy[index] = mark;
    if (ticTacToeResult(copy).winner === mark) {
      return index;
    }
  }
  return -1;
}

function renderTarget() {
  const game = catalog.find((item) => item.id === "target");
  const state = {
    score: 0,
    combo: 0,
    time: 30,
    active: randomTarget(),
    best: getBest(game.bestKey),
    live: true
  };

  setHeader(game.title, game.genre);
  gamePanel.innerHTML = `
    <div class="target-shell">
      <div class="target-grid" id="targetGrid" aria-label="Reflex target grid"></div>
      <div class="time-track" aria-hidden="true">
        <div class="time-bar" id="timeBar"></div>
      </div>
    </div>
  `;

  const grid = gamePanel.querySelector("#targetGrid");
  const timeBar = gamePanel.querySelector("#timeBar");
  grid.innerHTML = Array.from({ length: 16 }, (_, index) => `
    <button class="target-cell" type="button" data-index="${index}" aria-label="Cell ${index + 1}"></button>
  `).join("");

  grid.addEventListener("click", (event) => {
    const cell = event.target.closest(".target-cell");
    if (!cell || !state.live) {
      return;
    }

    const index = Number(cell.dataset.index);
    if (index === state.active) {
      state.combo += 1;
      state.score += 1 + Math.floor(state.combo / 5);
      state.best = setBest(game.bestKey, state.score);
      state.active = randomTarget(state.active);
    } else {
      state.combo = 0;
      state.score = Math.max(0, state.score - 1);
    }

    renderGrid();
  });

  const secondTimer = window.setInterval(() => {
    state.time -= 1;
    if (state.time <= 0) {
      state.time = 0;
      state.live = false;
      window.clearInterval(secondTimer);
      window.clearInterval(hopTimer);
    }
    renderGrid();
  }, 1000);

  const hopTimer = window.setInterval(() => {
    if (state.live) {
      state.active = randomTarget(state.active);
      renderGrid();
    }
  }, 850);

  renderGrid();

  cleanupCurrent = () => {
    window.clearInterval(secondTimer);
    window.clearInterval(hopTimer);
  };

  function renderGrid() {
    grid.querySelectorAll(".target-cell").forEach((cell) => {
      cell.classList.toggle("is-live", Number(cell.dataset.index) === state.active && state.live);
    });

    timeBar.style.width = `${(state.time / 30) * 100}%`;
    setMetrics("Score", state.score, "Best", state.best, "Time", state.time);
    setContext("Reflex Board", [
      { label: "Score", value: state.score },
      { label: "Combo", value: state.combo },
      { label: "State", value: state.live ? "Live" : "Done" }
    ]);
  }
}

function randomTarget(previous = -1) {
  let next;
  do {
    next = Math.floor(Math.random() * 16);
  } while (next === previous);
  return next;
}
