/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import core from "../core/Engine_Core.js";
import textures from "../core/Engine_Textures.js";
import Renderable from "./Renderable.js";

export default function TextureRenderable(texture) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1.0, 1.0, 1.0, 0.0]);
    Renderable.prototype._setShader.call(this, ShaderFactory.getTextureShader());
    this.mTexture = texture;
    
    this.mTextureInfo = null;
    this.mColorArray = null;
    this.mTexWidth = 0;
    this.mTexHeight = 0;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
    this.setTexture(texture);
}
core.inheritPrototype(Renderable, TextureRenderable);

TextureRenderable.prototype.getTexture = function () {
    return this.mTexture;
};

TextureRenderable.prototype.setTexture = function (texture) {
    this.mTexture = texture;
    this.mTextureInfo = textures.getTextureInfo(texture);
    this.mColorArray = null;
    this.mTexWidth = this.mTextureInfo.mWidth;
    this.mTexHeight = this.mTextureInfo.mHeight;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
};

TextureRenderable.prototype.draw = function(camera) {
    textures.activateColorTexture(this.mTexture);
    Renderable.prototype.draw.call(this, camera);
};