/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";
import ShakePosition from "../utils/ShakePosition";

export default class CameraShake {
  origCenter: vec2;
  shookCenter: vec2;
  shake: ShakePosition;

  constructor(
    origCenter: vec2,
    initDeltaX: number,
    initDeltaY: number,
    numOscillations: number,
    shakeDuration: number
  ) {
    this.origCenter = vec2.clone(origCenter);
    this.shookCenter = vec2.clone(origCenter);
    this.shake = new ShakePosition(
      initDeltaX,
      initDeltaY,
      numOscillations,
      shakeDuration
    );
  }

  setCenter(center: vec2) {
    vec2.copy(this.origCenter, center);
  }

  getShookPos() {
    return vec2.clone(this.shookCenter);
  }

  shakeDone() {
    return this.shake.shakeDone();
  }

  updateShakeState() {
    const shake = this.shake.calcShake();
    vec2.add(this.shookCenter, this.origCenter, shake);
  }
}
