/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Scene {
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var core = new (class {
    initializeWebGL(htmlCanvasId) {
        const canvas = document.getElementById(htmlCanvasId);
        const args = {
            alpha: false,
            depth: true,
            stencil: true,
        };
        this.gl = canvas.getContext("webgl2", args);
        if (this.gl === null) {
            document.write("<br/><b> WebGL is not supported. </b>");
            return;
        }
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    clearCanvas(color) {
        this.gl.clearColor(color[0], color[1], color[2], color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT);
    }
})();

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const mVerticesOfSquare = [
    0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
];
const mTextureCoordinates = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
let mSquareVertexBuffer;
let mTextureCoordinateBuffer;
const getGLVertexRef = function () {
    return mSquareVertexBuffer;
};
const getGLTexCoordRef = function () {
    return mTextureCoordinateBuffer;
};
const initialize$1 = function () {
    const gl = core.gl;
    mSquareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
    mTextureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mTextureCoordinateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoordinates), gl.STATIC_DRAW);
};
const mPublic$9 = {
    getGLVertexRef: getGLVertexRef,
    getGLTexCoordRef: getGLTexCoordRef,
    initialize: initialize$1,
};

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$3() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$2(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$2() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone$2(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues$2(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy$2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set$1(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale$1(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$2();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$1() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {ReadonlyVec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */

function clone$1(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */

function fromValues$1(x, y, z, w) {
  var out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */

function copy$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {ReadonlyVec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */

function clone(a) {
  var out = new ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  return out;
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0],
      y = a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Rotate a 2D vector
 * @param {vec2} out The receiving vec2
 * @param {ReadonlyVec2} a The vec2 point to rotate
 * @param {ReadonlyVec2} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec2} out
 */

function rotate(out, a, b, rad) {
  //Translate point to the origin
  var p0 = a[0] - b[0],
      p1 = a[1] - b[1],
      sinC = Math.sin(rad),
      cosC = Math.cos(rad); //perform rotation and translate to correct position

  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {ReadonlyVec2} a The first operand
 * @param {ReadonlyVec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
  mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
      // mag &&.. short circuits if mag == 0
  cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub = subtract;
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const kKeys = {
    Shift: 16,
    // arrows
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    // space bar
    Space: 32,
    // numbers
    Zero: 48,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
    Five: 53,
    Six: 54,
    Seven: 55,
    Eight: 56,
    Nine: 57,
    // Alphabets
    A: 65,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    LastKeyCode: 222,
};
const mKeyPreviousState = [];
const mIsKeyPressed = [];
const mIsKeyClicked = [];
const kMouse = {
    Left: 0,
    Middle: 1,
    Right: 2,
};
const mMousePreviousState = [];
const mIsMousePressed = [];
const mIsMouseClicked = [];
let mMouseX = -1;
let mMouseY = -1;
let mCanvas;
const _reverseKeyLookup = function (keyCode) {
    for (const key in kKeys) {
        if (keyCode === kKeys[key]) {
            return key;
        }
    }
    throw "COULDN'T REVERSE LOOKUP FOR KEYCODE " + keyCode;
};
const _reverseMouseLookup = function (buttonCode) {
    for (const button in kMouse) {
        if (buttonCode === kMouse[button]) {
            return button;
        }
    }
    throw "COULDN'T REVERSE LOOKUP FOR MOUSECODE " + buttonCode;
};
const _logInputEvent = function (eventString, button) {
    console.log(eventString + " fired with " + button + " button.");
};
const _onKeyDown = function (event) {
    _logInputEvent("KEYDOWN", _reverseKeyLookup(event.keyCode));
    mIsKeyPressed[event.keyCode] = true;
};
const _onKeyUp = function (event) {
    _logInputEvent("KEYUP", _reverseKeyLookup(event.keyCode));
    mIsKeyPressed[event.keyCode] = false;
};
const _onMouseDown = function (event) {
    _logInputEvent("MOUSEDOWN", _reverseMouseLookup(event.button));
    if (_onMouseMove(event)) {
        mIsMousePressed[event.button] = true;
    }
};
const _onMouseUp = function (event) {
    _logInputEvent("MOUSEUP", _reverseMouseLookup(event.button));
    _onMouseMove(event);
    mIsMousePressed[event.button] = false;
};
const _onMouseMove = function (event) {
    let inside = false;
    const canvasBounds = mCanvas.getBoundingClientRect();
    // Apparently rendered canvas elements can be different from the element's
    // reported height and/or width so the values need to be scaled.
    const x = Math.round(event.clientX - canvasBounds.left * (mCanvas.height / canvasBounds.height));
    const y = Math.round(event.clientY - canvasBounds.top * (mCanvas.width / canvasBounds.width));
    if (x >= 0 && y >= 0 && x < mCanvas.width && y < mCanvas.height) {
        mMouseX = x;
        mMouseY = mCanvas.height - y - 1;
        inside = true;
    }
    return inside;
};
const _cancelContextMenu = function (event) {
    _logInputEvent("CONTEXTMENU", "Right");
    if (typeof event.stopPropagation === "function") {
        event.stopPropagation();
    }
    if (typeof event.preventDefault === "function") {
        event.preventDefault();
    }
    return false;
};
const initialize = function (htmlCanvasID) {
    mCanvas = document.getElementById(htmlCanvasID);
    let i;
    for (i = 0; i < kKeys.LastKeyCode; i++) {
        mKeyPreviousState[i] = false;
        mIsKeyPressed[i] = false;
        mIsKeyClicked[i] = false;
    }
    let j;
    for (j = 0; j <= kMouse.Right; j++) {
        mMousePreviousState[j] = false;
        mIsMousePressed[j] = false;
        mIsMouseClicked[j] = false;
    }
    window.addEventListener("contextmenu", _cancelContextMenu);
    window.addEventListener("keyup", _onKeyUp);
    window.addEventListener("keydown", _onKeyDown);
    window.addEventListener("mouseup", _onMouseUp);
    window.addEventListener("mousedown", _onMouseDown);
    window.addEventListener("mousemove", _onMouseMove);
};
const update = function () {
    let i;
    for (i = 0; i < kKeys.LastKeyCode; i++) {
        mIsKeyClicked[i] = !mKeyPreviousState[i] && mIsKeyPressed[i]; // the wrong thing is being negated here
        mKeyPreviousState[i] = mIsKeyPressed[i];
    }
    let j;
    for (j = 0; j <= kMouse.Right; j++) {
        mIsMouseClicked[j] = !mMousePreviousState[j] && mIsMousePressed[j];
        mMousePreviousState[j] = mIsMousePressed[j];
    }
};
const isKeyPressed = function (keyCode) {
    return mIsKeyPressed[keyCode];
};
const isKeyClicked = function (keyCode) {
    return mIsKeyClicked[keyCode];
};
const isMousePressed = function (keyCode) {
    return mIsMousePressed[keyCode];
};
const isMouseClicked = function (keyCode) {
    return mIsMouseClicked[keyCode];
};
const getMousePosition = function () {
    return fromValues(mMouseX, mMouseY);
};
const mPublic$8 = {
    initialize: initialize,
    update: update,
    keys: kKeys,
    isKeyPressed: isKeyPressed,
    isKeyClicked: isKeyClicked,
    mouse: kMouse,
    isMousePressed: isMousePressed,
    isMouseClicked: isMouseClicked,
    getMousePosition: getMousePosition,
};

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class MapEntry {
    constructor(name) {
        this.refCount = 1;
        this.asset = name;
    }
}
const mResourceMap = {};
let mNumOutstandingLoads = 0;
let mLoadCompletedCallback;
const _checkForAllLoadCompleted = function () {
    if (mNumOutstandingLoads === 0 && mLoadCompletedCallback !== null) {
        const callback = mLoadCompletedCallback;
        mLoadCompletedCallback = null;
        callback();
    }
};
const setLoadCompletedCallback = function (callback) {
    mLoadCompletedCallback = callback;
    _checkForAllLoadCompleted();
};
const asyncLoadRequested = function (resourceName) {
    mResourceMap[resourceName] = new MapEntry(resourceName);
    ++mNumOutstandingLoads;
};
const asyncLoadCompleted = function (resourceName, loadedAsset) {
    if (!isAssetLoaded(resourceName)) {
        alert("gEngine.asyncLoadCompleted: [" + resourceName + "] not in map!");
    }
    mResourceMap[resourceName].asset = loadedAsset;
    --mNumOutstandingLoads;
    _checkForAllLoadCompleted();
};
const incAssetRefCount = function (resourceName) {
    mResourceMap[resourceName].refCount++;
};
const isAssetLoaded = function (resourceName) {
    return resourceName in mResourceMap;
};
const retrieveAsset = function (resourceName) {
    let resource = null;
    if (isAssetLoaded(resourceName)) {
        resource = mResourceMap[resourceName].asset;
    }
    return resource;
};
const unloadAsset = function (resourceName) {
    let refCount = 0;
    if (isAssetLoaded(resourceName)) {
        mResourceMap[resourceName].refCount--;
        refCount = mResourceMap[resourceName].refCount;
        if (refCount <= 0) {
            delete mResourceMap[resourceName];
        }
    }
    return refCount;
};
const mPublic$7 = {
    setLoadCompletedCallback: setLoadCompletedCallback,
    asyncLoadRequested: asyncLoadRequested,
    asyncLoadCompleted: asyncLoadCompleted,
    incAssetRefCount: incAssetRefCount,
    isAssetLoaded: isAssetLoaded,
    retrieveAsset: retrieveAsset,
    unloadAsset: unloadAsset,
};

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let mAudioContext;
let mBgAudioNode;
const initAudioContext = function () {
    try {
        const AudioContext = window.AudioContext;
        mAudioContext = new AudioContext();
    }
    catch (e) {
        alert("Web audio is not supported.");
    }
};
const loadAudio = function (fileName) {
    if (mPublic$7.isAssetLoaded(fileName)) {
        mPublic$7.incAssetRefCount(fileName);
        //            if (callback !== null && callback !== undefined) {
        //                callback();
        //            }
        //            return;
    }
    mPublic$7.asyncLoadRequested(fileName);
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status !== 200) {
            alert("audio loading failed: " + fileName + "[see hint]");
        }
    };
    req.open("GET", fileName, true);
    req.responseType = "arraybuffer";
    req.onload = function () {
        mAudioContext.decodeAudioData(req.response, function (buffer) {
            mPublic$7.asyncLoadCompleted(fileName, buffer);
            //                        if (callback !== null && callback !== undefined) {
            //                            callback(fileName);
            //                        }
        });
    };
    req.send();
};
const unloadAudio = function (filePath) {
    mPublic$7.unloadAsset(filePath);
};
const playCue = function (clipName) {
    const clipData = mPublic$7.retrieveAsset(clipName);
    if (clipData !== null) {
        const sourceNode = mAudioContext.createBufferSource();
        sourceNode.buffer = clipData;
        sourceNode.connect(mAudioContext.destination);
        sourceNode.start(0);
    }
};
const playBackgroundAudio = function (clipName) {
    const clipData = mPublic$7.retrieveAsset(clipName);
    if (clipData !== null) {
        stopBackgroundAudio();
        mBgAudioNode = mAudioContext.createBufferSource();
        mBgAudioNode.buffer = clipData;
        mBgAudioNode.connect(mAudioContext.destination);
        mBgAudioNode.loop = true;
        mBgAudioNode.start(0);
    }
};
const stopBackgroundAudio = function () {
    if (isBackgroundAudioPlaying()) {
        mBgAudioNode === null || mBgAudioNode === void 0 ? void 0 : mBgAudioNode.stop(0);
        mBgAudioNode = null;
    }
};
const isBackgroundAudioPlaying = function () {
    return mBgAudioNode !== null;
};
const mPublic$6 = {
    initAudioContext: initAudioContext,
    loadAudio: loadAudio,
    unloadAudio: unloadAudio,
    playCue: playCue,
    playBackgroundAudio: playBackgroundAudio,
    stopBackgroundAudio: stopBackgroundAudio,
    isBackgroundAudioPlaying: isBackgroundAudioPlaying,
};

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const eTextFileType = Object.freeze({
    eXMLFile: 0,
    eTextFile: 1,
});
const loadTextFile = function (fileName, fileType, callback) {
    if (mPublic$7.isAssetLoaded(fileName)) {
        if (callback !== null && callback !== undefined) {
            callback(fileName);
        }
        return;
    }
    mPublic$7.asyncLoadRequested(fileName);
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status !== 200) {
            alert("loading failed: " + fileName + "[see hint]");
        }
    };
    req.open("GET", fileName, true);
    req.setRequestHeader("Content-Type", "text/plain");
    req.onload = function () {
        let fileContent = null;
        if (fileType === eTextFileType.eXMLFile) {
            const parser = new DOMParser();
            fileContent = parser.parseFromString(req.responseText, "text/xml");
        }
        else {
            fileContent = req.responseText;
        }
        mPublic$7.asyncLoadCompleted(fileName, fileContent);
        if (callback !== null && callback !== undefined) {
            callback(fileName);
        }
    };
    req.send();
};
const unloadTextFile = function (fileName) {
    mPublic$7.unloadAsset(fileName);
};
const mPublic$5 = {
    loadTextFile: loadTextFile,
    unloadTextFile: unloadTextFile,
    eTextFileType: eTextFileType,
};

class TextureInfo {
    constructor(name, width, height, glTexID) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.glTexID = glTexID;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const loadTexture = function (textureName, callback) {
    if (mPublic$7.isAssetLoaded(textureName)) {
        mPublic$7.incAssetRefCount(textureName);
        if (callback !== null && callback !== undefined) {
            callback(textureName);
        }
        return;
    }
    const img = new Image();
    mPublic$7.asyncLoadRequested(textureName);
    img.onload = function () {
        _processLoadedImage(textureName, img);
        if (callback !== null && callback !== undefined) {
            callback(textureName);
        }
    };
    img.src = textureName;
};
// I think this is broken, deleting the texture before checking for any
// remaining references could break things if this texture is being used
// elsewhere
const unloadTexture = function (textureName) {
    const gl = core.gl;
    const texInfo = mPublic$7.retrieveAsset(textureName);
    gl.deleteTexture(texInfo.glTexID);
    mPublic$7.unloadAsset(textureName);
};
const _processLoadedImage = function (textureName, img) {
    const gl = core.gl;
    const textureID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureID);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    const texInfo = new TextureInfo(textureName, img.naturalWidth, img.naturalHeight, textureID);
    mPublic$7.asyncLoadCompleted(textureName, texInfo);
};
const activateColorTexture = function (textureName) {
    const gl = core.gl;
    _activateTexture(textureName, gl.TEXTURE0);
};
const activateNormalTexture = function (textureName) {
    const gl = core.gl;
    _activateTexture(textureName, gl.TEXTURE1);
};
const _activateTexture = function (textureName, textureUnit) {
    const gl = core.gl;
    const texInfo = mPublic$7.retrieveAsset(textureName);
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texInfo.glTexID);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Blurred "cleaner" rendering of texture if magnified/minimized
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    // Sharp rendering of texture if magnified/minimized
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
};
const deactivateTexture = function () {
    const gl = core.gl;
    gl.bindTexture(gl.TEXTURE_2D, null);
};
const getTextureInfo = function (textureName) {
    return mPublic$7.retrieveAsset(textureName);
};
const getColorArray = function (textureName) {
    const texInfo = getTextureInfo(textureName);
    if (texInfo.colorArray === null) {
        const gl = core.gl;
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.glTexID, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
            const pixels = new Uint8Array(texInfo.width * texInfo.height * 4);
            gl.readPixels(0, 0, texInfo.width, texInfo.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            texInfo.colorArray = pixels;
        }
        else {
            alert("WARNING: Failed to retreive color array");
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(fb);
    }
    return texInfo.colorArray;
};
const mPublic$4 = {
    loadTexture: loadTexture,
    unloadTexture: unloadTexture,
    activateColorTexture: activateColorTexture,
    activateNormalTexture: activateNormalTexture,
    deactivateTexture: deactivateTexture,
    getTextureInfo: getTextureInfo,
    getColorArray: getColorArray,
};

// for convenenit communication of per-character information
// all size returned are in normalize unit (range between 0 to 1)
class CharacterInfo {
    constructor() {
        // in texture coordinate (0 to 1) maps to the entire image
        this.mTexCoordLeft = 0;
        this.mTexCoordRight = 1;
        this.mTexCoordBottom = 0;
        this.mTexCoordTop = 1;
        // reference to nominal character size, 1 is "standard width/height" of a char
        this.mCharWidth = 1;
        this.mCharHeight = 1;
        this.mCharWidthOffset = 0;
        this.mCharHeightOffset = 0;
        // reference of char width/height ratio
        this.mCharAspectRatio = 1;
    }
}
// Note: font name is the path to the fnt file. (without the fnt extension!)
//    You must also provide the image file in the exact same folder
//    with the exact same name, with ".png" extension.
const _storeLoadedFont = function (fontInfoSourceString) {
    const fontName = fontInfoSourceString.slice(0, -4); // trims the .fnt extension
    const fontInfo = mPublic$7.retrieveAsset(fontInfoSourceString);
    Object.defineProperty(fontInfo, "fontImage", { value: fontName + ".png" });
    mPublic$7.asyncLoadCompleted(fontName, fontInfo); // to store the actual font info
};
const loadFont = function (fontName) {
    if (!mPublic$7.isAssetLoaded(fontName)) {
        const fontInfoSourceString = fontName + ".fnt";
        const textureSourceString = fontName + ".png";
        mPublic$7.asyncLoadRequested(fontName); // to register an entry in the map
        mPublic$4.loadTexture(textureSourceString);
        mPublic$5.loadTextFile(fontInfoSourceString, mPublic$5.eTextFileType.eXMLFile, _storeLoadedFont);
    }
    else {
        mPublic$7.incAssetRefCount(fontName);
    }
};
// Remove the reference to allow associated memory
// be available for subsequent garbage collection
const unloadFont = function (fontName) {
    mPublic$7.unloadAsset(fontName);
    if (!mPublic$7.isAssetLoaded(fontName)) {
        const fontInfoSourceString = fontName + ".fnt";
        const textureSourceString = fontName + ".png";
        mPublic$4.unloadTexture(textureSourceString);
        mPublic$5.unloadTextFile(fontInfoSourceString);
    }
};
const getCharInfo = function (fontName, aChar) {
    let returnInfo = null;
    const fontInfo = mPublic$7.retrieveAsset(fontName);
    const commonPath = "font/common";
    const commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    const commonElem = commonInfo.iterateNext();
    if (commonElem === null) {
        return returnInfo;
    }
    const charHeight = Number.parseInt(commonElem.getAttribute("base"));
    const charPath = "font/chars/char[@id=" + aChar + "]";
    const charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    const charElem = charInfo.iterateNext();
    if (charElem === null) {
        return returnInfo;
    }
    returnInfo = new CharacterInfo();
    const texInfo = mPublic$4.getTextureInfo(fontInfo.fontImage);
    const leftPixel = Number(charElem.getAttribute("x"));
    const rightPixel = leftPixel + Number(charElem.getAttribute("width")) - 1;
    const topPixel = texInfo.height - 1 - Number(charElem.getAttribute("y"));
    const bottomPixel = topPixel - Number(charElem.getAttribute("height")) + 1;
    // texture coordinate information
    returnInfo.mTexCoordLeft = leftPixel / (texInfo.width - 1);
    returnInfo.mTexCoordTop = topPixel / (texInfo.height - 1);
    returnInfo.mTexCoordRight = rightPixel / (texInfo.width - 1);
    returnInfo.mTexCoordBottom = bottomPixel / (texInfo.height - 1);
    // relative character size
    const charWidth = Number.parseInt(charElem.getAttribute("xadvance"));
    returnInfo.mCharWidth =
        Number.parseInt(charElem.getAttribute("width")) / charWidth;
    returnInfo.mCharHeight =
        Number.parseInt(charElem.getAttribute("height")) / charHeight;
    returnInfo.mCharWidthOffset =
        Number.parseInt(charElem.getAttribute("xoffset")) / charWidth;
    returnInfo.mCharHeightOffset =
        Number.parseInt(charElem.getAttribute("yoffset")) / charHeight;
    returnInfo.mCharAspectRatio = charWidth / charHeight;
    return returnInfo;
};
// Public interface for this object. Anything not in here will
// not be accessable.
const mPublic$3 = {
    loadFont: loadFont,
    unloadFont: unloadFont,
    getCharInfo: getCharInfo,
};

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const kSimpleVS$1 = "shaders/SimpleVS.glsl";
const kSimpleFS$1 = "shaders/SimpleFS.glsl";
const kTextureVS$1 = "shaders/TextureVS.glsl";
const kTextureFS$1 = "shaders/TextureFS.glsl";
const kLightFS$1 = "shaders/LightFS.glsl";
const kIllumFS$1 = "shaders/IllumFS.glsl";
const kShadowCasterFS$1 = "shaders/ShadowCasterFS.glsl";
const kShadowReceiverFS$1 = "shaders/ShadowReceiverFS.glsl";
const kLineFS$1 = "shaders/LineFS.glsl";
const kParticleFS$1 = "shaders/ParticleFS.glsl";
let mGlobalAmbientColor = [0.3, 0.3, 0.3, 1.0];
let mGlobalAmbientIntensity = 0.95;
const kDefaultFont = "assets/fonts/system-default-font";
const getGlobalAmbientColor = function () {
    return mGlobalAmbientColor;
};
const setGlobalAmbientColor = function (color) {
    mGlobalAmbientColor = Array.from(color);
};
const getGlobalAmbientIntensity = function () {
    return mGlobalAmbientIntensity;
};
const setGlobalAmbientIntensity = function (intensity) {
    mGlobalAmbientIntensity = intensity;
};
const _getDefaultFont = function () {
    return kDefaultFont;
};
const _initialize = function (callback) {
    mPublic$5.loadTextFile(kSimpleVS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kSimpleFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kTextureVS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kTextureFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kLightFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kIllumFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kShadowCasterFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kShadowReceiverFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kLineFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$5.loadTextFile(kParticleFS$1, mPublic$5.eTextFileType.eTextFile);
    mPublic$3.loadFont(kDefaultFont);
    mPublic$7.setLoadCompletedCallback(callback);
};
const mPublic$2 = {
    initialize: _initialize,
    getGlobalAmbientColor: getGlobalAmbientColor,
    setGlobalAmbientColor: setGlobalAmbientColor,
    getGlobalAmbientIntensity: getGlobalAmbientIntensity,
    setGlobalAmbientIntensity: setGlobalAmbientIntensity,
    getDefaultFont: _getDefaultFont,
};

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class SimpleShader {
    constructor(vertexShaderId, fragmentShaderId) {
        this.globalAmbientIntensity = 1.0;
        const gl = core.gl;
        const vertexShader = this._compileShader(vertexShaderId, gl.VERTEX_SHADER);
        const fragmentShader = this._compileShader(fragmentShaderId, gl.FRAGMENT_SHADER);
        this.compiledShader = gl.createProgram();
        gl.attachShader(this.compiledShader, vertexShader);
        gl.attachShader(this.compiledShader, fragmentShader);
        gl.linkProgram(this.compiledShader);
        if (!gl.getProgramParameter(this.compiledShader, gl.LINK_STATUS)) {
            alert("Error linking shader.");
            return;
        }
        this.shaderVertexPositionAttribute = gl.getAttribLocation(this.compiledShader, "aSquareVertexPosition");
        this.modelTransform = gl.getUniformLocation(this.compiledShader, "uModelTransform");
        this.viewProjTransform = gl.getUniformLocation(this.compiledShader, "uViewProjTransform");
        this.pixelColor = gl.getUniformLocation(this.compiledShader, "uPixelColor");
        this.globalAmbientColor = gl.getUniformLocation(this.compiledShader, "uGlobalAmbientColor");
        this.globalAmbientIntensity = gl.getUniformLocation(this.compiledShader, "uGlobalAmbientIntensity");
        gl.bindBuffer(gl.ARRAY_BUFFER, mPublic$9.getGLVertexRef());
        gl.vertexAttribPointer(this.shaderVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    }
    _compileShader(filepath, shaderType) {
        const gl = core.gl;
        const shaderSource = mPublic$7.retrieveAsset(filepath);
        const compiledShader = gl.createShader(shaderType);
        gl.shaderSource(compiledShader, shaderSource);
        gl.compileShader(compiledShader);
        if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
            alert("A shader compiling error occurred: " +
                gl.getShaderInfoLog(compiledShader));
        }
        return compiledShader;
    }
    activateShader(pixelColor, camera) {
        const gl = core.gl;
        gl.useProgram(this.compiledShader);
        gl.uniform4fv(this.globalAmbientColor, mPublic$2.getGlobalAmbientColor());
        gl.uniform1f(this.globalAmbientIntensity, mPublic$2.getGlobalAmbientIntensity());
        gl.uniformMatrix4fv(this.viewProjTransform, false, camera.getVPMatrix());
        gl.enableVertexAttribArray(this.shaderVertexPositionAttribute);
        gl.uniform4fv(this.pixelColor, pixelColor);
    }
    loadObjectTransform(modelTransform) {
        const gl = core.gl;
        gl.uniformMatrix4fv(this.modelTransform, false, modelTransform);
    }
    getShader() {
        return this.compiledShader;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class TextureShader extends SimpleShader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);
        this.texCoord = null;
        const gl = core.gl;
        this.textureCoordinateAttribute = gl.getAttribLocation(this.compiledShader, "aTextureCoordinate");
        this.colorSampler = gl.getUniformLocation(this.compiledShader, "uSampler");
    }
    activateShader(pixelColor, camera) {
        SimpleShader.prototype.activateShader.call(this, pixelColor, camera);
        const gl = core.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, mPublic$9.getGLTexCoordRef());
        gl.enableVertexAttribArray(this.textureCoordinateAttribute);
        gl.vertexAttribPointer(this.textureCoordinateAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1i(this.colorSampler, 0); // Bind color sampler to texture 0
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class SpriteShader extends TextureShader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);
        const initialCoords = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
        const gl = core.gl;
        this.spriteCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initialCoords), gl.DYNAMIC_DRAW);
    }
    setTextureCoordinates(coordinates) {
        const gl = core.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteCoordBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(coordinates));
    }
    activateShader(pixelColor, camera) {
        SimpleShader.prototype.activateShader.call(this, pixelColor, camera);
        const gl = core.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteCoordBuffer);
        gl.enableVertexAttribArray(this.textureCoordinateAttribute);
        gl.vertexAttribPointer(this.textureCoordinateAttribute, 2, gl.FLOAT, false, 0, 0);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Light {
    constructor(lightType = Light.eLightType.ePointLight, color = fromValues$1(1.0, 1.0, 1.0, 1.0), position = fromValues$2(35, 50, 5), direction = fromValues$2(0.0, 0.0, -1.0), intensity = 1.0, near = 15, far = 30, dropoff = 1, innerRads = 5 * (Math.PI / 180.0), outerRads = 45 * (Math.PI / 180.0)) {
        this.origin = fromValues$2(0.0, 0.0, 0.0);
        this.lit = true;
        this.lightType = lightType;
        this.color = clone$1(color);
        this.position = clone$2(position);
        this.direction = clone$2(direction);
        this.intensity = intensity;
        this.near = near;
        this.far = far;
        this.dropoff = dropoff;
        this.innerRads = innerRads;
        this.outerRads = outerRads;
    }
    isLit() {
        return this.lit;
    }
    setLit(lit) {
        return (this.lit = lit);
    }
    getLightType() {
        return this.lightType;
    }
    setLightType(lightType) {
        this.lightType = lightType;
    }
    getLightTypeString() {
        switch (this.getLightType()) {
            case Light.eLightType.ePointLight:
                return "point";
            case Light.eLightType.eDirectionLight:
                return "dir";
            case Light.eLightType.eSpotLight:
                return "spot";
            default:
                return "unknown";
        }
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        copy$1(this.color, color);
    }
    getPosition() {
        return this.position;
    }
    setPosition(position) {
        copy$2(this.position, position);
    }
    incXPos(delta) {
        set$1(this.position, this.position[0] + delta, this.position[1], this.position[2]);
    }
    incYPos(delta) {
        set$1(this.position, this.position[0], this.position[1] + delta, this.position[2]);
    }
    incZPos(delta) {
        set$1(this.position, this.position[0], this.position[1], this.position[2] + delta);
    }
    getDirection() {
        return this.direction;
    }
    getReverseDirection() {
        const out = create$2();
        scale$1(out, this.direction, -1);
        return out;
    }
    setDirection(direction) {
        copy$2(this.direction, direction);
    }
    rotateXDirRads(delta) {
        rotateY(this.direction, this.direction, this.origin, delta);
    }
    rotateYDirRads(delta) {
        rotateX(this.direction, this.direction, this.origin, delta);
    }
    rotateXDirDegrees(deltaDegrees) {
        this.rotateXDirRads((deltaDegrees * Math.PI) / 180.0);
    }
    rotateYDirDegrees(deltaDegrees) {
        this.rotateYDirRads((deltaDegrees * Math.PI) / 180.0);
    }
    getIntensity() {
        return this.intensity;
    }
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    incIntensity(delta) {
        this.intensity += delta;
    }
    getNear() {
        return this.near;
    }
    setNear(near) {
        this.near = near;
    }
    incNear(delta) {
        this.near += delta;
    }
    getFar() {
        return this.far;
    }
    setFar(far) {
        this.far = far;
    }
    incFar(delta) {
        this.far += delta;
    }
    getDropoff() {
        return this.dropoff;
    }
    setDropoff(dropoff) {
        this.dropoff = dropoff;
    }
    getInnerRads() {
        return this.innerRads;
    }
    getInnerDegrees() {
        return (this.innerRads * (180.0 / Math.PI)).toFixed(1);
    }
    setInnerRads(innerRads) {
        this.innerRads = innerRads;
    }
    incInnerRads(delta) {
        this.innerRads += delta;
    }
    incInnerDegrees(deltaDegrees) {
        this.incInnerRads((deltaDegrees * Math.PI) / 180.0);
    }
    getOuterRads() {
        return this.outerRads;
    }
    getOuterDegrees() {
        return (this.outerRads * (180.0 / Math.PI)).toFixed(1);
    }
    setOuterRads(outerRads) {
        this.outerRads = outerRads;
    }
    incOuterRads(delta) {
        this.outerRads += delta;
    }
    incOuterDegrees(deltaDegrees) {
        this.incOuterRads((deltaDegrees * Math.PI) / 180.0);
    }
    incInner(delta) {
        if (this.getLightType() === Light.eLightType.ePointLight) {
            this.incNear(delta);
        }
        else if (this.getLightType() === Light.eLightType.eSpotLight) {
            this.incInnerRads(delta);
        }
    }
    incOuter(delta) {
        if (this.getLightType() === Light.eLightType.ePointLight) {
            this.incFar(delta);
        }
        else if (this.getLightType() === Light.eLightType.eSpotLight) {
            this.incOuterRads(delta);
        }
    }
}
Light.eLightType = {
    ePointLight: 0,
    eDirectionLight: 1,
    eSpotLight: 2,
};

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class ShaderLightReference {
    constructor(shader, index) {
        //TODO MOVE THIS OUT INTO A CONSTANTS MODULE OR SOMETHING
        //THIS VARIABLE WAS COPIED FROM ANOTHER VARIABLE THAT WAS
        //COPIED FROM A GLSL VARIABLE
        // SEE LightShader.js
        const kGLSLuLightArraySize = 4;
        if (index < 0 || index >= kGLSLuLightArraySize) {
            throw "Light index " + index + " out of bounds.";
        }
        this.index = index;
        const indexString = "uLights[" + index + "].";
        const gl = core.gl;
        this.isLitRef = gl.getUniformLocation(shader, indexString + "IsLit");
        this.lightTypeRef = gl.getUniformLocation(shader, indexString + "LightType");
        this.colorRef = gl.getUniformLocation(shader, indexString + "Color");
        this.positionRef = gl.getUniformLocation(shader, indexString + "Position");
        this.directionRef = gl.getUniformLocation(shader, indexString + "Direction");
        this.intensityRef = gl.getUniformLocation(shader, indexString + "Intensity");
        this.nearRef = gl.getUniformLocation(shader, indexString + "Near");
        this.farRef = gl.getUniformLocation(shader, indexString + "Far");
        this.dropoffRef = gl.getUniformLocation(shader, indexString + "Dropoff");
        this.cosInnerRef = gl.getUniformLocation(shader, indexString + "CosInner");
        this.cosOuterRef = gl.getUniformLocation(shader, indexString + "CosOuter");
    }
    loadToShader(camera, light) {
        const gl = core.gl;
        const isLit = light !== undefined && light !== null && light.isLit();
        gl.uniform1i(this.isLitRef, isLit ? 1 : 0);
        if (light.isLit()) {
            gl.uniform1i(this.lightTypeRef, light.getLightType());
            gl.uniform4fv(this.colorRef, light.getColor());
            gl.uniform3fv(this.positionRef, camera.convertWCPosToPx(light.getPosition()));
            gl.uniform1f(this.intensityRef, light.getIntensity());
            gl.uniform1f(this.nearRef, camera.convertWCSizeToPx(light.getNear()));
            gl.uniform1f(this.farRef, camera.convertWCSizeToPx(light.getFar()));
            let direction = fromValues$2(0.0, 0.0, 0.0);
            let dropoff = 0;
            let cosInner = 0.0;
            let cosOuter = 0.0;
            if (light.getLightType() !== Light.eLightType.ePointLight) {
                direction = camera.convertWCVecToPx(light.getDirection());
                if (light.getLightType() === Light.eLightType.eSpotLight) {
                    dropoff = light.getDropoff();
                    cosInner = Math.cos(light.getInnerRads() * 0.5);
                    cosOuter = Math.cos(light.getOuterRads() * 0.5);
                }
            }
            gl.uniform3fv(this.directionRef, direction);
            gl.uniform1f(this.dropoffRef, dropoff);
            gl.uniform1f(this.cosInnerRef, cosInner);
            gl.uniform1f(this.cosOuterRef, cosOuter);
        }
    }
    setLit(isLit) {
        const gl = core.gl;
        gl.uniform1i(this.isLitRef, isLit ? 1 : 0);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class LightShader extends SpriteShader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);
        // THIS MUST MATCH THE VALUE OF kGLSLuLightArraySize IN LightFS.GLSL
        // Be sure to reflect any changes to this value in GLSL
        this.kGLSLuLightArraySize = 4;
        this.lightRefs = [];
        for (let i = 0; i < this.kGLSLuLightArraySize; i++) {
            this.lightRefs[i] = new ShaderLightReference(this.compiledShader, i);
        }
        this.lights = [];
    }
    setLights(lights) {
        this.lights = lights;
    }
    activateShader(color, camera) {
        SpriteShader.prototype.activateShader.call(this, color, camera);
        for (let i = 0; i < this.lights.length; i++) {
            this.lightRefs[i].loadToShader(camera, this.lights[i]);
        }
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class ShaderMaterialReference {
    constructor(shader) {
        const gl = core.gl;
        this.ambientRef = gl.getUniformLocation(shader, "uMaterial.Ka");
        this.diffuseRef = gl.getUniformLocation(shader, "uMaterial.Kd");
        this.specularRef = gl.getUniformLocation(shader, "uMaterial.Ks");
        this.shininessRef = gl.getUniformLocation(shader, "uMaterial.Shininess");
    }
    loadToShader(material) {
        if (material === null || material === undefined) {
            return;
        }
        const gl = core.gl;
        gl.uniform4fv(this.ambientRef, material.getAmbient());
        gl.uniform4fv(this.diffuseRef, material.getDiffuse());
        gl.uniform4fv(this.specularRef, material.getSpecular());
        gl.uniform1f(this.shininessRef, material.getShininess());
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class IllumShader extends LightShader {
    constructor(vectorShaderId, fragmentShaderId) {
        super(vectorShaderId, fragmentShaderId);
        const gl = core.gl;
        this.normalSampler = gl.getUniformLocation(this.compiledShader, "uNormalSampler");
        this.cameraPosition = gl.getUniformLocation(this.compiledShader, "uCameraPosition");
        this.materialRef = new ShaderMaterialReference(this.compiledShader);
    }
    setMaterial(material) {
        this.material = material;
    }
    activateShader(pixelColor, camera) {
        LightShader.prototype.activateShader.call(this, pixelColor, camera);
        const gl = core.gl;
        gl.uniform1i(this.normalSampler, 1);
        gl.uniform3fv(this.cameraPosition, camera.getCameraPosPx());
        this.materialRef.loadToShader(this.material);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class ShadowCasterShader extends SpriteShader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);
        this.lightRef = new ShaderLightReference(this.compiledShader, 0);
    }
    setLight(light) {
        this.light = light;
    }
    activateShader(pixelColor, camera) {
        SpriteShader.prototype.activateShader.call(this, pixelColor, camera);
        this.lightRef.loadToShader(camera, this.light);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class LineShader extends SimpleShader {
    constructor(vertexShaderId, fragmentShaderId) {
        super(vertexShaderId, fragmentShaderId);
        const gl = core.gl;
        const vertexShader = this._compileShader(vertexShaderId, gl.VERTEX_SHADER);
        const fragmentShader = this._compileShader(fragmentShaderId, gl.FRAGMENT_SHADER);
        this.compiledShader = gl.createProgram();
        gl.attachShader(this.compiledShader, vertexShader);
        gl.attachShader(this.compiledShader, fragmentShader);
        gl.linkProgram(this.compiledShader);
        if (!gl.getProgramParameter(this.compiledShader, gl.LINK_STATUS)) {
            alert("Error linking shader.");
            return;
        }
        this.shaderVertexPositionAttribute = gl.getAttribLocation(this.compiledShader, "aSquareVertexPosition");
        this.modelTransform = gl.getUniformLocation(this.compiledShader, "uModelTransform");
        this.viewProjTransform = gl.getUniformLocation(this.compiledShader, "uViewProjTransform");
        this.pixelColor = gl.getUniformLocation(this.compiledShader, "uPixelColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, mPublic$9.getGLVertexRef());
        gl.vertexAttribPointer(this.shaderVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    }
    _compileShader(filepath, shaderType) {
        const gl = core.gl;
        const shaderSource = mPublic$7.retrieveAsset(filepath);
        const compiledShader = gl.createShader(shaderType);
        gl.shaderSource(compiledShader, shaderSource);
        gl.compileShader(compiledShader);
        if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
            const errorMsg = gl.getShaderInfoLog(compiledShader);
            alert("A shader compiling error occurred: " + errorMsg);
            console.log(errorMsg);
        }
        return compiledShader;
    }
    activateShader(pixelColor, camera) {
        const gl = core.gl;
        gl.useProgram(this.compiledShader);
        gl.uniformMatrix4fv(this.viewProjTransform, false, camera.getVPMatrix());
        gl.enableVertexAttribArray(this.shaderVertexPositionAttribute);
        gl.uniform4fv(this.pixelColor, pixelColor);
    }
    loadObjectTransform(modelTransform) {
        const gl = core.gl;
        gl.uniformMatrix4fv(this.modelTransform, false, modelTransform);
    }
}

const kSimpleVS = "shaders/SimpleVS.glsl";
const kSimpleFS = "shaders/SimpleFS.glsl";
const kTextureVS = "shaders/TextureVS.glsl";
const kTextureFS = "shaders/TextureFS.glsl";
const kLightFS = "shaders/LightFS.glsl";
const kIllumFS = "shaders/IllumFS.glsl";
const kShadowCasterFS = "shaders/ShadowCasterFS.glsl";
const kShadowReceiverFS = "shaders/ShadowReceiverFS.glsl";
const kLineFS = "shaders/LineFS.glsl";
const kParticleFS = "shaders/ParticleFS.glsl";
let mConstColorShader;
let mSpriteShader;
let mTextureShader;
let mLightShader;
let mIllumShader;
let mShadowCasterShader;
let mShadowReceiverShader;
let mLineShader;
let mParticleShader;
const _getConstColorShader = function () {
    return mConstColorShader;
};
const _getSpriteShader = function () {
    return mSpriteShader;
};
const _getTextureShader = function () {
    return mTextureShader;
};
const _getLightShader = function () {
    return mLightShader;
};
const _getIllumShader = function () {
    return mIllumShader;
};
const _getShadowCasterShader = function () {
    return mShadowCasterShader;
};
const _getShadowReceiverShader = function () {
    return mShadowReceiverShader;
};
const _getLineShader = function () {
    return mLineShader;
};
const _getParticleShader = function () {
    return mParticleShader;
};
const createShaders = function () {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mLightShader = new LightShader(kTextureVS, kLightFS);
    mIllumShader = new IllumShader(kTextureVS, kIllumFS);
    mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
    mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
    mLineShader = new LineShader(kSimpleVS, kLineFS);
    mParticleShader = new TextureShader(kTextureVS, kParticleFS);
};
const mPublic$1 = {
    getConstColorShader: _getConstColorShader,
    getTextureShader: _getTextureShader,
    getSpriteShader: _getSpriteShader,
    getLightShader: _getLightShader,
    getIllumShader: _getIllumShader,
    getShadowCasterShader: _getShadowCasterShader,
    getShadowReceiverShader: _getShadowReceiverShader,
    getLineShader: _getLineShader,
    getParticleShader: _getParticleShader,
    createShaders: createShaders,
};

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const kFPS = 60;
const kMPF = 1000 / kFPS;
const frameTime = 1 / kFPS;
let mPreviousTime;
let mLagTime;
let mCurrentTime;
let mElapsedTime;
let mIsLoopRunning;
let mMyGame;
const _runLoop = function () {
    if (mIsLoopRunning) {
        requestAnimationFrame(function () {
            _runLoop.call(mMyGame);
        });
        mCurrentTime = Date.now();
        mElapsedTime = mCurrentTime - mPreviousTime;
        mPreviousTime = mCurrentTime;
        mLagTime += mElapsedTime;
        while (mIsLoopRunning && mLagTime > kMPF) {
            mPublic$8.update();
            this.update();
            mLagTime -= kMPF;
        }
        this.draw();
    }
    else {
        mMyGame.unloadScene();
    }
};
const _startLoop = function () {
    mPreviousTime = Date.now();
    mLagTime = 0.0;
    mCurrentTime = Date.now();
    mElapsedTime = 0;
    mIsLoopRunning = true;
    requestAnimationFrame(function () {
        _runLoop.call(mMyGame);
    });
};
const start = function (myGame) {
    mMyGame = myGame;
    mPublic$7.setLoadCompletedCallback(function () {
        mMyGame.initialize();
        _startLoop();
    });
};
const stop = function () {
    mIsLoopRunning = false;
};
const mPublic = {
    start: start,
    stop: stop,
    frameTime: frameTime,
}; //public methods go here

function initializeEngineCore(htmlCanvasID, scene) {
    core.initializeWebGL(htmlCanvasID);
    mPublic$9.initialize();
    mPublic$8.initialize(htmlCanvasID);
    mPublic$6.initAudioContext();
    mPublic$2.initialize(function () {
        mPublic$1.createShaders();
        startScene(scene);
    });
}
function startScene(scene) {
    scene.loadScene.call(scene);
    mPublic.start(scene);
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Transform {
    constructor() {
        this.position = fromValues(0.0, 0.0);
        this.z = 0.0;
        this.scale = fromValues(1.0, 1.0);
        this.rotationRad = 0.0;
        this.hFlipMultiplier = 1;
        this.vFlipMultiplier = 1;
    }
    getPosition() {
        return this.position;
    }
    getPosition3D() {
        return fromValues$2(this.getXPos(), this.getYPos(), this.getZPos());
    }
    getXPos() {
        return this.position[0];
    }
    getYPos() {
        return this.position[1];
    }
    getZPos() {
        return this.z;
    }
    setPosition(x, y) {
        set(this.position, x, y);
    }
    setXPos(x) {
        set(this.position, x, this.getYPos());
    }
    setYPos(y) {
        set(this.position, this.getXPos(), y);
    }
    setZPos(z) {
        this.z = z;
    }
    incXPos(deltaX) {
        this.setXPos(this.getXPos() + deltaX);
    }
    incYPos(deltaY) {
        this.setYPos(this.getYPos() + deltaY);
    }
    incZPos(deltaZ) {
        this.z += deltaZ;
    }
    offset(offset) {
        this.incXPos(offset[0]);
        this.incYPos(offset[1]);
        this.incZPos(offset[2]);
    }
    getScale() {
        return this.scale;
    }
    getWidth() {
        return this.scale[0];
    }
    getHeight() {
        return this.scale[1];
    }
    setSize(width, height) {
        set(this.scale, width, height);
    }
    setHeight(height) {
        set(this.scale, this.getWidth(), height);
    }
    setWidth(width) {
        set(this.scale, width, this.getHeight());
    }
    incSize(deltaSize) {
        this.setSize(this.getWidth() + deltaSize, this.getHeight() + deltaSize);
    }
    getRotation() {
        return this.rotationRad;
    }
    setRotationRads(rad) {
        this.rotationRad = rad;
        while (this.rotationRad > 2 * Math.PI) {
            this.rotationRad -= 2 * Math.PI;
        }
    }
    setRotationDegrees(degrees) {
        this.setRotationRads((degrees * Math.PI) / 180.0);
    }
    incRotationInRads(deltaRotation) {
        this.setRotationRads(this.getRotation() + deltaRotation);
    }
    incRotationInDegrees(deltaRotation) {
        this.incRotationInRads((deltaRotation * Math.PI) / 180.0);
    }
    isHFlipped() {
        return this.hFlipMultiplier === -1;
    }
    setHorizontalFlip(shouldFlip) {
        this.hFlipMultiplier = shouldFlip ? -1 : 1;
    }
    isVFlipped() {
        return this.vFlipMultiplier === -1;
    }
    setVerticalFlip(shouldFlip) {
        this.vFlipMultiplier = shouldFlip ? -1 : 1;
    }
    getXForm() {
        const xform = create$3();
        translate(xform, xform, this.getPosition3D());
        rotateZ(xform, xform, this.rotationRad);
        const width = this.getWidth() * this.hFlipMultiplier;
        const height = this.getHeight() * this.vFlipMultiplier;
        scale$2(xform, xform, fromValues$2(width, height, 1.0));
        return xform;
    }
    copy(other) {
        copy(this.position, other.getPosition());
        copy(this.scale, other.getScale());
        this.z = other.getZPos();
        this.rotationRad = other.getRotation();
        this.hFlipMultiplier = other.isHFlipped() ? -1 : 1;
        this.vFlipMultiplier = other.isVFlipped() ? -1 : 1;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Renderable {
    constructor() {
        this.shader = mPublic$1.getConstColorShader();
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.xform = new Transform();
    }
    _setShader(shader) {
        this.shader = shader;
    }
    swapShader(shader) {
        const current = this.shader;
        this.shader = shader;
        return current;
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    swapColor(color) {
        const current = Array.from(this.color);
        this.color = Array.from(color);
        return current;
    }
    getXform() {
        return this.xform;
    }
    setXform(xform) {
        this.xform = xform;
    }
    draw(camera) {
        const gl = core.gl;
        this.shader.activateShader(this.color, camera);
        this.shader.loadObjectTransform(this.xform.getXForm());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class TextureRenderable extends Renderable {
    constructor(texture) {
        super();
        this.texWidth = 0;
        this.texHeight = 0;
        this.texLeftIndex = 0;
        this.texBottomIndex = 0;
        this.setColor([1.0, 1.0, 1.0, 0.0]);
        this._setShader(mPublic$1.getTextureShader());
        this.texture = texture;
        this.setTexture(texture);
    }
    getTexture() {
        return this.texture;
    }
    setTexture(texture) {
        this.texture = texture;
        this.textureInfo = mPublic$4.getTextureInfo(texture);
        this.colorArray = this.textureInfo.colorArray;
        this.texWidth = this.textureInfo.width;
        this.texHeight = this.textureInfo.height;
        this.texLeftIndex = 0;
        this.texBottomIndex = 0;
    }
    draw(camera) {
        mPublic$4.activateColorTexture(this.texture);
        Renderable.prototype.draw.call(this, camera);
    }
    setColorArray() {
        if (this.colorArray == null) {
            this.colorArray = mPublic$4.getColorArray(this.texture);
        }
    }
    _pixelAlphaValue(x, y) {
        if (this.colorArray === undefined) {
            throw "ATTEMPTING TO ACCESS PIXELS BEFORE COLOR ARRAY IS INITIALIZED";
        }
        x += this.texLeftIndex;
        y += this.texBottomIndex;
        x *= 4;
        y *= 4;
        return this.colorArray[this.textureInfo.width * y + x + 3];
    }
    /**
     * int i: pixel index along the x axis
     * int j: pixel index along the y axis
     * vec2 xVec: unit vector representing the rotated x-axis
     * vec2 yVec: unit vector representing the rotated y-axis
     */
    _indexToWCPosition(returnWCPos, i, j, xVec, yVec) {
        // x and y indices are computed in WC units from pixels
        const wcInsetX = (i * this.xform.getWidth()) / (this.texWidth - 1);
        const wcInsetY = (j * this.xform.getHeight()) / (this.texHeight - 1);
        // get vertical and horiontal offsets from center of object (WC units)
        const xDisp = wcInsetX - this.xform.getWidth() * 0.5;
        const yDisp = wcInsetY - this.xform.getHeight() * 0.5;
        const xDirDisp = create();
        const yDirDisp = create();
        // rotated axis unit vectors scaled with offsets from center
        scale(xDirDisp, xVec, xDisp);
        scale(yDirDisp, yVec, yDisp);
        // origin of the renderable in WC units
        //    var textureOriginX = this.xform.getXPos() - (this.xform.getWidth() * 0.5);
        //    var textureOriginY = this.xform.getYPos() - (this.xform.getHeight() * 0.5);
        // add rotated, scaled offset vectors toobjects center position (WC units)
        add(returnWCPos, this.xform.getPosition(), xDirDisp);
        add(returnWCPos, returnWCPos, yDirDisp);
        //    returnWCPos[0] = textureOriginX + wcInsetX;
        //    returnWCPos[1] = textureOriginY + wcInsetY;
    }
    _wcPositionToIndex(returnIndex, wcPos, xVec, yVec) {
        const delta = create();
        // 2d offset from object center to given position (WC units)
        sub(delta, wcPos, this.xform.getPosition());
        const xDisp = dot(delta, xVec);
        const yDisp = dot(delta, yVec);
        returnIndex[0] = this.texWidth * (xDisp / this.xform.getWidth());
        returnIndex[1] = this.texHeight * (yDisp / this.xform.getHeight());
        //    returnIndex[0] = this.texWidth * (delta[0] / this.xform.getWidth());
        //    returnIndex[1] = this.texHeight * (delta[1] / this.xform.getHeight());
        returnIndex[0] += this.texWidth * 0.5;
        returnIndex[1] += this.texHeight * 0.5;
        returnIndex[0] = Math.floor(returnIndex[0]);
        returnIndex[1] = Math.floor(returnIndex[1]);
    }
    pixelTouches(other, wcTouchPos) {
        let pixelTouches = false;
        let xIndex = 0;
        let yIndex = 0;
        const otherIndex = fromValues(0, 0);
        const origin = fromValues(0, 0);
        const xVec = fromValues(1, 0);
        const yVec = fromValues(0, 1);
        const xVecOther = fromValues(1, 0);
        const yVecOther = fromValues(0, 1);
        rotate(xVec, xVec, origin, this.xform.getRotation());
        rotate(yVec, yVec, origin, this.xform.getRotation());
        rotate(xVecOther, xVecOther, origin, other.xform.getRotation());
        rotate(yVecOther, yVecOther, origin, other.xform.getRotation());
        while (!pixelTouches && xIndex < this.texWidth) {
            yIndex = 0;
            while (!pixelTouches && yIndex < this.texHeight) {
                if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                    this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xVec, yVec);
                    other._wcPositionToIndex(otherIndex, wcTouchPos, xVecOther, yVecOther);
                    if (otherIndex[0] > 0 &&
                        otherIndex[0] < other.texWidth &&
                        otherIndex[1] > 0 &&
                        otherIndex[1] < other.texHeight) {
                        pixelTouches =
                            other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                    }
                }
                yIndex++;
            }
            xIndex++;
        }
        return pixelTouches;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class BoundingBox {
    constructor(centerPos, w, h) {
        this.left = this.minX;
        this.right = this.maxX;
        this.bottom = this.minY;
        this.top = this.maxY;
        this.lowerLeft = fromValues(0, 0);
        this.setBounds(centerPos, w, h);
    }
    setBounds(centerPos, w, h) {
        this.width = w;
        this.height = h;
        this.lowerLeft[0] = centerPos[0] - w / 2;
        this.lowerLeft[1] = centerPos[1] - h / 2;
    }
    minX() {
        return this.lowerLeft[0];
    }
    maxX() {
        return this.lowerLeft[0] + this.width;
    }
    minY() {
        return this.lowerLeft[1];
    }
    maxY() {
        return this.lowerLeft[1] + this.height;
    }
    containsPoint(x, y) {
        return (x < this.maxX() && x > this.minX() && y < this.maxY() && y > this.minY());
    }
    intersects(otherBounds) {
        return (this.top() > otherBounds.bottom() &&
            this.bottom() < otherBounds.top() &&
            this.left() < otherBounds.right() &&
            this.right() > otherBounds.left());
    }
    boundCollideStatus(otherBounds) {
        let status = BoundingBox.eBoundCollideStatus.eOutside;
        if (this.intersects(otherBounds)) {
            if (this.right() < otherBounds.right()) {
                status |= BoundingBox.eBoundCollideStatus.eCollideRight;
            }
            if (this.left() > otherBounds.left()) {
                status |= BoundingBox.eBoundCollideStatus.eCollideLeft;
            }
            if (this.top() < otherBounds.top()) {
                status |= BoundingBox.eBoundCollideStatus.eCollideTop;
            }
            if (this.bottom() > otherBounds.bottom()) {
                status |= BoundingBox.eBoundCollideStatus.eCollideBottom;
            }
            if (status === BoundingBox.eBoundCollideStatus.eOutside) {
                status = BoundingBox.eBoundCollideStatus.eInside;
            }
        }
        return status;
    }
}
BoundingBox.eBoundCollideStatus = Object.freeze({
    eOutside: 0,
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside: 16,
});

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class GameObject {
    constructor(renderComponent) {
        this.renderComponent = renderComponent;
        this.visible = true;
        this._currentFrontDir = fromValues(0, 1);
        this.speed = 0;
    }
    get xform() {
        return this.renderComponent.getXform();
    }
    get currentFrontDir() {
        return this._currentFrontDir;
    }
    set currentFrontDir(dir) {
        copy(this._currentFrontDir, dir);
    }
    getBBox() {
        const xform = this.xform;
        return new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    }
    rotateObjPointTo(target, rate) {
        //    var distToTarget = vec2.distance(target, this.Xform.getPosition());
        const targetVector = create();
        subtract(targetVector, target, this.xform.getPosition());
        const distToTarget = length(targetVector);
        if (distToTarget < Number.MIN_VALUE) {
            return; //reached target
        }
        scale(targetVector, targetVector, 1 / distToTarget);
        let cosTheta = dot(targetVector, this.currentFrontDir);
        if (cosTheta > 0.999999) {
            return; //facing the correct direction
        }
        if (cosTheta > 1) {
            cosTheta = 1;
        }
        else if (cosTheta < -1) {
            cosTheta = -1;
        }
        const targetVector3D = fromValues$2(targetVector[0], targetVector[1], 0);
        const frontDir3D = fromValues$2(this.currentFrontDir[0], this.currentFrontDir[1], 0);
        const cross$1 = create$2();
        cross(cross$1, frontDir3D, targetVector3D);
        let rads = Math.acos(cosTheta);
        if (cross$1[2] < 0) {
            rads = -rads;
        }
        rads *= rate;
        rotate(this.currentFrontDir, this.currentFrontDir, fromValues(0, 0), rads);
        this.xform.incRotationInRads(rads);
    }
    update() {
        if (this.physicsComponent !== undefined) {
            this.physicsComponent.update();
        }
    }
    draw(camera) {
        var _a;
        if (this.visible) {
            this.renderComponent.draw(camera);
            if (this.physicsComponent !== null) {
                (_a = this.physicsComponent) === null || _a === void 0 ? void 0 : _a.draw(camera);
            }
        }
    }
    pixelTouches(otherObj, wcTouchPos) {
        let pixelTouches = false;
        const otherRen = otherObj.renderComponent;
        const thisRen = this.renderComponent;
        if (otherRen instanceof TextureRenderable &&
            thisRen instanceof TextureRenderable) {
            if (otherObj.xform.getRotation() === 0 &&
                this.xform.getRotation() === 0) {
                if (this.getBBox().intersects(otherObj.getBBox())) {
                    thisRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
                }
            }
            else {
                const thisWidth = this.xform.getWidth();
                const thisHeight = this.xform.getHeight();
                const otherWidth = otherObj.xform.getWidth();
                const otherHeight = otherObj.xform.getHeight();
                const thisRadius = Math.sqrt(Math.pow(thisWidth * 0.5, 2) + Math.pow(thisHeight * 0.5, 2));
                const otherRadius = Math.sqrt(Math.pow(otherWidth * 0.5, 2) + Math.pow(otherHeight * 0.5, 2));
                const delta = create();
                sub(delta, this.xform.getPosition(), otherObj.xform.getPosition());
                if (length(delta) < thisRadius + otherRadius) {
                    thisRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouches = thisRen.pixelTouches(otherRen, wcTouchPos);
                }
            }
        }
        return pixelTouches;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class SpriteRenderable extends TextureRenderable {
    constructor(texture) {
        super(texture);
        this._setShader(mPublic$1.getSpriteShader());
        this.texLeft = 0.0;
        this.texRight = 1.0;
        this.texTop = 1.0;
        this.texBottom = 0.0;
        this._setTexInfo();
    }
    setElementUVCoordinates(left, right, bottom, top) {
        this.texLeft = left;
        this.texRight = right;
        this.texBottom = bottom;
        this.texTop = top;
        this._setTexInfo();
    }
    setElementPixelCoordinates(left, right, bottom, top) {
        const texInfo = mPublic$7.retrieveAsset(this.texture);
        const imgHeight = texInfo.height;
        const imgWidth = texInfo.width;
        this.texLeft = left / imgWidth;
        this.texRight = right / imgWidth;
        this.texBottom = bottom / imgHeight;
        this.texTop = top / imgHeight;
        this._setTexInfo();
    }
    getElementUVCoordinateArray() {
        return [
            this.texRight,
            this.texTop,
            this.texLeft,
            this.texTop,
            this.texRight,
            this.texBottom,
            this.texLeft,
            this.texBottom,
        ];
    }
    draw(camera) {
        this.shader.setTextureCoordinates(this.getElementUVCoordinateArray());
        TextureRenderable.prototype.draw.call(this, camera);
    }
    _setTexInfo() {
        const imageW = this.textureInfo.width;
        const imageH = this.textureInfo.height;
        this.texLeftIndex = this.texLeft * imageW;
        this.texBottomIndex = this.texBottom * imageH;
        this.texWidth = (this.texRight - this.texLeft) * imageW + 1;
        this.texHeight = (this.texTop - this.texBottom) * imageH + 1;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class LightRenderable extends SpriteRenderable {
    constructor(texture) {
        super(texture);
        this.lights = [];
        this._setShader(mPublic$1.getLightShader());
    }
    getLightAt(index) {
        return this.lights[index];
    }
    setLights(lights) {
        this.lights = lights;
    }
    addLight(light) {
        this.lights.push(light);
    }
    numLights() {
        return this.lights.length;
    }
    draw(camera) {
        this.shader.setLights(this.lights);
        SpriteRenderable.prototype.draw.call(this, camera);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Material {
    constructor() {
        this.ambient = fromValues$1(0.0, 0.0, 0.0, 0.0);
        this.diffuse = fromValues$1(0.2, 0.2, 0.2, 1.0);
        this.specular = fromValues$1(1.0, 1.0, 1.0, 1.0);
        this.shininess = 20;
    }
    getAmbient() {
        return this.ambient;
    }
    setAmbient(ambient) {
        copy$1(this.ambient, ambient);
    }
    getDiffuse() {
        return this.diffuse;
    }
    setDiffuse(diffuse) {
        copy$1(this.diffuse, diffuse);
    }
    getSpecular() {
        return this.specular;
    }
    setSpecular(specular) {
        copy$1(this.specular, specular);
    }
    getShininess() {
        return this.shininess;
    }
    setShininess(shininess) {
        this.shininess = shininess;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class IllumRenderable extends LightRenderable {
    constructor(colorTexture, normalTexture, material = new Material()) {
        super(colorTexture);
        this._setShader(mPublic$1.getIllumShader());
        this.normalTexture = normalTexture;
        this.material = material;
    }
    getMaterial() {
        return this.material;
    }
    setMaterial(material) {
        this.material = material;
    }
    draw(camera) {
        mPublic$4.activateNormalTexture(this.normalTexture);
        this.shader.setMaterial(this.material);
        LightRenderable.prototype.draw.call(this, camera);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Minion extends GameObject {
    constructor(spriteTexture, normalTexture) {
        let minion;
        if (normalTexture === null || normalTexture === undefined) {
            minion = new LightRenderable(spriteTexture);
        }
        else {
            minion = new IllumRenderable(spriteTexture, normalTexture);
        }
        minion.setColor([1, 1, 1, 0]);
        minion.getXform().setSize(12, 9.6);
        minion.setElementPixelCoordinates(0, 201, 350, 512);
        super(minion);
        this.delta = 0.2;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Interpolator {
    constructor(start, cycles, rate) {
        this.current = start;
        this.end = start;
        this.rate = rate;
        this.cycles = cycles;
        this.cyclesLeft = 0;
    }
    configInterpolation(stiffness, duration) {
        this.rate = stiffness;
        this.cycles = duration;
    }
    setFinalValue(final) {
        //    console.log("Setting final value");
        this.end = final;
        this.cyclesLeft = this.cycles;
    }
    interpolateValue() {
        /* stub */
    }
    getValue() {
        return this.current;
    }
    update() {
        if (this.cyclesLeft <= 0) {
            return;
        }
        this.cyclesLeft--;
        if (this.cyclesLeft === 0) {
            this.current = this.end;
        }
        else {
            this.interpolateValue();
        }
    }
}

class InterpolatorNum extends Interpolator {
    constructor(start, cycles, rate) {
        super(start, cycles, rate);
    }
    interpolateValue() {
        this.current = this.current + (this.end - this.current) * this.rate;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class InterpolatorVec2 extends Interpolator {
    constructor(start, cycles, rate) {
        super(start, cycles, rate);
    }
    interpolateValue() {
        //    console.log("In vector interpolation from " + this.current + " to " + this.end);
        lerp(this.current, this.current, this.end, this.rate);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class CameraState {
    constructor(center, width) {
        this.rate = 0.1;
        this.cycles = 300;
        this.width = new InterpolatorNum(width, this.cycles, this.rate);
        this.center = new InterpolatorVec2(center, this.cycles, this.rate);
    }
    getCenter() {
        return this.center.getValue();
    }
    setCenter(center) {
        this.center.setFinalValue(center);
    }
    getWidth() {
        return this.width.getValue();
    }
    setWidth(width) {
        this.width.setFinalValue(width);
    }
    configInterpolation(stiffness, duration) {
        this.width.configInterpolation(stiffness, duration);
        this.center.configInterpolation(stiffness, duration);
    }
    update() {
        this.width.update();
        this.center.update();
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class MathUtils {
    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }
    static lerp(start, end, value) {
        return start + (end - start) * value;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @param {Number} xDelta wc units, initial x displacement
 * @param {Number} yDelta wc units, initial y displacement
 * @param {Number} numOscillations number of complete oscillations the
 *                                 harmonic oscillator will go through in the
 *                                 time given
 * @param {Number} duration number of ticks the shake will take
 * @returns {ShakePosition}
 */
class ShakePosition {
    constructor(xDelta, yDelta, numOscillations, duration) {
        this.initX = xDelta;
        this.initY = yDelta;
        this.omega = numOscillations * 2 * Math.PI; //convert to radians
        this.duration = duration;
        this.numCyclesLeft = duration;
    }
    /**
     *
     * @returns {Number} float between zero and one representing the interpolation
     */
    _getHarmonicValue() {
        const frac = this.numCyclesLeft / this.duration;
        return frac * frac * Math.cos(this.omega * (1 - frac));
    }
    shakeDone() {
        return this.numCyclesLeft <= 0;
    }
    calcShake() {
        this.numCyclesLeft--;
        let deltaX = 0;
        let deltaY = 0;
        if (!this.shakeDone()) {
            const xBit = Math.random() > 0.5 ? 1 : -1;
            const yBit = Math.random() > 0.5 ? 1 : -1;
            const harmonic = this._getHarmonicValue();
            deltaX = harmonic * this.initX * xBit;
            deltaY = harmonic * this.initY * yBit;
        }
        return fromValues(deltaX, deltaY);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class CameraShake {
    constructor(origCenter, initDeltaX, initDeltaY, numOscillations, shakeDuration) {
        this.origCenter = clone(origCenter);
        this.shookCenter = clone(origCenter);
        this.shake = new ShakePosition(initDeltaX, initDeltaY, numOscillations, shakeDuration);
    }
    setCenter(center) {
        copy(this.origCenter, center);
    }
    getShookPos() {
        return clone(this.shookCenter);
    }
    shakeDone() {
        return this.shake.shakeDone();
    }
    updateShakeState() {
        const shake = this.shake.calcShake();
        add(this.shookCenter, this.origCenter, shake);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class PreRenderCache {
    constructor() {
        this.wcToPixelsRatio = 1;
        this.viewportBottomWC = -1;
        this.viewportLeftWC = -1;
        this.cameraPosPx = fromValues$2(0.0, 0.0, 0.0);
    }
}
/**
 * Defines a camera that will draw a section of the world on to a section of
 * canvas known as a viewport.
 * @param {type} wcCenter position to look at in WC space (world units).
 * @param {type} wcWidth the size of the "frame" the camera looks through.
 *                       In other words, the frame's left is wcCenter -
 *                       (wcWidth/2), bottom is wcCenter - (wcHeight/2). The
 *                       frame is wcWidth world units wide AND
 *                       (bounds - 2*borderPx) pixels wide.
 * @param {type} bounds area of canvas in DC space on which to draw. Strictly
 *                      contains the viewport.
 * @param {type} borderPx space between the viewport and the outer bounds.
 * @returns {Camera}
 */
class Camera {
    constructor(wcCenter, wcWidth, bounds, borderPx = 0) {
        this.cameraState = new CameraState(wcCenter, wcWidth);
        this.renderCache = new PreRenderCache();
        this.cameraShake = null;
        this.viewport = [0, 0, 0, 0];
        this.scissorBounds = [0, 0, 0, 0];
        this.viewportBorderPx = borderPx;
        this.setBounds(bounds, this.viewportBorderPx);
        this.nearPlane = 0;
        this.farPlane = 1000;
        this.viewMatrix = create$3();
        this.projMatrix = create$3();
        this.viewProjMatrix = create$3();
        this.bgColor = [0.8, 0.8, 0.8, 1.0];
    }
    setWCCenter(xPos, yPos) {
        this.cameraState.setCenter(fromValues(xPos, yPos));
    }
    getWCCenter() {
        return this.cameraState.getCenter();
    }
    setWCWidth(width) {
        //    this.mWCWidth = width;
        this.cameraState.setWidth(width);
    }
    getWCWidth() {
        return this.cameraState.getWidth();
    }
    getWCHeight() {
        return this.getWCWidth() * (this.viewport[3] / this.viewport[2]);
    }
    getWCLeft() {
        return this.getWCCenter()[0] - this.getWCWidth() / 2;
    }
    getWCRight() {
        return this.getWCCenter()[0] + this.getWCWidth() / 2;
    }
    getWCBottom() {
        return this.getWCCenter()[1] - this.getWCHeight() / 2;
    }
    getWCTop() {
        return this.getWCCenter()[1] + this.getWCHeight() / 2;
    }
    genRandomPosition2D() {
        const randomX = MathUtils.lerp(this.getWCLeft(), this.getWCRight(), Math.random());
        const randomY = MathUtils.lerp(this.getWCBottom(), this.getWCTop(), Math.random());
        return fromValues(randomX, randomY);
    }
    getViewportLeft() {
        return this.viewport[0];
    }
    getViewportBottom() {
        return this.viewport[1];
    }
    getCameraPosPx() {
        return this.renderCache.cameraPosPx;
    }
    setBackgroundColor(color) {
        this.bgColor = color;
    }
    getBackgroundColor() {
        return this.bgColor;
    }
    getVPMatrix() {
        return this.viewProjMatrix;
    }
    getBounds() {
        const out = [0, 0, 0, 0];
        out[0] = this.scissorBounds[0];
        out[1] = this.scissorBounds[1];
        out[2] = this.scissorBounds[2];
        out[3] = this.scissorBounds[3];
        return out;
    }
    setBounds(bounds, borderPx) {
        if (borderPx !== undefined) {
            this.viewportBorderPx = borderPx;
        }
        else {
            borderPx = this.viewportBorderPx;
        }
        this.viewport[0] = bounds[0] + borderPx;
        this.viewport[1] = bounds[1] + borderPx;
        this.viewport[2] = bounds[2] - borderPx * 2;
        this.viewport[3] = bounds[3] - borderPx * 2;
        this.scissorBounds[0] = bounds[0];
        this.scissorBounds[1] = bounds[1];
        this.scissorBounds[2] = bounds[2];
        this.scissorBounds[3] = bounds[3];
    }
    setupViewProjection() {
        const gl = core.gl;
        const bounds = this.scissorBounds;
        gl.viewport(this.viewport[0], this.viewport[1], this.viewport[2], this.viewport[3]);
        gl.scissor(bounds[0], bounds[1], bounds[2], bounds[3]);
        gl.enable(gl.SCISSOR_TEST);
        core.clearCanvas(this.bgColor);
        gl.disable(gl.SCISSOR_TEST);
        let center = [0, 0];
        if (this.cameraShake === null) {
            center = this.getWCCenter();
        }
        else {
            center = this.cameraShake.getShookPos();
        }
        lookAt(this.viewMatrix, [center[0], center[1], Camera.kCameraZPosWC], // Camera position
        [center[0], center[1], 0], // lookat position
        [0, 1, 0]); //orientation
        const wcHalfWidth = this.getWCWidth() * 0.5;
        const wcHalfHeight = this.getWCHeight() * 0.5;
        ortho(this.projMatrix, -wcHalfWidth, // Distance to left edge of world space
        wcHalfWidth, // distance to right edge of world space
        -wcHalfHeight, // " bottom edge
        wcHalfHeight, // " top edge
        this.nearPlane, // z-distance to near plane
        this.farPlane); // z-distance to far plane
        multiply(this.viewProjMatrix, this.projMatrix, this.viewMatrix);
        this.renderCache.wcToPixelsRatio = this.viewport[2] / this.getWCWidth();
        this.renderCache.viewportLeftWC =
            this.getWCCenter()[0] - this.getWCWidth() / 2;
        this.renderCache.viewportBottomWC =
            this.getWCCenter()[1] - this.getWCHeight() / 2;
        const cameraPosWC = fromValues$2(this.getWCCenter()[0], this.getWCCenter()[1], Camera.kCameraZPosWC);
        this.renderCache.cameraPosPx = clone$2(this.convertWCPosToPx(cameraPosWC));
    }
    collideWCBound(xform, zone) {
        const xformBounds = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
        const zoneWidth = zone * this.getWCWidth();
        const zoneHeight = zone * this.getWCHeight();
        const zoneBounds = new BoundingBox(this.getWCCenter(), zoneWidth, zoneHeight);
        return zoneBounds.boundCollideStatus(xformBounds);
    }
    clampAtBoundary(xform, zone) {
        const status = this.collideWCBound(xform, zone);
        if (status !== BoundingBox.eBoundCollideStatus.eInside) {
            const pos = xform.getPosition();
            if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
                pos[0] =
                    this.getWCCenter()[0] -
                        (this.getWCWidth() * zone) / 2 +
                        xform.getWidth() / 2;
            }
            if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
                pos[0] =
                    this.getWCCenter()[0] +
                        (this.getWCWidth() * zone) / 2 -
                        xform.getWidth() / 2;
            }
            if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
                pos[1] =
                    this.getWCCenter()[1] +
                        (this.getWCHeight() * zone) / 2 -
                        xform.getHeight() / 2;
            }
            if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
                pos[1] =
                    this.getWCCenter()[1] -
                        (this.getWCHeight() * zone) / 2 +
                        xform.getHeight() / 2;
            }
        }
        return status;
    }
    isMouseInViewport() {
        const mousePos = mPublic$8.getMousePosition();
        const x = mousePos[0] - this.viewport[0];
        const y = mousePos[1] - this.viewport[1];
        const inside = 0 <= x && x < this.viewport[2];
        return inside && 0 <= y && y < this.viewport[3];
    }
    convertWCSizeToPx(wcSize) {
        return wcSize * this.renderCache.wcToPixelsRatio;
    }
    getPixelsToWCRatio() {
        return this.getWCWidth() / this.viewport[2];
    }
    getWCCursorPosition() {
        if (!this.isMouseInViewport()) {
            throw "Mouse not found in viewport, can't get position in world space.";
        }
        const mousePos2DPx = mPublic$8.getMousePosition();
        const vpOrigin = fromValues(this.getViewportLeft(), this.getViewportBottom());
        const bottomLeft = fromValues(this.getWCCenter()[0] - this.getWCWidth() / 2, this.getWCCenter()[1] - this.getWCHeight() / 2);
        const wcPos = create();
        sub(wcPos, mousePos2DPx, vpOrigin);
        scaleAndAdd(wcPos, bottomLeft, wcPos, this.getPixelsToWCRatio());
        //    return vec3(wcPos[0], wcPos[1]);
        return wcPos;
    }
    convertWCPosToPx(wcPosition) {
        let x = wcPosition[0] - this.renderCache.viewportLeftWC;
        x = this.viewport[0] + x * this.renderCache.wcToPixelsRatio + 0.5;
        let y = wcPosition[1] - this.renderCache.viewportBottomWC;
        y = this.viewport[1] + y * this.renderCache.wcToPixelsRatio + 0.5;
        const z = wcPosition[2] * this.renderCache.wcToPixelsRatio;
        return fromValues$2(x, y, z);
    }
    convertWCVecToPx(wcVec) {
        const result = create$2();
        scale$1(result, wcVec, this.renderCache.wcToPixelsRatio);
        return result;
    }
    /**
     * Imported from Camera_Manipulation.js
     */
    update() {
        if (this.cameraShake !== null && this.cameraShake !== undefined) {
            if (this.cameraShake.shakeDone()) {
                this.cameraShake = null;
            }
            else {
                this.cameraShake.setCenter(this.getWCCenter());
                this.cameraShake.updateShakeState();
            }
        }
        this.cameraState.update();
    }
    configInterpolation(stiffness, duration) {
        this.cameraState.configInterpolation(stiffness, duration);
    }
    panBy(dx, dy) {
        const center = clone(this.getWCCenter());
        this.setWCCenter(center[0] + dx, center[1] + dy);
    }
    panTo(px, py) {
        this.setWCCenter(px, py);
    }
    panWith(xform, zone) {
        const status = this.collideWCBound(xform, zone);
        if (status !== BoundingBox.eBoundCollideStatus.eInside) {
            const newC = clone(this.getWCCenter());
            const pos = xform.getPosition();
            if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
                newC[0] =
                    pos[0] - xform.getWidth() / 2 + (this.getWCWidth() * zone) / 2;
            }
            if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
                newC[0] =
                    pos[0] + xform.getWidth() / 2 - (this.getWCWidth() * zone) / 2;
            }
            if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
                newC[1] =
                    pos[1] + xform.getHeight() / 2 - (this.getWCHeight() * zone) / 2;
            }
            if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
                newC[1] =
                    pos[1] - xform.getHeight() / 2 + (this.getWCHeight() * zone) / 2;
            }
            this.cameraState.setCenter(newC);
        }
        return status;
    }
    zoomBy(zoom) {
        if (zoom > 0) {
            this.setWCWidth(this.getWCWidth() * zoom);
        }
    }
    zoomTowards(pos, zoom) {
        if (zoom > 0) {
            const delta = create();
            const center = clone(this.getWCCenter());
            sub(delta, pos, center);
            scale(delta, delta, zoom - 1);
            sub(center, center, delta);
            this.cameraState.setCenter(center);
            this.zoomBy(zoom);
        }
    }
    startShake(initDeltaX, initDeltaY, numOscillations, duration) {
        this.cameraShake = new CameraShake(clone(this.cameraState.getCenter()), initDeltaX, initDeltaY, numOscillations, duration);
    }
}
Camera.kCameraZPosWC = 10;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class LineRenderable extends Renderable {
    constructor(x1, y1, x2, y2) {
        super();
        this._start = create();
        this._end = create();
        this._thickness = 0.2;
        this.setColor([1.0, 1.0, 1.0, 1.0]);
        this._setShader(mPublic$1.getLineShader());
        // trigger thickness mutator
        this.thickness = this._thickness;
        if (x1 !== undefined &&
            y1 !== undefined &&
            x2 !== undefined &&
            y2 !== undefined) {
            this.setEndpoints(x1, y1, x2, y2);
        }
    }
    get start() {
        return this._start;
    }
    set start(start) {
        copy(this._start, start);
    }
    get end() {
        return this._end;
    }
    set end(end) {
        copy(this._end, end);
    }
    get thickness() {
        return this._thickness;
    }
    set thickness(thickness) {
        this._thickness = thickness;
        this.xform.setHeight(thickness);
    }
    draw(camera) {
        super.draw(camera);
    }
    calcXform() {
        //(sx, sy) is the line's vector
        const sx = this.end[0] - this.start[0];
        const sy = this.end[1] - this.start[1];
        //line center
        const cx = this.start[0] + sx / 2.0;
        const cy = this.start[1] + sy / 2.0;
        const lineLength = Math.sqrt(sx * sx + sy * sy);
        let rotation = angle(fromValues(sx, sy), fromValues(1.0, 0.0));
        const axisVector3D = fromValues$2(1.0, 0.0, 0.0);
        const lineVector3D = fromValues$2(sx, sy, 0.0);
        const cross$1 = create$2();
        cross(cross$1, axisVector3D, lineVector3D);
        if (cross$1[2] < 0) {
            rotation = -rotation;
        }
        this.xform.setPosition(cx, cy);
        this.xform.setWidth(lineLength);
        this.xform.setRotationRads(rotation);
    }
    setEndpoints(x1, y1, x2, y2) {
        set(this._start, x1, y1);
        set(this._end, x2, y2);
        this.calcXform();
    }
    setStartPos(x, y) {
        set(this._start, x, y);
        this.calcXform();
    }
    setEndPos(x, y) {
        set(this._end, x, y);
        this.calcXform();
        this.end = fromValues(x, y);
    }
}

class PhysicsComponent {
    constructor() {
        this.positionMark = new LineRenderable();
        this.padding = 0.25;
        this.drawBounds = false;
    }
    get boundsColor() {
        return this.positionMark.getColor();
    }
    set boundsColor(c) {
        this.positionMark.setColor(c);
    }
    draw(camera) {
        if (!this.drawBounds) {
            return;
        }
        const pos = this.position;
        this.positionMark.setStartPos(pos[0] - this.padding, pos[1] + this.padding);
        this.positionMark.setEndPos(pos[0] + this.padding, pos[1] - this.padding);
        this.positionMark.draw(camera);
        this.positionMark.setStartPos(pos[0] + this.padding, pos[1] + this.padding);
        this.positionMark.setEndPos(pos[0] - this.padding, pos[1] - this.padding);
        this.positionMark.draw(camera);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class RigidShape extends PhysicsComponent {
    constructor(xform) {
        super();
        this.xform = xform;
        this.rigidType = 0 /* RigidType.Abstract */;
        this._invMass = 1;
        this.restitution = 0.8;
        this._velocity = create();
        this.friction = 0.3;
        this.acceleration = create();
    }
    get position() {
        return this.xform.getPosition();
    }
    set position(p) {
        this.xform.setPosition(p[0], p[1]);
    }
    get invMass() {
        return this._invMass;
    }
    set mass(mass) {
        if (mass > 0) {
            this._invMass = 1 / mass;
        }
        else {
            this._invMass = 0;
        }
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(newV) {
        copy(this._velocity, newV);
    }
    update() {
        const dt = mPublic.frameTime;
        scaleAndAdd(this.velocity, this.velocity, this.acceleration, this.invMass * dt);
        scaleAndAdd(this.position, this.position, this.velocity, dt);
    }
    draw(camera) {
        if (this.drawBounds) {
            this.positionMark.getXform().setZPos(this.xform.getZPos());
        }
        super.draw(camera);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class RigidCircle extends RigidShape {
    constructor(xform, radius) {
        super(xform);
        this.radius = radius;
        this.rigidType = 1 /* RigidType.Circle */;
        this.numSides = 16;
        this.angularDelta = (2 * Math.PI) / this.numSides;
        this.sides = new LineRenderable(0, 0, 0, 0);
        if (this.numSides < 2) {
            throw "Need at least three points to draw a circle";
        }
    }
    set boundsColor(color) {
        super.boundsColor = color;
        this.sides.setColor(color);
    }
    containsPos(position) {
        const dist = squaredDistance(this.position, position);
        return dist < this.radius * this.radius;
    }
    containsVec(vec) {
        const dist = squaredLength(vec);
        return dist < this.radius * this.radius;
    }
    projectToEdge(vec) {
        if (this.containsVec(vec)) {
            const length$1 = length(vec);
            scale(vec, vec, this.radius / length$1);
        }
    }
    clampToEdge(vec) {
        if (!this.containsVec(vec)) {
            const length$1 = length(vec);
            scale(vec, vec, this.radius / length$1);
        }
    }
    draw(camera) {
        super.draw(camera);
        if (!this.drawBounds) {
            return;
        }
        this.sides.getXform().setZPos(this.xform.getZPos());
        const pos = this.position;
        const drawPoint = fromValues(pos[0] + this.radius, pos[1]);
        this.sides.setStartPos(drawPoint[0], drawPoint[1]);
        for (let i = 1; i <= this.numSides; i++) {
            rotate(drawPoint, drawPoint, pos, this.angularDelta);
            if (i % 2 === 0) {
                this.sides.setStartPos(drawPoint[0], drawPoint[1]);
            }
            else {
                this.sides.setEndPos(drawPoint[0], drawPoint[1]);
            }
            this.sides.draw(camera);
        }
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Hero extends GameObject {
    constructor(spriteTexture, normalTexture) {
        let hero;
        if (normalTexture === null || normalTexture === undefined) {
            hero = new LightRenderable(spriteTexture);
        }
        else {
            hero = new IllumRenderable(spriteTexture, normalTexture);
        }
        hero.setColor([1, 1, 1, 0]);
        hero.getXform().setPosition(35, 50);
        hero.getXform().incZPos(3);
        hero.getXform().setSize(18, 24);
        hero.setElementPixelCoordinates(0, 120, 0, 180);
        super(hero);
        const hitBox = new RigidCircle(hero.getXform(), 9);
        hitBox.drawBounds = true;
        this.physicsComponent = hitBox;
        this.delta = 0.3;
        this.deltaDegrees = 1;
    }
    update() {
        const newV = clone(this.physicsComponent.velocity);
        if (mPublic$8.isKeyPressed(mPublic$8.keys.W)) {
            if (newV[1] < 4) {
                newV[1] += 0.2;
            }
        }
        if (mPublic$8.isKeyPressed(mPublic$8.keys.A)) {
            if (newV[0] > -4) {
                newV[0] -= 0.2;
            }
        }
        if (mPublic$8.isKeyPressed(mPublic$8.keys.S)) {
            if (newV[1] > -4) {
                newV[1] -= 0.2;
            }
        }
        if (mPublic$8.isKeyPressed(mPublic$8.keys.D)) {
            if (newV[0] < 4) {
                newV[0] += 0.2;
            }
        }
        this.physicsComponent.velocity = newV;
        super.update();
    }
}

class TileGameObject extends GameObject {
    constructor(renderable) {
        super(renderable);
        this.shouldTile = true;
    }
    update() {
        const pos = this.xform.getPosition();
        scaleAndAdd(pos, pos, this._currentFrontDir, this.speed);
    }
    drawTiles(camera) {
        const tileWidth = this.xform.getWidth();
        const tileHeight = this.xform.getHeight();
        const tilePos = this.xform.getPosition();
        const tileLeft = tilePos[0] - tileWidth / 2;
        let tileRight = tilePos[0] + tileWidth / 2;
        let tileTop = tilePos[1] + tileHeight / 2;
        const tileBottom = tilePos[1] - tileHeight / 2;
        const cameraPos = camera.getWCCenter();
        const cameraLeft = cameraPos[0] - camera.getWCWidth() / 2;
        const cameraRight = cameraPos[0] + camera.getWCWidth() / 2;
        const cameraTop = cameraPos[1] + camera.getWCHeight() / 2;
        const cameraBottom = cameraPos[1] - camera.getWCHeight() / 2;
        let dx = 0, dy = 0;
        if (tileRight < cameraLeft) {
            dx = Math.ceil((cameraLeft - tileRight) / tileWidth) * tileWidth;
        }
        else if (cameraLeft < tileLeft) {
            dx = -Math.ceil((tileLeft - cameraLeft) / tileWidth) * tileWidth;
        }
        if (tileTop < cameraBottom) {
            dy = Math.ceil((cameraBottom - tileTop) / tileHeight) * tileHeight;
        }
        else if (cameraBottom < tileBottom) {
            dy = -Math.ceil((tileBottom - cameraBottom) / tileHeight) * tileHeight;
        }
        const origX = tilePos[0];
        const origY = tilePos[1];
        this.xform.incXPos(dx);
        this.xform.incYPos(dy);
        tileRight = tilePos[0] + tileWidth / 2;
        tileTop = tilePos[1] + tileHeight / 2;
        const nx = Math.ceil((cameraRight - tileRight) / tileWidth);
        const ny = Math.ceil((cameraTop - tileTop) / tileHeight);
        let i, j;
        const leftStart = tilePos[0];
        for (i = 0; i <= ny; i++) {
            tilePos[0] = leftStart;
            for (j = 0; j <= nx; j++) {
                this.renderComponent.draw(camera);
                this.xform.incXPos(tileWidth);
            }
            this.xform.incYPos(tileHeight);
        }
        set(tilePos, origX, origY);
    }
    draw(camera) {
        if (this.visible) {
            if (this.shouldTile) {
                this.drawTiles(camera);
            }
            else {
                this.renderComponent.draw(camera);
            }
        }
    }
}

class ParallaxGameObject extends TileGameObject {
    constructor(renderable, scale, cameraRef) {
        super(renderable);
        this.cameraRef = cameraRef;
        this._parallaxScale = 1;
        this.lastCameraPos = create();
        this.parallaxScale = scale;
        copy(this.lastCameraPos, cameraRef.getWCCenter());
    }
    get parallaxScale() {
        return this._parallaxScale;
    }
    set parallaxScale(scale) {
        if (scale <= 0) {
            this._parallaxScale = 1;
        }
        else {
            this._parallaxScale = 1 / scale;
        }
    }
    reactToCameraTranslation(translationDelta) {
        const distanceScaling = 1 - this.parallaxScale;
        this.xform.incXPos(-translationDelta[0] * distanceScaling);
        this.xform.incYPos(-translationDelta[1] * distanceScaling);
    }
    updateReferencePosition() {
        const delta = create();
        const curCameraPosition = this.cameraRef.getWCCenter();
        sub(delta, this.lastCameraPos, curCameraPosition);
        this.reactToCameraTranslation(delta);
        copy(this.lastCameraPos, curCameraPosition);
    }
    update() {
        this.updateReferencePosition();
        super.update();
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class RigidRect extends RigidShape {
    constructor(xform, width, height) {
        super(xform);
        this.width = width;
        this.height = height;
        this.rigidType = 2 /* RigidType.Rect */;
        this.sides = new LineRenderable(0, 0, 0, 0);
    }
    set boundsColor(c) {
        super.boundsColor = c;
        this.sides.setColor(c);
    }
    get halfWidth() {
        return this.width / 2;
    }
    get halfHeight() {
        return this.height / 2;
    }
    get left() {
        return this.xform.getXPos() - this.halfWidth;
    }
    get right() {
        return this.xform.getXPos() + this.halfWidth;
    }
    get top() {
        return this.xform.getYPos() + this.halfHeight;
    }
    get bottom() {
        return this.xform.getYPos() - this.halfHeight;
    }
    containsPos(position) {
        return (this.left < position[0] &&
            position[0] < this.right &&
            this.bottom < position[1] &&
            position[1] < this.top);
    }
    containsVec(vec) {
        return (Math.abs(vec[0]) < this.halfWidth && Math.abs(vec[1]) < this.halfHeight);
    }
    projectToEdge(vec) {
        if (this.containsVec(vec)) {
            if (Math.abs(vec[0] - this.halfWidth) < Math.abs(vec[1] - this.halfHeight)) {
                vec[0] = this.halfWidth;
                vec[0] *= vec[0] < 0 ? -1 : 1;
            }
            else {
                vec[1] = this.halfHeight;
                vec[1] *= vec[1] < 0 ? -1 : 1;
            }
        }
    }
    clampToEdge(vec) {
        if (!this.containsVec(vec)) {
            vec[0] = MathUtils.clamp(vec[0], -this.halfWidth, this.halfWidth);
            vec[1] = MathUtils.clamp(vec[1], -this.halfHeight, this.halfHeight);
        }
    }
    draw(camera) {
        super.draw(camera);
        if (!this.drawBounds) {
            return;
        }
        const x = this.position[0];
        const y = this.position[1];
        const halfWidth = this.halfWidth;
        const halfHeight = this.halfHeight;
        this.sides.getXform().setZPos(this.xform.getZPos());
        // top edge
        this.sides.setStartPos(x - halfWidth, y + halfHeight);
        this.sides.setEndPos(x + halfWidth, y + halfHeight);
        this.sides.draw(camera);
        // right edge
        this.sides.setStartPos(x + halfWidth, y - halfHeight);
        this.sides.draw(camera);
        //bottom edge
        this.sides.setEndPos(x - halfWidth, y - halfHeight);
        this.sides.draw(camera);
        // left edge
        this.sides.setStartPos(x - halfWidth, y + halfHeight);
        this.sides.draw(camera);
    }
}

function collided(thing1, thing2, collisionInfo) {
    if (thing1 instanceof RigidRect) {
        return rectCollision(thing1, thing2, collisionInfo);
    }
    else if (thing1 instanceof RigidCircle) {
        return circCollision(thing1, thing2, collisionInfo);
    }
    return false;
}
function rectCollision(rect, thing, collisionInfo) {
    if (thing instanceof RigidRect) {
        return rectRectCollision(rect, thing, collisionInfo);
    }
    else if (thing instanceof RigidCircle) {
        return rectCircCollision(rect, thing, collisionInfo);
    }
    return false;
}
function circCollision(circ, thing, collisionInfo) {
    if (thing instanceof RigidRect) {
        return circRectCollision(circ, thing, collisionInfo);
    }
    else if (thing instanceof RigidCircle) {
        return circCircCollision(circ, thing, collisionInfo);
    }
    return false;
}
function rectRectCollision(first, second, collisionInfo) {
    const firstPos = first.position;
    const secondPos = second.position;
    const vFirstToSecond = create();
    subtract(vFirstToSecond, secondPos, firstPos);
    const xDepth = first.halfWidth + second.halfWidth - Math.abs(vFirstToSecond[0]);
    if (xDepth > 0) {
        const yDepth = first.halfHeight + second.halfHeight - Math.abs(vFirstToSecond[1]);
        if (yDepth > 0) {
            if (xDepth < yDepth) {
                collisionInfo.depth = xDepth;
                if (vFirstToSecond[0] > 0) {
                    collisionInfo.normal = fromValues(1, 0);
                }
                else {
                    collisionInfo.normal = fromValues(-1, 0);
                }
            }
            else {
                collisionInfo.depth = yDepth;
                if (vFirstToSecond[1] > 0) {
                    collisionInfo.normal = fromValues(0, 1);
                }
                else {
                    collisionInfo.normal = fromValues(0, -1);
                }
            }
            return true;
        }
    }
    return false;
}
function rectCircCollision(rect, circle, collisionInfo) {
    const rectPos = rect.position;
    const circlePos = circle.position;
    // calculate vector from rect center to circ center
    const vRectToCirc = create();
    subtract(vRectToCirc, circlePos, rectPos);
    // find the vector that corresponds to the nearest point on
    // the rectangle's edge
    const vec = clone(vRectToCirc);
    rect.projectToEdge(vec);
    rect.clampToEdge(vec);
    // calculate the collision normal
    // i.e. the shortest distance between the rectangle's edges and the circle's center
    const normal = create();
    subtract(normal, vRectToCirc, vec);
    // Either the circle is inside the rectangle, or it's close enough
    // to collide. If neither is true, no collision.
    const squaredNormal = squaredLength(normal);
    const squaredRadius = circle.radius * circle.radius;
    const isInside = rect.containsPos(circlePos);
    if (!isInside && squaredRadius < squaredNormal) {
        return false;
    }
    const len = Math.sqrt(squaredNormal);
    let depth = circle.radius;
    // Normallize normal
    scale(normal, normal, 1 / len);
    // Flip normal so it's pointing away from the rectangle's center
    if (isInside) {
        depth += len;
        scale(normal, normal, -1);
    }
    else {
        depth -= len;
    }
    collisionInfo.normal = normal;
    collisionInfo.depth = depth;
    return true;
}
function circRectCollision(circle, rect, collisionInfo) {
    const isCollided = rectCircCollision(rect, circle, collisionInfo);
    scale(collisionInfo.normal, collisionInfo.normal, -1);
    return isCollided;
}
function circCircCollision(first, second, collisionInfo) {
    const distSquared = squaredDistance(first.position, second.position);
    const maxDist = first.radius + second.radius;
    if (distSquared >= maxDist * maxDist) {
        return false;
    }
    const vFirstToSecond = create();
    subtract(vFirstToSecond, second.position, first.position);
    const dist = Math.sqrt(distSquared);
    const depth = first.radius + second.radius - dist;
    let normal;
    if (dist === 0) {
        normal = fromValues(0, 1);
    }
    else {
        normal = clone(vFirstToSecond);
        scale(normal, normal, 1 / dist);
    }
    collisionInfo.depth = depth;
    collisionInfo.normal = normal;
    return true;
}

class CollisionInfo {
    constructor() {
        this.depth = 0;
        this.normal = create();
    }
}
CollisionInfo.Instance = new CollisionInfo();

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class GameObjectSet {
    constructor() {
        this.delta = 0.3;
        this.set = [];
        this.selected = -1;
        this.alertCollisions = false;
    }
    size() {
        return this.set.length;
    }
    getObjectAt(index) {
        return this.set[index];
    }
    _isValidIndex(index) {
        return (index !== undefined &&
            index !== null &&
            index >= 0 &&
            index < this.set.length);
    }
    selectObjectAt(index) {
        if (this.set.length === 0) {
            throw "No objects to select";
        }
        if (!this._isValidIndex(index)) {
            throw "Index [" + index + "] is invalid, no object selected";
        }
        this.selected = index;
        console.log(this.selected + " is currently selected");
    }
    deselectObject() {
        this.selected = -1;
    }
    hasValidSelection() {
        return this._isValidIndex(this.selected);
    }
    getSelectedObject() {
        return this.hasValidSelection() ? this.set[this.selected] : null;
    }
    /**
     * Increments the current selection index. Wraps the index to 0 if incrementing
     * past the length of the array.
     * NOTE: If there is no selected object, this will attempt to select the first
     * object using {@function selectObjectAt}.
     */
    incSelected() {
        const index = (this.selected + 1) % this.set.length;
        this.selectObjectAt(index);
    }
    /**
     * Decrements the current selection index. Wraps to the last index if
     * decrementing below 0.
     * NOTE: If there is no selected object, this will attempt to select the last
     * object using {@function selectObjectAt}.
     */
    decSelected() {
        const index = this.selected <= 0 ? this.set.length - 1 : this.selected - 1;
        this.selectObjectAt(index);
    }
    setAlertCollisions(alert) {
        this.alertCollisions = alert;
    }
    isAlertingCollisions() {
        return this.alertCollisions;
    }
    addObject(obj) {
        this.set.push(obj);
    }
    removeFromSet(obj) {
        const index = this.set.indexOf(obj);
        if (index > -1) {
            this.set.splice(index, 1);
        }
    }
    moveToLast(obj) {
        this.removeFromSet(obj);
        this.addObject(obj);
    }
    update() {
        var _a;
        if (this.hasValidSelection()) {
            const xform = (_a = this.getSelectedObject()) === null || _a === void 0 ? void 0 : _a.xform;
            if (xform !== undefined) {
                if (mPublic$8.isKeyPressed(mPublic$8.keys.Up)) {
                    xform.incYPos(this.delta);
                }
                if (mPublic$8.isKeyPressed(mPublic$8.keys.Left)) {
                    xform.incXPos(-this.delta);
                }
                if (mPublic$8.isKeyPressed(mPublic$8.keys.Down)) {
                    xform.incYPos(-this.delta);
                }
                if (mPublic$8.isKeyPressed(mPublic$8.keys.Right)) {
                    xform.incXPos(this.delta);
                }
            }
        }
        for (let i = 0; i < this.set.length; i++) {
            const obj = this.set[i];
            obj.update();
            if (this.isAlertingCollisions() && obj.physicsComponent !== undefined) {
                obj.physicsComponent.boundsColor = [1.0, 1.0, 1.0, 1.0];
            }
        }
        if (this.isAlertingCollisions()) {
            for (let j = 0; j < this.size(); j++) {
                const theseBounds = this.getObjectAt(j).physicsComponent;
                for (let k = j + 1; k < this.size(); k++) {
                    const thoseBounds = this.getObjectAt(k).physicsComponent;
                    if (theseBounds !== undefined &&
                        thoseBounds !== undefined &&
                        collided(theseBounds, thoseBounds, CollisionInfo.Instance)) {
                        theseBounds.boundsColor = [1.0, 0.0, 0.0, 1.0];
                        thoseBounds.boundsColor = [1.0, 0.0, 0.0, 1.0];
                    }
                }
            }
        }
    }
    draw(camera) {
        for (let i = 0; i < this.set.length; i++) {
            this.set[i].draw(camera);
        }
    }
}

const numLayers = 5;
const allLayers = Array.from({ length: numLayers }, () => { return new GameObjectSet(); });
function cleanUp() {
    allLayers.map(() => { return new GameObjectSet(); });
}
function addToLayer(layer, obj) {
    allLayers[layer.valueOf()].addObject(obj);
}
function layerSize(layer) {
    return allLayers[layer.valueOf()].size();
}
// export function addAsShadowCaster(obj: GameObject) {
//     let i;
//     for (i = 0; i < layerSize(Layer.Shadows); i++) {
//         const receiver = allLayers[Layer.Shadows].getObjectAt(i) as ShadowReceiver;
//         receiver.addShadowCaster(obj);
//     }
// }
function drawLayer(layer, camera) {
    allLayers[layer.valueOf()].draw(camera);
}
function drawAllLayers(camera) {
    let i;
    for (i = 0; i < numLayers; i++) {
        allLayers[i].draw(camera);
    }
}
function moveToLayerFront(layer, obj) {
    allLayers[layer.valueOf()].moveToLast(obj);
}
function updateLayer(layer) {
    allLayers[layer.valueOf()].update();
}
function updateAllLayers() {
    let i;
    for (i = 0; i < allLayers.length; i++) {
        allLayers[i].update();
    }
}

class ParallaxTest extends Scene {
    constructor() {
        super(...arguments);
        this.bgSpriteTexture = "assets/bg.png";
        this.bgNormalTexture = "assets/bg_normal.png";
        this.layerSpriteTexture = "assets/bgLayer.png";
        this.layerNormalTexture = "assets/bgLayer_normal.png";
        this.minionSprite = "assets/minion_sprite.png";
        this.minionNormal = "assets/minion_sprite_normal.png";
        this.mainBgColor = [0.9, 0.9, 0.9, 1];
        this.heroBgColor = [0.5, 0.5, 0.9, 1];
    }
    loadScene() {
        mPublic$4.loadTexture(this.minionSprite);
        mPublic$4.loadTexture(this.minionNormal);
        mPublic$4.loadTexture(this.bgSpriteTexture);
        mPublic$4.loadTexture(this.bgNormalTexture);
        mPublic$4.loadTexture(this.layerSpriteTexture);
        mPublic$4.loadTexture(this.layerNormalTexture);
    }
    unloadScene() {
        cleanUp();
        mPublic$4.unloadTexture(this.minionSprite);
        mPublic$4.unloadTexture(this.minionNormal);
        mPublic$4.unloadTexture(this.bgSpriteTexture);
        mPublic$4.unloadTexture(this.bgNormalTexture);
        mPublic$4.unloadTexture(this.layerSpriteTexture);
        mPublic$4.unloadTexture(this.layerNormalTexture);
    }
    initialize() {
        this.mainCamera = new Camera(fromValues(50, 37.5), 100, [0, 0, 640, 480]);
        this.mainCamera.setBackgroundColor(this.mainBgColor);
        this.heroCamera = new Camera(fromValues(20, 30.5), 14, [0, 0, 128, 96], 2);
        this.heroCamera.setBackgroundColor(this.heroBgColor);
        this.hero = new Hero(this.minionSprite, this.minionNormal);
        addToLayer(2 /* layerManager.Layer.Actor */, this.hero);
        const bgTileRenderable = new IllumRenderable(this.bgSpriteTexture, this.bgNormalTexture);
        bgTileRenderable.setElementPixelCoordinates(0, 1024, 0, 1024);
        bgTileRenderable.xform.setSize(30, 30);
        bgTileRenderable.xform.setPosition(0, 0);
        bgTileRenderable.material.setSpecular([0.2, 0.1, 0.1, 1]);
        bgTileRenderable.material.setShininess(50);
        bgTileRenderable.xform.setZPos(-20);
        this.background = new ParallaxGameObject(bgTileRenderable, 5, this.mainCamera);
        this.background.currentFrontDir = [0, -1];
        this.background.speed = 0.1;
        addToLayer(0 /* layerManager.Layer.Background */, this.background);
        const layerTileRenderable = new IllumRenderable(this.layerSpriteTexture, this.layerNormalTexture);
        layerTileRenderable.xform.setSize(30, 30);
        layerTileRenderable.xform.setPosition(0, 0);
        layerTileRenderable.xform.setZPos(-10);
        layerTileRenderable.material.setSpecular([0.2, 0.2, 0.5, 1]);
        layerTileRenderable.material.setShininess(10);
        this.backLayer = new ParallaxGameObject(layerTileRenderable, 3, this.mainCamera);
        this.backLayer.currentFrontDir = [0, -1];
        this.backLayer.speed = 0.1;
        addToLayer(0 /* layerManager.Layer.Background */, this.backLayer);
        const frontLayerTile = new TextureRenderable(this.layerSpriteTexture);
        frontLayerTile.xform.setSize(30, 30);
        frontLayerTile.xform.setPosition(0, 0);
        this.frontLayer = new ParallaxGameObject(frontLayerTile, 0.9, this.mainCamera);
        addToLayer(3 /* layerManager.Layer.Foreground */, this.frontLayer);
    }
    spawnRandomMinion() {
        const minion = new Minion(this.minionSprite, this.minionNormal);
        const padding = 10;
        const minX = this.mainCamera.getWCLeft() + padding;
        const maxX = this.mainCamera.getWCRight() - padding;
        const minY = this.mainCamera.getWCTop() - padding;
        const maxY = this.mainCamera.getWCBottom() + padding;
        const randX = MathUtils.clamp(Math.random() * this.mainCamera.getWCWidth(), minX, maxX);
        const randY = MathUtils.clamp(Math.random() * this.mainCamera.getWCHeight(), maxY, minY);
        minion.xform.setPosition(randX, randY);
        addToLayer(2 /* layerManager.Layer.Actor */, minion);
    }
    restHeroPosition() {
        const wcCenter = this.mainCamera.getWCCenter();
        this.hero.xform.setPosition(wcCenter[0], wcCenter[1]);
    }
    update() {
        if (mPublic$8.isKeyClicked(mPublic$8.keys.M)) {
            this.spawnRandomMinion();
        }
        if (mPublic$8.isKeyClicked(mPublic$8.keys.R)) {
            this.restHeroPosition();
        }
        updateAllLayers();
        this.mainCamera.panWith(this.hero.xform, .85);
        this.mainCamera.update();
        this.heroCamera.update();
    }
    drawCamera(camera) {
        camera.setupViewProjection();
        drawAllLayers(camera);
    }
    draw() {
        core.clearCanvas(this.mainBgColor);
        this.drawCamera(this.mainCamera);
        this.drawCamera(this.heroCamera);
    }
}

function initEngine() {
    initializeEngineCore("GLCanvas", new ParallaxTest());
}
document.addEventListener("DOMContentLoaded", initEngine);

new (class {
    constructor() {
        this.collisionInfo = CollisionInfo.Instance;
        this.remainingLoops = 0;
        this.hasOneCollision = false;
        this._numRelaxationLoops = 15;
        this.relaxationOffset = 1 / this.numRelaxationLoops;
        this._posCorrectionRate = 0.8;
        this._systemAcceleration = fromValues(0, 0);
    }
    get relaxationCorrectionRate() {
        return this._posCorrectionRate;
    }
    set relaxationCorrectionRate(r) {
        if (r <= 0 || r >= 1) {
            r = 0.8;
        }
        this._posCorrectionRate = r;
    }
    get systemAcceleration() {
        return this._systemAcceleration;
    }
    set systemAcceleration(a) {
        copy(this._systemAcceleration, a);
    }
    get numRelaxationLoops() {
        return this._numRelaxationLoops;
    }
    set numRelaxationLoops(c) {
        if (c <= 0) {
            c = 1;
        }
        this.numRelaxationLoops = c;
        this.relaxationOffset = 1 / this.numRelaxationLoops;
    }
    positionalCorrection(s1, s2, collisionInfo) {
        const num = (collisionInfo.depth / (s1.invMass + s2.invMass)) *
            this.relaxationCorrectionRate;
        const correctionAmount = create();
        scale(correctionAmount, collisionInfo.normal, num);
        const ca = create();
        scale(ca, correctionAmount, s1.invMass);
        const s1Pos = s1.position;
        subtract(s1Pos, s1Pos, ca);
        scale(ca, correctionAmount, s2.invMass);
        const s2Pos = s2.position;
        add(s2Pos, s2Pos, ca);
    }
    applyFriction(n, v, f, m) {
        const tangent = fromValues(n[1], -n[0]);
        const tComponent = dot(v, tangent);
        if (Math.abs(tComponent) < 0.01) {
            return;
        }
        f *= m * this.relaxationOffset;
        if (tComponent < 0) {
            scale(tangent, tangent, -f);
        }
        else {
            scale(tangent, tangent, f);
        }
        sub(v, v, tangent);
    }
    resolveCollision(s1, s2, collisionInfo) {
        this.hasOneCollision = true;
        this.positionalCorrection(s1, s2, collisionInfo);
        this.applyFriction(collisionInfo.normal, s1.velocity, s1.friction, s1.invMass);
        this.applyFriction(collisionInfo.normal, s2.velocity, -s2.friction, s2.invMass);
        const relativeVelocity = create();
        sub(relativeVelocity, s2.velocity, s1.velocity);
        const velocityInNormal = dot(relativeVelocity, collisionInfo.normal);
        if (velocityInNormal > 0) {
            return;
        }
        const newRestitution = Math.min(s1.restitution, s2.restitution);
        let j = -(1 + newRestitution) * velocityInNormal;
        j = j / (s1.invMass + s2.invMass);
        const impulse = create();
        scale(impulse, collisionInfo.normal, j);
        const newImpulse = create();
        scale(newImpulse, impulse, s1.invMass);
        sub(s1.velocity, s1.velocity, newImpulse);
        scale(newImpulse, impulse, s2.invMass);
        add(s2.velocity, s2.velocity, newImpulse);
    }
    beginRelaxation() {
        this.remainingLoops = this.numRelaxationLoops;
        this.hasOneCollision = true;
    }
    continueRelaxation() {
        const oneCollision = this.hasOneCollision;
        this.hasOneCollision = false;
        this.remainingLoops--;
        return this.remainingLoops > 0 && oneCollision;
    }
    processObjObj(obj1, obj2) {
        const shape1 = obj1.physicsComponent;
        const shape2 = obj2.physicsComponent;
        if (shape1 === undefined || shape2 === undefined || shape1 === shape2) {
            return;
        }
        this.beginRelaxation();
        while (this.continueRelaxation()) {
            if (collided(shape1, shape2, this.collisionInfo)) {
                this.resolveCollision(shape1, shape2, this.collisionInfo);
            }
        }
    }
    processObjSet(obj, set) {
        const shape1 = obj.physicsComponent;
        if (shape1 === undefined) {
            return;
        }
        let i, shape2;
        this.beginRelaxation();
        while (this.continueRelaxation()) {
            for (i = 0; i < set.size(); i++) {
                shape2 = set.getObjectAt(i).physicsComponent;
                if (shape2 !== undefined &&
                    shape1 !== shape2 &&
                    collided(shape1, shape2, this.collisionInfo)) {
                    this.resolveCollision(shape1, shape2, this.collisionInfo);
                }
            }
        }
    }
    processSetSet(set1, set2) {
        let shape1, shape2, i, j;
        this.beginRelaxation();
        while (this.continueRelaxation) {
            for (i = 0; i < set1.size(); i++) {
                shape1 = set1.getObjectAt(i).physicsComponent;
                if (shape1 !== undefined) {
                    for (j = 0; j < set2.size(); j++) {
                        shape2 = set2.getObjectAt(j).physicsComponent;
                        if (shape2 !== undefined &&
                            shape1 !== shape2 &&
                            collided(shape1, shape2, this.collisionInfo)) {
                            this.resolveCollision(shape1, shape2, this.collisionInfo);
                        }
                    }
                }
            }
        }
    }
})();

new (class {
    constructor() {
        this.systemAcceleration = fromValues(-100, -40);
    }
    resolveParticleCollision(shape, particle) {
        if (!shape.containsPos(particle.position)) {
            return;
        }
        const pVec = create();
        subtract(pVec, particle.position, shape.position);
        shape.projectToEdge(pVec);
        add(particle.position, shape.position, pVec);
    }
    processObjSet(obj, set) {
        let i;
        const shape = obj.physicsComponent;
        for (i = 0; i < set.size(); i++) {
            this.resolveParticleCollision(shape, set.getObjectAt(i).physicsComponent);
        }
    }
    processSetSet(objSet, partSet) {
        let i;
        for (i = 0; i < objSet.size(); i++) {
            this.processObjSet(objSet.getObjectAt(i), partSet);
        }
    }
})();

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class SpriteAnimateRenderable extends SpriteRenderable {
    constructor(texture) {
        super(texture);
        this.firstElmLeft = 0.0;
        this.elmTop = 1.0;
        this.elmWidth = 1.0;
        this.elmHeight = 1.0;
        this.widthPadding = 0.0;
        this.numElems = 1;
        this.animationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;
        this.updateInterval = 1;
        this.currentElem = 0;
        this.currentAnimAdvance = -1.0;
        this.currentTick = 0;
        this._initAnimation();
    }
    setAnimationType(animationType) {
        this.animationType = animationType;
        this.currentElem = -2;
        this.currentAnimAdvance = -1;
        this._initAnimation();
    }
    _initAnimation() {
        this.currentTick = 0;
        switch (this.animationType) {
            case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
                this.currentElem = 0;
                this.currentAnimAdvance = 1;
                break;
            case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
                this.currentElem = this.numElems - 1;
                this.currentAnimAdvance = -1;
                break;
            // Assumes that currentElem is just out of bounds on either side
            // 2*animAdvance brings currentElem back inBounds, skipping the first
            // and last frames to avoid rendering the same frame twice
            case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
                this.currentAnimAdvance = -1 * this.currentAnimAdvance;
                this.currentElem += 2 * this.currentAnimAdvance;
                break;
        }
        this._setSpriteElement();
    }
    _setSpriteElement() {
        const left = this.firstElmLeft +
            this.currentElem * (this.elmWidth + this.widthPadding);
        this.setElementUVCoordinates(left, left + this.elmWidth, this.elmTop - this.elmHeight, this.elmTop);
    }
    setSpriteSequence(topPixel, leftPixel, elementWidthPx, elementHeightPx, numElements, widthPaddingPx) {
        const texInfo = mPublic$7.retrieveAsset(this.texture);
        const imgHeight = texInfo.height;
        const imgWidth = texInfo.width;
        this.firstElmLeft = leftPixel / imgWidth;
        this.elmTop = topPixel / imgHeight;
        this.elmWidth = elementWidthPx / imgWidth;
        this.elmHeight = elementHeightPx / imgHeight;
        this.numElems = numElements;
        this.widthPadding = widthPaddingPx / imgWidth;
        this._initAnimation();
    }
    setAnimationSpeed(tickInterval) {
        this.updateInterval = tickInterval;
    }
    incAnimationSpeed(delta) {
        this.updateInterval += delta;
    }
    update() {
        this.currentTick++;
        if (this.currentTick % this.updateInterval === 0) {
            this.currentElem += this.currentAnimAdvance;
            if (this.currentElem >= 0 && this.currentElem < this.numElems) {
                this._setSpriteElement();
            }
            else {
                this._initAnimation();
            }
        }
    }
}
SpriteAnimateRenderable.eAnimationType = Object.freeze({
    eAnimateRight: 0,
    eAnimateLeft: 1,
    eAnimateSwing: 2,
});

export { addToLayer, cleanUp, collided, drawAllLayers, drawLayer, initializeEngineCore, layerSize, moveToLayerFront, startScene, updateAllLayers, updateLayer };
//# sourceMappingURL=multi-entry.js.map
