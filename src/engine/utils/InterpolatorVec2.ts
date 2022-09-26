/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Interpolator from "./Interpolator.js";
import { vec2 } from "gl-matrix";

export default class InterpolatorVec2 extends Interpolator<vec2> {
  constructor(start: vec2, cycles: number, rate: number) {
    super(start, cycles, rate);
  }

  protected interpolateValue() {
    //    console.log("In vector interpolation from " + this.current + " to " + this.end);
    vec2.lerp(this.current, this.current, this.end, this.rate);
  }
}
