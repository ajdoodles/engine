import SimpleShader from "./SimpleShader.js";
import SpriteShader from "./SpriteShader.js";
import TextureShader from "./TextureShader.js";
import LightShader from "./LightShader.js";
import IllumShader from "./IllumShader.js";
import ShadowCasterShader from "./ShadowCasterShader.js";
import LineShader from "./LineShader.js";

var kSimpleVS = "src/glslshaders/SimpleVS.glsl";
var kSimpleFS = "src/glslshaders/SimpleFS.glsl";
var kTextureVS = "src/glslshaders/TextureVS.glsl";
var kTextureFS = "src/glslshaders/TextureFS.glsl";
var kLightFS = "src/glslshaders/LightFS.glsl";
var kIllumFS = "src/glslshaders/IllumFS.glsl";
var kShadowCasterFS = "src/glslshaders/ShadowCasterFS.glsl";
var kShadowReceiverFS = "src/glslshaders/ShadowReceiverFS.glsl";
var kLineFS = "src/glslshaders/LineFS.glsl";

var mConstColorShader = null;
var mSpriteShader = null;
var mTextureShader = null;
var mLightShader = null;
var mIllumShader = null;
var mShadowCasterShader = null;
var mShadowReceiverShader = null;
var mLineShader = null;

var _getConstColorShader = function() {
    return mConstColorShader;
};

var _getSpriteShader = function() {
    return mSpriteShader;
};

var _getTextureShader = function() {
    return mTextureShader;
};

var _getLightShader = function() {
    return mLightShader;
};

var _getIllumShader = function() {
    return mIllumShader;
};

var _getShadowCasterShader = function() {
    return mShadowCasterShader;
};

var _getShadowReceiverShader = function () {
    return mShadowReceiverShader;
};

var _getLineShader = function() {
    return mLineShader;
};

var createShaders = function() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mLightShader = new LightShader(kTextureVS, kLightFS);
    mIllumShader = new IllumShader(kTextureVS, kIllumFS);
    mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
    mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
    mLineShader = new LineShader(kSimpleVS, kLineFS);
};

var mPublic = {
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