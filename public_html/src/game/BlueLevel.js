/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Scene from "../engine/Scene.js";
import gameLoop from "../engine/core/Engine_GameLoop.js";
import core from "../engine/core/Engine_Core.js";
import textFileLoader from "../engine/core/resources/Engine_TextFileLoader.js";
import textures from "../engine/core/Engine_Textures.js";
import audioClips from "../engine/core/resources/Engine_AudioClips.js";
import input from "../engine/core/Engine_Input.js";

function BlueLevel() {
    this.kSceneFile = "assets/bluelevel.xml";
    
    this.kPortal = "assets/minion_portal.jpg";
    this.kCollector = "assets/minion_collector.jpg";
    
    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";

    this.mSquareSet = new Array();
    this.mCamera = null;
}
core.inheritPrototype(Scene, BlueLevel);

BlueLevel.prototype.loadScene = function () {
    textFileLoader.loadTextFile(
            this.kSceneFile,
            textFileLoader.eTextFileType.eXMLFile);
    textures.loadTexture(this.kPortal);
    textures.loadTexture(this.kCollector);
    audioClips.loadAudio(this.kBgClip);
    audioClips.loadAudio(this.kCue);
};

BlueLevel.prototype.unloadScene = function () {
    textFileLoader.unloadTextFile(this.kSceneFile);
    audioClips.stopBackgroundAudio();
    textures.unloadTexture(this.kPortal);
    textures.unloadTexture(this.kCollector);
    audioClips.unloadAudio(this.kBgClip);
    audioClips.unloadAudio(this.kCue);

    var myGame = new MyGame();
    core.startScene(myGame);
};

BlueLevel.prototype.initialize = function () {
    audioClips.playBackgroundAudio(this.kBgClip);

    var sceneParser = new SceneFileParser(this.kSceneFile);
    sceneParser.parseSquares(this.mSquareSet);
    sceneParser.parseTextureSquares(this.mSquareSet);
    this.mCamera = sceneParser.parseCamera();
};

BlueLevel.prototype.update = function () {
    var whiteXform = this.mSquareSet[0].getXform();
    var redXform = this.mSquareSet[1].getXform();
    var deltaX = 0.05;

    if (input.isKeyPressed(input.keys.Right)) {
        audioClips.playCue(this.kCue);
        if (whiteXform.getXPos() > 30) {
            whiteXform.setPosition(10, 60);
        }
        whiteXform.incXPos(deltaX);
    }

    if (input.isKeyClicked(input.keys.Up)) {
        whiteXform.incRotationInDegrees(1);
    }

    if (input.isKeyPressed(input.keys.Down)) {
        if (redXform.getWidth() > 5) {
            redXform.setSize(2, 2);
        }
        redXform.incSize(0.05);
    }

    if (input.isKeyPressed(input.keys.Left)) {
        audioClips.playCue(this.kCue);
        whiteXform.incXPos(-deltaX);
        if (whiteXform.getXPos() < 11) {
            gameLoop.stop();
        }
    }
    
    var c = this.mSquareSet[1].getColor();;
    var ca = c[3] + deltaX;
    if (ca > 1) {
        ca = 0;
    }
    c[3] = ca;
};

BlueLevel.prototype.draw = function () {
    // Clear entire canvas
    core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    this.mCamera.setupViewProjection();

    for (var i = 0; i < this.mSquareSet.length; i++) {
        this.mSquareSet[i].draw(this.mCamera);
    }
};