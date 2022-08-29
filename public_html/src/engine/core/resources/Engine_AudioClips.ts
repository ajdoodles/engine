/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import resourceMap from "./Engine_ResourceMap.js";

let mAudioContext: AudioContext;
let mBgAudioNode: AudioBufferSourceNode | null;

const initAudioContext = function () {
  try {
    const AudioContext = window.AudioContext;
    mAudioContext = new AudioContext();
  } catch (e) {
    alert("Web audio is not supported.");
  }
};

const loadAudio = function (fileName: string) {
  if (resourceMap.isAssetLoaded(fileName)) {
    resourceMap.incAssetRefCount(fileName);

    //            if (callback !== null && callback !== undefined) {
    //                callback();
    //            }
    //            return;
  }

  resourceMap.asyncLoadRequested(fileName);

  const req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status !== 200) {
      alert("audio loading failed: " + fileName + "[see hint]");
    }
  };

  req.open("GET", fileName, true);
  req.responseType = "arraybuffer";

  req.onload = function () {
    mAudioContext.decodeAudioData(req.response, function (buffer) {
      resourceMap.asyncLoadCompleted(fileName, buffer);
      //                        if (callback !== null && callback !== undefined) {
      //                            callback(fileName);
      //                        }
    });
  };

  req.send();
};

const unloadAudio = function (filePath: string) {
  resourceMap.unloadAsset(filePath);
};

const playCue = function (clipName: string) {
  const clipData = resourceMap.retrieveAsset(clipName) as AudioBuffer;
  if (clipData !== null) {
    const sourceNode = mAudioContext.createBufferSource();
    sourceNode.buffer = clipData;
    sourceNode.connect(mAudioContext.destination);
    sourceNode.start(0);
  }
};

const playBackgroundAudio = function (clipName: string) {
  const clipData = resourceMap.retrieveAsset(clipName) as AudioBuffer;
  if (clipData !== null) {
    stopBackgroundAudio();
    mBgAudioNode = mAudioContext.createBufferSource();
    mBgAudioNode.buffer = clipData;
    mBgAudioNode.connect(mAudioContext.destination);
    mBgAudioNode.loop = true;
    mBgAudioNode.start(0);
  }
};

const stopBackgroundAudio = function () {
  if (isBackgroundAudioPlaying()) {
    mBgAudioNode?.stop(0);
    mBgAudioNode = null;
  }
};

const isBackgroundAudioPlaying = function () {
  return mBgAudioNode !== null;
};

const mPublic = {
  initAudioContext: initAudioContext,
  loadAudio: loadAudio,
  unloadAudio: unloadAudio,
  playCue: playCue,
  playBackgroundAudio: playBackgroundAudio,
  stopBackgroundAudio: stopBackgroundAudio,
  isBackgroundAudioPlaying: isBackgroundAudioPlaying,
};

export default mPublic;
