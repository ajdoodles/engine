/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import Scene from "../Scene.js";
import input from "./Engine_Input.js";
import resourceMap from "./resources/Engine_ResourceMap.js";
   
const kFPS = 60;
const kMPF = 1000 / kFPS;

let mPreviousTime: number;
let mLagTime: number;
let mCurrentTime;
let mElapsedTime;

let mIsLoopRunning: boolean;

let mMyGame: Scene;

const _runLoop = function(this: Scene ) {
    if (mIsLoopRunning) {
        requestAnimationFrame( function(){_runLoop.call(mMyGame);} );
        
        mCurrentTime = Date.now();
        mElapsedTime = mCurrentTime - mPreviousTime;
        mPreviousTime = mCurrentTime;
        mLagTime += mElapsedTime;
        
        while (mIsLoopRunning && (mLagTime > kMPF)) {
            input.update();
            this.update();
            mLagTime -= kMPF;
        }
        
        this.draw();
    } else {
        mMyGame.unloadScene();
    }
};    

const _startLoop = function() {
    mPreviousTime = Date.now();
    mLagTime = 0.0;
    mCurrentTime = Date.now();
    mElapsedTime = 0;

    mIsLoopRunning = true;

    requestAnimationFrame(function () {
        _runLoop.call(mMyGame);
    });
};

const start = function (myGame: Scene) {
    mMyGame = myGame;
    resourceMap.setLoadCompletedCallback(
            function() {
                mMyGame.initialize();
                _startLoop();
            });
};

const stop = function() {
    mIsLoopRunning = false;
}

const mPublic = {
    start: start,
    stop: stop,
}; //public methods go here

export default mPublic;