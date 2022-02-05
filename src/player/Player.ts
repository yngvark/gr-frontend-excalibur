import sword from "./human.png";
import {Actor, ImageSource, Input, vec} from "excalibur";

const Image = new ImageSource(sword)

export class Player extends Actor {
    constructor() {
        super({
            pos: vec(150, 150),
            width: 100,
            height: 100
        });
    }

    static loadables():ImageSource[] {
        return [Image]
    }

    onInitialize() {
        this.graphics.add(Image.toSprite())
    }

    public update(engine, delta) {
        if (
            engine.input.keyboard.isHeld(Input.Keys.W) ||
            engine.input.keyboard.isHeld(Input.Keys.Up)
        ) {
            console.log("Forward")
        }

        if (engine.input.keyboard.wasPressed(Input.Keys.Right)) {
            console.log("FIRE!")
        }
    }
}
