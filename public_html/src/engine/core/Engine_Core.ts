/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import gameLoop from "./Engine_GameLoop.js";
import vertexBuffer from "./Engine_VertexBuffer.js";
import input from "./Engine_Input.js";
import audioClips from "./resources/Engine_AudioClips.js";
import defaultResources from "./resources/Engine_DefaultResources.js";
import Scene from "../Scene.js";

let mGL: WebGLRenderingContext;

const getGL = function () {
  return mGL;
};

const _initializeWebGL = function (htmlCanvasId: string) {
  const canvas = document.getElementById(htmlCanvasId) as HTMLCanvasElement;

  const args = {
    alpha: false,
    depth: true,
    stencil: true,
  };

  mGL = canvas.getContext("webgl2", args) as WebGL2RenderingContext;

  if (mGL === null) {
    document.write("<br/><b> WebGL is not supported. </b>");
    return;
  }

  mGL.blendFunc(mGL.SRC_ALPHA, mGL.ONE_MINUS_SRC_ALPHA);
  mGL.enable(mGL.BLEND);

  mGL.depthFunc(mGL.LEQUAL);
  mGL.enable(mGL.DEPTH_TEST);

  mGL.pixelStorei(mGL.UNPACK_FLIP_Y_WEBGL, true);
};

const initializeEngineCore = function (
  htmlCanvasID: string,
  myGame: Scene,
  shaderInitCallback: () => void
) {
  _initializeWebGL(htmlCanvasID);
  vertexBuffer.initialize();
  input.initialize(htmlCanvasID);
  audioClips.initAudioContext();

  defaultResources.initialize(function () {
    shaderInitCallback();
    startScene(myGame);
  });
};

const startScene = function (myGame: Scene) {
  myGame.loadScene.call(myGame);
  gameLoop.start(myGame);
};

const clearCanvas = function (color: color) {
  mGL.clearColor(color[0], color[1], color[2], color[3]);
  mGL.clear(
    mGL.COLOR_BUFFER_BIT | mGL.DEPTH_BUFFER_BIT | mGL.STENCIL_BUFFER_BIT
  );
};

const mPublic = {
  getGL: getGL,
  initializeEngineCore: initializeEngineCore,
  startScene: startScene,
  clearCanvas: clearCanvas,
};

export default mPublic;
