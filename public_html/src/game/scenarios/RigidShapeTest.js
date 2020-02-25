/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function RigidShapeTest() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatform = "assets/platform.png";
    
    this.kFontImage = "assets/Consolas-72.png";
    
    this.kNumHeroes = 3;
    this.kNumMinions = 4;
    this.kNumPlatforms = 5;
}
gEngine.Core.inheritPrototype(RigidShapeTest, Scene);

RigidShapeTest.prototype.loadScene = function() {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatform);
    gEngine.Textures.loadTexture(this.kFontImage);
};

RigidShapeTest.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatform);
    gEngine.Textures.unloadTexture(this.kFontImage);
};

RigidShapeTest.prototype.initialize = function () {
    this._initCamera();
    
    this.mPlatformSet = [];
    for (var i = 0; i < this.kNumPlatforms; i++) {
        var platform = new Platform(this.kPlatform);
        var randomPos = this.mCamera.genRandomPosition2D();
        platform.getXform().setPosition(randomPos[0], randomPos[1]);
        this.mPlatformSet.push(platform);
    }
    
    this.mMinionSet = [];
    for (var i = 0; i < this.kNumMinions; i++) {
        var minion = new Minion(this.kMinionSprite);
        var randomPos = this.mCamera.genRandomPosition2D();
        minion.getXform().setPosition(randomPos[0], randomPos[1]);
        this.mMinionSet.push(minion);
    } 
        
    this.mHeroSet = [];
    for (var i = 0; i < this.kNumHeroes; i++) {
        var hero = new Hero(this.kMinionSprite);
        var randomPos = this.mCamera.genRandomPosition2D();
        hero.getXform().setPosition(randomPos[0], randomPos[1]);
        this.mHeroSet.push(hero);
    }
        
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);
};

RigidShapeTest.prototype._initCamera = function () {
    this.mCamera =
        new Camera(
            vec2.fromValues(50, 37.5),
            100,
            [0, 0, 640, 480]);
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
};

RigidShapeTest.prototype.update = function () {
    this.mCamera.update();
    
    for (var i = 0; i < this.mPlatformSet.length; i++) {
        this.mPlatformSet[i].update();
    }
    for (var i = 0; i < this.mMinionSet.length; i++) {
        this.mMinionSet[i].update();
    }
    for (var i = 0; i < this.mHeroSet.length; i++) {
        this.mHeroSet[i].update();
    }
};

RigidShapeTest.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);
    this.mCamera.setupViewProjection();
    
    this.mMsg.draw(this.mCamera);
    for (var i = 0; i < this.mPlatformSet.length; i++) {
        this.mPlatformSet[i].draw(this.mCamera);
    }
    for (var i = 0; i < this.mMinionSet.length; i++) {
        this.mMinionSet[i].draw(this.mCamera);
    }
    for (var i = 0; i < this.mHeroSet.length; i++) {
        this.mHeroSet[i].draw(this.mCamera);
    }
};