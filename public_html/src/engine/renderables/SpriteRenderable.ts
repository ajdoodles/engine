/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import resourceMap from "../core/resources/Engine_ResourceMap.js";
import TextureRenderable from "./TextureRenderable.js";
import Camera from "../cameras/Camera.js";
import SpriteShader from "../shaders/SpriteShader.js";

export default class SpriteRenderable extends TextureRenderable {
    texLeft: number;
    texRight: number;
    texTop: number;
    texBottom: number;
    
    constructor(texture:string) {
        super(texture);
        this._setShader(ShaderFactory.getSpriteShader());

        this.texLeft = 0.0;
        this.texRight = 1.0;
        this.texTop = 1.0;
        this.texBottom = 0.0;
        this._setTexInfo();
    }

    setElementUVCoordinates(left: number, right: number, bottom: number, top: number){
        this.texLeft = left;
        this.texRight = right;
        this.texBottom = bottom;
        this.texTop = top;
        this._setTexInfo();
    };

    setElementPixelCoordinates(left: number, right: number, bottom: number, top: number) {
        const texInfo = resourceMap.retrieveAsset(this.texture);
        
        const imgHeight = texInfo.height;
        const imgWidth = texInfo.width;
        
        this.texLeft = left/imgWidth;
        this.texRight = right/imgWidth;
        this.texBottom = bottom/imgHeight;
        this.texTop = top/imgHeight;
        this._setTexInfo();
    }

    getElementUVCoordinateArray() : UVCoordArray {
        return [
            this.texRight, this.texTop,
            this.texLeft, this.texTop,
            this.texRight, this.texBottom,
            this.texLeft, this.texBottom];
    }

    draw(camera:Camera) {
        (this.shader as SpriteShader).setTextureCoordinates(this.getElementUVCoordinateArray());
        TextureRenderable.prototype.draw.call(this, camera);
    };

    _setTexInfo() {
        const imageW = this.textureInfo.width;
        const imageH = this.textureInfo.height;
        
        this.texLeftIndex = this.texLeft * imageW;
        this.texBottomIndex = this.texBottom * imageH;
        
        this.texWidth = ((this.texRight - this.texLeft) * imageW) + 1;
        this.texHeight = ((this.texTop - this.texBottom) * imageH) + 1;
    };
}