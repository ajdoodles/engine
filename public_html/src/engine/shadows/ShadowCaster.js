/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import { vec3, vec4 } from "../../gl-matrix/esm/index.js";

function ShadowCaster(caster, receiver) {
    this.kCasterMaxScale = 3;
    this.kVerySmall = 0.001;
    this.kDistanceFudge = 0.01;
    this.kReceiverDistanceFudge = 0.6;
    
    this.mShadowCaster = caster;
    this.mShadowReceiver = receiver;
    this.mCasterShader = ShaderFactory.getShadowCasterShader();
    this.mShadowColor = vec4.fromValues(0.2, 0.2, 0.2, 1.0);
    this.mSaveXform = new Transform();
}

ShadowCaster.prototype.draw = function (camera) {    
    var castingRenderable = this.mShadowCaster.getRenderable();
    var numLights = castingRenderable.numLights();
    
    if (numLights <= 0) {
        return;
    }
    
    this.mSaveXform.copy(castingRenderable.getXform());
    var castingShader = castingRenderable.swapShader(this.mCasterShader);
    var casterColor = castingRenderable.swapColor(this.mShadowColor);
    
    for (var i = 0; i < numLights; i++) {
        var light = castingRenderable.getLightAt(i);
        if (light.isLit()) {
            castingRenderable.getXform().copy(this.mSaveXform);
            if (this._computeShadowGeometry(light)) {
                this.mCasterShader.setLight(light);
                SpriteRenderable.prototype.draw.call(castingRenderable, camera);
            }
        }
    }
    
    castingRenderable.swapShader(castingShader);
    castingRenderable.getXform().copy(this.mSaveXform);
    castingRenderable.setColor(casterColor);
};

ShadowCaster.prototype._computeShadowGeometry = function (light) {
    var casterXform = this.mShadowCaster.getXform();
    var receiverXform = this.mShadowReceiver.getXform();
    var lightDir = light.getDirection();
    var casterToReceiverZ = receiverXform.getZPos() - casterXform.getZPos();
    
    var lightToCaster = vec3.create();
    var distanceToReceiver = 0.0;
    
    var scale = 1.0;
    var offset = vec3.fromValues(0.0, 0.0, 0.0);
    
    
    if (light.getLightType() === Light.prototype.eLightType.eDirectionLight) {
        if (Math.abs(lightDir[2]) < this.kVerySmall) {
            return false; // light pointing sideways, parallel to XY plane
        } else if ((casterToReceiverZ * lightDir[2]) < 0) {
            return false; // light direction is opposite direction from caster to reciever
        }
        
        vec3.copy(lightToCaster, lightDir);
        vec3.normalize(lightToCaster, lightToCaster);
        
        distanceToReceiver = Math.abs(casterToReceiverZ/lightDir[2]);
        scale = Math.abs(1/lightDir[2]);
    } else {
        var casterPos3D = casterXform.getPosition3D();
        vec3.subtract(lightToCaster, casterPos3D,  light.getPosition());
        
        var lightToReceiverZ = receiverXform.getZPos() - light.getPosition()[2];
        
        if ((casterToReceiverZ * lightToReceiverZ) < 0) {
            return false; // light direction is opposite direction from caster to reciever
        } else if (Math.abs(lightToReceiverZ) < this.kVerySmall) {
            return false; // receiver too close to light to get shadow
        } else if (Math.abs(lightToCaster[2]) < this.kVerySmall) {
            return false; // caster too close to light to throw shadow
        }
        
        var distToCaster = vec3.length(lightToCaster);
        vec3.scale(lightToCaster, lightToCaster, 1/distToCaster);
        
        distanceToReceiver = Math.abs(casterToReceiverZ/lightDir[2]);
        
        scale =
            (distToCaster + (distanceToReceiver + this.kReceiverDistanceFudge))
                / distToCaster;
    }
    
    vec3.scale(offset, lightToCaster, distanceToReceiver + this.kDistanceFudge);
    
    casterXform.offset(offset);
    casterXform.setWidth(casterXform.getWidth() * scale);
    casterXform.setHeight(casterXform.getHeight() * scale);
    return true;
};