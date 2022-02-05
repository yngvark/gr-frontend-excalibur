import {Color, DisplayMode, Engine, Loader, Scene, Screen} from "excalibur";
import {Player} from "./features/player/Player";
import * as MapFactory from "./features/create-map/MapFactory";

export class Game {
    runGame() {
        let engine = new Engine({
            displayMode: DisplayMode.FillScreen,
            canvasElementId: 'game',
            backgroundColor: Color.LightGray,
        })

        console.log({
            w: engine.screen.drawWidth,
            h: engine.screen.drawHeight,
        })

        let loadables = [].concat(Player.loadables(), MapFactory.loadables())
        let loader = new Loader(loadables);
        loader.suppressPlayButton = true

        let scene = this.createScene(engine);

        engine.add("main", scene)
        engine.goToScene("main")

        engine.start(loader).then(() => {
            console.log("Game started")
        });

        engine.start() // This probably should be removed in production
    }

    private createScene(engine: Engine) {
        let scene = new Scene()

        let tileMap = MapFactory.createMap(engine.screen.drawWidth, engine.screen.drawHeight)
        scene.add(tileMap)

        const player = new Player();
        scene.add(player);

        return scene;
    }
}
