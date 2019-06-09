/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PreRenderCache() {
    var mWCToPixelsRatio = 1;
    var mViewportBottomWC = -1;
    var mViewportLeftWC = -1;
};

/**
 * Defines a camera that will draw a section of the world on to a section of
 * canvas known as a viewport. 
 * @param {type} wcCenter position to look at in WC space (world units).
 * @param {type} wcWidth the size of the "frame" the camera looks through.
 *                       In other words, the frame's left is wcCenter -
 *                       (wcWidth/2), bottom is wcCenter - (wcHeight/2). The
 *                       frame is wcWidth world units wide AND
 *                       (bounds - 2*borderPx) pixels wide. 
 * @param {type} bounds area of canvas in DC space on which to draw. Strictly
 *                      contains the viewport.
 * @param {type} borderPx space between the viewport and the outer bounds.
 * @returns {Camera}
 */
function Camera(wcCenter, wcWidth, bounds, borderPx = 0) {
    this.kCameraZ = 10;
    
    this.mCameraState = new CameraState(wcCenter, wcWidth);
    this._mRenderCache = new PreRenderCache();
    this.mCameraShake = null;
    
    this.mViewport = [];
    this.mScissorBounds = []; 
    this.mViewportBorderPx = borderPx;
    
    this.setBounds(bounds, this.mViewportBorderPx);
    
    this.mNearPlane = 0;
    this.mFarPlane = 1000;
    
    this.mViewMatrix = mat4.create();
    this.mProjMatrix = mat4.create();
    this.mViewProjMatrix = mat4.create();
    
    this.mBgColor = [0.8, 0.8, 0.8, 1.0];
};

Camera.prototype.setWCCenter = function(xPos, yPos) {
    this.mCameraState.setCenter(vec2.fromValues(xPos, yPos));
};

Camera.prototype.getWCCenter = function() {
    return this.mCameraState.getCenter();
};

Camera.prototype.setWCWidth = function(width) {
//    this.mWCWidth = width;
    this.mCameraState.setWidth(width);
};

Camera.prototype.getWCWidth = function() {
    return this.mCameraState.getWidth();
};

Camera.prototype.getWCHeight = function() {
    return this.getWCWidth() * (this.mViewport[3] / this.mViewport[2]);
};

Camera.prototype.getViewportLeft = function() {
    return this.mViewport[0];
};

Camera.prototype.getViewportBottom = function() {
    return this.mViewport[1];
};

Camera.prototype.setBackgroundColor = function(color) {
    this.mBgColor = color;
};

Camera.prototype.getBackgroundColor = function() {
    return this.mBgColor;
};

Camera.prototype.getVPMatrix = function() {
    return this.mViewProjMatrix;
};

Camera.prototype.getBounds = function() {
    var out = [];
    out[0] = this.mScissorBounds[0];
    out[1] = this.mScissorBounds[1];
    out[2] = this.mScissorBounds[2];
    out[3] = this.mScissorBounds[3];
    return out;
};

Camera.prototype.setBounds = function(bounds, borderPx) {
    if (borderPx !== undefined) {
        this.mViewportBorderPx = borderPx;
    } else {
        borderPx = this.mViewportBorderPx;
    }
    
    this.mViewport[0] = bounds[0] + borderPx;
    this.mViewport[1] = bounds[1] + borderPx;
    this.mViewport[2] = bounds[2] - (borderPx * 2);
    this.mViewport[3] = bounds[3] - (borderPx * 2);
    
    this.mScissorBounds[0] = bounds[0];
    this.mScissorBounds[1] = bounds[1];
    this.mScissorBounds[2] = bounds[2];
    this.mScissorBounds[3] = bounds[3];
};

Camera.prototype.setupViewProjection = function() {
    var gl = gEngine.Core.getGL();
    
    var bounds = this.mScissorBounds;
    gl.viewport(this.mViewport[0], this.mViewport[1], this.mViewport[2], this.mViewport[3]);
    gl.scissor(bounds[0], bounds[1], bounds[2], bounds[3]);
    
    gl.enable(gl.SCISSOR_TEST);
    gEngine.Core.clearCanvas(this.mBgColor);
    gl.disable(gl.SCISSOR_TEST);
    
    var center = [];
    if (this.mCameraShake === null) {
        center = this.getWCCenter();
    } else {
        center = this.mCameraShake.getShookPos();
    }
    
    mat4.lookAt(
        this.mViewMatrix,
        [center[0], center[1], 10], // Camera position
        [center[0], center[1], 0], // lookat position
        [0, 1, 0]); //orientation

    var wcHalfWidth = this.getWCWidth() * 0.5;
    var wcHalfHeight = this.getWCHeight() * 0.5;

    mat4.ortho(
        this.mProjMatrix,
        -wcHalfWidth, // Distance to left edge of world space
        wcHalfWidth, // distance to right edge of world space
        -wcHalfHeight, // " bottom edge
        wcHalfHeight, // " top edge
        this.mNearPlane, // z-distance to near plane
        this.mFarPlane); // z-distance to far plane
        
    mat4.multiply(this.mViewProjMatrix, this.mProjMatrix, this.mViewMatrix);

    this._mRenderCache.mWCToPixelsRatio = this.mViewport[2]/this.getWCWidth();
    this._mRenderCache.mViewportLeftWC = this.getWCCenter()[0] - (this.getWCWidth()/2);
    this._mRenderCache.mViewportBottomWC = this.getWCCenter()[1] - (this.getWCHeight()/2);
};

Camera.prototype.collideWCBound = function(xform, zone) {
    var xformBounds = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    var zoneWidth = zone * this.getWCWidth();
    var zoneHeight = zone * this.getWCHeight();
    var zoneBounds = new BoundingBox(this.getWCCenter(), zoneWidth, zoneHeight);
    return zoneBounds.boundCollideStatus(xformBounds);
};

Camera.prototype.clampAtBoundary = function(xform, zone) {
    var status = this.collideWCBound(xform, zone);
    if (status !== BoundingBox.eBoundCollideStatus.eInside) {
        var pos = xform.getPosition();
        if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
            pos[0] = this.getWCCenter()[0] - (this.getWCWidth()*zone)/2 + xform.getWidth()/2;
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
            pos[0] = this.getWCCenter()[0] + (this.getWCWidth()*zone)/2 - xform.getWidth()/2;
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
            pos[1] = this.getWCCenter()[1] + (this.getWCHeight()*zone)/2 - xform.getHeight()/2;
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
            pos[1] = this.getWCCenter()[1] - (this.getWCHeight()*zone)/2 + xform.getHeight()/2;
        }
    }
    return status;
};

Camera.prototype.isMouseInViewport = function() {
    var mousePos = gEngine.Input.getMousePosition();
    var x = mousePos[0] - this.mViewport[0];
    var y = mousePos[1] - this.mViewport[1];
    
    var inside = (0 <= x && x < this.mViewport[2]);
    return inside && (0 <= y && y < this.mViewport[3]);
};

Camera.prototype.getWCCursorPosition = function () {
    if (!this.isMouseInViewport()) {
        throw "Can't get world position for cursor not in viewport.";
    }
    
    var screenPos = gEngine.Input.getMousePosition();
    screenPos = vec3.fromValues(screenPos[0], screenPos[1], 0);
    var wcPos = this.getWCPosition(screenPos);
    return vec2.fromValues(wcPos[0], wcPos[1]);
};