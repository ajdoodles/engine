/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var gEngine = gEngine || {};

gEngine.ResourceMap = (function() {
    var MapEntry = function(name) {
        this.mAsset = name;
        this.mRefCount = 1;
    };
   
    var mResourceMap = {};
    var mNumOutstandingLoads = 0;
    var mLoadCompletedCallback = null;
    
    var _checkForAllLoadCompleted = function() {
        if (mNumOutstandingLoads === 0 && mLoadCompletedCallback !== null) {
            var callback = mLoadCompletedCallback;
            mLoadCompletedCallback = null;
            callback();
        }
    };
    
    var setLoadCompletedCallback = function(callback) {
        mLoadCompletedCallback = callback;
        _checkForAllLoadCompleted();
    };
    
    var asyncLoadRequested = function(resourceName) {
        mResourceMap[resourceName] = new MapEntry(resourceName);
        ++mNumOutstandingLoads;
    };
    
    var asyncLoadCompleted = function(resourceName, loadedAsset) {
        if (!isAssetLoaded(resourceName)) {
            alert("gEngine.asyncLoadCompleted: [" + resourceName + "] not in map!");
        }
        mResourceMap[resourceName].mAsset = loadedAsset;
        --mNumOutstandingLoads;
        _checkForAllLoadCompleted();
    };
    
    var incAssetRefCount = function(resourceName) {
        mResourceMap[resourceName].mRefCount++;
    }

    var isAssetLoaded = function (resourceName) {
        return (resourceName in mResourceMap);
    };

    var retrieveAsset = function (resourceName) {
        var resource = null;
        if (isAssetLoaded(resourceName)) {
            resource = mResourceMap[resourceName].mAsset;
        }
        return resource;
    };

    var unloadAsset = function (resourceName) {
        var refCount = 0;
        if (isAssetLoaded(resourceName)) {
            mResourceMap[resourceName].mRefCount--;
            refCount = mResourceMap[resourceName].mRefCount;
            if (refCount <= 0) {
                delete mResourceMap[resourceName];
            }
        }
        return refCount;
    };

    var mPublic = {
        setLoadCompletedCallback: setLoadCompletedCallback,
        asyncLoadRequested: asyncLoadRequested,
        asyncLoadCompleted: asyncLoadCompleted,
        
        incAssetRefCount: incAssetRefCount,
        isAssetLoaded: isAssetLoaded,
        retrieveAsset: retrieveAsset,
        unloadAsset: unloadAsset,
    };
    
    return mPublic;
}());