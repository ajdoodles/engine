/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Portal(spriteTexture) {
        this.kDelta = 0.3;
    this.kDeltaDegrees = 1;
    
    this.mCollector = new TextureRenderable(spriteTexture);
    this.mCollector.getXform().setSize(9, 9);
    this.mCollector.getXform().setPosition(20, 33);
    GameObject.call(this, this.mCollector);
}
gEngine.Core.inheritPrototype(GameObject, Portal);

Portal.prototype.update = function() {
};