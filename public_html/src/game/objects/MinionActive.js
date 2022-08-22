/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import core from "../../engine/core/Engine_Core.js";
import GameObject from "../../engine/gameobjects/GameObject.js";

function MinionActive(spriteTexture, x, y) {
    this.kDelta = 0.2;
    this.mMinion = new SpriteAnimateRenderable(spriteTexture);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(x, y);
    this.mMinion.getXform().setSize(12, 9.6);
    this.mMinion.setSpriteSequence(
            512, 0,
            204, 164,
            5,
            0);
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(15);
    GameObject.call(this, this.mMinion);
}
core.inheritPrototype(GameObject, MinionActive);

MinionActive.prototype.update = function() {
    this.mMinion.update();
};