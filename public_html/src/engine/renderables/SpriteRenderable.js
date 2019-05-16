/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SpriteRenderable(texture) {
    TextureRenderable.call(this, texture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

    this.mTexLeft = 0.0;
    this.mTexRight = 1.0;
    this.mTexTop = 1.0;
    this.mTexBottom = 0.0;
    this._setTexInfo();
}
gEngine.Core.inheritPrototype(TextureRenderable, SpriteRenderable);

SpriteRenderable.prototype.setElementUVCoordinates = function(left, right, bottom, top){
    this.mTexLeft = left;
    this.mTexRight = right;
    this.mTexBottom = bottom;
    this.mTexTop = top;
    this._setTexInfo();
};

SpriteRenderable.prototype.setElementPixelCoordinates = function(left, right, bottom, top) {
    var texInfo = gEngine.ResourceMap.retrieveAsset(this.mTexture);
    
    var imgHeight = texInfo.mHeight;
    var imgWidth = texInfo.mWidth;
    
    this.mTexLeft = left/imgWidth;
    this.mTexRight = right/imgWidth;
    this.mTexBottom = bottom/imgHeight;
    this.mTexTop = top/imgHeight;
    this._setTexInfo();
}

SpriteRenderable.prototype.getElementUVCoordinateArray = function() {
    return [
        this.mTexRight, this.mTexTop,
        this.mTexLeft, this.mTexTop,
        this.mTexRight, this.mTexBottom,
        this.mTexLeft, this.mTexBottom];
}

SpriteRenderable.prototype.draw = function(camera) {
    this.mShader.setTextureCoordinates(this.getElementUVCoordinateArray());
    TextureRenderable.prototype.draw.call(this, camera);
};