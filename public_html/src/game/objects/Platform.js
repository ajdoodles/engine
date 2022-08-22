/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import core from "../../engine/core/Engine_Core.js";
import GameObject from "../../engine/gameobjects/GameObject.js";
import TextureRenderable from "../../engine/renderables/TextureRenderable.js";
import RigidRect from "../../engine/physics/RigidRect.js";

export default function Platform(spriteTexture) {
    this.kDelta = 0.3;
    this.kDeltaDegrees = 1;

    this.mPlatform = new TextureRenderable(spriteTexture);
    this.mPlatform.getXform().setSize(30, 3.75);
    this.mPlatform.getXform().setPosition(20, 33);
    GameObject.call(this, this.mPlatform);

    var rigidRect = new RigidRect(this.mPlatform.getXform(), 36, 6);
    rigidRect.setDrawBounds(true);
    this.setPhysicsComponent(rigidRect);
}
core.inheritPrototype(GameObject, Platform);

Platform.prototype.update = function () {
};
