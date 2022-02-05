import naturePng from "./nature.png";
import elementsPng from "./elements.png";
import {ImageSource, Loader, SpriteSheet, TileMap, TileMapArgs} from "excalibur";
import * as ex from "excalibur";
import {Player} from "../player/Player";

export const elements = new ImageSource(elementsPng)
export const nature = new ImageSource(naturePng)

export function loadables():ImageSource[] {
    return [elements, nature];
}

export function createMap(width: number, height: number): TileMap {
    const tileMap = createEmptyTileMap(height, width);

    const elementsSpriteSheet = createElementsSpriteSheet();
    const natureSpriteSheet = createNatureSpriteSheet()

    for (let cell of tileMap.data) {
        const grass = elementsSpriteSheet.getSprite(0, 0);
        const sprite = getRandomSprite(elementsSpriteSheet, natureSpriteSheet)

        if (sprite) {
            cell.addGraphic(grass);
            cell.addGraphic(sprite);
        }
    }

    return tileMap
}

function createEmptyTileMap(height: number, width: number) {
    const cellWidth = 48
    const cellHeight = 48

    let rows = Math.floor(height / cellHeight)
    let cols = Math.floor(width / cellWidth)
    console.log({
        canvasWidth: width,
        canvasHeight: height,
        rows,
        cols
    })

    const tileMap = new TileMap({
        x: 0,
        y: 0,
        rows: rows,
        cols: cols,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
    });
    return tileMap;
}

function createElementsSpriteSheet() {
    return SpriteSheet.fromImageSource({
        image: elements,
        grid: {
            rows: 2,
            columns: 8,
            spriteHeight: 48,
            spriteWidth: 48
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
            spriteHeight: 48,
            spriteWidth: 48
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
    if (rnd < 30) {
        return elements.getSprite(0, 0)
    } else if (rnd < 60) {
        return elements.getSprite(0, 1)
    } else {
        return nature.getSprite(0, 0)
    }
}
