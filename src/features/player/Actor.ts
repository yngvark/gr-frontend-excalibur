import human from "./human.png";
import * as ex from "excalibur";
import {GraphicConfig} from "../../lib/config/GraphicConfig";
import {Keyboard} from "excalibur/build/dist/Input/Keyboard";
import {Engine, Scene, SpriteSheet, TileMap} from "excalibur";
import * as MapFactory from "./../../features/create-map/MapFactory";
import {elements, nature} from "./../../features/create-map/MapFactory";

const image = new ex.ImageSource(human)

const acceleration = 50

const frictionCoefficient = 2
const friction = acceleration * frictionCoefficient

const maxVelocity = 400

export class Actor extends ex.Actor {
    private readonly graphicsConfig: GraphicConfig
    private i:number = 1

    constructor(graphicsConfig: GraphicConfig) {
        super({
            anchor: ex.vec(0, 0),
            pos: ex.vec(0, 0),
            width: 100,
            height: 100
        });

        this.graphicsConfig = graphicsConfig
    }

    static loadables(): ex.ImageSource[] {
        return [image]
    }

    onInitialize() {
        this.graphics.add(image.toSprite())
    }

    public update(engine, delta) {
        let keyb = engine.input.keyboard

        let yVel = this.calcNewYVelocity(keyb, this.vel.y);
        let xVel = this.calcNewXVelocity(keyb, this.vel.x);

        this.vel = ex.vec(xVel, yVel)

        if (this.pos.x > 300 * this.i) {
            this.i++

            let newScene = this.createNewScene(engine, this.graphicsConfig)
            engine.add("next", newScene)
            engine.goToScene("next")

            engine.remove("main")
        }

        if (keyb.wasPressed(ex.Input.Keys.Space)) {
            console.log("FIRE!")
        }
    }

    private createNewScene(engine: Engine, graphicConfig: GraphicConfig):ex.Scene {
        let scene = new Scene()

        let tileMap = createMap(graphicConfig)
        scene.add(tileMap)
        scene.add(this);

        scene.camera.strategy.lockToActor(this)

        return scene;
    }

    private calcNewXVelocity(keyb: Keyboard, xVel: number) {
        if (
            keyb.isHeld(ex.Input.Keys.A) ||
            keyb.isHeld(ex.Input.Keys.Left)
        ) {
            if (Math.abs(xVel - acceleration) < maxVelocity) {
                xVel -= acceleration
            }
        } else if (
            keyb.isHeld(ex.Input.Keys.D) ||
            keyb.isHeld(ex.Input.Keys.Right)
        ) {
            if (Math.abs(xVel + acceleration) < maxVelocity) {
                xVel += acceleration
            }
        } else {
            if (Math.abs(xVel) < friction) {
                xVel = 0
            } else if (xVel > 0) {
                xVel -= friction
            } else if (xVel < 0) {
                xVel += friction
            }
        }
        return xVel;
    }

    private calcNewYVelocity(keyb: Keyboard, yVel: number) {
        if (
            keyb.isHeld(ex.Input.Keys.W) ||
            keyb.isHeld(ex.Input.Keys.Up)
        ) {
            if (Math.abs(yVel - acceleration) < maxVelocity) {
                yVel -= acceleration
            }
        } else if (
            keyb.isHeld(ex.Input.Keys.S) ||
            keyb.isHeld(ex.Input.Keys.Down)
        ) {
            if (Math.abs(yVel + acceleration) < maxVelocity) {
                yVel += acceleration
            }
        } else {
            if (Math.abs(yVel) < friction) {
                yVel = 0
            } else if (yVel > 0) {
                yVel -= friction
            } else if (yVel < 0) {
                yVel += friction
            }
        }
        return yVel;
    }
}

function createMap(graphicConfig: GraphicConfig): TileMap {
    const tileMap = createEmptyTileMap(graphicConfig);

    const elementsSpriteSheet = createElementsSpriteSheet(graphicConfig);
    const natureSpriteSheet = createNatureSpriteSheet(graphicConfig)

    for (let cell of tileMap.data) {
        const grass = elementsSpriteSheet.getSprite(0, 0);
        const sprite = getRandomSprite(elementsSpriteSheet, natureSpriteSheet)

        if (sprite) {
            cell.addGraphic(grass);
            cell.addGraphic(sprite);
        }
    }

    return tileMap
}

function createEmptyTileMap(graphicConfig: GraphicConfig) {
    return new TileMap({
        x: 0,
        y: 0,
        rows: 30,
        cols: 30,
        cellWidth: graphicConfig.CELL_WIDTH,
        cellHeight: graphicConfig.CELL_HEIGHT,
    });
}

function createElementsSpriteSheet(graphicConfig: GraphicConfig) {
    return SpriteSheet.fromImageSource({
        image: elements,
        grid: {
            rows: 2,
            columns: 8,
            spriteWidth: graphicConfig.CELL_WIDTH,
            spriteHeight: graphicConfig.CELL_HEIGHT,
        },
        spacing: {
            margin: {
                x: 0,
                y: 0
            }
        }
    });
}

function createNatureSpriteSheet(graphicConfig: GraphicConfig) {
    return SpriteSheet.fromImageSource({
        image: nature,
        grid: {
            rows: 40,
            columns: 16,
            spriteWidth: graphicConfig.CELL_WIDTH,
            spriteHeight: graphicConfig.CELL_HEIGHT,
        },
        spacing: {
            margin: {
                x: 0,
                y: 0
            }
        }
    });
}

function getRandomSprite(elements: SpriteSheet, nature: SpriteSheet) {
    let rnd: number = Math.floor(Math.random() * 100)
    if (rnd < 70) {
        return elements.getSprite(0, 0)
    } else if (rnd < 95) {
        return elements.getSprite(0, 1)
    } else {
        return nature.getSprite(0, 0)
    }
}
