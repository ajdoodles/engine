/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ShaderMaterialReference(shader) {
    var gl = gEngine.Core.getGL();
    
    this.mAmbientRef = gl.getUniformLocation(shader, "uMaterial.Ka");
    this.mDiffuseRef = gl.getUniformLocation(shader, "uMaterial.Kd");
    this.mSpecularRef = gl.getUniformLocation(shader, "uMaterial.Ks");
    this.mShininessRef = gl.getUniformLocation(shader, "uMaterial.Shininess");
}

ShaderMaterialReference.prototype.loadToShader = function (material) {
    if (material === null || material === undefined) {
        return;
    }
    
    var gl = gEngine.Core.getGL();
    
    gl.uniform4fv(this.mAmbientRef, material.getAmbient());
    gl.uniform4fv(this.mDiffuseRef, material.getDiffuse());
    gl.uniform4fv(this.mSpecularRef, material.getSpecular());
    gl.uniform1f(this.mShininessRef, material.getShininess());
};