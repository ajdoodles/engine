/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Scene() { /* constructor */ }

//Called from Engine_Core's startScene
Scene.prototype.loadScene = function() { };
Scene.prototype.unloadScene = function() { };

// Called by the game loop after all resources are loaded (defined in loadscene)
Scene.prototype.initialize = function() { };
Scene.prototype.update = function() { };
Scene.prototype.draw = function() { };