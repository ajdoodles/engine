/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_Core.js";
import resourceMap from "../core/resources/Engine_ResourceMap.js";
import SpriteRenderable from "./SpriteRenderable.js";

SpriteAnimateRenderable.eAnimationType = Object.freeze({
    eAnimateRight: 0,
    eAnimateLeft: 1,
    eAnimateSwing: 2,
});

function SpriteAnimateRenderable(texture) {
    SpriteRenderable.call(this, texture);
    
    this.mFirstElmLeft = 0.0;
    this.mElmTop = 1.0;
    this.mElmWidth = 1.0;
    this.mElmHeight = 1.0;
    this.mWidthPadding = 0.0;
    this.mNumElems = 1;
    
    this.mAnimationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;
    this.mUpdateInterval = 1;
    
    this.mCurrentElem = 0;
    this.mCurrentAnimAdvance = -1.0;
    
    this._initAnimation();
}
core.inheritPrototype(SpriteRenderable, SpriteAnimateRenderable);


SpriteAnimateRenderable.prototype.setAnimationType = function(animationType) {
    this.mAnimationType = animationType;
    this.mCurrentElem = -2;
    this.mCurrentAnimAdvance = -1;
    this._initAnimation();
}

SpriteAnimateRenderable.prototype._initAnimation = function() {
    this.mCurrentTick = 0;
    switch (this.mAnimationType) {
        case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
            this.mCurrentElem = 0;
            this.mCurrentAnimAdvance = 1;
            break;

        case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
            this.mCurrentElem = this.mNumElems - 1;
            this.mCurrentAnimAdvance = -1;
            break;

        // Assumes that currentElem is just out of bounds on either side
        // 2*animAdvance brings currentElem back inBounds, skipping the first
        // and last frames to avoid rendering the same frame twice
        case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
            this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance;
            this.mCurrentElem += 2 * this.mCurrentAnimAdvance;
            break;

        default:
    }
    this._setSpriteElement();
};

SpriteAnimateRenderable.prototype._setSpriteElement = function() {
    var left = this.mFirstElmLeft + (this.mCurrentElem * (this.mElmWidth + this.mWidthPadding));
    
    this.setElementUVCoordinates(left, left + this.mElmWidth, this.mElmTop - this.mElmHeight, this.mElmTop);
};

SpriteAnimateRenderable.prototype.setSpriteSequence = function(
        topPixel,
        leftPixel,
        elementWidthPx,
        elementHeightPx,
        numElements,
        widthPaddingPx) {
    var texInfo = resourceMap.retrieveAsset(this.mTexture);
    var imgHeight = texInfo.mHeight;
    var imgWidth = texInfo.mWidth;
    
    this.mFirstElmLeft = leftPixel/imgWidth;
    this.mElmTop = topPixel/imgHeight;
    this.mElmWidth = elementWidthPx/imgWidth;
    this.mElmHeight = elementHeightPx/imgHeight;
    this.mNumElems = numElements;
    this.mWidthPadding = widthPaddingPx/imgWidth;
    this._initAnimation();
};

SpriteAnimateRenderable.prototype.setAnimationSpeed = function(tickInterval) {
    this.mUpdateInterval = tickInterval;
};

SpriteAnimateRenderable.prototype.incAnimationSpeed = function(delta) {
    this.mUpdateInterval += delta;
};

SpriteAnimateRenderable.prototype.update = function() {
    this.mCurrentTick++;
    if ((this.mCurrentTick % this.mUpdateInterval) === 0) {
        this.mCurrentElem += this.mCurrentAnimAdvance;
        if ((this.mCurrentElem >= 0) && (this.mCurrentElem < this.mNumElems)) {
            this._setSpriteElement();
        } else {
            this._initAnimation();
        }
    }
};