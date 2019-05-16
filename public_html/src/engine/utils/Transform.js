/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Transform() {
    this.mPosition = vec2.fromValues(0, 0);
    this.mScale = vec2.fromValues(1, 1);
    this.mRotationRad = 0;
    this.mHFlipMultiplier = 1; // -1 or 1
    this.mVFlipMultiplier = 1; // -1 or 1
}

Transform.prototype.getPosition = function() {
    return this.mPosition;
}

Transform.prototype.getXPos = function() {
   return this.mPosition[0]; 
}

Transform.prototype.getYPos = function() {
   return this.mPosition[1]; 
}

Transform.prototype.setPosition = function(x, y) {
    vec2.set(this.mPosition, x, y);
}

Transform.prototype.setXPos = function(x) {
    vec2.set(this.mPosition, x, this.getYPos());
}

Transform.prototype.setYPos = function(y) {
    vec2.set(this.mPosition, this.getXPos(), y);
}

Transform.prototype.incXPos = function(deltaX) {
    this.setXPos(this.getXPos() + deltaX);
};

Transform.prototype.incYPos = function(deltaY) {
    this.setYPos(this.getYPos() + deltaY);
};

Transform.prototype.getScale = function() {
    return this.mScale;
}

Transform.prototype.getWidth = function() {
    return this.mScale[0];
}

Transform.prototype.getHeight = function() {
    return this.mScale[1];
}

Transform.prototype.setSize = function(width, height) {
    vec2.set(this.mScale, width, height);
}

Transform.prototype.setHeight = function(height) {
    vec2.set(this.mScale, this.getWidth(), height);
}

Transform.prototype.setWidth = function(width) {
    vec2.set(this.mScale, width, this.getHeight());
}

Transform.prototype.incSize = function(deltaSize) {
    this.setSize(this.getWidth() + deltaSize, this.getHeight() + deltaSize);
};

Transform.prototype.getRotation = function() {
    return this.mRotationRad;
}

Transform.prototype.setRotationRads = function(rad) {
    this.mRotationRad = rad;
    while (this.mRotationRad > (2*Math.PI)) {
        this.mRotationRad -= (2*Math.PI);
    }
}

Transform.prototype.setRotationDegrees = function(degrees) {
    this.setRotationRads(degrees * Math.PI/180.0);
}

Transform.prototype.incRotationInRads = function(deltaRotation) {
    this.setRotationRads(this.getRotation() + deltaRotation);
};

Transform.prototype.incRotationInDegrees = function(deltaRotation) {
    this.incRotationInRads(deltaRotation * Math.PI/180.0);
};

Transform.prototype.setHorizontalFlip = function(shouldFlip) {
    this.mHFlipMultiplier = shouldFlip ? -1 : 1;
};

Transform.prototype.setVerticalFlip = function(shouldFlip) {
    this.mVFlipMultiplier = shouldFlip ? -1 : 1;
};

Transform.prototype.getXForm = function() {
    var xform = mat4.create();
    mat4.translate(xform, xform, vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));
    mat4.rotateZ(xform, xform, this.mRotationRad);
    var width = this.getWidth() * this.mHFlipMultiplier;
    var height = this.getHeight() * this.mVFlipMultiplier;
    mat4.scale(xform, xform, vec3.fromValues(width, height, 1.0));
    return xform;
}