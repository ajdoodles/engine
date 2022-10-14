/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import { vec3 } from "gl-matrix";
import core from "./Engine_GL.js";

export default new class {
  private readonly mVerticesOfTriangle = [
    0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0
  ]
  
  private readonly mVerticesOfSquare = [
    0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
  ];
  
  private readonly mTextureCoordinates = [
    1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0
  ];
  
  private readonly squareVertsForAsteroid = [
    -0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0
  ];
  private readonly asteroidCornerInset = .22;
  private readonly mAsteroidVertices : number[] = [];

  private _triangleVertexBuffer!: WebGLBuffer | null;
  private _squareVertexBuffer!: WebGLBuffer | null;
  private _asteroidVertexBuffer!: WebGLBuffer | null;
  private _textureCoordinateBuffer!: WebGLBuffer | null;

  get triangleVertexBuffer() {
    if (this._triangleVertexBuffer === null || this._triangleVertexBuffer === undefined) {
      throw "Attempting to use triangle vertex buffer before it is initialized."
    }
    return this._triangleVertexBuffer;
  }

  get squareVertexBuffer() {
    if (this._squareVertexBuffer === null || this._squareVertexBuffer === undefined) {
      throw "Attempting to use square vertex buffer before it is initialized."
    }
    return this._squareVertexBuffer;
  }
  
  get asteroidVertexBuffer() {
    if (this._asteroidVertexBuffer === null || this._asteroidVertexBuffer === undefined) {
      throw "Attempting to use asteroid coordinate buffer before it is initialized."
    }
    return this._asteroidVertexBuffer;
  }

  get textureCoordinateBuffer() {
    if (this._textureCoordinateBuffer === null || this._textureCoordinateBuffer === undefined) {
      throw "Attempting to use texture coordinate buffer before it is initialized."
    }
    return this._textureCoordinateBuffer;
  }

  private genAsteroidVertices() {
    const vertex = vec3.create();
    
    let insetIndex = 0;
    let i;

    for (i = 0; i < this.squareVertsForAsteroid.length; i += 3) {
      vec3.set(vertex, this.squareVertsForAsteroid[i], this.squareVertsForAsteroid[i+1], this.squareVertsForAsteroid[i+2]);
      this.insetCorner(vertex, insetIndex);
      insetIndex ^= 1;
      this.insetCorner(vertex, insetIndex);
    }
  }

  private insetCorner(corner: vec3, insetIndex: number) {
    const newVert : vec3 = vec3.clone(corner);
    const oldVal = newVert[insetIndex];
    const newVal = Math.abs(oldVal) - this.asteroidCornerInset;
    const sign = Math.abs(oldVal) / oldVal;
    newVert[insetIndex] = newVal * sign;
    this.mAsteroidVertices.push(newVert[0], newVert[1], newVert[2]);
  }

  public initialize() {
    const gl = core.gl;
  
    this._triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._triangleVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.mVerticesOfTriangle),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this._squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._squareVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.mVerticesOfSquare),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

      this.genAsteroidVertices();
      this._asteroidVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this._asteroidVertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(this.mAsteroidVertices),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this._textureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._textureCoordinateBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.mTextureCoordinates),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  };
}