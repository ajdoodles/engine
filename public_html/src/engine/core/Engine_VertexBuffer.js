/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var gEngine = gEngine || {};

gEngine.VertexBuffer = (function(){
    var mVerticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0];
    
    var mTextureCoordinates = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0];
    
    var mSquareVertexBuffer = null;
    var mTextureCoordinateBuffer = null;
    
    var getGLVertexRef = function() {
        return mSquareVertexBuffer;
    };
    
    var getGLTexCoordRef = function() {
        return mTextureCoordinateBuffer;
    };
    
    var initialize = function() {
        var gl = gEngine.Core.getGL();
        
        mSquareVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
        
        mTextureCoordinateBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mTextureCoordinateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoordinates), gl.STATIC_DRAW);
    };
    
    var mPublic = {
       getGLVertexRef: getGLVertexRef,
       getGLTexCoordRef: getGLTexCoordRef,
       initialize: initialize,
    }; 
    
    return mPublic;
}());