/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";
import Transform from "../utils/Transform.js";
import gameLoop from "../core/Engine_GameLoop";
import PhysicsComponent from "./PhysicsComponent.js";
import RigidType from "./RigidType.js";
import Camera from "../cameras/Camera.js";

export default abstract class RigidShape extends PhysicsComponent {
  public readonly rigidType: RigidType = RigidType.Abstract;

  private _invMass = 1;
  restitution = 0.8;
  private _velocity = vec2.create();
  friction = 0.3;
  acceleration = vec2.create();

  constructor(public xform: Transform) {
    super();
  }

  get position() {
    return this.xform.getPosition();
  }
  set position(p: vec2) {
    this.xform.setPosition(p[0], p[1]);
  }

  get invMass() {
    return this._invMass;
  }
  set mass(mass: number) {
    if (mass > 0) {
      this._invMass = 1 / mass;
    } else {
      this._invMass = 0;
    }
  }

  get velocity() {
    return this._velocity;
  }
  set velocity(newV) {
    vec2.copy(this._velocity, newV);
  }

  update() {
    const dt = gameLoop.frameTime;
    vec2.scaleAndAdd(
      this.velocity,
      this.velocity,
      this.acceleration,
      this.invMass * dt
    );
    vec2.scaleAndAdd(this.position, this.position, this.velocity, dt);
  }

  draw(camera: Camera) {
    if (this.drawBounds) {
      this.positionMark.getXform().setZPos(this.xform.getZPos());
    }

    super.draw(camera);
  }

}
