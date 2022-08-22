/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import RigidCircle from "./RigidCircle.js";
import { vec2 } from "../../gl-matrix/esm/index.js";
import RigidShape from "./RigidShape.js";

RigidCircle.prototype.collidedCircleCircle = function (c1, c2) {
    var distSquared = vec2.squaredDistance(c1.getPosition(), c2.getPosition());
    var maxDist = c1.getRadius() + c2.getRadius();
    return distSquared < (maxDist * maxDist);
};

RigidCircle.prototype.collided = function (otherShape) {
    switch (otherShape.rigidType()) {
        case RigidShape.eRigidType.eCircle:
            return this.collidedCircleCircle(this, otherShape);
        case RigidShape.eRigidType.eRect:
            return this.collidedCircleRect(this, otherShape);
        default:
            return false;
    }
};

RigidCircle.prototype.containsPos = function (position) {
    var dist = vec2.dist(this.getPosition(), position);
    return dist < this.getRadius();
};