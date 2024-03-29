/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { mat4 } from "gl-matrix";
import Camera from "../cameras/Camera.js";
import core from "../core/Engine_GL.js";
import vertexBuffers from "../core/Engine_VertexBuffers.js";
import resourceMap from "../core/resources/Engine_ResourceMap.js";
import assertExhaustive from "../utils/ExhaustTypes.js";
import { GeometryType } from "./Geometry.js";

export default class FlatShader {
  compiledShader: WebGLProgram;
  shaderVertexPositionAttribute!: number;
  modelTransform!: WebGLUniformLocation;
  viewProjTransform!: WebGLUniformLocation;
  pixelColor!: WebGLUniformLocation;

  constructor(vertexShaderId: string, fragmentShaderId: string) {
    const gl = core.gl;

    const vertexShader = this._compileShader(
      vertexShaderId,
      gl.VERTEX_SHADER
    ) as WebGLShader;
    const fragmentShader = this._compileShader(
      fragmentShaderId,
      gl.FRAGMENT_SHADER
    ) as WebGLShader;

    this.compiledShader = gl.createProgram() as WebGLProgram;
    gl.attachShader(this.compiledShader, vertexShader);
    gl.attachShader(this.compiledShader, fragmentShader);
    gl.linkProgram(this.compiledShader);

    if (!gl.getProgramParameter(this.compiledShader, gl.LINK_STATUS)) {
      alert("Error linking shader.");
      return;
    }

    this.modelTransform = gl.getUniformLocation(
      this.compiledShader,
      "uModelTransform"
    ) as WebGLUniformLocation;
    this.viewProjTransform = gl.getUniformLocation(
      this.compiledShader,
      "uViewProjTransform"
    ) as WebGLUniformLocation;
    this.pixelColor = gl.getUniformLocation(
      this.compiledShader,
      "uPixelColor"
    ) as WebGLUniformLocation;

    this.shaderVertexPositionAttribute = gl.getAttribLocation(
      this.compiledShader,
      "aShapeVertexPosition"
    );
  }

  protected _bindVertexBuffer(shape: GeometryType = GeometryType.SQUARE) {
    const gl = core.gl;

    let vertexBuffer;
    switch(shape) {
      case GeometryType.SQUARE:
        vertexBuffer = vertexBuffers.squareVertexBuffer;
        break;
      case GeometryType.TRIANGLE:
        vertexBuffer = vertexBuffers.triangleVertexBuffer;
        break;
      case GeometryType.ASTEROID:
        vertexBuffer = vertexBuffers.asteroidVertexBuffer;
        break;
      default:
        assertExhaustive(shape);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(
      this.shaderVertexPositionAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  _compileShader(filepath: string, shaderType: number) {
    const gl = core.gl;
    const shaderSource = resourceMap.retrieveAsset(filepath) as string;
    const compiledShader = gl.createShader(shaderType) as WebGLShader;

    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
      const errorMsg = gl.getShaderInfoLog(compiledShader);
      alert("A shader compiling error occurred: " + errorMsg);
      console.log(errorMsg);
    }

    return compiledShader;
  }

  activateShader(pixelColor: color, camera: Camera, shape: GeometryType = GeometryType.SQUARE) {
    this._bindVertexBuffer(shape);

    const gl = core.gl;
    gl.useProgram(this.compiledShader);
    gl.uniformMatrix4fv(this.viewProjTransform, false, camera.getVPMatrix());
    gl.enableVertexAttribArray(this.shaderVertexPositionAttribute);
    gl.uniform4fv(this.pixelColor, pixelColor);
  }

  loadObjectTransform(modelTransform: mat4) {
    const gl = core.gl;
    gl.uniformMatrix4fv(this.modelTransform, false, modelTransform);
  }

  getShader() {
    return this.compiledShader;
  }
}
