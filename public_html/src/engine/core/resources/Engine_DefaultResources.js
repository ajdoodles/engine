/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var gEngine = gEngine || {};

gEngine.DefaultResources = (function () {
    var kSimpleVS = "src/glslshaders/SimpleVS.glsl";
    var kSimpleFS = "src/glslshaders/SimpleFS.glsl";
    var mConstColorShader = null;
    
    var kTextureVS = "src/glslshaders/TextureVS.glsl";
    var kTextureFS = "src/glslshaders/TextureFS.glsl";
    var mTextureShader = null;
    var mSpriteShader = null;
    
    var mGlobalAmbientColor = vec4.fromValues(0.3, 0.3, 0.3, 1.0);
    var mGlobalAmbientIntensity = 0.95;
    
    var kDefaultFont = "assets/fonts/system-default-font";
    
    var _getConstColorShader = function() {
        return mConstColorShader;
    };
    
    var _getTextureShader = function() {
        return mTextureShader;
    }
    
    var _getSpriteShader = function() {
        return mSpriteShader;
    }
    
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
    
    var _createShaders = function(callback) {
        mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        mTextureShader = new TextureShader(kTextureVS, kTextureFS);
        mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
        callback();
    };

    var _initialize = function (callback) {
        gEngine.TextFileLoader.loadTextFile(
                kSimpleVS,
                gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.loadTextFile(
                kSimpleFS,
                gEngine.TextFileLoader.eTextFileType.eTextFile);

        gEngine.TextFileLoader.loadTextFile(
                kTextureVS,
                gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.loadTextFile(
                kTextureFS,
                gEngine.TextFileLoader.eTextFileType.eTextFile);

        gEngine.Fonts.loadFont(kDefaultFont);

        gEngine.ResourceMap.setLoadCompletedCallback(
                function() { 
                    _createShaders(callback);
                });
    };
    
    var mPublic = {
        initialize: _initialize,
        getConstColorShader: _getConstColorShader,
        getTextureShader: _getTextureShader,
        getSpriteShader: _getSpriteShader,
        getGlobalAmbientColor: getGlobalAmbientColor,
        setGlobalAmbientColor: setGlobalAmbientColor,
        getGlobalAmbientIntensity: getGlobalAmbientIntensity,
        setGlobalAmbientIntensity: setGlobalAmbientIntensity,
        getDefaultFont: _getDefaultFont,
    };
    
    return mPublic;
}());