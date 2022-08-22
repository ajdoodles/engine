/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import Interpolator from "./Interpolator.js";
import { vec2 } from "gl-matrix";

export default function InterpolatorVec2(start, cycles, rate) {
    Interpolator.call(this, start, cycles, rate);
}
core.inheritPrototype(Interpolator, InterpolatorVec2);

InterpolatorVec2.prototype._interpolateValue = function () {
//    console.log("In vector interpolation from " + this.mCurrent + " to " + this.mEnd);
    vec2.lerp(this.mCurrent, this.mCurrent, this.mEnd, this.mRate);
};