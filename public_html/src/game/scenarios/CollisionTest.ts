import { vec2 } from "gl-matrix";
import Camera from "../../engine/cameras/Camera";
import GameObject from "../../engine/gameobjects/GameObject";
import GameObjectSet from "../../engine/gameobjects/GameObjectSet";
import Renderable from "../../engine/renderables/Renderable";
import Scene from "../../engine/Scene";
import core from "../../engine/core/Engine_Core";
import Wall from "../objects/Wall";
import textures from "../../engine/core/Engine_Textures";
import Hero from "../objects/Hero";
import physics from "../../engine/core/Engine_Physics";

export default class CollisionTest extends Scene {
  minionSprite = "assets/minion_sprite.png";

  camera!: Camera;

  wallSet: GameObjectSet = new GameObjectSet();
  hero!: Hero;

  loadScene(): void {
    textures.loadTexture(this.minionSprite);
  }
  unloadScene(): void {
    textures.unloadTexture(this.minionSprite);
  }
  initialize(): void {
    this.camera = new Camera(vec2.fromValues(50, 37.5), 100, [0, 0, 640, 480]);
    this.camera.setBackgroundColor([0.9, 0.9, 0.9, 1]);

    const center = this.camera.getWCCenter();

    const thickness = 5;
    const verticalLength = 50;
    const horizontalLength = 60;

    const padding = 30;

    const leftWall = new Renderable();
    leftWall.getXform().setSize(thickness, verticalLength);
    leftWall.getXform().setPosition(center[0] - padding, center[1]);
    this.wallSet.addObject(new Wall(leftWall));
    const topWall = new Renderable();
    topWall.getXform().setSize(horizontalLength, thickness);
    topWall.getXform().setPosition(center[0], center[1] - padding);
    this.wallSet.addObject(new Wall(topWall));
    const rightWall = new Renderable();
    rightWall.getXform().setSize(thickness, verticalLength);
    rightWall.getXform().setPosition(center[0] + padding, center[1]);
    this.wallSet.addObject(new Wall(rightWall));
    const bottomWall = new Renderable();
    bottomWall.getXform().setSize(horizontalLength, thickness);
    bottomWall.getXform().setPosition(center[0], center[1] + padding);
    this.wallSet.addObject(new Wall(bottomWall));

    this.hero = new Hero(this.minionSprite);
    this.hero.xform.setPosition(center[0], center[1]);
  }
  update(): void {
    this.camera.update();

    this.wallSet.update();
    this.hero.update();

    physics.processObjSet(this.hero, this.wallSet);
  }
  draw(): void {
    core.clearCanvas([0.9, 0.9, 0.9, 1]);
    this.camera.setupViewProjection();

    this.wallSet.draw(this.camera);
    this.hero.draw(this.camera);
  }
}
