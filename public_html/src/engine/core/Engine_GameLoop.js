/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import input from "./Engine_Input.js";
import resourceMap from "./resources/Engine_ResourceMap.js";

export default (function() {
   
    var kFPS = 60;
    var kMPF = 1000 / kFPS;

    var mPreviousTime;
    var mLagTime;
    var mCurrentTime;
    var mElapsedTime;
    
    var mIsLoopRunning;

    var mMyGame;

    var _runLoop = function() {
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

    var _startLoop = function() {
        mPreviousTime = Date.now();
        mLagTime = 0.0;
        mCurrentTime = Date.now();
        mElapsedTime = 0;

        mIsLoopRunning = true;

        requestAnimationFrame(function () {
            _runLoop.call(mMyGame);
        });
    };

    var start = function (myGame) {
        mMyGame = myGame;
        resourceMap.setLoadCompletedCallback(
                function() {
                    mMyGame.initialize();
                    _startLoop();
                });
    };

    var stop = function() {
        mIsLoopRunning = false;
    }

    var mPublic = {
        start: start,
        stop: stop,
    }; //public methods go here

    return mPublic;
}());