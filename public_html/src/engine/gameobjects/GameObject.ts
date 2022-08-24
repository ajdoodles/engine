/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec2, vec3 } from "gl-matrix";
import Camera from "../cameras/Camera";
import RigidShape from "../physics/RigidShape";
import Renderable from "../renderables/Renderable";
import TextureRenderable from "../renderables/TextureRenderable";
import BoundingBox from "../utils/BoundingBox";

export default class GameObject {
    renderComponent: Renderable;
    physicsComponent?: RigidShape;
    visible = true;
    currentFrontDir: vec2 = vec2.fromValues(0, 1);
    speed = 0;
    
    constructor(renderableObj:Renderable) {
        this.renderComponent = renderableObj;
    }

    getXform() {
        return this.renderComponent.getXform();
    };

    getRenderable() {
        return this.renderComponent;
    };

    getPhysicsComponent () {
        return this.physicsComponent;
    };
    setPhysicsComponent (p: RigidShape) {
        this.physicsComponent = p;
    };

    setVisible(visible: boolean) {
        this.visible = visible;
    };

    isVisible() {
        return this.visible;
    };

    setSpeed(speed: number) {
        this.speed = speed;
    };

    getSpeed() {
        return this.speed;
    };

    incSpeedBy(delta: number) {
        this.speed += delta;
    };

    getCurrentFrontDir() {
        return this.currentFrontDir;
    };

    setFrontDir(direction: vec2) {
        vec2.normalize(this.currentFrontDir, direction);
    };

    getBBox() {
        const xform = this.getXform();
        return new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    };

    rotateObjPointTo(target: vec2, rate: number) {
    //    var distToTarget = vec2.distance(target, this.getXform().getPosition());
        const targetVector = vec2.create();
        vec2.subtract(targetVector, target, this.getXform().getPosition());
        const distToTarget = vec2.length(targetVector);
        if (distToTarget < Number.MIN_VALUE) {
            return; //reached target
        }
        vec2.scale(targetVector, targetVector, 1 / distToTarget);
        
        let cosTheta = vec2.dot(targetVector, this.currentFrontDir);
        if (cosTheta > 0.999999){
            return; //facing the correct direction
        }
        
        if (cosTheta > 1) {
            cosTheta = 1;
        } else if (cosTheta < -1) {
            cosTheta = -1;
        }
        
        const targetVector3D = vec3.fromValues(targetVector[0], targetVector[1], 0);
        const frontDir3D = vec3.fromValues(this.currentFrontDir[0], this.currentFrontDir[1], 0);
        const cross = vec3.create();
        vec3.cross(cross, frontDir3D, targetVector3D);
        
        let rads = Math.acos(cosTheta);
        if (cross[2] < 0) {
            rads = -rads;
        }
        
        rads *= rate;
        vec2.rotate(this.currentFrontDir, this.currentFrontDir, vec2.fromValues(0, 0), rads);
        this.getXform().incRotationInRads(rads);
    };

    update () {
        const pos = this.getXform().getPosition();
        vec2.scaleAndAdd(pos, pos, this.currentFrontDir, this.speed);
    };

    draw (camera: Camera) {
        if (this.visible) {
            this.renderComponent.draw(camera);

            if (this.physicsComponent !== null) {
                this.physicsComponent?.draw(camera);
            }
        }
    };

    pixelTouches (otherObj: GameObject, wcTouchPos:vec2) {
        let pixelTouches = false;
        const otherRen = otherObj.getRenderable();
        const thisRen = this.getRenderable();
    
        if (otherRen instanceof TextureRenderable
                && thisRen instanceof TextureRenderable) {
            if (otherObj.getXform().getRotation() === 0
                    && this.getXform().getRotation() === 0) {
                if (this.getBBox().intersects(otherObj.getBBox())) {
                    thisRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
                }
            } else {
                const thisWidth = this.getXform().getWidth();
                const thisHeight = this.getXform().getHeight();
                const otherWidth = otherObj.getXform().getWidth();
                const otherHeight = otherObj.getXform().getHeight();
                
                const thisRadius = Math.sqrt(Math.pow(thisWidth* 0.5, 2) + Math.pow(thisHeight* 0.5, 2));
                const otherRadius = Math.sqrt(Math.pow(otherWidth* 0.5, 2) + Math.pow(otherHeight* 0.5, 2));
                
                const delta = vec2.create();
                vec2.sub(delta, this.getXform().getPosition(), otherObj.getXform().getPosition());
                if (vec2.length(delta) < (thisRadius + otherRadius)) {
                    thisRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
                }
            }
        }
    
        return pixelTouches;
    };
}