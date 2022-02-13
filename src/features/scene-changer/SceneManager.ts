import * as ex from "excalibur";
import {SpriteSheet} from "excalibur";
import {CellConfig} from "../../lib/config/CellConfig";
import {WorldMap} from "../create-map/WorldMap";
import {Player} from "../player/Player";
import {TileMapFactory} from "../create-map/TileMapFactory";
import {Chunk} from "./Chunk";
import {Coord} from "./Coord";
import {Rectangle} from "./Rectangle";
import {GameError} from "../../lib/GameError";
import {WalkableArea} from "./WalkableArea";

export class SceneManager {
    private readonly engine: ex.Engine;
    private readonly worldMap: WorldMap;
    private readonly player: Player;
    private readonly chunkSize:Rectangle
    private readonly walkableArea:WalkableArea

    private chunk: Chunk
    private scene: ex.Scene;

    constructor(engine: ex.Engine, worldMap: WorldMap, initPlayerWorldCoordinate:Coord) {
        this.engine = engine
        this.worldMap = worldMap
        this.chunkSize = this.getChunkSize(this.engine.drawWidth, this.engine.drawHeight)
        this.walkableArea = this.getWalkableArea(this.engine.drawWidth, this.engine.drawHeight)
        this.chunk = this.getChunkFromWorldCoord(initPlayerWorldCoordinate)

        console.log("this.engine.drawWidth", this.engine.drawWidth, this.engine.drawHeight)
        console.log("this.chunkSize", this.chunkSize)
        console.log("this.chunk.originWorldCoord", this.chunk.originWorldCoord)
        console.log("this.walkableArea", this.walkableArea)

        this.player = new Player()
        this.setPlayerInitPos(this.player, this.chunk, initPlayerWorldCoordinate, this.chunkSize)
        console.log("this.player.pos", this.player.pos)

        if (!this.walkableArea.isWithinWalkableArea(initPlayerWorldCoordinate)) {
            throw new GameError("invalid starting pos")
        }

        let _sceneChanger = this
        this.player.graphics.onPreDraw = (ctx: ex.ExcaliburGraphicsContext, delta: number) => {
            _sceneChanger.playerPreDraw()
        }
    }

    private getChunkSize(drawWidth: number, drawHeight: number):Rectangle {
        let width = Math.ceil(drawWidth * 1.5 / CellConfig.CELL_WIDTH)
        let height = Math.ceil(drawHeight * 1.5 / CellConfig.CELL_HEIGHT)
        return new Rectangle(width, height)
    }

    private getWalkableArea(drawWidth: number, drawHeight: number):WalkableArea {
        // Example drawWidth and width: 1200 -> 600
        let width = drawWidth / 2
        let height = drawHeight / 2

        // 600 -> 300. This means walkableArea will be at origin 300, width 600, i.e. 300-900 in screen resolution of width 1200.
        let originX = width / 2
        let originY = height / 2

        let origin = new Coord(
            Math.floor(originX / CellConfig.CELL_WIDTH),
            Math.floor(originY / CellConfig.CELL_HEIGHT),
            )

        let colsOnScreen = Math.ceil(width / CellConfig.CELL_WIDTH)
        let rowsOnScreen = Math.ceil(height / CellConfig.CELL_WIDTH)

        let rectangle = new Rectangle(colsOnScreen, rowsOnScreen)

        return new WalkableArea(origin, rectangle)
    }

    private getChunkFromWorldCoord(coord: Coord):Chunk {
        if (coord.x >= this.worldMap.width) {
            throw new GameError(`x ${coord.x} above worldmap width`)
        }

        if (coord.y >= this.worldMap.height) {
            throw new GameError(`x ${coord.y} above worldmap height`)
        }

        let chunkX = Math.floor(coord.x / this.chunkSize.width)
        let chunkY = Math.floor(coord.y / this.chunkSize.height)

        return new Chunk(new Coord(chunkX, chunkY))
    }

    private setPlayerInitPos(player: Player, chunk: Chunk, initPlayerWorldCoordinate: Coord, chunkSize:Rectangle) {
        let distanceFromChunkEdgeToPlayerX = initPlayerWorldCoordinate.x - chunk.originWorldCoord.x * chunkSize.width
        let distanceFromChunkEdgeToPlayerY = initPlayerWorldCoordinate.y - chunk.originWorldCoord.y * chunkSize.height

        let distanceInPixelsX = distanceFromChunkEdgeToPlayerX * CellConfig.CELL_WIDTH
        let distanceInPixelsY = distanceFromChunkEdgeToPlayerY * CellConfig.CELL_HEIGHT

        player.pos = ex.vec(distanceInPixelsX, distanceInPixelsY)
    }

    private lastCoord:Coord

    playerPreDraw() {
        let col = Math.floor(this.player.pos.x / CellConfig.CELL_WIDTH)
        let row = Math.floor(this.player.pos.y / CellConfig.CELL_HEIGHT)
        let currentCoord = new Coord(col, row)

        if (this.lastCoord !== undefined && currentCoord.equals(this.lastCoord)) {
            return
        }

        if (!this.walkableArea.isWithinWalkableArea(currentCoord)) {
            console.log("SCENE REDRAW")
            this.drawScene()
        }

        // console.log("pos", this.player.pos.x, this.player.pos.y, new Coord(this.lastCol, this.lastRow).toString())

        this.lastCoord = currentCoord
    }

    drawScene() {
        console.log("changeSceneTo", this)

        // TODO change chunk
        let newScene = this.createScene(this.chunk)
        // let newScene = this.createScene2()

        let newSceneName = `chunk-${this.chunk.originWorldCoord.toString()}`
        this.engine.add(newSceneName, newScene)

        // this.chunk = currentChunk

        this.engine.goToScene(newSceneName)

        // Replace scene
        if (this.chunk != undefined) {
            this.engine.removeScene(this.scene) // TODO is this good enough for garbage collection?
        }

        this.scene = newScene
    }

    private createScene(playerChunk: Chunk): ex.Scene {
        let scene = new ex.Scene()

        let tileMap = TileMapFactory.createTileMap(
            this.engine.screen.drawWidth, this.engine.screen.drawHeight, this.worldMap, playerChunk, this.chunkSize)
        console.log("tileMap", tileMap)
        console.log("tileMap", tileMap.rows, tileMap.cols)
        console.log("tileMap data", tileMap.data.length, tileMap.data[0])

        scene.add(tileMap)

        scene.add(this.player);
        scene.camera.strategy.lockToActor(this.player)

        return scene;
    }

    private createScene2():ex.Scene {
        let scene = new ex.Scene()

        let tileMap = new ex.TileMap({
            x: 0,
            y: 0,
            rows: 50,
            cols: 20,
            cellWidth: 48,
            cellHeight: 48,
        });

        let elementsSpriteSheet = createElementsSpriteSheet()
        const grass = elementsSpriteSheet.getSprite(0, 0);

        for (let cell of tileMap.data) {
            cell.addGraphic(grass);
        }

        scene.add(tileMap);
        scene.add(this.player);

        return scene

    }
}

function createElementsSpriteSheet() {
    return SpriteSheet.fromImageSource({
        image: TileMapFactory.loadables()[0],
        grid: {
            rows: 3,
            columns: 8,
            spriteWidth: CellConfig.CELL_WIDTH,
            spriteHeight: CellConfig.CELL_HEIGHT,
        },
        spacing: {
            margin: {
                x: 0,
                y: 0
            }
        }
    });
}