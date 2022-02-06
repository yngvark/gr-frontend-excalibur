import human from "./human.png";
import * as ex from "excalibur";
import {Keyboard} from "excalibur/build/dist/Input/Keyboard";

const image = new ex.ImageSource(human)

const acceleration = 50

const frictionCoefficient = 2
const friction = acceleration * frictionCoefficient

const maxVelocity = 400

export class Player extends ex.Actor {
    constructor() {
        super({
            anchor: ex.vec(0, 0),
            pos: ex.vec(0, 0),
            width: 100,
            height: 100
        });
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

        if (keyb.wasPressed(ex.Input.Keys.Space)) {
            console.log("FIRE!")
        }
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
