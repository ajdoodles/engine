/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import TextureRenderable from "./TextureRenderable.js";
import textures from "../core/Engine_Textures.js";
import { vec2 } from "../../gl-matrix/esm/index.js";

TextureRenderable.prototype.setColorArray = function() {
    if (this.mColorArray == null) {
        this.mColorArray = textures.getColorArray(this.mTexture);
    }
};

TextureRenderable.prototype._pixelAlphaValue = function(x, y) {
    x += this.mTexLeftIndex;
    y += this.mTexBottomIndex;
    x *= 4;
    y *= 4;
    return this.mColorArray[(this.mTextureInfo.mWidth * y) + x + 3];
};

/**
 * int i: pixel index along the x axis
 * int j: pixel index along the y axis
 * vec2 xVec: unit vector representing the rotated x-axis
 * vec2 yVec: unit vector representing the rotated y-axis
 */
TextureRenderable.prototype._indexToWCPosition = function(returnWCPos, i, j, xVec, yVec) {
    // x and y indices are computed in WC units from pixels
    var wcInsetX = i * this.mXform.getWidth() / (this.mTexWidth - 1);
    var wcInsetY = j * this.mXform.getHeight() / (this.mTexHeight - 1);
 
    // get vertical and horiontal offsets from center of object (WC units)
    var xDisp = wcInsetX - (this.mXform.getWidth() * 0.5);
    var yDisp = wcInsetY - (this.mXform.getHeight() * 0.5);
    var xDirDisp = [];
    var yDirDisp = [];
    
    // rotated axis unit vectors scaled with offsets from center
    vec2.scale(xDirDisp, xVec, xDisp);
    vec2.scale(yDirDisp, yVec, yDisp);
    
    // origin of the renderable in WC units
//    var textureOriginX = this.mXform.getXPos() - (this.mXform.getWidth() * 0.5);
//    var textureOriginY = this.mXform.getYPos() - (this.mXform.getHeight() * 0.5);
    
    // add rotated, scaled offset vectors toobjects center position (WC units)
    vec2.add(returnWCPos, this.mXform.getPosition(), xDirDisp);
    vec2.add(returnWCPos, returnWCPos, yDirDisp);
    
//    returnWCPos[0] = textureOriginX + wcInsetX;
//    returnWCPos[1] = textureOriginY + wcInsetY;
};

TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos,  xVec, yVec) {
    var delta = [];
    // 2d offset from object center to given position (WC units)
    vec2.sub(delta, wcPos, this.mXform.getPosition());
    
    var xDisp = vec2.dot(delta, xVec);
    var yDisp = vec2.dot(delta, yVec);
    
    returnIndex[0] = this.mTexWidth * (xDisp / this.mXform.getWidth());
    returnIndex[1] = this.mTexHeight * (yDisp / this.mXform.getHeight());
    
//    returnIndex[0] = this.mTexWidth * (delta[0] / this.mXform.getWidth());
//    returnIndex[1] = this.mTexHeight * (delta[1] / this.mXform.getHeight());
    
    returnIndex[0] += this.mTexWidth * 0.5;
    returnIndex[1] += this.mTexHeight * 0.5;
    
    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

TextureRenderable.prototype.pixelTouches = function(other, wcTouchPos) {
    var pixelTouches = false;
    var xIndex = 0;
    var yIndex = 0;
    var otherIndex = [0, 0];
       
    var origin = [0, 0];
    var xVec = [1, 0];
    var yVec = [0, 1];
    var xVecOther = [1, 0];
    var yVecOther = [0, 1];
    vec2.rotate(xVec, xVec, origin, this.mXform.getRotation());
    vec2.rotate(yVec, yVec, origin, this.mXform.getRotation());
    vec2.rotate(xVecOther, xVecOther, origin, other.mXform.getRotation());
    vec2.rotate(yVecOther, yVecOther, origin, other.mXform.getRotation());
       
    while (!pixelTouches && (xIndex < this.mTexWidth)) {
        yIndex = 0;
        while (!pixelTouches && (yIndex < this.mTexHeight)) {
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xVec, yVec);
                other._wcPositionToIndex(otherIndex, wcTouchPos, xVecOther, yVecOther);
                if (otherIndex[0] > 0 && otherIndex[0] < other.mTexWidth
                        && otherIndex[1] > 0 && otherIndex[1] < other.mTexHeight) {
                    pixelTouches = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0; 
                }
            }
            yIndex++;
        }
        xIndex++;
    }
    return pixelTouches;
};