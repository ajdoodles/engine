/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GameObject from "../../engine/gameobjects/GameObject.js";
import IllumRenderable from "../../engine/renderables/IllumRenderable.js";
import LightRenderable from "../../engine/renderables/LightRenderable.js";
import RigidCircle from "../../engine/physics/RigidCircle.js";
import input from "../../engine/core/Engine_Input";
import { vec2 } from "gl-matrix";

export default class Hero extends GameObject {
  delta: number;
  deltaDegrees: number;

  physicsComponent!: RigidCircle;

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
    hitBox.drawBounds = true;
    this.physicsComponent = hitBox;

    this.delta = 0.3;
    this.deltaDegrees = 1;
  }

  update() {
    const newV = vec2.clone(this.physicsComponent.velocity);
    if (input.isKeyPressed(input.keys.W)) {
      if (newV[1] < 4) {
        newV[1] += 0.2;
      }
    }
    if (input.isKeyPressed(input.keys.A)) {
      if (newV[0] > -4) {
        newV[0] -= 0.2;
      }
    }
    if (input.isKeyPressed(input.keys.S)) {
      if (newV[1] > -4) {
        newV[1] -= 0.2;
      }
    }
    if (input.isKeyPressed(input.keys.D)) {
      if (newV[0] < 4) {
        newV[0] += 0.2;
      }
    }
    this.physicsComponent.velocity = newV;

    super.update();
  }
}
