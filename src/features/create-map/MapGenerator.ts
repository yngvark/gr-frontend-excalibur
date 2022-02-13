import {WorldMap} from "./WorldMap";
import {CellType} from "./CellType";

export class MapGenerator {
    generate(width, height):WorldMap {
        let data:CellType[][] = []

        for (let y = 0; y < height; y++) {
            data[y] = []

            for (let x = 0; x < width; x++) {

                let cellTypeToAdd

                // if (x % 10 == 0) {
                if (x % 10 == 0 || y % 10 == 0) {
                    cellTypeToAdd = this.getMarker()
                } else {
                    cellTypeToAdd = this.getRandomCellType()
                }

                // if (cellTypeToAdd == CellType.MARKER) {
                //     console.log("Pushing marker at", x, y)
                // }
                data[y].push(cellTypeToAdd)
            }
        }

        return new WorldMap(width, height, data)
    }

    private getMarker() {
        return CellType.MARKER
    }

    private getRandomCellType():CellType {
        let vocabulary = [CellType.GRASS, CellType.TREE, CellType.GREEN]
        let rnd = Math.floor(Math.random() * vocabulary.length)

        return vocabulary[rnd]
    }
}
