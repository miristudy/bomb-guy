const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
const TPS = 2;
const DELAY = FPS / TPS;

// --------- Input ---------
interface Input {
  isRight(): boolean;
  isLeft(): boolean;
  isUp(): boolean;
  isDown(): boolean;
  isPlace(): boolean;
  handle(): void;
}
class Up implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return true;
  }
  isDown(): boolean {
    return false;
  }
  isPlace(): boolean {
    return false;
  }
  handle() {
    move(0, -1);
  }
}
class Down implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return true;
  }
  isPlace(): boolean {
    return false;
  }
  handle() {
    move(0, 1);
  }
}
class Right implements Input {
  isRight(): boolean {
    return true;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }
  isPlace(): boolean {
    return false;
  }
  handle() {
    move(1, 0);
  }
}
class Left implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return true;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }
  isPlace(): boolean {
    return false;
  }
  handle() {
    move(-1, 0);
  }
}
class Place implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }
  isPlace(): boolean {
    return true;
  }
  handle() {
    placeBomb();
  }
}
// --------- Input ---------


enum Tile {
  AIR,
  UNBREAKABLE,
  STONE,
  BOMB,
  BOMB_CLOSE,
  BOMB_REALLY_CLOSE,
  TMP_FIRE,
  FIRE,
  EXTRA_BOMB,
  MONSTER_UP,
  MONSTER_RIGHT,
  TMP_MONSTER_RIGHT,
  MONSTER_DOWN,
  TMP_MONSTER_DOWN,
  MONSTER_LEFT,
}

let playerx = 1;
let playery = 1;
let map: Tile[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 2, 2, 2, 1],
  [1, 0, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 0, 0, 0, 1],
  [1, 2, 1, 2, 1, 0, 1, 0, 1],
  [1, 2, 2, 2, 2, 0, 0, 10, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

function explode(x: number, y: number, type: Tile) {
  if (map[y][x] === Tile.STONE) {
    if (Math.random() < 0.1) map[y][x] = Tile.EXTRA_BOMB;
    else map[y][x] = type;
  } else if (map[y][x] !== Tile.UNBREAKABLE) {
    if (
      map[y][x] === Tile.BOMB ||
      map[y][x] === Tile.BOMB_CLOSE ||
      map[y][x] === Tile.BOMB_REALLY_CLOSE
    )
      bombs++;
    map[y][x] = type;
  }
}

function move(x: number, y: number) {
  if (
    map[playery + y][playerx + x] === Tile.AIR ||
    map[playery + y][playerx + x] === Tile.FIRE
  ) {
    playery += y;
    playerx += x;
  } else if (map[playery + y][playerx + x] === Tile.EXTRA_BOMB) {
    playery += y;
    playerx += x;
    bombs++;
    map[playery][playerx] = Tile.AIR;
  }
}

function placeBomb() {
  if (bombs > 0) {
    map[playery][playerx] = Tile.BOMB;
    bombs--;
  }
}

function update() {
  handleInputs();

  if (
    map[playery][playerx] === Tile.FIRE ||
    map[playery][playerx] === Tile.MONSTER_DOWN ||
    map[playery][playerx] === Tile.MONSTER_UP ||
    map[playery][playerx] === Tile.MONSTER_LEFT ||
    map[playery][playerx] === Tile.MONSTER_RIGHT
  )
    gameOver = true;

  if (--delay > 0) return;
  delay = DELAY;
  updateMap();
}

function handleInputs() {
  while (!gameOver && inputs.length > 0) {
    let input: Input = inputs.pop();
    input.handle();
  }
}

function updateMap() {
  for (let y = 1; y < map.length; y++) {
    for (let x = 1; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}

function updateTile(x: number, y: number) {
  if (map[y][x] === Tile.BOMB) {
    map[y][x] = Tile.BOMB_CLOSE;
  } else if (map[y][x] === Tile.BOMB_CLOSE) {
    map[y][x] = Tile.BOMB_REALLY_CLOSE;
  } else if (map[y][x] === Tile.BOMB_REALLY_CLOSE) {
    explode(x + 0, y - 1, Tile.FIRE);
    explode(x + 0, y + 1, Tile.TMP_FIRE);
    explode(x - 1, y + 0, Tile.FIRE);
    explode(x + 1, y + 0, Tile.TMP_FIRE);
    map[y][x] = Tile.FIRE;
    bombs++;
  } else if (map[y][x] === Tile.TMP_FIRE) {
    map[y][x] = Tile.FIRE;
  } else if (map[y][x] === Tile.FIRE) {
    map[y][x] = Tile.AIR;
  } else if (map[y][x] === Tile.TMP_MONSTER_DOWN) {
    map[y][x] = Tile.MONSTER_DOWN;
  } else if (map[y][x] === Tile.TMP_MONSTER_RIGHT) {
    map[y][x] = Tile.MONSTER_RIGHT;
  } else if (map[y][x] === Tile.MONSTER_RIGHT) {
    if (map[y][x + 1] === Tile.AIR) {
      map[y][x] = Tile.AIR;
      map[y][x + 1] = Tile.TMP_MONSTER_RIGHT;
    } else {
      map[y][x] = Tile.MONSTER_DOWN;
    }
  } else if (map[y][x] === Tile.MONSTER_DOWN) {
    if (map[y + 1][x] === Tile.AIR) {
      map[y][x] = Tile.AIR;
      map[y + 1][x] = Tile.TMP_MONSTER_DOWN;
    } else {
      map[y][x] = Tile.MONSTER_LEFT;
    }
  } else if (map[y][x] === Tile.MONSTER_LEFT) {
    if (map[y][x - 1] === Tile.AIR) {
      map[y][x] = Tile.AIR;
      map[y][x - 1] = Tile.MONSTER_LEFT;
    } else {
      map[y][x] = Tile.MONSTER_UP;
    }
  } else if (map[y][x] === Tile.MONSTER_UP) {
    if (map[y - 1][x] === Tile.AIR) {
      map[y][x] = Tile.AIR;
      map[y - 1][x] = Tile.MONSTER_UP;
    } else {
      map[y][x] = Tile.MONSTER_RIGHT;
    }
  }
}

function createGraphics(): CanvasRenderingContext2D {
  let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      colorOfTile(y, x, g);
      if (map[y][x] !== Tile.AIR)
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

function colorOfTile(y: number, x: number, g: CanvasRenderingContext2D) {
  if (map[y][x] === Tile.UNBREAKABLE) g.fillStyle = "#999999";
  else if (map[y][x] === Tile.STONE) g.fillStyle = "#0000cc";
  else if (map[y][x] === Tile.EXTRA_BOMB) g.fillStyle = "#00cc00";
  else if (map[y][x] === Tile.FIRE) g.fillStyle = "#ffcc00";
  else if (
      map[y][x] === Tile.MONSTER_UP ||
      map[y][x] === Tile.MONSTER_LEFT ||
      map[y][x] === Tile.MONSTER_RIGHT ||
      map[y][x] === Tile.MONSTER_DOWN
  )
    g.fillStyle = "#cc00cc";
  else if (map[y][x] === Tile.BOMB) g.fillStyle = "#770000";
  else if (map[y][x] === Tile.BOMB_CLOSE) g.fillStyle = "#cc0000";
  else if (map[y][x] === Tile.BOMB_REALLY_CLOSE) g.fillStyle = "#ff0000";
}

function drawPlayer(g: CanvasRenderingContext2D) {
  if (!gameOver) {
    g.fillStyle = "#00ff00";
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  gameLoop();
};

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", (e) => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
  else if (e.key === " ") inputs.push(new Place());
});
