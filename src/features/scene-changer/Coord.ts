// A coord is a coordinate in a grid system. It has nothing to do with pixels.
export class Coord {
    readonly x:number
    readonly y:number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString():string {
        return `(${this.x}, ${this.y})`
    }

    equals(c: Coord):boolean {
        return this.x == c.x
            && this.y == c.y
    }
}