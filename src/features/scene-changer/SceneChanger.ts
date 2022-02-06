import * as ex from "excalibur";
import {CellConfig} from "../../lib/config/CellConfig";
import {WorldMap} from "../create-map/WorldMap";
import {Player} from "../player/Player";
import {TileMapFactory} from "../create-map/TileMapFactory";
import {Chunk} from "../create-map/Chunk";

export class SceneChanger {
    private readonly engine: ex.Engine;
    private readonly worldMap: WorldMap;
    private readonly player: Player;

    private currentChunk: Chunk
    private currentScene: ex.Scene;

    constructor(engine: ex.Engine, worldMap: WorldMap, player: Player) {
        this.engine = engine
        this.worldMap = worldMap
        this.player = player
        this.currentChunk = new Chunk(0, 0)
    }

    drawNewChunkOnPlayerMove() {
        let col = this.player.pos.x / CellConfig.CELL_WIDTH
        let row = this.player.pos.y / CellConfig.CELL_HEIGHT
        let playerChunk = Chunk.fromCoord(col, row)

        if (!playerChunk.equals(this.currentChunk)) {
            this.changeSceneTo(playerChunk)
        }
    }

    changeSceneTo(chunk: Chunk) {
        console.log("changeSceneTo", this)
        let newScene = this.createScene(chunk)

        this.engine.add(chunk.name(), newScene)
        this.engine.goToScene(chunk.name())

        this.currentChunk = chunk

        if (this.currentChunk != undefined) {
            this.engine.removeScene(this.currentScene) // TODO is this good enough for garbage collection?
        }
        this.currentScene = newScene
    }

    private createScene(playerChunk: Chunk):ex.Scene {
        let scene = new ex.Scene()

        let tileMap = TileMapFactory.createTileMap(
            this.engine.screen.drawWidth, this.engine.screen.drawHeight, this.worldMap, playerChunk)
        scene.add(tileMap)

        scene.add(this.player);

        scene.camera.strategy.lockToActor(this.player)

        return scene;
    }
}
