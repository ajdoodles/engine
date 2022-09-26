import { vec4 } from "gl-matrix";
import GameObject from "../gameobjects/GameObject";
import PhysicsComponent from "../physics/PhysicsComponent";
import ParticleRenderable from "../renderables/ParticleRenderable";
import Particle from "./Particle";

export default class ParticleGameObject extends GameObject {
  physicsComponent: PhysicsComponent;

  readonly deltaColor: color = [0, 0, 0, 0];
  public sizeDelta = 0;

  set finalColor(c: color) {
    vec4.sub(this.deltaColor, c, this.renderComponent.getColor());
    if (this.cyclesToLive > 0) {
      vec4.scale(this.deltaColor, this.deltaColor, 1 / this.cyclesToLive);
    }
  }

  get hasExpired() {
    return this.cyclesToLive < 0;
  }

  constructor(
    texture: string,
    atX: number,
    atY: number,
    private cyclesToLive: number
  ) {
    const renderable = new ParticleRenderable(texture);
    const xform = renderable.getXform();
    xform.setPosition(atX, atY);
    super(renderable);

    const p = new Particle(xform.getPosition());
    this.physicsComponent = p;
  }

  update() {
    super.update();

    this.cyclesToLive--;
    const color = this.renderComponent.getColor();
    vec4.add(color, color, this.deltaColor);

    const newWidth = this.xform.getWidth() * this.sizeDelta;
    this.xform.setSize(newWidth, newWidth);
  }
}
