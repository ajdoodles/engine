/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SceneFileParser(sceneFilePath) {
    this.mSceneXML = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

SceneFileParser.prototype._getElements = function(elementTag) {
    var elements = this.mSceneXML.getElementsByTagName(elementTag);
    if (elements.length === 0) {
        console.error("Warning: Level element:[" + elementTag + "]: is not found!");
    }
    return elements;
};

SceneFileParser.prototype.parseCamera = function() {
    var camera = this._getElements("Camera")[0];
    var centerX = Number(camera.getAttribute("CenterX"));
    var centerY = Number(camera.getAttribute("CenterY"));
    var width = Number(camera.getAttribute("Width"));
    var viewport = camera.getAttribute("Viewport").split(" ");
    var bgColor = camera.getAttribute("BgColor").split(" ");
    for (var i = 0; i < 4 ; i++) {
        bgColor[i] = Number(bgColor[i]);
        viewport[i] = Number(viewport[i]);
    }

    var camera = new Camera(
            vec2.fromValues(centerX, centerY),
            width,
            viewport);
    camera.setBackgroundColor(bgColor);
    return camera;
};

SceneFileParser.prototype.parseSquares = function(squareSet) {
    var squares = this._getElements("Square");
    var height, width, rotation, posX, posY, color;
    
    for (var i = 0; i < squares.length; i++) {
        height = Number(squares[i].getAttribute("Height"));
        width = Number(squares[i].getAttribute("Width"));
        rotation = Number(squares[i].getAttribute("Rotation"));
        posX = Number(squares[i].getAttribute("PosX"));
        posY = Number(squares[i].getAttribute("PosY"));
        color = squares[i].getAttribute("Color").split(" ");
        for (var j = 0; j < 4; j++) {
            color[j] = Number(color[j]);
        }
        
        var square = new Renderable();
        square.setColor(color);
        square.getXform().setSize(width, height);
        square.getXform().setRotationDegrees(rotation);
        square.getXform().setPosition(posX, posY);
        
        squareSet.push(square);
    }
};

SceneFileParser.prototype.parseTextureSquares = function(squareSet) {
    var squares = this._getElements("TextureSquare");
    var height, width, rotation, posX, posY, color, texture;
    
    for (var i = 0; i < squares.length; i++) {
        height = Number(squares[i].getAttribute("Height"));
        width = Number(squares[i].getAttribute("Width"));
        rotation = Number(squares[i].getAttribute("Rotation"));
        posX = Number(squares[i].getAttribute("PosX"));
        posY = Number(squares[i].getAttribute("PosY"));
        color = squares[i].getAttribute("Color").split(" ");
        texture = String(squares[i].getAttribute("Texture"));
        for (var j = 0; j < 4; j++) {
            color[j] = Number(color[j]);
        }
        
        var square = new TextureRenderable();
        square.setColor(color);
        square.setTexture(texture);
        square.getXform().setSize(width, height);
        square.getXform().setRotationDegrees(rotation);
        square.getXform().setPosition(posX, posY);
        
        squareSet.push(square);
    }
};