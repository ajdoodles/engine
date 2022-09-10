/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import resourceMap from "./Engine_ResourceMap.js";
import textFileLoader from "./Engine_TextFileLoader.js";
import fonts from "./Engine_Fonts.js";

const kSimpleVS = "src/glslshaders/SimpleVS.glsl";
const kSimpleFS = "src/glslshaders/SimpleFS.glsl";
const kTextureVS = "src/glslshaders/TextureVS.glsl";
const kTextureFS = "src/glslshaders/TextureFS.glsl";
const kLightFS = "src/glslshaders/LightFS.glsl";
const kIllumFS = "src/glslshaders/IllumFS.glsl";
const kShadowCasterFS = "src/glslshaders/ShadowCasterFS.glsl";
const kShadowReceiverFS = "src/glslshaders/ShadowReceiverFS.glsl";
const kLineFS = "src/glslshaders/LineFS.glsl";
const kParticleFS = "src/glslshaders/ParticleFS.glsl";

let mGlobalAmbientColor = [0.3, 0.3, 0.3, 1.0];
let mGlobalAmbientIntensity = 0.95;

const kDefaultFont = "assets/fonts/system-default-font";

const getGlobalAmbientColor = function () {
  return mGlobalAmbientColor;
};

const setGlobalAmbientColor = function (color: color) {
  mGlobalAmbientColor = Array.from(color);
};

const getGlobalAmbientIntensity = function () {
  return mGlobalAmbientIntensity;
};

const setGlobalAmbientIntensity = function (intensity: number) {
  mGlobalAmbientIntensity = intensity;
};

const _getDefaultFont = function () {
  return kDefaultFont;
};

const _initialize = function (callback: () => void) {
  textFileLoader.loadTextFile(
    kSimpleVS,
    textFileLoader.eTextFileType.eTextFile
  );
  textFileLoader.loadTextFile(
    kSimpleFS,
    textFileLoader.eTextFileType.eTextFile
  );

  textFileLoader.loadTextFile(
    kTextureVS,
    textFileLoader.eTextFileType.eTextFile
  );
  textFileLoader.loadTextFile(
    kTextureFS,
    textFileLoader.eTextFileType.eTextFile
  );

  textFileLoader.loadTextFile(kLightFS, textFileLoader.eTextFileType.eTextFile);
  textFileLoader.loadTextFile(kIllumFS, textFileLoader.eTextFileType.eTextFile);

  textFileLoader.loadTextFile(
    kShadowCasterFS,
    textFileLoader.eTextFileType.eTextFile
  );
  textFileLoader.loadTextFile(
    kShadowReceiverFS,
    textFileLoader.eTextFileType.eTextFile
  );

  textFileLoader.loadTextFile(kLineFS, textFileLoader.eTextFileType.eTextFile);
  textFileLoader.loadTextFile(
    kParticleFS,
    textFileLoader.eTextFileType.eTextFile
  );

  fonts.loadFont(kDefaultFont);

  resourceMap.setLoadCompletedCallback(callback);
};

const mPublic = {
  initialize: _initialize,
  getGlobalAmbientColor: getGlobalAmbientColor,
  setGlobalAmbientColor: setGlobalAmbientColor,
  getGlobalAmbientIntensity: getGlobalAmbientIntensity,
  setGlobalAmbientIntensity: setGlobalAmbientIntensity,
  getDefaultFont: _getDefaultFont,
};

export default mPublic;
