/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Camera.prototype.getPixelsSize = function (wcSize) {
    return wcSize * this._mRenderCache.mWCToPixelsRatio;
};

Camera.prototype._getPixelsToWCRatio = function() {
    return this.getWCWidth()/this.mViewport[2];
};

Camera.prototype.getWCPosition = function(pixelPosition) {
    var vpOrigin = vec3.fromValues(this.getViewportLeft(), this.getViewportBottom(), 0);    
    var bottomLeft = vec3.fromValues(this.getWCLeft(), this.getWCBottom(), 0);
    
    var wcPos = vec3.create();
    vec3.sub(wcPos, pixelPosition, vpOrigin);
    vec3.scaleAndAdd(wcPos, bottomLeft, wcPos, this._getPixelsToWCRatio());
    return wcPos;
};

Camera.prototype.getPixelsPosition = function (wcPosition) {
    var x = wcPosition[0] - this._mRenderCache.mViewportLeftWC;
    x = this.mViewport[0] + (x * this._mRenderCache.mWCToPixelsRatio);

    var y = wcPosition[1] - this._mRenderCache.mViewportBottomWC;
    y = this.mViewport[1] + (y * this._mRenderCache.mWCToPixelsRatio);

    var z = wcPosition[2] * this._mRenderCache.mWCToPixelsRatio;
    return vec3.fromValues(x, y, z);
};