/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import TextureInfo from "./TextureInfo.js";
import resourceMap from "./resources/Engine_ResourceMap.js";
import core from "./Engine_Core.js";

export default (function () {

    var loadTexture = function (textureName, callback) {
        if (resourceMap.isAssetLoaded(textureName)) {
            resourceMap.incAssetRefCount(textureName);
            if (callback !== null && callback !== undefined) {
                callback(textureName);
            }
            return;
        }

        var img = new Image();

        resourceMap.asyncLoadRequested(textureName);

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
        var gl = core.getGL();
        var texInfo = resourceMap.retrieveAsset(textureName);
        gl.deleteTexture(texInfo.glTexID);
        resourceMap.unloadAsset(textureName);
    };

    var _processLoadedImage = function (textureName, img) {
        var gl = core.getGL();
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
        resourceMap.asyncLoadCompleted(textureName, texInfo);
    };
    
    var activateColorTexture = function(textureName) {
        var gl = core.getGL();
        _activateTexture(textureName, gl.TEXTURE0);
    };
    
    var activateNormalTexture = function (textureName) {
        var gl = core.getGL();
        _activateTexture(textureName, gl.TEXTURE1);
    };
    
    var _activateTexture = function (textureName, textureUnit) {
        var gl = core.getGL();
        var texInfo = resourceMap.retrieveAsset(textureName);
        
        gl.activeTexture(textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texInfo.glTexID);

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
        var gl = core.getGL();
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
    var getTextureInfo = function(textureName) {
        return resourceMap.retrieveAsset(textureName);
    };

    var getColorArray = function(textureName) {
        var texInfo = getTextureInfo(textureName);
        if (texInfo.colorArray === null) {
            var gl = core.getGL();
            var fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.glTexID, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                var pixels = new Uint8Array(texInfo.width * texInfo.height * 4);
                gl.readPixels(0, 0, texInfo.width, texInfo.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                texInfo.colorArray = pixels;
            } else {
                alert("WARNING: Failed to retreive color array");
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(fb);
        }
        return texInfo.colorArray;
    };

    var mPublic = {
        loadTexture: loadTexture,
        unloadTexture: unloadTexture,
        activateColorTexture: activateColorTexture,
        activateNormalTexture: activateNormalTexture,
        deactivateTexture: deactivateTexture,
        getTextureInfo: getTextureInfo,
        getColorArray: getColorArray,
    };

    return mPublic;
}());