import core from "./Engine_GL";
import vertexBuffer from "./Engine_VertexBuffer";
import input from "./Engine_Input";
import audioClips from "./resources/Engine_AudioClips";
import defaultResources from "./resources/Engine_DefaultResources";
import ShaderFactory from "../shaders/ShaderFactory";
import gameLoop from "./Engine_GameLoop";
import Scene from "../Scene";


export function initializeEngineCore (
        htmlCanvasID: string,
        scene: Scene
      ) {
        core.initializeWebGL(htmlCanvasID);
        vertexBuffer.initialize();
        input.initialize(htmlCanvasID);
        audioClips.initAudioContext();
    
        defaultResources.initialize(function() {
            ShaderFactory.createShaders();
            startScene(scene);
        });
    };

export function startScene(scene: Scene) {
    scene.loadScene.call(scene);
    gameLoop.start(scene);
}
