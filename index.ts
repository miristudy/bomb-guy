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
  MONSTER_LEFT,
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
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let map: Tile[][] = [];

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

interface Input {
  handle(): void;
}

class Left implements Input {
  handle(): void {
    map[playery][playerx - 1].move(-1, 0);
  }
}

class Right implements Input {
  handle(): void {
    map[playery][playerx + 1].move(1, 0);
  }
}

class Up implements Input {
  handle(): void {
    map[playery - 1][playerx].move(0, -1);
  }
}

class Down implements Input {
  handle(): void {
    map[playery + 1][playerx].move(0, 1);
  }
}

class Place implements Input {
  handle(): void {
    if (bombs > 0) {
      map[playery][playerx] = new Bomb(new Init());
      bombs--;
    }
  }
}

interface Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void;

  explode(x: number, y: number, tile: Tile): void;

  move(x: number, y: number): void;

  updateGameOver(): void;

  update(x: number, y: number): void;

  isAir(): boolean;
}

class Air implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
  }

  explode(x: number, y: number, tile: Tile): void {
    map[y][x] = tile;
  }

  move(x: number, y: number): void {
    playery += y;
    playerx += x;
  }

  updateGameOver(): void {
  }

  update(x: number, y: number): void {
  }

  isAir(): boolean {
    return true;
  }
}

class Unbreakable implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, tile: Tile): void {
  }

  move(x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(x: number, y: number): void {
  }

  isAir(): boolean {
    return false;
  }
}

class Stone implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, tile: Tile): void {
    if (Math.random() < 0.1) {
      map[y][x] = new ExtraBomb();
      return;
    }
    map[y][x] = tile;
  }

  move(x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(x: number, y: number): void {
  }

  isAir(): boolean {
    return false;
  }
}

interface BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void;
  update(x: number, y: number): void;
}

class Init implements BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#770000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  update(x: number, y: number): void {
    map[y][x] = new Bomb(new Close());
  }
}

class Close implements BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  update(x: number, y: number): void {
    map[y][x] = new Bomb(new ReallyClose());
  }
}

class ReallyClose implements BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ff0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  update(x: number, y: number): void {
    this.explodeAround(y, x);
    map[y][x] = new Fire();
    bombs++;
  }

  private explodeAround(y: number, x: number): void {
    map[y - 1][x].explode(x, y - 1, new Fire());
    map[y + 1][x].explode(x, y + 1, new TmpTile(new Fire()));
    map[y][x - 1].explode(x - 1, y, new Fire());
    map[y][x + 1].explode(x + 1, y, new TmpTile(new Fire()));
  }
}

class Bomb implements Tile {

  constructor(private state: BombState) {
  }

  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.state.draw(x, y, g);
  }

  explode(x: number, y: number, tile: Tile): void {
    bombs++;
    map[y][x] = tile;
  }

  move(x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(x: number, y: number): void {
    this.state.update(x, y);
  }

  isAir(): boolean {
    return false;
  }
}

class TmpTile implements Tile {

  constructor(private origin: Tile) {
  }

  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, tile: Tile): void {
    map[y][x] = tile;
  }

  move(x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(x: number, y: number): void {
    map[y][x] = this.origin;
  }

  isAir(): boolean {
    return false;
  }
}

class Fire implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, tile: Tile): void {
    map[y][x] = tile;
  }

  move(x: number, y: number): void {
    playery += y;
    playerx += x;
  }

  updateGameOver(): void {
    gameOver = true;
  }

  update(x: number, y: number): void {
    map[y][x] = new Air();
  }

  isAir(): boolean {
    return false;
  }
}

class ExtraBomb implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#00cc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, tile: Tile): void {
    map[y][x] = tile;
  }

  move(x: number, y: number): void {
    playery += y;
    playerx += x;
    bombs++;
    map[playery][playerx] = new Air();
  }

  updateGameOver(): void {
  }

  update(x: number, y: number): void {
  }

  isAir(): boolean {
    return false;
  }
}

class MoveStrategy {

  constructor(private sight: Sight) {
  }

  update(x: number, y: number): void {
    this.sight = this.sight.canGo(x, y) ? this.sight : this.sight.turnRight();
    this.sight.go(x, y);
  }
}

