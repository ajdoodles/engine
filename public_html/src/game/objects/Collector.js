/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Collector(spriteTexture) {
    this.kDelta = 0.3;
    this.kDeltaDegrees = 1;
    
    this.mCollector = new TextureRenderable(spriteTexture);
    this.mCollector.getXform().setSize(9, 9);
    this.mCollector.getXform().setPosition(50, 33);
    GameObject.call(this, this.mCollector);
}
gEngine.Core.inheritPrototype(GameObject, Collector);

Collector.prototype.update = function () {
//    var xform = this.mCollector.getXform();
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
//        xform.incYPos(this.kDelta);
//    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
//        xform.incXPos(-this.kDelta);
//    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
//        xform.incYPos(-this.kDelta);
//    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
//        xform.incXPos(this.kDelta);
//    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) {
//        xform.incRotationInDegrees(this.kDeltaDegrees);
//    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
//        xform.incRotationInDegrees(-this.kDeltaDegrees)
//    }
};