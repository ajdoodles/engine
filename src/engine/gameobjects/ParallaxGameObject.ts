import { vec2 } from "gl-matrix";
import Camera from "../cameras/Camera";
import Renderable from "../renderables/Renderable";
import TileGameObject from "./TiledGameObject";

export default class ParallaxGameObject extends TileGameObject {

    private _parallaxScale = 1;
    private readonly lastCameraPos = vec2.create();

    constructor(renderable: Renderable, scale: number, private cameraRef: Camera){
        super(renderable);
        this.parallaxScale = scale;
        vec2.copy(this.lastCameraPos, cameraRef.getWCCenter());
    }

    get parallaxScale() {
        return this._parallaxScale;
    }
    set parallaxScale(scale:number) {
        if (scale <= 0) {
            this._parallaxScale = 1;
        } else {
            this._parallaxScale = 1/scale;
        }
    }

    private reactToCameraTranslation(translationDelta: vec2) {
        const distanceScaling = 1 - this.parallaxScale;
        this.xform.incXPos(-translationDelta[0] * distanceScaling);
        this.xform.incYPos(-translationDelta[1] * distanceScaling);
    }

    private updateReferencePosition() {
        const delta = vec2.create();
        const curCameraPosition = this.cameraRef.getWCCenter();
        vec2.sub(delta, this.lastCameraPos, curCameraPosition);
        this.reactToCameraTranslation(delta);
        vec2.copy(this.lastCameraPos, curCameraPosition);
    }

    public update() {
        this.updateReferencePosition();
        super.update();
    }
}