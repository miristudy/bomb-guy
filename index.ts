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
  isBombType(): boolean;
  move(player:Player, x: number, y: number): void;
  close(): void;
  reallyClose(): void;
  renewMonsterUp(): void;
  renewMonsterDown(): void;
  renewMonsterLeft(): void;
  renewMonsterRight(): void;
  renewTmpMonsterRight(): void;
  renewTmpMonsterDown(): void;
  explode(x: number, y: number, type: Tile): void;
  updateTile(x: number, y: number): void;
}

class Air implements Tile {
  isBombType(): boolean {
    return false;
  }
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

  renewTmpMonsterDown(): void {
  }

  renewTmpMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map[y][x] = type;
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

  isBombType(): boolean {
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

  renewTmpMonsterDown(): void {
  }

  renewTmpMonsterRight(): void {
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

  isBombType(): boolean {
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

  renewTmpMonsterDown(): void {
  }

  renewTmpMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    if (Math.random() < 0.1) {
      map[y][x] = new ExtraBomb();
      return ;
    }
    map[y][x] = type;
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
    g.fillStyle = "#770000";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isGameOver(): boolean {
    return false;
  }

  isBombType(): boolean {
    return true;
  }

  move(player:Player, x: number, y: number): void {
  }

  renewMonsterDown(): void {
  }

  renewMonsterLeft(): void {
  }

  renewMonsterRight(): void {
  }

  renewTmpMonsterDown(): void {
  }

  renewTmpMonsterRight(): void {
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
    map[y][x] = type;
  }

  updateTile(x: number, y: number): void {
    this.bombState.updateTile(x, y);
  }

}

interface BombState{
  isNormal(): boolean;
  isClose(): boolean;
  isReallyClose(): boolean;
  color(g: CanvasRenderingContext2D): void,
  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void
  updateTile(x: number, y: number): void;
}

class Normal implements BombState{
  isClose(): boolean {
    return false;
  }

  isNormal(): boolean {
    return true;
  }

  isReallyClose(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#770000";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map[y][x].close();
  }

}

class Close implements BombState{

  isClose(): boolean {
    return true;
  }

  isNormal(): boolean {
    return false;
  }

  isReallyClose(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc0000";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map[y][x].reallyClose();
  }

}

class ReallyClose implements BombState{
  isClose(): boolean {
    return false;
  }

  isNormal(): boolean {
    return false;
  }

  isReallyClose(): boolean {
    return true;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ff0000";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  updateTile(x: number, y: number): void {
    map[y - 1][x].explode(x, y - 1, new Fire());
    map[y + 1][x].explode(x, y + 1, new TmpFire());
    map[y][x - 1].explode(x - 1, y, new Fire());
    map[y][x + 1].explode(x + 1, y, new TmpFire());
    map[y][x] = new Fire();
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

  isBombType(): boolean {
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

  renewTmpMonsterDown(): void {
  }

  renewTmpMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map[y][x] = type;
  }

  updateTile(x: number, y: number): void {
    map[y][x] = new Fire();
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

  isBombType(): boolean {
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

  renewTmpMonsterDown(): void {
  }

  renewTmpMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map[y][x] = type;
  }

  updateTile(x: number, y: number): void {
    map[y][x] = new Air();
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

  isBombType(): boolean {
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

  renewTmpMonsterDown(): void {
  }

  renewTmpMonsterRight(): void {
  }

  renewMonsterUp(): void {
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map[y][x] = type;
  }

  updateTile(x: number, y: number): void {
  }

}

interface MonsterState {
    isUp(): boolean,
    isRight(): boolean,
    isTmpRight(): boolean,
    isDown(): boolean,
    isTmpDown(): boolean,
    isLeft(): boolean,
    color(g: CanvasRenderingContext2D): void,
    fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void,
    updateTile(x: number, y: number): void;
}

class Monster implements Tile {
  constructor(private state: MonsterUpState) {
  }

  isAir(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isGameOver(): boolean {
    return true;
  }

  isBombType(): boolean {
    return false;
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

  renewTmpMonsterDown(): void {
    this.state = new TmpMonsterDownState()
  }

  renewTmpMonsterRight(): void {
    this.state = new TmpMonsterRightState();
  }

  renewMonsterUp(): void {
    this.state = new MonsterUpState();
  }

  close(): void {
  }

  reallyClose(): void {
  }

  explode(x: number, y: number, type: Tile): void {
    map[y][x] = new TmpFire();
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

  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return false;
  }

  isTmpDown(): boolean {
    return false;
  }

  isTmpRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return true;
  }

  updateTile(x: number, y: number): void {
    if (map[y - 1][x].isAir()) {
      map[y][x] = new Air();
      map[y - 1][x] = new Monster(new MonsterUpState());
    } else {
      map[y][x].renewMonsterRight();
    }
  }

}

class MonsterRightState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return true;
  }

  isTmpDown(): boolean {
    return false;
  }

  isTmpRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return false;
  }

  updateTile(x: number, y: number): void {
    if (map[y][x + 1].isAir()) {
      map[y][x] = new Air();
      map[y][x + 1] = new Monster(new TmpMonsterRightState());
    } else {
      map[y][x].renewMonsterDown();
    }
  }

}

class TmpMonsterRightState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return false;
  }

  isTmpDown(): boolean {
    return false;
  }

  isTmpRight(): boolean {
    return true;
  }

  isUp(): boolean {
    return false;
  }

  updateTile(x: number, y: number): void {
    map[y][x].renewTmpMonsterRight();
  }

}

class MonsterDownState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isDown(): boolean {
    return true;
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return false;
  }

  isTmpDown(): boolean {
    return false;
  }

  isTmpRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return false;
  }

  updateTile(x: number, y: number): void {
    if (map[y + 1][x].isAir()) {
      map[y][x] = new Air();
      map[y + 1][x] = new Monster(new TmpMonsterDownState());
    } else {
      map[y][x].renewMonsterLeft();
    }
  }

}

class TmpMonsterDownState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return false;
  }

  isTmpDown(): boolean {
    return true;
  }

  isTmpRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return false;
  }

  updateTile(x: number, y: number): void {
    map[y][x].renewMonsterDown();
  }

}

