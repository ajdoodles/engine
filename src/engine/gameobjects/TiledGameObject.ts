import { vec2 } from "gl-matrix";
import Camera from "../cameras/Camera";
import Renderable from "../renderables/Renderable";
import GameObject from "./GameObject";

export default class TileGameObject extends GameObject {
  public shouldTile = true;

  constructor(renderable: Renderable) {
    super(renderable);
  }

  public update() {
    const pos = this.xform.getPosition();
    vec2.scaleAndAdd(pos, pos, this._currentFrontDir, this.speed);
  }

  private drawTiles(camera: Camera) {
    const tileWidth = this.xform.getWidth();
    const tileHeight = this.xform.getHeight();
    const tilePos = this.xform.getPosition();

    const tileLeft = tilePos[0] - tileWidth / 2;
    let tileRight = tilePos[0] + tileWidth / 2;
    let tileTop = tilePos[1] + tileHeight / 2;
    const tileBottom = tilePos[1] - tileHeight / 2;

    const cameraPos = camera.getWCCenter();
    const cameraLeft = cameraPos[0] - camera.getWCWidth() / 2;
    const cameraRight = cameraPos[0] + camera.getWCWidth() / 2;
    const cameraTop = cameraPos[1] + camera.getWCHeight() / 2;
    const cameraBottom = cameraPos[1] - camera.getWCHeight() / 2;

    let dx = 0,
      dy = 0;
    if (tileRight < cameraLeft) {
      dx = Math.ceil((cameraLeft - tileRight) / tileWidth) * tileWidth;
    } else if (cameraLeft < tileLeft) {
      dx = -Math.ceil((tileLeft - cameraLeft) / tileWidth) * tileWidth;
    }

    if (tileTop < cameraBottom) {
      dy = Math.ceil((cameraBottom - tileTop) / tileHeight) * tileHeight;
    } else if (cameraBottom < tileBottom) {
      dy = -Math.ceil((tileBottom - cameraBottom) / tileHeight) * tileHeight;
    }

    const origX = tilePos[0];
    const origY = tilePos[1];

    this.xform.incXPos(dx);
    this.xform.incYPos(dy);
    tileRight = tilePos[0] + tileWidth / 2;
    tileTop = tilePos[1] + tileHeight / 2;

    const nx = Math.ceil((cameraRight - tileRight) / tileWidth);
    const ny = Math.ceil((cameraTop - tileTop) / tileHeight);

    let i, j;
    const leftStart = tilePos[0];
    for (i = 0; i <= ny; i++) {
      tilePos[0] = leftStart;
      for (j = 0; j <= nx; j++) {
        this.renderComponent.draw(camera);
        this.xform.incXPos(tileWidth);
      }
      this.xform.incYPos(tileHeight);
    }

    vec2.set(tilePos, origX, origY);
  }

  public draw(camera: Camera) {
    if (this.visible) {
      if (this.shouldTile) {
        this.drawTiles(camera);
      } else {
        this.renderComponent.draw(camera);
      }
    }
  }
}
