import { vec2 } from "gl-matrix";

export default class CollisionInfo {
  depth = 0;
  normal = vec2.create();
  static readonly Instance = new CollisionInfo();
}
