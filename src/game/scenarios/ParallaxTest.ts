import Scene from "../../engine/Scene";
import textures from "../../engine/core/Engine_Textures";
import GameObjectSet from "../../engine/gameobjects/GameObjectSet";
import input from "../../engine/core/Engine_Input";
import Minion from "../objects/Minion";
import Camera from "../../engine/cameras/Camera";
import MathUtils from "../../engine/utils/MathUtils";
import { vec2 } from "gl-matrix";
import core from "../../engine/core/Engine_GL";
import Hero from "../objects/Hero";
import IllumRenderable from "../../engine/renderables/IllumRenderable";
import ParallaxGameObject from "../../engine/gameobjects/ParallaxGameObject";
import TextureRenderable from "../../engine/renderables/TextureRenderable";
import * as layerManager from "../../engine/core/LayerManager";

export default class ParallaxTest extends Scene {
  bgSpriteTexture = "assets/bg.png";
  bgNormalTexture = "assets/bg_normal.png";
  layerSpriteTexture = "assets/bgLayer.png";
  layerNormalTexture = "assets/bgLayer_normal.png";
  minionSprite = "assets/minion_sprite.png";
  minionNormal = "assets/minion_sprite_normal.png";

  private readonly mainBgColor: color = [0.9, 0.9, 0.9, 1];
  private readonly heroBgColor: color = [0.5, 0.5, 0.9, 1];

  mainCamera!: Camera;
  heroCamera!: Camera;

  background!: ParallaxGameObject;
  backLayer!: ParallaxGameObject;
  frontLayer!: ParallaxGameObject;

  minionSet!: GameObjectSet;
  hero!: Hero;

  loadScene(): void {
    textures.loadTexture(this.minionSprite);
    textures.loadTexture(this.minionNormal);
    textures.loadTexture(this.bgSpriteTexture);
    textures.loadTexture(this.bgNormalTexture);
    textures.loadTexture(this.layerSpriteTexture);
    textures.loadTexture(this.layerNormalTexture);
  }
  unloadScene(): void {
    layerManager.cleanUp();

    textures.unloadTexture(this.minionSprite);
    textures.unloadTexture(this.minionNormal);
    textures.unloadTexture(this.bgSpriteTexture);
    textures.unloadTexture(this.bgNormalTexture);
    textures.unloadTexture(this.layerSpriteTexture);
    textures.unloadTexture(this.layerNormalTexture);
  }
  initialize(): void {
    this.mainCamera = new Camera(
      vec2.fromValues(50, 37.5),
      100,
      [0, 0, 640, 480]
    );
    this.mainCamera.setBackgroundColor(this.mainBgColor);

    this.heroCamera = new Camera(
      vec2.fromValues(20, 30.5),
      14,
      [0, 0, 128, 96],
      2
    );
    this.heroCamera.setBackgroundColor(this.heroBgColor);

    this.hero = new Hero(this.minionSprite, this.minionNormal);
    layerManager.addToLayer(layerManager.Layer.Actor, this.hero);

    const bgTileRenderable = new IllumRenderable(
      this.bgSpriteTexture,
      this.bgNormalTexture
    );
    bgTileRenderable.setElementPixelCoordinates(0, 1024, 0, 1024);
    bgTileRenderable.xform.setSize(30, 30);
    bgTileRenderable.xform.setPosition(0, 0);
    bgTileRenderable.material.setSpecular([0.2, 0.1, 0.1, 1]);
    bgTileRenderable.material.setShininess(50);
    bgTileRenderable.xform.setZPos(-20);
    this.background = new ParallaxGameObject(bgTileRenderable, 5, this.mainCamera);
    this.background.currentFrontDir = [0, -1];
    this.background.speed = 0.1;
    layerManager.addToLayer(layerManager.Layer.Background, this.background);

    const layerTileRenderable = new IllumRenderable(
      this.layerSpriteTexture,
      this.layerNormalTexture
    );
    layerTileRenderable.xform.setSize(30, 30);
    layerTileRenderable.xform.setPosition(0, 0);
    layerTileRenderable.xform.setZPos(-10);
    layerTileRenderable.material.setSpecular([0.2, 0.2, 0.5, 1]);
    layerTileRenderable.material.setShininess(10);
    this.backLayer = new ParallaxGameObject(layerTileRenderable, 3, this.mainCamera);
    this.backLayer.currentFrontDir = [0, -1];
    this.backLayer.speed = 0.1;
    layerManager.addToLayer(layerManager.Layer.Background, this.backLayer);

    const frontLayerTile = new TextureRenderable(this.layerSpriteTexture);
    frontLayerTile.xform.setSize(30, 30);
    frontLayerTile.xform.setPosition(0, 0);
    this.frontLayer = new ParallaxGameObject(frontLayerTile, 0.9, this.mainCamera);
    layerManager.addToLayer(layerManager.Layer.Foreground, this.frontLayer);
  }

  private spawnRandomMinion() {
    const minion = new Minion(this.minionSprite, this.minionNormal);
    const padding = 10;
    const minX = this.mainCamera.getWCLeft() + padding;
    const maxX = this.mainCamera.getWCRight() - padding;
    const minY = this.mainCamera.getWCTop() - padding;
    const maxY = this.mainCamera.getWCBottom() + padding;

    const randX = MathUtils.clamp(
      Math.random() * this.mainCamera.getWCWidth(),
      minX,
      maxX
    );
    const randY = MathUtils.clamp(
      Math.random() * this.mainCamera.getWCHeight(),
      maxY,
      minY
    );
    minion.xform.setPosition(randX, randY);
    layerManager.addToLayer(layerManager.Layer.Actor, minion);
  }
  restHeroPosition() {
    const wcCenter = this.mainCamera.getWCCenter();
    this.hero.xform.setPosition(wcCenter[0], wcCenter[1]);
  }
  update(): void {
    if (input.isKeyClicked(input.keys.M)) {
      this.spawnRandomMinion();
    }
    if (input.isKeyClicked(input.keys.R)) {
      this.restHeroPosition();
    }

    layerManager.updateAllLayers();

    this.mainCamera.panWith(this.hero.xform, .85);

    this.mainCamera.update();
    this.heroCamera.update();
  }

  private drawCamera(camera: Camera) {
    camera.setupViewProjection();
    layerManager.drawAllLayers(camera);
  }
  draw(): void {
    core.clearCanvas(this.mainBgColor);

    this.drawCamera(this.mainCamera);
    this.drawCamera(this.heroCamera);
  }
}
