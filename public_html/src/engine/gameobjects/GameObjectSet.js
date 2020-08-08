/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameObjectSet() {
    this.kDelta = 0.3;

    this.mSet = new Array();
    this.mSelected = -1;
}

GameObjectSet.prototype.size = function() {
    return this.mSet.length;
};

GameObjectSet.prototype.getObjectAt = function(index) {
    return this.mSet[index];
};

GameObjectSet.prototype._isValidIndex = function (index) {
    return index !== undefined && index !== null
            && index >= 0 && index < this.mSet.length;
};
GameObjectSet.prototype.selectObjectAt = function(index) {
    if (this.mSet.length === 0) {
        throw "No objects to select";
    }
    if (!this._isValidIndex(index)) {
        throw "Index ["+index+"] is invalid, no object selected";
    }
    this.mSelected = index;
    console.log(this.mSelected + " is currently selected");
};
GameObjectSet.prototype.deselectObject = function() {
    this.mSelected = -1;
};
GameObjectSet.prototype.hasValidSelection = function () {
    return this._isValidIndex(this.mSelected);
};
GameObjectSet.prototype.getSelectedObject = function () {
    return this.hasValidSelection() ? this.mSet[this.mSelected] : null;
};
/**
 * Increments the current selection index. Wraps the index to 0 if incrementing
 * past the length of the array.
 * NOTE: If there is no selected object, this will attempt to select the first
 * object using {@function selectObjectAt}.
 */
GameObjectSet.prototype.incSelected = function () {
    var index = (this.mSelected + 1) % this.mSet.length;
    this.selectObjectAt(index);
};
/**
 * Decrements the current selection index. Wraps to the last index if
 * decrementing below 0.
 * NOTE: If there is no selected object, this will attempt to select the last
 * object using {@function selectObjectAt}.
 */
GameObjectSet.prototype.decSelected = function () {
    var index =
            (this.mSelected <= 0 ? this.mSet.length - 1 : this.mSelected - 1);
    this.selectObjectAt(index);
};

GameObjectSet.prototype.addObject = function(obj) {
    this.mSet.push(obj);
};

GameObjectSet.prototype.update = function() {
    if (this.hasValidSelection()) {
        var xform = this.getSelectedObject().getXform();
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
            xform.incYPos(this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
            xform.incXPos(-this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
            xform.incYPos(-this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
            xform.incXPos(this.kDelta);
        }
    }

    for (var i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update();
    }
};

GameObjectSet.prototype.draw = function(camera) {
    for (var i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(camera);
    }
};