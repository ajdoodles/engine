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
import { vec2 } from "gl-matrix";

export default class RigidShapeTest extends Scene {
  square!: Renderable;
  message!: FontRenderable;
  camera!: Camera;
  objectSet!: GameObjectSet;

  minionSprite: string;
  platform: string;
  fontImage: string;

  numHeroes: number;
  numMinions: number;
  numPlatforms: number;

  constructor() {
    super();

    this.minionSprite = "assets/minion_sprite.png";
    this.platform = "assets/platform.png";

    this.fontImage = "assets/Consolas-72.png";

    this.numHeroes = 3;
    this.numMinions = 4;
    this.numPlatforms = 5;
  }

  loadScene(): void {
    textures.loadTexture(this.minionSprite);
    textures.loadTexture(this.platform);
    textures.loadTexture(this.fontImage);
  }

  unloadScene(): void {
    textures.unloadTexture(this.minionSprite);
    textures.unloadTexture(this.platform);
    textures.unloadTexture(this.fontImage);
  }

  initialize(): void {
    this._initCamera();

    this.square = new Renderable();
    const xForm = this.square.getXform();
    xForm.setSize(30, 30);
    xForm.setPosition(10, 10);

    this.message = new FontRenderable("Is this working?");
    this.message.setColor([1, 1, 1, 1]);
    this.message.getXform().setPosition(1, 2);
    this.message.setTextHeight(3);

    this.objectSet = new GameObjectSet();
    const mobilePlatform = new Platform(this.platform);
    this.objectSet.addObject(mobilePlatform);
    this.objectSet.addObject(new Platform(this.platform));
    this.objectSet.addObject(new Hero(this.minionSprite));
    this.objectSet.addObject(new Hero(this.minionSprite));
    this.objectSet.selectObjectAt(0);
    this.objectSet.setAlertCollisions(true);
  }

  _initCamera(): void {
    this.camera = new Camera(vec2.fromValues(50, 37.5), 100, [0, 0, 640, 480]);
    this.camera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
  }

  update(): void {
    this.camera.update();

    if (input.isKeyClicked(input.keys.E)) {
      this.objectSet.incSelected();
    } else if (input.isKeyClicked(input.keys.Q)) {
      this.objectSet.decSelected();
    }

    this.objectSet.update();
  }

  draw(): void {
    core.clearCanvas([0.9, 0.9, 0.9, 1]);
    this.camera.setupViewProjection();

    this.square.draw(this.camera);

    this.message.draw(this.camera);
    this.objectSet.draw(this.camera);
  }
}
