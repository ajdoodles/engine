/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Minion(spriteTexture, normalTexture) {
    this.kDelta = 0.2;
    if (normalTexture === null || normalTexture === undefined) {
        this.mMinion = new LightRenderable(spriteTexture);
    } else {
        this.mMinion = new IllumRenderable(spriteTexture, normalTexture);
    }
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setSize(12, 9.6);
    this.mMinion.setElementPixelCoordinates(0, 201, 350, 512);
    GameObject.call(this, this.mMinion);
}
gEngine.Core.inheritPrototype(GameObject, Minion);