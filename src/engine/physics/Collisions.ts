import CollisionInfo from "../utils/CollisionInfo";
import assertExhaustive from "../utils/ExhaustTypes";
import CircCollider from "./resolvers/CircCollider";
import RectCollider from "./resolvers/RectCollider";
import { PhysicsBody, PhysicsType } from "./RigidType";

export function collided(
  thing1: PhysicsBody,
  thing2: PhysicsBody,
  cInfo: CollisionInfo
): boolean {
  const pType = thing1.pType;
  switch (pType) {
    case PhysicsType.RECT:
      return RectCollider.collided(thing1, thing2, cInfo);
    case PhysicsType.CIRCLE:
      return CircCollider.collided(thing1, thing2, cInfo);
    case PhysicsType.PARTICLE:
      throw new Error("PARTICLE COLLIDER NOT YET IMPLEMENTED");
    default:
      assertExhaustive(pType);
  }
}