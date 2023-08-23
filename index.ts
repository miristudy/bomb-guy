const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
const TPS = 2;
const DELAY = FPS / TPS;

enum Direction {
  left = "left",
  right = "right",
  up = "up",
  down = "down"
}

type Nodes = {
  x: number;
  y: number;
  dir: Direction;
};

const nodeDirections: Nodes[] = [
    { x: 0, y: -1, dir: Direction.up },
    { x: 0, y: 1, dir: Direction.down },
    { x: -1, y: 0, dir: Direction.left },
    { x: 1, y: 0, dir: Direction.right }
]

const oppositeDirection: {[key: string]: Direction} = {
    [Direction.left]: Direction.right,
    [Direction.right]: Direction.left,
    [Direction.up]: Direction.down,
    [Direction.down]: Direction.up
}

class PathFinder {
  private readonly map: Tile[][];
  // private readonly seen: {[key: string]: boolean}

  constructor(map: Tile[][]) {
    this.map = map;
    // this.seen = {};
  }

  findShortestPath(playerY: number, playerX: number, y: number, x: number): Direction | null {
    let queue: Nodes[] = [{ x: playerX, y: playerY, dir: null }];
    let seen: {[key: string]: boolean } = {};

    return this.processQueue(queue, seen, y, x);
  }

  private processQueue(queue: Nodes[], seen: { [key: string]: boolean }, y: number, x: number): Direction | null {
    while (queue.length > 0) {
      let curr = queue.shift()!;
      if (this.isMonsterFound(curr, y, x)) {
        return oppositeDirection[curr.dir];
      }
      this.processDirections(curr, queue, seen);
    }
    return null;
  }

  private isMonsterFound(node: Nodes, y: number, x: number): boolean {
    return this.map[node.y][node.x].isMonster() && y == node.y && x == node.x;
  }

  private processDirections(currentNode: Nodes, queue: Nodes[], seen: { [key: string]: boolean }): void {
    for (let dir of nodeDirections) {
      this.moveInDirection(dir, currentNode, queue, seen);
    }
  }

  private moveInDirection(dir: Nodes, currentNode: Nodes, queue: Nodes[], seen: {[key: string]: boolean }): void {
    let x = currentNode.x + dir.x, y = currentNode.y + dir.y;
    if (x >= 0 && y >= 0 && x < this.map[0].length && y < this.map.length && !this.map[y][x].isUnbreakable()) {
      let coords = `${x},${y}`;
      this.pushQueueIfNotSeen(queue, coords, seen, x, y, dir);
    }
  }

  private pushQueueIfNotSeen(queue: Nodes[], coords: string, seen: {[key: string]: boolean }, x: number, y: number, dir: Nodes): void {
    if (!seen[coords]) {
      queue.push({ x, y, dir: dir.dir });
      seen[coords] = true;
    }
  }
}

interface RawTileValue {
  transform(): Tile;
}
class AirValue implements RawTileValue {
    transform() {
        return new Air();
    }
}
class UnbreakableValue implements RawTileValue {
    transform() {
        return new Unbreakable();
    }
}
class StoneValue implements RawTileValue {
    transform() {
        return new Stone();
    }
}
class BombValue implements RawTileValue {
    transform() {
        return new Bomb();
    }
}
class BombCloseValue implements RawTileValue {
    transform() {
        return new BombClose();
    }
}
class BombReallyCloseValue implements RawTileValue {
    transform() {
        return new BombReallyClose();
    }
}
class TmpFireValue implements RawTileValue {
    transform() {
        return new TmpFire();
    }
}
class FireValue implements RawTileValue {
    transform() {
        return new Fire();
    }
}
class ExtraBombValue implements RawTileValue {
    transform() {
        return new ExtraBomb();
    }
}
class MonsterUpValue implements RawTileValue {
    transform() {
        return new Monster(MONSTER_UP);
    }
}
class MonsterRightValue implements RawTileValue {
    transform() {
        return new Monster(MONSTER_RIGHT);
    }
}
class TmpMonsterRightValue implements RawTileValue {
    transform() {
        return new Monster(TMP_MONSTER_RIGHT);
    }
}
class MonsterDownValue implements RawTileValue {
    transform() {
        return new Monster(MONSTER_DOWN);
    }
}
class TmpMonsterDownValue implements RawTileValue {
    transform() {
        return new Monster(TMP_MONSTER_DOWN);
    }
}
class MonsterLeftValue implements RawTileValue {
    transform() {
        return new Monster(MONSTER_LEFT);
    }
}

