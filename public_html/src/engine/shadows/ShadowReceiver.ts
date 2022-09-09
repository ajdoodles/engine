/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_GL.js";
import Camera from "../cameras/Camera.js";
import ShaderFactory from "../shaders/ShaderFactory.js";
import ShadowCaster from "./ShadowCaster.js";
import GameObject from "../gameobjects/GameObject.js";

export default class ShadowReceiver {
  shadowStencilBit = 0x01;
  shadowStencilMask = 0xff;

  shadowReceiverShader = ShaderFactory.getShadowReceiverShader();
  shadowCasters: ShadowCaster[] = [];

  shadowReceiver: GameObject;

  constructor(receiver: GameObject) {
    this.shadowReceiver = receiver;
  }

  addShadowCaster(casterObject: GameObject) {
    const caster = new ShadowCaster(casterObject, this.shadowReceiver);
    this.shadowCasters.push(caster);
  }

  draw(camera: Camera) {
    this.shadowReceiver.draw(camera);

    this._shadowReceiverStencilOn();
    const oldShader = this.shadowReceiver.renderComponent.swapShader(
      this.shadowReceiverShader
    );
    this.shadowReceiver.draw(camera);
    this.shadowReceiver.renderComponent.swapShader(oldShader);
    this._shadowReceiverStencilOff();

    for (let i = 0; i < this.shadowCasters.length; i++) {
      this.shadowCasters[i].draw(camera);
    }

    this._shadowReceiverStencilDisable();
  }

  _shadowReceiverStencilOn() {
    const gl = core.gl;
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.enable(gl.STENCIL_TEST);
    gl.colorMask(false, false, false, false);
    gl.depthMask(false);
    gl.stencilFunc(gl.NEVER, this.shadowStencilBit, this.shadowStencilMask);
    gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
    gl.stencilMask(this.shadowStencilMask);
  }

  _shadowReceiverStencilOff() {
    const gl = core.gl;
    gl.depthMask(true);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.EQUAL, this.shadowStencilBit, this.shadowStencilMask);
    gl.colorMask(true, true, true, true);
  }

  _shadowReceiverStencilDisable() {
    const gl = core.gl;
    gl.disable(gl.STENCIL_TEST);
  }
}
