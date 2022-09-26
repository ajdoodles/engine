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
import RigidType from "./RigidType.js";

export default class RigidCircle extends RigidShape {
  readonly rigidType = RigidType.Circle;

  numSides = 16;
  angularDelta = (2 * Math.PI) / this.numSides;
  sides = new LineRenderable(0, 0, 0, 0);

  constructor(xform: Transform, public radius: number) {
    super(xform);

    if (this.numSides < 2) {
      throw "Need at least three points to draw a circle";
    }
  }

  set boundsColor(color: color) {
    super.boundsColor = color;
    this.sides.setColor(color);
  }

  containsPos(position: vec2) {
    const dist = vec2.squaredDistance(this.position, position);
    return dist < this.radius * this.radius;
  }

  containsVec(vec: vec2) {
    const dist = vec2.squaredLength(vec);
    return dist < this.radius * this.radius;
  }

  projectToEdge(vec: vec2) {
    if (this.containsVec(vec)) {
      const length = vec2.length(vec);
      vec2.scale(vec, vec, this.radius / length);
    }
  }

  clampToEdge(vec: vec2) {
    if (!this.containsVec(vec)) {
      const length = vec2.length(vec);
      vec2.scale(vec, vec, this.radius / length);
    }
  }

  draw(camera: Camera) {
    super.draw(camera);

    if (!this.drawBounds) {
      return;
    }

    this.sides.getXform().setZPos(this.xform.getZPos());

    const pos = this.position;
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
}
