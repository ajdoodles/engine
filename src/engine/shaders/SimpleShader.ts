/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_GL.js";
import defaultResources from "../core/resources/Engine_DefaultResources.js";
import Camera from "../cameras/Camera.js";
import FlatShader from "./FlatShader.js";

export default class SimpleShader extends FlatShader {
  globalAmbientColor: WebGLUniformLocation;
  globalAmbientIntensity: WebGLUniformLocation;

  constructor(vertexShaderId: string, fragmentShaderId: string) {
    super (vertexShaderId, fragmentShaderId);

    const gl = core.gl;

    this.globalAmbientColor = gl.getUniformLocation(
      this.compiledShader,
      "uGlobalAmbientColor"
    ) as WebGLUniformLocation;
    this.globalAmbientIntensity = gl.getUniformLocation(
      this.compiledShader,
      "uGlobalAmbientIntensity"
    ) as WebGLUniformLocation;
  }

  activateShader(pixelColor: color, camera: Camera) {
    super.activateShader(pixelColor, camera);
    const gl = core.gl;
    gl.uniform4fv(
      this.globalAmbientColor,
      defaultResources.getGlobalAmbientColor()
    );
    gl.uniform1f(
      this.globalAmbientIntensity,
      defaultResources.getGlobalAmbientIntensity()
    );
  }
}
