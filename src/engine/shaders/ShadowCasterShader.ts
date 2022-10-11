/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import SpriteShader from "./SpriteShader.js";
import ShaderLightReference from "./ShaderLightReference.js";
import Camera from "../cameras/Camera.js";
import Light from "../lights/Light.js";

export default class ShadowCasterShader extends SpriteShader {
  light!: Light;
  lightRef: ShaderLightReference;

  constructor(vertexShaderId: string, fragmentShaderId: string) {
    super(vertexShaderId, fragmentShaderId);

    this.lightRef = new ShaderLightReference(this.compiledShader, 0);
  }

  setLight(light: Light) {
    this.light = light;
  }

  activateShader(pixelColor: color, camera: Camera) {
    super.activateShader(pixelColor, camera);

    this.lightRef.loadToShader(camera, this.light);
  }
}
