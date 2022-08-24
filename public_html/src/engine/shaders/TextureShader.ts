/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
import vertexBuffer from "../core/Engine_VertexBuffer.js";
import SimpleShader from "./SimpleShader.js";
import core from "../core/Engine_Core.js";
import Camera from "../cameras/Camera.js";

export default class TextureShader extends SimpleShader {
    textureCoordinateAttribute: number;
    texCoord: null;
    colorSampler: WebGLSampler;

    constructor(vertexShaderId:string, fragmentShaderId:string) {
        super(vertexShaderId, fragmentShaderId);
    
        this.texCoord = null;
        
        const gl = core.getGL();
        this.textureCoordinateAttribute =
                gl.getAttribLocation(this.compiledShader, "aTextureCoordinate");
        this.colorSampler = gl.getUniformLocation(this.compiledShader, "uSampler") as WebGLSampler;
    }

    activateShader(pixelColor:color, camera:Camera) {
        SimpleShader.prototype.activateShader.call(this, pixelColor, camera);
       
        const gl = core.getGL();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getGLTexCoordRef());
        gl.enableVertexAttribArray(this.textureCoordinateAttribute);
        gl.vertexAttribPointer(
                this.textureCoordinateAttribute,
                2,
                gl.FLOAT,
                false,
                0,
                0);
        gl.uniform1i(this.colorSampler, 0); // Bind color sampler to texture 0
    };

};
core.inheritPrototype(SimpleShader, TextureShader);

