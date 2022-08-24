/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";
import LineRenderable from "../../engine/renderables/LineRenderable.js";
import Camera from "../cameras/Camera.js";
import Transform from "../utils/Transform.js";
import RigidRect from "./RigidRect.js";
import RigidCircle from "./RigidCircle.js";
import MathUtils from "../utils/MathUtils.js";

export default abstract class RigidShape{

    static readonly eRigidType = Object.freeze({
        eAbstract: 0,
        eCircle: 1,
        eRect: 2,
    });

    padding: number;
    xform: Transform;
    positionMark: LineRenderable;
    drawBounds: boolean;
    
    constructor(xform :Transform) {
        this.padding = 0.25;
        
        this.xform = xform;
        this.positionMark = new LineRenderable(0 ,0 ,0 ,0);
        this.drawBounds = false;
    };

    isDrawingBounds() {
        return this.drawBounds;
    };
    setDrawBounds(shouldDraw:boolean) {
        this.drawBounds = shouldDraw;
    };

    getXform() {
        return this.xform;
    };
    setXform(xform: Transform) {
        this.xform = xform;
    };

    getColor() {
        return this.positionMark.getColor();
    };
    setColor(color: color) {
        this.positionMark.setColor(color);
    };

    getPosition() {
        return this.xform.getPosition();
    };
    setPosition(position: vec2) {
        this.xform.setPosition(position[0], position[1]);
    };

    rigidType() {
        return RigidShape.eRigidType.eAbstract;
    };

    draw(camera: Camera) {
        if (!this.isDrawingBounds()) {
            return;
        }

        const pos = this.getPosition();

        this.positionMark.getXform().setZPos(this.xform.getZPos());
        
        this.positionMark.setStartVertex(pos[0] - this.padding, pos[1] + this.padding);
        this.positionMark.setEndVertex(pos[0] + this.padding, pos[1] - this.padding);
        this.positionMark.draw(camera);
        
        this.positionMark.setStartVertex(pos[0] + this.padding, pos[1] + this.padding);
        this.positionMark.setEndVertex(pos[0] - this.padding, pos[1] - this.padding);
        this.positionMark.draw(camera);
    };

    abstract collided (otherObj: RigidShape) : boolean;

    collidedRectCircle (rect:RigidRect, circle:RigidCircle) {
        const rectPos = rect.getPosition();
        const circlePos = circle.getPosition();
        
        if (rect.containsPos(circlePos) || circle.containsPos(rectPos)) {
            return true;
        }
    
        const clampedX =
                MathUtils.clamp(circlePos[0], rect.left(), rect.right());
        const clampedY =
                MathUtils.clamp(circlePos[1], rect.bottom(), rect.top());
        
        const closestRectPos = vec2.fromValues(clampedX, clampedY);
        const squaredDistance = vec2.squaredDistance(circlePos, closestRectPos);
        
        return squaredDistance < (circle.getRadius() * circle.getRadius());
    };
    
    collidedCircleRect (circle: RigidCircle, rect: RigidRect) {
        return this.collidedRectCircle(rect, circle);
    };
}