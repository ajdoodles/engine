/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
import resourceMap from "./Engine_ResourceMap.js";

export default (function() {
    var eTextFileType = Object.freeze({
       eXMLFile: 0,
       eTextFile: 1,
    });
    
    var loadTextFile = function (fileName, fileType, callback) {
        if (resourceMap.isAssetLoaded(fileName)) {
            if (callback !== null && callback !== undefined) {
                callback(fileName);
            }
            return;
        }

        resourceMap.asyncLoadRequested(fileName);

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status !== 200) {
                alert("loading failed: " + fileName + "[see hint]");
            }
        };
        req.open('GET', fileName, true);
        req.setRequestHeader('Content-Type', 'text/plain');

        req.onload = function () {
            var fileContent = null;
            if (fileType === eTextFileType.eXMLFile) {
                var parser = new DOMParser();
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
    
    var unloadTextFile = function(fileName) {
        resourceMap.unloadAsset(fileName);
    };
    
    var mPublic = {
        loadTextFile: loadTextFile,
        unloadTextFile: unloadTextFile,
        eTextFileType: eTextFileType,
    };
    
    return mPublic;
}());