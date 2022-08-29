/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export default class Interpolator<T> {
    current: T;
    end: T;
    rate: number;
    cycles: number;
    cyclesLeft: number;
    
    constructor (start:T, cycles:number, rate:number) {
        this.current = start;
        this.end = start;
        this.rate = rate;
        this.cycles = cycles;
    
        this.cyclesLeft = 0;
    }

    configInterpolation(stiffness:number, duration:number) {
        this.rate = stiffness;
        this.cycles = duration;
    };

    setFinalValue(final:T) {
    //    console.log("Setting final value");
        this.end = final;
        this.cyclesLeft = this.cycles;
    };

    protected interpolateValue() { /* stub */ };

    getValue() { 
        return this.current;
    };

    update() {
        if (this.cyclesLeft <= 0) {
            return;
        }
        this.cyclesLeft--;
        if (this.cyclesLeft === 0) {
            this.current = this.end;
        } else {
            this.interpolateValue();
        }
    };

}