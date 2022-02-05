import { ImageSource } from "excalibur";
import nature from "./images/draw_map/nature.png";
import elements from "./images/draw_map/elements.png";

let Resources = {
  Nature: new ImageSource(nature),
  Elements: new ImageSource(elements),
};

export { Resources };