interface Sight {
  canGo(x: number, y: number): boolean;

  go(x: number, y: number): void;

  turnRight(): Sight;
}

class UpSight implements Sight {
  canGo(x: number, y: number): boolean {
    return map[y - 1][x].isAir();
  }

  go(x: number, y: number): void {
    if (this.canGo(x, y)) {
      map[y][x] = new Air();
      map[y - 1][x] = new Monster(this);
    }
  }

  turnRight(): Sight {
    return new RightSight();
  }
}

class RightSight implements Sight {
  canGo(x: number, y: number): boolean {
    return map[y][x + 1].isAir();
  }

  go(x: number, y: number): void {
    if (this.canGo(x, y)) {
      map[y][x] = new Air();
      map[y][x + 1] = new TmpTile(new Monster(this));
    }
  }

  turnRight(): Sight {
    return new DownSight();
  }
}

class DownSight implements Sight {
  canGo(x: number, y: number): boolean {
    return map[y + 1][x].isAir();
  }

  go(x: number, y: number): void {
    if (this.canGo(x, y)) {
      map[y][x] = new Air();
      map[y + 1][x] = new TmpTile(new Monster(this));
    }
  }

  turnRight(): Sight {
    return new LeftSight();
  }
}

class LeftSight implements Sight {
  canGo(x: number, y: number): boolean {
    return map[y][x - 1].isAir();
  }

  go(x: number, y: number): void {
    if (this.canGo(x, y)) {
      map[y][x] = new Air();
      map[y][x - 1] = new Monster(this);
    }
  }

  turnRight(): Sight {
    return new UpSight();
  }
}

class Monster implements Tile {

  private strategy: MoveStrategy;
  
  constructor(sight: Sight) {
    this.strategy = new MoveStrategy(sight);
  }
  
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, tile: Tile): void {
    map[y][x] = tile;
  }

  move(x: number, y: number): void {
  }

  updateGameOver(): void {
    gameOver = true;
  }

  update(x: number, y: number): void {
    this.strategy.update(x, y);
  }

  isAir(): boolean {
    return false;
  }
}

function handleInputs() {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.handle();
  }
}

function updateGameOver() {
  map[playery][playerx].updateGameOver();
}

function updateMap() {
  if (--delay > 0) return;
  delay = DELAY;

  for (let y = 1; y < map.length; y++) {
    for (let x = 1; x < map[y].length; x++) {
      map[y][x].update(x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  if (!gameOver) {
    g.fillStyle = "#00ff00";
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(x, y, g);
    }
  }
}

function createGraphics() {
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

function play() {
  handleInputs();
  updateGameOver();
  updateMap();
  draw();
}

function calculateSleep(after: number, before: number) {
  let frameTime = after - before;
  return SLEEP - frameTime;
}

function gameLoop() {
  let before = Date.now();
  play();
  let after = Date.now();
  let sleep = calculateSleep(after, before);
  setTimeout(() => gameLoop(), sleep);
}

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function transformTile(tile: RawTile): Tile {
  switch (tile) {
    case RawTile.AIR:
      return new Air();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.STONE:
      return new Stone();
    case RawTile.BOMB:
      return new Bomb(new Init());
    case RawTile.BOMB_CLOSE:
      return new Bomb(new Close());
    case RawTile.BOMB_REALLY_CLOSE:
      return new Bomb(new ReallyClose());
    case RawTile.TMP_FIRE:
      return new TmpTile(new Fire());
    case RawTile.FIRE:
      return new Fire();
    case RawTile.EXTRA_BOMB:
      return new ExtraBomb();
    case RawTile.MONSTER_UP:
      return new Monster(new UpSight());
    case RawTile.MONSTER_RIGHT:
      return new Monster(new RightSight());
    case RawTile.TMP_MONSTER_RIGHT:
      return new TmpTile(new Monster(new RightSight()));
    case RawTile.MONSTER_DOWN:
      return new Monster(new DownSight());
    case RawTile.TMP_MONSTER_DOWN:
      return new TmpTile(new Monster(new DownSight()));
    case RawTile.MONSTER_LEFT:
      return new Monster(new LeftSight());
    default:
      return assertExhausted(tile);
  }
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
