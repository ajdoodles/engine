import { vec2 } from "gl-matrix";
import GameObject from "../../engine/gameobjects/GameObject";
import RigidRect from "../../engine/physics/RigidRect";
import Renderable from "../../engine/renderables/Renderable";
import { GeometryType } from "../../engine/shaders/Geometry";
import Asteroids from "../scenarios/Asteroids";
import input from "../../engine/core/Engine_Input";

export default class TriShip extends GameObject {
    physicsComponent !: RigidRect;
    shape = GeometryType.TRIANGLE;

    constructor(xPos:number, yPos: number) {
        const triShip = new Renderable();
        triShip.xform.setPosition(xPos, yPos);
        triShip.xform.setSize(5, 10);
        triShip.setColor(Asteroids.objectWhite);
        super(triShip);

        const xform = this.renderComponent.xform;
        this.physicsComponent = new RigidRect(xform);
    }

    update() {
        const deltaV = 0.75;
        const newV = vec2.clone(this.physicsComponent.velocity);
        if (input.isKeyPressed(input.keys.W)) {
          if (newV[1] < 4) {
            newV[1] += deltaV;
          }
        }
        if (input.isKeyPressed(input.keys.A)) {
          if (newV[0] > -4) {
            newV[0] -= deltaV;
          }
        }
        if (input.isKeyPressed(input.keys.S)) {
          if (newV[1] > -4) {
            newV[1] -= deltaV;
          }
        }
        if (input.isKeyPressed(input.keys.D)) {
          if (newV[0] < 4) {
            newV[0] += deltaV;
          }
        }
        if (input.isKeyPressed(input.keys.Q)) {
          this.xform.incRotationInDegrees(1);
        }
        if (input.isKeyPressed(input.keys.E)) {
          this.xform.incRotationInDegrees(-1);
        }
        this.physicsComponent.velocity = newV;
    
        super.update();

        const worldHeight = 75;
        const worldWidth = 100;
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
      }
}