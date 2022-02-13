import {Coord} from "./Coord";

// A chunk contains all the tiles needed to be able to fill the screen at all times.
// A part of the chunk, a WalkableArea, is where the player can walk, before a new Chunk has to be drawn.
export class Chunk {
    readonly originWorldCoord:Coord

    constructor(origin: Coord) {
        this.originWorldCoord = origin;
    }

    toString():string {
        return `Chunk-${this.originWorldCoord.toString()}`
    }

}