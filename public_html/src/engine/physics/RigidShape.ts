/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";
import Transform from "../utils/Transform.js";
import RigidRect from "./RigidRect.js";
import RigidCircle from "./RigidCircle.js";
import MathUtils from "../utils/MathUtils.js";
import gameLoop from "../core/Engine_GameLoop";
import CollisionInfo from "../utils/CollisionInfo.js";
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

  abstract collided(
    otherObj: RigidShape,
    collisionInfo: CollisionInfo
  ): boolean;

  collidedRectCircle(
    rect: RigidRect,
    circle: RigidCircle,
    collisionInfo: CollisionInfo
  ) {
    const rectPos = rect.position;
    const circlePos = circle.position;

    // calculate vector from rect center to circ center
    const vRectToCirc = vec2.create();
    vec2.subtract(vRectToCirc, circlePos, rectPos);

    // clamp that vector inside the rectangle
    const vec = vec2.clone(vRectToCirc);

    const halfWidth = rect.halfWidth;
    const halfHeight = rect.halfHeight;

    vec[0] = MathUtils.clamp(vec[0], -halfWidth, halfWidth);
    vec[1] = MathUtils.clamp(vec[1], -halfHeight, halfHeight);

    // project the vector onto the nearst point on the rectangle
    const isInside = rect.containsPos(circlePos);
    if (isInside) {
      if (
        Math.abs(vRectToCirc[0] - halfWidth) >
        Math.abs(vRectToCirc[1] - halfHeight)
      ) {
        vec[0] = halfWidth;
        vec[0] *= vec[0] < 0 ? -1 : 1;
      } else {
        vec[1] = halfHeight;
        vec[1] *= vec[1] < 0 ? -1 : 1;
      }
    }

    // calculate the collision normal
    // i.e. the shortest distance between the rectangle's edges and the circle's center
    const normal = vec2.create();
    vec2.subtract(normal, vRectToCirc, vec);

    // Either the circle is inside the rectangle, or it's close enough
    // to collide. If neither is true, no collision.
    const squaredNormal = vec2.squaredLength(normal);
    const squaredRadius = circle.radius * circle.radius;
    if (!isInside && squaredRadius < squaredNormal) {
      return false;
    }

    const len = Math.sqrt(squaredNormal);
    let depth = circle.radius;

    // Normallize normal
    vec2.scale(normal, normal, 1 / len);

    // Flip normal so it's pointing away from the rectangle's center
    if (isInside) {
      depth += len;
      vec2.scale(normal, normal, -1);
    } else {
      depth -= len;
    }

    collisionInfo.normal = normal;
    collisionInfo.depth = depth;
    return true;
  }

  collidedCircleRect(
    circle: RigidCircle,
    rect: RigidRect,
    collisionInfo: CollisionInfo
  ) {
    const isCollided = this.collidedRectCircle(rect, circle, collisionInfo);
    vec2.scale(collisionInfo.normal, collisionInfo.normal, -1);
    return isCollided;
  }
}
