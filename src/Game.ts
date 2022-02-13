import {Color, DisplayMode, Engine, Loader} from "excalibur";
import {Player} from "./features/player/Player";
import {MapGenerator} from "./features/create-map/MapGenerator";
import {SceneManager} from "./features/scene-changer/SceneManager";
import {TileMapFactory} from "./features/create-map/TileMapFactory";
import {Coord} from "./features/scene-changer/Coord";

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

        let worldMap = new MapGenerator().generate(300, 300)
        let sceneChanger = new SceneManager(engine, worldMap, new Coord(25, 8))
        sceneChanger.drawScene()

        console.log("World map world map", worldMap)

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
