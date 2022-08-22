/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
import vertexBuffer from "../core/Engine_VertexBuffer.js";
import SimpleShader from "./SimpleShader.js";
import core from "../core/Engine_Core.js";

export default function TextureShader(vertexShaderId, fragmentShaderId) {
    SimpleShader.call(this, vertexShaderId, fragmentShaderId);
    
    this.mTextureCoordinateAttribute = null;
    this.mTexCoord = null;
    
    var gl = core.getGL();
    this.mTextureCoordinateAttribute =
            gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
    this.mColorSampler = gl.getUniformLocation(this.mCompiledShader, "uSampler");
};
core.inheritPrototype(SimpleShader, TextureShader);

TextureShader.prototype.activateShader = function(pixelColor, camera) {
    SimpleShader.prototype.activateShader.call(this, pixelColor, camera);
   
    var gl = core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getGLTexCoordRef());
    gl.enableVertexAttribArray(this.mTextureCoordinateAttribute);
    gl.vertexAttribPointer(
            this.mTextureCoordinateAttribute,
            2,
            gl.FLOAT,
            false,
            0,
            0);
    gl.uniform1i(this.mColorSampler, 0); // Bind color sampler to texture 0
};