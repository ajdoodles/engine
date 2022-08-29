/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import GameObject from "../../engine/gameobjects/GameObject.js";
import LightRenderable from "../../engine/renderables/LightRenderable.js";

export default class Brain extends GameObject {
  deltaDegrees: number;
  deltaRads: number;
  deltaSpeed: number;

  constructor(spriteTexture: string) {
    const brain = new LightRenderable(spriteTexture);
    brain.setColor([1, 1, 1, 0]);
    brain.getXform().setPosition(50, 10);
    brain.getXform().setSize(3, 5.4);
    brain.setElementPixelCoordinates(600, 700, 0, 180);
    super(brain);
    this.setSpeed(0.05);

    this.deltaDegrees = 1;
    this.deltaRads = this.deltaDegrees * (Math.PI / 180);
    this.deltaSpeed = 0.01;
  }
}
