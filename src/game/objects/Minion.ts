/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GameObject from "../../engine/gameobjects/GameObject.js";
import IllumRenderable from "../../engine/renderables/IllumRenderable.js";
import LightRenderable from "../../engine/renderables/LightRenderable.js";

export default class Minion extends GameObject {
  delta: number;

  constructor(spriteTexture: string, normalTexture?: string) {
    let minion;
    if (normalTexture === null || normalTexture === undefined) {
      minion = new LightRenderable(spriteTexture);
    } else {
      minion = new IllumRenderable(spriteTexture, normalTexture);
    }
    minion.setColor([1, 1, 1, 0]);
    minion.getXform().setSize(12, 9.6);
    minion.setElementPixelCoordinates(0, 201, 350, 512);
    super(minion);

    this.delta = 0.2;
  }
}
