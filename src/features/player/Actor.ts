import sword from "./human.png";
import * as ex from "excalibur";

const image = new ex.ImageSource(sword)

export class Actor extends ex.Actor {
    constructor() {
        super({
            anchor: ex.vec(0, 0),
            pos: ex.vec(0,0),
            width: 100,
            height: 100
        });
    }

    static loadables():ex.ImageSource[] {
        return [image]
    }

    onInitialize() {
        this.graphics.add(image.toSprite())
    }

    public update(engine, delta) {
        if (
            engine.input.keyboard.isHeld(ex.Input.Keys.W) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Up)
        ) {
            this.pos = this.pos.add(ex.vec(0, -48))
        }

        if (
            engine.input.keyboard.isHeld(ex.Input.Keys.S) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Down)
        ) {
            this.pos = this.pos.add(ex.vec(0, 48))
        }

        if (
            engine.input.keyboard.isHeld(ex.Input.Keys.A) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Left)
        ) {
            this.pos = this.pos.add(ex.vec(-48, 0))
        }

        if (
            engine.input.keyboard.isHeld(ex.Input.Keys.D) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Right)
        ) {
            this.pos = this.pos.add(ex.vec(48, 0))
        }

        if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
            console.log("FIRE!")
        }
    }
}
