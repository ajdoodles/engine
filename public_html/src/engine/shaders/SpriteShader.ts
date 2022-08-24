/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import TextureShader from "./TextureShader.js";
import SimpleShader from "./SimpleShader.js";
import Camera from "../cameras/Camera.js";
import Light from "../lights/Light.js";
import Material from "../utils/Material.js";

export default class SpriteShader extends TextureShader {
    spriteCoordBuffer: WebGLBuffer;

    constructor(vertexShaderId: string, fragmentShaderId: string) {
        super(vertexShaderId, fragmentShaderId);
    
        const initialCoords = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0];
    
        const gl = core.getGL();
        this.spriteCoordBuffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initialCoords), gl.DYNAMIC_DRAW);
    }

    setTextureCoordinates(coordinates: UVCoordArray) {
        const gl = core.getGL();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteCoordBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(coordinates));
    };
    
    activateShader(pixelColor:color, camera:Camera) {
        SimpleShader.prototype.activateShader.call(this, pixelColor, camera);
       
        const gl = core.getGL();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteCoordBuffer);
        gl.enableVertexAttribArray(this.textureCoordinateAttribute);
        gl.vertexAttribPointer(
                this.textureCoordinateAttribute,
                2,
                gl.FLOAT,
                false,
                0,
                0);
    };
    
    setMaterial (material:Material) {
        // Overridden by IllumShader
    };
    setLights (lights:Light[]) {
        // Overridden by LightShader
    };
};
