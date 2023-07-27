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

interface TmpStrategy {
    isTmp(): boolean;
}

class MonsterTmpStrategy implements TmpStrategy {
  constructor(private tmp: boolean) { }
    isTmp(): boolean { return this.tmp; }
}

interface MonsterState {
  nextState(y: number, x: number): MonsterState;
  isTmp(): boolean;
  updateTile(y: number, x: number): void;
}

class MonsterStrategy {
  constructor(private state: MonsterState) { }
  getState(): MonsterState { return this.state; }

  // updateTile(y: number, x: number): void {
  //   let tmp = this.state.isTmp();
  //   let st = this.state.nextState(y, x);
  //   // console.log("Gaming Console");
  //   console.log(tmp, this.state, st);
  //   // this.state = this.state.nextState(y, x);
  //   // !tmp && map[y - 1][x]?.isAir()
  //   //     ? ([map[y][x], map[y - 1][x]] = [new Air(), tile])
  //   //     : (map[y][x] = tile);
  //   if (tmp && map[y - 1][x].isAir()) {
  //       map[y][x] = new Air();
  //       map[y - 1][x] = new Monster(st);
  //     // ([map[y][x], map[y - 1][x]] = [new Air(), new Monster(this.state.nextState(y, x))])
  //     return;
  //   }
  //   map[y][x] = new Monster(st);
  // }
}

// up -> is Air? up : right
// right -> is Air? tmpRight : down
// tmpRight -> right
// left -> is Air? left : up
// down -> is Air? tmpDown : left
// tmpDown -> down

class MonsterUpState implements MonsterState {
  isTmp(): boolean { return false; }

  nextState(y: number, x: number): MonsterState {
    if (map[y - 1][x].isAir()) {
        return new MonsterUpState();
    }
    return new MonsterRightState();
  }

  updateTile(y: number, x: number): void {
    if (map[y - 1][x].isAir()) {
      map[y][x] = new Air();
      map[y - 1][x] = new Monster(MONSTER_UP);
      return;
    }
    map[y][x] = new Monster(MONSTER_RIGHT);
  }


}

class MonsterRightState implements MonsterState {
  isTmp(): boolean { return false; }

  updateTile(y: number, x: number): void {
    if (map[y][x + 1].isAir()) {
      map[y][x] = new Air();
      map[y][x + 1] = new Monster(TMP_MONSTER_RIGHT);
      return;
    }
    map[y][x] = new Monster(MONSTER_DOWN);
  }

  nextState(y: number, x: number): MonsterState {
    if (map[y][x + 1].isAir()) {
        return new MonsterTmpRightState();
    }
    return new MonsterDownState();
  }
}

class MonsterTmpRightState implements MonsterState {
  isTmp(): boolean { return true; }

  updateTile(y: number, x: number): void {
    map[y][x] = new Monster(MONSTER_RIGHT);
  }

  nextState(y: number, x: number): MonsterState {
    return new MonsterRightState();
  }
}

class MonsterLeftState implements MonsterState {
  isTmp(): boolean { return false; }

  updateTile(y: number, x: number): void {
    if (map[y][x - 1].isAir()) {
      map[y][x] = new Air();
      map[y][x - 1] = new Monster(MONSTER_LEFT);
      return;
    }
    map[y][x] = new Monster(MONSTER_UP);
  }

  nextState(y: number, x: number): MonsterState {
    if (map[y][x - 1].isAir()) {
        return new MonsterLeftState();
    }
    return new MonsterUpState();
  }
}

class MonsterDownState implements MonsterState {
  isTmp(): boolean { return false; }

  updateTile(y: number, x: number): void {
    console.log(this, this.nextState(y, x));
    if (map[y + 1][x].isAir()) {
      map[y][x] = new Air();
      map[y + 1][x] = new Monster(TMP_MONSTER_DOWN);
      return;
    }
    map[y][x] = new Monster(MONSTER_LEFT);
  }

  nextState(y: number, x: number): MonsterState {
    if (map[y + 1][x].isAir()) {
      return new MonsterTmpDownState();
    }
    return new MonsterLeftState();
  }
}

class MonsterTmpDownState implements MonsterState {
  isTmp(): boolean { return true; }

  updateTile(y: number, x: number) {
    map[y][x] = new Monster(MONSTER_DOWN);
  }

  nextState(y: number, x: number): MonsterState {
    return new MonsterDownState();
  }
}

class MonsterConfiguration {
  constructor(
      private color: string,
      private state: MonsterState,
      private strategy: TmpStrategy) { }
  getColor(): string { return this.color; }
  getState(): MonsterState { return this.state; }
  getStrategy(): TmpStrategy { return this.strategy; }
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
  private monsterStrategy: MonsterStrategy;
  constructor(private config: MonsterConfiguration) {
    this.monsterConfig = config;
    this.monsterStrategy = new MonsterStrategy(config.getState());
  }

  hasBomb(): boolean { return false; }

  isAir(): boolean { return false; }

  isGameOver(): boolean { return false; }

  movePlayer(y: number, x: number): void {
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.monsterConfig.getStrategy().isTmp()) {
      g.fillStyle = this.monsterConfig.getColor();
    }
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile): void {
    if (map[y][x].hasBomb())
      bombs++;
    map[y][x] = type;
  }

  updateTile(y: number, x: number): void {
    this.monsterStrategy.getState().updateTile(y, x);
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
