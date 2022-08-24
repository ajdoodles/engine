/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import vertexBuffer from "../core/Engine_VertexBuffer.js";
import resourceMap from "../core/resources/Engine_ResourceMap.js";
import defaultResources from "../core/resources/Engine_DefaultResources.js";
import Camera from "../cameras/Camera.js";
import Transform from "../utils/Transform.js";
import { mat4 } from "gl-matrix";

export default class SimpleShader {

    compiledShader;
    shaderVertexPositionAttribute;
    modelTransform;
    viewProjTransform;
    pixelColor;
    globalAmbientColor;
    globalAmbientIntensity = 1.0;

    constructor(vertexShaderId:string, fragmentShaderId:string){
        this.globalAmbientIntensity = 1.0;

        const gl = core.getGL();

        const vertexShader = this._compileShader(vertexShaderId, gl.VERTEX_SHADER);
        const fragmentShader = this._compileShader(fragmentShaderId, gl.FRAGMENT_SHADER);
    
        this.compiledShader = gl.createProgram();
        gl.attachShader(this.compiledShader, vertexShader);
        gl.attachShader(this.compiledShader, fragmentShader);
        gl.linkProgram(this.compiledShader);
    
        if (!gl.getProgramParameter(this.compiledShader, gl.LINK_STATUS)) {
            alert("Error linking shader.");
            return;
        }
    
        this.shaderVertexPositionAttribute = gl.getAttribLocation(this.compiledShader, "aSquareVertexPosition");
        this.modelTransform = gl.getUniformLocation(this.compiledShader, "uModelTransform");
        this.viewProjTransform = gl.getUniformLocation(this.compiledShader, "uViewProjTransform");
        this.pixelColor = gl.getUniformLocation(this.compiledShader, "uPixelColor");
        this.globalAmbientColor = gl.getUniformLocation(this.compiledShader, "uGlobalAmbientColor");
        this.globalAmbientIntensity = gl.getUniformLocation(this.compiledShader, "uGlobalAmbientIntensity");
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getGLVertexRef());
    
        gl.vertexAttribPointer(
                this.shaderVertexPositionAttribute,
                3,
                gl.FLOAT,
                false,
                0,
                0);
    }

    _compileShader (filepath:string, shaderType:number) {
        const gl = core.getGL();
        const shaderSource = resourceMap.retrieveAsset(filepath);
        const compiledShader = gl.createShader(shaderType);
    
        gl.shaderSource(compiledShader, shaderSource);
        gl.compileShader(compiledShader);
    
        if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
            alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
        }
    
        return compiledShader;
    };
    
    activateShader(pixelColor:color, camera:Camera) {
        const gl = core.getGL();
        gl.useProgram(this.compiledShader);
        gl.uniform4fv(this.globalAmbientColor, defaultResources.getGlobalAmbientColor());
        gl.uniform1f(this.globalAmbientIntensity, defaultResources.getGlobalAmbientIntensity());
        gl.uniformMatrix4fv(this.viewProjTransform, false, camera.getVPMatrix());
        gl.enableVertexAttribArray(this.shaderVertexPositionAttribute);
        gl.uniform4fv(this.pixelColor, pixelColor);
    };
    
    loadObjectTransform(modelTransform:mat4) {
        const gl = core.getGL();
        gl.uniformMatrix4fv(this.modelTransform, false, modelTransform);
    }
    
    getShader() {
        return this.compiledShader;
    }
}


