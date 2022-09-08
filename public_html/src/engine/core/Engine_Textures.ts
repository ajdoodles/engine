/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import TextureInfo from "./TextureInfo.js";
import resourceMap from "./resources/Engine_ResourceMap.js";
import core from "./Engine_GL.js";

const loadTexture = function (
  textureName: string,
  callback?: (arg0: string) => void
) {
  if (resourceMap.isAssetLoaded(textureName)) {
    resourceMap.incAssetRefCount(textureName);
    if (callback !== null && callback !== undefined) {
      callback(textureName);
    }
    return;
  }

  const img = new Image();

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
const unloadTexture = function (textureName: string) {
  const gl = core.getGL();
  const texInfo = resourceMap.retrieveAsset(textureName) as TextureInfo;
  gl.deleteTexture(texInfo.glTexID);
  resourceMap.unloadAsset(textureName);
};

const _processLoadedImage = function (
  textureName: string,
  img: HTMLImageElement
) {
  const gl = core.getGL();
  const textureID = gl.createTexture() as WebGLTexture;

  gl.bindTexture(gl.TEXTURE_2D, textureID);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);

  const texInfo = new TextureInfo(
    textureName,
    img.naturalWidth,
    img.naturalHeight,
    textureID
  );
  resourceMap.asyncLoadCompleted(textureName, texInfo);
};

const activateColorTexture = function (textureName: string) {
  const gl = core.getGL();
  _activateTexture(textureName, gl.TEXTURE0);
};

const activateNormalTexture = function (textureName: string) {
  const gl = core.getGL();
  _activateTexture(textureName, gl.TEXTURE1);
};

const _activateTexture = function (textureName: string, textureUnit: GLenum) {
  const gl = core.getGL();
  const texInfo = resourceMap.retrieveAsset(textureName) as TextureInfo;

  gl.activeTexture(textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texInfo.glTexID);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Blurred "cleaner" rendering of texture if magnified/minimized

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );

  // Sharp rendering of texture if magnified/minimized
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
};

const deactivateTexture = function () {
  const gl = core.getGL();
  gl.bindTexture(gl.TEXTURE_2D, null);
};

const getTextureInfo = function (textureName: string) {
  return resourceMap.retrieveAsset(textureName);
};

const getColorArray = function (textureName: string) {
  const texInfo = getTextureInfo(textureName) as TextureInfo;
  if (texInfo.colorArray === null) {
    const gl = core.getGL();
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texInfo.glTexID,
      0
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
      const pixels = new Uint8Array(texInfo.width * texInfo.height * 4);
      gl.readPixels(
        0,
        0,
        texInfo.width,
        texInfo.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      );
      texInfo.colorArray = pixels;
    } else {
      alert("WARNING: Failed to retreive color array");
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
  }
  return texInfo.colorArray;
};

const mPublic = {
  loadTexture: loadTexture,
  unloadTexture: unloadTexture,
  activateColorTexture: activateColorTexture,
  activateNormalTexture: activateNormalTexture,
  deactivateTexture: deactivateTexture,
  getTextureInfo: getTextureInfo,
  getColorArray: getColorArray,
};

export default mPublic;
