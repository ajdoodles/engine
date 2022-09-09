import GameObject from "../../engine/gameobjects/GameObject";
import RigidRect from "../../engine/physics/RigidRect";
import Renderable from "../../engine/renderables/Renderable";

export default class Wall extends GameObject {
  physicsComponent!: RigidRect;

  constructor(wall: Renderable) {
    super(wall);
    this.physicsComponent = new RigidRect(
      this.xform,
      this.xform.getWidth(),
      this.xform.getHeight()
    );
    this.physicsComponent.mass = 0;
    this.physicsComponent.drawBounds = true;
  }
}
