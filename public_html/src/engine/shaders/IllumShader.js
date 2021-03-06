/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function IllumShader(vectorShaderId, fragmentShaderId) {
    LightShader.call(this, vectorShaderId, fragmentShaderId);
    
    var gl = gEngine.Core.getGL();
    this.mNormalSampler = gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
    this.mCameraPosition = gl.getUniformLocation(this.mCompiledShader, "uCameraPosition");
    this.mMaterialRef = new ShaderMaterialReference(this.mCompiledShader);
};
gEngine.Core.inheritPrototype(LightShader, IllumShader);

IllumShader.prototype.setMaterial = function (material) {
    this.mMaterial = material;
};

IllumShader.prototype.activateShader = function (pixelColor, camera) {
    LightShader.prototype.activateShader.call(this, pixelColor, camera);
    
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mNormalSampler, 1);
    gl.uniform3fv(this.mCameraPosition, camera.getCameraPosPx());
    this.mMaterialRef.loadToShader(this.mMaterial);
};