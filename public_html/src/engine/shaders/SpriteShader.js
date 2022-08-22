/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import TextureShader from "./TextureShader.js";
import SimpleShader from "./SimpleShader.js";

export default function SpriteShader(vertexShaderId, fragmentShaderId) {
    TextureShader.call(this, vertexShaderId, fragmentShaderId);
    
    var initialCoords = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0];

    var gl = core.getGL();
    this.mSpriteCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mSpriteCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initialCoords), gl.DYNAMIC_DRAW);
};
core.inheritPrototype(TextureShader, SpriteShader);

SpriteShader.prototype.setTextureCoordinates = function(coordinates) {
    var gl = core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mSpriteCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(coordinates));
};

SpriteShader.prototype.activateShader = function(pixelColor, camera) {
    SimpleShader.prototype.activateShader.call(this, pixelColor, camera);
   
    var gl = core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mSpriteCoordBuffer);
    gl.enableVertexAttribArray(this.mTextureCoordinateAttribute);
    gl.vertexAttribPointer(
            this.mTextureCoordinateAttribute,
            2,
            gl.FLOAT,
            false,
            0,
            0);
};

SpriteShader.prototype.setMaterial = function (material) {
    // Overridden by IllumShader
};
SpriteShader.prototype.setLights = function (lights) {
    // Overridden by LightShader
};
