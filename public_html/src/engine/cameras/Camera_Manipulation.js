/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Camera.prototype.update = function() {
    if (this.mCameraShake !== null) {
        if (this.mCameraShake.shakeDone()) {
            this.mCameraShake = null;
        } else {
            this.mCameraShake.setCenter(this.getWCCenter());
            this.mCameraShake.updateShakeState();
        }
    }
    this.mCameraState.update();
};

Camera.prototype.configInterpolation = function(stiffness, duration) {
    this.mCameraState.configInterpolation(stiffness, duration);
}

Camera.prototype.panBy = function(dx, dy) {
    var center = glMatrix.vec2.clone(this.getWCCenter());
    this.setWCCenter(center[0] + dx, center[1] + dy);
};

Camera.prototype.panTo = function(px, py) {
    this.setWCCenter(px, py);
};

Camera.prototype.panWith = function(xform, zone) {
    var status = this.collideWCBound(xform, zone);
    if (status !== BoundingBox.eBoundCollideStatus.eInside) {
        var newC = glMatrix.vec2.clone(this.getWCCenter());
        var pos = xform.getPosition();
        if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
            newC[0] = pos[0] - xform.getWidth()/2 + (this.getWCWidth()*zone)/2;
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
            newC[0] = pos[0] + xform.getWidth()/2 - (this.getWCWidth()*zone)/2;
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
            newC[1] = pos[1] + xform.getHeight()/2 - (this.getWCHeight()*zone)/2;
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
            newC[1] = pos[1] - xform.getHeight()/2 + (this.getWCHeight()*zone)/2;
        }
        this.mCameraState.setCenter(newC);
    }
    return status;
};

Camera.prototype.zoomBy = function(zoom) {
    if (zoom > 0) {
        this.setWCWidth(this.getWCWidth() * zoom);
    }
};

Camera.prototype.zoomTowards = function (pos, zoom) {
    if (zoom > 0) {
        var delta = [];
        var center = glMatrix.vec2.clone(this.getWCCenter());
        glMatrix.vec2.sub(delta, pos, center);
        glMatrix.vec2.scale(delta, delta, zoom - 1);
        glMatrix.vec2.sub(center, center, delta);
        this.mCameraState.setCenter(center);
        this.zoomBy(zoom);
    }
};

Camera.prototype.startShake = function (initDeltaX, initDeltaY, numOscillations, duration) {
    this.mCameraShake =
            new CameraShake(
                    glMatrix.vec2.clone(this.mCameraState.getCenter()),
                    initDeltaX,
                    initDeltaY,
                    numOscillations,
                    duration);
}