import CollisionInfo from "../../utils/CollisionInfo";
import RigidCircle from "../RigidCircle";
import RigidRect from "../RigidRect";
import RigidShape from "../RigidShape";

export interface Collider<T extends RigidShape>{
    collided<U extends RigidShape>(thing1:T, thing2:U, cInfo:CollisionInfo): boolean;
    collidedWithRect(thing: T, rect: RigidRect, cInfo: CollisionInfo): boolean;
    collidedWithCirc(thing: T, circ: RigidCircle, cInfo: CollisionInfo): boolean;
}

export abstract class BaseCollider<T extends RigidShape> implements Collider<T>{
    collided<U extends RigidShape>(thing1: T, thing2: U, cInfo: CollisionInfo): boolean {
        if (thing2 instanceof RigidRect) {
            return this.collidedWithRect(thing1, thing2, cInfo);
          } else if (thing2 instanceof RigidCircle) {
            return this.collidedWithCirc(thing1, thing2, cInfo);
          }
          return false;
    }

    abstract collidedWithRect(thing: T, rect: RigidRect, cInfo: CollisionInfo): boolean;
    abstract collidedWithCirc(thing: T, circ: RigidCircle, cInfo: CollisionInfo): boolean;
}