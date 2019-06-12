/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function IllumShader(vectorShaderId, fragmentShaderId) {
    LightShader.call(this, vectorShaderId, fragmentShaderId);
    
    var gl = gEngine.Core.getGL();
    this.mNormalSampler = gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
};
gEngine.Core.inheritPrototype(LightShader, IllumShader);

IllumShader.prototype.activateShader = function (pixelColor, camera) {
    LightShader.prototype.activateShader.call(this, pixelColor, camera);
    
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mNormalSampler, 1);
};