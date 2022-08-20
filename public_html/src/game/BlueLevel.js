/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function BlueLevel() {
    this.kSceneFile = "assets/bluelevel.xml";
    
    this.kPortal = "assets/minion_portal.jpg";
    this.kCollector = "assets/minion_collector.jpg";
    
    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";

    this.mSquareSet = new Array();
    this.mCamera = null;
}
gEngine.Core.inheritPrototype(Scene, BlueLevel);

BlueLevel.prototype.loadScene = function () {
    gEngine.TextFileLoader.loadTextFile(
            this.kSceneFile,
            gEngine.TextFileLoader.eTextFileType.eXMLFile);
    gEngine.Textures.loadTexture(this.kPortal);
    gEngine.Textures.loadTexture(this.kCollector);
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};

BlueLevel.prototype.unloadScene = function () {
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    gEngine.AudioClips.stopBackgroundAudio();
    gEngine.Textures.unloadTexture(this.kPortal);
    gEngine.Textures.unloadTexture(this.kCollector);
    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);

    var myGame = new MyGame();
    gEngine.Core.startScene(myGame);
};

BlueLevel.prototype.initialize = function () {
    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

    var sceneParser = new SceneFileParser(this.kSceneFile);
    sceneParser.parseSquares(this.mSquareSet);
    sceneParser.parseTextureSquares(this.mSquareSet);
    this.mCamera = sceneParser.parseCamera();
};

BlueLevel.prototype.update = function () {
    var whiteXform = this.mSquareSet[0].getXform();
    var redXform = this.mSquareSet[1].getXform();
    var deltaX = 0.05;

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        gEngine.AudioClips.playCue(this.kCue);
        if (whiteXform.getXPos() > 30) {
            whiteXform.setPosition(10, 60);
        }
        whiteXform.incXPos(deltaX);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {
        whiteXform.incRotationInDegrees(1);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (redXform.getWidth() > 5) {
            redXform.setSize(2, 2);
        }
        redXform.incSize(0.05);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        gEngine.AudioClips.playCue(this.kCue);
        whiteXform.incXPos(-deltaX);
        if (whiteXform.getXPos() < 11) {
            gEngine.GameLoop.stop();
        }
    }
    
    var c = this.mSquareSet[1].getColor();;
    var ca = c[3] + deltaX;
    if (ca > 1) {
        ca = 0;
    }
    c[3] = ca;
};

BlueLevel.prototype.draw = function () {
    // Clear entire canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    this.mCamera.setupViewProjection();

    for (var i = 0; i < this.mSquareSet.length; i++) {
        this.mSquareSet[i].draw(this.mCamera);
    }
};