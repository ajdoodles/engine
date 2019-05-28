/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function LightRenderable(texture, light = null) {
    SpriteRenderable.call(this, texture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());
};
gEngine.Core.inheritPrototype(SpriteRenderable, LightRenderable);

LightRenderable.prototype.getLight = function () {
    return this.mLight;
};
LightRenderable.prototype.addLights = function(light) {
    this.mLight = light;
};

LightRenderable.prototype.draw = function (camera) {
    this.mShader.setLight(this.mLight);
    SpriteRenderable.prototype.draw.call(this, camera);
};