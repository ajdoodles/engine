/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Camera.prototype.convertWCSizeToPx = function (wcSize) {
    return wcSize * this._mRenderCache.mWCToPixelsRatio;
};

Camera.prototype._getPixelsToWCRatio = function() {
    return this.getWCWidth()/this.mViewport[2];
};

Camera.prototype.getWCCursorPosition = function() {
    if (!this.isMouseInViewport()) {
        throw "Mouse not found in viewport, can't get position in world space."
    }
    
    var mousePos2DPx = gEngine.Input.getMousePosition();
    var vpOrigin = glMatrix.vec2.fromValues(this.getViewportLeft(), this.getViewportBottom());
    var bottomLeft = glMatrix.vec2.fromValues(this.getWCCenter()[0] - (this.getWCWidth()/2), this.getWCCenter()[1] - (this.getWCHeight()/2));
    
    var wcPos = glMatrix.vec2.create();
    glMatrix.vec2.sub(wcPos, mousePos2DPx, vpOrigin);
    glMatrix.vec2.scaleAndAdd(wcPos, bottomLeft, wcPos, this._getPixelsToWCRatio());
//    return glMatrix.vec3(wcPos[0], wcPos[1]);
    return wcPos;
};

Camera.prototype.convertWCPosToPx = function (wcPosition) {
    var x = wcPosition[0] - this._mRenderCache.mViewportLeftWC;
    x = this.mViewport[0] + (x * this._mRenderCache.mWCToPixelsRatio) + 0.5;

    var y = wcPosition[1] - this._mRenderCache.mViewportBottomWC;
    y = this.mViewport[1] + (y * this._mRenderCache.mWCToPixelsRatio) + 0.5;

    var z = wcPosition[2] * this._mRenderCache.mWCToPixelsRatio;
    return glMatrix.vec3.fromValues(x, y, z);
};

Camera.prototype.convertWCVecToPx = function(wcVec) {
    var result = glMatrix.vec3.create();
    glMatrix.vec3.scale(result, wcVec, this._mRenderCache.mWCToPixelsRatio);
    return result;
};
