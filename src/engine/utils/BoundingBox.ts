/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";

export default class BoundingBox {
  static eBoundCollideStatus = Object.freeze({
    eOutside: 0,
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside: 16,
  });

  lowerLeft: vec2;
  width!: number;
  height!: number;

  constructor(centerPos: vec2, w: number, h: number) {
    this.lowerLeft = vec2.fromValues(0, 0);
    this.setBounds(centerPos, w, h);
  }

  setBounds(centerPos: vec2, w: number, h: number) {
    this.width = w;
    this.height = h;
    this.lowerLeft[0] = centerPos[0] - w / 2;
    this.lowerLeft[1] = centerPos[1] - h / 2;
  }

  minX() {
    return this.lowerLeft[0];
  }
  left = this.minX;

  maxX() {
    return this.lowerLeft[0] + this.width;
  }
  right = this.maxX;

  minY() {
    return this.lowerLeft[1];
  }
  bottom = this.minY;

  maxY() {
    return this.lowerLeft[1] + this.height;
  }
  top = this.maxY;

  containsPoint(x: number, y: number) {
    return (
      x < this.maxX() && x > this.minX() && y < this.maxY() && y > this.minY()
    );
  }

  intersects(otherBounds: BoundingBox) {
    return (
      this.top() > otherBounds.bottom() &&
      this.bottom() < otherBounds.top() &&
      this.left() < otherBounds.right() &&
      this.right() > otherBounds.left()
    );
  }

  boundCollideStatus(otherBounds: BoundingBox) {
    let status = BoundingBox.eBoundCollideStatus.eOutside;
    if (this.intersects(otherBounds)) {
      if (this.right() < otherBounds.right()) {
        status |= BoundingBox.eBoundCollideStatus.eCollideRight;
      }
      if (this.left() > otherBounds.left()) {
        status |= BoundingBox.eBoundCollideStatus.eCollideLeft;
      }
      if (this.top() < otherBounds.top()) {
        status |= BoundingBox.eBoundCollideStatus.eCollideTop;
      }
      if (this.bottom() > otherBounds.bottom()) {
        status |= BoundingBox.eBoundCollideStatus.eCollideBottom;
      }
      if (status === BoundingBox.eBoundCollideStatus.eOutside) {
        status = BoundingBox.eBoundCollideStatus.eInside;
      }
    }
    return status;
  }
}
