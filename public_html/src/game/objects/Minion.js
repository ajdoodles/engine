/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Minion(spriteTexture, x, y) {
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
gEngine.Core.inheritPrototype(GameObject, Minion);

Minion.prototype.update = function() {
    this.mMinion.update();
    
    var xform = this.getXform();
    xform.incXPos(-this.kDelta);
    
    if (xform.getXPos() < 0) {
        xform.setXPos(100);
        xform.setYPos(Math.random() * 65);
    }
};