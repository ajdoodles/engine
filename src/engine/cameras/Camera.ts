/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import core from "../core/Engine_GL.js";
import input from "../core/Engine_Input.js";
import CameraState from "./CameraState.js";
import MathUtils from "../utils/MathUtils.js";
import { vec2, vec3, mat4 } from "gl-matrix";
import CameraShake from "./CameraShake.js";
import Transform from "../utils/Transform.js";
import BoundingBox from "../utils/BoundingBox.js";

class PreRenderCache {
  wcToPixelsRatio = 1;
  viewportBottomWC = -1;
  viewportLeftWC = -1;
  cameraPosPx: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
}

/**
 * Defines a camera that will draw a section of the world on to a section of
 * canvas known as a viewport.
 * @param {type} wcCenter position to look at in WC space (world units).
 * @param {type} wcWidth the size of the "frame" the camera looks through.
 *                       In other words, the frame's left is wcCenter -
 *                       (wcWidth/2), bottom is wcCenter - (wcHeight/2). The
 *                       frame is wcWidth world units wide AND
 *                       (bounds - 2*borderPx) pixels wide.
 * @param {type} bounds area of canvas in DC space on which to draw. Strictly
 *                      contains the viewport.
 * @param {type} borderPx space between the viewport and the outer bounds.
 * @returns {Camera}
 */
export default class Camera {
  static kCameraZPosWC = 10;

  cameraState: CameraState;
  renderCache: PreRenderCache;
  cameraShake: CameraShake | null;

  viewport: bounds;
  scissorBounds: bounds;
  viewportBorderPx: number;

  nearPlane: number;
  farPlane: number;

  viewMatrix: mat4;
  projMatrix: mat4;
  viewProjMatrix: mat4;

  bgColor: color;

  constructor(wcCenter: vec2, wcWidth: number, bounds: bounds, borderPx = 0) {
    this.cameraState = new CameraState(wcCenter, wcWidth);
    this.renderCache = new PreRenderCache();
    this.cameraShake = null;

    this.viewport = [0, 0, 0, 0];
    this.scissorBounds = [0, 0, 0, 0];
    this.viewportBorderPx = borderPx;

    this.setBounds(bounds, this.viewportBorderPx);

    this.nearPlane = 0;
    this.farPlane = 1000;

    this.viewMatrix = mat4.create();
    this.projMatrix = mat4.create();
    this.viewProjMatrix = mat4.create();

    this.bgColor = [0.8, 0.8, 0.8, 1.0];
  }

  setWCCenter(xPos: number, yPos: number) {
    this.cameraState.setCenter(vec2.fromValues(xPos, yPos));
  }

  getWCCenter() {
    return this.cameraState.getCenter();
  }

  setWCWidth(width: number) {
    //    this.mWCWidth = width;
    this.cameraState.setWidth(width);
  }

  getWCWidth() {
    return this.cameraState.getWidth();
  }

  getWCHeight() {
    return this.getWCWidth() * (this.viewport[3] / this.viewport[2]);
  }

  getWCLeft() {
    return this.getWCCenter()[0] - this.getWCWidth() / 2;
  }
  getWCRight() {
    return this.getWCCenter()[0] + this.getWCWidth() / 2;
  }
  getWCBottom() {
    return this.getWCCenter()[1] - this.getWCHeight() / 2;
  }
  getWCTop() {
    return this.getWCCenter()[1] + this.getWCHeight() / 2;
  }

  genRandomPosition2D() {
    const randomX = MathUtils.lerp(
      this.getWCLeft(),
      this.getWCRight(),
      Math.random()
    );
    const randomY = MathUtils.lerp(
      this.getWCBottom(),
      this.getWCTop(),
      Math.random()
    );
    return vec2.fromValues(randomX, randomY);
  }

  getViewportLeft() {
    return this.viewport[0];
  }

  getViewportBottom() {
    return this.viewport[1];
  }

  getCameraPosPx() {
    return this.renderCache.cameraPosPx;
  }

  setBackgroundColor(color: color) {
    this.bgColor = color;
  }

  getBackgroundColor() {
    return this.bgColor;
  }

  getVPMatrix() {
    return this.viewProjMatrix;
  }

  getBounds() {
    const out: bounds = [0, 0, 0, 0];
    out[0] = this.scissorBounds[0];
    out[1] = this.scissorBounds[1];
    out[2] = this.scissorBounds[2];
    out[3] = this.scissorBounds[3];
    return out;
  }

