const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
const TPS = 2;
const DELAY = FPS / TPS;

// --------- Input ---------
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

class Right implements Input {
    handle() {
        move(1, 0);
    }
}

class Left implements Input {
    handle() {
        move(-1, 0);
    }
}

class Place implements Input {
    handle() {
        placeBomb();
    }
}

// --------- Input ---------

interface MonsterDirection {
    update(x: number, y: number): void;
}

class MonsterUp implements MonsterDirection {
    update(x: number, y: number): void {
        if (map[y - 1][x].isAir()) {
            map[y][x] = new Air();
            map[y - 1][x] = new Monster(new MonsterMoveStrategy(new MonsterUp()));
        } else {
            map[y][x] = new Monster(new MonsterMoveStrategy(new MonsterRight()));
        }
    }
}

class MonsterRight implements MonsterDirection {
    update(x: number, y: number): void {
        if (map[y][x + 1].isAir()) {
            map[y][x] = new Air();
            map[y][x + 1] = new TmpMonsterRight();
        } else {
            map[y][x] = new Monster(new MonsterMoveStrategy(new MonsterDown()));
        }
    }
}

class MonsterDown implements MonsterDirection {
    update(x: number, y: number): void {
        if (map[y + 1][x].isAir()) {
            map[y][x] = new Air();
            map[y + 1][x] = new TmpMonsterDown();
        } else {
            map[y][x] = new Monster(new MonsterMoveStrategy(new MonsterLeft()));
        }
    }
}

class MonsterLeft implements MonsterDirection {
    update(x: number, y: number): void {
        if (map[y][x - 1].isAir()) {
            map[y][x] = new Air();
            map[y][x - 1] = new Monster(new MonsterMoveStrategy(new MonsterLeft()));
        } else {
            map[y][x] = new Monster(new MonsterMoveStrategy(new MonsterUp()));
        }
    }
}

class MonsterMoveStrategy {
    constructor(private direction: MonsterDirection) {
        // do nothing
    }

    update(x: number, y: number): void {
        this.direction.update(x, y);
    }
}

// --------- Tile ---------

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

    draw(g: CanvasRenderingContext2D, x: number, y: number): void;

    move(x: number, y: number): void;

    isBombFamily(): boolean;

    isKillable(): boolean;

    update(x: number, y: number): void;
}

class Air implements Tile {
    isAir(): boolean {
        return true;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        // do nothing
    }

    move(x: number, y: number): void {
        playery += y;
        playerx += x;
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        // do nothing
    }
}

class Unbreakable implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return true;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#999999";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        // do nothing
    }
}

class Stone implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return true;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#0000cc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        // do nothing
    }
}

class Bomb implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#770000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return true;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        map[y][x] = new BombClose();
    }
}

class BombClose implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#cc0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return true;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        map[y][x] = new BombReallyClose();
    }
}

class BombReallyClose implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#ff0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return true;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        explodeFire(x, y - 1);
        explodeTmpFire(x, y + 1);
        explodeFire(x - 1, y);
        explodeTmpFire(x + 1, y);
        map[y][x] = new Fire();
        bombs++;
    }
}

class TmpFire implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        map[y][x] = new Fire();
    }
}

class Fire implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#ffcc00";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        playery += y;
        playerx += x;
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return true;
    }

    update(x: number, y: number): void {
        map[y][x] = new Air();
    }
}

class ExtraBomb implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#00cc00";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        playery += y;
        playerx += x;
        bombs++;
        map[playery][playerx] = new Air();
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        // do nothing
    }
}

class Monster implements Tile {
    constructor(private moveStrategy: MonsterMoveStrategy) {
    }

    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#cc00cc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return true;
    }

    update(x: number, y: number): void {
        this.moveStrategy.update(x, y);
    }
}

class TmpMonsterRight implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        map[y][x] = new Monster(new MonsterMoveStrategy(new MonsterRight()));
    }
}

class TmpMonsterDown implements Tile {
    isAir(): boolean {
        return false;
    }

    isUnbreakable(): boolean {
        return false;
    }

    isStone(): boolean {
        return false;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(x: number, y: number): void {
        map[y][x] = new Monster(new MonsterMoveStrategy(new MonsterDown()));
    }
}
// --------- Tile ---------

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

function assertExhausted(x: never): never {
    throw new Error("Unexpected object: " + x);
}

function transformTile(tile: RawTile) {
    switch (tile) {
        case RawTile.AIR:
            return new Air();
        case RawTile.UNBREAKABLE:
            return new Unbreakable();
        case RawTile.STONE:
            return new Stone();
        case RawTile.BOMB:
            return new Bomb();
        case RawTile.BOMB_CLOSE:
            return new BombClose();
        case RawTile.BOMB_REALLY_CLOSE:
            return new BombReallyClose();
        case RawTile.TMP_FIRE:
            return new TmpFire();
        case RawTile.FIRE:
            return new Fire();
        case RawTile.EXTRA_BOMB:
            return new ExtraBomb();
        case RawTile.MONSTER_UP:
            return new Monster(new MonsterMoveStrategy(new MonsterUp()));
        case RawTile.MONSTER_RIGHT:
            return new Monster(new MonsterMoveStrategy(new MonsterRight()));
        case RawTile.TMP_MONSTER_RIGHT:
            return new TmpMonsterRight();
        case RawTile.MONSTER_DOWN:
            return new Monster(new MonsterMoveStrategy(new MonsterDown()));
        case RawTile.TMP_MONSTER_DOWN:
            return new TmpMonsterDown();
        case RawTile.MONSTER_LEFT:
            return new Monster(new MonsterMoveStrategy(new MonsterLeft()));
        default:
            return assertExhausted(tile);
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

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

// type 에 사용하는 Tile 이 Fire 와 TmpFire 밖에 없어 메소드 전문화
function explodeFire(x: number, y: number) {
    if (map[y][x].isStone()) {
        if (Math.random() < 0.1)
            map[y][x] = new ExtraBomb()
        else
            map[y][x] = new Fire();
    } else if (!map[y][x].isUnbreakable()) {
        if (map[y][x].isBombFamily())
            bombs++;
        map[y][x] = new Fire();
    }
}

function explodeTmpFire(x: number, y: number) {
    if (map[y][x].isStone()) {
        if (Math.random() < 0.1)
            map[y][x] = new ExtraBomb();
        else
            map[y][x] = new TmpFire();
    } else if (!map[y][x].isUnbreakable()) {
        if (map[y][x].isBombFamily())
            bombs++;
        map[y][x] = new TmpFire();
    }
}

function move(x: number, y: number) {
    map[playery + y][playerx + x].move(x, y);
}

function placeBomb() {
    if (bombs > 0) {
        map[playery][playerx] = new Bomb();
        bombs--;
    }
}

function update() {
    handleInputs();

    if (map[playery][playerx].isKillable())
        gameOver = true;

    if (--delay > 0) return;
    delay = DELAY;
    updateMap();
}

function handleInputs() {
    while (!gameOver && inputs.length > 0) {
        let input: Input = inputs.pop();
        input.handle();
    }
}

function updateMap() {
    for (let y = 1; y < map.length; y++) {
        for (let x = 1; x < map[y].length; x++) {
            updateTile(x, y);
        }
    }
}

function updateTile(x: number, y: number) {
    map[y][x].update(x, y);
}

function createGraphics(): CanvasRenderingContext2D {
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

function drawMap(g: CanvasRenderingContext2D) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x].draw(g, x, y);
        }
    }
}

function drawPlayer(g: CanvasRenderingContext2D) {
    if (!gameOver) {
        g.fillStyle = "#00ff00";
        g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
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
