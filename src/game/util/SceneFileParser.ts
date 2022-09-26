/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { vec2 } from "gl-matrix";
import Camera from "../../engine/cameras/Camera.js";
import resourceMap from "../../engine/core/resources/Engine_ResourceMap.js";
import Renderable from "../../engine/renderables/Renderable.js";
import TextureRenderable from "../../engine/renderables/TextureRenderable.js";

export default class SceneFileParser {
  mSceneXML: Document;

  constructor(sceneFilePath: string) {
    this.mSceneXML = resourceMap.retrieveAsset(sceneFilePath) as Document;
  }

  _getElements(elementTag: string) {
    const elements = this.mSceneXML.getElementsByTagName(elementTag);
    if (elements.length === 0) {
      console.error(
        "Warning: Level element:[" + elementTag + "]: is not found!"
      );
    }
    return elements;
  }

  parseCamera() {
    const cameraInfo = this._getElements("Camera")[0];
    const centerX = Number(cameraInfo.getAttribute("CenterX"));
    const centerY = Number(cameraInfo.getAttribute("CenterY"));
    const width = Number(cameraInfo.getAttribute("Width"));
    const viewportTmp = (cameraInfo.getAttribute("Viewport") as string).split(
      " "
    );
    const viewport = viewportTmp.map((value: string) =>
      Number.parseInt(value)
    ) as [number, number, number, number];
    const bgColorTmp = (cameraInfo.getAttribute("BgColor") as string).split(
      " "
    );
    const bgColor = bgColorTmp.map((value: string) =>
      Number.parseInt(value)
    ) as color;

    const camera = new Camera(
      vec2.fromValues(centerX, centerY),
      width,
      viewport
    );
    camera.setBackgroundColor(bgColor);
    return camera;
  }

  parseSquares(squareSet: Renderable[]) {
    const squares = this._getElements("Square");
    let height, width, rotation, posX, posY, color;

    for (let i = 0; i < squares.length; i++) {
      height = Number(squares[i].getAttribute("Height"));
      width = Number(squares[i].getAttribute("Width"));
      rotation = Number(squares[i].getAttribute("Rotation"));
      posX = Number(squares[i].getAttribute("PosX"));
      posY = Number(squares[i].getAttribute("PosY"));
      const colorTmp = (squares[i].getAttribute("Color") as string).split(" ");
      color = colorTmp.map((value: string) => Number.parseInt(value)) as color;

      const square = new Renderable();
      square.setColor(color);
      square.getXform().setSize(width, height);
      square.getXform().setRotationDegrees(rotation);
      square.getXform().setPosition(posX, posY);

      squareSet.push(square);
    }
  }

  parseTextureSquares(squareSet: (Renderable | TextureRenderable)[]) {
    const squares = this._getElements("TextureSquare");
    let height, width, rotation, posX, posY, color, texture;

    for (let i = 0; i < squares.length; i++) {
      height = Number(squares[i].getAttribute("Height"));
      width = Number(squares[i].getAttribute("Width"));
      rotation = Number(squares[i].getAttribute("Rotation"));
      posX = Number(squares[i].getAttribute("PosX"));
      posY = Number(squares[i].getAttribute("PosY"));
      const colorTmp = (squares[i].getAttribute("Color") as string).split(" ");
      color = colorTmp.map((value: string) => Number.parseInt(value)) as color;
      texture = String(squares[i].getAttribute("Texture"));

      const square = new TextureRenderable(texture);
      square.setColor(color);
      square.getXform().setSize(width, height);
      square.getXform().setRotationDegrees(rotation);
      square.getXform().setPosition(posX, posY);

      squareSet.push(square);
    }
  }
}
