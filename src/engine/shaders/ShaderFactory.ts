import SimpleShader from "./SimpleShader.js";
import SpriteShader from "./SpriteShader.js";
import TextureShader from "./TextureShader.js";
import LightShader from "./LightShader.js";
import IllumShader from "./IllumShader.js";
import ShadowCasterShader from "./ShadowCasterShader.js";
import FlatShader from "./FlatShader.js";

const kSimpleVS = "shaders/SimpleVS.glsl";
const kSimpleFS = "shaders/SimpleFS.glsl";
const kTextureVS = "shaders/TextureVS.glsl";
const kTextureFS = "shaders/TextureFS.glsl";
const kLightFS = "shaders/LightFS.glsl";
const kIllumFS = "shaders/IllumFS.glsl";
const kShadowCasterFS = "shaders/ShadowCasterFS.glsl";
const kShadowReceiverFS = "shaders/ShadowReceiverFS.glsl";
const kLineFS = "shaders/LineFS.glsl";
const kParticleFS = "shaders/ParticleFS.glsl";

let mConstColorShader: SimpleShader;
let mSpriteShader: SpriteShader;
let mTextureShader: TextureShader;
let mLightShader: LightShader;
let mIllumShader: IllumShader;
let mShadowCasterShader: ShadowCasterShader;
let mShadowReceiverShader: SpriteShader;
let mFlatShader: FlatShader;
let mParticleShader: TextureShader;

const _getConstColorShader = function () {
  return mConstColorShader;
};

const _getSpriteShader = function () {
  return mSpriteShader;
};

const _getTextureShader = function () {
  return mTextureShader;
};

const _getLightShader = function () {
  return mLightShader;
};

const _getIllumShader = function () {
  return mIllumShader;
};

const _getShadowCasterShader = function () {
  return mShadowCasterShader;
};

const _getShadowReceiverShader = function () {
  return mShadowReceiverShader;
};

const _getFlatShader = function () {
  return mFlatShader;
};

const _getParticleShader = function () {
  return mParticleShader;
};

const createShaders = function () {
  mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
  mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
  mTextureShader = new TextureShader(kTextureVS, kTextureFS);
  mLightShader = new LightShader(kTextureVS, kLightFS);
  mIllumShader = new IllumShader(kTextureVS, kIllumFS);
  mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
  mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
  mFlatShader = new FlatShader(kSimpleVS, kLineFS);
  mParticleShader = new TextureShader(kTextureVS, kParticleFS);
};

const mPublic = {
  getConstColorShader: _getConstColorShader,
  getTextureShader: _getTextureShader,
  getSpriteShader: _getSpriteShader,
  getLightShader: _getLightShader,
  getIllumShader: _getIllumShader,
  getShadowCasterShader: _getShadowCasterShader,
  getShadowReceiverShader: _getShadowReceiverShader,
  getFlatShader: _getFlatShader,
  getParticleShader: _getParticleShader,
  createShaders: createShaders,
};

export default mPublic;
