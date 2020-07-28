/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

RigidShape.eRigidType = Object.freeze({
    eAbstract: 0,
    eCircle: 1,
    eRect: 2,
});

function RigidShape(xform) {
    this.kPadding = 0.25;
    
    this.mXform = xform;
    this.mPositionMark = new LineRenderable();
    this.mDrawBounds = false;
};

RigidShape.prototype.isDrawingBounds = function () {
    return this.mDrawBound;
};
RigidShape.prototype.setDrawBounds = function (shouldDraw) {
    this.mDrawBound = shouldDraw;
};

RigidShape.prototype.getXform = function () {
    return this.mXform;
};
RigidShape.prototype.setXform = function (xform) {
    this.mXform = xform;
};

RigidShape.prototype.getColor = function () {
    return this.mPositionMark.getColor();
};
RigidShape.prototype.setColor = function (color) {
    this.mPositionMark.setColor(color);
};

RigidShape.prototype.getPosition = function () {
    return this.mXform.getPosition();
};
RigidShape.prototype.setPosition = function (position) {
    this.mXform.setPosition(position);
};

RigidShape.prototype.rigidType = function () {
    return RigidShape.eRigidType.eAbstract;
};

RigidShape.prototype.draw = function (camera) {
    if (!this.isDrawingBounds()) {
        return;
    }
    
    var pos = this.getPosition();
    
    this.mPositionMark.setStartVertex(pos[0] - this.kPadding, pos[1] + this.kPadding);
    this.mPositionMark.setEndVertex(pos[0] + this.kPadding, pos[1] - this.kPadding);
    this.mPositionMark.draw(camera);
    
    this.mPositionMark.setStartVertex(pos[0] + this.kPadding, pos[1] + this.kPadding);
    this.mPositionMark.setEndVertex(pos[0] - this.kPadding, pos[1] - this.kPadding);
    this.mPositionMark.draw(camera);
};

RigidShape.prototype.update = function () {
    
};