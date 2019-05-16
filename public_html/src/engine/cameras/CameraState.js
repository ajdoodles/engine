/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function CameraState(center, width) {
    this.kRate = 0.1;
    this.kCycles = 300;
    this.mWidth = new Interpolator(width, this.kCycles, this.kRate);
    this.mCenter = new InterpolatorVec2(center, this.kCycles, this.kRate);
}

CameraState.prototype.getCenter = function() {
    return this.mCenter.getValue();
};
CameraState.prototype.setCenter = function(center) {
    this.mCenter.setFinalValue(center);
};

CameraState.prototype.getWidth = function() {
    return this.mWidth.getValue();
};
CameraState.prototype.setWidth = function(width) {
    this.mWidth.setFinalValue(width);
};

CameraState.prototype.configInterpolation = function(stiffness, duration) {
    this.mWidth.configInterpolation(stiffness, duration);
    this.mCenter.configInterpolation(stiffness, duration);
};

CameraState.prototype.update = function() {
    this.mWidth.update();
    this.mCenter.update();
};