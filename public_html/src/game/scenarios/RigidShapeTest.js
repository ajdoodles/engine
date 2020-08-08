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
    
    this.mSquare = new Renderable();
    var xForm = this.mSquare.getXform();
    xForm.setSize(30, 30);
    xForm.setPosition(10, 10);
        
    this.mMsg = new FontRenderable("Is this working?");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);
    
    this.mObjectSet = new GameObjectSet();
    this.mObjectSet.addObject(new Platform(this.kPlatform));
    this.mObjectSet.addObject(new Platform(this.kPlatform));
    this.mObjectSet.addObject(new Hero(this.kMinionSprite));
    this.mObjectSet.addObject(new Hero(this.kMinionSprite));
    this.mObjectSet.selectObjectAt(0);
    this.mObjectSet.setAlertCollisions(true);
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
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.E)) {
        this.mObjectSet.incSelected();
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mObjectSet.decSelected();
    }

    this.mObjectSet.update();
};

RigidShapeTest.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);
    this.mCamera.setupViewProjection();

    this.mSquare.draw(this.mCamera);

    this.mMsg.draw(this.mCamera);
    this.mObjectSet.draw(this.mCamera);
};