  setBounds(bounds: bounds, borderPx: number) {
    if (borderPx !== undefined) {
      this.viewportBorderPx = borderPx;
    } else {
      borderPx = this.viewportBorderPx;
    }

    this.viewport[0] = bounds[0] + borderPx;
    this.viewport[1] = bounds[1] + borderPx;
    this.viewport[2] = bounds[2] - borderPx * 2;
    this.viewport[3] = bounds[3] - borderPx * 2;

    this.scissorBounds[0] = bounds[0];
    this.scissorBounds[1] = bounds[1];
    this.scissorBounds[2] = bounds[2];
    this.scissorBounds[3] = bounds[3];
  }

  setupViewProjection() {
    const gl = core.gl;

    const bounds = this.scissorBounds;
    gl.viewport(
      this.viewport[0],
      this.viewport[1],
      this.viewport[2],
      this.viewport[3]
    );
    gl.scissor(bounds[0], bounds[1], bounds[2], bounds[3]);

    gl.enable(gl.SCISSOR_TEST);
    core.clearCanvas(this.bgColor);
    gl.disable(gl.SCISSOR_TEST);

    let center: vec2 = [0, 0];
    if (this.cameraShake === null) {
      center = this.getWCCenter();
    } else {
      center = this.cameraShake.getShookPos();
    }

    mat4.lookAt(
      this.viewMatrix,
      [center[0], center[1], Camera.kCameraZPosWC], // Camera position
      [center[0], center[1], 0], // lookat position
      [0, 1, 0]
    ); //orientation

    const wcHalfWidth = this.getWCWidth() * 0.5;
    const wcHalfHeight = this.getWCHeight() * 0.5;

    mat4.ortho(
      this.projMatrix,
      -wcHalfWidth, // Distance to left edge of world space
      wcHalfWidth, // distance to right edge of world space
      -wcHalfHeight, // " bottom edge
      wcHalfHeight, // " top edge
      this.nearPlane, // z-distance to near plane
      this.farPlane
    ); // z-distance to far plane

    mat4.multiply(this.viewProjMatrix, this.projMatrix, this.viewMatrix);

    this.renderCache.wcToPixelsRatio = this.viewport[2] / this.getWCWidth();
    this.renderCache.viewportLeftWC =
      this.getWCCenter()[0] - this.getWCWidth() / 2;
    this.renderCache.viewportBottomWC =
      this.getWCCenter()[1] - this.getWCHeight() / 2;

    const cameraPosWC = vec3.fromValues(
      this.getWCCenter()[0],
      this.getWCCenter()[1],
      Camera.kCameraZPosWC
    );
    this.renderCache.cameraPosPx = vec3.clone(
      this.convertWCPosToPx(cameraPosWC)
    );
  }

  collideWCBound(xform: Transform, zone: number) {
    const xformBounds = new BoundingBox(
      xform.getPosition(),
      xform.getWidth(),
      xform.getHeight()
    );
    const zoneWidth = zone * this.getWCWidth();
    const zoneHeight = zone * this.getWCHeight();
    const zoneBounds = new BoundingBox(
      this.getWCCenter(),
      zoneWidth,
      zoneHeight
    );
    return zoneBounds.boundCollideStatus(xformBounds);
  }

