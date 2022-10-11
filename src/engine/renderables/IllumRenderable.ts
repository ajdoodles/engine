/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import textures from "../core/Engine_Textures.js";
import LightRenderable from "./LightRenderable.js";
import Material from "../utils/Material.js";
import Camera from "../cameras/Camera.js";
import IllumShader from "../shaders/IllumShader.js";

export default class IllumRenderable extends LightRenderable {
  normalTexture: string;
  material: Material;

  constructor(
    colorTexture: string,
    normalTexture: string,
    material = new Material()
  ) {
    super(colorTexture);
    this._setShader(ShaderFactory.getIllumShader());

    this.normalTexture = normalTexture;
    this.material = material;
  }

  getMaterial() {
    return this.material;
  }
  setMaterial(material: Material) {
    this.material = material;
  }

  draw(camera: Camera) {
    textures.activateNormalTexture(this.normalTexture);
    (this.shader as IllumShader).setMaterial(this.material);
    super.draw(camera);
  }
}
