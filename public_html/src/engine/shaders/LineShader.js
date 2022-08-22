/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import vertexBuffer from "../core/Engine_VertexBuffer.js";
import resourceMap from "../core/resources/Engine_ResourceMap.js";
import SimpleShader from "./SimpleShader.js";

export default function LineShader(vertexShaderId, fragmentShaderId) {
    this.mCompiledShader = null;
    this.mShaderVertexPositionAttribute = null;
    this.mModelTransform = null;
    this.mViewProjTransform = null;
    this.mPixelColor = null;
    
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

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getGLVertexRef());

    gl.vertexAttribPointer(
            this.mShaderVertexPositionAttribute,
            3,
            gl.FLOAT,
            false,
            0,
            0);
};
core.inheritPrototype(SimpleShader, LineShader);

LineShader.prototype._compileShader = function (filepath, shaderType) {
    var gl = core.getGL();
    var shaderSource = resourceMap.retrieveAsset(filepath);
    var compiledShader = gl.createShader(shaderType);

    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        var errorMsg = gl.getShaderInfoLog(compiledShader);
        alert("A shader compiling error occurred: " + errorMsg);
        console.log(errorMsg);
    }

    return compiledShader;
};

LineShader.prototype.activateShader = function (pixelColor, camera) {
    var gl = core.getGL();
    gl.useProgram(this.mCompiledShader);
    gl.uniformMatrix4fv(this.mViewProjTransform, false, camera.getVPMatrix());
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    gl.uniform4fv(this.mPixelColor, pixelColor);
};

LineShader.prototype.loadObjectTransform = function(modelTransform) {
    var gl = core.getGL();
    gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
};