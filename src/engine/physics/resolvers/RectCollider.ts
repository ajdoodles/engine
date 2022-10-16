import { vec2 } from "gl-matrix";
import CollisionInfo from "../../utils/CollisionInfo";
import RigidCircle from "../RigidCircle";
import RigidRect from "../RigidRect";
import { BaseCollider } from "./Collider";

export default new class RectCollider extends BaseCollider<RigidRect> {

    collidedWithRect(first: RigidRect, second: RigidRect, cInfo: CollisionInfo): boolean {
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
              cInfo.depth = xDepth;
              if (vFirstToSecond[0] > 0) {
                cInfo.normal = vec2.fromValues(1, 0);
              } else {
                cInfo.normal = vec2.fromValues(-1, 0);
              }
            } else {
              cInfo.depth = yDepth;
              if (vFirstToSecond[1] > 0) {
                cInfo.normal = vec2.fromValues(0, 1);
              } else {
                cInfo.normal = vec2.fromValues(0, -1);
              }
            }
            return true;
          }
        }
      
        return false;
    }

    collidedWithCirc(rect: RigidRect, circle: RigidCircle, cInfo: CollisionInfo): boolean {
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
      
        cInfo.normal = normal;
        cInfo.depth = depth;
        return true;
    }
}