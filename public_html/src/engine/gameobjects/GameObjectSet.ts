/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Camera from "../cameras/Camera.js";
import input from "../core/Engine_Input.js";
import { collided } from "../physics/Collisions.js";
import CollisionInfo from "../utils/CollisionInfo.js";
import GameObject from "./GameObject.js";

export default class GameObjectSet {
  delta: number;
  set: GameObject[];
  selected: number;
  alertCollisions: boolean;

  constructor() {
    this.delta = 0.3;

    this.set = [];
    this.selected = -1;
    this.alertCollisions = false;
  }

  size() {
    return this.set.length;
  }

  getObjectAt(index: number) {
    return this.set[index];
  }

  _isValidIndex(index: number | null | undefined) {
    return (
      index !== undefined &&
      index !== null &&
      index >= 0 &&
      index < this.set.length
    );
  }
  selectObjectAt(index: number) {
    if (this.set.length === 0) {
      throw "No objects to select";
    }
    if (!this._isValidIndex(index)) {
      throw "Index [" + index + "] is invalid, no object selected";
    }
    this.selected = index;
    console.log(this.selected + " is currently selected");
  }
  deselectObject() {
    this.selected = -1;
  }
  hasValidSelection() {
    return this._isValidIndex(this.selected);
  }
  getSelectedObject() {
    return this.hasValidSelection() ? this.set[this.selected] : null;
  }
  /**
   * Increments the current selection index. Wraps the index to 0 if incrementing
   * past the length of the array.
   * NOTE: If there is no selected object, this will attempt to select the first
   * object using {@function selectObjectAt}.
   */
  incSelected() {
    const index = (this.selected + 1) % this.set.length;
    this.selectObjectAt(index);
  }
  /**
   * Decrements the current selection index. Wraps to the last index if
   * decrementing below 0.
   * NOTE: If there is no selected object, this will attempt to select the last
   * object using {@function selectObjectAt}.
   */
  decSelected() {
    const index = this.selected <= 0 ? this.set.length - 1 : this.selected - 1;
    this.selectObjectAt(index);
  }

  setAlertCollisions(alert: boolean) {
    this.alertCollisions = alert;
  }
  isAlertingCollisions() {
    return this.alertCollisions;
  }

  addObject(obj: GameObject) {
    this.set.push(obj);
  }

  update() {
    if (this.hasValidSelection()) {
      const xform = this.getSelectedObject()?.xform;
      if (xform !== undefined) {
        if (input.isKeyPressed(input.keys.Up)) {
          xform.incYPos(this.delta);
        }
        if (input.isKeyPressed(input.keys.Left)) {
          xform.incXPos(-this.delta);
        }
        if (input.isKeyPressed(input.keys.Down)) {
          xform.incYPos(-this.delta);
        }
        if (input.isKeyPressed(input.keys.Right)) {
          xform.incXPos(this.delta);
        }
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      const obj = this.set[i];
      obj.update();
      if (this.isAlertingCollisions() && obj.physicsComponent !== undefined) {
        obj.physicsComponent.boundsColor = [1.0, 1.0, 1.0, 1.0];
      }
    }

    if (this.isAlertingCollisions()) {
      for (let j = 0; j < this.size(); j++) {
        const theseBounds = this.getObjectAt(j).physicsComponent;
        for (let k = j + 1; k < this.size(); k++) {
          const thoseBounds = this.getObjectAt(k).physicsComponent;
          if (
            theseBounds !== undefined &&
            thoseBounds !== undefined &&
            collided(theseBounds, thoseBounds, CollisionInfo.Instance)
          ) {
            theseBounds.boundsColor = [1.0, 0.0, 0.0, 1.0];
            thoseBounds.boundsColor = [1.0, 0.0, 0.0, 1.0];
          }
        }
      }
    }
  }

  draw(camera: Camera) {
    for (let i = 0; i < this.set.length; i++) {
      this.set[i].draw(camera);
    }
  }
}
