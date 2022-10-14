import { vec2 } from "gl-matrix";
import GameObject from "../../engine/gameobjects/GameObject";
import RigidRect from "../../engine/physics/RigidRect";
import Renderable from "../../engine/renderables/Renderable";
import { GeometryType } from "../../engine/shaders/Geometry";
import Asteroids from "../scenarios/Asteroids";

export default class Asteroid extends GameObject {
    
    physicsComponent: RigidRect;

    shape = GeometryType.ASTEROID;
    rotation = (Math.random() * 10) - 5;

    constructor(){
        const renderable = new Renderable();
        const randX = Math.random() * 100;
        const randY = Math.random() * 75;
        const randScale = Math.random() * 20;
        const randVx = (Math.random() * 18) - 9;
        const randVy = (Math.random() * 18) - 9;
        renderable.xform.setPosition(randX, randY);
        renderable.xform.setSize(randScale, randScale);
        renderable.setColor(Asteroids.objectWhite);
        super(renderable);
        this.physicsComponent = new RigidRect(renderable.xform);
        this.physicsComponent.velocity = vec2.fromValues(randVx, randVy);
    }

    update() {
        super.update();

        const worldWidth = 100;
        const worldHeight = 75;
        const shipPos = this.xform.position;
        if (shipPos[0] < 0) {
            shipPos[0] =  worldWidth; 
        } else if (shipPos[0] > worldWidth) {
            shipPos[0] = 0;
        }
        if (shipPos[1] < 0) {
            shipPos[1] = worldHeight; 
        } else if (shipPos[1] > worldHeight) {
            shipPos[1] = 0;
        }
        this.renderComponent.xform.incRotationInDegrees(this.rotation);
    }

}