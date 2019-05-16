/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SimpleShader(vertexShaderId, fragmentShaderId) {
    this.mCompiledShader = null;
    this.mShaderVertexPositionAttribute = null;
    this.mModelTransform = null;
    this.mViewProjTransform = null;
    this.mPixelColor = null;

    var gl = gEngine.Core.getGL();

    var vertexShader = this._compileShader(vertexShaderId, gl.VERTEX_SHADER);
    var fragmentShader = this._compileShader(fragmentShaderId, gl.FRAGMENT_SHADER);

    this.mCompiledShader = gl.createProgram();
    gl.attachShader(this.mCompiledShader, vertexShader);
    gl.attachShader(this.mCompiledShader, fragmentShader);
    gl.linkProgram(this.mCompiledShader);

    if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
        alert("Error linking shader.");
        return;
    }

    this.mShaderVertexPositionAttribute = gl.getAttribLocation(this.mCompiledShader, "aSquareVertexPosition");
    this.mModelTransform = gl.getUniformLocation(this.mCompiledShader, "uModelTransform");
    this.mViewProjTransform = gl.getUniformLocation(this.mCompiledShader, "uViewProjTransform");
    this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");

    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLVertexRef());

    gl.vertexAttribPointer(
            this.mShaderVertexPositionAttribute,
            3,
            gl.FLOAT,
            false,
            0,
            0);
}

SimpleShader.prototype._compileShader = function (filepath, shaderType) {
    var gl = gEngine.Core.getGL();
    var shaderSource = gEngine.ResourceMap.retrieveAsset(filepath);
    var compiledShader = gl.createShader(shaderType);

    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};

SimpleShader.prototype.activateShader = function(pixelColor, camera) {
    var gl = gEngine.Core.getGL();
    gl.useProgram(this.mCompiledShader);
    gl.uniformMatrix4fv(this.mViewProjTransform, false, camera.getVPMatrix());
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    gl.uniform4fv(this.mPixelColor, pixelColor);
}

SimpleShader.prototype.loadObjectTransform = function(modelTransform) {
    var gl = gEngine.Core.getGL();
    gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
}

SimpleShader.prototype.getShader = function() {
    return this.mCompiledShader;
}