/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ShaderFactory from "../shaders/ShaderFactory.js";
import core from "../core/Engine_Core.js";
import { ReadonlyVec4, vec4 } from "gl-matrix";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";
import SimpleShader from "../shaders/SimpleShader.js";

export default class Renderable {
    shader = ShaderFactory.getConstColorShader();
    color = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    xform = new Transform();

    _setShader (shader: SimpleShader) {
        this.shader = shader;
    };
    swapShader (shader: SimpleShader) {
        const current = this.shader;
        this.shader = shader;
        return current;
    };

    getColor() {
        return this.color;
    }

    setColor(color: vec4) {
        this.color = color;
    }
    swapColor (color: ReadonlyVec4) {
        const current = vec4.clone(this.color);
        vec4.copy(this.color, color);
        return current;
    };

    getXform() {
        return this.xform;
    }

    setXform (xform: Transform) {
        this.xform = xform;
    };

    draw(camera: Camera) {
        const gl = core.getGL();
        this.shader.activateShader(this.color, camera);
        this.shader.loadObjectTransform(this.xform.getXForm());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

}