"use strict";
import { initializeEngineCore } from "../engine/core/Engine_Init.js";
import Asteroids from "./scenarios/Asteroids.js";

function initEngine() {
  initializeEngineCore("GLCanvas", new Asteroids());
}

document.addEventListener("DOMContentLoaded", initEngine);
