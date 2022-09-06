/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GameObject from "../../engine/gameobjects/GameObject.js";
import IllumRenderable from "../../engine/renderables/IllumRenderable.js";
import LightRenderable from "../../engine/renderables/LightRenderable.js";
import RigidCircle from "../../engine/physics/RigidCircle.js";

export default class Hero extends GameObject {
  delta: number;
  deltaDegrees: number;

  constructor(spriteTexture: string, normalTexture?: string) {
    let hero;
    if (normalTexture === null || normalTexture === undefined) {
      hero = new LightRenderable(spriteTexture);
    } else {
      hero = new IllumRenderable(spriteTexture, normalTexture);
    }
    hero.setColor([1, 1, 1, 0]);
    hero.getXform().setPosition(35, 50);
    hero.getXform().incZPos(3);
    hero.getXform().setSize(18, 24);
    hero.setElementPixelCoordinates(0, 120, 0, 180);
    super(hero);

    const hitBox = new RigidCircle(hero.getXform(), 9);
    hitBox.setDrawBounds(true);
    this.physicsComponent = hitBox;

    this.delta = 0.3;
    this.deltaDegrees = 1;
  }
}
