/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { vec4 } from "../../gl-matrix/esm/index.js";

function Material(
        ambient = vec4.fromValues(0.0, 0.0, 0.0, 0.0),
        diffuse = vec4.fromValues(0.2, 0.2, 0.2, 1.0),
        specular = vec4.fromValues(1.0, 1.0, 1.0, 1.0),
        shininess = 20) {
    this.mAmbient = ambient;
    this.mDiffuse = diffuse;
    this.mSpecular = specular;
    this.mShininess = shininess;
}

Material.prototype.getAmbient = function () {
    return this.mAmbient;
};
Material.prototype.setAmbient = function (ambient) {
    vec4.copy(this.mAmbient, ambient);
};

Material.prototype.getDiffuse = function () {
    return this.mDiffuse;
};
Material.prototype.setDiffuse = function (diffuse) {
    vec4.copy(this.mDiffuse, diffuse);
};

Material.prototype.getSpecular = function () {
    return this.mSpecular;
};
Material.prototype.setSpecular = function (specular) {
    vec4.copy(this.mSpecular, specular);
};

Material.prototype.getShininess = function () {
    return this.mShininess;
};
Material.prototype.setShininess = function (shininess) {
    this.mShininess = shininess;
};