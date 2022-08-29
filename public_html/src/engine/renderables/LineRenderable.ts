/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import Renderable from "./Renderable.js";
import { vec2, vec3 } from "gl-matrix";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";

export default class LineRenderable extends Renderable {
  start: vec2;
  end: vec2;
  xform!: Transform;
  lineWidth!: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    Renderable.prototype.setColor.call(this, [1.0, 1.0, 1.0, 1.0]);
    Renderable.prototype._setShader.call(this, ShaderFactory.getLineShader());

    this.start = vec2.fromValues(0.0, 0.0);
    this.end = vec2.fromValues(0.0, 0.0);
    this.setLineWidth(0.2);

    if (x1 !== undefined) {
      this.setVertices(x1, y1, x2, y2);
    }
  }

  draw(camera: Camera) {
    Renderable.prototype.draw.call(this, camera);
  }

  _calcXform() {
    //(sx, sy) is the line's vector
    const sx = this.end[0] - this.start[0];
    const sy = this.end[1] - this.start[1];

    //line center
    const cx = this.start[0] + sx / 2.0;
    const cy = this.start[1] + sy / 2.0;

    const lineLength = Math.sqrt(sx * sx + sy * sy);

    let rotation = vec2.angle(
      vec2.fromValues(sx, sy),
      vec2.fromValues(1.0, 0.0)
    );

    const axisVector3D = vec3.fromValues(1.0, 0.0, 0.0);
    const lineVector3D = vec3.fromValues(sx, sy, 0.0);
    const cross: vec3 = vec3.create();
    vec3.cross(cross, axisVector3D, lineVector3D);

    if (cross[2] < 0) {
      rotation = -rotation;
    }

    this.xform.setPosition(cx, cy);
    this.xform.setWidth(lineLength);
    this.xform.setRotationRads(rotation);
  }

  setVertices(x1: number, y1: number, x2: number, y2: number) {
    this.start[0] = x1;
    this.start[1] = y1;
    this.end[0] = x2;
    this.end[1] = y2;
    this._calcXform();
  }

  setStartVertex(x: number, y: number) {
    this.start[0] = x;
    this.start[1] = y;
    this._calcXform();
  }

  setEndVertex(x: number, y: number) {
    this.end[0] = x;
    this.end[1] = y;
    this._calcXform();
  }

  setLineWidth(width: number) {
    this.lineWidth = width;
    this.xform.setHeight(width);
  }
}
