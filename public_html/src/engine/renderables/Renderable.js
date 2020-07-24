/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Renderable() {
    this.mShader = gEngine.DefaultResources.getConstColorShader();
    this.mColor = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.mXform = new Transform();
};

Renderable.prototype._setShader = function (shader) {
    this.mShader = shader;
};
Renderable.prototype.swapShader = function (shader) {
    var current = this.mShader;
    this.mShader = shader;
    return current;
};

Renderable.prototype.getColor = function() {
    return this.mColor;
}

Renderable.prototype.setColor = function(color) {
    this.mColor = color;
}
Renderable.prototype.swapColor = function (color) {
    var current = vec4.clone(this.mColor);
    vec4.copy(this.mColor, color);
    return current;
};

Renderable.prototype.getXform = function() {
    return this.mXform;
}

Renderable.prototype.setXform = function (xform) {
    this.mXform = xform;
};

Renderable.prototype.draw = function(camera) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, camera);
    this.mShader.loadObjectTransform(this.mXform.getXForm());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}