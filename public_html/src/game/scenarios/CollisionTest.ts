import { vec2 } from "gl-matrix";
import Camera from "../../engine/cameras/Camera";
import GameObjectSet from "../../engine/gameobjects/GameObjectSet";
import Renderable from "../../engine/renderables/Renderable";
import Scene from "../../engine/Scene";
import core from "../../engine/core/Engine_GL";
import Wall from "../objects/Wall";
import textures from "../../engine/core/Engine_Textures";
import Hero from "../objects/Hero";
import physics from "../../engine/core/Engine_Physics";
import ParticleGameObject from "../../engine/particles/ParticleGameObject";
import Particle from "../../engine/particles/Particle";
import input from "../../engine/core/Engine_Input";
import ParticleGameObjectSet from "../../engine/particles/ParticleGameObjectSet";

export default class CollisionTest extends Scene {
  minionSprite = "assets/minion_sprite.png";
  particleSprite = "assets/particle.png";

  camera!: Camera;

  wallSet: GameObjectSet = new GameObjectSet();
  testSet: GameObjectSet = new GameObjectSet();
  particleSet: ParticleGameObjectSet = new ParticleGameObjectSet();
  hero!: Hero;

  loadScene(): void {
    textures.loadTexture(this.minionSprite);
    textures.loadTexture(this.particleSprite);
  }
  unloadScene(): void {
    textures.unloadTexture(this.minionSprite);
    textures.unloadTexture(this.particleSprite);
  }
  private createParticle(atX: number, atY: number) {
    const lifetime = 30 + Math.random() * 200;
    const pObject = new ParticleGameObject(
      this.particleSprite,
      atX,
      atY,
      lifetime
    );

    const span = 5.5 + Math.random() * 0.5;
    pObject.xform.setSize(span, span);

    const red = 3.5 + Math.random();
    const green = 0.4 + 0.1 * Math.random();
    const blue = 0.3 + 0.1 * Math.random();
    pObject.finalColor = [red, green, blue, 0.6];

    const vX = 10 - 20 * Math.random();
    const vY = 10 * Math.random();

    const particle = pObject.physicsComponent as Particle;
    vec2.set(particle.velocity, vX, vY);
    particle.drawBounds = true;
    particle.boundsColor = [1.0, 1.0, 1.0, 1.0];

    pObject.sizeDelta = 0.98;

    return pObject;
  }
  initialize(): void {
    this.camera = new Camera(vec2.fromValues(50, 37.5), 100, [0, 0, 640, 480]);
    this.camera.setBackgroundColor([0.4, 0.4, 0.4, 1]);

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

    if (input.isMousePressed(input.mouse.Left)) {
      const mousePos = this.camera.getWCCursorPosition();
      const pObj = this.createParticle(mousePos[0], mousePos[1]);
      this.particleSet.addObject(pObj);
      // const testObj = new Renderable();
      // const xform = testObj.getXform();
      // xform.setSize(2, 2);
      // xform.setPosition(mousePos[0], mousePos[1]);
      // testObj.setColor([Math.random(), Math.random(), Math.random(), 1.0]);
      // this.testSet.addObject(new GameObject(testObj));
    }
    // this.testSet.update();
    this.particleSet.update();
  }
  draw(): void {
    core.clearCanvas([0.9, 0.9, 0.9, 1]);
    this.camera.setupViewProjection();

    this.wallSet.draw(this.camera);
    this.hero.draw(this.camera);

    // this.testSet.draw(this.camera);
    this.particleSet.draw(this.camera);
  }
}
