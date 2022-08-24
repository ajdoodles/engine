import SimpleShader from "./SimpleShader.js";
import SpriteShader from "./SpriteShader.js";
import TextureShader from "./TextureShader.js";
import LightShader from "./LightShader.js";
import IllumShader from "./IllumShader.js";
import ShadowCasterShader from "./ShadowCasterShader.js";
import LineShader from "./LineShader.js";

const kSimpleVS = "src/glslshaders/SimpleVS.glsl";
const kSimpleFS = "src/glslshaders/SimpleFS.glsl";
const kTextureVS = "src/glslshaders/TextureVS.glsl";
const kTextureFS = "src/glslshaders/TextureFS.glsl";
const kLightFS = "src/glslshaders/LightFS.glsl";
const kIllumFS = "src/glslshaders/IllumFS.glsl";
const kShadowCasterFS = "src/glslshaders/ShadowCasterFS.glsl";
const kShadowReceiverFS = "src/glslshaders/ShadowReceiverFS.glsl";
const kLineFS = "src/glslshaders/LineFS.glsl";

let mConstColorShader: SimpleShader;
let mSpriteShader: SpriteShader;
let mTextureShader: TextureShader;
let mLightShader: LightShader;
let mIllumShader: IllumShader;
let mShadowCasterShader: ShadowCasterShader;
let mShadowReceiverShader: SpriteShader;
let mLineShader: LineShader;

const _getConstColorShader = function() {
    return mConstColorShader;
};

const _getSpriteShader = function() {
    return mSpriteShader;
};

const _getTextureShader = function() {
    return mTextureShader;
};

const _getLightShader = function() {
    return mLightShader;
};

const _getIllumShader = function() {
    return mIllumShader;
};

const _getShadowCasterShader = function() {
    return mShadowCasterShader;
};

const _getShadowReceiverShader = function () {
    return mShadowReceiverShader;
};

const _getLineShader = function() {
    return mLineShader;
};

const createShaders = function() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mLightShader = new LightShader(kTextureVS, kLightFS);
    mIllumShader = new IllumShader(kTextureVS, kIllumFS);
    mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
    mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
    mLineShader = new LineShader(kSimpleVS, kLineFS);
};

const mPublic = {
    getConstColorShader: _getConstColorShader,
    getTextureShader: _getTextureShader,
    getSpriteShader: _getSpriteShader,
    getLightShader: _getLightShader,
    getIllumShader: _getIllumShader,
    getShadowCasterShader: _getShadowCasterShader,
    getShadowReceiverShader: _getShadowReceiverShader,
    getLineShader: _getLineShader,
    createShaders: createShaders,
};

export default mPublic;