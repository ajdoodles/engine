/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import resourceMap from "./Engine_ResourceMap.js";
import textFileLoader from "./Engine_TextFileLoader.js";
import fonts from "./Engine_Fonts.js";
import { vec4 } from "gl-matrix";

export default (function () {
    var kSimpleVS = "src/glslshaders/SimpleVS.glsl";
    var kSimpleFS = "src/glslshaders/SimpleFS.glsl";
    var kTextureVS = "src/glslshaders/TextureVS.glsl";
    var kTextureFS = "src/glslshaders/TextureFS.glsl";
    var kLightFS = "src/glslshaders/LightFS.glsl";
    var kIllumFS = "src/glslshaders/IllumFS.glsl";
    var kShadowCasterFS = "src/glslshaders/ShadowCasterFS.glsl";
    var kShadowReceiverFS = "src/glslshaders/ShadowReceiverFS.glsl";
    var kLineFS = "src/glslshaders/LineFS.glsl";

    var mGlobalAmbientColor = vec4.fromValues(0.3, 0.3, 0.3, 1.0);
    var mGlobalAmbientIntensity = 0.95;
    
    var kDefaultFont = "assets/fonts/system-default-font";

    var getGlobalAmbientColor = function() {
        return mGlobalAmbientColor;
    };
    
    var setGlobalAmbientColor = function(color) {
        vec4.clone(mGlobalAmbientColor, color);
    };
    
    var getGlobalAmbientIntensity = function() {
        return mGlobalAmbientIntensity;
    };
    
    var setGlobalAmbientIntensity = function (intensity) {
        mGlobalAmbientIntensity = intensity;
    };
    
    var _getDefaultFont = function() {
        return kDefaultFont;
    };

    var _initialize = function (callback) {
        textFileLoader.loadTextFile(
                kSimpleVS,
                textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(
                kSimpleFS,
                textFileLoader.eTextFileType.eTextFile);

        textFileLoader.loadTextFile(
                kTextureVS,
                textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(
                kTextureFS,
                textFileLoader.eTextFileType.eTextFile);
                
        textFileLoader.loadTextFile(
                kLightFS,
                textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(
                kIllumFS,
                textFileLoader.eTextFileType.eTextFile);

        textFileLoader.loadTextFile(
                kShadowCasterFS,
                textFileLoader.eTextFileType.eTextFile);
        textFileLoader.loadTextFile(
                kShadowReceiverFS,
                textFileLoader.eTextFileType.eTextFile);

        textFileLoader.loadTextFile(
                kLineFS,
                textFileLoader.eTextFileType.eTextFile);

        fonts.loadFont(kDefaultFont);

        resourceMap.setLoadCompletedCallback(callback);
    };
    
    var mPublic = {
        initialize: _initialize,
        getGlobalAmbientColor: getGlobalAmbientColor,
        setGlobalAmbientColor: setGlobalAmbientColor,
        getGlobalAmbientIntensity: getGlobalAmbientIntensity,
        setGlobalAmbientIntensity: setGlobalAmbientIntensity,
        getDefaultFont: _getDefaultFont,
    };
    
    return mPublic;
}());