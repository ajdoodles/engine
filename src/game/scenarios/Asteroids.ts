import Scene from "../../engine/Scene";
import fonts from "../../engine/core/resources/Engine_Fonts";
import resources from "../../engine/core/resources/Engine_ResourceMap";
import FontRenderable from "../../engine/renderables/FontRenderable";
import Camera from "../../engine/cameras/Camera";
import GL from "../../engine/core/Engine_GL";
import { vec2 } from "gl-matrix";

export default class Asteroids extends Scene {

    private static readonly spaceBlack: color = [0, 0, 0, 1];
    private static readonly objectWhite: color = [1, 1, 1, 1];

    private static readonly font = "assets/fonts/Consolas-72";

    private mainCamera !: Camera;

    private startMessage !: FontRenderable;
    
    loadScene(): void {
        fonts.loadFont(Asteroids.font);
    }

    unloadScene(): void {
        fonts.unloadFont(Asteroids.font);
    }

    initialize(): void {

        const wcCenter = vec2.fromValues(50, 32.5);
        const wcWidth = 100;
        const viewBounds: bounds = [0, 0, 640, 480];
        this.mainCamera = new Camera(wcCenter, wcWidth, viewBounds);
        this.mainCamera.setBackgroundColor(Asteroids.spaceBlack);

        this.startMessage = new FontRenderable(Asteroids.font);
        this.startMessage.setText("Welcome to Asteroids!");
        this.startMessage.getXform().setPosition(wcCenter[0], wcCenter[1]);
        this.startMessage.setTextHeight(4);
        this.startMessage.setColor(Asteroids.objectWhite);
    }

    update(): void {
        this.mainCamera.setupViewProjection();
        this.mainCamera.update();
    }

    draw(): void {
        GL.clearCanvas(Asteroids.spaceBlack);

        this.startMessage.draw(this.mainCamera);
    }
}