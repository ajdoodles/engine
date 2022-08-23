/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import RigidShape from "./RigidShape.js";
import LineRenderable from "../renderables/LineRenderable.js";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";
import RigidCircle from "./RigidCircle.js";
import { vec2 } from "gl-matrix";

export default class RigidRect extends RigidShape {
    sides: LineRenderable;
    width: number;
    height: number;
    
    constructor(xform:Transform, width:number, height:number) {
        super(xform);
        this.sides = new LineRenderable(0,0,0,0);
        
        this.width = width;
        this.height = height;
    };

    getWidth () {
        return this.width;
    };
    setWidth (width: number) {
        this.width = width;
    };

    getHeight () {
        return this.height;
    };
    setHeight (height: number) {
        this.height = height;
    };

    left () {
        return this.xform.getXPos() - (this.width / 2);
    };
    right () {
        return this.xform.getXPos() + (this.width / 2);
    };
    top () {
        return this.xform.getYPos() + (this.height / 2);
    };
    bottom () {
        return this.xform.getYPos() - (this.height / 2);
    };

    setColor (color: color) {
        super.setColor(color);
        this.sides.setColor(color);
    };

    rigidType () {
        return RigidShape.eRigidType.eRect;
    };

    draw (camera: Camera) {
        super.draw(camera);

        if (!this.isDrawingBounds()) {
            return;
        }

        const x = this.getPosition()[0];
        const y = this.getPosition()[1];
        const halfWidth = this.width/2;
        const halfHeight = this.height/2;

        this.sides.getXform().setZPos(this.xform.getZPos());
        
        // top edge
        this.sides.setStartVertex(x-halfWidth, y+halfHeight);
        this.sides.setEndVertex(x+halfWidth, y+halfHeight);
        this.sides.draw(camera);
        
        // right edge
        this.sides.setStartVertex(x+halfWidth, y-halfHeight);
        this.sides.draw(camera);
        
        //bottom edge
        this.sides.setEndVertex(x-halfWidth, y-halfHeight);
        this.sides.draw(camera);
        
        // left edge
        this.sides.setStartVertex(x-halfWidth, y+halfHeight);
        this.sides.draw(camera);
    };


collidedRectRect (first: RigidRect, second: RigidRect) {
    return (first.left() < second.right()) && (first.right() > second.left())
            && (first.bottom() < second.top()) && (first.top() > second.bottom());
};

collided (otherShape: RigidShape) {
    switch(otherShape.rigidType()) {
        case RigidShape.eRigidType.eRect:
            return this.collidedRectRect(this, otherShape as RigidRect);
        case RigidShape.eRigidType.eCircle:
            return this.collidedRectCircle(this, otherShape as RigidCircle);
        default:
            return false;
    }
};

containsPos (position: vec2) {
    const center = this.getPosition();
    const halfWidth = this.getWidth() / 2.0;
    const halfHeight = this.getHeight() / 2.0;
    
    const left = center[0] - halfWidth;
    const right = center[0] + halfWidth;
    const bottom = center[1] - halfHeight;
    const top = center[1] + halfHeight;
    
    return (left < position[0]) && (position[0] < right)
            && (bottom < position[1]) && (position[1] < top);
};
}