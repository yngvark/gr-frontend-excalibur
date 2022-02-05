import naturePng from "./nature.png";
import elementsPng from "./elements.png";
import {ImageSource, Loader, SpriteSheet, TileMap} from "excalibur";
import * as ex from "excalibur";
import {Player} from "../player/Player";

export const elements = new ImageSource(elementsPng)
export const nature = new ImageSource(naturePng)

export function loadables():ImageSource[] {
    return [elements, nature];
}

export function createTileMap(): TileMap {
    const elementsSpriteSheet = SpriteSheet.fromImageSource({
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

    const natureSpriteSheet = SpriteSheet.fromImageSource({
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

    const tileMap = new TileMap({
        x: 0,
        y: 0,
        rows: 10,
        cols: 10,
        cellWidth: 48,
        cellHeight: 48,
    });


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
