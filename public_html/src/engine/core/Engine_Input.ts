/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import { vec2 } from "gl-matrix";

const kKeys : {[index: string]: number} = {
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

    LastKeyCode: 222
};

const mKeyPreviousState : {[index:number]: boolean} = [];
const mIsKeyPressed : {[index:number]: boolean} = [];
const mIsKeyClicked : {[index:number]: boolean} = [];

const kMouse : {[index: string]: number} = {
    Left: 0,
    Middle: 1, 
    Right: 2,
};

const mMousePreviousState: {[index:number]: boolean} = [];
const mIsMousePressed: {[index:number]: boolean} = [];
const mIsMouseClicked: {[index:number]: boolean} = [];

let mMouseX = -1;
let mMouseY = -1;

let mCanvas: HTMLCanvasElement;

const _reverseKeyLookup = function(keyCode:number) : string {
    for (const key in kKeys) {
        if (keyCode === kKeys[key]) {
            return key;
        }
    }
    throw "COULDN'T REVERSE LOOKUP FOR KEYCODE " + keyCode;
};

const _reverseMouseLookup = function(buttonCode:number) :string {
    for (const button in kMouse) {
        if (buttonCode === kMouse[button]) {
            return button;
        }
    }
    throw "COULDN'T REVERSE LOOKUP FOR MOUSECODE " + buttonCode;
};

const _logInputEvent = function(eventString:string, button: string) {
    console.log(eventString + " fired with " + button + " button.");
};

const _onKeyDown = function (event: KeyboardEvent) {
    _logInputEvent("KEYDOWN", _reverseKeyLookup(event.keyCode));
    mIsKeyPressed[event.keyCode] = true;
};

const _onKeyUp = function (event: KeyboardEvent) {
    _logInputEvent("KEYUP", _reverseKeyLookup(event.keyCode));
    mIsKeyPressed[event.keyCode] = false;
};

const _onMouseDown = function (event: MouseEvent) {
    _logInputEvent("MOUSEDOWN", _reverseMouseLookup(event.button));
    if (_onMouseMove(event)) {
        mIsMousePressed[event.button] = true;            
    }
};

const _onMouseUp = function (event: MouseEvent) {
    _logInputEvent("MOUSEUP", _reverseMouseLookup(event.button));
    _onMouseMove(event);
    mIsMousePressed[event.button] = false;
};

const _onMouseMove = function (event: { clientX: number; clientY: number; }) {
    let inside = false;
    
    const canvasBounds = mCanvas.getBoundingClientRect();
    
    // Apparently rendered canvas elements can be different from the element's
    // reported height and/or width so the values need to be scaled. 
    const x = 
        Math.round(
            event.clientX - canvasBounds.left 
            * (mCanvas.height/canvasBounds.height));
    const y = 
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

const _cancelContextMenu = function(event: { stopPropagation: () => void; preventDefault: () => void; }) {
    _logInputEvent("CONTEXTMENU", "Right");
    if (typeof event.stopPropagation === 'function') {
        event.stopPropagation();
    }
    if (typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    return false;
};

const initialize = function (htmlCanvasID: string) {
    mCanvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
    
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

    window.addEventListener('contextmenu', _cancelContextMenu);
    window.addEventListener('keyup', _onKeyUp);
    window.addEventListener('keydown', _onKeyDown);
    window.addEventListener('mouseup', _onMouseUp);
    window.addEventListener('mousedown', _onMouseDown);
    window.addEventListener('mousemove', _onMouseMove);
};

const update = function() {
    let i;
    for (i = 0; i < kKeys.LastKeyCode; i++) {
        mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i]; // the wrong thing is being negated here
        mKeyPreviousState[i] = mIsKeyPressed[i];
    }
    let j;
    for (j = 0; j <= kMouse.Right; j++) {
        mIsMouseClicked[j] = !mMousePreviousState[j] && mIsMousePressed[j];
        mMousePreviousState[j] = mIsMousePressed[j];
    }
};

const isKeyPressed = function(keyCode:  number) {
    return mIsKeyPressed[keyCode];
};

const isKeyClicked = function(keyCode: number) {
    return mIsKeyClicked[keyCode];
};

const isMousePressed = function(keyCode:  number) {
    return mIsMousePressed[keyCode];
};

const isMouseClicked = function(keyCode: number) {
    return mIsMouseClicked[keyCode];
};

const getMousePosition = function() {
    return vec2.fromValues(mMouseX, mMouseY);
};

const mPublic = {
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

export default mPublic;