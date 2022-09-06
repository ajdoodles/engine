/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import Renderable from "./Renderable.js";
import { vec2, vec3 } from "gl-matrix";
import Camera from "../cameras/Camera.js";

export default class LineRenderable extends Renderable {
  private readonly _start: vec2 = vec2.create();
  private readonly _end: vec2 = vec2.create();
  private _thickness = 0.2;

  get start() {
    return this._start;
  }
  set start(start) {
    vec2.copy(this._start, start);
  }

  get end() {
    return this._end;
  }
  set end(end) {
    vec2.copy(this._end, end);
  }

  get thickness() {
    return this._thickness;
  }
  set thickness(thickness) {
    this._thickness = thickness;
    this.xform.setHeight(thickness);
  }

  constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    this.setColor([1.0, 1.0, 1.0, 1.0]);
    this._setShader(ShaderFactory.getLineShader());

    if (
      x1 !== undefined &&
      y1 !== undefined &&
      x2 !== undefined &&
      y2 !== undefined
    ) {
      this.setEndpoints(x1, y1, x2, y2);
    }
  }

  draw(camera: Camera) {
    super.draw(camera);
  }

  private calcXform() {
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

  setEndpoints(x1: number, y1: number, x2: number, y2: number) {
    vec2.set(this._start, x1, y1);
    vec2.set(this._end, x2, y2);
    this.calcXform();
  }

  setStartPos(x: number, y: number) {
    vec2.set(this._start, x, y);
    this.calcXform();
  }

  setEndPos(x: number, y: number) {
    vec2.set(this._end, x, y);
    this.calcXform();
    this.end = vec2.fromValues(x, y);
  }
}
