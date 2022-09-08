import { vec2 } from "gl-matrix";
import GameObject from "../gameobjects/GameObject";
import GameObjectSet from "../gameobjects/GameObjectSet";
import RigidShape from "../physics/RigidShape";
import CollisionInfo from "../utils/CollisionInfo";

export default new (class {
  private readonly collisionInfo = CollisionInfo.Instance;

  remainingLoops = 0;
  hasOneCollision = false;

  private _numRelaxationLoops = 15;
  private relaxationOffset = 1 / this.numRelaxationLoops;

  private _posCorrectionRate = 0.8;
  private _systemAcceleration = vec2.fromValues(0, 0);

  get relaxationCorrectionRate() {
    return this._posCorrectionRate;
  }
  set relaxationCorrectionRate(r) {
    if (r <= 0 || r >= 1) {
      r = 0.8;
    }
    this._posCorrectionRate = r;
  }

  get systemAcceleration() {
    return this._systemAcceleration;
  }
  set systemAcceleration(a) {
    vec2.copy(this._systemAcceleration, a);
  }

  get numRelaxationLoops() {
    return this._numRelaxationLoops;
  }
  set numRelaxationLoops(c) {
    if (c <= 0) {
      c = 1;
    }
    this.numRelaxationLoops = c;
    this.relaxationOffset = 1 / this.numRelaxationLoops;
  }

  private positionalCorrection(
    s1: RigidShape,
    s2: RigidShape,
    collisionInfo: CollisionInfo
  ) {
    const num =
      (collisionInfo.depth / (s1.invMass + s2.invMass)) *
      this.relaxationCorrectionRate;
    const correctionAmount = vec2.create();
    vec2.scale(correctionAmount, collisionInfo.normal, num);

    const ca = vec2.create();

    vec2.scale(ca, correctionAmount, s1.invMass);
    const s1Pos = s1.getPosition();
    vec2.subtract(s1Pos, s1Pos, ca);

    vec2.scale(ca, correctionAmount, s2.invMass);
    const s2Pos = s2.getPosition();
    vec2.add(s2Pos, s2Pos, ca);
  }

  private applyFriction(n: vec2, v: vec2, f: number, m: number) {
    const tangent = vec2.fromValues(n[1], -n[0]);
    const tComponent = vec2.dot(v, tangent);

    if (Math.abs(tComponent) < 0.01) {
      return;
    }

    f *= m * this.relaxationOffset;
    if (tComponent < 0) {
      vec2.scale(tangent, tangent, -f);
    } else {
      vec2.scale(tangent, tangent, f);
    }
    vec2.sub(v, v, tangent);
  }

  private resolveCollision(
    s1: RigidShape,
    s2: RigidShape,
    collisionInfo: CollisionInfo
  ) {
    this.hasOneCollision = true;

    this.positionalCorrection(s1, s2, collisionInfo);

    this.applyFriction(
      collisionInfo.normal,
      s1.velocity,
      s1.friction,
      s1.invMass
    );
    this.applyFriction(
      collisionInfo.normal,
      s2.velocity,
      -s2.friction,
      s2.invMass
    );

    const relativeVelocity = vec2.create();
    vec2.sub(relativeVelocity, s2.velocity, s1.velocity);

    const velocityInNormal = vec2.dot(relativeVelocity, collisionInfo.normal);
    if (velocityInNormal > 0) {
      return;
    }

    const newRestitution = Math.min(s1.restitution, s2.restitution);
    let j = -(1 + newRestitution) * velocityInNormal;
    j = j / (s1.invMass + s2.invMass);

    const impulse = vec2.create();
    vec2.scale(impulse, collisionInfo.normal, j);

    const newImpulse = vec2.create();
    vec2.scale(newImpulse, impulse, s1.invMass);
    vec2.sub(s1.velocity, s1.velocity, newImpulse);

    vec2.scale(newImpulse, impulse, s2.invMass);
    vec2.add(s2.velocity, s2.velocity, newImpulse);
  }

  private beginRelaxation() {
    this.remainingLoops = this.numRelaxationLoops;
    this.hasOneCollision = true;
  }

  private continueRelaxation() {
    const oneCollision = this.hasOneCollision;
    this.hasOneCollision = false;
    this.remainingLoops--;
    return this.remainingLoops > 0 && oneCollision;
  }

  public processObjObj(obj1: GameObject, obj2: GameObject) {
    const shape1 = obj1.physicsComponent;
    const shape2 = obj2.physicsComponent;
    if (shape1 === undefined || shape2 === undefined || shape1 === shape2) {
      return;
    }

    this.beginRelaxation();
    while (this.continueRelaxation()) {
      if (shape1.collided(shape2, this.collisionInfo)) {
        this.resolveCollision(shape1, shape2, this.collisionInfo);
      }
    }
  }

  public processObjSet(obj: GameObject, set: GameObjectSet) {
    const shape1 = obj.physicsComponent;
    if (shape1 === undefined) {
      return;
    }
    let i, shape2;
    this.beginRelaxation();
    while (this.continueRelaxation()) {
      for (i = 0; i < set.size(); i++) {
        shape2 = set.getObjectAt(i).physicsComponent;
        if (
          shape2 !== undefined &&
          shape1 !== shape2 &&
          shape1.collided(shape2, this.collisionInfo)
        ) {
          this.resolveCollision(shape1, shape2, this.collisionInfo);
        }
      }
    }
  }

  public processSetSet(set1: GameObjectSet, set2: GameObjectSet) {
    let shape1, shape2, i, j;
    this.beginRelaxation();
    while (this.continueRelaxation) {
      for (i = 0; i < set1.size(); i++) {
        shape1 = set1.getObjectAt(i).physicsComponent;
        if (shape1 !== undefined) {
          for (j = 0; j < set2.size(); j++) {
            shape2 = set2.getObjectAt(j).physicsComponent;
            if (
              shape2 !== undefined &&
              shape1 !== shape2 &&
              shape1.collided(shape2, this.collisionInfo)
            ) {
              this.resolveCollision(shape1, shape2, this.collisionInfo);
            }
          }
        }
      }
    }
  }
})();
