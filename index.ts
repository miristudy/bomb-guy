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
  isAir(): boolean;
  color(g: CanvasRenderingContext2D): void;
  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
  isGameOver(): boolean;
  move(player:Player, x: number, y: number): void;
  close(): void;
  reallyClose(): void;
  renewMonsterUp(): void;
  renewMonsterDown(): void;
  renewMonsterLeft(): void;
  renewMonsterRight(): void;
  explode(x: number, y: number, type: Tile): void;
  updateTile(x: number, y: number): void;
}

class Air implements Tile {

  isAir(): boolean {
    return true;
  }

  color(g: CanvasRenderingContext2D): void {
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  }

  isGameOver(): boolean {
    return false;
  }

  move(player:Player, x: number, y: number): void {
    player.move(x, y)
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map.renewTile(x, y, type)
  }

  updateTile(x: number, y: number): void {
  }

}

class Unbreakable implements Tile {
  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#999999";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isGameOver(): boolean {
    return false;
  }

  move(player:Player, x: number, y: number): void {
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
  }

  updateTile(x: number, y: number): void {
  }

}

class Stone implements Tile {
  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#0000cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isGameOver(): boolean {
    return false;
  }

  move(player:Player, x: number, y: number): void {
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    if (Math.random() < 0.1) {
      map.createExtraBomb(x, y)
      return ;
    }

    map.renewTile(x, y, type);
  }

  updateTile(x: number, y: number): void {
  }

}

class Bomb implements Tile {

  constructor(private bombState: BombState){
  }

  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    this.bombState.color(g);
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    this.bombState.fillRect(g, x, y, w, h);
  }

  isGameOver(): boolean {
    return false;
  }

  move(player:Player, x: number, y: number): void {
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
    this.bombState = new Close();
  }

  reallyClose(): void {
    this.bombState = new ReallyClose();
  }

  explode(x: number, y: number, type: Tile): void {
    bombs++;
    map.renewTile(x, y, type);
  }

  updateTile(x: number, y: number): void {
    this.bombState.updateTile(x, y);
  }

}

interface BombState{
  color(g: CanvasRenderingContext2D): void,
  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void
  updateTile(x: number, y: number): void;
}

class Normal implements BombState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#00ffa6";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.closeBomb(x, y)
  }

}

class Close implements BombState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#8f00ff";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.reallyCloseBomb(x, y)
  }

}

class ReallyClose implements BombState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ff0000";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.updateReallyClose(x, y);
    bombs++;
  }

}

class TmpFire implements Tile {
  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isGameOver(): boolean {
    return false;
  }

  move(player:Player, x: number, y: number): void {
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map.renewTile(x, y, type);
  }

  updateTile(x: number, y: number): void {
    map.updateFire(x, y);
  }

}

class Fire implements Tile {
  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ffcc00";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isGameOver(): boolean {
    return true;
  }

  move(player:Player, x: number, y: number): void {
    player.move(x, y)
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map.renewTile(x, y, type)
  }

  updateTile(x: number, y: number): void {
    map.updateAir(x, y);
  }

}

class ExtraBomb implements Tile {
  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#00cc00";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isGameOver(): boolean {
    return false;
  }

  move(player:Player, x: number, y: number): void {
    player.move(x, y)
    bombs++;
    player.renewAir();
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map.renewTile(x, y, type)
  }

  updateTile(x: number, y: number): void {
  }

}

interface MonsterState {
    color(g: CanvasRenderingContext2D): void,
    fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void,
    updateTile(x: number, y: number): void;
}

class Monster implements Tile {
  constructor(private state: MonsterState) {
  }

  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    this.state.color(g)
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    this.state.fillRect(g, x, y, w, h);
  }

  isGameOver(): boolean {
    return true;
  }

  move(player:Player, x: number, y: number): void {
  }

  renewMonsterDown(): void {
    this.state = new MonsterDownState();
  }

  renewMonsterLeft(): void {
    this.state = new MonsterLeftState();
  }

  renewMonsterRight(): void {
    this.state = new MonsterRightState();
  }

  renewMonsterUp(): void {
    this.state = new MonsterUpState();
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map.updateTmpFire(x, y);
  }

  updateTile(x: number, y: number): void {
    this.state.updateTile(x, y);
  }

}

class MonsterUpState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.updateMonsterUpState(x, y);
  }

}

class MonsterRightState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.updateMonsterRightState(x, y)
  }

}

class TmpMonsterRightState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.updateTmpMonsterRightState(x, y);
  }

}

class MonsterDownState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.updateMonsterDownState(x, y);
  }

}

class TmpMonsterDownState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.updateTmpMonsterDownState(x, y);
  }

}

class MonsterLeftState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map.updateMonsterLeftState(x, y);
  }

}

interface Input {
  move(): void;
}

class Up implements Input {
  move(): void {
    player.moveUp();
  }

}

class Down implements Input {
  move(): void {
    player.moveDown();
  }

}

class Right implements Input {
  move(): void {
    player.moveRight()
  }

}

class Left implements Input {
  move(): void {
    player.moveLeft();
  }

}

class Place implements Input {
  move(): void {
    player.movePlace();
  }

}

class Player {
  private x = 1;
  private y = 1;

  renewAir() {
    map.updateAir(this.x, this.y);
  }

  move(x: number, y:number){
    this.x += x;
    this.y += y;
  }

  moveUp(){
    map.move(this.x, this.y - 1, 0, -1);
  }

  moveDown(){
    map.move(this.x, this.y + 1, 0, 1);
  }

