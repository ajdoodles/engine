import Camera from "../cameras/Camera";
import GameObject from "../gameobjects/GameObject";
import GameObjectSet from "../gameobjects/GameObjectSet";

export const enum Layer {
    Background = 0,
    Shadows = 1,
    Actor = 2,
    Foreground = 3,
    HUD = 4
}

const numLayers = 5;
const allLayers: GameObjectSet[] = Array.from({length: numLayers}, () => {return new GameObjectSet()});

export function cleanUp() {
    allLayers.map(() => {return new GameObjectSet()});
}

export function addToLayer(layer:Layer, obj:GameObject) {
    allLayers[layer.valueOf()].addObject(obj);
}

export function layerSize(layer: Layer) {
    return allLayers[layer.valueOf()].size();
}

// export function addAsShadowCaster(obj: GameObject) {
//     let i;
//     for (i = 0; i < layerSize(Layer.Shadows); i++) {
//         const receiver = allLayers[Layer.Shadows].getObjectAt(i) as ShadowReceiver;
//         receiver.addShadowCaster(obj);
//     }
// }

export function drawLayer(layer: Layer, camera: Camera) {
    allLayers[layer.valueOf()].draw(camera);
}

export function drawAllLayers(camera: Camera) {
    let i;
    for (i = 0; i < numLayers; i++) {
        allLayers[i].draw(camera);
    }
}

export function moveToLayerFront(layer: Layer, obj: GameObject) {
    allLayers[layer.valueOf()].moveToLast(obj);
}

export function updateLayer(layer: Layer) {
    allLayers[layer.valueOf()].update();
}
export function updateAllLayers() {
    let i;
    for (i = 0; i < allLayers.length; i++) {
        allLayers[i].update();
    }
}