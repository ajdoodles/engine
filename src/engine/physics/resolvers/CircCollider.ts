import { vec2 } from "gl-matrix";
import CollisionInfo from "../../utils/CollisionInfo";
import RigidCircle from "../RigidCircle";
import RigidRect from "../RigidRect";
import { BaseCollider } from "./Collider";
import RectCollider from "./RectCollider";

export default new class CircCollider extends BaseCollider<RigidCircle> {
    
    collidedWithRect(circle: RigidCircle, rect: RigidRect, cInfo: CollisionInfo): boolean {
        const isCollided = RectCollider.collidedWithCirc(rect, circle, cInfo);
        // flip the normal to match the new order of arguments
        vec2.scale(cInfo.normal, cInfo.normal, -1);
        return isCollided;
    }
     
    collidedWithCirc(first: RigidCircle, second: RigidCircle, cInfo: CollisionInfo): boolean {
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
      
        cInfo.depth = depth;
        cInfo.normal = normal;
        return true;
    }
}