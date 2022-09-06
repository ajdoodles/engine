/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import RigidShape from "./RigidShape.js";
import { vec2 } from "gl-matrix";
import LineRenderable from "../renderables/LineRenderable.js";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";
import RigidRect from "./RigidRect.js";
import CollisionInfo from "../utils/CollisionInfo.js";

export default class RigidCircle extends RigidShape {
  numSides: number;
  angularDelta: number;
  radius: number;
  sides: LineRenderable;

  constructor(xform: Transform, radius: number) {
    super(xform);

    this.numSides = 16;
    if (this.numSides < 2) {
      throw "Need at least three points to draw a circle";
    }
    this.angularDelta = (2 * Math.PI) / this.numSides;

    this.radius = radius;
    this.sides = new LineRenderable(0, 0, 0, 0);
  }

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
  }

  setColor(color: color) {
    super.setColor(color);
    this.sides.setColor(color);
  }

  rigidType() {
    return RigidShape.eRigidType.eCircle;
  }

  draw(camera: Camera) {
    super.draw(camera);

    if (!this.isDrawingBounds()) {
      return;
    }

    this.sides.getXform().setZPos(this.xform.getZPos());

    const pos = this.getPosition();
    const drawPoint = vec2.fromValues(pos[0] + this.radius, pos[1]);
    this.sides.setStartPos(drawPoint[0], drawPoint[1]);
    for (let i = 1; i <= this.numSides; i++) {
      vec2.rotate(drawPoint, drawPoint, pos, this.angularDelta);

      if (i % 2 === 0) {
        this.sides.setStartPos(drawPoint[0], drawPoint[1]);
      } else {
        this.sides.setEndPos(drawPoint[0], drawPoint[1]);
      }

      this.sides.draw(camera);
    }
  }

  collidedCircleCircle(
    c1: RigidCircle,
    c2: RigidCircle,
    collisionInfo: CollisionInfo
  ) {
    const distSquared = vec2.squaredDistance(
      c1.getPosition(),
      c2.getPosition()
    );
    const maxDist = c1.getRadius() + c2.getRadius();

    if (distSquared >= maxDist * maxDist) {
      return false;
    }

    const vFirstToSecond = vec2.create();
    vec2.subtract(vFirstToSecond, c2.getPosition(), c1.getPosition());

    const dist = Math.sqrt(distSquared);
    const depth = c1.getRadius() + c2.getRadius() - dist;
    let normal;

    if (dist === 0) {
      normal = vec2.fromValues(0, 1);
    } else {
      normal = vec2.clone(vFirstToSecond);
      vec2.scale(normal, normal, 1 / dist);
    }

    collisionInfo.depth = depth;
    collisionInfo.normal = normal;
    return true;
  }

  collided(otherShape: RigidShape, collisionInfo: CollisionInfo): boolean {
    switch (otherShape.rigidType()) {
      case RigidShape.eRigidType.eCircle:
        return this.collidedCircleCircle(
          this,
          otherShape as RigidCircle,
          collisionInfo
        );
      case RigidShape.eRigidType.eRect:
        return this.collidedCircleRect(
          this,
          otherShape as RigidRect,
          collisionInfo
        );
      default:
        return false;
    }
  }

  containsPos(position: vec2) {
    const dist = vec2.dist(this.getPosition(), position);
    return dist < this.getRadius();
  }
}
