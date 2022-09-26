/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

import TextureInfo from "../TextureInfo";

type AssetType = string | Document | TextureInfo | AudioBuffer;
class MapEntry {
  asset: AssetType;
  refCount = 1;
  constructor(name: string) {
    this.asset = name;
  }
}

const mResourceMap: { [index: string]: MapEntry } = {};
let mNumOutstandingLoads = 0;
let mLoadCompletedCallback: null | (() => void);

const _checkForAllLoadCompleted = function () {
  if (mNumOutstandingLoads === 0 && mLoadCompletedCallback !== null) {
    const callback = mLoadCompletedCallback;
    mLoadCompletedCallback = null;
    callback();
  }
};

const setLoadCompletedCallback = function (callback: () => void) {
  mLoadCompletedCallback = callback;
  _checkForAllLoadCompleted();
};

const asyncLoadRequested = function (resourceName: string) {
  mResourceMap[resourceName] = new MapEntry(resourceName);
  ++mNumOutstandingLoads;
};

const asyncLoadCompleted = function (
  resourceName: string,
  loadedAsset: AssetType
) {
  if (!isAssetLoaded(resourceName)) {
    alert("gEngine.asyncLoadCompleted: [" + resourceName + "] not in map!");
  }
  mResourceMap[resourceName].asset = loadedAsset;
  --mNumOutstandingLoads;
  _checkForAllLoadCompleted();
};

const incAssetRefCount = function (resourceName: string) {
  mResourceMap[resourceName].refCount++;
};

const isAssetLoaded = function (resourceName: string): boolean {
  return resourceName in mResourceMap;
};

const retrieveAsset = function (resourceName: string) {
  let resource = null;
  if (isAssetLoaded(resourceName)) {
    resource = mResourceMap[resourceName].asset;
  }
  return resource;
};

const unloadAsset = function (resourceName: string) {
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

const mPublic = {
  setLoadCompletedCallback: setLoadCompletedCallback,
  asyncLoadRequested: asyncLoadRequested,
  asyncLoadCompleted: asyncLoadCompleted,

  incAssetRefCount: incAssetRefCount,
  isAssetLoaded: isAssetLoaded,
  retrieveAsset: retrieveAsset,
  unloadAsset: unloadAsset,
};

export default mPublic;
