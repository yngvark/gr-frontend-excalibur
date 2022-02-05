import * as ex from "excalibur";
import { Resources } from "./Resources";

export class Player extends ex.Actor {
  constructor() {
    super({
      pos: ex.vec(150, 150),
      width: 100,
      height: 100
    });
  }

  onInitialize() {
    this.graphics.add(Resources.Sword.toSprite());
  }

  public update(engine, delta) {
    if (
        engine.input.keyboard.isHeld(ex.Input.Keys.W) ||
        engine.input.keyboard.isHeld(ex.Input.Keys.Up)
    ) {
      console.log("Forward")
    }

    if (engine.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
      console.log("FIRE!")
    }
  }
}