  clampAtBoundary(xform: Transform, zone: number) {
    const status = this.collideWCBound(xform, zone);
    if (status !== BoundingBox.eBoundCollideStatus.eInside) {
      const pos = xform.getPosition();
      if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
        pos[0] =
          this.getWCCenter()[0] -
          (this.getWCWidth() * zone) / 2 +
          xform.getWidth() / 2;
      }
      if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
        pos[0] =
          this.getWCCenter()[0] +
          (this.getWCWidth() * zone) / 2 -
          xform.getWidth() / 2;
      }
      if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
        pos[1] =
          this.getWCCenter()[1] +
          (this.getWCHeight() * zone) / 2 -
          xform.getHeight() / 2;
      }
      if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
        pos[1] =
          this.getWCCenter()[1] -
          (this.getWCHeight() * zone) / 2 +
          xform.getHeight() / 2;
      }
    }
    return status;
  }

  isMouseInViewport() {
    const mousePos = input.getMousePosition();
    const x = mousePos[0] - this.viewport[0];
    const y = mousePos[1] - this.viewport[1];

    const inside = 0 <= x && x < this.viewport[2];
    return inside && 0 <= y && y < this.viewport[3];
  }

  convertWCSizeToPx(wcSize: number) {
    return wcSize * this.renderCache.wcToPixelsRatio;
  }

  getPixelsToWCRatio() {
    return this.getWCWidth() / this.viewport[2];
  }

  getWCCursorPosition() {
    if (!this.isMouseInViewport()) {
      throw "Mouse not found in viewport, can't get position in world space.";
    }

    const mousePos2DPx = input.getMousePosition();
    const vpOrigin = vec2.fromValues(
      this.getViewportLeft(),
      this.getViewportBottom()
    );
    const bottomLeft = vec2.fromValues(
      this.getWCCenter()[0] - this.getWCWidth() / 2,
      this.getWCCenter()[1] - this.getWCHeight() / 2
    );

    const wcPos = vec2.create();
    vec2.sub(wcPos, mousePos2DPx, vpOrigin);
    vec2.scaleAndAdd(wcPos, bottomLeft, wcPos, this.getPixelsToWCRatio());
    //    return vec3(wcPos[0], wcPos[1]);
    return wcPos;
  }

  convertWCPosToPx(wcPosition: vec3) {
    let x = wcPosition[0] - this.renderCache.viewportLeftWC;
    x = this.viewport[0] + x * this.renderCache.wcToPixelsRatio + 0.5;

    let y = wcPosition[1] - this.renderCache.viewportBottomWC;
    y = this.viewport[1] + y * this.renderCache.wcToPixelsRatio + 0.5;

    const z = wcPosition[2] * this.renderCache.wcToPixelsRatio;
    return vec3.fromValues(x, y, z);
  }

  convertWCVecToPx(wcVec: vec3) {
    const result = vec3.create();
    vec3.scale(result, wcVec, this.renderCache.wcToPixelsRatio);
    return result;
  }

  /**
   * Imported from Camera_Manipulation.js
   */

  update() {
    if (this.cameraShake !== null && this.cameraShake !== undefined) {
      if (this.cameraShake.shakeDone()) {
        this.cameraShake = null;
      } else {
        this.cameraShake.setCenter(this.getWCCenter());
        this.cameraShake.updateShakeState();
      }
    }
    this.cameraState.update();
  }

  configInterpolation(stiffness: number, duration: number) {
    this.cameraState.configInterpolation(stiffness, duration);
  }

  panBy(dx: number, dy: number) {
    const center = vec2.clone(this.getWCCenter());
    this.setWCCenter(center[0] + dx, center[1] + dy);
  }

  panTo(px: number, py: number) {
    this.setWCCenter(px, py);
  }

  panWith(xform: Transform, zone: number) {
    const status = this.collideWCBound(xform, zone);
    if (status !== BoundingBox.eBoundCollideStatus.eInside) {
      const newC = vec2.clone(this.getWCCenter());
      const pos = xform.getPosition();
      if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
        newC[0] =
          pos[0] - xform.getWidth() / 2 + (this.getWCWidth() * zone) / 2;
      }
      if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
        newC[0] =
          pos[0] + xform.getWidth() / 2 - (this.getWCWidth() * zone) / 2;
      }
      if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
        newC[1] =
          pos[1] + xform.getHeight() / 2 - (this.getWCHeight() * zone) / 2;
      }
      if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
        newC[1] =
          pos[1] - xform.getHeight() / 2 + (this.getWCHeight() * zone) / 2;
      }
      this.cameraState.setCenter(newC);
    }
    return status;
  }

  zoomBy(zoom: number) {
    if (zoom > 0) {
      this.setWCWidth(this.getWCWidth() * zoom);
    }
  }

  zoomTowards(pos: vec2, zoom: number) {
    if (zoom > 0) {
      const delta: vec2 = vec2.create();
      const center = vec2.clone(this.getWCCenter());
      vec2.sub(delta, pos, center);
      vec2.scale(delta, delta, zoom - 1);
      vec2.sub(center, center, delta);
      this.cameraState.setCenter(center);
      this.zoomBy(zoom);
    }
  }

  startShake(
    initDeltaX: number,
    initDeltaY: number,
    numOscillations: number,
    duration: number
  ) {
    this.cameraShake = new CameraShake(
      vec2.clone(this.cameraState.getCenter()),
      initDeltaX,
      initDeltaY,
      numOscillations,
      duration
    );
  }
}
