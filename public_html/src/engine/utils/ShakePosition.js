/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec2 } from "gl-matrix";

/**
 * 
 * @param {Number} xDelta wc units, initial x displacement
 * @param {Number} yDelta wc units, initial y displacement
 * @param {Number} numOscillations number of complete oscillations the
 *                                 harmonic oscillator will go through in the
 *                                 time given
 * @param {Number} duration number of ticks the shake will take
 * @returns {ShakePosition}
 */
function ShakePosition(xDelta, yDelta, numOscillations, duration) {
    this.mInitX = xDelta; 
    this.mInitY = yDelta;
    this.mOmega = numOscillations * 2 * Math.PI; //convert to radians 
    this.mDuration = duration;
    this.mNumCyclesLeft = duration;
};

/**
 * 
 * @returns {Number} float between zero and one representing the interpolation                
 */
ShakePosition.prototype._getHarmonicValue = function() {
    var frac = this.mNumCyclesLeft/this.mDuration;
    return frac * frac * Math.cos(this.mOmega * (1-frac));
};

ShakePosition.prototype.shakeDone = function() {
    return (this.mNumCyclesLeft <= 0);
};

ShakePosition.prototype.calcShake = function() {
    this.mNumCyclesLeft--;
    var deltaX = 0;
    var deltaY = 0;
    if (!this.shakeDone()) {
        var xBit = (Math.random() > 0.5) ? 1 : -1;
        var yBit = (Math.random() > 0.5) ? 1 : -1;
        var harmonic = this._getHarmonicValue();
        deltaX = harmonic * this.mInitX * xBit;
        deltaY = harmonic * this.mInitY * yBit;
    }
    return vec2.fromValues(deltaX, deltaY);
};