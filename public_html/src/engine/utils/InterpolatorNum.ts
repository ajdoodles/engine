import Interpolator from "./Interpolator";

export default class InterpolatorNum extends Interpolator<number> {

    constructor(start:number, cycles:number, rate:number) {
        super(start, cycles, rate);
    }

    protected interpolateValue() {
        this.current = this.current + (this.end - this.current) * this.rate;
    }
}