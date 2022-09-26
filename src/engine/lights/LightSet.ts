/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Light from "./Light";

export default class LightSet {
  lights: Light[] = [];

  numLights() {
    return this.lights.length;
  }
  getLightAt(index: number) {
    return this.lights[index];
  }
  addLight(light: Light) {
    this.lights.push(light);
  }
}
