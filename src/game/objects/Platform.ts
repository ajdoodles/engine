/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GameObject from "../../engine/gameobjects/GameObject.js";
import TextureRenderable from "../../engine/renderables/TextureRenderable.js";
import RigidRect from "../../engine/physics/RigidRect.js";

export default class Platform extends GameObject {
  delta: number;
  deltaDegrees: number;

  constructor(spriteTexture: string) {
    const platform = new TextureRenderable(spriteTexture);
    platform.getXform().setSize(30, 3.75);
    platform.getXform().setPosition(20, 33);

    super(platform);

    this.delta = 0.3;
    this.deltaDegrees = 1;

    const rigidRect = new RigidRect(platform.getXform(), 36, 6);
    rigidRect.drawBounds = true;
    this.physicsComponent = rigidRect;
  }
}
