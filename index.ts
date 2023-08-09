const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
const TPS = 2;
const DELAY = FPS / TPS;

// --------- Input ---------
interface Input {
    handle(map: Map, player: Player): void;
}

class Up implements Input {
    handle(map: Map, player: Player) {
        player.handleInput(map, 0, -1);
    }
}

class Down implements Input {
    handle(map: Map, player: Player) {
        player.handleInput(map, 0, 1);
    }
}

class Right implements Input {
    handle(map: Map, player: Player) {
        player.handleInput(map, 1, 0);
    }
}

class Left implements Input {
    handle(map: Map, player: Player) {
        player.handleInput(map, -1, 0);
    }
}

class Place implements Input {
    handle(map: Map, player: Player) {
        player.placeBomb(map);
    }
}

// --------- Input ---------

interface MonsterDirection {
    update(map: Map, x: number, y: number): void;
}

class MonsterUp implements MonsterDirection {
    update(map: Map, x: number, y: number): void {
        if (map.getMap()[y - 1][x].isAir()) {
            map.getMap()[y][x] = new Air();
            map.getMap()[y - 1][x] = new Monster(new MonsterMoveStrategy(new MonsterUp()));
        } else {
            map.getMap()[y][x] = new Monster(new MonsterMoveStrategy(new MonsterRight()));
        }
    }
}

class MonsterRight implements MonsterDirection {
    update(map: Map, x: number, y: number): void {
        if (map.getMap()[y][x + 1].isAir()) {
            map.getMap()[y][x] = new Air();
            map.getMap()[y][x + 1] = new TmpTile(new TmpMonsterRight());
        } else {
            map.getMap()[y][x] = new Monster(new MonsterMoveStrategy(new MonsterDown()));
        }
    }
}

class MonsterDown implements MonsterDirection {
    update(map: Map, x: number, y: number): void {
        if (map.getMap()[y + 1][x].isAir()) {
            map.getMap()[y][x] = new Air();
            map.getMap()[y + 1][x] = new TmpTile(new TmpMonsterDown());
        } else {
            map.getMap()[y][x] = new Monster(new MonsterMoveStrategy(new MonsterLeft()));
        }
    }
}

class MonsterLeft implements MonsterDirection {
    update(map: Map, x: number, y: number): void {
        if (map.getMap()[y][x - 1].isAir()) {
            map.getMap()[y][x] = new Air();
            map.getMap()[y][x - 1] = new Monster(new MonsterMoveStrategy(new MonsterLeft()));
        } else {
            map.getMap()[y][x] = new Monster(new MonsterMoveStrategy(new MonsterUp()));
        }
    }
}

class MonsterMoveStrategy {
    constructor(private direction: MonsterDirection) {
        // do nothing
    }

    update(map: Map, x: number, y: number): void {
        this.direction.update(map, x, y);
    }
}

interface TmpTileStrategy {
    update(map: Map, x: number, y: number): void;
}

class TmpMonsterRight implements TmpTileStrategy {
    update(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new Monster(new MonsterMoveStrategy(new MonsterRight()));
    }
}

class TmpMonsterDown implements TmpTileStrategy {
    update(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new Monster(new MonsterMoveStrategy(new MonsterDown()));
    }
}

class TmpFire implements TmpTileStrategy {
    update(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new Fire();
    }
}

interface ExplodeStrategy {
    explode(map: Map, x: number, y: number): void;
}

class FireExplode implements ExplodeStrategy {
    explode(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new Fire();
    }
}

class TmpFireExplode implements ExplodeStrategy {
    explode(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new TmpTile(new TmpFire());
    }
}

interface BombState {
    update(map: Map, x: number, y: number): void;

    draw(g: CanvasRenderingContext2D, x: number, y: number): void;
}

