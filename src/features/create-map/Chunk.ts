export class Chunk {
    // TODO set these higher
    static CHUNK_COLS = 10
    static CHUNK_ROWS = 10

    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    name():String {
        return `chunk-X:${this.x}-Y:${this.y}`
    }

    equals(o: Chunk) {
        return this.x == o.x && this.y == o.y
    }

    static fromCoord(col:number, row:number):Chunk {
        let chunkX = Math.floor(col / Chunk.CHUNK_COLS)
        let chunkY = Math.floor(row / Chunk.CHUNK_ROWS)
        return new Chunk(chunkX, chunkY)
    }
}