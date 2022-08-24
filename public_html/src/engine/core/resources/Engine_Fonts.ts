/*
 * File: EngineCore_Fonts.js 
 * Provides support for loading and unloading of font image and font description
 */

/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, XMLHttpRequest: false, DOMParser: false, alert: false, XPathResult: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import textures from "../Engine_Textures.js";
import textFileLoader from "./Engine_TextFileLoader.js";
import resourceMap from "./Engine_ResourceMap.js";
import TextureInfo from "../TextureInfo.js";

// for convenenit communication of per-character information
// all size returned are in normalize unit (range between 0 to 1)
class CharacterInfo {
  // in texture coordinate (0 to 1) maps to the entire image
    mTexCoordLeft = 0;
    mTexCoordRight = 1;
    mTexCoordBottom = 0;
    mTexCoordTop = 1;

    // reference to nominal character size, 1 is "standard width/height" of a char
    mCharWidth = 1;
    mCharHeight = 1;
    mCharWidthOffset = 0;
    mCharHeightOffset = 0;

    // reference of char width/height ratio
    mCharAspectRatio = 1;
}

// Note: font name is the path to the fnt file. (without the fnt extension!)
//    You must also provide the image file in the exact same folder
//    with the exact same name, with ".png" extension.

    
const _storeLoadedFont = function (fontInfoSourceString: string) {
    const fontName = fontInfoSourceString.slice(0, -4);  // trims the .fnt extension
    const fontInfo = resourceMap.retrieveAsset(fontInfoSourceString) as Document;
    Object.defineProperty(fontInfo, "fontImage", {value: fontName + ".png"});
    resourceMap.asyncLoadCompleted(fontName, fontInfo); // to store the actual font info
};

const loadFont = function (fontName:string) {
    if (!(resourceMap.isAssetLoaded(fontName))) {
        const fontInfoSourceString = fontName + ".fnt";
        const textureSourceString = fontName + ".png";

        resourceMap.asyncLoadRequested(fontName); // to register an entry in the map

        textures.loadTexture(textureSourceString);
        textFileLoader.loadTextFile(fontInfoSourceString,
                        textFileLoader.eTextFileType.eXMLFile, _storeLoadedFont);
    } else {
        resourceMap.incAssetRefCount(fontName);
    }
};

// Remove the reference to allow associated memory 
// be available for subsequent garbage collection
const unloadFont = function (fontName:string) {
    resourceMap.unloadAsset(fontName);
    if (!(resourceMap.isAssetLoaded(fontName))) {
        const fontInfoSourceString = fontName + ".fnt";
        const textureSourceString = fontName + ".png";

        textures.unloadTexture(textureSourceString);
        textFileLoader.unloadTextFile(fontInfoSourceString);
    }
};

const getCharInfo = function (fontName:string, aChar:number) {
    let returnInfo = null;
    const fontInfo = resourceMap.retrieveAsset(fontName) as Document & {fontImage:string};
    const commonPath = "font/common";
    const commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    const commonElem = commonInfo.iterateNext() as Element;
    if (commonElem === null) {
        return returnInfo;
    }
    const charHeight = Number.parseInt(commonElem.getAttribute("base") as string);

    const charPath = "font/chars/char[@id=" + aChar + "]";
    const charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    const charElem = charInfo.iterateNext() as Element;

    if (charElem === null) {
        return returnInfo;
    }

    returnInfo = new CharacterInfo();
    const texInfo = textures.getTextureInfo(fontInfo.fontImage) as TextureInfo;
    const leftPixel = Number(charElem.getAttribute("x"));
    const rightPixel = leftPixel + Number(charElem.getAttribute("width")) - 1;
    const topPixel = (texInfo.height - 1) - Number(charElem.getAttribute("y"));
    const bottomPixel = topPixel - Number(charElem.getAttribute("height")) + 1;

    // texture coordinate information
    returnInfo.mTexCoordLeft = leftPixel / (texInfo.width - 1);
    returnInfo.mTexCoordTop = topPixel / (texInfo.height - 1);
    returnInfo.mTexCoordRight = rightPixel / (texInfo.width - 1);
    returnInfo.mTexCoordBottom = bottomPixel / (texInfo.height - 1);

    // relative character size
    const charWidth = Number.parseInt(charElem.getAttribute("xadvance") as string);
    returnInfo.mCharWidth = Number.parseInt(charElem.getAttribute("width") as string) / charWidth;
    returnInfo.mCharHeight = Number.parseInt(charElem.getAttribute("height") as string) / charHeight;
    returnInfo.mCharWidthOffset = Number.parseInt(charElem.getAttribute("xoffset") as string) / charWidth;
    returnInfo.mCharHeightOffset = Number.parseInt(charElem.getAttribute("yoffset") as string) / charHeight;
    returnInfo.mCharAspectRatio = charWidth / charHeight;

    return returnInfo;
};

// Public interface for this object. Anything not in here will
// not be accessable.
const mPublic = {
    loadFont: loadFont,
    unloadFont: unloadFont,
    getCharInfo: getCharInfo
};
export default mPublic;