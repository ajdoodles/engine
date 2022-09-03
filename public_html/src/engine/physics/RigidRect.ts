/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import RigidShape from "./RigidShape.js";
import LineRenderable from "../renderables/LineRenderable.js";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";
import RigidCircle from "./RigidCircle.js";
import { vec2 } from "gl-matrix";
import CollisionInfo from "../utils/CollisionInfo.js";

export default class RigidRect extends RigidShape {
  sides: LineRenderable = new LineRenderable(0, 0, 0, 0);

  constructor(xform: Transform, public width: number, public height: number) {
    super(xform);
  }

  get halfWidth() {
    return this.width / 2;
  }
  get halfHeight() {
    return this.height / 2;
  }

  left() {
    return this.xform.getXPos() - this.halfWidth;
  }
  right() {
    return this.xform.getXPos() + this.halfWidth;
  }
  top() {
    return this.xform.getYPos() + this.halfHeight;
  }
  bottom() {
    return this.xform.getYPos() - this.halfHeight;
  }

  setColor(color: color) {
    super.setColor(color);
    this.sides.setColor(color);
  }

  rigidType() {
    return RigidShape.eRigidType.eRect;
  }

  draw(camera: Camera) {
    super.draw(camera);

    if (!this.isDrawingBounds()) {
      return;
    }

    const x = this.getPosition()[0];
    const y = this.getPosition()[1];
    const halfWidth = this.halfWidth;
    const halfHeight = this.halfHeight;

    this.sides.getXform().setZPos(this.xform.getZPos());

    // top edge
    this.sides.setStartVertex(x - halfWidth, y + halfHeight);
    this.sides.setEndVertex(x + halfWidth, y + halfHeight);
    this.sides.draw(camera);

    // right edge
    this.sides.setStartVertex(x + halfWidth, y - halfHeight);
    this.sides.draw(camera);

    //bottom edge
    this.sides.setEndVertex(x - halfWidth, y - halfHeight);
    this.sides.draw(camera);

    // left edge
    this.sides.setStartVertex(x - halfWidth, y + halfHeight);
    this.sides.draw(camera);
  }

  collidedRectRect(
    first: RigidRect,
    second: RigidRect,
    collisionInfo: CollisionInfo
  ) {
    const firstPos = first.getPosition();
    const secondPos = second.getPosition();

    const vFirstToSecond = vec2.create();
    vec2.subtract(vFirstToSecond, secondPos, firstPos);

    const xDepth =
      first.halfWidth + second.halfWidth - Math.abs(vFirstToSecond[0]);
    if (xDepth > 0) {
      const yDepth =
        first.halfHeight + second.halfHeight - Math.abs(vFirstToSecond[1]);

      if (yDepth > 0) {
        if (xDepth < yDepth) {
          collisionInfo.depth = xDepth;
          if (vFirstToSecond[0] > 0) {
            collisionInfo.normal = vec2.fromValues(1, 0);
          } else {
            collisionInfo.normal = vec2.fromValues(-1, 0);
          }
        } else {
          collisionInfo.depth = yDepth;
          if (vFirstToSecond[1] > 0) {
            collisionInfo.normal = vec2.fromValues(0, 1);
          } else {
            collisionInfo.normal = vec2.fromValues(0, -1);
          }
        }
        return true;
      }
    }

    return false;
  }

  collided(otherShape: RigidShape, collisionInfo: CollisionInfo): boolean {
    switch (otherShape.rigidType()) {
      case RigidShape.eRigidType.eRect:
        return this.collidedRectRect(
          this,
          otherShape as RigidRect,
          collisionInfo
        );
      case RigidShape.eRigidType.eCircle:
        return this.collidedRectCircle(
          this,
          otherShape as RigidCircle,
          collisionInfo
        );
      default:
        return false;
    }
  }

  containsPos(position: vec2) {
    const center = this.getPosition();

    const left = center[0] - this.halfWidth;
    const right = center[0] + this.halfWidth;
    const bottom = center[1] - this.halfHeight;
    const top = center[1] + this.halfHeight;

    return (
      left < position[0] &&
      position[0] < right &&
      bottom < position[1] &&
      position[1] < top
    );
  }
}
