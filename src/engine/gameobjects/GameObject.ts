/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec2, vec3 } from "gl-matrix";
import Camera from "../cameras/Camera";
import { PhysicsBody } from "../physics/RigidType";
import Renderable from "../renderables/Renderable";
import TextureRenderable from "../renderables/TextureRenderable";
import { GeometryType } from "../shaders/Geometry";
import BoundingBox from "../utils/BoundingBox";

export default class GameObject {
  public physicsComponent?: PhysicsBody;
  public visible = true;
  protected _currentFrontDir: vec2 = vec2.fromValues(0, 1);
  public speed = 0;
  public shape = GeometryType.SQUARE;

  get xform() {
    return this.renderComponent.getXform();
  }

  get currentFrontDir() {
    return this._currentFrontDir;
  }
  set currentFrontDir(dir) {
    vec2.copy(this._currentFrontDir, dir);
  }

  constructor(public renderComponent: Renderable) {}

  getBBox() {
    const xform = this.xform;
    return new BoundingBox(
      xform.getPosition(),
      xform.getWidth(),
      xform.getHeight()
    );
  }

  rotateObjPointTo(target: vec2, rate: number) {
    //    var distToTarget = vec2.distance(target, this.Xform.getPosition());
    const targetVector = vec2.create();
    vec2.subtract(targetVector, target, this.xform.getPosition());
    const distToTarget = vec2.length(targetVector);
    if (distToTarget < Number.MIN_VALUE) {
      return; //reached target
    }
    vec2.scale(targetVector, targetVector, 1 / distToTarget);

    let cosTheta = vec2.dot(targetVector, this.currentFrontDir);
    if (cosTheta > 0.999999) {
      return; //facing the correct direction
    }

    if (cosTheta > 1) {
      cosTheta = 1;
    } else if (cosTheta < -1) {
      cosTheta = -1;
    }

    const targetVector3D = vec3.fromValues(targetVector[0], targetVector[1], 0);
    const frontDir3D = vec3.fromValues(
      this.currentFrontDir[0],
      this.currentFrontDir[1],
      0
    );
    const cross = vec3.create();
    vec3.cross(cross, frontDir3D, targetVector3D);

    let rads = Math.acos(cosTheta);
    if (cross[2] < 0) {
      rads = -rads;
    }

    rads *= rate;
    vec2.rotate(
      this.currentFrontDir,
      this.currentFrontDir,
      vec2.fromValues(0, 0),
      rads
    );
    this.xform.incRotationInRads(rads);
  }

  update() {
    if (this.physicsComponent !== undefined) {
      this.physicsComponent.update();
    }
  }

  draw(camera: Camera) {
    if (this.visible) {
      this.renderComponent.draw(camera, this.shape);

      if (this.physicsComponent !== null) {
        this.physicsComponent?.draw(camera);
      }
    }
  }

  pixelTouches(otherObj: GameObject, wcTouchPos: vec2) {
    let pixelTouches = false;
    const otherRen = otherObj.renderComponent;
    const thisRen = this.renderComponent;

    if (
      otherRen instanceof TextureRenderable &&
      thisRen instanceof TextureRenderable
    ) {
      if (
        otherObj.xform.getRotation() === 0 &&
        this.xform.getRotation() === 0
      ) {
        if (this.getBBox().intersects(otherObj.getBBox())) {
          thisRen.setColorArray();
          otherRen.setColorArray();
          pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
        }
      } else {
        const thisWidth = this.xform.getWidth();
        const thisHeight = this.xform.getHeight();
        const otherWidth = otherObj.xform.getWidth();
        const otherHeight = otherObj.xform.getHeight();

        const thisRadius = Math.sqrt(
          Math.pow(thisWidth * 0.5, 2) + Math.pow(thisHeight * 0.5, 2)
        );
        const otherRadius = Math.sqrt(
          Math.pow(otherWidth * 0.5, 2) + Math.pow(otherHeight * 0.5, 2)
        );

        const delta = vec2.create();
        vec2.sub(delta, this.xform.getPosition(), otherObj.xform.getPosition());
        if (vec2.length(delta) < thisRadius + otherRadius) {
          thisRen.setColorArray();
          otherRen.setColorArray();
          pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
        }
      }
    }

    return pixelTouches;
  }
}
