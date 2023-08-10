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

class Loc {
    constructor(private y1: number, private x1: number) {
      this.y = y1;
      this.x = x1;
    }
    x: number;
    y: number;

    getX(): number { return this.x; }
    getY(): number { return this.y; }
}

interface TmpStrategy {
    isTmp(): boolean;
}

class MonsterTmpStrategy implements TmpStrategy {
  constructor(private tmp: boolean) { }
    isTmp(): boolean { return this.tmp; }
}

interface MonsterState {
  nextState(y: number, x: number): MonsterConfiguration;
  nextTile(y: number, x: number): Tile;
  nextLoc(y: number, x: number): Loc;
}

class MonsterStrategy {
  constructor(private state: MonsterState) { }

  updateTile(y: number, x: number, isTmp: boolean): void {
    let st = this.state.nextState(y, x);
    let nextTile = this.state.nextTile(y, x);
    let nextLoc = this.state.nextLoc(y, x);
    map[y][x] = !isTmp && nextTile.isAir()
        ? ((map[y + nextLoc.getY()][x + nextLoc.getX()] = new Monster(st)), new Air()) : new Monster(st);
    // if (!tmpStrat.isTmp() &&  nextTile.isAir()) {
    //   map[y][x] = new Air();
    //   map[y + nextLoc.getY()][x + nextLoc.getX()] = new Monster(st);
    //   return;
    // }
    // map[y][x] = new Monster(st);
  }
}

// up -> is Air? up : right
// right -> is Air? tmpRight : down
// tmpRight -> right
// left -> is Air? left : up
// down -> is Air? tmpDown : left
// tmpDown -> down

class MonsterUpState implements MonsterState {
  nextLoc(y: number, x: number): Loc {
    return new Loc(- 1, 0);
  }

  nextState(y: number, x: number): MonsterConfiguration {
    if (map[y - 1][x].isAir()) {
        return MONSTER_UP;
    }
    return MONSTER_RIGHT;
  }

  nextTile(y: number, x: number): Tile {
    return map[y - 1][x];
  }
}

class MonsterRightState implements MonsterState {
  nextLoc(y: number, x: number): Loc {
    return new Loc(0, 1);
  }
  updateTile(y: number, x: number): void {
    if (map[y][x + 1].isAir()) {
      map[y][x] = new Air();
      map[y][x + 1] = new Monster(TMP_MONSTER_RIGHT);
      return;
    }
    map[y][x] = new Monster(MONSTER_DOWN);
  }

  nextState(y: number, x: number): MonsterConfiguration {
    if (map[y][x + 1].isAir()) {
        return TMP_MONSTER_RIGHT;
    }
    return MONSTER_DOWN;
  }

  nextTile(y: number, x: number): Tile {
    return map[y][x + 1];
  }
}

class MonsterTmpRightState implements MonsterState {
  nextLoc(y: number, x: number): Loc {
    return new Loc(0, 0);
  }

  nextState(y: number, x: number): MonsterConfiguration {
    return MONSTER_RIGHT;
  }

  nextTile(y: number, x: number): Tile {
    return map[y][x];
  }
}

class MonsterLeftState implements MonsterState {
  nextLoc(y: number, x: number): Loc {
    return new Loc(0, -1);
  }

  nextState(y: number, x: number): MonsterConfiguration {
    if (map[y][x - 1].isAir()) {
        return MONSTER_LEFT;
    }
    return MONSTER_UP;
  }

  nextTile(y: number, x: number): Tile {
    return map[y][x - 1];
  }
}

class MonsterDownState implements MonsterState {
  nextLoc(y: number, x: number): Loc {
    return new Loc(1, 0);
  }

  nextState(y: number, x: number): MonsterConfiguration {
    if (map[y + 1][x].isAir()) {
      return TMP_MONSTER_DOWN
    }
    return MONSTER_LEFT;
  }

  nextTile(y: number, x: number): Tile {
    return map[y + 1][x];
  }
}

class MonsterTmpDownState implements MonsterState {
  nextLoc(y: number, x: number): Loc {
    return new Loc(0, 0);
  }

  nextState(y: number, x: number): MonsterConfiguration {
    return MONSTER_DOWN;
  }

  nextTile(y: number, x: number): Tile {
    return map[y][x];
  }
}

class MonsterConfiguration {
  constructor(
      private color: string,
      private state: MonsterState,
      private strategy: TmpStrategy) { }

  isTmp(): boolean { return this.strategy.isTmp(); }
  setColor(g : CanvasRenderingContext2D) { g.fillStyle = this.color; }
  updateTile(y: number, x: number): void {
    new MonsterStrategy(this.state).updateTile(y, x, this.isTmp());
  }
}

const MONSTER_UP = new MonsterConfiguration("#cc00cc", new MonsterUpState(), new MonsterTmpStrategy(false));
const MONSTER_RIGHT = new MonsterConfiguration("#cc00cc", new MonsterRightState(), new MonsterTmpStrategy(false));
const TMP_MONSTER_RIGHT = new MonsterConfiguration(null, new MonsterTmpRightState(), new MonsterTmpStrategy(true));
const MONSTER_DOWN = new MonsterConfiguration("#cc00cc", new MonsterDownState(), new MonsterTmpStrategy(false));
const TMP_MONSTER_DOWN = new MonsterConfiguration(null, new MonsterTmpDownState(), new MonsterTmpStrategy(true));
const MONSTER_LEFT = new MonsterConfiguration("#cc00cc", new MonsterLeftState(), new MonsterTmpStrategy(false));


