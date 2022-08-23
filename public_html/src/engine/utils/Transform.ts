/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec2, vec3, mat4 } from "gl-matrix";

export default class Transform {
    position = vec2.fromValues(0.0, 0.0);
    z = 0.0;
    scale = vec2.fromValues(1.0, 1.0);
    rotationRad = 0.0;
    hFlipMultiplier : 1 | -1 = 1;
    vFlipMultiplier : 1 | -1 = 1;

    getPosition() {
        return this.position;
    };
    getPosition3D() {
        return vec3.fromValues(this.getXPos(), this.getYPos(), this.getZPos());
    };
    getXPos() {
       return this.position[0]; 
    };
    getYPos() {
       return this.position[1]; 
    };
    getZPos () {
        return this.z;
    };
    setPosition(x:number, y:number) {
        vec2.set(this.position, x, y);
    };
    setXPos(x:number) {
        vec2.set(this.position, x, this.getYPos());
    };
    setYPos(y:number) {
        vec2.set(this.position, this.getXPos(), y);
    };
    setZPos (z:number) {
        this.z = z;
    };
    incXPos(deltaX:number) {
        this.setXPos(this.getXPos() + deltaX);
    };
    incYPos(deltaY:number) {
        this.setYPos(this.getYPos() + deltaY);
    };
    incZPos (deltaZ:number) {
        this.z += deltaZ;
    };
    offset (offset:vec3) {
        this.incXPos(offset[0]);
        this.incYPos(offset[1]);
        this.incZPos(offset[2]);
    };
    
    getScale() {
        return this.scale;
    };
    
    getWidth() {
        return this.scale[0];
    };
    
    getHeight() {
        return this.scale[1];
    };
    
    setSize(width:number, height:number) {
        vec2.set(this.scale, width, height);
    };
    
    setHeight(height:number) {
        vec2.set(this.scale, this.getWidth(), height);
    };
    
    setWidth(width:number) {
        vec2.set(this.scale, width, this.getHeight());
    };
    
    incSize(deltaSize:number) {
        this.setSize(this.getWidth() + deltaSize, this.getHeight() + deltaSize);
    };
    
    getRotation() {
        return this.rotationRad;
    };
    
    setRotationRads(rad:number) {
        this.rotationRad = rad;
        while (this.rotationRad > (2*Math.PI)) {
            this.rotationRad -= (2*Math.PI);
        }
    };
    
    setRotationDegrees(degrees:number) {
        this.setRotationRads(degrees * Math.PI/180.0);
    };
    
    incRotationInRads(deltaRotation:number) {
        this.setRotationRads(this.getRotation() + deltaRotation);
    };
    
    incRotationInDegrees(deltaRotation:number) {
        this.incRotationInRads(deltaRotation * Math.PI/180.0);
    };
    
    isHFlipped () {
        return this.hFlipMultiplier === -1;
    };
    setHorizontalFlip(shouldFlip:boolean) {
        this.hFlipMultiplier = shouldFlip ? -1 : 1;
    };
    
    isVFlipped () {
        return this.vFlipMultiplier === -1;
    };
    setVerticalFlip(shouldFlip:boolean) {
        this.vFlipMultiplier = shouldFlip ? -1 : 1;
    };
    
    getXForm() {
        const xform = mat4.create();
        mat4.translate(xform, xform, this.getPosition3D());
        mat4.rotateZ(xform, xform, this.rotationRad);
        const width = this.getWidth() * this.hFlipMultiplier;
        const height = this.getHeight() * this.vFlipMultiplier;
        mat4.scale(xform, xform, vec3.fromValues(width, height, 1.0));
        return xform;
    };
    
    copy (other:Transform) {
        vec2.copy(this.position, other.getPosition());
        vec2.copy(this.scale, other.getScale());
        this.z = other.getZPos();
        this.rotationRad = other.getRotation();
        this.hFlipMultiplier = other.isHFlipped() ? -1 : 1;
        this.vFlipMultiplier = other.isVFlipped() ? -1 : 1;
    };
    

};