import { vec2 } from "gl-matrix";
import Camera from "../cameras/Camera";
import LineRenderable from "../renderables/LineRenderable";

export default abstract class PhysicsComponent {
  protected readonly positionMark = new LineRenderable();
  protected readonly padding = 0.25;
  public drawBounds = false;

  abstract position: vec2;

  get boundsColor() {
    return this.positionMark.getColor();
  }
  set boundsColor(c: color) {
    this.positionMark.setColor(c);
  }

  abstract update(): void;

  draw(camera: Camera) {
    if (!this.drawBounds) {
      return;
    }

    const pos = this.position;

    this.positionMark.setStartPos(pos[0] - this.padding, pos[1] + this.padding);
    this.positionMark.setEndPos(pos[0] + this.padding, pos[1] - this.padding);
    this.positionMark.draw(camera);

    this.positionMark.setStartPos(pos[0] + this.padding, pos[1] + this.padding);
    this.positionMark.setEndPos(pos[0] - this.padding, pos[1] - this.padding);
    this.positionMark.draw(camera);
  }
}
