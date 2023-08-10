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

class Player {
  private x = 1;
  private y = 1;

  checkIfGameOver(map: Map) {
    if (map.isGameOver(this.y, this.x))
      gameOver = true;
  }

  movePlayer(map: Map, y: number, x: number) {
    map.movePlayer(this, y, x, this.y, this.x);
  }

  updatePlayer(y: number, x: number) {
    this.y += y;
    this.x += x;
  }

  updatePlayerToAir(map: Map, y: number, x: number) {
    this.updatePlayer(y, x);
    bombs++;
    map.setTile(this.y, this.x, new Air());
  }

  placeBomb(map: Map) {
    if (bombs > 0) {
      map.setTile(this.y, this.x, new Bomb());
      bombs--;
    }
  }

  drawPlayer(g: CanvasRenderingContext2D) {
    g.fillStyle = "#00ff00";
    if (!gameOver)
      g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

class Map {
  private readonly map: Tile[][];

  constructor() {
    this.map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
      this.map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this.map[y][x] = transformTile(rawMap[y][x]);
      }
    }
  }

  update() {
    if (--delay > 0) return;
    delay = DELAY;

    for (let y = 1; y < this.map.length; y++) {
      for (let x = 1; x < this.map[y].length; x++) {
        this.map[y][x].updateTile(this, y, x);
      }
    }
  }

  draw(g: CanvasRenderingContext2D) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].draw(g, x, y);
      }
    }
  }

  isGameOver(y: number, x: number): boolean {
    return this.map[y][x].isGameOver();
  }

  movePlayer(player: Player, y: number, x: number, playerY: number, playerX: number) {
    this.map[playerY + y][playerX + x].movePlayer(this, player, y, x);
  }

  setTile(y: number, x: number, tile: Tile) {
    this.map[y][x] = tile;
  }

  explode(y: number, x: number, type: Tile) {
    this.map[y][x].explode(this, x, y, type);
  }

  hasBomb(y: number, x: number): boolean {
    return this.map[y][x].hasBomb();
  }

  isAir(y: number, x: number): boolean {
    return this.map[y][x].isAir();
  }
}

interface TmpStrategy {
    isTmp(): boolean;
}

class MonsterTmpStrategy implements TmpStrategy {
  constructor(private tmp: boolean) { }
    isTmp(): boolean { return this.tmp; }
}

interface MonsterState {
  nextState(map: Map, y: number, x: number): MonsterConfiguration;
  nextIsAir(map: Map, y: number, x: number): boolean;
  setNextTile(map: Map, y: number, x: number, tile: Tile): void;
}

class MonsterStrategy {
  constructor(private state: MonsterState) { }

  updateTile(map: Map, y: number, x: number, isTmp: boolean): void {
    let st = this.state.nextState(map, y, x);
    if (!isTmp &&  this.state.nextIsAir(map, y, x)) {
      map.setTile(y, x, new Air());
      this.state.setNextTile(map, y, x, new Monster(st));
      return;
    }
    map.setTile(y, x, new Monster(st));
  }
}

// up -> is Air? up : right
// right -> is Air? tmpRight : down
// tmpRight -> right
// left -> is Air? left : up
// down -> is Air? tmpDown : left
// tmpDown -> down

class MonsterUpState implements MonsterState {

  nextState(map: Map, y: number, x: number): MonsterConfiguration {
    if (map.isAir(y - 1, x)) {
        return MONSTER_UP;
    }
    return MONSTER_RIGHT;
  }

  nextIsAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y - 1, x);
  }

  setNextTile(map: Map, y: number, x: number, tile: Tile): void {
    map.setTile(y - 1, x, tile);
  }
}

class MonsterRightState implements MonsterState {
  nextState(map: Map, y: number, x: number): MonsterConfiguration {
    if (map.isAir(y, x + 1)) {
        return TMP_MONSTER_RIGHT;
    }
    return MONSTER_DOWN;
  }

  nextIsAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x + 1);
  }

  setNextTile(map: Map, y: number, x: number, tile: Tile): void {
    map.setTile(y, x + 1, tile);
  }
}

class MonsterTmpRightState implements MonsterState {

  nextState(map: Map, y: number, x: number): MonsterConfiguration {
    return MONSTER_RIGHT;
  }

  nextIsAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x);
  }

  setNextTile(map: Map, y: number, x: number, tile: Tile): void {
    map.setTile(y, x, tile);
  }
}

class MonsterLeftState implements MonsterState {

  nextState(map: Map, y: number, x: number): MonsterConfiguration {
    if (map.isAir(y, x - 1)) {
        return MONSTER_LEFT;
    }
    return MONSTER_UP;
  }

  nextIsAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x - 1);
  }

  setNextTile(map: Map, y: number, x: number, tile: Tile): void {
    map.setTile(y, x - 1, tile);
  }
}

class MonsterDownState implements MonsterState {
  nextState(map: Map, y: number, x: number): MonsterConfiguration {
    if (map.isAir(y + 1, x)) {
      return TMP_MONSTER_DOWN
    }
    return MONSTER_LEFT;
  }

  nextIsAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y + 1, x);
  }

  setNextTile(map: Map, y: number, x: number, tile: Tile): void {
    map.setTile(y + 1, x, tile);
  }
}

