/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var gEngine = gEngine || {};

gEngine.AudioClips = (function() {
    var mAudioContext = null;
    var mBgAudioNode = null;
    
    var initAudioContext = function() {
      try {
          var AudioContext = window.AudioContext || window.webkitAudioContext;
          mAudioContext = new AudioContext();
      } catch (e) {
          alert("Web audio is not supported.")
      }
    };
    
    var loadAudio = function(fileName) {
        if (gEngine.ResourceMap.isAssetLoaded(fileName)) {
            gEngine.ResourceMap.incAssetRefCount(fileName);
            
//            if (callback !== null && callback !== undefined) {
//                callback();
//            }
//            return;
        }
        
        gEngine.ResourceMap.asyncLoadRequested(fileName);

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status !== 200) {
                alert("audio loading failed: " + fileName + "[see hint]");
            }
        };

        req.open('GET', fileName, true);
        req.responseType = "arraybuffer";

        req.onload = function () {
            mAudioContext.decodeAudioData(
                    req.response,
                    function (buffer) {
                        gEngine.ResourceMap.asyncLoadCompleted(fileName, buffer);
//                        if (callback !== null && callback !== undefined) {
//                            callback(fileName);
//                        }
                    });
        };

        req.send();
    };

    var unloadAudio = function (filePath) {
        gEngine.ResourceMap.unloadAsset(filePath);
    };

    var playCue = function (clipName) {
        var clipData = gEngine.ResourceMap.retrieveAsset(clipName);
        if (clipData !== null) {
            var sourceNode = mAudioContext.createBufferSource();
            sourceNode.buffer = clipData;
            sourceNode.connect(mAudioContext.destination);
            sourceNode.start(0);
        }
    };

    var playBackgroundAudio = function (clipName) {
        var clipData = gEngine.ResourceMap.retrieveAsset(clipName);
        if (clipData !== null) {
            stopBackgroundAudio();
            mBgAudioNode = mAudioContext.createBufferSource();
            mBgAudioNode.buffer = clipData;
            mBgAudioNode.connect(mAudioContext.destination);
            mBgAudioNode.loop = true;
            mBgAudioNode.start(0);
        }
    };

    var stopBackgroundAudio = function () {
        if (isBackgroundAudioPlaying()) {
            mBgAudioNode.stop(0);
            mBgAudioNode = null;
        }
    };

    var isBackgroundAudioPlaying = function () {
        return mBgAudioNode !== null;
    };
    
    var mPublic = {
        initAudioContext: initAudioContext,
        loadAudio: loadAudio,
        unloadAudio: unloadAudio,
        playCue: playCue,
        playBackgroundAudio: playBackgroundAudio,
        stopBackgroundAudio: stopBackgroundAudio,
        isBackgroundAudioPlaying: isBackgroundAudioPlaying,
    };
    
    return mPublic;
}());