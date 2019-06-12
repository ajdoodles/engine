/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function IllumRenderable(colorTexture, normalTexture) {
    LightRenderable.call(this, colorTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getIllumShader());
    
    this.mNormalTexture = normalTexture;
};
gEngine.Core.inheritPrototype(LightRenderable, IllumRenderable);

IllumRenderable.prototype.draw = function (camera) {
    gEngine.Textures.activateNormalTexture(this.mNormalTexture);
    LightRenderable.prototype.draw.call(this, camera);
};
