/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the templat
e in the editor.
 */

function LightShader(vertexShaderId, fragmentShaderId) {
    SpriteShader.call(this, vertexShaderId, fragmentShaderId);
    
    var gl = gEngine.Core.getGL();
    this.mLightOn = gl.getUniformLocation(this.mCompiledShader, "uLightOn");
    this.mLightColor = gl.getUniformLocation(this.mCompiledShader, "uLightColor");
    this.mLightPosition = gl.getUniformLocation(this.mCompiledShader, "uLightPosition");
    this.mLightRadius = gl.getUniformLocation(this.mCompiledShader, "uLightRadius");
    
    this.mLight = null;
};
gEngine.Core.inheritPrototype(SpriteShader, LightShader);

LightShader.prototype.setLight = function(light) {
    this.mLight = light;
};

LightShader.prototype.activateShader = function (color, camera) {
    SpriteShader.prototype.activateShader.call(this, color, camera);
    var gl = gEngine.Core.getGL();
    var isLit = this.mLight !== undefined && this.mLight !== null && this.mLight.isLit();
    
    gl.uniform1i(this.mLightOn, isLit);
    if (isLit) {
        gl.uniform4fv(this.mLightColor, this.mLight.getColor());
        gl.uniform3fv(this.mLightPosition, camera.getPixelsPosition(this.mLight.getPosition()));
        gl.uniform1f(this.mLightRadius, camera.getPixelsSize(this.mLight.getRadius()));
    }
};