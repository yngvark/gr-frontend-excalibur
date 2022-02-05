import naturePng from "./nature.png";
import elementsPng from "./elements.png";
import {ImageSource, SpriteSheet, TileMap} from "excalibur";
import {GraphicConfig} from "../../lib/config/GraphicConfig";

export const elements = new ImageSource(elementsPng)
export const nature = new ImageSource(naturePng)

export function loadables():ImageSource[] {
    return [elements, nature];
}

export function createMap(graphicConfig: GraphicConfig, width: number, height: number): TileMap {
    const tileMap = createEmptyTileMap(graphicConfig, width, height);

    const elementsSpriteSheet = createElementsSpriteSheet(graphicConfig);
    const natureSpriteSheet = createNatureSpriteSheet(graphicConfig)

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

function createEmptyTileMap(graphicConfig: GraphicConfig, width: number, height: number) {
    let rows = Math.floor(height / graphicConfig.CELL_HEIGHT)
    let cols = Math.floor(width / graphicConfig.CELL_WIDTH)

    return new TileMap({
        x: 0,
        y: 0,
        rows: rows,
        cols: cols,
        cellWidth: graphicConfig.CELL_WIDTH,
        cellHeight: graphicConfig.CELL_HEIGHT,
    });
}

function createElementsSpriteSheet(graphicConfig: GraphicConfig) {
    return SpriteSheet.fromImageSource({
        image: elements,
        grid: {
            rows: 2,
            columns: 8,
            spriteWidth: graphicConfig.CELL_WIDTH,
            spriteHeight: graphicConfig.CELL_HEIGHT,
        },
        spacing: {
            margin: {
                x: 0,
                y: 0
            }
        }
    });
}

function createNatureSpriteSheet(graphicConfig: GraphicConfig) {
    return SpriteSheet.fromImageSource({
        image: nature,
        grid: {
            rows: 40,
            columns: 16,
            spriteWidth: graphicConfig.CELL_WIDTH,
            spriteHeight: graphicConfig.CELL_HEIGHT,
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
