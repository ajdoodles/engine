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
import RigidType from "./RigidType.js";

export default class RigidRect extends RigidShape {
  rigidType = RigidType.Rect;

  sides: LineRenderable = new LineRenderable(0, 0, 0, 0);

  constructor(xform: Transform, public width: number, public height: number) {
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

  containsPos(position: vec2) {
    const center = this.position;

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
