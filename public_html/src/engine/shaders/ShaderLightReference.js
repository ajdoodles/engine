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
    this.mLightTypeRef = gl.getUniformLocation(shader, indexString + "LightType");
    this.mColorRef = gl.getUniformLocation(shader, indexString + "Color");
    this.mPositionRef = gl.getUniformLocation(shader, indexString + "Position");
    this.mDirectionRef = gl.getUniformLocation(shader, indexString + "Direction");
    this.mIntensityRef = gl.getUniformLocation(shader, indexString + "Intensity");
    this.mNearRef = gl.getUniformLocation(shader, indexString + "Near");
    this.mFarRef = gl.getUniformLocation(shader, indexString + "Far");
    this.mDropoffRef = gl.getUniformLocation(shader, indexString + "Dropoff");
    this.mCosInnerRef = gl.getUniformLocation(shader, indexString + "CosInner");
    this.mCosOuterRef = gl.getUniformLocation(shader, indexString + "CosOuter");
}

ShaderLightReference.prototype.loadToShader = function (camera, light) {
    var gl = gEngine.Core.getGL();
    
    var isLit = light !== undefined && light !== null && light.isLit();
    gl.uniform1i(this.mIsLitRef, isLit);

    if (light.isLit()) {
        gl.uniform1i(this.mLightTypeRef, light.getLightType());
        gl.uniform4fv(this.mColorRef, light.getColor());
        gl.uniform3fv(this.mPositionRef, camera.convertWCPosToPx(light.getPosition()));
        gl.uniform1f(this.mIntensityRef, light.getIntensity());
        gl.uniform1f(this.mNearRef, camera.convertWCSizeToPx(light.getNear()));
        gl.uniform1f(this.mFarRef, camera.convertWCSizeToPx(light.getFar()));
        
        var direction = vec3.fromValues(0.0, 0.0, 0.0);
        var dropoff = 0;
        var cosInner = 0.0;
        var cosOuter = 0.0;
        
        if (light.getLightType() !== Light.prototype.eLightType.ePointLight) {
            direction = camera.convertWCVecToPx(light.getDirection());
            if (light.getLightType() === Light.prototype.eLightType.eSpotLight) {
                dropoff = light.getDropoff();
                cosInner = Math.cos(light.getInnerRads() * 0.5);
                cosOuter = Math.cos(light.getOuterRads() * 0.5);
            }
        }
        
        gl.uniform3fv(this.mDirectionRef, direction);
        gl.uniform1f(this.mDropoffRef, dropoff);
        gl.uniform1f(this.mCosInnerRef, cosInner);
        gl.uniform1f(this.mCosOuterRef, cosOuter);
    }
};

ShaderLightReference.prototype.setLit = function (isLit) {
    var gl = gEngine.Core.getGL();    
    gl.uniform1i(this.mIsLitRef, isLit);
};