class BombInit implements BombState {
    update(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new Bomb(new BombClose());
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#770000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

class BombClose implements BombState {
    update(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new Bomb(new BombReallyClose());
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#cc0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

class BombReallyClose implements BombState {
    update(map: Map, x: number, y: number): void {
        explode(map, x, y - 1, new FireExplode());
        explode(map, x, y + 1, new TmpFireExplode());
        explode(map, x - 1, y, new FireExplode());
        explode(map, x + 1, y, new TmpFireExplode());
        map.getMap()[y][x] = new Fire();
        bombs++;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#ff0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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

    move(map: Map, player: Player, x: number, y: number): void;

    isBombFamily(): boolean;

    isKillable(): boolean;

    update(map: Map, x: number, y: number): void;
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

    move(map: Map, player: Player, x: number, y: number): void {
        player.move(x, y);
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(map: Map, x: number, y: number): void {
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

    move(map: Map, player: Player, x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(map: Map, x: number, y: number): void {
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

    move(map: Map, player: Player, x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(map: Map, x: number, y: number): void {
        // do nothing
    }
}

class Bomb implements Tile {
    constructor(private bombState: BombState) {
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
        this.bombState.draw(g, x, y);
    }

    move(map: Map, player: Player, x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return true;
    }

    isKillable(): boolean {
        return false;
    }

    update(map: Map, x: number, y: number): void {
        this.bombState.update(map, x, y);
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

    move(map: Map, player: Player, x: number, y: number): void {
        player.move(x, y);
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return true;
    }

    update(map: Map, x: number, y: number): void {
        map.getMap()[y][x] = new Air();
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

    move(map: Map, player: Player, x: number, y: number): void {
        player.eatExtraBomb(map, x, y);
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(map: Map, x: number, y: number): void {
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

    move(map: Map, player: Player, x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return true;
    }

    update(map: Map, x: number, y: number): void {
        this.moveStrategy.update(map, x, y);
    }
}

class TmpTile implements Tile {
    constructor(private direction: TmpTileStrategy) {
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
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    move(map: Map, player: Player, x: number, y: number): void {
        // do nothing
    }

    isBombFamily(): boolean {
        return false;
    }

    isKillable(): boolean {
        return false;
    }

    update(map: Map, x: number, y: number): void {
        this.direction.update(map, x, y);
    }
}

// --------- Tile ---------

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

class Player {
    private x = 1;
    private y = 1;

    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    eatExtraBomb(map: Map, x: number, y: number): void {
        this.move(x, y);
        bombs++;
        map.getMap()[this.y][this.x] = new Air();
    }

    handleInput(map: Map, x: number, y: number) {
        map.getMap()[this.y + y][this.x + x].move(map, this, x, y);
    }

    placeBomb(map: Map) {
        if (bombs > 0) {
            map.getMap()[this.y][this.x] = new Bomb(new BombInit());
            bombs--;
        }
    }

    checkDeath(map: Map) {
        if (map.getMap()[this.y][this.x].isKillable())
            gameOver = true;
    }

    draw(g: CanvasRenderingContext2D) {
        if (!gameOver) {
            g.fillStyle = "#00ff00";
            g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

class Map {
    private map: Tile[][];
    getMap(): Tile[][] {
        return this.map;
    }
    setMap(map: Tile[][]) {
        this.map = map;
    }
}

let player = new Player();

let map = new Map();

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
            return new Bomb(new BombInit());
        case RawTile.BOMB_CLOSE:
            return new Bomb(new BombClose());
        case RawTile.BOMB_REALLY_CLOSE:
            return new Bomb(new BombReallyClose());
        case RawTile.TMP_FIRE:
            return new TmpTile(new TmpFire());
        case RawTile.FIRE:
            return new Fire();
        case RawTile.EXTRA_BOMB:
            return new ExtraBomb();
        case RawTile.MONSTER_UP:
            return new Monster(new MonsterMoveStrategy(new MonsterUp()));
        case RawTile.MONSTER_RIGHT:
            return new Monster(new MonsterMoveStrategy(new MonsterRight()));
        case RawTile.TMP_MONSTER_RIGHT:
            return new TmpTile(new TmpMonsterRight());
        case RawTile.MONSTER_DOWN:
            return new Monster(new MonsterMoveStrategy(new MonsterDown()));
        case RawTile.TMP_MONSTER_DOWN:
            return new TmpTile(new TmpMonsterDown());
        case RawTile.MONSTER_LEFT:
            return new Monster(new MonsterMoveStrategy(new MonsterLeft()));
        default:
            return assertExhausted(tile);
    }
}

function transformMap(map: Map) {
    map.setMap(new Array(rawMap.length));
    for (let y = 0; y < rawMap.length; y++) {
        map.getMap()[y] = new Array(rawMap[y].length);
        for (let x = 0; x < rawMap[y].length; x++) {
            map.getMap()[y][x] = transformTile(rawMap[y][x]);
        }
    }
}

let inputs: Input[] = [];

let delay = 0;
let bombs = 1;
let gameOver = false;

function explode(map: Map, x: number, y: number, explodeStrategy: ExplodeStrategy) {
    if (map.getMap()[y][x].isStone()) {
        if (Math.random() < 0.1)
            map.getMap()[y][x] = new ExtraBomb()
        else
            explodeStrategy.explode(map, x, y);
    } else if (!map.getMap()[y][x].isUnbreakable()) {
        if (map.getMap()[y][x].isBombFamily())
            bombs++;
        explodeStrategy.explode(map, x, y);
    }
}

function update(map: Map, player: Player) {
    handleInputs(map, player);
    player.checkDeath(map);
    if (--delay > 0)
        return;
    delay = DELAY;
    updateMap(map);
}

function handleInputs(map: Map, player: Player) {
    while (!gameOver && inputs.length > 0) {
        let input: Input = inputs.pop();
        input.handle(map, player);
    }
}

function updateMap(map: Map) {
    for (let y = 1; y < map.getMap().length; y++) {
        for (let x = 1; x < map.getMap()[y].length; x++) {
            map.getMap()[y][x].update(map, x, y);
        }
    }
}

function createGraphics(): CanvasRenderingContext2D {
    let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
    let g = canvas.getContext("2d");
    g.clearRect(0, 0, canvas.width, canvas.height);
    return g;
}

function draw(map: Map, player: Player) {
    let g = createGraphics();
    drawMap(map, g);
    player.draw(g)
}

function drawMap(map: Map, g: CanvasRenderingContext2D) {
    for (let y = 0; y < map.getMap().length; y++) {
        for (let x = 0; x < map.getMap()[y].length; x++) {
            map.getMap()[y][x].draw(g, x, y);
        }
    }
}

function gameLoop(map: Map) {
    let before = Date.now();
    update(map, player);
    draw(map, player);
    let after = Date.now();
    let frameTime = after - before;
    let sleep = SLEEP - frameTime;
    setTimeout(() => gameLoop(map), sleep);
}

window.onload = () => {
    transformMap(map);
    gameLoop(map);
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
