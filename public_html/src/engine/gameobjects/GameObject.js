/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameObject(renderableObj) {
    this.mRenderComponent = renderableObj;
    this.mVisible = true;
    this.mCurrentFrontDir = vec2.fromValues(0, 1);
    this.mSpeed = 0;
}

GameObject.prototype.getXform = function() {
    return this.mRenderComponent.getXform();
};

GameObject.prototype.getRenderable = function() {
    return this.mRenderComponent;
};

GameObject.prototype.setVisible = function(visible) {
    this.mVisible = visible;
};

GameObject.prototype.isVisible = function() {
    return this.mVisible;
};

GameObject.prototype.setSpeed = function(speed) {
    this.mSpeed = speed;
};

GameObject.prototype.getSpeed = function() {
    return this.mSpeed;
};

GameObject.prototype.incSpeedBy = function(delta) {
    this.mSpeed += delta;
};

GameObject.prototype.getCurrentFrontDir = function() {
    return this.mCurrentFrontDir;
};

GameObject.prototype.setFrontDir = function(direction) {
    vec2.normalize(this.mCurrentFrontDir, direction);
};

GameObject.prototype.getBBox = function() {
    var xform = this.getXform();
    return new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
};

GameObject.prototype.rotateObjPointTo = function(target, rate) {
//    var distToTarget = vec2.distance(target, this.getXform().getPosition());
    var targetVector = [];
    vec2.subtract(targetVector, target, this.getXform().getPosition());
    var distToTarget = vec2.length(targetVector);
    if (distToTarget < Number.MIN_VALUE) {
        return; //reached target
    }
    vec2.scale(targetVector, targetVector, 1 / distToTarget);
    
    var cosTheta = vec2.dot(targetVector, this.mCurrentFrontDir);
    if (cosTheta > 0.999999){
        return; //facing the correct direction
    }
    
    if (cosTheta > 1) {
        cosTheta = 1;
    } else if (cosTheta < -1) {
        cosTheta = -1;
    }
    
    var targetVector3D = vec3.fromValues(targetVector[0], targetVector[1], 0);
    var frontDir3D = vec3.fromValues(this.mCurrentFrontDir[0], this.mCurrentFrontDir[1], 0);
    var cross = [];
    vec3.cross(cross, frontDir3D, targetVector3D);
    
    var rads = Math.acos(cosTheta);
    if (cross[2] < 0) {
        rads = -rads;
    }
    
    rads *= rate;
    vec2.rotate(this.mCurrentFrontDir, this.mCurrentFrontDir, vec2.fromValues(0, 0), rads);
    this.getXform().incRotationInRads(rads);
};

GameObject.prototype.update = function () {
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.mCurrentFrontDir, this.mSpeed);
};

GameObject.prototype.draw = function (camera) {
    if (this.mVisible) {
        this.mRenderComponent.draw(camera);
    }
};