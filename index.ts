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
        map.updateMonster(
            x,
            y,
            0,
            -1,
            new Monster(new MonsterMoveStrategy(new MonsterUp())),
            new Monster(new MonsterMoveStrategy(new MonsterRight()))
        );
    }
}

class MonsterRight implements MonsterDirection {
    update(map: Map, x: number, y: number): void {
        map.updateMonster(
            x,
            y,
            1,
            0,
            new TmpTile(new TmpMonsterRight()),
            new Monster(new MonsterMoveStrategy(new MonsterDown()))
        );
    }
}

class MonsterDown implements MonsterDirection {
    update(map: Map, x: number, y: number): void {
        map.updateMonster(
            x,
            y,
            0,
            1,
            new TmpTile(new TmpMonsterDown()),
            new Monster(new MonsterMoveStrategy(new MonsterLeft()))
        );
    }
}

class MonsterLeft implements MonsterDirection {
    update(map: Map, x: number, y: number): void {
        map.updateMonster(
            x,
            y,
            -1,
            0,
            new Monster(new MonsterMoveStrategy(new MonsterLeft())),
            new Monster(new MonsterMoveStrategy(new MonsterUp()))
        );
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
        map.setTile(x, y, new Monster(new MonsterMoveStrategy(new MonsterRight())));
    }
}

class TmpMonsterDown implements TmpTileStrategy {
    update(map: Map, x: number, y: number): void {
        map.setTile(x, y, new Monster(new MonsterMoveStrategy(new MonsterDown())));
    }
}

class TmpFire implements TmpTileStrategy {
    update(map: Map, x: number, y: number): void {
        map.setTile(x, y, new Fire());
    }
}

interface ExplodeStrategy {
    explode(map: Map, x: number, y: number): void;
}

class FireExplode implements ExplodeStrategy {
    explode(map: Map, x: number, y: number): void {
        map.setTile(x, y, new Fire());
    }
}

class TmpFireExplode implements ExplodeStrategy {
    explode(map: Map, x: number, y: number): void {
        map.setTile(x, y, new TmpTile(new TmpFire()));
    }
}

interface BombState {
    update(map: Map, x: number, y: number): void;

    draw(g: CanvasRenderingContext2D, x: number, y: number): void;
}

