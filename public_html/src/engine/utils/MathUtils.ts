/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export default abstract class MathUtils {

    static clamp(value:number, min:number, max:number):number {
        return Math.max(Math.min(value, max), min);
    }

    static lerp(start:number, end:number, value:number):number {
        return start + ((end - start) * value);
    }
}