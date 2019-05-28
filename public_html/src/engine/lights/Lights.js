/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Light(
        color = vec4.fromValues(0.5, 0.5, 0.5, 1.0), 
        position = vec3.fromValues(35, 50, 5), 
        radius = 10) {
    this.mColor = color;
    this.mPosition = position;
    this.mRadius = radius;
    this.mLit = true;
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

Light.prototype.getRadius = function() {
    return this.mRadius;
};

Light.prototype.setRadius = function(radius) {
    this.mRadius = radius;
};

Light.prototype.isLit = function() {
    return this.mLit;
};

Light.prototype.setLit = function(lit) {
    return this.mLit = lit;
};