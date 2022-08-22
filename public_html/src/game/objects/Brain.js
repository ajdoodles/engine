/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../../engine/core/Engine_Core.js";
import GameObject from "../../engine/gameobjects/GameObject.js";

function Brain(spriteTexture) {
    this.kDeltaDegrees = 1;
    this.kDeltaRads = this.kDeltaDegrees * (Math.PI / 180);
    this.kDeltaSpeed = 0.01;

    this.mBrain = new LightRenderable(spriteTexture);
    this.mBrain.setColor([1, 1, 1, 0]);
    this.mBrain.getXform().setPosition(50, 10);
    this.mBrain.getXform().setSize(3, 5.4);
    this.mBrain.setElementPixelCoordinates(600, 700, 0, 180);
    GameObject.call(this, this.mBrain);
    this.setSpeed(0.05);
}
core.inheritPrototype(GameObject, Brain);

Brain.prototype.update = function () {
};