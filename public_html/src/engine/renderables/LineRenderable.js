/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import core from "../core/Engine_Core.js";
import Renderable from "./Renderable.js";
import { vec2, vec3 } from "gl-matrix";

export default function LineRenderable(x1, y1, x2, y2) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1.0, 1.0, 1.0, 1.0]);
    Renderable.prototype._setShader.call(this, ShaderFactory.getLineShader());
    
    this.mStart = vec2.fromValues(0.0, 0.0);
    this.mEnd = vec2.fromValues(0.0, 0.0);
    this.setLineWidth(0.2);
    
    if (x1 !== undefined ) {
        this.setVertices(x1, y1, x2, y2);
    }
};
core.inheritPrototype(Renderable, LineRenderable);

LineRenderable.prototype.draw = function (camera) {
    Renderable.prototype.draw.call(this, camera);
};

LineRenderable.prototype._calcXform = function () {
    //(sx, sy) is the line's vector
    var sx = this.mEnd[0] - this.mStart[0];
    var sy = this.mEnd[1] - this.mStart[1];

    //line center
    var cx = this.mStart[0] + (sx/2.0);
    var cy = this.mStart[1] + (sy/2.0);

    var lineLength = Math.sqrt((sx*sx) + (sy*sy));

    var rotation = vec2.angle(vec2.fromValues(sx, sy), vec2.fromValues(1.0, 0.0));

    var axisVector3D = vec3.fromValues(1.0, 0.0, 0.0);
    var lineVector3D = vec3.fromValues(sx, sy, 0.0);
    var cross = [];
    vec3.cross(cross, axisVector3D, lineVector3D);

    if (cross[2] < 0) {
        rotation = -rotation;
    }

    this.mXform.setPosition(cx, cy);
    this.mXform.setWidth(lineLength);
    this.mXform.setRotationRads(rotation);
};

LineRenderable.prototype.setVertices = function (x1, y1, x2, y2) {
    this.mStart[0] = x1;
    this.mStart[1] = y1;
    this.mEnd[0] = x2;
    this.mEnd[1] = y2;
    this._calcXform();
};

LineRenderable.prototype.setStartVertex = function (x, y) {
    this.mStart[0] = x;
    this.mStart[1] = y;
    this._calcXform();
};

LineRenderable.prototype.setEndVertex = function (x, y) {
    this.mEnd[0] = x;
    this.mEnd[1] = y;
    this._calcXform();
};

LineRenderable.prototype.setLineWidth = function (width) {
    this.mLineWidth = width;
    this.mXform.setHeight(width);
};

LineRenderable.prototype.draw = function (camera) {
    Renderable.prototype.draw.call(this, camera);
};
