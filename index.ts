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

// =====================================================================================================================
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

  canKillPlayer(x: number, y: number) {
    return this.map[y][x].canKillPlayer();
  }

  update() {
    if (--delay > 0) return;
    delay = DELAY;

    for (let y = 1; y < this.map.length; y++) {
      for (let x = 1; x < this.map[y].length; x++) {
        this.map[y][x].update(this, x, y);
      }
    }
  }

  draw(g: CanvasRenderingContext2D) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].draw(x, y, g);
      }
    }
  }

  movePlayer(player: Player, x: number, y: number, dx: number, dy: number) {
    this.map[y + dy][x + dx].move(this, player, dx, dy);
  }

  placeBomb(x: number, y: number) {
    if (bombs > 0) {
      this.map[y][x] = new Bomb(new Init());
      bombs--;
    }
  }

  canGo(x: number, y: number) {
    return this.map[y][x].isAir();
  }

  eatExtraBomb(x: number, y: number) {
    this.map[y][x] = new Air();
    bombs++;
  }

  explode(x: number, y: number) {
    this.map[y - 1][x].explode(this, x, y - 1, new Fire());
    this.map[y + 1][x].explode(this, x, y + 1, new TmpTile(new Fire()));
    this.map[y][x - 1].explode(this, x - 1, y, new Fire());
    this.map[y][x + 1].explode(this, x + 1, y, new TmpTile(new Fire()));
    this.map[y][x] = new Fire();
  }

  explodeBomb(x: number, y: number, tile: Tile) {
    bombs++;
    this.map[y][x] = tile;
  }

  explodeStone(x: number, y: number, tile: Tile) {
    if (Math.random() < 0.1) {
      this.map[y][x] = new ExtraBomb();
      return;
    }
    this.map[y][x] = tile;
  }

  setTile(x: number, y: number, tile: Tile) {
    this.map[y][x] = tile;
  }
}

// =====================================================================================================================
class Player {
  constructor(
    private x: number,
    private y: number) {
  }

  moveToTile(map:Map, dx: number, dy: number) {
    map.movePlayer(this, this.x, this.y, dx, dy)
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  placeBomb(map:Map) {
    map.placeBomb(this.x, this.y);
  }

  eatExtraBomb(map: Map) {
    map.eatExtraBomb(this.x, this.y);
  }

  draw(g: CanvasRenderingContext2D) {
    if (!gameOver) {
      g.fillStyle = "#00ff00";
      g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  isGameOver(map: Map) {
    return gameOver || map.canKillPlayer(this.x, this.y);
  }
}

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

// =====================================================================================================================
interface Input {
  handle(map: Map, player: Player): void;
}

class Left implements Input {
  handle(map: Map, player: Player): void {
    player.moveToTile(map, -1, 0);
  }
}

class Right implements Input {
  handle(map: Map, player: Player): void {
    player.moveToTile(map, 1, 0);
  }
}

class Up implements Input {
  handle(map: Map, player: Player): void {
    player.moveToTile(map, 0, -1);
  }
}

class Down implements Input {
  handle(map: Map, player: Player): void {
    player.moveToTile(map, 0, 1);
  }
}

class Place implements Input {
  handle(map:Map, player: Player): void {
    player.placeBomb(map);
  }
}
// =====================================================================================================================
class MoveStrategy {

  constructor(private sight: Sight) {
  }

  update(map:Map, x: number, y: number): void {
    this.sight = this.sight.next(map, x, y);
    this.sight.go(map, x, y);
  }
}

interface Sight {
  go(map:Map, x: number, y: number): void;

  turnRight(map:Map): Sight;

  next(map:Map, x: number, y: number): Sight;
}

class UpSight implements Sight {
  go(map:Map, x: number, y: number): void {
    if (map.canGo(x, y - 1)) {
      map.setTile(x, y, new Air());
      map.setTile(x, y - 1, new Monster(this));
    }
  }

  turnRight(map:Map): Sight {
    return new RightSight();
  }

  next(map:Map, x: number, y: number): Sight {
    return map.canGo(x, y - 1) ? this : this.turnRight(map);
  }
}

class RightSight implements Sight {
  go(map:Map, x: number, y: number): void {
    if (map.canGo(x + 1, y)) {
      map.setTile(x, y, new Air());
      map.setTile(x + 1, y, new TmpTile(new Monster(this)));
    }
  }

  turnRight(map:Map): Sight {
    return new DownSight();
  }

  next(map: Map, x: number, y: number): Sight {
    return map.canGo(x + 1, y) ? this : this.turnRight(map);
  }
}

class DownSight implements Sight {
  go(map:Map, x: number, y: number): void {
    if (map.canGo(x, y + 1)) {
      map.setTile(x, y, new Air());
      map.setTile(x, y + 1, new TmpTile(new Monster(this)));
    }
  }

  turnRight(map:Map): Sight {
    return new LeftSight();
  }

  next(map: Map, x: number, y: number): Sight {
    return map.canGo(x, y + 1) ? this : this.turnRight(map);
  }
}

class LeftSight implements Sight {
  go(map:Map, x: number, y: number): void {
    if (map.canGo(x - 1, y)) {
      map.setTile(x, y, new Air());
      map.setTile(x - 1, y, new Monster(this));
    }
  }

  turnRight(map:Map): Sight {
    return new UpSight();
  }

  next(map: Map, x: number, y: number): Sight {
    return map.canGo(x - 1, y) ? this : this.turnRight(map);
  }
}
// =====================================================================================================================
interface BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void;
  update(map:Map, x: number, y: number): void;
}

class Init implements BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#770000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  update(map:Map, x: number, y: number): void {
    map.setTile(x, y, new Bomb(new Close()));
  }
}

