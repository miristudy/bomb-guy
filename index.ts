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
  isUnbreakable(): boolean;
  isStone(): boolean;
  isBomb(): boolean;
  isBombClose(): boolean;
  isBombReallyClose(): boolean;
  isTmpFire(): boolean;
  isFire(): boolean;
  isExtraBomb(): boolean;
  isMonsterUp(): boolean;
  isMonsterRight(): boolean;
  isTmpMonsterRight(): boolean;
  isMonsterDown(): boolean;
  isTmpMonsterDown(): boolean;
  isMonsterLeft(): boolean;

  color(g: CanvasRenderingContext2D): void;
  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
  isGameOver(): boolean;
  isBombType(): boolean;
  move(x: number, y: number): void;
}

class Air implements Tile {
  isBombType(): boolean {
    return false;
  }
  isAir(): boolean {
    return true;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  }

  isGameOver(): boolean {
    return false;
  }

  move(x: number, y: number): void {
    playery += y;
    playerx += x;
  }

}

class Unbreakable implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
    return true;
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

  move(x: number, y: number): void {
  }

}

class Stone implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return true;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
  }

}

enum BombType {
    NORMAL,
    CLOSE,
    REALLY_CLOSE
}

interface BombState{
  isNormal(): boolean;
  isClose(): boolean;
  isReallyClose(): boolean;
  color(g: CanvasRenderingContext2D): void,
  fillRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void
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

}

class Bomb implements Tile {

  constructor(private bombState: BombState){
  }

  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return this.bombState.isNormal();
  }

  isBombClose(): boolean {
    return this.bombState.isClose();
  }

  isBombReallyClose(): boolean {
    return this.bombState.isReallyClose();
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
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

}

class BombClose implements Tile {
  constructor(private bombState: BombState){
  }

  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return this.bombState.isNormal();
  }

  isBombClose(): boolean {
    return this.bombState.isClose();
  }

  isBombReallyClose(): boolean {
    return this.bombState.isReallyClose();
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#cc0000";
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

  move(x: number, y: number): void {
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

}

class BombReallyClose implements Tile {
  constructor(private bombState: BombState){
  }

  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return this.bombState.isNormal();
  }

  isBombClose(): boolean {
    return this.bombState.isClose();
  }

  isBombReallyClose(): boolean {
    return this.bombState.isReallyClose();
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
    return false;
  }

  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ff0000";
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

  move(x: number, y: number): void {
  }

}

class TmpFire implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return true;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
  }

}

class Fire implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return true;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
    playery += y;
    playerx += x;
  }

}

class ExtraBomb implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return true;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
    playery += y;
    playerx += x;
    bombs++;
    map[playery][playerx] = new Air();
  }

}

class MonsterUp implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return true;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
  }

}

class MonsterRight implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return true;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
  }

}

class TmpMonsterRight implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return true;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
  }

}

class MonsterDown implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return true;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
  }

}

class TmpMonsterDown implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return false;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return true;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
  }

}

class MonsterLeft implements Tile {
  isAir(): boolean {
    return false;
  }

  isBomb(): boolean {
    return false;
  }

  isBombClose(): boolean {
    return false;
  }

  isBombReallyClose(): boolean {
    return false;
  }

  isExtraBomb(): boolean {
    return false;
  }

  isFire(): boolean {
    return false;
  }

  isMonsterDown(): boolean {
    return false;
  }

  isMonsterLeft(): boolean {
    return true;
  }

  isMonsterRight(): boolean {
    return false;
  }

  isMonsterUp(): boolean {
    return false;
  }

  isStone(): boolean {
    return false;
  }

  isTmpFire(): boolean {
    return false;
  }

  isTmpMonsterDown(): boolean {
    return false;
  }

  isTmpMonsterRight(): boolean {
    return false;
  }

  isUnbreakable(): boolean {
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

  move(x: number, y: number): void {
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
    map[playery + -1][playerx].move(0, -1);
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
    map[playery + 1][playerx].move(0, 1);
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
    map[playery][playerx + 1].move(1, 0);
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
    map[playery][playerx + -1].move(-1, 0);
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
    if (bombs > 0) {
      map[playery][playerx] = new Bomb(new Normal());
      bombs--;
    }
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
      return new BombClose(new Close());
    case RawTile.BOMB_REALLY_CLOSE:
      return new BombReallyClose(new ReallyClose());
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

function explode(x: number, y: number, type: Tile) {
  if (map[y][x].isStone()) {
    if (Math.random() < 0.1) map[y][x] = new ExtraBomb();
    else map[y][x] = type;
  } else if (!map[y][x].isUnbreakable()) {
    if (map[y][x].isBombType())
      bombs++;
    map[y][x] = type;
  }
}

function handleInputs() {
  while (!gameOver && inputs.length > 0) {
    let current = inputs.pop();
    current.move();
  }
}

function isGameOver() {
  return map[playery][playerx].isGameOver()
}

function updateMap() {
  for (let y = 1; y < map.length; y++) {
    for (let x = 1; x < map[y].length; x++) {
      if (map[y][x].isBomb()) {
        map[y][x] = new BombClose(new Close());
      } else if (map[y][x].isBombClose()) {
        map[y][x] = new BombReallyClose(new ReallyClose());
      } else if (map[y][x].isBombReallyClose()) {
        explode(x + 0, y - 1, new Fire());
        explode(x + 0, y + 1, new TmpFire());
        explode(x - 1, y + 0, new Fire());
        explode(x + 1, y + 0, new TmpFire());
        map[y][x] = new Fire();
        bombs++;
      } else if (map[y][x].isTmpFire()) {
        map[y][x] = new Fire();
      } else if (map[y][x].isFire()) {
        map[y][x] = new Air();
      } else if (map[y][x].isTmpMonsterDown()) {
        map[y][x] = new MonsterDown();
      } else if (map[y][x].isTmpMonsterRight()) {
        map[y][x] = new MonsterRight();
      } else if (map[y][x].isMonsterRight()) {
        if (map[y][x + 1].isAir()) {
          map[y][x] = new Air();
          map[y][x + 1] = new TmpMonsterRight();
        } else {
          map[y][x] = new MonsterDown();
        }
      } else if (map[y][x].isMonsterDown()) {
        if (map[y + 1][x].isAir()) {
          map[y][x] = new Air();
          map[y + 1][x] = new TmpMonsterDown();
        } else {
          map[y][x] = new MonsterLeft();
        }
      } else if (map[y][x].isMonsterLeft()) {
        if (map[y][x - 1].isAir()) {
          map[y][x] = new Air();
          map[y][x - 1] = new MonsterLeft();
        } else {
          map[y][x] = new MonsterUp();
        }
      } else if (map[y][x].isMonsterUp()) {
        if (map[y - 1][x].isAir()) {
          map[y][x] = new Air();
          map[y - 1][x] = new MonsterUp();
        } else {
          map[y][x] = new MonsterRight();
        }
      }
    }
  }
}

function update() {
  handleInputs();
  if (isGameOver())
    gameOver = true;

  if (--delay > 0) return;
  delay = DELAY;

  updateMap();
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#00ff00";
  if (!gameOver)
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
