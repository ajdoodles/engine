/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function IllumRenderable(colorTexture, normalTexture, material = new Material()) {
    LightRenderable.call(this, colorTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getIllumShader());
    
    this.mNormalTexture = normalTexture;
    this.mMaterial = material;
};
gEngine.Core.inheritPrototype(LightRenderable, IllumRenderable);

IllumRenderable.prototype.getMaterial = function () {
    return this.mMaterial;
};
IllumRenderable.prototype.setMaterial = function (material) {
    this.mMaterial = material;
};

IllumRenderable.prototype.draw = function (camera) {
    gEngine.Textures.activateNormalTexture(this.mNormalTexture);
    this.mShader.setMaterial(this.mMaterial);
    LightRenderable.prototype.draw.call(this, camera);
};
