/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Scene from "../engine/Scene.js";
import audioClips from "../engine/core/resources/Engine_AudioClips.js";
import core from "../engine/core/Engine_Core.js";
import input from "../engine/core/Engine_Input.js";
import textFileLoader from "../engine/core/resources/Engine_TextFileLoader.js";
import textures from "../engine/core/Engine_Textures.js";
import BlueLevel from "./BlueLevel.js";
import { vec2 } from "gl-matrix";
import Camera from "../engine/cameras/Camera.js";
import GameObject from "../engine/gameobjects/GameObject.js";
import Light from "../engine/lights/Light.js";
import LightSet from "../engine/lights/LightSet.js";
import FontRenderable from "../engine/renderables/FontRenderable.js";
import IllumRenderable from "../engine/renderables/IllumRenderable.js";
import ShadowReceiver from "../engine/shadows/ShadowReceiver.js";
import Material from "../engine/utils/Material.js";
import Brain from "./objects/Brain.js";
import Hero from "./objects/Hero.js";
import Minion from "./objects/Minion.js";
import Portal from "./objects/Portal.js";
import SceneFileParser from "./util/SceneFileParser.js";

export default class MyGame extends Scene {
    kSceneFile = "assets/scene.xml";

    kPortal = "assets/minion_portal.png";
    kCollector = "assets/minion_collector.png";
    kMinionSprite = "assets/minion_sprite.png";
    kMinionSpriteNormal = "assets/minion_sprite_normal.png";
    kFontImage = "assets/Consolas-72.png";
    kBg = "assets/bg.png";
    kBgNormal = "assets/bg_normal.png";

    kBgClip = "assets/sounds/BGClip.mp3";
    kCue = "assets/sounds/MyGame_cue.wav";

    mBgShadows!: ShadowReceiver;
    mBg!: GameObject;
    mLeftMinionShadows!: ShadowReceiver;
    mRightMinionShadows!: ShadowReceiver;
    mCamera!: Camera;
    mHeroCam!: Camera;
    mBrainCam!: Camera;
    mBrain!: Brain;
    mPortal!: Portal;
    mMsg!: FontRenderable;
    kDelta!: number;
    kSmallDelta!: number;
    kDeltaDegrees!: number;
    mLightSet!: LightSet;
    mHero !: Hero;
    mLeftMinion !: Minion;
    mRightMinion !: Minion;
    mFocus!: Light;

    loadScene () {
        textFileLoader.loadTextFile(
                this.kSceneFile,
                textFileLoader.eTextFileType.eXMLFile);
                    textures.loadTexture(this.kPortal);
        textures.loadTexture(this.kCollector);
        textures.loadTexture(this.kMinionSprite);
        textures.loadTexture(this.kBg);
        textures.loadTexture(this.kFontImage);
        
        textures.loadTexture(this.kMinionSpriteNormal);
        textures.loadTexture(this.kBgNormal);
        
        audioClips.loadAudio(this.kBgClip);
        audioClips.loadAudio(this.kCue);
    };
    
    unloadScene () {
        textFileLoader.unloadTextFile(this.kSceneFile);
        audioClips.stopBackgroundAudio();
        //textures.unloadTexture(this.kPortal);
    //    textures.unloadTexture(this.kCollector);
        textures.unloadTexture(this.kMinionSprite);
        textures.unloadTexture(this.kFontImage);
        textures.unloadTexture(this.kBg);
        //audioClips.unloadAudio(this.kBgClip);
        audioClips.unloadAudio(this.kCue);
    
        const blueLevel = new BlueLevel();
        core.startScene(blueLevel);
    };
    
    _setupShadows () {
        this.mBgShadows = new ShadowReceiver(this.mBg);
        this.mBgShadows.addShadowCaster(this.mHero);
        this.mBgShadows.addShadowCaster(this.mLeftMinion);
        this.mBgShadows.addShadowCaster(this.mRightMinion);
        
        this.mLeftMinionShadows = new ShadowReceiver(this.mLeftMinion);
        this.mLeftMinionShadows.addShadowCaster(this.mHero);
        
        this.mRightMinionShadows = new ShadowReceiver(this.mRightMinion);
        this.mRightMinionShadows.addShadowCaster(this.mHero);
    }
    
