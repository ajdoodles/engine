/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

ShadowReceiver.prototype._shadowReceiverStencilOn = function () {
    var gl = gEngine.Core.getGL();
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.enable(gl.STENCIL_TEST);
    gl.colorMask(false, false, false, false);
    gl.depthMask(false);
    gl.stencilFunc(gl.NEVER, this.kShadowStencilBit, this.kShadowStencilMask);
    gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
    gl.stencilMask(this.kShadowStencilMask);
};

ShadowReceiver.prototype._shadowReceiverStencilOff = function () {
    var gl = gEngine.Core.getGL();
    gl.depthMask(gl.TRUE);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.EQUAL, this.kShadowStencilBit, this.kShadowStencilMask);
    gl.colorMask(true, true, true, true);
};

ShadowReceiver.prototype._shadowReceiverStencilDisable = function () {
    var gl = gEngine.Core.getGL();
    gl.disable(gl.STENCIL_TEST);
};
