import { vec2 } from "gl-matrix";
import GameObject from "../../gameobjects/GameObject";
import GameObjectSet from "../../gameobjects/GameObjectSet";
import Particle from "../../particles/Particle";
import ParticleGameObjectSet from "../../particles/ParticleGameObjectSet";
import RigidShape from "../../physics/RigidShape";

export default new (class {
  public readonly systemAcceleration = vec2.fromValues(0, -50);

  resolveParticleCollision(shape: RigidShape, particle: Particle) {
    if (!shape.containsPos(particle.position)) {
      return;
    }

    const pVec = vec2.create();
    vec2.subtract(pVec, particle.position, shape.position);
    shape.projectToEdge(pVec);
    vec2.add(particle.position, shape.position, pVec);
  }

  processObjSet(obj: GameObject, set: ParticleGameObjectSet) {
    let i;
    const shape = obj.physicsComponent as RigidShape;
    for (i = 0; i < set.size(); i++) {
      this.resolveParticleCollision(
        shape,
        set.getObjectAt(i).physicsComponent as Particle
      );
    }
  }

  processSetSet(objSet: GameObjectSet, partSet: ParticleGameObjectSet) {
    let i;
    for (i = 0; i < objSet.size(); i++) {
      this.processObjSet(objSet.getObjectAt(i), partSet);
    }
  }
})();
