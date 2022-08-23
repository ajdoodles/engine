/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec3, vec4 } from "gl-matrix";

export default class Light{

    static eLightType = {
        ePointLight: 0,
        eDirectionLight: 1,
        eSpotLight: 2,
    };

    origin: vec3;
    lit: boolean;
    lightType: number;
    color: vec4;
    position: vec3;
    direction: vec3;
    intensity: number;
    near: number;
    far: number;
    dropoff: number;
    innerRads: number;
    outerRads: number;

    constructor(
        lightType = Light.eLightType.ePointLight,
        color = vec4.fromValues(1.0, 1.0, 1.0, 1.0), 
        position = vec3.fromValues(35, 50, 5),
        direction = vec3.fromValues(0.0, 0.0, -1.0),
        intensity = 1.0,
        near = 15,
        far = 30,
        dropoff = 1,
        innerRads = 5 * (Math.PI / 180.0),
        outerRads = 45 * (Math.PI / 180.0),
    ) {
        this.origin = vec3.fromValues(0.0, 0.0, 0.0);
                
        this.lit = true;
        this.lightType = lightType;
        this.color = vec4.clone(color);
        this.position = vec3.clone(position);
        this.direction = vec3.clone(direction);
        this.intensity = intensity;
        this.near = near;
        this.far = far;
        this.dropoff = dropoff;
        this.innerRads = innerRads;
        this.outerRads = outerRads;
    };

    isLit() {
        return this.lit;
    };
    setLit(lit: boolean) {
        return this.lit = lit;
    };

    getLightType() {
        return this.lightType;
    };
    setLightType(lightType: number) {
        this.lightType = lightType;
    };
    getLightTypeString () {
        switch (this.getLightType()) {
            case (Light.eLightType.ePointLight):
                return "point";
            case (Light.eLightType.eDirectionLight):
                return "dir";
            case (Light.eLightType.eSpotLight):
                return "spot";
            default:
                return "unknown";
        }
    };

    getColor() {
        return this.color;
    };
    setColor(color: vec4) {
        vec4.copy(this.color, color);
    };

    getPosition() {
        return this.position;
    };
    setPosition(position: vec3) {
        vec3.copy(this.position, position);
    };
    incXPos (delta: number) {
        vec3.set(this.position, this.position[0] + delta, this.position[1], this.position[2]);
    };
    incYPos (delta: number) {
        vec3.set(this.position, this.position[0], this.position[1] + delta, this.position[2]);
    };
    incZPos (delta: number) {
        vec3.set(this.position, this.position[0], this.position[1], this.position[2] + delta);
    };

    getDirection () {
        return this.direction;
    };
    getReverseDirection () {
        const out = vec3.create();
        vec3.scale(out, this.direction, -1);
        return out;
    };
    setDirection (direction: vec3) {
        vec3.copy(this.direction, direction);
    };
    rotateXDirRads (delta: number) {
        vec3.rotateY(this.direction, this.direction, this.origin, delta);
    };
    rotateYDirRads (delta: number) {
        vec3.rotateX(this.direction, this.direction, this.origin, delta);
    };
    rotateXDirDegrees (deltaDegrees: number) {
        this.rotateXDirRads(deltaDegrees * Math.PI/180.0);
    };
    rotateYDirDegrees (deltaDegrees: number) {
        this.rotateYDirRads(deltaDegrees * Math.PI/180.00);
    };

    getIntensity () {
        return this.intensity;
    };
    setIntensity (intensity: number) {
        this.intensity = intensity;
    };
    incIntensity (delta: number) {
        this.intensity += delta;
    };

    getNear () {
        return this.near;
    };
    setNear (near: number) {
        this.near = near;
    };
    incNear (delta: number) {
        this.near += delta;
    };

    getFar () {
        return this.far;
    };
    setFar (far: number) {
        this.far = far;
    };
    incFar (delta: number) {
        this.far += delta;
    };

    getDropoff () {
        return this.dropoff;
    };
    setDropoff (dropoff: number) {
        this.dropoff = dropoff;
    };

    getInnerRads () {
        return this.innerRads;
    };
    getInnerDegrees() {
        return (this.innerRads * (180.0/Math.PI)).toFixed(1);
    }
    setInnerRads (innerRads: number) {
        this.innerRads = innerRads;
    };
    incInnerRads (delta: number) {
        this.innerRads += delta;
    };
    incInnerDegrees (deltaDegrees: number) {
        this.incInnerRads(deltaDegrees * Math.PI/180.0);
    };

    getOuterRads () {
        return this.outerRads;
    };
    getOuterDegrees () {
        return (this.outerRads * (180.0/Math.PI)).toFixed(1);
    };
    setOuterRads (outerRads: number) {
        this.outerRads = outerRads;
    };
    incOuterRads (delta: number) {
        this.outerRads += delta;
    };
    incOuterDegrees (deltaDegrees: number) {
        this.incOuterRads(deltaDegrees * Math.PI/180.0);
    };

    incInner (delta: number) {
        if (this.getLightType() === Light.eLightType.ePointLight) {
            this.incNear(delta);
        } else if (this.getLightType() === Light.eLightType.eSpotLight) {
            this.incInnerRads(delta);
        }
    };
    incOuter (delta: number) {
        if (this.getLightType() === Light.eLightType.ePointLight) {
            this.incFar(delta);
        } else if (this.getLightType() === Light.eLightType.eSpotLight) {
            this.incOuterRads(delta);
        }
    };

}