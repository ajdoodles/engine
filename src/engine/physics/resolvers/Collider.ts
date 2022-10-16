import CollisionInfo from "../../utils/CollisionInfo";
import assertExhaustive from "../../utils/ExhaustTypes";
import RigidCircle from "../RigidCircle";
import RigidRect from "../RigidRect";
import { ICircle, IRect, PhysicsBody, PhysicsType } from "../RigidType";

export interface Collider<T extends PhysicsBody>{
    collided(thing1:T, thing2:PhysicsBody, cInfo:CollisionInfo): boolean;
    collidedWithRect(thing: T, rect: RigidRect, cInfo: CollisionInfo): boolean;
    collidedWithCirc(thing: T, circ: RigidCircle, cInfo: CollisionInfo): boolean;
}

export abstract class BaseCollider<T extends PhysicsBody> implements Collider<T>{
    collided(thing1: T, thing2: PhysicsBody, cInfo: CollisionInfo): boolean {
      const pType = thing2.pType;
      switch(pType) {
        case PhysicsType.RECT:
          return this.collidedWithRect(thing1, thing2, cInfo);
        case PhysicsType.CIRCLE:
          return this.collidedWithCirc(thing1, thing2, cInfo);
        case PhysicsType.PARTICLE:
          throw new Error("PARTICLE COLLIDER NOT YET IMPLEMENTED");
        default:
          assertExhaustive(pType);
      }
    }

    abstract collidedWithRect(thing: T, rect: IRect, cInfo: CollisionInfo): boolean;
    abstract collidedWithCirc(thing: T, circ: ICircle, cInfo: CollisionInfo): boolean;
}