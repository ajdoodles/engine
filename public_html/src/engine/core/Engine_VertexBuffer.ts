/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import core from "./Engine_GL.js";

const mVerticesOfSquare = [
  0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
];

const mTextureCoordinates = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];

let mSquareVertexBuffer: WebGLBuffer;
let mTextureCoordinateBuffer: WebGLBuffer;

const getGLVertexRef = function () {
  return mSquareVertexBuffer;
};

const getGLTexCoordRef = function () {
  return mTextureCoordinateBuffer;
};

const initialize = function () {
  const gl = core.getGL();

  mSquareVertexBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(mVerticesOfSquare),
    gl.STATIC_DRAW
  );

  mTextureCoordinateBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, mTextureCoordinateBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(mTextureCoordinates),
    gl.STATIC_DRAW
  );
};

const mPublic = {
  getGLVertexRef: getGLVertexRef,
  getGLTexCoordRef: getGLTexCoordRef,
  initialize: initialize,
};

export default mPublic;
