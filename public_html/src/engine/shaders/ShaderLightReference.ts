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
  index: WebGLUniformLocation;
  isLitRef: WebGLUniformLocation;
  lightTypeRef: WebGLUniformLocation;
  colorRef: WebGLUniformLocation;
  positionRef: WebGLUniformLocation;
  directionRef: WebGLUniformLocation;
  intensityRef: WebGLUniformLocation;
  nearRef: WebGLUniformLocation;
  farRef: WebGLUniformLocation;
  dropoffRef: WebGLUniformLocation;
  cosInnerRef: WebGLUniformLocation;
  cosOuterRef: WebGLUniformLocation;

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
    this.isLitRef = gl.getUniformLocation(
      shader,
      indexString + "IsLit"
    ) as WebGLUniformLocation;
    this.lightTypeRef = gl.getUniformLocation(
      shader,
      indexString + "LightType"
    ) as WebGLUniformLocation;
    this.colorRef = gl.getUniformLocation(
      shader,
      indexString + "Color"
    ) as WebGLUniformLocation;
    this.positionRef = gl.getUniformLocation(
      shader,
      indexString + "Position"
    ) as WebGLUniformLocation;
    this.directionRef = gl.getUniformLocation(
      shader,
      indexString + "Direction"
    ) as WebGLUniformLocation;
    this.intensityRef = gl.getUniformLocation(
      shader,
      indexString + "Intensity"
    ) as WebGLUniformLocation;
    this.nearRef = gl.getUniformLocation(
      shader,
      indexString + "Near"
    ) as WebGLUniformLocation;
    this.farRef = gl.getUniformLocation(
      shader,
      indexString + "Far"
    ) as WebGLUniformLocation;
    this.dropoffRef = gl.getUniformLocation(
      shader,
      indexString + "Dropoff"
    ) as WebGLUniformLocation;
    this.cosInnerRef = gl.getUniformLocation(
      shader,
      indexString + "CosInner"
    ) as WebGLUniformLocation;
    this.cosOuterRef = gl.getUniformLocation(
      shader,
      indexString + "CosOuter"
    ) as WebGLUniformLocation;
  }

  loadToShader(camera: Camera, light: Light) {
    const gl = core.getGL();

    const isLit = light !== undefined && light !== null && light.isLit();
    gl.uniform1i(this.isLitRef, isLit ? 1 : 0);

    if (light.isLit()) {
      gl.uniform1i(this.lightTypeRef, light.getLightType());
      gl.uniform4fv(this.colorRef, light.getColor());
      gl.uniform3fv(
        this.positionRef,
        camera.convertWCPosToPx(light.getPosition())
      );
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
  }

  setLit(isLit: boolean) {
    const gl = core.getGL();
    gl.uniform1i(this.isLitRef, isLit ? 1 : 0);
  }
}
