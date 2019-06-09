/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var gEngine = gEngine || {};

gEngine.Input = (function () {
    var kKeys = {
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
        Five: 53,
        Six: 54,
        Seven: 55,
        Eight: 56,
        Nine: 57,

        // Alphabets
        A: 65,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        W: 87,
        Y: 89,

        LastKeyCode: 222
    };
    
    var mKeyPreviousState = [];
    var mIsKeyPressed = [];
    var mIsKeyClicked = [];

    var kMouse = {
        Left: 0,
        Middle: 1, 
        Right: 2,
    };

    var mMousePreviousState = [];
    var mIsMousePressed = [];
    var mIsMouseClicked = [];

    var mMouseX = -1;
    var mMouseY = -1;
    
    var mCanvas = null;

    var _reverseKeyLookup = function(keyCode) {
        for (var key in kKeys) {
            if (keyCode === kKeys[key]) {
                return key;
            }
        }
    };

    var _reverseMouseLookup = function(buttonCode) {
        for (var button in kMouse) {
            if (buttonCode === kMouse[button]) {
                return button;
            }
        }
    };

    var _logInputEvent = function(eventString, button) {
        console.log(eventString + " fired with " + button + " button.");
    };

    var _onKeyDown = function (event) {
        _logInputEvent("KEYDOWN", _reverseKeyLookup(event.keyCode));
        mIsKeyPressed[event.keyCode] = true;
    };

    var _onKeyUp = function (event) {
        _logInputEvent("KEYUP", _reverseKeyLookup(event.keyCode));
        mIsKeyPressed[event.keyCode] = false;
    };

    var _onMouseDown = function (event) {
        _logInputEvent("MOUSEDOWN", _reverseMouseLookup(event.button));
        if (_onMouseMove(event)) {
            mIsMousePressed[event.button] = true;            
        }
    };
    
    var _onMouseUp = function (event) {
        _logInputEvent("MOUSEUP", _reverseMouseLookup(event.button));
        _onMouseMove(event);
        mIsMousePressed[event.button] = false;
    };
    
    var _onMouseMove = function (event) {
        var inside = false;
        
        var canvasBounds = mCanvas.getBoundingClientRect();
        
        // Apparently rendered canvas elements can be different from the element's
        // reported height and/or width so the values need to be scaled. 
        var x = 
            Math.round(
                event.clientX - canvasBounds.left 
                * (mCanvas.height/canvasBounds.height));
        var y = 
            Math.round(
                event.clientY - canvasBounds.top 
                * (mCanvas.width/canvasBounds.width));
        
        if (x >= 0 && y >= 0 && x < mCanvas.width && y < mCanvas.height) {
            mMouseX = x;
            mMouseY = mCanvas.height - y - 1;
            inside = true;
        }
        
        return inside;
    };
 
    var _cancelContextMenu = function(event) {
        _logInputEvent("CONTEXTMENU", "Right");
        if (typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        if (typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        return false;
    };
 
    var initialize = function (htmlCanvasID) {
        mCanvas = document.getElementById(htmlCanvasID);
        
        var i;
        for (i = 0; i < kKeys.LastKeyCode; i++) {
            mKeyPreviousState[i] = false;
            mIsKeyPressed[i] = false;
            mIsKeyClicked[i] = false;
        }
        
        var j;
        for (j = 0; j <= kMouse.Right; j++) {
            mMousePreviousState[j] = false;
            mIsMousePressed[j] = false;
            mIsMouseClicked[j] = false;
        }

        window.addEventListener('contextmenu', _cancelContextMenu);
        window.addEventListener('keyup', _onKeyUp);
        window.addEventListener('keydown', _onKeyDown);
        window.addEventListener('mouseup', _onMouseUp);
        window.addEventListener('mousedown', _onMouseDown);
        window.addEventListener('mousemove', _onMouseMove);
    };
    
    var update = function() {
        var i;
        for (i = 0; i < kKeys.LastKeyCode; i++) {
            mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i]; // the wrong thing is being negated here
            mKeyPreviousState[i] = mIsKeyPressed[i];
        }
        var j;
        for (j = 0; j <= kMouse.Right; j++) {
            mIsMouseClicked[j] = !mMousePreviousState[j] && mIsMousePressed[j];
            mMousePreviousState[j] = mIsMousePressed[j];
        }
    };

    var isKeyPressed = function(keyCode) {
        return mIsKeyPressed[keyCode];
    };
    
    var isKeyClicked = function(keyCode) {
        return mIsKeyClicked[keyCode];
    };

    var isMousePressed = function(keyCode) {
        return mIsMousePressed[keyCode];
    };
    
    var isMouseClicked = function(keyCode) {
        return mIsMouseClicked[keyCode];
    };

    var getMousePosition = function() {
        return vec2.fromValues(mMouseX, mMouseY);
    };

    var mPublic = {
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
    
    return mPublic;
}());