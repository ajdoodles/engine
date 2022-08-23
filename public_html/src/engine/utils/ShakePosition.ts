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
export default class ShakePosition {
    initX: number;
    initY: number;
    omega: number;
    duration: number;
    numCyclesLeft: number;
    
    constructor(xDelta:number, yDelta:number, numOscillations:number, duration:number) {
        this.initX = xDelta; 
        this.initY = yDelta;
        this.omega = numOscillations * 2 * Math.PI; //convert to radians 
        this.duration = duration;
        this.numCyclesLeft = duration;
    };

    /**
     * 
     * @returns {Number} float between zero and one representing the interpolation                
     */
    _getHarmonicValue() {
        const frac = this.numCyclesLeft/this.duration;
        return frac * frac * Math.cos(this.omega * (1-frac));
    };

    shakeDone() {
        return (this.numCyclesLeft <= 0);
    };

    calcShake() {
        this.numCyclesLeft--;
        let deltaX = 0;
        let deltaY = 0;
        if (!this.shakeDone()) {
            const xBit = (Math.random() > 0.5) ? 1 : -1;
            const yBit = (Math.random() > 0.5) ? 1 : -1;
            const harmonic = this._getHarmonicValue();
            deltaX = harmonic * this.initX * xBit;
            deltaY = harmonic * this.initY * yBit;
        }
        return vec2.fromValues(deltaX, deltaY);
    };
}