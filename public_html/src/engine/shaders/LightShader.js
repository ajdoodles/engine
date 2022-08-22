/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import SpriteShader from "./SpriteShader.js";
import ShaderLightReference from "./ShaderLightReference.js";

export default function LightShader(vertexShaderId, fragmentShaderId) {
    SpriteShader.call(this, vertexShaderId, fragmentShaderId);
    
    // THIS MUST MATCH THE VALUE OF kGLSLuLightArraySize IN LightFS.GLSL
    // Be sure to reflect any changes to this value in GLSL
    this.kGLSLuLightArraySize = 4;
    
    this.mLightRefs = [];
    for (var i = 0; i < this.kGLSLuLightArraySize; i++) {
        this.mLightRefs[i] = new ShaderLightReference(this.mCompiledShader, i);
    }
    this.mLights= [];
};
core.inheritPrototype(SpriteShader, LightShader);

LightShader.prototype.setLights = function(lights) {
    this.mLights = lights;
};

LightShader.prototype.activateShader = function (color, camera) {
    SpriteShader.prototype.activateShader.call(this, color, camera);
    
    for (var i = 0; i < this.mLights.length; i++) {
        this.mLightRefs[i].loadToShader(camera, this.mLights[i]);
    }
};