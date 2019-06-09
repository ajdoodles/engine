/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MyGame.prototype.initLights = function () {
    this.kDelta = 0.1;
    
    this.mLightSet = new LightSet();
    this.mLightSet.addLight(new Light());
    this.mLightSet.addLight(
            new Light(
                vec4.fromValues(0.1, 0.1, 0.6, 1.0),
                vec3.fromValues(55, 50, 5),
                1.0,
                6,
                15));
    this.mLightSet.addLight(
            new Light(
                vec4.fromValues(0.8, 0.8, 0.4, 1.0),
                vec3.fromValues(80, 25, 5),
                1.0,
                3,
                6));
                
    this.mFocus = this.mLightSet.getLightAt(0);
    
    for (var i = 0; i < this.mLightSet.numLights(); i++) {
        this.mBg.getRenderable().addLight(this.mLightSet.getLightAt(i));
        this.mHero.getRenderable().addLight(this.mLightSet.getLightAt(i));
        this.mBrain.getRenderable().addLight(this.mLightSet.getLightAt(i));
    }
};

MyGame.prototype.updateLights = function() {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
        this.mFocus = this.mLightSet.getLightAt(0);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {
        this.mFocus = this.mLightSet.getLightAt(1);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
        this.mFocus = this.mLightSet.getLightAt(2);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.T)) {
        this.mFocus.incNear(this.kDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.G)) {
        this.mFocus.incNear(-this.kDelta);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Y)) {
        this.mFocus.incFar(this.kDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.H)) {
        this.mFocus.incFar(-this.kDelta);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.P)) {
        this.mFocus.setLit(this.mFocus.isLit());
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.I)) {
        this.mFocus.incYPos(this.kDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.K)) {
        this.mFocus.incYPos(-this.kDelta);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.J)) {
        this.mFocus.incXPos(-this.kDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.L)) {
        this.mFocus.incXPos(this.kDelta);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.U)) {
        this.mFocus.incZPos(this.kDelta);
    } else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.O)) {
        this.mFocus.incZPos(-this.kDelta);
    }
    
    var pos = this.mFocus.getPosition();
    pos = vec3.fromValues(pos[0].toFixed(1), pos[1].toFixed(1), pos[2].toFixed(1));
    this.mMsg.setText("pos:" + pos[0].toFixed(1) + "," + pos[1].toFixed(1) + ", " + pos[2].toFixed(1) + " color: " + this.mFocus.getColor());
};