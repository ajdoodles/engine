/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import RigidShape from "./RigidShape.js";
import LineRenderable from "../renderables/LineRenderable.js";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";
import { vec2 } from "gl-matrix";
import { IRect, PhysicsType } from "./RigidType.js";
import MathUtils from "../utils/MathUtils.js";

export default class RigidRect extends RigidShape implements IRect {
  public readonly pType = PhysicsType.RECT;
  
  sides: LineRenderable = new LineRenderable(0, 0, 0, 0);

  constructor(xform: Transform, public width: number = xform.getWidth(), public height: number = xform.getHeight()) {
    super(xform);
  }

  set boundsColor(c: color) {
    super.boundsColor = c;
    this.sides.setColor(c);
  }

  get halfWidth() {
    return this.width / 2;
  }
  get halfHeight() {
    return this.height / 2;
  }

  get left() {
    return this.xform.getXPos() - this.halfWidth;
  }
  get right() {
    return this.xform.getXPos() + this.halfWidth;
  }
  get top() {
    return this.xform.getYPos() + this.halfHeight;
  }
  get bottom() {
    return this.xform.getYPos() - this.halfHeight;
  }

  containsPos(position: vec2) {
    return (
      this.left < position[0] &&
      position[0] < this.right &&
      this.bottom < position[1] &&
      position[1] < this.top
    );
  }

  containsVec(vec: vec2) {
    return (
      Math.abs(vec[0]) < this.halfWidth && Math.abs(vec[1]) < this.halfHeight
    );
  }

  projectToEdge(vec: vec2): void {
    if (this.containsVec(vec)) {
      if (
        Math.abs(vec[0] - this.halfWidth) < Math.abs(vec[1] - this.halfHeight)
      ) {
        vec[0] = this.halfWidth;
        vec[0] *= vec[0] < 0 ? -1 : 1;
      } else {
        vec[1] = this.halfHeight;
        vec[1] *= vec[1] < 0 ? -1 : 1;
      }
    }
  }

  clampToEdge(vec: vec2): void {
    if (!this.containsVec(vec)) {
      vec[0] = MathUtils.clamp(vec[0], -this.halfWidth, this.halfWidth);
      vec[1] = MathUtils.clamp(vec[1], -this.halfHeight, this.halfHeight);
    }
  }

  draw(camera: Camera) {
    super.draw(camera);

    if (!this.drawBounds) {
      return;
    }

    const x = this.position[0];
    const y = this.position[1];
    const halfWidth = this.halfWidth;
    const halfHeight = this.halfHeight;

    this.sides.getXform().setZPos(this.xform.getZPos());

    // top edge
    this.sides.setStartPos(x - halfWidth, y + halfHeight);
    this.sides.setEndPos(x + halfWidth, y + halfHeight);
    this.sides.draw(camera);

    // right edge
    this.sides.setStartPos(x + halfWidth, y - halfHeight);
    this.sides.draw(camera);

    //bottom edge
    this.sides.setEndPos(x - halfWidth, y - halfHeight);
    this.sides.draw(camera);

    // left edge
    this.sides.setStartPos(x - halfWidth, y + halfHeight);
    this.sides.draw(camera);
  }
}
