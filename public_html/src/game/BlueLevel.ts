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
import SceneFileParser from "./util/SceneFileParser.js";
import MyGame from "./MyGame.js";
import Camera from "../engine/cameras/Camera.js";
import Renderable from "../engine/renderables/Renderable.js";
import TextureRenderable from "../engine/renderables/TextureRenderable.js";

export default class BlueLevel extends Scene {
  kSceneFile = "assets/bluelevel.xml";

  kPortal = "assets/minion_portal.jpg";
  kCollector = "assets/minion_collector.jpg";

  kBgClip = "assets/sounds/BGClip.mp3";
  kCue = "assets/sounds/BlueLevel_cue.wav";

  mSquareSet: (Renderable | TextureRenderable)[] = [];
  mCamera!: Camera;

  loadScene() {
    textFileLoader.loadTextFile(
      this.kSceneFile,
      textFileLoader.eTextFileType.eXMLFile
    );
    textures.loadTexture(this.kPortal);
    textures.loadTexture(this.kCollector);
    audioClips.loadAudio(this.kBgClip);
    audioClips.loadAudio(this.kCue);
  }

  unloadScene() {
    textFileLoader.unloadTextFile(this.kSceneFile);
    audioClips.stopBackgroundAudio();
    textures.unloadTexture(this.kPortal);
    textures.unloadTexture(this.kCollector);
    audioClips.unloadAudio(this.kBgClip);
    audioClips.unloadAudio(this.kCue);

    const myGame = new MyGame();
    core.startScene(myGame);
  }

  initialize() {
    audioClips.playBackgroundAudio(this.kBgClip);

    const sceneParser = new SceneFileParser(this.kSceneFile);
    sceneParser.parseSquares(this.mSquareSet);
    sceneParser.parseTextureSquares(this.mSquareSet);
    this.mCamera = sceneParser.parseCamera();
  }

  update() {
    const whiteXform = this.mSquareSet[0].getXform();
    const redXform = this.mSquareSet[1].getXform();
    const deltaX = 0.05;

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

    const c = this.mSquareSet[1].getColor();
    let ca = c[3] + deltaX;
    if (ca > 1) {
      ca = 0;
    }
    c[3] = ca;
  }

  draw() {
    // Clear entire canvas
    core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    this.mCamera.setupViewProjection();

    for (let i = 0; i < this.mSquareSet.length; i++) {
      this.mSquareSet[i].draw(this.mCamera);
    }
  }
}
