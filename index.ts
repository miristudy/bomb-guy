const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
const TPS = 2;
const DELAY = FPS / TPS;

enum RawTile {
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
  MONSTER_LEFT
}

interface Tile {
  explode(x: number, y: number, type: Tile): void;
  move(x: number, y: number): void;
  gameover(): void;
  update(x: number, y: number): void;
  moveUpToThis(x: number, y: number): void;
  moveDownTothis(x: number, y: number): void;
  moveLeftToThis(x: number, y: number): void;
  moveRightToThis(x: number, y: number): void;
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void;
  colorCode: string;
}

class BaseTile implements Tile {
  explode(x: number, y: number, type: Tile): void {
    map[y][x] = type;
  }
  move(x: number, y: number): void {}
  gameover(): void {}
  update(x: number, y: number): void {}
  moveUpToThis(x: number, y: number): void {
    map[y][x] = new MonsterRight();
  }
  moveDownTothis(x: number, y: number): void {
    map[y][x] = new MonsterLeft();
  }
  moveLeftToThis(x: number, y: number): void {
    map[y][x] = new MonsterUp();
  }
  moveRightToThis(x: number, y: number): void {
    map[y][x] = new MonsterDown();
  }
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  colorCode: string = null;
}

class Air implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {}
  colorCode: string = this.baseTile.colorCode;
  moveDownTothis(x: number, y: number): void {
    map[y][x] = new Air();
    map[y + 1][x] = new TmpMonsterDown();
  }
  moveLeftToThis(x: number, y: number): void {
    map[y][x] = new Air();
    map[y][x - 1] = new MonsterLeft();
  }
  moveRightToThis(x: number, y: number): void {
    map[y][x] = new Air();
    map[y][x + 1] = new TmpMonsterRight();
  }
  moveUpToThis(x: number, y: number): void {
    map[y][x] = new Air();
    map[y - 1][x] = new MonsterUp();
  }
  update(x: number, y: number): void {
    this.baseTile.update(x, y);
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    playery += y;
    playerx += x;
  }
}

class Unbreakable implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#999999";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    this.baseTile.update(x, y);
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {}
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class Stone implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#0000cc";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    this.baseTile.update(x, y);
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    if (Math.random() < 0.1)
      map[y][x] = new ExtraBomb();
    else
      map[y][x] = type;
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class Bomb implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#770000";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y][x] = new BombClose();
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    bombs++;
    map[y][x] = type;
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class BombClose implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#cc0000";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y][x] = new BombReallyClose();
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    bombs++;
    map[y][x] = type;
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class BombReallyClose implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#ff0000";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    explode(x + 0, y - 1, new Fire());
    explode(x + 0, y + 1, new TmpFire());
    explode(x - 1, y + 0, new Fire());
    explode(x + 1, y + 0, new TmpFire());
    bombs++;
    map[y][x] = new Fire();
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    bombs++;
    map[y][x] = type;
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class TmpFire implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = this.baseTile.colorCode;
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y][x] = new Fire();
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class Fire implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#ffcc00";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y][x] = new Air();
  }
  gameover(): void {
    gameOver = true;
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    playery += y;
    playerx += x;
  }
}

class ExtraBomb implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#00cc00";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    this.baseTile.update(x, y);
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    playery += y;
    playerx += x;
    bombs++;
    map[playery][playerx] = new Air();
  }
}

class MonsterUp implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#cc00cc";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y - 1][x].moveUpToThis(x, y);
  }
  gameover(): void {
    gameOver = true;
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class MonsterRight implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#cc00cc";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y][x + 1].moveRightToThis(x, y);
  }
  gameover(): void {
    gameOver = true;
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class TmpMonsterRight implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = this.baseTile.colorCode;
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class MonsterDown implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#cc00cc";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y + 1][x].moveDownTothis(x, y);
  }
  gameover(): void {
    gameOver = true;
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class TmpMonsterDown implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = this.baseTile.colorCode;
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  gameover(): void {
    this.baseTile.gameover();
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

class MonsterLeft implements Tile {
  private baseTile = new BaseTile();
  fillRect(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.baseTile.fillRect(x, y, g);
  }
  colorCode: string = "#cc00cc";
  moveDownTothis(x: number, y: number): void {
    this.baseTile.moveDownTothis(x, y);
  }
  moveLeftToThis(x: number, y: number): void {
    this.baseTile.moveLeftToThis(x, y);
  }
  moveRightToThis(x: number, y: number): void {
    this.baseTile.moveRightToThis(x, y);
  }
  moveUpToThis(x: number, y: number): void {
    this.baseTile.moveUpToThis(x, y);
  }
  update(x: number, y: number): void {
    map[y][x - 1].moveLeftToThis(x, y);
  }
  gameover(): void {
    gameOver = true;
  }
  explode(x: number, y: number, type: Tile): void {
    this.baseTile.explode(x, y, type);
  }
  move(x: number, y: number): void {
    this.baseTile.move(x, y);
  }
}

interface Input {
  move(): void;
}

class Up implements Input {
  move(): void {
    move(0, -1);
  }
}

class Down implements Input {
  move(): void {
    move(0, 1);
  }
}

class Left implements Input {
  move(): void {
    move(-1, 0);
  }
}

class Right implements Input {
  move(): void {
    move(1, 0);
  }
}

class Place implements Input {
  move(): void {
    placeBomb();
  }
}

let playerx = 1;
let playery = 1;

let rawMap: RawTile[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 2, 2, 2, 1],
  [1, 0, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 0, 0, 0, 1],
  [1, 2, 1, 2, 1, 0, 1, 0, 1],
  [1, 2, 2, 2, 2, 0, 0, 10, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let map: Tile[][] = [
];

function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new Air();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.STONE: return new Stone();
    case RawTile.BOMB: return new Bomb();
    case RawTile.BOMB_CLOSE: return new BombClose();
    case RawTile.BOMB_REALLY_CLOSE: return new BombReallyClose();
    case RawTile.TMP_FIRE: return new TmpFire();
    case RawTile.FIRE: return new Fire();
    case RawTile.EXTRA_BOMB: return new ExtraBomb();
    case RawTile.MONSTER_UP: return new MonsterUp();
    case RawTile.MONSTER_RIGHT: return new MonsterRight();
    case RawTile.TMP_MONSTER_RIGHT: return new TmpMonsterRight();
    case RawTile.MONSTER_DOWN: return new MonsterDown();
    case RawTile.TMP_MONSTER_DOWN: return new TmpMonsterDown();
    case RawTile.MONSTER_LEFT: return new MonsterLeft();
    default: assertExhausted(tile);
  }
}

function assertExhausted(x: RawTile): never {
  throw new Error("Unexpected object: " + x);
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

function explode(x: number, y: number, type: Tile) {
  type.explode(x, y, type);
}

function move(x: number, y: number) {
  map[playery + y][playerx + x].move(x, y);
}

function placeBomb() {
  if (bombs > 0) {
    map[playery][playerx] = new Bomb();
    bombs--;
  }
}

function update() {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.move();
  }

  map[playery][playerx].gameover();

  if (--delay > 0) return;
  delay = DELAY;

  for (let y = 1; y < map.length; y++) {
    for (let x = 1; x < map[y].length; x++) {
      map[y][x].update(x, y);
    }
  }
}

function draw() {
  let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].colorCode != null)
        g.fillStyle = map[y][x].colorCode;

      map[y][x].fillRect(x, y, g);
    }
  }

  // Draw player
  drawPlayer(g);
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
  transformMap();
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