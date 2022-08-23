export default class TextureInfo{
    name: string;
    width: number;
    height: number;
    glTexID: number;
    colorArray?: number[];
    
    constructor(name:string, width:number, height:number, id:number) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.glTexID = id;
    }
}