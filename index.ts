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

    movePlayer(map: Map, player: Player, dy: number, dx: number): void;

    close(): void;

    reallyClose(): void;

    explodeFire(map: Map, x: number, y: number): void;

    explodeTmpFire(map: Map, x: number, y: number): void;

    update(map: Map, y: number, x: number): void;
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

    movePlayer(map: Map, player: Player, dy: number, dx: number): void {
        player.movePlayer(dy, dx)
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
    }

    update(map: Map, y: number, x: number): void {
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
        if (Math.random() < 0.1) {
            map.updateTile(y, x, new ExtraBomb());
            return;
        }
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        if (Math.random() < 0.1) {
            map.updateTile(y, x, new ExtraBomb());
            return;
        }
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
    }
}

interface Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void;

    updateTile(map: Map, y: number, x: number): void;
}

class Normal implements Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#770000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    updateTile(map: Map, y: number, x: number): void {
        map.close(y, x);
    }

}

class Close implements Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#cc0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    updateTile(map: Map, y: number, x: number): void {
        map.reallyClose(y, x);
    }

}

class ReallyClose implements Bombable {
    drawBlock(y: number, x: number, g: CanvasRenderingContext2D): void {
        g.fillStyle = "#ff0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    updateTile(map: Map, y: number, x: number): void {
        this.explode(map, y, x);
        bombs++;
    }

    private explode(map: Map, y: number, x: number) {
        map.explode(y, x);
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
    }

    close(): void {
        this.status = new Close();
    }

    reallyClose(): void {
        this.status = new ReallyClose();
    }

    explodeFire(map: Map, x: number, y: number): void {
        bombs++;
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        bombs++;
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
        this.status.updateTile(map, y, x);
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Fire());
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
        player.movePlayer(y, x);
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Air());
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
        player.movePlayer(y, x);
        bombs++;
        player.makeAir(map);
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
    }
}

interface Heading {
    updateTile(map: Map, y: number, x: number): void;

    canMoveForward(map: Map, y: number, x: number): boolean;

    moveForward(map: Map, y: number, x: number): void;
}

class LeftHeading implements Heading {
    updateTile(map: Map, y: number, x: number): void {
        if (this.canMoveForward(map, y, x)) {
            this.moveForward(map, y, x);
            return;
        }
        map.updateTile(y, x, new Monster(new ClockwiseRotationMonsterStrategy(new UpHeading())));
    }

    canMoveForward(map: Map, y: number, x: number): boolean {
        return map.canMoveForward(y, x - 1);
    }

    moveForward(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Air());
        map.updateTile(y, x - 1, new Monster(new ClockwiseRotationMonsterStrategy(new LeftHeading())));
    }

}

class RightHeading implements Heading {
    updateTile(map: Map, y: number, x: number): void {
        if (this.canMoveForward(map, y, x)) {
            this.moveForward(map, y, x);
            return;
        }
        map.updateTile(y, x, new Monster(new ClockwiseRotationMonsterStrategy(new DownHeading())));
    }

    canMoveForward(map: Map, y: number, x: number): boolean {
        return map.canMoveForward(y, x + 1);
    }

    moveForward(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Air());
        map.updateTile(y, x + 1, new TmpMonster(new TmpMonsterRightHeading()));
    }
}

class UpHeading implements Heading {
    updateTile(map: Map, y: number, x: number): void {
        if (this.canMoveForward(map, y, x)) {
            this.moveForward(map, y, x);
            return;
        }
        map.updateTile(y, x, new Monster(new ClockwiseRotationMonsterStrategy(new RightHeading())));
    }

    canMoveForward(map: Map, y: number, x: number): boolean {
        return map.canMoveForward(y - 1, x);
    }

    moveForward(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Air());
        map.updateTile(y - 1, x, new Monster(new ClockwiseRotationMonsterStrategy(new UpHeading())));
    }

}

class DownHeading implements Heading {
    updateTile(map: Map, y: number, x: number): void {
        if (this.canMoveForward(map, y, x)) {
            this.moveForward(map, y, x);
            return;
        }
        map.updateTile(y, x, new Monster(new ClockwiseRotationMonsterStrategy(new LeftHeading())));
    }

    canMoveForward(map: Map, y: number, x: number): boolean {
        return map.canMoveForward(y + 1, x);
    }

    moveForward(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Air());
        map.updateTile(y + 1, x, new TmpMonster(new TmpMonsterDownHeading()));
    }

}

interface MonsterMoveStrategy {
    updateTile(map: Map, y: number, x: number): void;
}

class ClockwiseRotationMonsterStrategy implements MonsterMoveStrategy {
    constructor(private heading: Heading) {
    }

    updateTile(map: Map, y: number, x: number): void {
        this.heading.updateTile(map, y, x);
    }

}

class Monster implements Tile {
    constructor(private monsterMoveStrategy: MonsterMoveStrategy) {
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
        this.monsterMoveStrategy.updateTile(map, y, x);
    }
}

interface TmpMonsterHeading {
    updateTile(map: Map, y: number, x: number): void;
}

class TmpMonsterDownHeading implements TmpMonsterHeading {
    updateTile(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Monster(new ClockwiseRotationMonsterStrategy(new DownHeading())));
    }
}

class TmpMonsterRightHeading implements TmpMonsterHeading {
    updateTile(map: Map, y: number, x: number): void {
        map.updateTile(y, x, new Monster(new ClockwiseRotationMonsterStrategy(new RightHeading())));
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

    movePlayer(map: Map, player: Player, y: number, x: number): void {
    }

    close(): void {
    }

    reallyClose(): void {
    }

    explodeFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new Fire());
    }

    explodeTmpFire(map: Map, x: number, y: number): void {
        map.updateTile(y, x, new TmpFire());
    }

    update(map: Map, y: number, x: number): void {
        this.heading.updateTile(map, y, x);
    }
}

