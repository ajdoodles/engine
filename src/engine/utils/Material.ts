/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec4 } from "gl-matrix";

export default class Material {
  ambient: vec4 = vec4.fromValues(0.0, 0.0, 0.0, 0.0);
  diffuse: vec4 = vec4.fromValues(0.2, 0.2, 0.2, 1.0);
  specular: vec4 = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
  shininess = 20;

  getAmbient() {
    return this.ambient;
  }
  setAmbient(ambient: vec4) {
    vec4.copy(this.ambient, ambient);
  }

  getDiffuse() {
    return this.diffuse;
  }
  setDiffuse(diffuse: vec4) {
    vec4.copy(this.diffuse, diffuse);
  }

  getSpecular() {
    return this.specular;
  }
  setSpecular(specular: vec4) {
    vec4.copy(this.specular, specular);
  }

  getShininess() {
    return this.shininess;
  }
  setShininess(shininess: number) {
    this.shininess = shininess;
  }
}
