import { vec2 } from "gl-matrix";
import Camera from "../cameras/Camera";
import gameloop from "../core/Engine_GameLoop";
import particles from "../core/resources/Engine_Particle";
import PhysicsComponent from "../physics/PhysicsComponent";
import { IParticle, PhysicsType } from "../physics/RigidType";

export default class Particle extends PhysicsComponent implements IParticle {
  public readonly pType = PhysicsType.PARTICLE;

  public readonly velocity = vec2.create();
  public readonly acceleration = vec2.clone(particles.systemAcceleration);
  public drag = 0.95;

  constructor(public position: vec2) {
    super();
    this.padding = 0.5;
  }

  public draw(camera: Camera) {
    if (!this.drawBounds) {
      return;
    }

    const x = this.position[0];
    const y = this.position[1];

    this.positionMark.setEndpoints(
      x - this.padding,
      y + this.padding,
      x + this.padding,
      y - this.padding
    );
    this.positionMark.draw(camera);

    this.positionMark.setEndpoints(
      x + this.padding,
      y + this.padding,
      x - this.padding,
      y - this.padding
    );
    this.positionMark.draw(camera);
  }

  public update() {
    const dt = gameloop.frameTime;

    vec2.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
    vec2.scale(this.velocity, this.velocity, this.drag);
    vec2.scaleAndAdd(this.position, this.position, this.velocity, dt);
  }
}
