import Scene from "../../engine/Scene";
import textures from "../../engine/core/Engine_Textures";
import GameObjectSet from "../../engine/gameobjects/GameObjectSet";
import input from "../../engine/core/Engine_Input";
import Minion from "../objects/Minion";
import Camera from "../../engine/cameras/Camera";
import MathUtils from "../../engine/utils/MathUtils";
import { vec2 } from "gl-matrix";
import core from "../../engine/core/Engine_GL";

export default class ParallaxTest extends Scene {
    bgSpriteTexture = "assets/bg.png";
    bgNormalTexture = "assets/bg_normal.png";
    layerSpriteTexture = "assets/bgLayer.png";
    layerNormalTexture = "assets/bgLayer_normal.png";
    minionSprite = "assets/minion_sprite.png";
    minionNormal = "assets/minion_sprite_normal.png";

    mainCamera!: Camera;
    heroCamera!: Camera;

    minionSet!: GameObjectSet;

    loadScene(): void {
        textures.loadTexture(this.minionSprite);
        textures.loadTexture(this.minionNormal);
        textures.loadTexture(this.bgSpriteTexture);
        textures.loadTexture(this.bgNormalTexture);
        textures.loadTexture(this.layerSpriteTexture);
        textures.loadTexture(this.layerNormalTexture);
    }
    unloadScene(): void {
        textures.unloadTexture(this.minionSprite);
        textures.unloadTexture(this.minionNormal);
        textures.unloadTexture(this.bgSpriteTexture);
        textures.unloadTexture(this.bgNormalTexture);
        textures.unloadTexture(this.layerSpriteTexture);
        textures.unloadTexture(this.layerNormalTexture);
    }
    initialize(): void {
        this.mainCamera = new Camera(vec2.fromValues(50, 37.5), 100, [0, 0, 640, 480]);
        this.mainCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);

        // this.mainCamera = new Camera(vec2.fromValues(50, 37.5), 100, [0, 0, 640, 480]);
        // this.mainCamera.setBackgroundColor([0.4, 0.4, 0.4, 1]);

        this.minionSet = new GameObjectSet();
    }
    update(): void {
        if (input.isKeyClicked(input.keys.M)) {
            const minion = new Minion(this.minionSprite, this.minionNormal);
            const padding = 10;
            const minX = this.mainCamera.getWCLeft() + padding;
            const maxX = this.mainCamera.getWCRight() - padding;
            const minY = this.mainCamera.getWCTop() - padding;
            const maxY = this.mainCamera.getWCBottom() + padding;

            const randX = MathUtils.clamp(Math.random() * this.mainCamera.getWCWidth(), minX, maxX);
            const randY = MathUtils.clamp(Math.random() * this.mainCamera.getWCHeight(), maxY, minY);
            minion.xform.setPosition(randX, randY);

            this.minionSet.addObject(minion);
        }

        
        this.minionSet.update();
        this.mainCamera.update();
    }
    draw(): void {
        core.clearCanvas([0.9, 0.9, 0.9, 1]);
        this.mainCamera.setupViewProjection();

        this.minionSet.draw(this.mainCamera);
    }
    
}