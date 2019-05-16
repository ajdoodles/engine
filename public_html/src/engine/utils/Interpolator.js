/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Interpolator(start, cycles, rate) {
    this.mCurrent = start;
    this.mEnd = start;
    this.mRate = rate;
    this.mCycles = cycles;
    
    this.mCyclesLeft = 0;
}

Interpolator.prototype.configInterpolation = function(stiffness, duration) {
    this.mRate = stiffness;
    this.mCycles = duration;
};

Interpolator.prototype.setFinalValue = function(final) {
//    console.log("Setting final value");
    this.mEnd = final;
    this.mCyclesLeft = this.mCycles;
};

Interpolator.prototype._interpolateValue = function() {
//    console.log("In scalar interpolation from " + this.mCurrent + " to " + this.mEnd);
    this.mCurrent = this.mCurrent + (this.mEnd - this.mCurrent) * this.mRate;
};

Interpolator.prototype.getValue = function() { 
    return this.mCurrent;
};

Interpolator.prototype.update = function() {
    if (this.mCyclesLeft <= 0) {
        return;
    }
    this.mCyclesLeft--;
    if (this.mCyclesLeft === 0) {
        this.mCurrent = this.mEnd;
    } else {
        this._interpolateValue();
    }
};