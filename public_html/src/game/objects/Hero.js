/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import core from "../../engine/core/Engine_Core.js";
import GameObject from "../../engine/gameobjects/GameObject.js";
import IllumRenderable from "../../engine/renderables/IllumRenderable.js";
import LightRenderable from "../../engine/renderables/LightRenderable.js";
import RigidCircle from "../../engine/physics/RigidCircle.js";

export default function Hero(spriteTexture, normalTexture) {
    this.kDelta = 0.3;
    this.kDeltaDegrees = 1;
     
    if (normalTexture === null || normalTexture === undefined) {
        this.mHero = new LightRenderable(spriteTexture);
    } else {
        this.mHero = new IllumRenderable(spriteTexture, normalTexture);
    }
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(35, 50);
    this.mHero.getXform().incZPos(3);
    this.mHero.getXform().setSize(18, 24);
    this.mHero.setElementPixelCoordinates(0, 120, 0, 180);
    GameObject.call(this, this.mHero);
    
    var hitBox = new RigidCircle(this.mHero.getXform(), 9);
    hitBox.setDrawBounds(true);
    this.setPhysicsComponent(hitBox);
}
core.inheritPrototype(GameObject, Hero);

Hero.prototype.update = function () {
};
