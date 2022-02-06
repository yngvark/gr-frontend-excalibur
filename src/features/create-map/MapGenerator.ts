import {WorldMap} from "./WorldMap";
import {CellType} from "./CellType";

export class MapGenerator {
    generate(width, height):WorldMap {
        let data:CellType[][] = []

        for (let y = 0; y < height; y++) {
            data[y] = []

            for (let x = 0; x < width; x++) {
                data[y].push(this.getRandomCellType())
            }
        }

        return new WorldMap(width, height, data)
    }

    private getRandomCellType():CellType {
        let rnd = Math.floor(Math.random() * Object.keys(CellType).length / 2)
        return CellType[CellType[rnd]]
    }

}
