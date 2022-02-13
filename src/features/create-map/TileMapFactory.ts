import naturePng from "./nature.png";
import elementsPng from "./elements.png";
import {ImageSource, SpriteSheet, TileMap} from "excalibur";
import {CellConfig} from "../../lib/config/CellConfig";
import {WorldMap} from "./WorldMap";
import {Chunk} from "../scene-changer/Chunk";
import {CellType} from "./CellType";
import {Rectangle} from "../scene-changer/Rectangle";

export const elements = new ImageSource(elementsPng)
export const nature = new ImageSource(naturePng)

export class TileMapFactory {
    static loadables(): ImageSource[] {
        return [elements, nature];
    }

    static createTileMap(
        drawWidth: number,
        drawheight: number,
        worldMap: WorldMap,
        chunk: Chunk,
        chunkSize: Rectangle,
    ): TileMap {
        return createTileMap(drawWidth, drawheight, worldMap, chunk, chunkSize)
    }
}

function createTileMap(drawWidth: number, drawHeight: number, worldMap: WorldMap, chunk: Chunk, chunkSize: Rectangle): TileMap {
    console.log("createTileMap", drawWidth, drawHeight, worldMap, chunk, chunkSize)
    const tileMap = createEmptyTileMap(chunkSize);

    const elementsSpriteSheet = createElementsSpriteSheet();
    const natureSpriteSheet = createNatureSpriteSheet()

    let x = 0
    let y = 0

    const grass = elementsSpriteSheet.getSprite(0, 0);

    for (let cell of tileMap.data) {
        const sprite = createSpritesFromChunk(elementsSpriteSheet, natureSpriteSheet, worldMap, chunk, x, y)

        if (!sprite) {
            console.error("Could not create sprite")
            break
        }

        cell.addGraphic(grass);
        cell.addGraphic(sprite);

        x++
        if (x == chunkSize.width) {
            x = 0
            y++
        }
    }

    return tileMap
}

function createEmptyTileMap(chunkSize: Rectangle):TileMap {
    return new TileMap({
        x: 0,
        y: 0,
        cols: chunkSize.width,
        rows: chunkSize.height,
        cellWidth: CellConfig.CELL_WIDTH,
        cellHeight: CellConfig.CELL_HEIGHT,
    });
}

function createSpritesFromChunk(
    elements: SpriteSheet, nature: SpriteSheet, worldMap: WorldMap, chunk: Chunk, x: number, y: number):ex.Sprite {

    let xInWorld = chunk.originWorldCoord.x + x
    let yInWorld = chunk.originWorldCoord.y + y

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
        case CellType.MARKER:
            return elements.getSprite(4, 1)
        default:
            return elements.getSprite(0, 0)
    }
}

function createElementsSpriteSheet() {
    return SpriteSheet.fromImageSource({
        image: elements,
        grid: {
            rows: 10,
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
