import Scene from "../../engine/Scene";
import fonts from "../../engine/core/resources/Engine_Fonts";
import FontRenderable from "../../engine/renderables/FontRenderable";
import Camera from "../../engine/cameras/Camera";
import GL from "../../engine/core/Engine_GL";
import { vec2 } from "gl-matrix";
import TriShip from "../objects/TriShip";
import GameObjectSet from "../../engine/gameobjects/GameObjectSet";
import Asteroid from "../objects/Asteroid";
import physics from "../../engine/core/Engine_Physics";

export default class Asteroids extends Scene {

    static readonly spaceBlack: color = [0, 0, 0, 1];
    static readonly objectWhite: color = [1, 1, 1, 1];

    private static readonly font = "assets/fonts/Consolas-72";

    private mainCamera !: Camera;

    private startMessage !: FontRenderable;
    private triShip !: TriShip;
    
    private asteroidSet !: GameObjectSet;

    private readonly worldHeight = 75;
    private readonly worldWidth = 100;

    loadScene(): void {
        fonts.loadFont(Asteroids.font);
    }

    unloadScene(): void {
        fonts.unloadFont(Asteroids.font);
    }

    initialize(): void {
        const wcCenter = vec2.fromValues(this.worldWidth/2, this.worldHeight/2);
        const wcWidth = 100;
        const viewBounds: bounds = [0, 0, 640, 480];
        this.mainCamera = new Camera(wcCenter, wcWidth, viewBounds);
        this.mainCamera.setBackgroundColor(Asteroids.spaceBlack);

        this.startMessage = new FontRenderable(Asteroids.font);
        this.startMessage.setText("Welcome to Asteroids!");
        this.startMessage.getXform().setPosition(wcCenter[0], wcCenter[1]);
        this.startMessage.setTextHeight(4);
        this.startMessage.setColor(Asteroids.objectWhite);

        this.triShip = new TriShip(wcCenter[0] - 5, wcCenter[1]);

        this.asteroidSet = new GameObjectSet();
        const numAsteroids = 6;
        for (let i = 0; i < numAsteroids; i++) {
            this.asteroidSet.addObject(new Asteroid());
        }
        this.asteroidSet.setAlertCollisions(true);
    }

    update(): void {
        this.mainCamera.setupViewProjection();
        this.mainCamera.update();

        this.triShip.update();
        this.asteroidSet.update();

        for (let i = 0; i < this.asteroidSet.size(); i++) {
            for (let j  = i; j < this.asteroidSet.size(); j++) {
                physics.processObjObj(this.asteroidSet.getObjectAt(i), this.asteroidSet.getObjectAt(j));
            }
        }
    }

    draw(): void {
        GL.clearCanvas(Asteroids.spaceBlack);

       this.triShip.draw(this.mainCamera);
        this.startMessage.draw(this.mainCamera);

        this.asteroidSet.draw(this.mainCamera);
    }
}