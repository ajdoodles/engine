/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function MyGame() {
    this.kSceneFile = "assets/scene.xml";

    this.kPortal = "assets/minion_portal.png";
    this.kCollector = "assets/minion_collector.png";
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionSpriteNormal = "assets/minion_sprite_normal.png";
    this.kFontImage = "assets/Consolas-72.png";
    this.kBg = "assets/bg.png";
    this.kBgNormal = "assets/bg_normal.png";

    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/MyGame_cue.wav";

    this.mLightSet = new LightSet();
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.TextFileLoader.loadTextFile(
            this.kSceneFile,
            gEngine.TextFileLoader.eTextFileType.eXMLFile);
                gEngine.Textures.loadTexture(this.kPortal);
    gEngine.Textures.loadTexture(this.kCollector);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBg);
    gEngine.Textures.loadTexture(this.kFontImage);
    
    gEngine.Textures.loadTexture(this.kMinionSpriteNormal);
    gEngine.Textures.loadTexture(this.kBgNormal);
    
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};

MyGame.prototype.unloadScene = function () {
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    gEngine.AudioClips.stopBackgroundAudio();
    //gEngine.Textures.unloadTexture(this.kPortal);
//    gEngine.Textures.unloadTexture(this.kCollector);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kFontImage);
    gEngine.Textures.unloadTexture(this.kBg);
    //gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);

    var blueLevel = new BlueLevel();
    gEngine.Core.startScene(blueLevel);
};

MyGame.prototype.initialize = function () {
    //gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

    var sceneParser = new SceneFileParser(this.kSceneFile);
    this.mCamera = sceneParser.parseCamera();

    this.mHeroCam = new Camera(
            vec2.fromValues(50, 30),
            20,
            [490, 330, 150, 150],
            2);
    this.mHeroCam.setBackgroundColor([0.5, 0.5, 0.5, 1]);
    
    this.mBrainCam = new Camera(
            vec2.fromValues(50, 30),
            10,
            [0, 330, 150, 150],
            2);
    this.mBrainCam.setBackgroundColor([1, 1, 1, 1]);

    var bgRenderable = new IllumRenderable(this.kBg, this.kBgNormal);
    bgRenderable.getXform().setSize(150, 150);
    bgRenderable.getXform().setPosition(50, 35);
    var material = new Material();
    material.setShininess(200);
    material.setSpecular([1, 0, 0, 1]);
    bgRenderable.setMaterial(material);
    this.mBg = new GameObject(bgRenderable);

    this.mHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal);
    this.mBrain = new Brain(this.kMinionSprite);
    this.mPortal = new Portal(this.kPortal);
    this.mLeftMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal);
    this.mLeftMinion.getXform().setPosition(30, 30);
    this.mRightMinion = new Minion(this.kMinionSprite);
    this.mRightMinion.getXform().setPosition(70, 30);
    
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);
    
    this.initLights();
};

MyGame.prototype.update = function () {
    this.mCamera.update();

    if (gEngine.Input.isMouseClicked(gEngine.Input.mouse.Middle)) {
        var visible = this.mPortal.isVisible();
        this.mPortal.setVisible(!visible);
    }

    if (gEngine.Input.isMousePressed(gEngine.Input.mouse.Left)) {
        if (this.mCamera.isMouseInViewport()) {
            var mousePos = this.mCamera.getWCCursorPosition();
            this.mPortal.getXform().setPosition(mousePos[0], mousePos[1]);
        }
    }

    if (gEngine.Input.isMousePressed(gEngine.Input.mouse.Right)) {
        if (this.mHeroCam.isMouseInViewport()) {
            var mousePos = this.mHeroCam.getWCCursorPosition();
            this.mHero.getXform().setPosition(mousePos[0], mousePos[1]);
        }
    }

    this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
    this.mCamera.panWith(this.mHero.getXform(), 0.9);
    
    this.mHero.update();
    this.mPortal.update();
    this.mBrain.update();

    var rate = 0.02;
    if (!this.mBrain.getBBox().intersects(this.mHero.getBBox())) {
        this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), rate);
        GameObject.prototype.update.call(this.mBrain);
    }

    this.mHeroCam.update();
    this.mBrainCam.update();

    this.mHeroCam.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
    this.mBrainCam.panTo(this.mBrain.getXform().getXPos(), this.mBrain.getXform().getYPos());

    var mousePos = gEngine.Input.getMousePosition();
    this.mMsg.setText("(" + mousePos[0] + ", " + mousePos[1] + ")");
    
    this.updateLights();
};

MyGame.prototype.draw = function () {
    // Clear entire canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);
    this.drawCam(this.mCamera);
    this.mMsg.draw(this.mCamera);
    this.drawCam(this.mHeroCam);
    this.drawCam(this.mBrainCam);    
};

MyGame.prototype.drawCam = function (camera) {
    camera.setupViewProjection();
    
    this.mBg.draw(camera);
    this.mHero.draw(camera);
    this.mBrain.draw(camera);
    this.mPortal.draw(camera);
    this.mLeftMinion.draw(camera);
    this.mRightMinion.draw(camera);
};