/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TextureRenderable(texture) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1.0, 1.0, 1.0, 0.0]);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getTextureShader());
    this.mTexture = texture;
    
    this.mTextureInfo = null;
    this.mColorArray = null;
    this.mTexWidth = 0;
    this.mTexHeight = 0;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
    this.setTexture(texture);
}
gEngine.Core.inheritPrototype(Renderable, TextureRenderable);

TextureRenderable.prototype.getTexture = function () {
    return this.mTexture;
};

TextureRenderable.prototype.setTexture = function (texture) {
    this.mTexture = texture;
    this.mTextureInfo = gEngine.Textures.getTextureInfo(texture);
    this.mColorArray = null;
    this.mTexWidth = this.mTextureInfo.mWidth;
    this.mTexHeight = this.mTextureInfo.mHeight;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
};

TextureRenderable.prototype.draw = function(camera) {
    gEngine.Textures.activateTexture(this.mTexture);
    Renderable.prototype.draw.call(this, camera);
};