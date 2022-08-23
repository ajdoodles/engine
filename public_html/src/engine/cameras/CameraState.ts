/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";
import Interpolator from "../utils/Interpolator.js";
import InterpolatorVec2 from "../utils/InterpolatorVec2.js";

export default class CameraState {
    rate: number;
    cycles: number;
    width: Interpolator;
    center: any;
    
    constructor(center: vec2, width: number) {
        this.rate = 0.1;
        this.cycles = 300;
        this.width = new Interpolator(width, this.cycles, this.rate);
        this.center = new InterpolatorVec2(center, this.cycles, this.rate);
    }

    getCenter() {
        return this.center.getValue();
    };
    setCenter(center: vec2) {
        this.center.setFinalValue(center);
    };

    getWidth() {
        return this.width.getValue();
    };
    setWidth(width: number) {
        this.width.setFinalValue(width);
    };

    configInterpolation(stiffness: number, duration: number) {
        this.width.configInterpolation(stiffness, duration);
        this.center.configInterpolation(stiffness, duration);
    };

    update() {
        this.width.update();
        this.center.update();
    };

}