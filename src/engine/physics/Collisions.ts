import CollisionInfo from "../utils/CollisionInfo";
import CircCollider from "./resolvers/CircCollider";
import RectCollider from "./resolvers/RectCollider";
import RigidCircle from "./RigidCircle";
import RigidRect from "./RigidRect";
import RigidShape from "./RigidShape";

export function collided<T extends RigidShape, U extends RigidShape>(
  thing1: T,
  thing2: U,
  collisionInfo: CollisionInfo
): boolean {
  if (thing1 instanceof RigidRect) {
    return RectCollider.collided(thing1, thing2, collisionInfo);
  } else if (thing1 instanceof RigidCircle) {
    return CircCollider.collided(thing1, thing2, collisionInfo);
  }
  return false;
}