/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import Material from "../utils/Material.js";

export default class ShaderMaterialReference {
    ambientRef: any;
    diffuseRef: any;
    specularRef: any;
    shininessRef: any;
    
    constructor(shader:WebGLShader) {
        const gl = core.getGL();
        
        this.ambientRef = gl.getUniformLocation(shader, "uMaterial.Ka");
        this.diffuseRef = gl.getUniformLocation(shader, "uMaterial.Kd");
        this.specularRef = gl.getUniformLocation(shader, "uMaterial.Ks");
        this.shininessRef = gl.getUniformLocation(shader, "uMaterial.Shininess");
    }

    loadToShader (material:Material) {
        if (material === null || material === undefined) {
            return;
        }
        
        const gl = core.getGL();
        
        gl.uniform4fv(this.ambientRef, material.getAmbient());
        gl.uniform4fv(this.diffuseRef, material.getDiffuse());
        gl.uniform4fv(this.specularRef, material.getSpecular());
        gl.uniform1f(this.shininessRef, material.getShininess());
    };

}