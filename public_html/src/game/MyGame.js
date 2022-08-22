/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Scene from "../engine/Scene.js";
import audioClips from "../engine/core/resources/Engine_AudioClips.js";
import core from "../engine/core/Engine_Core.js";
import input from "../engine/core/Engine_Input.js";

export default function MyGame() {
    this.kSceneFile = "assets/scene.xml";

    this.kPortal = "assets/minion_portal.png";
    this.kCollector = "assets/minion_collector.png";
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionSpriteNormal = "assets/minion_sprite_normal.png";
    this.kFontImage = "assets/Consolas-72.png";
    this.kBg = "assets/bg.png";
    this.kBgNormal = "assets/bg_normal.png";

    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/MyGame_cue.wav";
}
core.inheritPrototype(Scene, MyGame);

MyGame.prototype.loadScene = function () {
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

MyGame.prototype.unloadScene = function () {
    textFileLoader.unloadTextFile(this.kSceneFile);
    audioClips.stopBackgroundAudio();
    //textures.unloadTexture(this.kPortal);
//    textures.unloadTexture(this.kCollector);
    textures.unloadTexture(this.kMinionSprite);
    textures.unloadTexture(this.kFontImage);
    textures.unloadTexture(this.kBg);
    //audioClips.unloadAudio(this.kBgClip);
    audioClips.unloadAudio(this.kCue);

    var blueLevel = new BlueLevel();
    core.startScene(blueLevel);
};

MyGame.prototype._setupShadows = function () {
    this.mBgShadows = new ShadowReceiver(this.mBg);
    this.mBgShadows.addShadowCaster(this.mHero);
    this.mBgShadows.addShadowCaster(this.mLeftMinion);
    this.mBgShadows.addShadowCaster(this.mRightMinion);
    
    this.mLeftMinionShadows = new ShadowReceiver(this.mLeftMinion);
    this.mLeftMinionShadows.addShadowCaster(this.mHero);
    
    this.mRightMinionShadows = new ShadowReceiver(this.mRightMinion);
    this.mRightMinionShadows.addShadowCaster(this.mHero);
};

MyGame.prototype.initialize = function () {
    //audioClips.playBackgroundAudio(this.kBgClip);

    var sceneParser = new SceneFileParser(this.kSceneFile);
    this.mCamera = sceneParser.parseCamera();

    this.mHeroCam = new Camera(
            glMatrix.vec2.fromValues(50, 30),
            20,
            [490, 330, 150, 150],
            2);
    this.mHeroCam.setBackgroundColor([0.5, 0.5, 0.5, 1]);
    
    this.mBrainCam = new Camera(
            glMatrix.vec2.fromValues(50, 30),
            10,
            [0, 330, 150, 150],
            2);
    this.mBrainCam.setBackgroundColor([1, 1, 1, 1]);

    var bgRenderable = new IllumRenderable(this.kBg, this.kBgNormal);
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

MyGame.prototype.update = function () {
    this.mCamera.update();

    if (input.isMouseClicked(input.mouse.Middle)) {
        var visible = this.mPortal.isVisible();
        this.mPortal.setVisible(!visible);
    }

    if (input.isMousePressed(input.mouse.Left)) {
        if (this.mCamera.isMouseInViewport()) {
            var mousePos = this.mCamera.getWCCursorPosition();
            this.mPortal.getXform().setPosition(mousePos[0], mousePos[1]);
        }
    }

    if (input.isMousePressed(input.mouse.Right)) {
        if (this.mHeroCam.isMouseInViewport()) {
            var mousePos = this.mHeroCam.getWCCursorPosition();
            this.mHero.getXform().setPosition(mousePos[0], mousePos[1]);
        }
    }

    this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
    this.mCamera.panWith(this.mHero.getXform(), 0.9);
    
    this.mHero.update();
    this.mPortal.update();
    this.mBrain.update();

    var rate = 0.02;
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

MyGame.prototype.draw = function () {
    // Clear entire canvas
    core.clearCanvas([0.9, 0.9, 0.9, 1.0]);
    this.drawCam(this.mCamera);
    this.mMsg.draw(this.mCamera);
    this.drawCam(this.mHeroCam);
    this.drawCam(this.mBrainCam);    
};

MyGame.prototype.drawCam = function (camera) {
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
