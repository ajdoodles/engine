/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ShadowCasterShader(vertexShaderId, fragmentShaderId) {
    SpriteShader.call(this, vertexShaderId, fragmentShaderId);
    
    this.mLight = null;
    this.mLightRef = new ShaderLightReference(this.mCompiledShader, 0);
};
gEngine.Core.inheritPrototype(SpriteShader, ShadowCasterShader);

ShadowCasterShader.prototype.setLight = function (light) {
    this.mLight = light;
};

ShadowCasterShader.prototype.activateShader = function (pixelColor, camera) {
    SpriteShader.prototype.activateShader.call(this, pixelColor, camera);
    
    var gl = gEngine.Core.getGL();
    this.mLightRef.loadToShader(camera, this.mLight);
};