interface Tile {
  isAir(): boolean;
  isGameOver(): boolean;
  movePlayer(y: number, x: number): void;
  hasBomb(): boolean;
  updateTile(y: number, x: number): void;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  explode(x: number, y: number, type: Tile): void;
}



class Air implements Tile {
  isAir() { return true; }
  isGameOver() { return false; }
  hasBomb() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
  }
  updateTile(y: number, x: number): void {
  }

  movePlayer(y: number, x: number): void {
    playery += y;
    playerx += x;
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }
}

class Unbreakable implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  updateTile(y: number, x: number) {
  }

  movePlayer(y: number, x: number): void {
  }

  explode(x: number, y: number, type: Tile): void {
  }
}

class Stone implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  updateTile(y: number, x: number) {
  }

  movePlayer(y: number, x: number): void {
  }

  explode(x: number, y: number, type: Tile): void {
    if (Math.random() < 0.1) {
      map[y][x] = new ExtraBomb();
      return;
    }
    map[y][x] = type;
  }
}

class Bomb implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }

  hasBomb() { return true; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#770000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(y: number, x: number) {
    map[y][x] = new BombClose()
  }

  movePlayer(y: number, x: number): void {
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }
}

class BombClose implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return true; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#cc0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(y: number, x: number) {
    map[y][x] = new BombReallyClose();
  }

  movePlayer(y: number, x: number): void {
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }
}

class BombReallyClose implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return true; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ff0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(y: number, x: number) {
    map[y - 1][x].explode(x, y - 1, new Fire());
    map[y + 1][x].explode(x, y + 1, new TmpFire());
    map[y][x - 1].explode(x - 1, y, new Fire());
    map[y][x + 1].explode(x + 1, y, new TmpFire());
    map[y][x] = new Fire();
    bombs++;
  }

  movePlayer(y: number, x: number): void {
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }
}

class TmpFire implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(y: number, x: number) {
    map[y][x] = new Fire();
  }

  movePlayer(y: number, x: number): void {
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }
}

class Fire implements Tile {
  isAir() { return false; }
  isGameOver() { return true; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(y: number, x: number) {
    map[y][x] = new Air();
  }

  movePlayer(y: number, x: number): void {
    playery += y;
    playerx += x;
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }
}

class ExtraBomb implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#00cc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(y: number, x: number) {
  }

  movePlayer(y: number, x: number): void {
    playery += y;
    playerx += x;
    bombs++;
    map[playery][playerx] = new Air();
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }
}

class Monster implements Tile {
  private monsterConfig: MonsterConfiguration;
  constructor(private config: MonsterConfiguration) {
    this.monsterConfig = config;
  }

  hasBomb(): boolean { return false; }

  isAir(): boolean { return false; }

  isGameOver(): boolean { return false; }

  movePlayer(y: number, x: number): void {
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.monsterConfig.isTmp()) {
      this.monsterConfig.setColor(g);
    }
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }

  updateTile(y: number, x: number): void {
    this.monsterConfig.updateTile(y, x);
  }
}

interface Input {
  handle(): void;
}

class Right implements Input {
  handle() {
    map[playery][playerx + 1].movePlayer(0, 1);
  }
}

class Left implements Input {
  handle() {
    map[playery][playerx - 1].movePlayer(0, -1);
  }
}
class Up implements Input {
  handle() {
    map[playery - 1][playerx].movePlayer(-1, 0);
  }
}

class Down implements Input {
  handle() {
    map[playery + 1][playerx].movePlayer(1, 0);
  }
}

class Place implements Input {
  handle() {
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
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let map: Tile[][];

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}


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
    case RawTile.MONSTER_UP: return new Monster(MONSTER_UP);
    case RawTile.MONSTER_RIGHT: return new Monster(MONSTER_RIGHT);
    case RawTile.TMP_MONSTER_RIGHT: return new Monster(TMP_MONSTER_RIGHT);
    case RawTile.MONSTER_DOWN: return new Monster(MONSTER_DOWN);
    case RawTile.TMP_MONSTER_DOWN: return new Monster(TMP_MONSTER_DOWN);
    case RawTile.MONSTER_LEFT: return new Monster(MONSTER_LEFT);
    default: return assertExhausted(tile);
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

function placeBomb() {
  if (bombs > 0) {
    map[playery][playerx] = new Bomb();
    bombs--;
  }
}

function update() {
  handleInputs();
  checkIfGameOver();
  updateMap();
}

function checkIfGameOver() {
  if (map[playery][playerx].isGameOver())
    gameOver = true;
}

function handleInputs() {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.handle()
  }
}

function updateMap() {
  if (--delay > 0) return;
  delay = DELAY;

  for (let y = 1; y < map.length; y++) {
    for (let x = 1; x < map[y].length; x++) {
      map[y][x].updateTile(y, x);
    }
  }
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function createGraphics() {
  let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#00ff00";
  if (!gameOver)
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  setSleep(before);
}

function setSleep(before: number) {
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
