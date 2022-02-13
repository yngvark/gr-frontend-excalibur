import {Coord} from "./Coord";
import {Rectangle} from "./Rectangle";

export class WalkableArea {
    readonly origin:Coord
    readonly size:Rectangle

    private readonly minX:number
    private readonly maxX:number
    private readonly minY:number
    private readonly maxY:number

    constructor(origin: Coord, size: Rectangle) {
        this.origin = origin
        this.size = size

        this.minX = this.origin.x
        this.maxX = this.origin.x + this.size.width
        this.minY = this.origin.y
        this.maxY = this.origin.y + this.size.height
    }

    isWithinWalkableArea(coord:Coord) {
        return !(
            coord.x < this.minX ||
            coord.x > this.maxX ||
            coord.y < this.minY ||
            coord.y > this.maxY
        )
    }
}
