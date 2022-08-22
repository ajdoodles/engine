/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";

BoundingBox.eBoundCollideStatus = Object.freeze({
    eOutside: 0,
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside: 16,
});

export default function BoundingBox(centerPos, w, h) {
    this.mLL = vec2.fromValues(0, 0);
    this.setBounds(centerPos, w, h);
}

BoundingBox.prototype.setBounds = function(centerPos, w, h) {
    this.mWidth = w;
    this.mHeight = h;
    this.mLL[0] = centerPos[0] - (w / 2);
    this.mLL[1] = centerPos[1] - (h / 2);
};

BoundingBox.prototype.minX = function() {
    return this.mLL[0];
};
BoundingBox.prototype.left = BoundingBox.prototype.minX;

BoundingBox.prototype.maxX = function() {
    return this.mLL[0] + this.mWidth;
};
BoundingBox.prototype.right = BoundingBox.prototype.maxX;

BoundingBox.prototype.minY = function() {
    return this.mLL[1];
};
BoundingBox.prototype.bottom = BoundingBox.prototype.minY;

BoundingBox.prototype.maxY = function() {
    return this.mLL[1] + this.mHeight;
};
BoundingBox.prototype.top = BoundingBox.prototype.maxY;

BoundingBox.prototype.containsPoint = function (x, y) {
    return (x < this.maxX()) && (x > this.minX())
            && (y < this.maxY()) && (y > this.minY());
};

BoundingBox.prototype.intersects = function (otherBounds) {
    return (this.top() > otherBounds.bottom())
            && (this.bottom() < otherBounds.top())
            && (this.left() < otherBounds.right())
            && (this.right() > otherBounds.left());
};

BoundingBox.prototype.boundCollideStatus = function (otherBounds) {
    var status = BoundingBox.eBoundCollideStatus.eOutside;
    if (this.intersects(otherBounds)) {
        if (this.right() < otherBounds.right()) {
            status |= BoundingBox.eBoundCollideStatus.eCollideRight;
        }
        if (this.left() > otherBounds.left()) {
            status |= BoundingBox.eBoundCollideStatus.eCollideLeft;
        }
        if (this.top() < otherBounds.top()) {
            status |= BoundingBox.eBoundCollideStatus.eCollideTop;
        }
        if (this.bottom() > otherBounds.bottom()) {
            status |= BoundingBox.eBoundCollideStatus.eCollideBottom;
        }
        if (status === BoundingBox.eBoundCollideStatus.eOutside) {
            status = BoundingBox.eBoundCollideStatus.eInside;
        }
    }
    return status;
}