class RawTile2 {
  static readonly AIR = new RawTile2(new AirValue());
  static readonly UNBREAKABLE = new RawTile2(new UnbreakableValue());
  static readonly STONE = new RawTile2(new StoneValue());
  static readonly BOMB = new RawTile2(new BombValue());
  static readonly BOMB_CLOSE = new RawTile2(new BombCloseValue());
  static readonly BOMB_REALLY_CLOSE = new RawTile2(new BombReallyCloseValue());
  static readonly TMP_FIRE = new RawTile2(new TmpFireValue());
  static readonly FIRE = new RawTile2(new FireValue());
  static readonly EXTRA_BOMB = new RawTile2(new ExtraBombValue());
  static readonly MONSTER_UP = new RawTile2(new MonsterUpValue());
  static readonly MONSTER_RIGHT = new RawTile2(new MonsterRightValue());
  static readonly TMP_MONSTER_RIGHT = new RawTile2(new TmpMonsterRightValue());
  static readonly MONSTER_DOWN = new RawTile2(new MonsterDownValue());
  static readonly TMP_MONSTER_DOWN = new RawTile2(new TmpMonsterDownValue());
  static readonly MONSTER_LEFT = new RawTile2(new MonsterLeftValue());
  private constructor(private readonly value: RawTileValue) {}

    transform() {
        return this.value.transform();
    }
}

const RAW_TILES = [
  RawTile2.AIR,
  RawTile2.UNBREAKABLE,
  RawTile2.STONE,
  RawTile2.BOMB,
  RawTile2.BOMB_CLOSE,
  RawTile2.BOMB_REALLY_CLOSE,
  RawTile2.TMP_FIRE,
  RawTile2.FIRE,
  RawTile2.EXTRA_BOMB,
  RawTile2.MONSTER_UP,
  RawTile2.MONSTER_RIGHT,
  RawTile2.TMP_MONSTER_RIGHT,
  RawTile2.MONSTER_DOWN,
  RawTile2.TMP_MONSTER_DOWN,
  RawTile2.MONSTER_LEFT
];

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

  findShortestDirection(map: Map, y: number, x: number ) {
    return map.findShortestDirection(this.y, this.x, y, x);
  }

  drawPlayer(g: CanvasRenderingContext2D) {
    g.fillStyle = "#00ff00";
    if (!gameOver)
      g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

class Map {
  private readonly map: Tile[][];
  private readonly pathFinder: PathFinder;

  constructor() {
    this.map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
      this.map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this.map[y][x] = transformTile(RAW_TILES[rawMap[y][x]]);
      }
    }
    this.pathFinder = new PathFinder(this.map);
  }

  update(player: Player) {
    if (--delay > 0) return;
    delay = DELAY;

    for (let y = 1; y < this.map.length; y++) {
      for (let x = 1; x < this.map[y].length; x++) {
        this.map[y][x].updateTile(this, player, y, x);
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

  findShortestDirection(playerY: number, playerX: number, y: number, x: number): Direction {
    return this.pathFinder.findShortestPath(playerY, playerX, y, x);
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
  nextState(map: Map, y: number, x: number, dir: Direction): MonsterState;
  isAir(map: Map, y: number, x: number): boolean;
  setNextTile(map: Map, y: number, x: number, nextState: MonsterState): void;
  setTile(map: Map, y: number, x: number): void;
  findConfig(): MonsterConfiguration;
}

class MonsterStrategy {
  private readonly pathFinder: PathFinder;

  constructor(private state: MonsterState) {
  }

  updateTile(map: Map, dir: Direction, y: number, x: number, isTmp: boolean): void {
    if (dir == null) return;
    let st = this.state.nextState(map, y, x, dir);

    console.log(st);
    console.log(isTmp);
    if (!isTmp && this.state.isAir(map, y, x)) {
      console.log("inside isAir");
      map.setTile(y, x, new Air());
      this.state.setNextTile(map, y, x, st);
      return;
    }
    st.setTile(map, y, x);
  }
}

// up -> is Air? up : right
// right -> is Air? tmpRight : down
// tmpRight -> right
// left -> is Air? left : up
// down -> is Air? tmpDown : left
// tmpDown -> down

class MonsterUpState implements MonsterState {

  nextState(map: Map, y: number, x: number, dir: Direction): MonsterState {
    return directionMonState[dir];
  }

  isAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y - 1, x);
  }

  setNextTile(map: Map, y: number, x: number, nextState: MonsterState): void {
    map.setTile(y - 1, x, new Monster(nextState.findConfig()));
  }

  setTile(map: Map, y: number, x: number): void {
    map.setTile(y, x, new Monster(MONSTER_UP));
  }

  findConfig(): MonsterConfiguration {
    return MONSTER_UP;
  }
}

class MonsterRightState implements MonsterState {
  nextState(map: Map, y: number, x: number, dir: Direction): MonsterState {
    console.log("inside right state")
    console.log(x + " " + y);
    if (dir == Direction.right && map.isAir(y, x + 1)) {
        return new MonsterTmpRightState();
    }
    return directionMonState[dir]
  }

  isAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x + 1);
  }

  setNextTile(map: Map, y: number, x: number, nextState: MonsterState): void {
    console.log("inside set next tile")
    map.setTile(y, x + 1, new Monster(nextState.findConfig()));
  }

  setTile(map: Map, y: number, x: number): void {
    console.log("inside set tile")
    map.setTile(y, x, new Monster(MONSTER_RIGHT));
  }

  findConfig(): MonsterConfiguration {
    return MONSTER_RIGHT;
  }
}

