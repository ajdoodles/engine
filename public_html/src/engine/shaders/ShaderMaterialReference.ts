/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_GL.js";
import Material from "../utils/Material.js";

export default class ShaderMaterialReference {
  ambientRef: WebGLUniformLocation;
  diffuseRef: WebGLUniformLocation;
  specularRef: WebGLUniformLocation;
  shininessRef: WebGLUniformLocation;

  constructor(shader: WebGLShader) {
    const gl = core.gl;

    this.ambientRef = gl.getUniformLocation(
      shader,
      "uMaterial.Ka"
    ) as WebGLUniformLocation;
    this.diffuseRef = gl.getUniformLocation(
      shader,
      "uMaterial.Kd"
    ) as WebGLUniformLocation;
    this.specularRef = gl.getUniformLocation(
      shader,
      "uMaterial.Ks"
    ) as WebGLUniformLocation;
    this.shininessRef = gl.getUniformLocation(
      shader,
      "uMaterial.Shininess"
    ) as WebGLUniformLocation;
  }

  loadToShader(material: Material) {
    if (material === null || material === undefined) {
      return;
    }

    const gl = core.gl;

    gl.uniform4fv(this.ambientRef, material.getAmbient());
    gl.uniform4fv(this.diffuseRef, material.getDiffuse());
    gl.uniform4fv(this.specularRef, material.getSpecular());
    gl.uniform1f(this.shininessRef, material.getShininess());
  }
}
