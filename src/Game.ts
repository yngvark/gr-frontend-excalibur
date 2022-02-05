import * as ex from "excalibur";
import {DisplayMode} from "excalibur";
import {Player} from "./player/Player";
import * as MapFactory from "./create-map/MapFactory";

export class Game {
    runGame() {
        let engine = new ex.Engine({
            // width: 1200,
            // height: 600,
            displayMode: DisplayMode.FillScreen
        })

        let loadables = [].concat(Player.loadables(), MapFactory.loadables())
        let loader = new ex.Loader(loadables);
        loader.suppressPlayButton = true

        let scene = this.createScene();

        engine.add("main", scene)
        engine.goToScene("main")

        engine.start(loader).then(() => {
            console.log("Game started")
        });

        engine.start() // This probably should be removed in production
    }

    private createScene() {
        let scene = new ex.Scene()

        let tileMap = MapFactory.createTileMap()
        scene.add(tileMap)

        const player = new Player();
        scene.add(player);

        return scene;
    }
}