class MonsterTmpDownState implements MonsterState {
  nextState(map: Map, y: number, x: number): MonsterConfiguration {
    return MONSTER_DOWN;
  }

  nextIsAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x);
  }

  setNextTile(map: Map, y: number, x: number, tile: Tile): void {
    map.setTile(y, x, tile);
  }

}

class MonsterConfiguration {
  constructor(
      private color: string,
      private state: MonsterState,
      private strategy: TmpStrategy) { }

  isTmp(): boolean { return this.strategy.isTmp(); }
  setColor(g : CanvasRenderingContext2D) { g.fillStyle = this.color; }
  updateTile(map: Map, y: number, x: number): void {
    new MonsterStrategy(this.state).updateTile(map, y, x, this.isTmp());
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
  movePlayer(map: Map, player: Player, y: number, x: number): void;
  hasBomb(): boolean;
  updateTile(map: Map, y: number, x: number): void;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  explode(map: Map, x: number, y: number, type: Tile): void;
}



class Air implements Tile {
  isAir() { return true; }
  isGameOver() { return false; }
  hasBomb() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
  }
  updateTile(map: Map, y: number, x: number): void {
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
    player.updatePlayer(y, x);
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y ,x))
      bombs++;
    map.setTile(y, x, type);
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
  updateTile(map: Map, y: number, x: number) {
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
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
  updateTile(map: Map, y: number, x: number) {
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (Math.random() < 0.1) {
      map.setTile(y, x, new ExtraBomb());
      return;
    }
    map.setTile(y, x, type);
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

  updateTile(map: Map, y: number, x: number) {
    map.setTile(y, x, new BombClose());
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y, x))
      bombs++;
    map.setTile(y, x, type);
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

  updateTile(map: Map, y: number, x: number) {
    map.setTile(y, x, new BombReallyClose());
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y ,x))
      bombs++;
    map.setTile(y, x, type);
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

  updateTile(map: Map, y: number, x: number) {
    map.explode(y - 1, x, new Fire());
    map.explode(y + 1, x, new TmpFire());
    map.explode(y, x - 1, new Fire());
    map.explode(y, x + 1, new TmpFire());
    map.setTile(y, x, new Fire());
    bombs++;
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y ,x))
      bombs++;
    map.setTile(y, x, type);
  }
}

class TmpFire implements Tile {
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, y: number, x: number) {
    map.setTile(y, x, new Fire());
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y ,x))
      bombs++;
    map.setTile(y, x, type);
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

  updateTile(map: Map, y: number, x: number) {
    map.setTile(y, x, new Air());
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
    player.updatePlayer(y, x);
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y ,x))
      bombs++;
    map.setTile(y, x, type);
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

  updateTile(map: Map, y: number, x: number) {
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
    player.updatePlayerToAir(map, y, x);
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y ,x))
      bombs++;
    map.setTile(y, x, type);
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

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.monsterConfig.isTmp()) {
      this.monsterConfig.setColor(g);
    }
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
    if (map.hasBomb(y ,x))
      bombs++;
    map.setTile(y, x, type);
  }

  updateTile(map: Map, y: number, x: number): void {
    this.monsterConfig.updateTile(map, y, x);
  }
}

interface Input {
  handle(map: Map, player: Player): void;
}

class Right implements Input {
  handle(map: Map, player: Player) {
    player.movePlayer(map,0, 1);
  }
}

class Left implements Input {
  handle(map: Map, player: Player) {
    player.movePlayer(map,0, -1);
  }
}
class Up implements Input {
  handle(map: Map, player: Player) {
    player.movePlayer(map,-1, 0);
  }
}

class Down implements Input {
  handle(map: Map, player: Player) {
    player.movePlayer(map,1, 0);
  }
}

class Place implements Input {
  handle(map: Map, player: Player) {
    player.placeBomb(map);
  }
}
let player = new Player();
// let playerx = 1;
// let playery = 1;
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
// let map: Tile[][];
let map = new Map();

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

// function transformMap() {
//   map = new Array(rawMap.length);
//   for (let y = 0; y < rawMap.length; y++) {
//     map[y] = new Array(rawMap[y].length);
//     for (let x = 0; x < rawMap[y].length; x++) {
//       map[y][x] = transformTile(rawMap[y][x]);
//     }
//   }
// }

function update(map: Map, player: Player) {
  handleInputs(map, player);
  player.checkIfGameOver(map);
  map.update();
}

function handleInputs(map: Map, player: Player) {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.handle(map, player)
  }
}

// function updateMap() {
//   if (--delay > 0) return;
//   delay = DELAY;
//
//   for (let y = 1; y < map.length; y++) {
//     for (let x = 1; x < map[y].length; x++) {
//       map[y][x].updateTile(y, x);
//     }
//   }
// }

function draw(map: Map, player: Player) {
  let g = createGraphics();
  map.draw(g);
  player.drawPlayer(g);
}

function createGraphics() {
  let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

// function drawMap(g: CanvasRenderingContext2D) {
//   for (let y = 0; y < map.length; y++) {
//     for (let x = 0; x < map[y].length; x++) {
//       map[y][x].draw(g, x, y);
//     }
//   }
// }

function gameLoop() {
  let before = Date.now();
  update(map, player);
  draw(map, player);
  setSleep(before);
}

function setSleep(before: number) {
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
