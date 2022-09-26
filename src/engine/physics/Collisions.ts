import { vec2 } from "gl-matrix";
import CollisionInfo from "../utils/CollisionInfo";
import PhysicsComponent from "./PhysicsComponent";
import RigidCircle from "./RigidCircle";
import RigidRect from "./RigidRect";

export function collided(
  thing1: PhysicsComponent,
  thing2: PhysicsComponent,
  collisionInfo: CollisionInfo
): boolean {
  if (thing1 instanceof RigidRect) {
    return rectCollision(thing1, thing2, collisionInfo);
  } else if (thing1 instanceof RigidCircle) {
    return circCollision(thing1, thing2, collisionInfo);
  }
  return false;
}

function rectCollision(
  rect: RigidRect,
  thing: PhysicsComponent,
  collisionInfo: CollisionInfo
): boolean {
  if (thing instanceof RigidRect) {
    return rectRectCollision(rect, thing, collisionInfo);
  } else if (thing instanceof RigidCircle) {
    return rectCircCollision(rect, thing, collisionInfo);
  }
  return false;
}

function circCollision(
  circ: RigidCircle,
  thing: PhysicsComponent,
  collisionInfo: CollisionInfo
): boolean {
  if (thing instanceof RigidRect) {
    return circRectCollision(circ, thing, collisionInfo);
  } else if (thing instanceof RigidCircle) {
    return circCircCollision(circ, thing, collisionInfo);
  }
  return false;
}

function rectRectCollision(
  first: RigidRect,
  second: RigidRect,
  collisionInfo: CollisionInfo
) {
  const firstPos = first.position;
  const secondPos = second.position;

  const vFirstToSecond = vec2.create();
  vec2.subtract(vFirstToSecond, secondPos, firstPos);

  const xDepth =
    first.halfWidth + second.halfWidth - Math.abs(vFirstToSecond[0]);
  if (xDepth > 0) {
    const yDepth =
      first.halfHeight + second.halfHeight - Math.abs(vFirstToSecond[1]);

    if (yDepth > 0) {
      if (xDepth < yDepth) {
        collisionInfo.depth = xDepth;
        if (vFirstToSecond[0] > 0) {
          collisionInfo.normal = vec2.fromValues(1, 0);
        } else {
          collisionInfo.normal = vec2.fromValues(-1, 0);
        }
      } else {
        collisionInfo.depth = yDepth;
        if (vFirstToSecond[1] > 0) {
          collisionInfo.normal = vec2.fromValues(0, 1);
        } else {
          collisionInfo.normal = vec2.fromValues(0, -1);
        }
      }
      return true;
    }
  }

  return false;
}

function rectCircCollision(
  rect: RigidRect,
  circle: RigidCircle,
  collisionInfo: CollisionInfo
) {
  const rectPos = rect.position;
  const circlePos = circle.position;

  // calculate vector from rect center to circ center
  const vRectToCirc = vec2.create();
  vec2.subtract(vRectToCirc, circlePos, rectPos);

  // find the vector that corresponds to the nearest point on
  // the rectangle's edge
  const vec = vec2.clone(vRectToCirc);
  rect.projectToEdge(vec);
  rect.clampToEdge(vec);

  // calculate the collision normal
  // i.e. the shortest distance between the rectangle's edges and the circle's center
  const normal = vec2.create();
  vec2.subtract(normal, vRectToCirc, vec);

  // Either the circle is inside the rectangle, or it's close enough
  // to collide. If neither is true, no collision.
  const squaredNormal = vec2.squaredLength(normal);
  const squaredRadius = circle.radius * circle.radius;

  const isInside = rect.containsPos(circlePos);
  if (!isInside && squaredRadius < squaredNormal) {
    return false;
  }

  const len = Math.sqrt(squaredNormal);
  let depth = circle.radius;

  // Normallize normal
  vec2.scale(normal, normal, 1 / len);

  // Flip normal so it's pointing away from the rectangle's center
  if (isInside) {
    depth += len;
    vec2.scale(normal, normal, -1);
  } else {
    depth -= len;
  }

  collisionInfo.normal = normal;
  collisionInfo.depth = depth;
  return true;
}

function circRectCollision(
  circle: RigidCircle,
  rect: RigidRect,
  collisionInfo: CollisionInfo
) {
  const isCollided = rectCircCollision(rect, circle, collisionInfo);
  vec2.scale(collisionInfo.normal, collisionInfo.normal, -1);
  return isCollided;
}

function circCircCollision(
  first: RigidCircle,
  second: RigidCircle,
  collisionInfo: CollisionInfo
) {
  const distSquared = vec2.squaredDistance(first.position, second.position);
  const maxDist = first.radius + second.radius;

  if (distSquared >= maxDist * maxDist) {
    return false;
  }

  const vFirstToSecond = vec2.create();
  vec2.subtract(vFirstToSecond, second.position, first.position);

  const dist = Math.sqrt(distSquared);
  const depth = first.radius + second.radius - dist;
  let normal;

  if (dist === 0) {
    normal = vec2.fromValues(0, 1);
  } else {
    normal = vec2.clone(vFirstToSecond);
    vec2.scale(normal, normal, 1 / dist);
  }

  collisionInfo.depth = depth;
  collisionInfo.normal = normal;
  return true;
}