    initialize () {
        //audioClips.playBackgroundAudio(this.kBgClip);
    
        const sceneParser = new SceneFileParser(this.kSceneFile);
        this.mCamera = sceneParser.parseCamera();
    
        this.mHeroCam = new Camera(
                vec2.fromValues(50, 30),
                20,
                [490, 330, 150, 150],
                2);
        this.mHeroCam.setBackgroundColor([0.5, 0.5, 0.5, 1]);
        
        this.mBrainCam = new Camera(
                vec2.fromValues(50, 30),
                10,
                [0, 330, 150, 150],
                2);
        this.mBrainCam.setBackgroundColor([1, 1, 1, 1]);
    
        const bgRenderable = new IllumRenderable(this.kBg, this.kBgNormal);
        bgRenderable.getXform().setSize(150, 150);
        bgRenderable.getXform().setPosition(50, 35);
        bgRenderable.setMaterial(new Material());
        this.mBg = new GameObject(bgRenderable);
    
        this.mHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal);
        this.mBrain = new Brain(this.kMinionSprite);
        this.mPortal = new Portal(this.kPortal);
        this.mLeftMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal);
        this.mLeftMinion.getXform().setPosition(30, 30);
        this.mRightMinion = new Minion(this.kMinionSprite);
        this.mRightMinion.getXform().setPosition(70, 30);
        
        this.mMsg = new FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);
        
        this.initLights();
        this._setupShadows();
    };
    
    update () {
        this.mCamera.update();
    
        if (input.isMouseClicked(input.mouse.Middle)) {
            const visible = this.mPortal.isVisible();
            this.mPortal.setVisible(!visible);
        }
    
        if (input.isMousePressed(input.mouse.Left)) {
            if (this.mCamera.isMouseInViewport()) {
                const mousePos = this.mCamera.getWCCursorPosition();
                this.mPortal.getXform().setPosition(mousePos[0], mousePos[1]);
            }
        }
    
        if (input.isMousePressed(input.mouse.Right)) {
            if (this.mHeroCam.isMouseInViewport()) {
                const mousePos = this.mHeroCam.getWCCursorPosition();
                this.mHero.getXform().setPosition(mousePos[0], mousePos[1]);
            }
        }
    
        this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
        this.mCamera.panWith(this.mHero.getXform(), 0.9);
        
        this.mHero.update();
        this.mPortal.update();
        this.mBrain.update();
    
        const rate = 0.02;
        if (!this.mBrain.getBBox().intersects(this.mHero.getBBox())) {
            this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), rate);
            GameObject.prototype.update.call(this.mBrain);
        }
    
        this.mHeroCam.update();
        this.mBrainCam.update();
    
        this.mHeroCam.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
        this.mBrainCam.panTo(this.mBrain.getXform().getXPos(), this.mBrain.getXform().getYPos());
        
        this.updateLights();
    };
    
    draw () {
        // Clear entire canvas
        core.clearCanvas([0.9, 0.9, 0.9, 1.0]);
        this.drawCam(this.mCamera);
        this.mMsg.draw(this.mCamera);
        this.drawCam(this.mHeroCam);
        this.drawCam(this.mBrainCam);    
    };
    
    drawCam (camera: Camera) {
        camera.setupViewProjection();
        
    //    this.mBg.draw(camera);
    //    this.mLeftMinion.draw(camera);
    //    this.mRightMinion.draw(camera);
        
        this.mBgShadows.draw(camera);
        this.mLeftMinionShadows.draw(camera);
        this.mRightMinionShadows.draw(camera);
        
        this.mHero.draw(camera);
        this.mBrain.draw(camera);
        this.mPortal.draw(camera);
    };

    initLights () {
        this.kDelta = 0.1;
        this.kSmallDelta = 0.01;
        this.kDeltaDegrees = 5;
        
        this.mLightSet = new LightSet();
        const pointLight = new Light();
        pointLight.incXPos(55);
        this.mLightSet.addLight(pointLight);
    //    this.mLightSet.addLight(
    //            new Light(
    //                glMatrix.vec4.fromValues(0.1, 0.1, 0.6, 1.0),
    //                glMatrix.vec3.fromValues(55, 50, 5),
    //                1.0,
    //                6,
    //                15));
        this.mLightSet.addLight(new Light(Light.eLightType.eDirectionLight));
        this.mLightSet.addLight(new Light(Light.eLightType.eSpotLight));
        this.mFocus = this.mLightSet.getLightAt(0);
        
        for (let i = 0; i < this.mLightSet.numLights(); i++) {
            (this.mBg.getRenderable() as IllumRenderable).addLight(this.mLightSet.getLightAt(i));
            (this.mHero.getRenderable() as IllumRenderable).addLight(this.mLightSet.getLightAt(i));
            (this.mBrain.getRenderable() as IllumRenderable).addLight(this.mLightSet.getLightAt(i));
        }
    };
    
    moveLightHorizontal(shifted = false, multiplier = 1.0) {
        if (shifted) {
            this.mFocus.rotateXDirDegrees(this.kDeltaDegrees * multiplier);
        } else {
            this.mFocus.incXPos(this.kDelta * multiplier);
        }
    };
    moveLightVertical(shifted = false, multiplier = 1.0) {
        if (shifted) {
            this.mFocus.rotateYDirDegrees(this.kDeltaDegrees * multiplier);
        } else {
            this.mFocus.incYPos(this.kDelta * multiplier);
        }
    };
    
    updateLights() {
        const shifted = input.isKeyPressed(input.keys.Shift);
        
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
            this.mFocus.incZPos(this.kDelta);
        } else if (input.isKeyPressed(input.keys.O)) {
            this.mFocus.incZPos(-this.kDelta);
        }
        
        // modify intensity
        if (input.isKeyPressed(input.keys.Z)) {
            this.mFocus.incIntensity(-this.kSmallDelta);
        } else if (input.isKeyPressed(input.keys.X)) {
            this.mFocus.incIntensity(this.kSmallDelta);
        }
        
        const pos = this.mFocus.getPosition();
        this.mMsg.setText("Type:" + this.mFocus.getLightTypeString() 
                + " I: " + this.mFocus.getIntensity().toFixed(1)
                + " iDegs: " + this.mFocus.getInnerDegrees() + " oDegs: " + this.mFocus.getOuterDegrees()
                + " pos:" + pos[0].toFixed(1) + "," + pos[1].toFixed(1) + ", " + pos[2].toFixed(1)
                + " color: " + this.mFocus.getColor());
    };
}