class MonsterLeftState implements MonsterState{
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc00cc";
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    g.fillRect(x, y, w, h);
  }

  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return true;
  }

  isRight(): boolean {
    return false;
  }

  isTmpDown(): boolean {
    return false;
  }

  isTmpRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return false;
  }

  updateTile(x: number, y: number): void {
    if (map[y][x - 1].isAir()) {
      map[y][x] = new Air();
      map[y][x - 1] = new Monster(new MonsterLeftState());
    } else {
      map[y][x].renewMonsterUp();
    }
  }

}

interface Input {
  isUp(): boolean;
  isDown(): boolean;
  isLeft(): boolean;
  isRight(): boolean;
  isPlace(): boolean;
  move(): void;
}

class Up implements Input {
  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return false;
  }

  isPlace(): boolean {
    return false;
  }

  isRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return true;
  }

  move(): void {
    player.moveUp();
  }

}

class Down implements Input {
  isDown(): boolean {
    return true;
  }

  isLeft(): boolean {
    return false;
  }

  isPlace(): boolean {
    return false;
  }

  isRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return false;
  }

  move(): void {
    player.moveDown();
  }

}

class Right implements Input {
  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return false;
  }

  isPlace(): boolean {
    return false;
  }

  isRight(): boolean {
    return true;
  }

  isUp(): boolean {
    return false;
  }

  move(): void {
    player.moveRight()
  }

}

class Left implements Input {
  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return true;
  }

  isPlace(): boolean {
    return false;
  }

  isRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return false;
  }

  move(): void {
    player.moveLeft();
  }

}

class Place implements Input {
  isDown(): boolean {
    return false;
  }

  isLeft(): boolean {
    return false;
  }

  isPlace(): boolean {
    return true;
  }

  isRight(): boolean {
    return false;
  }

  isUp(): boolean {
    return false;
  }

  move(): void {
    player.movePlace();
  }

}

class Player {
  private x = 1;
  private y = 1;

  renewAir() {
    map[this.y][this.x] = new Air();
  }

  move(x: number, y:number){
    this.x += x;
    this.y += y;
  }

  moveUp(){
    map[this.y + -1][this.x].move(player, 0, -1);
  }

  moveDown(){
    map[this.y + 1][this.x].move(player, 0, 1);
  }

  moveLeft(){
    map[this.y][this.x + -1].move(player, -1, 0);
  }

  moveRight(){
    map[this.y][this.x + 1].move(player, 1, 0);
  }

  movePlace(){
    if (bombs > 0) {
      map[this.y][this.x] = new Bomb(new Normal());
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
    return map[this.y][this.x].isGameOver()
  }

}

let player = new Player();

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

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++ ) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

function handleInputs() {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.move();
  }
}

function updateMap() {
  for (let y = 1; y < map.length; y++) {
    for (let x = 1; x < map[y].length; x++) {
      map[y][x].updateTile(x, y);
    }
  }
}

function update() {
  handleInputs();
  if (player.isGameOver())
    gameOver = true;

  if (--delay > 0) return;
  delay = DELAY;

  updateMap();
}

function drawPlayer(g: CanvasRenderingContext2D) {
  player.draw(g);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].color(g);
      map[y][x].fillRect(g, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
