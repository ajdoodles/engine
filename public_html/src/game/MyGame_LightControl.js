/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
//                vec4.fromValues(0.1, 0.1, 0.6, 1.0),
//                vec3.fromValues(55, 50, 5),
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
    var shifted = gEngine.Input.isKeyPressed(gEngine.Input.keys.Shift);
    
    // select light
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
        this.mFocus = this.mLightSet.getLightAt(0);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {
        this.mFocus = this.mLightSet.getLightAt(1);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
        this.mFocus = this.mLightSet.getLightAt(2);
    }
    
    // modify near
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.T)) {
        this.mFocus.incNear(this.kDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.G)) {
        this.mFocus.incNear(-this.kDelta);
    }
    
    // modify far
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Y)) {
        this.mFocus.incFar(this.kDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.H)) {
        this.mFocus.incFar(-this.kDelta);
    }
    
    // modify outer rads
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.M)) {
        this.mFocus.incOuterDegrees(this.kDeltaDegrees);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.N)) {
        this.mFocus.incOuterDegrees(-this.kDeltaDegrees);
    }
    
    // modify inner rads
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.V)) {
        this.mFocus.incInnerDegrees(this.kDeltaDegrees);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
        this.mFocus.incInnerDegrees(-this.kDeltaDegrees);
    }
    
    // light switch
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.P)) {
        this.mFocus.setLit(this.mFocus.isLit());
    }
    
    // Up and down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.I)) {
        this.moveLightVertical(shifted);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.K)) {
        this.moveLightVertical(shifted, -1.0);
    }
    
    // Left and right
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.J)) {
        this.moveLightHorizontal(shifted, -1.0);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.L)) {
        this.moveLightHorizontal(shifted);
    }
    
    // raise and lower
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.U)) {
        this.mFocus.incZPos(this.kDelta, shifted);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.O)) {
        this.mFocus.incZPos(-this.kDelta, shifted);
    }
    
    // modify intensity
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        this.mFocus.incIntensity(-this.kSmallDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        this.mFocus.incIntensity(this.kSmallDelta);
    }
    
    var pos = this.mFocus.getPosition();
    pos = vec3.fromValues(pos[0].toFixed(1), pos[1].toFixed(1), pos[2].toFixed(1));
    this.mMsg.setText("Type:" + this.mFocus.getLightTypeString() 
            + " I: " + this.mFocus.getIntensity().toFixed(1)
            + " iDegs: " + this.mFocus.getInnerDegrees() + " oDegs: " + this.mFocus.getOuterDegrees()
            + " pos:" + pos[0].toFixed(1) + "," + pos[1].toFixed(1) + ", " + pos[2].toFixed(1)
            + " color: " + this.mFocus.getColor());
};