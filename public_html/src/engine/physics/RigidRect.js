/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function RigidRect(xform, width, height) {
    RigidShape.call(this, xform);
    this.mSides = new LineRenderable();
    
    this.mWidth = width;
    this.mHeight = height;
};
gEngine.Core.inheritPrototype(RigidShape, RigidRect);

RigidRect.prototype.getWidth = function () {
    return this.mWidth;
};
RigidRect.prototype.setWidth = function (width) {
    this.mWidth = width;
};

RigidRect.prototype.getHeight = function () {
    return this.mHeight;
};
RigidRect.prototype.setHeight = function (height) {
    this.mHeight = height;
};

RigidRect.prototype.left = function () {
    return this.mXform.getXPos() - (this.mWidth / 2);
};
RigidRect.prototype.right = function () {
    return this.mXform.getXPos() + (this.mWidth / 2);
};
RigidRect.prototype.top = function () {
    return this.mXform.getYPos() + (this.mHeight / 2);
};
RigidRect.prototype.bottom = function () {
    return this.mXform.getYPos() - (this.mHeight / 2);
};

RigidRect.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.mSides.setColor(color);
};

RigidRect.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRect;
};

RigidRect.prototype.draw = function (camera) {
    RigidShape.prototype.draw.call(this, camera);

    if (!this.isDrawingBounds()) {
        return;
    }

    var x = this.getPosition()[0];
    var y = this.getPosition()[1];
    var halfWidth = this.mWidth/2;
    var halfHeight = this.mHeight/2;

    this.mSides.getXform().setZPos(this.mXform.getZPos());
    
    // top edge
    this.mSides.setStartVertex(x-halfWidth, y+halfHeight);
    this.mSides.setEndVertex(x+halfWidth, y+halfHeight);
    this.mSides.draw(camera);
    
    // right edge
    this.mSides.setStartVertex(x+halfWidth, y-halfHeight);
    this.mSides.draw(camera);
    
    //bottom edge
    this.mSides.setEndVertex(x-halfWidth, y-halfHeight);
    this.mSides.draw(camera);
    
    // left edge
    this.mSides.setStartVertex(x-halfWidth, y+halfHeight);
    this.mSides.draw(camera);
};

