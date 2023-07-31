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

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void;

    isGameOver(): Boolean;

    movePlayer(y: number, x: number): void;

    close(): void;

    reallyClose(): void;

    explodeFire(x: number, y: number): void;

    explodeTmpFire(x: number, y: number): void;

    updateTile(y: number, x: number): void;
}

class Air implements Tile {
    isAir(): boolean {
        return true;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
    }

    isGameOver(): Boolean {
        return false;
    }

    movePlayer(y: number, x: number): void {
        playery += y;
        playerx += x;
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
    }
}

class Unbreakable implements Tile {
    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#999999";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    isGameOver(): Boolean {
        return false;
    }

    movePlayer(y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
    }

    explodeTmpFire(x: number, y: number): void {
    }

    updateTile(y: number, x: number): void {
    }
}

class Stone implements Tile {
    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#0000cc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    isGameOver(): Boolean {
        return false;
    }

    movePlayer(y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
        if (Math.random() < 0.1) {
            map[y][x] = new ExtraBomb();
            return;
        }
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        if (Math.random() < 0.1) {
            map[y][x] = new ExtraBomb();
            return;
        }
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
    }
}

interface Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void;

    updateTile(y: number, x: number): void;
}

class Normal implements Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#770000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    updateTile(y: number, x: number): void {
        map[y][x].close();
    }

}

class Close implements Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#cc0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    updateTile(y: number, x: number): void {
        map[y][x].reallyClose()
    }

}

class ReallyClose implements Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#ff0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    updateTile(y: number, x: number): void {
        map[y - 1][x].explodeFire(x, y - 1);
        map[y + 1][x].explodeTmpFire(x, y + 1);
        map[y][x - 1].explodeFire(x - 1, y);
        map[y][x + 1].explodeTmpFire(x + 1, y);
        map[y][x] = new Fire();
        bombs++;
    }

}

class Bomb implements Tile {
    constructor(private status: Bombable) {
    }

    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        this.status.drawBlock(y, x, g);
    }

    isGameOver(): Boolean {
        return false;
    }

    movePlayer(y: number, x: number): void {
    }

    close(): void {
        this.status = new Close();
    }

    reallyClose(): void {
        this.status = new ReallyClose();
    }

    explodeFire(x: number, y: number): void {
        bombs++;
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        bombs++;
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
        this.status.updateTile(y, x);
    }
}

class TmpFire implements Tile {
    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    isGameOver(): Boolean {
        return false;
    }

    movePlayer(y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
        map[y][x] = new Fire();
    }
}

class Fire implements Tile {
    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#ffcc00";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    isGameOver(): Boolean {
        return true;
    }

    movePlayer(y: number, x: number): void {
        playery += y;
        playerx += x;
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
        map[y][x] = new Air();
    }
}

class ExtraBomb implements Tile {
    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#00cc00";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    isGameOver(): Boolean {
        return false;
    }

    movePlayer(y: number, x: number): void {
        playery += y;
        playerx += x;
        bombs++;
        map[playery][playerx] = new Air();
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
    }
}
interface Heading {
    updateTile(y: number, x: number): void;
    canMoveForward(y: number, x: number): boolean;
    moveForward(y: number, x: number): void;
}

class LeftHeading implements Heading {
    updateTile(y: number, x: number): void {
        if (this.canMoveForward(y, x)) {
            this.moveForward(y, x);
            return;
        }
        map[y][x] = new Monster(new UpHeading(), new ClockwiseRotationMonsterStrategy());
    }

    canMoveForward(y: number, x: number): boolean {
        return map[y][x - 1].isAir();
    }

    moveForward(y: number, x: number): void {
        map[y][x] = new Air();
        map[y][x - 1] = new Monster(new LeftHeading(), new ClockwiseRotationMonsterStrategy());
    }

}

class RightHeading implements Heading {
    updateTile(y: number, x: number): void {
        if (this.canMoveForward(y, x)) {
            this.moveForward(y, x);
            return;
        }
        map[y][x] = new Monster(new DownHeading(), new ClockwiseRotationMonsterStrategy());
    }

    canMoveForward(y: number, x: number): boolean {
        return map[y][x + 1].isAir();
    }

    moveForward(y: number, x: number): void {
        map[y][x] = new Air();
        map[y][x + 1] = new TmpMonster(new TmpMonsterRightHeading());
    }
}

class UpHeading implements Heading {
    updateTile(y: number, x: number): void {
        if (this.canMoveForward(y, x)) {
            this.moveForward(y, x);
            return;
        }
        map[y][x] = new Monster(new RightHeading(), new ClockwiseRotationMonsterStrategy());
    }

    canMoveForward(y: number, x: number): boolean {
        return map[y - 1][x].isAir();
    }

    moveForward(y: number, x: number): void {
        map[y][x] = new Air();
        map[y - 1][x] = new Monster(new UpHeading(), new ClockwiseRotationMonsterStrategy());
    }

}

class DownHeading implements Heading {
    updateTile(y: number, x: number): void {
        if (this.canMoveForward(y, x)) {
            this.moveForward(y, x);
            return;
        }
        map[y][x] = new Monster(new LeftHeading(), new ClockwiseRotationMonsterStrategy());
    }

