/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GameObject from "../../engine/gameobjects/GameObject.js";
import TextureRenderable from "../../engine/renderables/TextureRenderable.js";

export default class Portal extends GameObject {
  delta: number;
  deltaDegrees: number;

  constructor(spriteTexture: string) {
    const collector = new TextureRenderable(spriteTexture);
    collector.getXform().setSize(9, 9);
    collector.getXform().setPosition(20, 33);
    super(collector);

    this.delta = 0.3;
    this.deltaDegrees = 1;
  }
}
