import { vec2 } from "gl-matrix";
import Camera from "../../engine/cameras/Camera";
import GameObject from "../../engine/gameobjects/GameObject";
import GameObjectSet from "../../engine/gameobjects/GameObjectSet";
import Renderable from "../../engine/renderables/Renderable";
import Scene from "../../engine/Scene";
import core from "../../engine/core/Engine_Core";

export default class CollisionTest extends Scene {
  camera!: Camera;

  wallSet: GameObjectSet = new GameObjectSet();

  loadScene(): void {
    // No assets to load.
  }
  unloadScene(): void {
    // No assets to unload.
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
    this.wallSet.addObject(new GameObject(leftWall));
    const topWall = new Renderable();
    topWall.getXform().setSize(horizontalLength, thickness);
    topWall.getXform().setPosition(center[0], center[1] - padding);
    this.wallSet.addObject(new GameObject(topWall));
    const rightWall = new Renderable();
    rightWall.getXform().setSize(thickness, verticalLength);
    rightWall.getXform().setPosition(center[0] + padding, center[1]);
    this.wallSet.addObject(new GameObject(rightWall));
    const bottomWall = new Renderable();
    bottomWall.getXform().setSize(horizontalLength, thickness);
    bottomWall.getXform().setPosition(center[0], center[1] + padding);
    this.wallSet.addObject(new GameObject(bottomWall));
  }
  update(): void {
    this.camera.update();
  }
  draw(): void {
    core.clearCanvas([0.9, 0.9, 0.9, 1]);
    this.camera.setupViewProjection();

    this.wallSet.draw(this.camera);
  }
}