class MonsterTmpRightState implements MonsterState {

  nextState(map: Map, y: number, x: number, dir: Direction): MonsterState {
    return new MonsterRightState();
  }

  isAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x);
  }

  setNextTile(map: Map, y: number, x: number, nextState: MonsterState): void {
    console.log("inside tmp set next tile")

    map.setTile(y, x  + 1, new Monster(nextState.findConfig()));
  }

  setTile(map: Map, y: number, x: number): void {
    console.log("inside tmp set tile")

    map.setTile(y, x, new Monster(TMP_MONSTER_RIGHT));
  }

  findConfig(): MonsterConfiguration {
    return TMP_MONSTER_RIGHT;
  }
}

class MonsterLeftState implements MonsterState {

  nextState(map: Map, y: number, x: number, dir: Direction): MonsterState {
    return directionMonState[dir];
  }

  isAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x - 1);
  }

  setNextTile(map: Map, y: number, x: number, nextState: MonsterState): void {
    map.setTile(y, x - 1, new Monster(nextState.findConfig()));
  }

  setTile(map: Map, y: number, x: number): void {
    map.setTile(y, x, new Monster(MONSTER_LEFT));
  }

  findConfig(): MonsterConfiguration {
  return MONSTER_LEFT;
  }
}

class MonsterDownState implements MonsterState {
  nextState(map: Map, y: number, x: number, dir: Direction): MonsterState {
    if (dir == Direction.down && map.isAir(y + 1, x)) {
      return new MonsterTmpDownState();
    }
    return directionMonState[dir];
  }

  isAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y + 1, x);
  }

  setNextTile(map: Map, y: number, x: number, nextState: MonsterState): void {
    map.setTile(y + 1, x, new Monster(nextState.findConfig()));
  }

  setTile(map: Map, y: number, x: number): void {
    map.setTile(y, x, new Monster(MONSTER_DOWN));
  }

  findConfig(): MonsterConfiguration {
    return MONSTER_DOWN;
  }
}

class MonsterTmpDownState implements MonsterState {
  nextState(map: Map, y: number, x: number, dir: Direction): MonsterState {
    return new MonsterDownState();
  }

  isAir(map: Map, y: number, x: number): boolean {
    return map.isAir(y, x);
  }

  setNextTile(map: Map, y: number, x: number, nextState: MonsterState): void {
    map.setTile(y + 1, x, new Monster(nextState.findConfig()));
  }

  setTile(map: Map, y: number, x: number): void {
    map.setTile(y, x, new Monster(TMP_MONSTER_DOWN));
  }

  findConfig(): MonsterConfiguration {
  return TMP_MONSTER_DOWN;
  }
}

class MonsterConfiguration {
  constructor(
      private color: string,
      private state: MonsterState,
      private strategy: TmpStrategy) { }

  isTmp(): boolean { return this.strategy.isTmp(); }
  setColor(g : CanvasRenderingContext2D) { g.fillStyle = this.color; }
  updateTile(map: Map, player: Player, y: number, x: number): void {
    let dir = player.findShortestDirection(map, y, x);
    new MonsterStrategy(this.state).updateTile(map, dir, y, x, this.isTmp());
  }
}

