/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Hero(spriteTexture, normalTexture) {
    this.kDelta = 0.3;
    this.kDeltaDegrees = 1;
     
    if (normalTexture === null || normalTexture === undefined) {
        this.mHero = new LightRenderable(spriteTexture);
    } else {
        this.mHero = new IllumRenderable(spriteTexture, normalTexture);
    }
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(35, 50);
    this.mHero.getXform().incZPos(3);
    this.mHero.getXform().setSize(18, 24);
    this.mHero.setElementPixelCoordinates(0, 120, 0, 180);
    GameObject.call(this, this.mHero);
    
    var hitBox = new RigidCircle(this.mHero.getXform(), 9);
    hitBox.setColor([1.0, 0.0, 0.0, 1.0]);
    hitBox.setDrawBounds(true);
    this.setPhysicsComponent(hitBox);
}
gEngine.Core.inheritPrototype(GameObject, Hero);

Hero.prototype.update = function () {
    var xform = this.mHero.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        xform.incYPos(this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPos(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        xform.incYPos(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPos(this.kDelta);
    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) {
//        xform.incRotationInDegrees(this.kDeltaDegrees);
//    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
//        xform.incRotationInDegrees(-this.kDeltaDegrees);
//    }
};