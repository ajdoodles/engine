/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TextureInfo(name, width, height, id) {
    this.mName = name;
    this.mWidth = width;
    this.mHeight = height;
    this.mGLTexID = id;
    this.mColorArray = null;
}

"use strict";
var gEngine = gEngine || {};
gEngine.Textures = (function () {

    var loadTexture = function (textureName, callback) {
        if (gEngine.ResourceMap.isAssetLoaded(textureName)) {
            gEngine.ResourceMap.incAssetRefCount(textureName);
            if (callback !== null && callback !== undefined) {
                callback(textureName);
            }
            return;
        }

        var img = new Image();

        gEngine.ResourceMap.asyncLoadRequested(textureName);

        img.onload = function () {
            _processLoadedImage(textureName, img);
            if (callback !== null && callback !== undefined) {
                callback(textureName);
            }
        };
        img.src = textureName;
    };
    
    // I think this is broken, deleting the texture before checking for any
    // remaining references could break things if this texture is being used
    // elsewhere
    var unloadTexture = function(textureName) {
        var gl = gEngine.Core.getGL();
        var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);
        gl.deleteTexture(texInfo.mGLTexID);
        gEngine.ResourceMap.unloadAsset(textureName);
    };

    var _processLoadedImage = function (textureName, img) {
        var gl = gEngine.Core.getGL();
        var textureID = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, textureID);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        var texInfo =
                new TextureInfo(
                        textureName,
                        img.naturalWidth,
                        img.naturalHeight,
                        textureID);
        gEngine.ResourceMap.asyncLoadCompleted(textureName, texInfo);
    };
    
    var activateTexture = function(textureName) {
        var gl = gEngine.Core.getGL();
        var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);
        
        gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Blurred "cleaner" rendering of texture if magnified/minimized
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // Sharp rendering of texture if magnified/minimized
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);   
    };
    
    var deactivateTexture = function() {
        var gl = gEngine.Core.getGL();
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
    var getTextureInfo = function(textureName) {
        return gEngine.ResourceMap.retrieveAsset(textureName);
    };

    var getColorArray = function(textureName) {
        var texInfo = getTextureInfo(textureName);
        if (texInfo.mColorArray === null) {
            var gl = gEngine.Core.getGL();
            var fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.mGLTexID, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                var pixels = new Uint8Array(texInfo.mWidth * texInfo.mHeight * 4);
                gl.readPixels(0, 0, texInfo.mWidth, texInfo.mHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                texInfo.mColorArray = pixels;
            } else {
                alert("WARNING: Failed to retreive color array");
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(fb);
        }
        return texInfo.mColorArray;
    };

    var mPublic = {
        loadTexture: loadTexture,
        unloadTexture: unloadTexture,
        activateTexture: activateTexture,
        deactivateTexture: deactivateTexture,
        getTextureInfo: getTextureInfo,
        getColorArray: getColorArray,
    };

    return mPublic;
}());