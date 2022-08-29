/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GameObject from "../../engine/gameobjects/GameObject.js";
import SpriteAnimateRenderable from "../../engine/renderables/SpriteAnimateRenderable.js";

export default class MinionActive extends GameObject {
  delta = 0.2;

  constructor(spriteTexture: string, x: number, y: number) {
    const minion = new SpriteAnimateRenderable(spriteTexture);
    minion.setColor([1, 1, 1, 0]);
    minion.getXform().setPosition(x, y);
    minion.getXform().setSize(12, 9.6);
    minion.setSpriteSequence(512, 0, 204, 164, 5, 0);
    minion.setAnimationType(
      SpriteAnimateRenderable.eAnimationType.eAnimateSwing
    );
    minion.setAnimationSpeed(15);

    super(minion);
  }

  update(): void {
    (this.getRenderable() as SpriteAnimateRenderable).update();
  }
}
