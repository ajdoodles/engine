/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import resourceMap from "./Engine_ResourceMap.js";

const eTextFileType = Object.freeze({
    eXMLFile: 0,
    eTextFile: 1,
});

const loadTextFile = function (fileName:string, fileType:number, callback?:(a:string) => void) {
    if (resourceMap.isAssetLoaded(fileName)) {
        if (callback !== null && callback !== undefined) {
            callback(fileName);
        }
        return;
    }

    resourceMap.asyncLoadRequested(fileName);

    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status !== 200) {
            alert("loading failed: " + fileName + "[see hint]");
        }
    };
    req.open('GET', fileName, true);
    req.setRequestHeader('Content-Type', 'text/plain');

    req.onload = function () {
        let fileContent = null;
        if (fileType === eTextFileType.eXMLFile) {
            const parser = new DOMParser();
            fileContent = parser.parseFromString(req.responseText, "text/xml");
        } else {
            fileContent = req.responseText;
        }
        
        resourceMap.asyncLoadCompleted(fileName, fileContent);
        if (callback !== null && callback !== undefined) {
            callback(fileName);
        }
    };

    req.send();
};

const unloadTextFile = function(fileName : string) {
    resourceMap.unloadAsset(fileName);
};

const mPublic = {
    loadTextFile: loadTextFile,
    unloadTextFile: unloadTextFile,
    eTextFileType: eTextFileType,
};

export default mPublic;