/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import SpriteRenderable from "./SpriteRenderable.js";
import Light from "../lights/Light.js";
import Camera from "../cameras/Camera.js";
import LightShader from "../shaders/LightShader.js";

export default class LightRenderable extends SpriteRenderable {
  lights: Light[] = [];

  constructor(texture: string) {
    super(texture);
    this._setShader(ShaderFactory.getLightShader());
  }

  getLightAt(index: number) {
    return this.lights[index];
  }
  setLights(lights: Light[]) {
    this.lights = lights;
  }
  addLight(light: Light) {
    this.lights.push(light);
  }
  numLights() {
    return this.lights.length;
  }

  draw(camera: Camera) {
    (this.shader as LightShader).setLights(this.lights);
    SpriteRenderable.prototype.draw.call(this, camera);
  }
}
