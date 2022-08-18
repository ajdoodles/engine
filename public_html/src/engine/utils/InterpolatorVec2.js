/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function InterpolatorVec2(start, cycles, rate) {
    Interpolator.call(this, start, cycles, rate);
}
gEngine.Core.inheritPrototype(Interpolator, InterpolatorVec2);

InterpolatorVec2.prototype._interpolateValue = function () {
//    console.log("In vector interpolation from " + this.mCurrent + " to " + this.mEnd);
    glMatrix.vec2.lerp(this.mCurrent, this.mCurrent, this.mEnd, this.mRate);
};