export default class TextureInfo{
    name: string;
    width: number;
    height: number;
    glTexID: WebGLTexture;
    colorArray?: Uint8Array;
    
    constructor(name:string, width:number, height:number, id:WebGLTexture) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.glTexID = id;
    }
}