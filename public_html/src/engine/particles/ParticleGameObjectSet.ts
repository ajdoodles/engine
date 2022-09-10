import GameObjectSet from "../gameobjects/GameObjectSet";
import core from "../core/Engine_GL";
import Camera from "../cameras/Camera";
import ParticleGameObject from "./ParticleGameObject";

export default class ParticleGameObjectSet extends GameObjectSet {
  constructor() {
    super();
  }

  draw(camera: Camera) {
    const gl = core.gl;
    gl.blendFunc(gl.ONE, gl.ONE);
    super.draw(camera);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  update() {
    super.update();

    let i, obj;
    for (i = 0; i < this.size(); i++) {
      obj = this.getObjectAt(i) as ParticleGameObject;
      if (obj.hasExpired) {
        this.set.splice(i, 1);
      }
    }
  }
}
