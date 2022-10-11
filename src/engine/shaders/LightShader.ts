/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import SpriteShader from "./SpriteShader.js";
import ShaderLightReference from "./ShaderLightReference.js";
import Light from "../lights/Light.js";
import Camera from "../cameras/Camera.js";

export default class LightShader extends SpriteShader {
  kGLSLuLightArraySize: number;
  lightRefs: ShaderLightReference[];
  lights: Light[];

  constructor(vertexShaderId: string, fragmentShaderId: string) {
    super(vertexShaderId, fragmentShaderId);

    // THIS MUST MATCH THE VALUE OF kGLSLuLightArraySize IN LightFS.GLSL
    // Be sure to reflect any changes to this value in GLSL
    this.kGLSLuLightArraySize = 4;

    this.lightRefs = [];
    for (let i = 0; i < this.kGLSLuLightArraySize; i++) {
      this.lightRefs[i] = new ShaderLightReference(this.compiledShader, i);
    }
    this.lights = [];
  }

  setLights(lights: Light[]) {
    this.lights = lights;
  }

  activateShader(color: color, camera: Camera) {
    super.activateShader(color, camera);

    for (let i = 0; i < this.lights.length; i++) {
      this.lightRefs[i].loadToShader(camera, this.lights[i]);
    }
  }
}
