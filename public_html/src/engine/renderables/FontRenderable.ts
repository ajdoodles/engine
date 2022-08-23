/*
 * File: FontRenderable.js 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */


// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import defaultResources from "../core/resources/Engine_DefaultResources.js";
import fonts from "../core/resources/Engine_Fonts.js";
import SpriteRenderable from "./SpriteRenderable.js";
import Transform from "../utils/Transform.js";
import Camera from "../cameras/Camera.js";

export default class FontRenderable {
    font: string;
    oneChar: SpriteRenderable;
    xform: Transform;
    text: string; 
    
    constructor(aString:string) {
        this.font = defaultResources.getDefaultFont();
        this.oneChar = new SpriteRenderable(this.font + ".png");
        this.xform = new Transform(); // transform that moves this object around
        this.text = aString;
    }

    //<editor-fold desc="Public Methods">
    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------
    draw (camera: Camera) {
        // we will draw the text string by calling to oneChar for each of the
        // chars in the text string.
        const widthOfOneChar = this.xform.getWidth() / this.text.length;
        const heightOfOneChar = this.xform.getHeight();
        // this.oneChar.getXform().SetRotationInRad(this.xform.getRotationInRad());
        const yPos = this.xform.getYPos();
    
    // center position of the first char
        let xPos = this.xform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
        let charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
        for (charIndex = 0; charIndex < this.text.length; charIndex++) {
            aChar = this.text.charCodeAt(charIndex);
            charInfo = fonts.getCharInfo(this.font, aChar);

            if (charInfo === null) {
                throw "COULDN'T GET CHARINFO FOR " + aChar;
            }

            // set the texture coordinate
            this.oneChar.setElementUVCoordinates(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
                charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

            // now the size of the char
            xSize = widthOfOneChar * charInfo.mCharWidth;
            ySize = heightOfOneChar * charInfo.mCharHeight;
            this.oneChar.getXform().setSize(xSize, ySize);

            // how much to offset from the center
            xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
            yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

            this.oneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

            this.oneChar.draw(camera);

            xPos += widthOfOneChar;
        }
    };

    getXform () { return this.xform; };
    getText () { return this.text; };
    setText (t: string) {
        this.text = t;
        this.setTextHeight(this.getXform().getHeight());
    };
    setTextHeight (h: number) {
        const charInfo = fonts.getCharInfo(this.font, "A".charCodeAt(0)); // this is for "A"
        if (charInfo === null) {
            throw "COULDN'T GET CHARACTER INFO FOR A";
        }
        const w = h * charInfo.mCharAspectRatio;
        this.getXform().setSize(w * this.text.length, h);
    };


    getFont () { return this.font; };
    setFont (f: string) {
        this.font = f;
        this.oneChar.setTexture(this.font + ".png");
    };

    setColor (c: color) { this.oneChar.setColor(c); };
    getColor () { return this.oneChar.getColor(); };
    //--- end of Public Methods
    //</editor-fold>
}