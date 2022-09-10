import { vec2 } from "gl-matrix";
import GameObject from "../../gameobjects/GameObject";
import GameObjectSet from "../../gameobjects/GameObjectSet";
import Particle from "../../particles/Particle";
import ParticleGameObjectSet from "../../particles/ParticleGameObjectSet";
import RigidCircle from "../../physics/RigidCircle";
import RigidRect from "../../physics/RigidRect";
import RigidShape from "../../physics/RigidShape";

export default new (class {
  public static readonly systemAcceleration = vec2.fromValues(0, -50);

  resolveParticleCollision(shape: RigidShape, particle: Particle) {
    if (shape instanceof RigidRect) {
      this.resolveRectPos(shape, particle);
    } else if (shape instanceof RigidCircle) {
      this.resolveCircPos(shape, particle);
    }
  }

  resolveRectPos(rect: RigidRect, particle: Particle) {
    if (!rect.containsPos(particle.position)) {
      return false;
    }

    rect.projectToEdge(particle.position);
  }

  resolveCircPos(circle: RigidCircle, particle: Particle) {
    if (!circle.containsPos(particle.position)) {
      return false;
    }

    circle.projectToEdge(particle.position);
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
