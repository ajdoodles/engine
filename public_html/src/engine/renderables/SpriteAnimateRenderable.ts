/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import resourceMap from "../core/resources/Engine_ResourceMap.js";
import TextureInfo from "../core/TextureInfo.js";
import SpriteRenderable from "./SpriteRenderable.js";



export default class SpriteAnimateRenderable extends SpriteRenderable {
    
    static eAnimationType = Object.freeze({
        eAnimateRight: 0,
        eAnimateLeft: 1,
        eAnimateSwing: 2,
    });

    firstElmLeft = 0.0;
    elmTop = 1.0;
    elmWidth = 1.0;
    elmHeight = 1.0;
    widthPadding = 0.0;
    numElems = 1;

    animationType: number = SpriteAnimateRenderable.eAnimationType.eAnimateRight;;
    updateInterval = 1;

    currentElem = 0;
    currentAnimAdvance = -1.0;

    currentTick = 0;

    constructor(texture:string) {
        super(texture);
        
        this._initAnimation();
    }


    setAnimationType(animationType:number) {
        this.animationType = animationType;
        this.currentElem = -2;
        this.currentAnimAdvance = -1;
        this._initAnimation();
    }

    _initAnimation() {
        this.currentTick = 0;
        switch (this.animationType) {
            case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
                this.currentElem = 0;
                this.currentAnimAdvance = 1;
                break;

            case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
                this.currentElem = this.numElems - 1;
                this.currentAnimAdvance = -1;
                break;

            // Assumes that currentElem is just out of bounds on either side
            // 2*animAdvance brings currentElem back inBounds, skipping the first
            // and last frames to avoid rendering the same frame twice
            case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
                this.currentAnimAdvance = -1 * this.currentAnimAdvance;
                this.currentElem += 2 * this.currentAnimAdvance;
                break;

            default:
        }
        this._setSpriteElement();
    };

    _setSpriteElement() {
        const left = this.firstElmLeft + (this.currentElem * (this.elmWidth + this.widthPadding));
        
        this.setElementUVCoordinates(left, left + this.elmWidth, this.elmTop - this.elmHeight, this.elmTop);
    };

    setSpriteSequence(
            topPixel: number,
            leftPixel: number,
            elementWidthPx: number,
            elementHeightPx: number,
            numElements: number,
            widthPaddingPx: number) {
        const texInfo : TextureInfo = resourceMap.retrieveAsset(this.texture);
        const imgHeight = texInfo.height;
        const imgWidth = texInfo.width;
        
        this.firstElmLeft = leftPixel/imgWidth;
        this.elmTop = topPixel/imgHeight;
        this.elmWidth = elementWidthPx/imgWidth;
        this.elmHeight = elementHeightPx/imgHeight;
        this.numElems = numElements;
        this.widthPadding = widthPaddingPx/imgWidth;
        this._initAnimation();
    }

    setAnimationSpeed(tickInterval: number) {
        this.updateInterval = tickInterval;
    };

    incAnimationSpeed(delta: number) {
        this.updateInterval += delta;
    };

    update() {
        this.currentTick++;
        if ((this.currentTick % this.updateInterval) === 0) {
            this.currentElem += this.currentAnimAdvance;
            if ((this.currentElem >= 0) && (this.currentElem < this.numElems)) {
                this._setSpriteElement();
            } else {
                this._initAnimation();
            }
        }
    };
}