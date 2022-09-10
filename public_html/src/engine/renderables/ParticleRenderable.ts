import ShaderFactory from "../shaders/ShaderFactory";
import TextureRenderable from "./TextureRenderable";

export default class ParticleRenderable extends TextureRenderable {
  constructor(texture: string) {
    super(texture);
    this._setShader(ShaderFactory.getParticleShader());
  }
}
