/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec3, vec4 } from "gl-matrix";

Light.prototype.eLightType = {
    ePointLight: 0,
    eDirectionLight: 1,
    eSpotLight: 2,
};

function Light(
        lightType = Light.prototype.eLightType.ePointLight,
        color = vec4.fromValues(1.0, 1.0, 1.0, 1.0), 
        position = vec3.fromValues(35, 50, 5),
        direction = vec3.fromValues(0.0, 0.0, -1.0),
        intensity = 1.0,
        near = 15,
        far = 30,
        dropoff = 1,
        innerRads = 5 * (Math.PI / 180.0),
        outerRads = 45 * (Math.PI / 180.0),
        ) {
    this.kOrigin = vec3.fromValues(0.0, 0.0, 0.0);
            
    this.mLit = true;
    this.mLightType = lightType;
    this.mColor = vec4.clone(color);
    this.mPosition = vec3.clone(position);
    this.mDirection = vec3.clone(direction);
    this.mIntensity = intensity;
    this.mNear = near;
    this.mFar = far;
    this.mDropoff = dropoff;
    this.mInnerRads = innerRads;
    this.mOuterRads = outerRads;
};

Light.prototype.isLit = function() {
    return this.mLit;
};
Light.prototype.setLit = function(lit) {
    return this.mLit = lit;
};

Light.prototype.getLightType = function() {
    return this.mLightType;
};
Light.prototype.setLightType = function(lightType) {
    this.mLightType = lightType;
};
Light.prototype.getLightTypeString = function () {
    switch (this.getLightType()) {
        case (Light.prototype.eLightType.ePointLight):
            return "point";
        case (Light.prototype.eLightType.eDirectionLight):
            return "dir";
        case (Light.prototype.eLightType.eSpotLight):
            return "spot";
        default:
            return "unknown";
    }
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

Light.prototype.getDirection = function () {
    return this.mDirection;
};
Light.prototype.getReverseDirection = function () {
    var out = vec3.create();
    vec3.scale(out, this.mDirection, -1);
    return out;
};
Light.prototype.setDirection = function (direction) {
    vec3.copy(this.mDirection, direction);
};
Light.prototype.rotateXDirRads = function (delta) {
    vec3.rotateY(this.mDirection, this.mDirection, this.kOrigin, delta);
};
Light.prototype.rotateYDirRads = function (delta) {
    vec3.rotateX(this.mDirection, this.mDirection, this.kOrigin, delta);
};
Light.prototype.rotateXDirDegrees = function (deltaDegrees) {
    this.rotateXDirRads(deltaDegrees * Math.PI/180.0);
};
Light.prototype.rotateYDirDegrees = function (deltaDegrees) {
    this.rotateYDirRads(deltaDegrees * Math.PI/180.00);
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

Light.prototype.getDropoff = function () {
    return this.mDropoff;
};
Light.prototype.setDropoff = function (dropoff) {
    this.mDropoff = dropoff;
};

Light.prototype.getInnerRads = function () {
    return this.mInnerRads;
};
Light.prototype.getInnerDegrees = function() {
    return (this.mInnerRads * (180.0/Math.PI)).toFixed(1);
}
Light.prototype.setInnerRads = function (innerRads) {
    this.mInnerRads = innerRads;
};
Light.prototype.incInnerRads = function (delta) {
    this.mInnerRads += delta;
};
Light.prototype.incInnerDegrees = function (deltaDegrees) {
    this.incInnerRads(deltaDegrees * Math.PI/180.0);
};

Light.prototype.getOuterRads = function () {
    return this.mOuterRads;
};
Light.prototype.getOuterDegrees = function () {
    return (this.mOuterRads * (180.0/Math.PI)).toFixed(1);
};
Light.prototype.setOuterRads = function (outerRads) {
    this.mOuterRads = outerRads;
};
Light.prototype.incOuterRads = function (delta) {
    this.mOuterRads += delta;
};
Light.prototype.incOuterDegrees = function (deltaDegrees) {
    this.incOuterRads(deltaDegrees * Math.PI/180.0);
};

Light.prototype.incInner = function (delta) {
    if (this.getLightType() === Light.prototype.eLightType.ePointLight) {
        this.incNear(delta);
    } else if (this.getLightType() === Light.prototype.eLightType.eSpotLight) {
        this.incInnerRads(delta);
    }
};
Light.prototype.incOuter = function (delta) {
    if (this.getLightType() === Light.prototype.eLightType.ePointLight) {
        this.incFar(delta);
    } else if (this.getLightType() === Light.prototype.eLightType.eSpotLight) {
        this.incOuterRads(delta);
    }
};