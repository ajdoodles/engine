/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export default function MathUtils() {
};

MathUtils.clamp = function(value:number, min:number, max:number) {
    return Math.max(Math.min(value, max), min);
};

MathUtils.lerp = function(start:number, end:number, value:number) {
    return start + ((end - start) * value);
};