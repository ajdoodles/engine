/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Scene from "../../engine/Scene.js";
import textures from "../../engine/core/Engine_Textures.js";
import core from "../../engine/core/Engine_Core.js";
import input from "../../engine/core/Engine_Input.js";
import Camera from "../../engine/cameras/Camera.js";
import Renderable from "../../engine/renderables/Renderable.js";
import FontRenderable from "../../engine/renderables/FontRenderable.js";
import GameObjectSet from "../../engine/gameobjects/GameObjectSet.js";
import Platform from "../objects/Platform.js";
import Hero from "../objects/Hero.js";

export default function RigidShapeTest() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatform = "assets/platform.png";
    
    this.kFontImage = "assets/Consolas-72.png";
    
    this.kNumHeroes = 3;
    this.kNumMinions = 4;
    this.kNumPlatforms = 5;
}
core.inheritPrototype(Scene, RigidShapeTest);

RigidShapeTest.prototype.loadScene = function() {
    textures.loadTexture(this.kMinionSprite);
    textures.loadTexture(this.kPlatform);
    textures.loadTexture(this.kFontImage);
};

RigidShapeTest.prototype.unloadScene = function () {
    textures.unloadTexture(this.kMinionSprite);
    textures.unloadTexture(this.kPlatform);
    textures.unloadTexture(this.kFontImage);
};

RigidShapeTest.prototype.initialize = function () {
    this._initCamera();
    
    this.mSquare = new Renderable();
    var xForm = this.mSquare.getXform();
    xForm.setSize(30, 30);
    xForm.setPosition(10, 10);
        
    this.mMsg = new FontRenderable("Is this working?");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);
    
    this.mObjectSet = new GameObjectSet();
    this.mObjectSet.addObject(new Platform(this.kPlatform));
    this.mObjectSet.addObject(new Platform(this.kPlatform));
    this.mObjectSet.addObject(new Hero(this.kMinionSprite));
    this.mObjectSet.addObject(new Hero(this.kMinionSprite));
    this.mObjectSet.selectObjectAt(0);
    this.mObjectSet.setAlertCollisions(true);
};

RigidShapeTest.prototype._initCamera = function () {
    this.mCamera =
        new Camera(
            glMatrix.vec2.fromValues(50, 37.5),
            100,
            [0, 0, 640, 480]);
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
};

RigidShapeTest.prototype.update = function () {
    this.mCamera.update();
    
    if (input.isKeyClicked(input.keys.E)) {
        this.mObjectSet.incSelected();
    } else if (input.isKeyClicked(input.keys.Q)) {
        this.mObjectSet.decSelected();
    }

    this.mObjectSet.update();
};

RigidShapeTest.prototype.draw = function () {
    core.clearCanvas([0.9, 0.9, 0.9, 1]);
    this.mCamera.setupViewProjection();

    this.mSquare.draw(this.mCamera);

    this.mMsg.draw(this.mCamera);
    this.mObjectSet.draw(this.mCamera);
};