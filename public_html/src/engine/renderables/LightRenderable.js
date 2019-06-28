/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function LightRenderable(texture) {
    SpriteRenderable.call(this, texture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());
    this.mLights = [];
};
gEngine.Core.inheritPrototype(SpriteRenderable, LightRenderable);

LightRenderable.prototype.getLightAt = function (index) {
    return this.mLights[index];
};
LightRenderable.prototype.setLights = function(lights) {
    this.mLights = lights;
};
LightRenderable.prototype.addLight = function(light) {
    this.mLights.push(light);
};
LightRenderable.prototype.numLights = function () {
    return this.mLights.length;
};

LightRenderable.prototype.draw = function (camera) {
    this.mShader.setLights(this.mLights);
    SpriteRenderable.prototype.draw.call(this, camera);
};