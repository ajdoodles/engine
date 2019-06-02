/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ShaderLightReference(shader, index) {
    if (index < 0 || index >= LightShader.kGLSLuLightArraySize) {
        throw "Light index " + index + " out of bounds.";
    }

    this.mIndex = index;
    var indexString = "uLights[" + index + "].";
    
    var gl = gEngine.Core.getGL();
    this.mIsLitRef = gl.getUniformLocation(shader, indexString + "IsLit");
    this.mColorRef = gl.getUniformLocation(shader, indexString + "Color");
    this.mPositionRef = gl.getUniformLocation(shader, indexString + "Position");
    this.mIntensityRef = gl.getUniformLocation(shader, indexString + "Intensity");
    this.mNearRef = gl.getUniformLocation(shader, indexString + "Near");
    this.mFarRef = gl.getUniformLocation(shader, indexString + "Far");
}

ShaderLightReference.prototype.loadToShader = function (camera, light) {
    var gl = gEngine.Core.getGL();
    
    var isLit = light !== undefined && light !== null && light.isLit();
    gl.uniform1i(this.mIsLitRef, isLit);

    if (light.isLit()) {
        gl.uniform4fv(this.mColorRef, light.getColor());
        gl.uniform3fv(this.mPositionRef, camera.getPixelsPosition(light.getPosition()));
        gl.uniform1f(this.mIntensityRef, light.getIntensity());
        gl.uniform1f(this.mNearRef, camera.getPixelsSize(light.getNear()));
        gl.uniform1f(this.mFarRef, camera.getPixelsSize(light.getFar()));
    }
};

ShaderLightReference.prototype.setLit = function (isLit) {
    var gl = gEngine.Core.getGL();    
    gl.uniform1i(this.mIsLitRef, isLit);
};