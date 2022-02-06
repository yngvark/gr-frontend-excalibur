import {expect} from 'chai';
import {MapGenerator} from "../../../src/features/create-map/MapGenerator";
import {CellType} from "../../../src/features/create-map/CellType";

describe("MapGenerator", () => {
    it("should generate maps correctly", () => {
        // Given
        let mg = new MapGenerator()
        let width = 10
        let height = 5

        // When
        let map = mg.generate(width, height)

        // Then
        expect(map.width).to.eq(width)
        expect(map.height).to.eq(height)

        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                expect(map.data.length).to.eq(height)
                expect(map.data[y].length).to.eq(width)

                expect(map.data[y][x]).not.to.eq(undefined)
            }
        }
    });
});
