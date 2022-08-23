/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export default function LightSet() {
    this.mLights = [];
};

LightSet.prototype.numLights = function () {
    return this.mLights.length;
};
LightSet.prototype.getLightAt = function (index) {
    return this.mLights[index];
};
LightSet.prototype.addLight = function (light) {
    this.mLights.push(light);
};