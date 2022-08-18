/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Transform() {
    this.mPosition = glMatrix.vec2.fromValues(0.0, 0.0);
    this.mZ = 0.0;
    this.mScale = glMatrix.vec2.fromValues(1.0, 1.0);
    this.mRotationRad = 0.0;
    this.mHFlipMultiplier = 1; // -1 or 1
    this.mVFlipMultiplier = 1; // -1 or 1
};

Transform.prototype.getPosition = function() {
    return this.mPosition;
};
Transform.prototype.getPosition3D = function() {
    return glMatrix.vec3.fromValues(this.getXPos(), this.getYPos(), this.getZPos());
};
Transform.prototype.getXPos = function() {
   return this.mPosition[0]; 
};
Transform.prototype.getYPos = function() {
   return this.mPosition[1]; 
};
Transform.prototype.getZPos = function () {
    return this.mZ;
};
Transform.prototype.setPosition = function(x, y) {
    glMatrix.vec2.set(this.mPosition, x, y);
};
Transform.prototype.setXPos = function(x) {
    glMatrix.vec2.set(this.mPosition, x, this.getYPos());
};
Transform.prototype.setYPos = function(y) {
    glMatrix.vec2.set(this.mPosition, this.getXPos(), y);
};
Transform.prototype.setZPos = function (z) {
    this.mZ = z;
};
Transform.prototype.incXPos = function(deltaX) {
    this.setXPos(this.getXPos() + deltaX);
};
Transform.prototype.incYPos = function(deltaY) {
    this.setYPos(this.getYPos() + deltaY);
};
Transform.prototype.incZPos = function (deltaZ) {
    this.mZ += deltaZ;
};
Transform.prototype.offset = function (offset) {
    this.incXPos(offset[0]);
    this.incYPos(offset[1]);
    this.incZPos(offset[2]);
};

Transform.prototype.getScale = function() {
    return this.mScale;
};

Transform.prototype.getWidth = function() {
    return this.mScale[0];
};

Transform.prototype.getHeight = function() {
    return this.mScale[1];
};

Transform.prototype.setSize = function(width, height) {
    glMatrix.vec2.set(this.mScale, width, height);
};

Transform.prototype.setHeight = function(height) {
    glMatrix.vec2.set(this.mScale, this.getWidth(), height);
};

Transform.prototype.setWidth = function(width) {
    glMatrix.vec2.set(this.mScale, width, this.getHeight());
};

Transform.prototype.incSize = function(deltaSize) {
    this.setSize(this.getWidth() + deltaSize, this.getHeight() + deltaSize);
};

Transform.prototype.getRotation = function() {
    return this.mRotationRad;
};

Transform.prototype.setRotationRads = function(rad) {
    this.mRotationRad = rad;
    while (this.mRotationRad > (2*Math.PI)) {
        this.mRotationRad -= (2*Math.PI);
    }
};

Transform.prototype.setRotationDegrees = function(degrees) {
    this.setRotationRads(degrees * Math.PI/180.0);
};

Transform.prototype.incRotationInRads = function(deltaRotation) {
    this.setRotationRads(this.getRotation() + deltaRotation);
};

Transform.prototype.incRotationInDegrees = function(deltaRotation) {
    this.incRotationInRads(deltaRotation * Math.PI/180.0);
};

Transform.prototype.isHFlipped = function () {
    return this.mHFlipMultipier === -1;
};
Transform.prototype.setHorizontalFlip = function(shouldFlip) {
    this.mHFlipMultiplier = shouldFlip ? -1 : 1;
};

Transform.prototype.isVFlipped = function () {
    return this.mVFlipMultiplier === -1;
};
Transform.prototype.setVerticalFlip = function(shouldFlip) {
    this.mVFlipMultiplier = shouldFlip ? -1 : 1;
};

Transform.prototype.getXForm = function() {
    var xform = glMatrix.mat4.create();
    glMatrix.mat4.translate(xform, xform, this.getPosition3D());
    glMatrix.mat4.rotateZ(xform, xform, this.mRotationRad);
    var width = this.getWidth() * this.mHFlipMultiplier;
    var height = this.getHeight() * this.mVFlipMultiplier;
    glMatrix.mat4.scale(xform, xform, glMatrix.vec3.fromValues(width, height, 1.0));
    return xform;
};

Transform.prototype.copy = function (other) {
    glMatrix.vec2.copy(this.mPosition, other.getPosition());
    glMatrix.vec2.copy(this.mScale, other.getScale());
    this.mZ = other.getZPos();
    this.mRotationRad = other.getRotation();
    this.mHFlipMultiplier = other.isHFlipped() ? -1 : 1;
    this.mVFlipMultiplier = other.isVFlipped() ? -1 : 1;
};
