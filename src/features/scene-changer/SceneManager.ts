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

        console.log("this.engine.drawWidth", this.engine.drawWidth, this.engine.drawHeight)
        console.log("this.chunkSize", this.chunkSize)
        console.log("this.walkableArea", this.walkableArea)

        if (!this.walkableArea.isWithinWalkableArea(initPlayerWorldCoordinate)) {
            throw new GameError("invalid starting pos")
        }

        this.player = new Player()

        let _sceneChanger = this
        this.player.graphics.onPreDraw = (ctx: ex.ExcaliburGraphicsContext, delta: number) => {
            _sceneChanger.playerPreDraw()
        }

        this.setChunkAndPlayerPos(initPlayerWorldCoordinate)
    }

    setChunkAndPlayerPos(playerWorldCoordinate: Coord) {
        if (this.chunk != undefined) {
            console.log("old chunk.originWorldCoord", this.chunk.originWorldCoord)
        }

        this.chunk = this.getChunkFromWorldCoord(playerWorldCoordinate)
        console.log("this.chunk.originWorldCoord", this.chunk.originWorldCoord)

        this.setPlayerPos(this.player, this.chunk, playerWorldCoordinate, this.chunkSize)
    }

    private getChunkFromWorldCoord(worldCoord: Coord):Chunk {
        if (worldCoord.x >= this.worldMap.width) {
            throw new GameError(`x ${worldCoord.x} above worldmap width`)
        }

        if (worldCoord.y >= this.worldMap.height) {
            throw new GameError(`x ${worldCoord.y} above worldmap height`)
        }

        // TODO Her er det blir galt akkurat nå. Den nye viewporten er ikke det samme som chunken.
        let chunkX = Math.floor(worldCoord.x / this.chunkSize.width)
        let chunkY = Math.floor(worldCoord.y / this.chunkSize.height)
        let originWorldCoord = new Coord(chunkX, chunkY)

        return new Chunk(originWorldCoord)
    }

    private setPlayerPos(player: Player, chunk: Chunk, playerWorldCoordinate: Coord, chunkSize:Rectangle) {
        let distanceFromChunkEdgeToPlayerX = playerWorldCoordinate.x - chunk.originWorldCoord.x * chunkSize.width
        let distanceFromChunkEdgeToPlayerY = playerWorldCoordinate.y - chunk.originWorldCoord.y * chunkSize.height

        let distanceInPixelsX = distanceFromChunkEdgeToPlayerX * CellConfig.CELL_WIDTH
        let distanceInPixelsY = distanceFromChunkEdgeToPlayerY * CellConfig.CELL_HEIGHT

        console.log("Setting player pos to coord,pixels", playerWorldCoordinate, distanceInPixelsY, distanceInPixelsY)
        player.pos = ex.vec(distanceInPixelsX, distanceInPixelsY)
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

        if (this.lastCoord !== undefined && !this.lastCoord.equals(currentCoord)) {
            console.log("pos", this.player.pos.x, this.player.pos.y, this.lastCoord.toString())
        }

        this.lastCoord = currentCoord
    }

    getPlayerCoord():Coord {
        let col = Math.floor(this.player.pos.x / CellConfig.CELL_WIDTH)
        let row = Math.floor(this.player.pos.y / CellConfig.CELL_HEIGHT)
        return new Coord(col, row)
    }

    drawScene() {
        console.log("changeSceneTo", this)

        console.log("getPlayerCoord", this.getPlayerCoord())
        this.setChunkAndPlayerPos(this.getPlayerCoord())

        let newScene = this.createScene(this.chunk)

        let newSceneName = `chunk-${this.chunk.originWorldCoord.toString()}`
        this.engine.add(newSceneName, newScene)

        this.engine.goToScene(newSceneName)

        // Replace scene
        if (this.scene != undefined) {
            this.engine.removeScene(this.scene) // TODO is this good enough for garbage collection?
        }

        this.scene = newScene
    }

    private createScene(playerChunk: Chunk): ex.Scene {
        let tileMap = TileMapFactory.createTileMap(
            this.engine.screen.drawWidth, this.engine.screen.drawHeight, this.worldMap, playerChunk, this.chunkSize)

        let scene = new ex.Scene()

        scene.add(tileMap)
        scene.add(this.player);

        scene.camera.strategy.lockToActor(this.player)

        return scene;
    }

}
