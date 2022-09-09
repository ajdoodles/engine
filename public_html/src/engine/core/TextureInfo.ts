export default class TextureInfo {
  colorArray?: Uint8Array;

  constructor(public name: string, public width: number, public height: number, public glTexID: WebGLTexture) { };
}
