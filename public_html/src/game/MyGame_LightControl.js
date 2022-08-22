/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import MyGame from "./MyGame.js";
import input from "../engine/core/Engine_Input.js";
import core from "../engine/core/Engine_Core.js";
import textFileLoader from "../engine/core/resources/Engine_TextFileLoader.js";
import textures from "../engine/core/Engine_Textures.js";

MyGame.prototype.initLights = function () {
    this.kDelta = 0.1;
    this.kSmallDelta = 0.01;
    this.kDeltaDegrees = 5;
    
    this.mLightSet = new LightSet();
    var pointLight = new Light();
    pointLight.incXPos(55);
    this.mLightSet.addLight(pointLight);
//    this.mLightSet.addLight(
//            new Light(
//                glMatrix.vec4.fromValues(0.1, 0.1, 0.6, 1.0),
//                glMatrix.vec3.fromValues(55, 50, 5),
//                1.0,
//                6,
//                15));
    this.mLightSet.addLight(new Light(Light.prototype.eLightType.eDirectionLight));
    this.mLightSet.addLight(new Light(Light.prototype.eLightType.eSpotLight));
    this.mFocus = this.mLightSet.getLightAt(0);
    
    for (var i = 0; i < this.mLightSet.numLights(); i++) {
        this.mBg.getRenderable().addLight(this.mLightSet.getLightAt(i));
        this.mHero.getRenderable().addLight(this.mLightSet.getLightAt(i));
        this.mBrain.getRenderable().addLight(this.mLightSet.getLightAt(i));
    }
};

MyGame.prototype.moveLightHorizontal = function(shifted = false, multiplier = 1.0) {
    if (shifted) {
        this.mFocus.rotateXDirDegrees(this.kDeltaDegrees * multiplier);
    } else {
        this.mFocus.incXPos(this.kDelta * multiplier);
    }
};
MyGame.prototype.moveLightVertical = function(shifted = false, multiplier = 1.0) {
    if (shifted) {
        this.mFocus.rotateYDirDegrees(this.kDeltaDegrees * multiplier);
    } else {
        this.mFocus.incYPos(this.kDelta * multiplier);
    }
};

MyGame.prototype.updateLights = function() {
    var shifted = input.isKeyPressed(input.keys.Shift);
    
    // select light
    if (input.isKeyClicked(input.keys.One)) {
        this.mFocus = this.mLightSet.getLightAt(0);
    } else if (input.isKeyClicked(input.keys.Two)) {
        this.mFocus = this.mLightSet.getLightAt(1);
    } else if (input.isKeyClicked(input.keys.Three)) {
        this.mFocus = this.mLightSet.getLightAt(2);
    }
    
    // modify near
    if (input.isKeyPressed(input.keys.T)) {
        this.mFocus.incNear(this.kDelta);
    } else if (input.isKeyPressed(input.keys.G)) {
        this.mFocus.incNear(-this.kDelta);
    }
    
    // modify far
    if (input.isKeyPressed(input.keys.Y)) {
        this.mFocus.incFar(this.kDelta);
    } else if (input.isKeyPressed(input.keys.H)) {
        this.mFocus.incFar(-this.kDelta);
    }
    
    // modify outer rads
    if (input.isKeyPressed(input.keys.M)) {
        this.mFocus.incOuterDegrees(this.kDeltaDegrees);
    } else if (input.isKeyPressed(input.keys.N)) {
        this.mFocus.incOuterDegrees(-this.kDeltaDegrees);
    }
    
    // modify inner rads
    if (input.isKeyPressed(input.keys.V)) {
        this.mFocus.incInnerDegrees(this.kDeltaDegrees);
    } else if (input.isKeyPressed(input.keys.C)) {
        this.mFocus.incInnerDegrees(-this.kDeltaDegrees);
    }
    
    // light switch
    if (input.isKeyPressed(input.keys.P)) {
        this.mFocus.setLit(this.mFocus.isLit());
    }
    
    // Up and down
    if (input.isKeyPressed(input.keys.I)) {
        this.moveLightVertical(shifted);
    } else if (input.isKeyPressed(input.keys.K)) {
        this.moveLightVertical(shifted, -1.0);
    }
    
    // Left and right
    if (input.isKeyPressed(input.keys.J)) {
        this.moveLightHorizontal(shifted, -1.0);
    } else if (input.isKeyPressed(input.keys.L)) {
        this.moveLightHorizontal(shifted);
    }
    
    // raise and lower
    if (input.isKeyPressed(input.keys.U)) {
        this.mFocus.incZPos(this.kDelta, shifted);
    } else if (input.isKeyPressed(input.keys.O)) {
        this.mFocus.incZPos(-this.kDelta, shifted);
    }
    
    // modify intensity
    if (input.isKeyPressed(input.keys.Z)) {
        this.mFocus.incIntensity(-this.kSmallDelta);
    } else if (input.isKeyPressed(input.keys.X)) {
        this.mFocus.incIntensity(this.kSmallDelta);
    }
    
    var pos = this.mFocus.getPosition();
    pos = glMatrix.vec3.fromValues(pos[0].toFixed(1), pos[1].toFixed(1), pos[2].toFixed(1));
    this.mMsg.setText("Type:" + this.mFocus.getLightTypeString() 
            + " I: " + this.mFocus.getIntensity().toFixed(1)
            + " iDegs: " + this.mFocus.getInnerDegrees() + " oDegs: " + this.mFocus.getOuterDegrees()
            + " pos:" + pos[0].toFixed(1) + "," + pos[1].toFixed(1) + ", " + pos[2].toFixed(1)
            + " color: " + this.mFocus.getColor());
};