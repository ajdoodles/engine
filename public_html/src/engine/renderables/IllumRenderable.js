/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import core from "../core/Engine_Core.js";
import textures from "../core/Engine_Textures.js";
import LightRenderable from "./LightRenderable.js";

export default function IllumRenderable(colorTexture, normalTexture, material = new Material()) {
    LightRenderable.call(this, colorTexture);
    Renderable.prototype._setShader.call(this, ShaderFactory.getIllumShader());
    
    this.mNormalTexture = normalTexture;
    this.mMaterial = material;
};
core.inheritPrototype(LightRenderable, IllumRenderable);

IllumRenderable.prototype.getMaterial = function () {
    return this.mMaterial;
};
IllumRenderable.prototype.setMaterial = function (material) {
    this.mMaterial = material;
};

IllumRenderable.prototype.draw = function (camera) {
    textures.activateNormalTexture(this.mNormalTexture);
    this.mShader.setMaterial(this.mMaterial);
    LightRenderable.prototype.draw.call(this, camera);
};
