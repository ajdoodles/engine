/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ShadowReceiver(receiver) {
    this.kShadowStencilBit = 0x01;
    this.kShadowStencilMask = 0xFF;
    
    this.mShadowReceiverShader = gEngine.DefaultResources.getShadowReceiverShader();
    
    this.mShadowReceiver = receiver;
    this.mShadowCasters = [];
};

ShadowReceiver.prototype.addShadowCaster = function (casterObject) {
    var caster = new ShadowCaster(casterObject, this.mShadowReceiver);
    this.mShadowCasters.push(caster);
};

ShadowReceiver.prototype.draw = function (camera) {
    this.mShadowReceiver.draw(camera);
    
    this._shadowReceiverStencilOn();
    var oldShader = this.mShadowReceiver.getRenderable().swapShader(this.mShadowReceiverShader);
    this.mShadowReceiver.draw(camera);
    this.mShadowReceiver.getRenderable().swapShader(oldShader);
    this._shadowReceiverStencilOff();
    
    for (var i = 0; i < this.mShadowCasters.length; i++) {
        this.mShadowCasters[i].draw(camera);
    }
    
    this._shadowReceiverStencilDisable();
};
