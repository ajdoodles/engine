/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import vertexBuffer from "../core/Engine_VertexBuffer.js";
import resourceMap from "../core/resources/Engine_ResourceMap.js";
import defaultResources from "../core/resources/Engine_DefaultResources.js";

export default function SimpleShader(vertexShaderId, fragmentShaderId) {
    this.mCompiledShader = null;
    this.mShaderVertexPositionAttribute = null;
    this.mModelTransform = null;
    this.mViewProjTransform = null;
    this.mPixelColor = null;
    this.mGlobalAmbientColor = null;
    this.mGlobalAmbientIntensity = 1.0;

    var gl = core.getGL();

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
    this.mGlobalAmbientColor = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientColor");
    this.mGlobalAmbientIntensity = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientIntensity");
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getGLVertexRef());

    gl.vertexAttribPointer(
            this.mShaderVertexPositionAttribute,
            3,
            gl.FLOAT,
            false,
            0,
            0);
}

SimpleShader.prototype._compileShader = function (filepath, shaderType) {
    var gl = core.getGL();
    var shaderSource = resourceMap.retrieveAsset(filepath);
    var compiledShader = gl.createShader(shaderType);

    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};

SimpleShader.prototype.activateShader = function(pixelColor, camera) {
    var gl = core.getGL();
    gl.useProgram(this.mCompiledShader);
    gl.uniform4fv(this.mGlobalAmbientColor, defaultResources.getGlobalAmbientColor());
    gl.uniform1f(this.mGlobalAmbientIntensity, defaultResources.getGlobalAmbientIntensity());
    gl.uniformMatrix4fv(this.mViewProjTransform, false, camera.getVPMatrix());
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    gl.uniform4fv(this.mPixelColor, pixelColor);
};

SimpleShader.prototype.loadObjectTransform = function(modelTransform) {
    var gl = core.getGL();
    gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
}

SimpleShader.prototype.getShader = function() {
    return this.mCompiledShader;
}