class BombInit implements BombState {
    update(map: Map, x: number, y: number): void {
        map.setTile(x, y, new Bomb(new BombClose()));
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#770000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

class BombClose implements BombState {
    update(map: Map, x: number, y: number): void {
        map.setTile(x, y, new Bomb(new BombReallyClose()));
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#cc0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

class BombReallyClose implements BombState {
    update(map: Map, x: number, y: number): void {
        map.explode(x, y - 1, new FireExplode());
        map.explode(x, y + 1, new TmpFireExplode());
        map.explode(x - 1, y, new FireExplode());
        map.explode(x + 1, y, new TmpFireExplode());
        map.setTile(x, y, new Fire());
        bombs++;
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number): void {
        g.fillStyle = "#ff0000";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

// --------- Tile ---------

interface RawTileValue {
    transform(): Tile;
}

class AirValue implements RawTileValue {
    transform(): Tile {
        return new Air();
    }
}

class UnbreakableValue implements RawTileValue {
    transform(): Tile {
        return new Unbreakable();
    }
}

class StoneValue implements RawTileValue {
    transform(): Tile {
        return new Stone();
    }
}

class BombValue implements RawTileValue {
    transform(): Tile {
        return new Bomb(new BombInit());
    }
}

class BombCloseValue implements RawTileValue {
    transform(): Tile {
        return new Bomb(new BombClose());
    }
}

class BombReallyCloseValue implements RawTileValue {
    transform(): Tile {
        return new Bomb(new BombReallyClose());
    }
}

class TmpFireValue implements RawTileValue {
    transform(): Tile {
        return new TmpTile(new TmpFire());
    }
}

class FireValue implements RawTileValue {
    transform(): Tile {
        return new Fire();
    }
}

class ExtraBombValue implements RawTileValue {
    transform(): Tile {
        return new ExtraBomb();
    }
}

class MonsterUpValue implements RawTileValue {
    transform(): Tile {
        return new Monster(new MonsterMoveStrategy(new MonsterUp()));
    }
}

class MonsterRightValue implements RawTileValue {
    transform(): Tile {
        return new Monster(new MonsterMoveStrategy(new MonsterRight()));
    }
}

class TmpMonsterRightValue implements RawTileValue {
    transform(): Tile {
        return new TmpTile(new TmpMonsterRight());
    }
}

class MonsterDownValue implements RawTileValue {
    transform(): Tile {
        return new Monster(new MonsterMoveStrategy(new MonsterDown()));
    }
}

class TmpMonsterDownValue implements RawTileValue {
    transform(): Tile {
        return new TmpTile(new TmpMonsterDown());
    }
}

class MonsterLeftValue implements RawTileValue {
    transform(): Tile {
        return new Monster(new MonsterMoveStrategy(new MonsterLeft()));
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

    private constructor(private value: RawTileValue) {

    }

    transform(): Tile {
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
        map.setTile(x, y, new Air());
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

let rawMap: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 1],
    [1, 0, 1, 2, 1, 2, 1, 2, 0, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 2, 1, 2, 1, 0, 1, 0, 2, 1, 2, 1, 0, 1, 0, 1],
    [1, 2, 2, 2, 2, 0, 0, 10, 2, 2, 2, 2, 0, 0, 10, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 1],
    [1, 0, 1, 2, 1, 2, 1, 2, 0, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 2, 1, 2, 1, 0, 1, 0, 2, 1, 2, 1, 0, 1, 0, 1],
    [1, 2, 2, 2, 2, 0, 0, 10, 2, 2, 2, 2, 0, 0, 10, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

class Player {
    private gameOver: boolean = false;

    constructor(private x: number, private y: number, private color: string) {
    }

    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    eatExtraBomb(map: Map, x: number, y: number): void {
        this.move(x, y);
        bombs++;
        map.setTile(this.x, this.y, new Air());
    }

    handleInput(map: Map, x: number, y: number) {
        if (!this.gameOver)
            map.handleInput(this, this.x + x, this.y + y, x, y);
    }

    placeBomb(map: Map) {
        map.placeBomb(this.x, this.y);
    }

    checkDeath(map: Map) {
        map.checkDeath(this, this.x, this.y);
    }

    draw(g: CanvasRenderingContext2D) {
        if (!this.gameOver) {
            g.fillStyle = this.color;
            g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    isKilled() {
        this.gameOver = true;
    }
}

class Map {
    private readonly map: Tile[][];

    constructor() {
        this.map = new Array(rawMap.length);
        for (let y = 0; y < rawMap.length; y++) {
            this.map[y] = new Array(rawMap[y].length);
            for (let x = 0; x < rawMap[y].length; x++) {
                this.map[y][x] = RAW_TILES[rawMap[y][x]].transform();
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

    update() {
        for (let y = 1; y < this.map.length; y++) {
            for (let x = 1; x < this.map[y].length; x++) {
                this.map[y][x].update(map, x, y);
            }
        }
    }

    explode(x: number, y: number, explodeStrategy: ExplodeStrategy) {
        if (this.map[y][x].isStone()) {
            if (Math.random() < 0.1)
                this.map[y][x] = new ExtraBomb()
            else
                explodeStrategy.explode(map, x, y);
        } else if (!this.map[y][x].isUnbreakable()) {
            if (this.map[y][x].isBombFamily())
                bombs++;
            explodeStrategy.explode(map, x, y);
        }
    }

    setTile(x: number, y: number, tile: Tile) {
        this.map[y][x] = tile;
    }

    updateMonster(x: number, y: number, dx: number, dy: number, tileCanGo: Tile, tileIfBlock: Tile): void {
        if (this.map[y + dy][x + dx].isAir()) {
            this.map[y][x] = new Air();
            this.map[y + dy][x + dx] = tileCanGo;
        } else {
            this.map[y][x] = tileIfBlock;
        }
    }

    handleInput(player: Player, newX: number, newY: number, x: number, y: number) {
        this.map[newY][newX].move(this, player, x, y);
    }

    placeBomb(x: number, y: number) {
        if (bombs > 0) {
            this.map[y][x] = new Bomb(new BombInit());
            bombs--;
        }
    }

    checkDeath(player: Player, x: number, y: number) {
        if (this.map[y][x].isKillable())
            player.isKilled();
    }
}

let player1 = new Player(1, 1, "#00ff00");
let player2 = new Player(1, 8, "#ff0000");

let map = new Map();

let inputs: { player: Player, input: Input }[] = [];

let delay = 0;
let bombs = 1;

function update(map: Map, player1: Player, player2: Player) {
    handleInputs(map, player1, player2);
    player1.checkDeath(map);
    player2.checkDeath(map);
    if (--delay > 0)
        return;
    delay = DELAY;
    map.update();
}

function handleInputs(map: Map, player1: Player, player2: Player) {
    while (inputs.length > 0) {
        let { player, input } = inputs.pop();
        input.handle(map, player);
    }
}

function createGraphics(): CanvasRenderingContext2D {
    let canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
    let g = canvas.getContext("2d");
    g.clearRect(0, 0, canvas.width, canvas.height);
    return g;
}

function draw(map: Map, player1: Player, player2: Player) {
    let g = createGraphics();
    map.draw(g);
    player1.draw(g);
    player2.draw(g);
}

function gameLoop(map: Map) {
    let before = Date.now();
    update(map, player1, player2);
    draw(map, player1, player2);
    let after = Date.now();
    let frameTime = after - before;
    let sleep = SLEEP - frameTime;
    setTimeout(() => gameLoop(map), sleep);
}

window.onload = () => {
    gameLoop(map);
};

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", (e) => {
    if (e.key === LEFT_KEY ) inputs.push({ player: player1, input: new Left() });
    else if (e.key === UP_KEY ) inputs.push({ player: player1, input: new Up() });
    else if (e.key === RIGHT_KEY ) inputs.push({ player: player1, input: new Right() });
    else if (e.key === DOWN_KEY) inputs.push({ player: player1, input: new Down() });
    else if (e.key === " ") inputs.push({ player: player1, input: new Place() });

    if (e.key === "a") inputs.push({ player: player2, input: new Left() });
    else if (e.key === "w") inputs.push({ player: player2, input: new Up() });
    else if (e.key === "d") inputs.push({ player: player2, input: new Right() });
    else if (e.key === "s") inputs.push({ player: player2, input: new Down() });
    else if (e.key === "Shift") inputs.push({ player: player2, input: new Place() });
});
