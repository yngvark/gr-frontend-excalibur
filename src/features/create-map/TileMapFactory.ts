import naturePng from "./nature.png";
import elementsPng from "./elements.png";
import {ImageSource, SpriteSheet, TileMap} from "excalibur";
import {CellConfig} from "../../lib/config/CellConfig";
import {WorldMap} from "./WorldMap";
import {Chunk} from "./Chunk";
import {CellType} from "./CellType";

export const elements = new ImageSource(elementsPng)
export const nature = new ImageSource(naturePng)

export class TileMapFactory {
    static loadables(): ImageSource[] {
        return [elements, nature];
    }

    static createTileMap(drawWidth: number, drawheight: number, worldMap: WorldMap, chunk: Chunk
    ): TileMap {
        return createTileMap(drawWidth, drawheight, worldMap, chunk)
    }
}

function createTileMap(drawWidth: number, drawHeight: number, worldMap: WorldMap, chunk: Chunk): TileMap {
    const tileMap = createEmptyTileMap();

    const elementsSpriteSheet = createElementsSpriteSheet();
    const natureSpriteSheet = createNatureSpriteSheet()
    // console.log(tileMap.data)

    let x = 0
    let y = 0

    for (let cell of tileMap.data) {
        const grass = elementsSpriteSheet.getSprite(0, 0);
        const sprite = createSpritesFromChunk(elementsSpriteSheet, natureSpriteSheet, worldMap, chunk, x, y)

        if (!sprite) {
            console.error("Could not create sprite")
            break
        }

        // cell.addGraphic(grass);
        cell.addGraphic(sprite);

        x++
        if (x == Chunk.CHUNK_COLS) {
            x = 0
            y++
        }
    }

    return tileMap
}

function createEmptyTileMap() {
    return new TileMap({
        x: 0,
        y: 0,
        rows: Chunk.CHUNK_ROWS,
        cols: Chunk.CHUNK_COLS,
        cellWidth: CellConfig.CELL_WIDTH,
        cellHeight: CellConfig.CELL_HEIGHT,
    });
}

function createElementsSpriteSheet() {
    return SpriteSheet.fromImageSource({
        image: elements,
        grid: {
            rows: 3,
            columns: 8,
            spriteWidth: CellConfig.CELL_WIDTH,
            spriteHeight: CellConfig.CELL_HEIGHT,
        },
        spacing: {
            margin: {
                x: 0,
                y: 0
            }
        }
    });
}

function createNatureSpriteSheet() {
    return SpriteSheet.fromImageSource({
        image: nature,
        grid: {
            rows: 40,
            columns: 16,
            spriteWidth: CellConfig.CELL_WIDTH,
            spriteHeight: CellConfig.CELL_HEIGHT,
        },
        spacing: {
            margin: {
                x: 0,
                y: 0
            }
        }
    });
}

function getRandomSprite(elements: SpriteSheet, nature: SpriteSheet) {
    let rnd: number = Math.floor(Math.random() * 100)
    if (rnd < 70) {
        return elements.getSprite(0, 0)
    } else if (rnd < 95) {
        return elements.getSprite(0, 1)
    } else {
        return nature.getSprite(0, 0)
    }
}

function createSpritesFromChunk(
    elements: SpriteSheet, nature: SpriteSheet, worldMap: WorldMap, chunk: Chunk, x: number, y: number):ex.Sprite {

    let xInWorld = chunk.x * Chunk.CHUNK_COLS + x
    let yInWorld = chunk.y * Chunk.CHUNK_ROWS + y

    let cell = worldMap.data[yInWorld][xInWorld]
    // console.log({
    //     xInWorld,
    //     yInWorld,
    //     cell,
    //     worldMap,
    //     chunk
    // })

    switch (cell) {
        case CellType.GRASS:
            return elements.getSprite(0, 0)
        case CellType.TREE:
            return elements.getSprite(0, 1)
        case CellType.GREEN:
            return nature.getSprite(0, 0)
        default:
            return elements.getSprite(0, 2)
    }
}
