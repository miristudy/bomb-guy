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

interface Tile {
    move(x: number, y: number): void;
    updateTile(y: number, x: number): void;
    draw(y: number, x:number, g: CanvasRenderingContext2D): void;
    explode(x: number, y: number, type: Tile): void;
    isBomb(): boolean;
    isKillable(): boolean;
    updateMonsterUp(y: number, x: number): void;
    updateMonsterRight(y: number, x: number): void;
    updateMonsterDown(y: number, x: number): void;
    updateMonsterLeft(y: number, x: number): void;
}

class Air implements Tile {
  move(x: number, y: number) {
      playery += y;
      playerx += x;
  }

  updateTile(y: number, x: number) {
    // do nothing
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    // do nothing
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number): void {
    map[y][x] = new Air();
    map[y - 1][x] = new MonsterUp();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new Air();
    map[y][x + 1] = new TmpMonsterRight();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new Air();
    map[y + 1][x] = new TmpMonsterDown();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new Air();
    map[y][x - 1] = new MonsterLeft();
  }
}

class Unbreakable implements Tile {
  move(x: number, y: number) {
      // do nothing
  }

  updateTile(y: number, x: number) {
    // do nothing
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    // do nothing
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class Stone implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    // do nothing
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    if (Math.random() < 0.1)
      map[y][x] = new ExtraBomb();
    else
      map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

enum BombState {
  BOMB, CLOSE, REALLY_CLOSE
}

class Bomb implements Tile {

  constructor(private bombState: BombState, private color: string) {
  }

  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    if (this.bombState === BombState.BOMB) {
      map[y][x] = new Bomb(BombState.CLOSE, "#cc0000");
    } else if (this.bombState === BombState.CLOSE) {
      map[y][x] = new Bomb(BombState.REALLY_CLOSE, "#ff0000");
    } else if (this.bombState === BombState.REALLY_CLOSE) {
      map[y - 1][x + 0].explode(x + 0, y - 1, new Fire());
      map[y + 1][x + 0].explode(x + 0, y + 1, new TmpFire());
      map[y + 0][x - 1].explode(x - 1, y + 0, new Fire());
      map[y + 0][x + 1].explode(x + 1, y + 0, new TmpFire());
      map[y][x] = new Fire();
      bombs++;
    }
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = this.color;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return true;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class TmpFire implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    map[y][x] = new Fire();
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class Fire implements Tile {
  move(x: number, y: number) {
    playery += y;
    playerx += x;
  }

  updateTile(y: number, x: number) {
    map[y][x] = new Air();
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return true;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class ExtraBomb implements Tile {
  move(x: number, y: number) {
    playery += y;
    playerx += x;
    bombs++;
    map[playery][playerx] = new Air();
  }

  updateTile(y: number, x: number) {
    // do nothing
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#00cc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class MonsterUp implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    map[y - 1][x].updateMonsterUp(y, x);
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#cc00cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return true;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class MonsterRight implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    map[y][x + 1].updateMonsterRight(y, x);
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#cc00cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return true;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class TmpMonsterRight implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class MonsterDown implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    map[y + 1][x].updateMonsterDown(y, x);
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#cc00cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return true;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class TmpMonsterDown implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    map[y][x] = new MonsterDown();
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return false;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

class MonsterLeft implements Tile {
  move(x: number, y: number) {
    // do nothing
  }

  updateTile(y: number, x: number) {
    map[y][x - 1].updateMonsterLeft(y, x);
  }

  draw(y: number, x:number, g: CanvasRenderingContext2D) {
    g.fillStyle = "#cc00cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(x: number, y: number, type: Tile) {
    addBomb(y, x);
    map[y][x] = type;
  }

  isBomb(): boolean {
    return false;
  }

  isKillable(): boolean {
    return true;
  }

  updateMonsterUp(y: number, x: number) {
    map[y][x] = new MonsterRight();
  }

  updateMonsterRight(y: number, x: number): void {
    map[y][x] = new MonsterDown();
  }

  updateMonsterDown(y: number, x: number): void {
    map[y][x] = new MonsterLeft();
  }

  updateMonsterLeft(y: number, x: number): void {
    map[y][x] = new MonsterUp();
  }
}

interface Input {
  handle(): void;
}

class Up implements Input {
  handle() {
    move(0, -1);
  }
}

class Down implements Input {
  handle() {
    move(0, 1);
  }
}

class Left implements Input {
  handle() {
    move(-1, 0);
  }
}

class Right implements Input {
  handle() {
    move(1, 0);
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

function addBomb(y: number, x: number) {
  if (map[y][x].isBomb())
    bombs++;
}

function move(x: number, y: number) {
  map[playery + y][playerx + x].move(x, y);
}

function placeBomb() {
  if (bombs > 0) {
    map[playery][playerx] = new Bomb(BombState.BOMB, "770000");
    bombs--;
  }
}

function checkGameOver() {
  if (map[playery][playerx].isKillable())
    gameOver = true;
}

function handleAllInputs() {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.handle();
  }
}

function updateMap() {
  for (let y = 1; y < map.length; y++) {
    for (let x = 1; x < map[y].length; x++) {
      map[y][x].updateTile(y, x);
    }
  }
}

function update() {
  handleAllInputs();
  checkGameOver();

  if (--delay > 0)
    return;
  delay = DELAY;

  updateMap();
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(y, x, g)
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  if (!gameOver) {
    g.fillStyle = "#00ff00";
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

function createGraphic() {
  let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphic();
  drawMap(g);
  drawPlayer(g);
}

function loopRecursively(after: number, before: number) {
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  loopRecursively(after, before);
}

window.onload = () => {
  transformMap();
  gameLoop();
};

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";

function handleKeyboardEvent(e: KeyboardEvent) {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
  else if (e.key === " ") inputs.push(new Place());
}

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function transformTile(rawTile: RawTile): Tile {
  switch (rawTile) {
    case RawTile.AIR:
      return new Air();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.STONE:
      return new Stone();
    case RawTile.BOMB:
      return new Bomb(BombState.BOMB, "#770000");
    case RawTile.BOMB_CLOSE:
      return new Bomb(BombState.CLOSE, "#cc0000");
    case RawTile.BOMB_REALLY_CLOSE:
      return new Bomb(BombState.REALLY_CLOSE, "#ff0000");
    case RawTile.TMP_FIRE:
      return new TmpFire();
    case RawTile.FIRE:
      return new Fire();
    case RawTile.EXTRA_BOMB:
      return new ExtraBomb();
    case RawTile.MONSTER_UP:
      return new MonsterUp();
    case RawTile.MONSTER_RIGHT:
      return new MonsterRight();
    case RawTile.TMP_MONSTER_RIGHT:
      return new TmpMonsterRight();
    case RawTile.MONSTER_DOWN:
      return new MonsterDown();
    case RawTile.TMP_MONSTER_DOWN:
      return new TmpMonsterDown();
    case RawTile.MONSTER_LEFT:
      return new MonsterLeft();
    default:
      return assertExhausted(rawTile);
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

window.addEventListener("keydown", (e) => {
  handleKeyboardEvent(e);
});
