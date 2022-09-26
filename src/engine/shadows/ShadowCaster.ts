/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import { vec3 } from "gl-matrix";
import Light from "../lights/Light.js";
import SpriteRenderable from "../renderables/SpriteRenderable.js";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";
import GameObject from "../gameobjects/GameObject.js";
import IllumRenderable from "../renderables/IllumRenderable.js";

export default class ShadowCaster {
  casterMaxScale = 3;
  verySmall = 0.001;
  distanceFudge = 0.01;
  receiverDistanceFudge = 0.6;

  casterShader = ShaderFactory.getShadowCasterShader();
  shadowColor: color = [0.2, 0.2, 0.2, 1.0];
  saveXform = new Transform();

  shadowCaster: GameObject;
  shadowReceiver: GameObject;

  constructor(caster: GameObject, receiver: GameObject) {
    this.shadowCaster = caster;
    this.shadowReceiver = receiver;
  }

  draw(camera: Camera) {
    const castingRenderable = this.shadowCaster.renderComponent;
    const numLights = (castingRenderable as IllumRenderable).numLights();

    if (numLights <= 0) {
      return;
    }

    this.saveXform.copy(castingRenderable.getXform());
    const castingShader = castingRenderable.swapShader(this.casterShader);
    const casterColor: color = castingRenderable.swapColor(this.shadowColor);

    for (let i = 0; i < numLights; i++) {
      const light = (castingRenderable as IllumRenderable).getLightAt(i);
      if (light.isLit()) {
        castingRenderable.getXform().copy(this.saveXform);
        if (this._computeShadowGeometry(light)) {
          this.casterShader.setLight(light);
          SpriteRenderable.prototype.draw.call(castingRenderable, camera);
        }
      }
    }

    castingRenderable.swapShader(castingShader);
    castingRenderable.getXform().copy(this.saveXform);
    castingRenderable.setColor(casterColor);
  }

  _computeShadowGeometry(light: Light) {
    const casterXform = this.shadowCaster.xform;
    const receiverXform = this.shadowReceiver.xform;
    const lightDir = light.getDirection();
    const casterToReceiverZ = receiverXform.getZPos() - casterXform.getZPos();

    const lightToCaster = vec3.create();
    let distanceToReceiver = 0.0;

    let scale = 1.0;
    const offset = vec3.fromValues(0.0, 0.0, 0.0);

    if (light.getLightType() === Light.eLightType.eDirectionLight) {
      if (Math.abs(lightDir[2]) < this.verySmall) {
        return false; // light pointing sideways, parallel to XY plane
      } else if (casterToReceiverZ * lightDir[2] < 0) {
        return false; // light direction is opposite direction from caster to reciever
      }

      vec3.copy(lightToCaster, lightDir);
      vec3.normalize(lightToCaster, lightToCaster);

      distanceToReceiver = Math.abs(casterToReceiverZ / lightDir[2]);
      scale = Math.abs(1 / lightDir[2]);
    } else {
      const casterPos3D = casterXform.getPosition3D();
      vec3.subtract(lightToCaster, casterPos3D, light.getPosition());

      const lightToReceiverZ = receiverXform.getZPos() - light.getPosition()[2];

      if (casterToReceiverZ * lightToReceiverZ < 0) {
        return false; // light direction is opposite direction from caster to reciever
      } else if (Math.abs(lightToReceiverZ) < this.verySmall) {
        return false; // receiver too close to light to get shadow
      } else if (Math.abs(lightToCaster[2]) < this.verySmall) {
        return false; // caster too close to light to throw shadow
      }

      const distToCaster = vec3.length(lightToCaster);
      vec3.scale(lightToCaster, lightToCaster, 1 / distToCaster);

      distanceToReceiver = Math.abs(casterToReceiverZ / lightDir[2]);

      scale =
        (distToCaster + (distanceToReceiver + this.receiverDistanceFudge)) /
        distToCaster;
    }

    vec3.scale(offset, lightToCaster, distanceToReceiver + this.distanceFudge);

    casterXform.offset(offset);
    casterXform.setWidth(casterXform.getWidth() * scale);
    casterXform.setHeight(casterXform.getHeight() * scale);
    return true;
  }
}
