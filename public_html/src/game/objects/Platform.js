/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Platform(spriteTexture) {
    this.kDelta = 0.3;
    this.kDeltaDegrees = 1;

    this.mPlatform = new TextureRenderable(spriteTexture);
    this.mPlatform.getXform().setSize(30, 3.75);
    this.mPlatform.getXform().setPosition(20, 33);
    GameObject.call(this, this.mPlatform);

    var rigidRect = new RigidRect(this.mPlatform.getXform(), 36, 6);
    rigidRect.setColor([1.0, 0.0, 0.0, 1.0]);
    rigidRect.setDrawBounds(true);
    this.setPhysicsComponent(rigidRect);
}
gEngine.Core.inheritPrototype(GameObject, Platform);

Platform.prototype.update = function () {
};
