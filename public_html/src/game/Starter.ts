"use strict";
import { initializeEngineCore } from "../engine/core/Engine_Init.js";
import CollisionTest from "./scenarios/CollisionTest.js";

function initEngine() {
  initializeEngineCore("GLCanvas", new CollisionTest());
}

document.addEventListener("DOMContentLoaded", initEngine);