  moveLeft(){
    map.move(this.x - 1, this.y, -1, 0)
  }

  moveRight(){
    map.move(this.x + 1, this.y, 1, 0)
  }

  movePlace(){
    if (bombs > 0) {
      map.createBomb(this.x, this.y)
      bombs--;
    }
  }

  draw(g: CanvasRenderingContext2D) {
    if (!gameOver){
      g.fillStyle = "#00ff00";
      g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  isGameOver() {
    return map.isGameOver(this.x, this.y);
  }

}

class BombMap {
  private map: Tile[][];

  init() {
    this.map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++ ) {
      this.map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this.map[y][x] = transformTile(rawMap[y][x]);
      }
    }
  }

  createExtraBomb(x: number, y: number) {
    this.map[y][x] = new ExtraBomb();
  }

  renewTile(x: number, y: number, type: Tile) {
    this.map[y][x] = type;
  }

  closeBomb(x: number, y: number) {
    this.map[y][x].close();
  }

  reallyCloseBomb(x: number, y: number) {
    this.map[y][x].reallyClose();
  }

  updateReallyClose(x: number, y: number) {
    this.map[y - 1][x].explode(x, y - 1, new Fire());
    this.map[y + 1][x].explode(x, y + 1, new TmpFire());
    this.map[y][x - 1].explode(x - 1, y, new Fire());
    this.map[y][x + 1].explode(x + 1, y, new TmpFire());
    this.map[y][x] = new Fire();
  }

  updateFire(x: number, y: number) {
    this.map[y][x] = new Fire();
  }

  updateTmpFire(x: number, y: number) {
    this.map[y][x] = new TmpFire();
  }

  updateAir(x: number, y: number) {
    this.map[y][x] = new Air();
  }

  updateMonsterUpState(x: number, y: number) {
    if (this.map[y - 1][x].isAir()) {
      this.map[y][x] = new Air();
      this.map[y - 1][x] = new Monster(new MonsterUpState());
    } else {
      this.map[y][x].renewMonsterRight();
    }
  }

  updateMonsterRightState(x: number, y: number) {
    if (this.map[y][x + 1].isAir()) {
      this.map[y][x] = new Air();
      this.map[y][x + 1] = new Monster(new TmpMonsterRightState());
    } else {
      this.map[y][x].renewMonsterDown();
    }
  }

  updateMonsterDownState(x: number, y: number) {
    if (this.map[y + 1][x].isAir()) {
      this.map[y][x] = new Air();
      this.map[y + 1][x] = new Monster(new TmpMonsterDownState());
    } else {
      this.map[y][x].renewMonsterLeft();
    }
  }

  updateMonsterLeftState(x: number, y: number) {
    if (this.map[y][x - 1].isAir()) {
      this.map[y][x] = new Air();
      this.map[y][x - 1] = new Monster(new MonsterLeftState());
    } else {
      this.map[y][x].renewMonsterUp();
    }
  }

  updateTmpMonsterRightState(x: number, y: number) {
    this.map[y][x].renewMonsterRight();
  }

  updateTmpMonsterDownState(x: number, y: number) {
    this.map[y][x].renewMonsterDown();
  }

  move(playerx: number, playery: number, x: number, y: number) {
    this.map[playery][playerx].move(player, x, y);
  }

  createBomb(x: number, y: number) {
    this.map[y][x] = new Bomb(new Normal());
  }

  draw(g: CanvasRenderingContext2D) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].color(g);
        this.map[y][x].fillRect(g, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  update() {
    for (let y = 1; y < this.map.length; y++) {
      for (let x = 1; x < this.map[y].length; x++) {
        this.map[y][x].updateTile(x, y);
      }
    }
  }

  isGameOver(x: number, y: number) {
    return this.map[y][x].isGameOver();
  }
}

let player = new Player();
let map = new BombMap();


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

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

function transformTile(rawMapElementElement: RawTile) {
  switch (rawMapElementElement) {
    case RawTile.AIR:
      return new Air();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.STONE:
      return new Stone();
    case RawTile.BOMB:
      return new Bomb(new Normal());
    case RawTile.BOMB_CLOSE:
      return new Bomb(new Close());
    case RawTile.BOMB_REALLY_CLOSE:
      return new Bomb(new ReallyClose());
    case RawTile.TMP_FIRE:
      return new TmpFire();
    case RawTile.FIRE:
      return new Fire();
    case RawTile.EXTRA_BOMB:
      return new ExtraBomb();
    case RawTile.MONSTER_UP:
      return new Monster(new MonsterUpState());
    case RawTile.MONSTER_RIGHT:
      return new Monster(new MonsterRightState());
    case RawTile.TMP_MONSTER_RIGHT:
      return new Monster(new TmpMonsterRightState());
    case RawTile.MONSTER_DOWN:
      return new Monster(new MonsterDownState());
    case RawTile.TMP_MONSTER_DOWN:
      return new Monster(new TmpMonsterDownState());
    case RawTile.MONSTER_LEFT:
      return new Monster(new MonsterLeftState());
    default:
      throw new Error("Invalid rawMapElementElement");
  }
}

function handleInputs() {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.move();
  }
}


function update() {
  handleInputs();
  if (player.isGameOver())
    gameOver = true;

  if (--delay > 0) return;
  delay = DELAY;

  map.update()
}

function createGraphics() {
  let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();
  map.draw(g);
  player.draw(g);
}

function setSleepTime(after: number, before: number) {
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  setSleepTime(after, before);
}

window.onload = () => {
  map.init();
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