interface Input {
    move(map: Map, player: Player): void;
}

class Up implements Input {
    move(map: Map, player: Player): void {
        player.moveTile(map, -1, 0);
    }
}

class Down implements Input {
    move(map: Map, player: Player): void {
        player.moveTile(map, 1, 0);
    }
}

class Right implements Input {
    move(map: Map, player: Player): void {
        player.moveTile(map, 0, 1);
    }
}

class Left implements Input {
    move(map: Map, player: Player): void {
        player.moveTile(map, 0, -1);
    }
}

class Place implements Input {
    move(map: Map, player: Player): void {
        placeBomb(map, player);
    }
}

class Player {
    constructor(private x: number, private y: number) {
    }

    makeBomb(map: Map) {
        map.updateTile(player.y, player.x, new Bomb(new Normal()));
    }

    markIfGameOver(map: Map) {
        if (map.isGameOver(player.y, player.x)) {
            gameOver = true;
        }
    }

    draw(g: CanvasRenderingContext2D) {
        g.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    movePlayer(dy: number, dx: number) {
        this.y += dy;
        this.x += dx;
    }

    makeAir(map: Map) {
        map.updateTile(player.y, player.x, new Air());
    }

    moveTile(map: Map, y: number, x: number) {
        map.moveTile(this, player.y, player.x, y, x);
    }
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
let player = new Player(1, 1)

class Map {
    private map: Tile[][];

    transform(rawMap: RawTile[][]) {
        this.map = new Array(rawMap.length);
        for (let y = 0; y < rawMap.length; y++) {
            this.map[y] = new Array(rawMap[y].length);
            for (let x = 0; x < rawMap[y].length; x++) {
                this.map[y][x] = transformTile(rawMap[y][x]);
            }
        }
    }

    update() {
        for (let y = 1; y < this.map.length; y++) {
            for (let x = 1; x < this.map[y].length; x++) {
                this.map[y][x].update(map, y, x);
            }
        }
    }

    draw(g: CanvasRenderingContext2D) {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                this.map[y][x].drawBlock(y, x, g);
            }
        }
    }

    explode(y: number, x: number) {
        this.map[y - 1][x].explodeFire(map, x, y - 1);
        this.map[y + 1][x].explodeTmpFire(map, x, y + 1);
        this.map[y][x - 1].explodeFire(map, x - 1, y);
        this.map[y][x + 1].explodeTmpFire(map, x + 1, y);
        this.map[y][x] = new Fire();
    }

    updateTile(y: number, x: number, tile: Tile) {
        this.map[y][x] = tile;
    }

    close(y: number, x: number) {
        this.map[y][x].close();
    }

    reallyClose(y: number, x: number) {
        this.map[y][x].reallyClose();
    }

    canMoveForward(y: number, x: number) {
        return this.map[y][x].isAir();
    }

    isGameOver(y: number, x: number) {
        return this.map[y][x].isGameOver();
    }

    moveTile(player: Player, py: number, px: number, y: number, x: number) {
        this.map[py + y][px + x].movePlayer(map, player, y, x);
    }
}

let map = new Map();
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
            return new Monster(new ClockwiseRotationMonsterStrategy(new UpHeading()));
        case RawTile.MONSTER_DOWN:
            return new Monster(new ClockwiseRotationMonsterStrategy(new DownHeading()));
        case RawTile.TMP_MONSTER_DOWN:
            return new TmpMonster(new TmpMonsterDownHeading());
        case RawTile.MONSTER_LEFT:
            return new Monster(new ClockwiseRotationMonsterStrategy(new LeftHeading()));
        case RawTile.MONSTER_RIGHT:
            return new Monster(new ClockwiseRotationMonsterStrategy(new RightHeading()));
        case RawTile.TMP_MONSTER_RIGHT:
            return new TmpMonster(new TmpMonsterRightHeading());
        default:
            throw new Error("Unknown tile: " + tile);
    }
}

function transformMap(map: Map) {
    map.transform(rawMap);
}

function placeBomb(map: Map, player: Player) {
    if (bombs > 0) {
        player.makeBomb(map);
        bombs--;
    }
}

function handleInputs(map: Map, player: Player) {
    while (!gameOver && inputs.length > 0) {
        let input = inputs.pop();
        input.move(map, player);
    }
}

function updateMap(map: Map) {
    map.update();
}

function update(player: Player, map: Map) {
    handleInputs(map, player);
    player.markIfGameOver(map);
    if (--delay > 0) return;
    delay = DELAY;
    updateMap(map);
}

function createGraphics() {
    let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
    let g = canvas.getContext("2d");

    g.clearRect(0, 0, canvas.width, canvas.height);
    return g;
}

function drawPlayerIfGameNotOver(g: CanvasRenderingContext2D, player: Player) {
    if (!gameOver) {
        player.draw(g);
    }
}

function setPlayerColor(g: CanvasRenderingContext2D) {
    g.fillStyle = "#00ff00";
}

function drawPlayer(g: CanvasRenderingContext2D, player: Player) {
    setPlayerColor(g);
    drawPlayerIfGameNotOver(g, player);
}

function draw(player: Player, map: Map) {
    let g = createGraphics();
    map.draw(g);
    drawPlayer(g, player);
}

function gameLoop(player: Player, map: Map) {
    let before = Date.now();
    update(player, map);
    draw(player, map);
    let after = Date.now();
    let frameTime = after - before;
    let sleep = SLEEP - frameTime;
    setTimeout(() => gameLoop(player, map), sleep);
}

window.onload = () => {
    transformMap(map);
    gameLoop(player, map);
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
