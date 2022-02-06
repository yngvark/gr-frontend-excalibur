import {Color, DisplayMode, Engine, Loader} from "excalibur";
import {Player} from "./features/player/Player";
import {MapGenerator} from "./features/create-map/MapGenerator";
import {SceneChanger} from "./features/scene-changer/SceneChanger";
import {TileMapFactory} from "./features/create-map/TileMapFactory";
import {Chunk} from "./features/create-map/Chunk";
import * as ex from "excalibur";

export class Game {
    runGame() {
        let engine = new Engine({
            displayMode: DisplayMode.FillScreen,
            // displayMode: DisplayMode.Fixed,
            canvasElementId: 'game',
            backgroundColor: Color.LightGray,
            suppressHiDPIScaling: true,
            suppressConsoleBootMessage: true,
            viewport: {
                width: 800,
                height: 600,
            },
            resolution: {
                width: 800,
                height: 600,
            },
        })

        let loadables = [].concat(Player.loadables(), TileMapFactory.loadables())
        let loader = new Loader(loadables);
        loader.suppressPlayButton = true

        let worldMap = new MapGenerator().generate(1000, 1000)
        let player = new Player()
        let sceneChanger = new SceneChanger(engine, worldMap, player)

        player.graphics.onPreDraw = (ctx: ex.ExcaliburGraphicsContext, delta: number) => {
            sceneChanger.drawNewChunkOnPlayerMove()
        }

        sceneChanger.changeSceneTo(new Chunk(0, 0))

        engine.start(loader).then(() => {
            console.log("Game started")
        });
        // engine.start() // This probably should be removed in production

    //     console.log("Loading")
    //     engine.start(loader).then(() => {
    //         console.log("Starting")
    //         engine.start()
    //         console.log("Started")
    //     });
    }


}