const MONSTER_UP = new MonsterConfiguration("#cc00cc", new MonsterUpState(), new MonsterTmpStrategy(false));
const MONSTER_RIGHT = new MonsterConfiguration("#cc00cc", new MonsterRightState(), new MonsterTmpStrategy(false));
const TMP_MONSTER_RIGHT = new MonsterConfiguration(null, new MonsterTmpRightState(), new MonsterTmpStrategy(true));
const MONSTER_DOWN = new MonsterConfiguration("#cc00cc", new MonsterDownState(), new MonsterTmpStrategy(false));
const TMP_MONSTER_DOWN = new MonsterConfiguration(null, new MonsterTmpDownState(), new MonsterTmpStrategy(true));
const MONSTER_LEFT = new MonsterConfiguration("#cc00cc", new MonsterLeftState(), new MonsterTmpStrategy(false));


const directionMonState: {[key: string]: MonsterState} = {
  [Direction.left]: new MonsterLeftState(),
  [Direction.right]: new MonsterRightState(),
  [Direction.up]: new MonsterUpState(),
  [Direction.down]: new MonsterDownState()
}

const stateConfig: {[key: string]: MonsterState} = {
  [Direction.left]: new MonsterLeftState(),
  [Direction.right]: new MonsterRightState(),
  [Direction.up]: new MonsterUpState(),
  [Direction.down]: new MonsterDownState()
}


interface Tile {
  isMonster(): boolean;
  isUnbreakable(): boolean;
  isStone(): boolean;
  isAir(): boolean;
  isGameOver(): boolean;
  movePlayer(map: Map, player: Player, y: number, x: number): void;
  hasBomb(): boolean;

  updateTile(map: Map, player: Player, y: number, x: number): void;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  explode(map: Map, x: number, y: number, type: Tile): void;
}



class Air implements Tile {
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return false; }
  isAir() { return true; }
  isGameOver() { return false; }
  hasBomb() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return true; }
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
  }

  movePlayer(map: Map, player: Player, y: number, x: number): void {
  }

  explode(map: Map, x: number, y: number, type: Tile): void {
  }
}

class Stone implements Tile {
  isMonster() { return false; }
  isStone() { return true; }
  isUnbreakable() { return false; }
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return false; }
  isAir() { return false; }
  isGameOver() { return false; }

  hasBomb() { return true; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#770000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return false; }
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return true; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#cc0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return false; }
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return true; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ff0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return false; }
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return false; }
  isAir() { return false; }
  isGameOver() { return true; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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
  isMonster() { return false; }
  isStone() { return false; }
  isUnbreakable() { return false; }
  isAir() { return false; }
  isGameOver() { return false; }
  hasBomb() { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#00cc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  updateTile(map: Map, player: Player, y: number, x: number): void {
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

  isMonster() { return true; }
  isStone() { return false; }
  isUnbreakable() { return false; }

  hasBomb(): boolean { return false; }

  isAir(): boolean { return false; }

  isGameOver(): boolean { return true; }

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

  updateTile(map: Map, player: Player, y: number, x: number): void {
    this.monsterConfig.updateTile(map, player, y, x);
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
// let rawMap: number[][] = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 0, 0, 2, 2, 2, 2, 2, 1],
//   [1, 0, 1, 2, 1, 2, 1, 2, 1],
//   [1, 2, 2, 2, 2, 2, 2, 2, 1],
//   [1, 2, 1, 2, 1, 2, 1, 2, 1],
//   [1, 2, 2, 2, 2, 0, 0, 0, 1],
//   [1, 2, 1, 2, 1, 0, 1, 0, 1],
//   [1, 2, 2, 2, 2, 0, 0, 10, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];

let rawMap: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 10, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 2, 2, 2, 2, 2, 2, 1],
  [1, 0, 1, 10, 1, 2, 1, 2, 1],
  [1, 0, 2, 2, 2, 0, 0, 0, 1],
  [1, 0, 1, 2, 1, 0, 1, 0, 1],
  [1, 10, 0, 0, 2, 0, 0, 10, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// let map: Tile[][];
let map = new Map();

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

function transformTile(tile: RawTile2) {
  return tile.transform();
}

function update(map: Map, player: Player) {
  handleInputs(map, player);
  player.checkIfGameOver(map);
  map.update(player);
}

function handleInputs(map: Map, player: Player) {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.handle(map, player)
  }
}

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
