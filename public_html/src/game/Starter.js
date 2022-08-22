"use strict"
import RigidShapeTest from "./scenarios/RigidShapeTest.js";
import ShaderFactory from "../engine/shaders/ShaderFactory.js";
import core from "../engine/core/Engine_Core.js";

function startGame() {
    let myGame = new RigidShapeTest();
    core.initializeEngineCore('GLCanvas', myGame, ShaderFactory.createShaders);
}

document.addEventListener("DOMContentLoaded", startGame);