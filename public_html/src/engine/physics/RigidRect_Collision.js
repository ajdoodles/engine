/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import RigidRect from "./RigidRect.js";
import RigidShape from "./RigidShape.js";

RigidRect.prototype.collidedRectRect = function (first, second) {
    return (first.left() < second.right()) && (first.right() > second.left())
            && (first.bottom() < second.top()) && (first.top() > second.bottom());
};

RigidRect.prototype.collided = function (otherShape) {
    switch(otherShape.rigidType()) {
        case RigidShape.eRigidType.eRect:
            return this.collidedRectRect(this, otherShape);
        case RigidShape.eRigidType.eCircle:
            return this.collidedRectCircle(this, otherShape);
        default:
            return false;
    }
};

RigidRect.prototype.containsPos = function (position) {
    var center = this.getPosition();
    var halfWidth = this.getWidth() / 2.0;
    var halfHeight = this.getHeight() / 2.0;
    
    var left = center[0] - halfWidth;
    var right = center[0] + halfWidth;
    var bottom = center[1] - halfHeight;
    var top = center[1] + halfHeight;
    
    return (left < position[0]) && (position[0] < right)
            && (bottom < position[1]) && (position[1] < top);
};