    canMoveForward(y: number, x: number): boolean {
        return map[y + 1][x].isAir();
    }

    moveForward(y: number, x: number): void {
        map[y][x] = new Air();
        map[y + 1][x] = new TmpMonster(new TmpMonsterDownHeading());
    }

}

interface MonsterMoveStrategy {
    updateTile(y: number, x: number, heading: Heading): void;
}

class ClockwiseRotationMonsterStrategy implements MonsterMoveStrategy {
    updateTile(y: number, x: number, heading: Heading): void {
        heading.updateTile(y, x);
    }

}

class Monster implements Tile {
    constructor(private heading: Heading, private monsterMoveStrategy: MonsterMoveStrategy) {
    }

    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#cc00cc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    isGameOver(): Boolean {
        return true;
    }

    movePlayer(y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
        this.monsterMoveStrategy.updateTile(y, x, this.heading);
    }
}
interface TmpMonsterHeading {
    updateTile(y: number, x: number): void;
}

class TmpMonsterDownHeading implements TmpMonsterHeading {
    updateTile(y: number, x: number): void {
        map[y][x] = new Monster(new DownHeading(), new ClockwiseRotationMonsterStrategy());
    }
}

class TmpMonsterRightHeading implements TmpMonsterHeading {
    updateTile(y: number, x: number): void {
        map[y][x] = new Monster(new RightHeading(), new ClockwiseRotationMonsterStrategy());
    }
}

class TmpMonster implements Tile {
    constructor(private heading: TmpMonsterHeading) {
    }
    isAir(): boolean {
        return false;
    }

    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    isGameOver(): Boolean {
        return false;
    }

    movePlayer(y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(x: number, y: number): void {
        map[y][x] = new Fire();
    }

    explodeTmpFire(x: number, y: number): void {
        map[y][x] = new TmpFire();
    }

    updateTile(y: number, x: number): void {
        this.heading.updateTile(y, x);
    }
}

interface Input {
    move(): void;
}

class Up implements Input {
    move(): void {
        map[playery - 1][playerx].movePlayer(-1, 0);
    }
}

class Down implements Input {
    move(): void {
        map[playery + 1][playerx].movePlayer(1, 0);
    }
}

class Right implements Input {
    move(): void {
        map[playery][playerx + 1].movePlayer(0, 1);
    }
}

class Left implements Input {
    move(): void {
        map[playery][playerx - 1].movePlayer(0, -1);
    }
}

class Place implements Input {
    move(): void {
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

function transformTile(tile: RawTile) {
    switch (tile) {
        case RawTile.AIR:
            return new Air();
        case RawTile.BOMB:
            return new Bomb(new Normal());
        case RawTile.BOMB_CLOSE:
            return new Bomb(new Close());
        case RawTile.BOMB_REALLY_CLOSE:
            return new Bomb(new ReallyClose());
        case RawTile.EXTRA_BOMB:
            return new ExtraBomb();
        case RawTile.FIRE:
            return new Fire();
        case RawTile.TMP_FIRE:
            return new TmpFire();
        case RawTile.STONE:
            return new Stone();
        case RawTile.UNBREAKABLE:
            return new Unbreakable();
        case RawTile.MONSTER_UP:
            return new Monster(new UpHeading(), new ClockwiseRotationMonsterStrategy());
        case RawTile.MONSTER_DOWN:
            return new Monster(new DownHeading(), new ClockwiseRotationMonsterStrategy());
        case RawTile.TMP_MONSTER_DOWN:
            return new TmpMonster(new TmpMonsterDownHeading());
        case RawTile.MONSTER_LEFT:
            return new Monster(new LeftHeading(), new ClockwiseRotationMonsterStrategy());
        case RawTile.MONSTER_RIGHT:
            return new Monster(new RightHeading(), new ClockwiseRotationMonsterStrategy());
        case RawTile.TMP_MONSTER_RIGHT:
            return new TmpMonster(new TmpMonsterRightHeading());
        default:
            throw new Error("Unknown tile: " + tile);
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
        map[playery][playerx] = new Bomb(new Normal());
        bombs--;
    }
}

function handleInputs() {
    while (!gameOver && inputs.length > 0) {
        let input = inputs.pop();
        input.move();
    }
}

function updateMap() {
    for (let y = 1; y < map.length; y++) {
        for (let x = 1; x < map[y].length; x++) {
            map[y][x].updateTile(y, x);
        }
    }
}

function markIfGameOver() {
    if (map[playery][playerx].isGameOver()) {
        gameOver = true;
    }
}

function update() {
    handleInputs();
    markIfGameOver();
    if (--delay > 0) return;
    delay = DELAY;
    updateMap();
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
            map[y][x].drawBlock(y, x, g);
        }
    }
}

function drawPlayerIfGameNotOver(g: CanvasRenderingContext2D) {
    if (!gameOver)
        g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function setPlayerColor(g: CanvasRenderingContext2D) {
    g.fillStyle = "#00ff00";
}

function drawPlayer(g: CanvasRenderingContext2D) {
    setPlayerColor(g);
    drawPlayerIfGameNotOver(g);
}

function draw() {
    let g = createGraphics();
    drawMap(g);
    drawPlayer(g);
}

function gameLoop() {
    let before = Date.now();
    update();
    draw();
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
