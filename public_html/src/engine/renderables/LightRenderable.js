/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import core from "../core/Engine_Core.js";
import SpriteRenderable from "./SpriteRenderable.js";
import Renderable from "./Renderable.js";

export default function LightRenderable(texture) {
    SpriteRenderable.call(this, texture);
    Renderable.prototype._setShader.call(this, ShaderFactory.getLightShader());
    this.mLights = [];
};
core.inheritPrototype(SpriteRenderable, LightRenderable);

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