class Close implements BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  update(map:Map, x: number, y: number): void {
    map.setTile(x, y, new Bomb(new ReallyClose()));
  }
}

class ReallyClose implements BombState {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ff0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  update(map:Map, x: number, y: number): void {
    map.explode(x, y);
    bombs++;
  }
}
// =====================================================================================================================
interface Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void;

  explode(map:Map, x: number, y: number, tile: Tile): void;

  move(map:Map, player: Player, x: number, y: number): void;

  updateGameOver(): void;

  update(map:Map, x: number, y: number): void;

  isAir(): boolean;

  canKillPlayer(): boolean;
}

class Air implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
  }

  explode(map:Map,  x: number, y: number, tile: Tile): void {
    map.setTile(x, y, tile);
  }

  move(map:Map,  player: Player, x: number, y: number): void {
    player.move(x, y);
  }

  updateGameOver(): void {
  }

  update(map:Map, x: number, y: number): void {
  }

  isAir(): boolean {
    return true;
  }

  canKillPlayer(): boolean {
    return false;
  }
}

class Unbreakable implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(map:Map,  x: number, y: number, tile: Tile): void {
  }

  move(map:Map,  player: Player, x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(map:Map, x: number, y: number): void {
  }

  isAir(): boolean {
    return false;
  }

  canKillPlayer(): boolean {
    return false;
  }
}

class Stone implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(map:Map,  x: number, y: number, tile: Tile): void {
    map.explodeStone(x, y, tile);
  }

  move(map:Map,  player: Player, x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(map:Map, x: number, y: number): void {
  }

  isAir(): boolean {
    return false;
  }

  canKillPlayer(): boolean {
    return false;
  }
}

class Bomb implements Tile {

  constructor(private state: BombState) {
  }

  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    this.state.draw(x, y, g);
  }

  explode(map:Map,  x: number, y: number, tile: Tile): void {
    map.explodeBomb(x, y, tile);
  }

  move(map:Map,  player: Player, x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(map:Map, x: number, y: number): void {
    this.state.update(map, x, y);
  }

  isAir(): boolean {
    return false;
  }

  canKillPlayer(): boolean {
    return false;
  }
}

class TmpTile implements Tile {

  constructor(private origin: Tile) {
  }

  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(map:Map,  x: number, y: number, tile: Tile): void {
    map.setTile(x, y, tile);
  }

  move(map:Map,  player: Player, x: number, y: number): void {
  }

  updateGameOver(): void {
  }

  update(map:Map, x: number, y: number): void {
    map.setTile(x, y, this.origin);
  }

  isAir(): boolean {
    return false;
  }

  canKillPlayer(): boolean {
    return false;
  }
}

class Fire implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(map:Map,  x: number, y: number, tile: Tile): void {
    map.setTile(x, y, tile);
  }

  move(map:Map,  player: Player, x: number, y: number): void {
    player.move(x, y);
  }

  updateGameOver(): void {
    gameOver = true;
  }

  update(map:Map, x: number, y: number): void {
    map.setTile(x, y, new Air());
  }

  isAir(): boolean {
    return false;
  }

  canKillPlayer(): boolean {
    return true;
  }
}

class ExtraBomb implements Tile {
  draw(x: number, y: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#00cc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  explode(map:Map,  x: number, y: number, tile: Tile): void {
    map.setTile(x, y, tile);
  }

  move(map:Map,  player: Player, x: number, y: number): void {
    player.move(x, y);
    player.eatExtraBomb(map);
  }

  updateGameOver(): void {
  }

  update(map:Map, x: number, y: number): void {
  }

  isAir(): boolean {
    return false;
  }

  canKillPlayer(): boolean {
    return false;
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

  explode(map:Map,  x: number, y: number, tile: Tile): void {
    map.setTile(x, y, tile);
  }

  move(map:Map,  player: Player, x: number, y: number): void {
  }

  updateGameOver(): void {
    gameOver = true;
  }

  update(map:Map, x: number, y: number): void {
    this.strategy.update(map, x, y);
  }

  isAir(): boolean {
    return false;
  }

  canKillPlayer(): boolean {
    return true;
  }
}
// =====================================================================================================================
function handleInputs(map:Map, player: Player) {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.handle(map, player);
  }
}

function createGraphics() {
  let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function play(map:Map, player: Player) {
  handleInputs(map, player);
  gameOver = player.isGameOver(map);
  map.update();
  let g = createGraphics();
  map.draw(g);
  player.draw(g);
}

function calculateSleep(after: number, before: number) {
  let frameTime = after - before;
  return SLEEP - frameTime;
}

function gameLoop(map:Map, player: Player) {
  let before = Date.now();
  play(map, player);
  let after = Date.now();
  let sleep = calculateSleep(after, before);
  setTimeout(() => gameLoop(map, player), sleep);
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

window.onload = () => {
  let map = new Map();
  let player = new Player(1, 1);
  gameLoop(map, player);
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
