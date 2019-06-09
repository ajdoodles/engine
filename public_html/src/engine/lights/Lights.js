/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Light(
        color = vec4.fromValues(0.5, 0.5, 0.5, 1.0), 
        position = vec3.fromValues(35, 50, 5),
        intensity = 1.0,
        near = 5,
        far = 10) {
    this.mLit = true;         
    this.mColor = color;
    this.mPosition = position;
    this.mIntensity = intensity;
    this.mNear = near;
    this.mFar = far;
};

Light.prototype.isLit = function() {
    return this.mLit;
};
Light.prototype.setLit = function(lit) {
    return this.mLit = lit;
};

Light.prototype.getColor = function() {
    return this.mColor;
};
Light.prototype.setColor = function(color) {
    vec4.copy(this.mColor, color);
};

Light.prototype.getPosition = function() {
    return this.mPosition;
};
Light.prototype.setPosition = function(position) {
    vec3.copy(this.mPosition, position);
};
Light.prototype.incXPos = function (delta) {
    vec3.set(this.mPosition, this.mPosition[0] + delta, this.mPosition[1], this.mPosition[2]);
};
Light.prototype.incYPos = function (delta) {
    vec3.set(this.mPosition, this.mPosition[0], this.mPosition[1] + delta, this.mPosition[2]);
};
Light.prototype.incZPos = function (delta) {
    vec3.set(this.mPosition, this.mPosition[0], this.mPosition[1], this.mPosition[2] + delta);
};

Light.prototype.getIntensity = function () {
    return this.mIntensity;
};

Light.prototype.setIntensity = function (intensity) {
    this.mIntensity = intensity;
};
Light.prototype.incIntensity = function (delta) {
    this.mIntensity += delta;
};

Light.prototype.getNear = function () {
    return this.mNear;
};
Light.prototype.setNear = function (near) {
    this.mNear = near;
};
Light.prototype.incNear = function (delta) {
    this.mNear += delta;
};

Light.prototype.getFar = function () {
    return this.mFar;
};
Light.prototype.setFar = function (far) {
    this.mFar = far;
};
Light.prototype.incFar = function (delta) {
    this.mFar += delta;
};
