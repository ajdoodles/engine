/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import SpriteShader from "./SpriteShader.js";
import ShaderLightReference from "./ShaderLightReference.js";

export default function ShadowCasterShader(vertexShaderId, fragmentShaderId) {
    SpriteShader.call(this, vertexShaderId, fragmentShaderId);
    
    this.mLight = null;
    this.mLightRef = new ShaderLightReference(this.mCompiledShader, 0);
};
core.inheritPrototype(SpriteShader, ShadowCasterShader);

ShadowCasterShader.prototype.setLight = function (light) {
    this.mLight = light;
};

ShadowCasterShader.prototype.activateShader = function (pixelColor, camera) {
    SpriteShader.prototype.activateShader.call(this, pixelColor, camera);
    
    var gl = core.getGL();
    this.mLightRef.loadToShader(camera, this.mLight);
};



