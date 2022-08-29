/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import textures from "../core/Engine_Textures.js";
import Renderable from "./Renderable.js";
import TextureInfo from "../core/TextureInfo.js";
import Camera from "../cameras/Camera.js";
import { vec2 } from "gl-matrix";

export default class TextureRenderable extends Renderable {
  texture: string;
  textureInfo!: TextureInfo;
  colorArray?: Uint8Array;
  texWidth = 0;
  texHeight = 0;
  texLeftIndex = 0;
  texBottomIndex = 0;

  constructor(texture: string) {
    super();

    this.setColor([1.0, 1.0, 1.0, 0.0]);
    this._setShader(ShaderFactory.getTextureShader());

    this.texture = texture;
    this.setTexture(texture);
  }

  getTexture() {
    return this.texture;
  }

  setTexture(texture: string) {
    this.texture = texture;
    this.textureInfo = textures.getTextureInfo(texture) as TextureInfo;
    this.colorArray = this.textureInfo.colorArray;
    this.texWidth = this.textureInfo.width;
    this.texHeight = this.textureInfo.height;
    this.texLeftIndex = 0;
    this.texBottomIndex = 0;
  }

  draw(camera: Camera) {
    textures.activateColorTexture(this.texture);
    Renderable.prototype.draw.call(this, camera);
  }

  setColorArray() {
    if (this.colorArray == null) {
      this.colorArray = textures.getColorArray(this.texture);
    }
  }

  _pixelAlphaValue(x: number, y: number) {
    if (this.colorArray === undefined) {
      throw "ATTEMPTING TO ACCESS PIXELS BEFORE COLOR ARRAY IS INITIALIZED";
    }
    x += this.texLeftIndex;
    y += this.texBottomIndex;
    x *= 4;
    y *= 4;
    return this.colorArray[this.textureInfo.width * y + x + 3];
  }

  /**
   * int i: pixel index along the x axis
   * int j: pixel index along the y axis
   * vec2 xVec: unit vector representing the rotated x-axis
   * vec2 yVec: unit vector representing the rotated y-axis
   */
  _indexToWCPosition(
    returnWCPos: vec2,
    i: number,
    j: number,
    xVec: vec2,
    yVec: vec2
  ) {
    // x and y indices are computed in WC units from pixels
    const wcInsetX = (i * this.xform.getWidth()) / (this.texWidth - 1);
    const wcInsetY = (j * this.xform.getHeight()) / (this.texHeight - 1);

    // get vertical and horiontal offsets from center of object (WC units)
    const xDisp = wcInsetX - this.xform.getWidth() * 0.5;
    const yDisp = wcInsetY - this.xform.getHeight() * 0.5;
    const xDirDisp = vec2.create();
    const yDirDisp = vec2.create();

    // rotated axis unit vectors scaled with offsets from center
    vec2.scale(xDirDisp, xVec, xDisp);
    vec2.scale(yDirDisp, yVec, yDisp);

    // origin of the renderable in WC units
    //    var textureOriginX = this.xform.getXPos() - (this.xform.getWidth() * 0.5);
    //    var textureOriginY = this.xform.getYPos() - (this.xform.getHeight() * 0.5);

    // add rotated, scaled offset vectors toobjects center position (WC units)
    vec2.add(returnWCPos, this.xform.getPosition(), xDirDisp);
    vec2.add(returnWCPos, returnWCPos, yDirDisp);

    //    returnWCPos[0] = textureOriginX + wcInsetX;
    //    returnWCPos[1] = textureOriginY + wcInsetY;
  }

  _wcPositionToIndex(returnIndex: vec2, wcPos: vec2, xVec: vec2, yVec: vec2) {
    const delta = vec2.create();
    // 2d offset from object center to given position (WC units)
    vec2.sub(delta, wcPos, this.xform.getPosition());

    const xDisp = vec2.dot(delta, xVec);
    const yDisp = vec2.dot(delta, yVec);

    returnIndex[0] = this.texWidth * (xDisp / this.xform.getWidth());
    returnIndex[1] = this.texHeight * (yDisp / this.xform.getHeight());

    //    returnIndex[0] = this.texWidth * (delta[0] / this.xform.getWidth());
    //    returnIndex[1] = this.texHeight * (delta[1] / this.xform.getHeight());

    returnIndex[0] += this.texWidth * 0.5;
    returnIndex[1] += this.texHeight * 0.5;

    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
  }

  pixelTouches(other: TextureRenderable, wcTouchPos: vec2) {
    let pixelTouches = false;
    let xIndex = 0;
    let yIndex = 0;
    const otherIndex = vec2.fromValues(0, 0);

    const origin = vec2.fromValues(0, 0);
    const xVec = vec2.fromValues(1, 0);
    const yVec = vec2.fromValues(0, 1);
    const xVecOther = vec2.fromValues(1, 0);
    const yVecOther = vec2.fromValues(0, 1);
    vec2.rotate(xVec, xVec, origin, this.xform.getRotation());
    vec2.rotate(yVec, yVec, origin, this.xform.getRotation());
    vec2.rotate(xVecOther, xVecOther, origin, other.xform.getRotation());
    vec2.rotate(yVecOther, yVecOther, origin, other.xform.getRotation());

    while (!pixelTouches && xIndex < this.texWidth) {
      yIndex = 0;
      while (!pixelTouches && yIndex < this.texHeight) {
        if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
          this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xVec, yVec);
          other._wcPositionToIndex(
            otherIndex,
            wcTouchPos,
            xVecOther,
            yVecOther
          );
          if (
            otherIndex[0] > 0 &&
            otherIndex[0] < other.texWidth &&
            otherIndex[1] > 0 &&
            otherIndex[1] < other.texHeight
          ) {
            pixelTouches =
              other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
          }
        }
        yIndex++;
      }
      xIndex++;
    }
    return pixelTouches;
  }
}
