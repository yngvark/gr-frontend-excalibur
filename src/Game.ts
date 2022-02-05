import {Color, DisplayMode, Engine, Loader, Scene, Screen} from "excalibur";
import {Actor} from "./features/player/Actor";
import {GraphicConfig} from "./lib/config/GraphicConfig";
import * as MapFactory from "./features/create-map/MapFactory";
import {ScreenDimension} from "excalibur/build/dist/Screen";

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

        let graphicConfig = new GraphicConfig()

        let loadables = [].concat(Actor.loadables(), MapFactory.loadables())
        let loader = new Loader(loadables);
        loader.suppressPlayButton = true

        let scene = this.createScene(engine, graphicConfig);

        engine.add("main", scene)
        engine.goToScene("main")

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

    private createScene(engine: Engine, graphicConfig: GraphicConfig):Scene {
        let scene = new Scene()

        let tileMap = MapFactory.createMap(graphicConfig, engine.screen.drawWidth, engine.screen.drawHeight)
        scene.add(tileMap)

        const player = new Actor();
        scene.add(player);

        scene.camera.strategy.lockToActor(player)

        return scene;
    }
}
