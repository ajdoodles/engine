/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

RigidShape.prototype.collidedRectCircle = function (rect, circle) {
    var rectPos = rect.getPosition();
    var circlePos = circle.getPosition();
    
    if (rect.containsPos(circlePos) || circle.containsPos(rectPos)) {
        return true;
    }

    var clampedX =
            MathUtils.clamp(circlePos[0], rect.left(), rect.right());
    var clampedY =
            MathUtils.clamp(circlePos[1], rect.bottom(), rect.top());
    
    var closestRectPos = vec2.fromValues(clampedX, clampedY);
    var squaredDistance = vec2.squaredDistance(circlePos, closestRectPos);
    
    return squaredDistance < (circle.getRadius() * circle.getRadius());
};

RigidShape.prototype.collidedCircleRect = function (circle, rect) {
    return this.collidedRectCircle(rect, circle);
};