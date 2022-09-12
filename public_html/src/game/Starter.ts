"use strict";
import { initializeEngineCore } from "../engine/core/Engine_Init.js";
import ParallaxTest from "./scenarios/ParallaxTest.js";

function initEngine() {
  initializeEngineCore("GLCanvas", new ParallaxTest());
}

document.addEventListener("DOMContentLoaded", initEngine);
