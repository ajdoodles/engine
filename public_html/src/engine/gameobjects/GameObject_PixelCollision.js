/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

GameObject.prototype.pixelTouches = function (otherObj, wcTouchPos) {
    var pixelTouches = false;
    var otherRen = otherObj.getRenderable();
    var thisRen = this.getRenderable();

    if (typeof otherRen.pixelTouches === "function"
            && typeof thisRen.pixelTouches === "function") {
        if (otherObj.getXform().getRotation() === 0
                && this.getXform().getRotation() === 0) {
            if (this.getBBox().intersects(otherObj.getBBox())) {
                thisRen.setColorArray();
                otherRen.setColorArray();
                pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
            }
        } else {
            var thisWidth = this.getXform().getWidth();
            var thisHeight = this.getXform().getHeight();
            var otherWidth = otherObj.getXform().getWidth();
            var otherHeight = otherObj.getXform().getHeight();
            
            var thisRadius = Math.sqrt(Math.pow(thisWidth* 0.5, 2) + Math.pow(thisHeight* 0.5, 2));
            var otherRadius = Math.sqrt(Math.pow(otherWidth* 0.5, 2) + Math.pow(otherHeight* 0.5, 2));
            
            var delta = [];
            vec2.sub(delta, this.getXform().getPosition(), otherObj.getXform().getPosition());
            if (vec2.length(delta) < (thisRadius + otherRadius)) {
                thisRen.setColorArray();
                otherRen.setColorArray();
                pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
            }
        }
    }

    return pixelTouches;
};