/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import core from "../core/Engine_GL.js";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";
import FlatShader from "../shaders/FlatShader.js";

export default class Renderable {
  shader = ShaderFactory.getFlatShader();
  color: color = [1.0, 1.0, 1.0, 1.0];
  xform = new Transform();

  _setShader(shader: FlatShader) {
    this.shader = shader;
  }
  swapShader(shader: FlatShader) {
    const current = this.shader;
    this.shader = shader;
    return current;
  }

  getColor() {
    return this.color;
  }

  setColor(color: color) {
    this.color = color;
  }
  swapColor(color: color): color {
    const current = Array.from(this.color) as color;
    this.color = Array.from(color) as color;
    return current;
  }

  getXform() {
    return this.xform;
  }

  setXform(xform: Transform) {
    this.xform = xform;
  }

  draw(camera: Camera) {
    const gl = core.gl;
    this.shader.activateShader(this.color, camera);
    this.shader.loadObjectTransform(this.xform.getXForm());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
