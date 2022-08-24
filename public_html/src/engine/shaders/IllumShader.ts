/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec3 } from "gl-matrix";
import Camera from "../cameras/Camera.js";
import core from "../core/Engine_Core.js";
import Material from "../utils/Material.js";
import LightShader from "./LightShader.js";
import ShaderMaterialReference from "./ShaderMaterialReference.js";

export default class IllumShader extends LightShader {
    normalSampler: WebGLSampler;
    cameraPosition: vec3;
    materialRef: ShaderMaterialReference;
    material!: Material;

    constructor(vectorShaderId:string, fragmentShaderId:string){
        super(vectorShaderId, fragmentShaderId);
    
        const gl = core.getGL();

        this.normalSampler = gl.getUniformLocation(this.compiledShader, "uNormalSampler");
        this.cameraPosition = gl.getUniformLocation(this.compiledShader, "uCameraPosition");
        this.materialRef = new ShaderMaterialReference(this.compiledShader);

    }

    setMaterial  (material :Material) {
        this.material = material;
    };
    
    activateShader (pixelColor: color, camera: Camera) {
        LightShader.prototype.activateShader.call(this, pixelColor, camera);
        
        const gl = core.getGL();
        gl.uniform1i(this.normalSampler, 1);
        gl.uniform3fv(this.cameraPosition, camera.getCameraPosPx());
        this.materialRef.loadToShader(this.material);
    };

};
