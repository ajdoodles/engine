/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GameObject from "../../engine/gameobjects/GameObject.js";
import SpriteRenderable from "../../engine/renderables/SpriteRenderable.js";

export default class DyePack extends GameObject {
    refWidth: number;
    refHeight: number;
    
    constructor(spriteTexture:string) {
        const refWidth = 80;
        const refHeight = 130;

        const dyePack = new SpriteRenderable(spriteTexture);
        dyePack.setColor([1, 1, 1, 0.1]);
        dyePack.getXform().setSize(refWidth / 25, refHeight / 25);
        dyePack.getXform().setPosition(50, 33);
        dyePack.setElementPixelCoordinates(510, 595, 23, 153);
        super(dyePack);

        this.refWidth = refHeight;
        this.refHeight = refHeight;
    }
}