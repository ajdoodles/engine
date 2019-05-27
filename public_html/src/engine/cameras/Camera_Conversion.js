/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Camera.prototype.getPixelsSize = function (wcSize) {
    return wcSize * this._getWCToPixelsRatio();
};

/**
 * @returns {Number} float representing the ratio from WC space (world units)
 *                   to DC space (pixels)
 */
Camera.prototype._getWCToPixelsRatio = function() {
    return this.mViewport[2]/this.getWCWidth();
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
    var pixelsOrigin =
            vec3.fromValues(
                this.getViewportLeft(),
                this.getViewportBottom(),
                0);
    var bottomLeft = vec3.fromValues(this.getWCLeft(), this.getWCBottom(), 0);

    var pixelsPos = vec3.create();
    vec3.sub(pixelsPos, wcPosition, bottomLeft);
    vec3.scaleAndAdd(pixelsPos, pixelsOrigin, pixelsPos, this._getWCToPixelsRatio());
    return pixelsPos;
};