/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import { vec3 } from "gl-matrix";
import Light from "../lights/Light.js";
import Camera from "../cameras/Camera.js";

export default class ShaderLightReference {
    index: any;
    isLitRef: any;
    lightTypeRef: any;
    colorRef: any;
    positionRef: any;
    directionRef: any;
    intensityRef: any;
    nearRef: any;
    farRef: any;
    dropoffRef: any;
    cosInnerRef: any;
    cosOuterRef: any;
    
    constructor(shader: WebGLShader, index: number) {
        //TODO MOVE THIS OUT INTO A CONSTANTS MODULE OR SOMETHING
        //THIS VARIABLE WAS COPIED FROM ANOTHER VARIABLE THAT WAS
        //COPIED FROM A GLSL VARIABLE
        // SEE LightShader.js
        const kGLSLuLightArraySize = 4;
        if (index < 0 || index >= kGLSLuLightArraySize) {
            throw "Light index " + index + " out of bounds.";
        }

        this.index = index;
        const indexString = "uLights[" + index + "].";
        
        const gl = core.getGL();
        this.isLitRef = gl.getUniformLocation(shader, indexString + "IsLit");
        this.lightTypeRef = gl.getUniformLocation(shader, indexString + "LightType");
        this.colorRef = gl.getUniformLocation(shader, indexString + "Color");
        this.positionRef = gl.getUniformLocation(shader, indexString + "Position");
        this.directionRef = gl.getUniformLocation(shader, indexString + "Direction");
        this.intensityRef = gl.getUniformLocation(shader, indexString + "Intensity");
        this.nearRef = gl.getUniformLocation(shader, indexString + "Near");
        this.farRef = gl.getUniformLocation(shader, indexString + "Far");
        this.dropoffRef = gl.getUniformLocation(shader, indexString + "Dropoff");
        this.cosInnerRef = gl.getUniformLocation(shader, indexString + "CosInner");
        this.cosOuterRef = gl.getUniformLocation(shader, indexString + "CosOuter");
    }

    loadToShader  (camera: Camera, light: Light) {
        const gl = core.getGL();
        
        const isLit = light !== undefined && light !== null && light.isLit();
        gl.uniform1i(this.isLitRef, isLit);

        if (light.isLit()) {
            gl.uniform1i(this.lightTypeRef, light.getLightType());
            gl.uniform4fv(this.colorRef, light.getColor());
            gl.uniform3fv(this.positionRef, camera.convertWCPosToPx(light.getPosition()));
            gl.uniform1f(this.intensityRef, light.getIntensity());
            gl.uniform1f(this.nearRef, camera.convertWCSizeToPx(light.getNear()));
            gl.uniform1f(this.farRef, camera.convertWCSizeToPx(light.getFar()));
            
            let direction = vec3.fromValues(0.0, 0.0, 0.0);
            let dropoff = 0;
            let cosInner = 0.0;
            let cosOuter = 0.0;
            
            if (light.getLightType() !== Light.eLightType.ePointLight) {
                direction = camera.convertWCVecToPx(light.getDirection());
                if (light.getLightType() === Light.eLightType.eSpotLight) {
                    dropoff = light.getDropoff();
                    cosInner = Math.cos(light.getInnerRads() * 0.5);
                    cosOuter = Math.cos(light.getOuterRads() * 0.5);
                }
            }
            
            gl.uniform3fv(this.directionRef, direction);
            gl.uniform1f(this.dropoffRef, dropoff);
            gl.uniform1f(this.cosInnerRef, cosInner);
            gl.uniform1f(this.cosOuterRef, cosOuter);
        }
    };

    setLit  (isLit: any) {
        const gl = core.getGL();    
        gl.uniform1i(this.isLitRef, isLit);
    };
}