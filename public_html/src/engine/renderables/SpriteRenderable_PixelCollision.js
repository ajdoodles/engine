/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

SpriteRenderable.prototype._setTexInfo = function() {
    var imageW = this.mTextureInfo.mWidth;
    var imageH = this.mTextureInfo.mHeight;
    
    this.mTexLeftIndex = this.mTexLeft * imageW;
    this.mTexBottomIndex = this.mTexBottom * imageH;
    
    this.mTexWidth = ((this.mTexRight - this.mTexLeft) * imageW) + 1;
    this.mTexHeight = ((this.mTexTop - this.mTexBottom) * imageH) + 1;
};

