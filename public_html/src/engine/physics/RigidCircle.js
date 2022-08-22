/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import RigidShape from "./RigidShape.js";
import { vec2 } from "gl-matrix";
import LineRenderable from "../renderables/LineRenderable.js";

export default function RigidCircle(xform, radius) {
    RigidShape.call(this, xform);
    
    this.kNumSides = 16;
    if (this.kNumSides < 2) {
        throw "Need at least three points to draw a circle";
    }
    this.kAngularDelta = (2 * Math.PI) / this.kNumSides;
    
    this.mRadius = radius;
    this.mSides = new LineRenderable();
};
core.inheritPrototype(RigidShape, RigidCircle);

RigidCircle.prototype.getRadius = function () {
    return this.mRadius;
};
RigidCircle.prototype.setRadius = function (radius) {
    this.mRadius = radius;
};

RigidCircle.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.mSides.setColor(color);
};

RigidCircle.prototype.rigidType = function () {
    return RigidShape.eRigidType.eCircle;
};

RigidCircle.prototype.draw = function (camera) {
    RigidShape.prototype.draw.call(this, camera);

    if (!this.isDrawingBounds()) {
        return;
    }

    this.mSides.getXform().setZPos(this.mXform.getZPos());

    var pos = this.getPosition();
    var drawPoint = vec2.fromValues(pos[0] + this.mRadius, pos[1]);
    this.mSides.setStartVertex(drawPoint[0], drawPoint[1]);
    for (var i = 1; i <= this.kNumSides; i++) {
        vec2.rotate(drawPoint, drawPoint, pos, this.kAngularDelta);

        if (i % 2 === 0) {
            this.mSides.setStartVertex(drawPoint[0], drawPoint[1]);
        } else {
            this.mSides.setEndVertex(drawPoint[0], drawPoint[1]);
        }
        
        this.mSides.draw(camera);        
    }
};
