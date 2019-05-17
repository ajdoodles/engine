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
    this.kFontImage = "assets/Consolas-72.png";
    this.kBg = "assets/bg.png";

    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/MyGame_cue.wav";
    
    this.mDrawSet = new Array();
    this.mCamera = null;
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

    var bgRenderable = new TextureRenderable(this.kBg);
    bgRenderable.getXform().setSize(150, 150);
    bgRenderable.getXform().setPosition(50, 35);
    this.mBg = new GameObject(bgRenderable);

//    this.mDyePack = new DyePack(this.kMinionSprite);
//    this.mMinionSet = new GameObjectSet();
    this.mHero = new Hero(this.kMinionSprite);
    this.mBrain = new Brain(this.kMinionSprite);
    this.mPortal = new Portal(this.kPortal);
//    this.mCollector = new Collector(this.kCollector);
    this.mLeftMinion = new Minion(this.kMinionSprite, 30, 30);
    this.mRightMinion = new Minion(this.kMinionSprite, 70, 30);
    this.mRightMinion.getXform().setHorizontalFlip(true);
    
    this.mFocusObj = this.mHero;
    this.mChoice = 'H';
//    var minion, i;
//    for (i = 0; i < 5; i++) {
//        minion = new Minion(this.kMinionSprite, Math.random() * 65);
//        this.mMinionSet.addObject(minion);
//    }

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);
};

MyGame.prototype.update = function () {
    this.mCamera.update();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
        this.mFocusObj = this.mLeftMinion;
        this.mChoice = 'L';
        this.mCamera.panTo(this.mLeftMinion.getXform().getXPos(), this.mLeftMinion.getXform().getYPos());
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R)) {
        this.mFocusObj = this.mRightMinion;
        this.mChoice = 'R';
        this.mCamera.panTo(this.mRightMinion.getXform().getXPos(), this.mRightMinion.getXform().getYPos());
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        this.mFocusObj = this.mPortal;
        this.mChoice = 'P';
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {
        this.mFocusObj = this.mHero;
        this.mChoice = 'H';
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mCamera.startShake(-2, -2, 20, 30);
    }
    
    var zoomDelta = 0.05;
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.N)) {
        this.mCamera.zoomBy(1 - zoomDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.M)) {
        this.mCamera.zoomBy(1 + zoomDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.J)) {
        this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 - zoomDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.K)) {
        this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 + zoomDelta);
    }

    if (gEngine.Input.isMouseClicked(gEngine.Input.mouse.Right)
        || gEngine.Input.isMouseClicked(gEngine.Input.mouse.Middle)) {
        this.mPortal.setVisible(!this.mPortal.isVisible());
    }

    this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
    this.mCamera.clampAtBoundary(this.mPortal.getXform(), 0.8);
    this.mCamera.panWith(this.mHero.getXform(), 0.9);
    
    this.mHero.update();
//    this.mCollector.update();
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

    var heroView = this.mHeroCam.getBounds();
    heroView[0] += 1;
    if (heroView[0] > 500) {
        heroView[0] = 0;
    }
    this.mHeroCam.setBounds(heroView);
    
    var mousePos = gEngine.Input.getMousePosition();
    this.mMsg.setText("(" + mousePos[0] + ", " + mousePos[1] + ")");

//    var collisionPoint = [];
//    if (this.mHero.pixelTouches(this.mCollector, collisionPoint)) {
//        this.mMsg.setText("Collision! ( " + collisionPoint[0] + ", " + collisionPoint[1] + ")");
//        this.mDyePack.getXform().setPosition(collisionPoint[0], collisionPoint[1]);
//        this.mDyePack.setVisible(true);
//    } else {
//        this.mDyePack.setVisible(false);
//    }
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
//    this.mMinionSet.draw(camera);
//    this.mMsg.draw(camera);
    this.mPortal.draw(camera);
    this.mLeftMinion.draw(camera);
    this.mRightMinion.draw(camera);
//    this.mCollector.draw(camera);
//    this.mDyePack.draw(camera);
};