import {CellType} from "./CellType";

export class WorldMap {
    readonly width:number
    readonly height:number
    readonly data:CellType[][]

    constructor(width, height, data: CellType[][]) {
        this.width = width
        this.height = height
        this.data = data
    }

}