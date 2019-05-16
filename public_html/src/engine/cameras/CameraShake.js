/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function CameraShake(origCenter, initDeltaX, initDeltaY, numOscillations, shakeDuration) {
    this.mOrigCenter = vec2.clone(origCenter);
    this.mShookCenter= vec2.clone(origCenter);
    this.mShake = new ShakePosition(initDeltaX, initDeltaY, numOscillations, shakeDuration);
};

CameraShake.prototype.setCenter = function(center) {
    vec2.copy(this.mOrigCenter, center);
};

CameraShake.prototype.getShookPos = function() {
    return vec2.clone(this.mShookCenter);
}

CameraShake.prototype.shakeDone = function() {
    return this.mShake.shakeDone();
};

CameraShake.prototype.updateShakeState = function() {
    var shake = this.mShake.calcShake();
    vec2.add(this.mShookCenter, this.mOrigCenter, shake);
};