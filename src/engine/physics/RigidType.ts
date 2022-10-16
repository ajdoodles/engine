import { vec2 } from "gl-matrix";
import Camera from "../cameras/Camera";

export enum PhysicsType {
  CIRCLE,
  RECT,
  PARTICLE,
}

export interface IPhysicsObj {
  position: vec2;
  velocity: vec2;
  acceleration: vec2;

  drawBounds: boolean;
  boundsColor: color;

  update(): void;
  draw(camera: Camera): void;
}

export interface IShape extends IPhysicsObj {
  invMass: number;
  restitution: number;
  friction: number;

  containsPos(pos: vec2): boolean;
  containsVec(vec: vec2): boolean;
  projectToEdge(pos: vec2): void;
  clampToEdge(pos: vec2): void;
}

export interface ICircle extends IShape {
  pType: PhysicsType.CIRCLE
  radius: number;
  numSides: number;
  angularDelta: number;
}

export interface IRect extends IShape {
  pType: PhysicsType.RECT
  halfWidth: number;
  halfHeight: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface IParticle extends IPhysicsObj {
  pType: PhysicsType.PARTICLE
  drag: number;
}

export type PhysicsBody = ICircle | IRect | IParticle;