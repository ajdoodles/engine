/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import core from "./Engine_GL.js";

export default new class {
  private readonly mVerticesOfSquare = [
    0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
  ];
  
  private readonly mTextureCoordinates = [
    1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0
  ];
  
  private _squareVertexBuffer!: WebGLBuffer | null;
  private _textureCoordinateBuffer!: WebGLBuffer | null;

  get squareVertexBuffer() {
    if (this._squareVertexBuffer === null || this._squareVertexBuffer === undefined) {
      throw "Attempting to use square vertex buffer before it is initialized."
    }
    return this._squareVertexBuffer;
  }
  
  get textureCoordinateBuffer() {
    if (this._textureCoordinateBuffer === null || this._textureCoordinateBuffer === undefined) {
      throw "Attempting to use texture coordinate buffer before it is initialized."
    }
    return this._textureCoordinateBuffer;
  }

  public initialize() {
    const gl = core.gl;
  
    this._squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._squareVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.mVerticesOfSquare),
      gl.STATIC_DRAW
    );

    this._textureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._textureCoordinateBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.mTextureCoordinates),
      gl.STATIC_DRAW
    );
  };
}