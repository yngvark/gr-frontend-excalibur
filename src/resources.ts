import {  ImageSource } from "excalibur";
import sword from "./images/sword.png"; // for parcelv2 this is configured in the .parcelrc
import nature from "./images/draw_map/nature.png";
import elements from "./images/draw_map/elements.png";

let Resources = {
  Sword: new ImageSource(sword),
  Nature: new ImageSource(nature),
  Elements: new ImageSource(elements),
};

export { Resources };