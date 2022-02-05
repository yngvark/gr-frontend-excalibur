// import {Engine, ImageSource, Loader, Scene, SpriteSheet, TileMap} from "excalibur";
import * as ex from "excalibur";
import {Player} from "./player";
import {Resources} from "./resources";

class Game extends ex.Engine {
    constructor() {
        super({width: 800, height: 600});
    }

    runGame() {
        const loader = new ex.Loader([Resources.Sword, Resources.Nature, Resources.Elements]);
        loader.suppressPlayButton = true

        let scene = new ex.Scene()

        let tileMap = this.createTileMap()
        scene.add(tileMap)

        const player = new Player();
        scene.add(player);

        this.add("main", scene)
        this.goToScene("main")

        this.start(loader).then(() => {
            console.log("Game started")
        });
        this.start() // TODO this probably should be removed in production
    }

    private createTileMap():ex.TileMap {
        const elementsSpriteSheet = ex.SpriteSheet.fromImageSource({
            image: Resources.Elements,
            grid: {
                rows: 2,
                columns: 8,
                spriteHeight: 48,
                spriteWidth: 48
            },
            spacing: {
                margin: {
                    x: 1,
                    y: 1
                }
            }
        });

        const natureSpriteSheet = ex.SpriteSheet.fromImageSource({
            image: Resources.Nature,
            grid: {
                rows: 40,
                columns: 16,
                spriteHeight: 48,
                spriteWidth: 48
            },
            spacing: {
                margin: {
                    x: 0,
                    y: 0
                }
            }
        });

        const tileMap = new ex.TileMap({
            x: 0,
            y: 0,
            rows: 10,
            cols: 10,
            cellWidth: 48,
            cellHeight: 48,
        });


        for (let cell of tileMap.data) {
            const grass = elementsSpriteSheet.getSprite(0, 0);
            const sprite = this.getRandomSprite(elementsSpriteSheet, natureSpriteSheet)

            if (sprite) {
                cell.addGraphic(grass);
                cell.addGraphic(sprite);
            }
        }

        return tileMap
    }

    private getRandomSprite(elements: ex.SpriteSheet, nature: ex.SpriteSheet) {
        let rnd:number = Math.floor(Math.random() * 100)
        if (rnd < 80) {
            return elements.getSprite(0, 0)
        } else if (rnd < 95) {
            return elements.getSprite(0, 1)
        } else {
            return nature.getSprite(0, 0)
        }
    }
}

export const game = new Game()
game.runGame()
