/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export default new (class {
  gl!: WebGLRenderingContext;

  public initializeWebGL(htmlCanvasId: string) {
    const canvas = document.getElementById(htmlCanvasId) as HTMLCanvasElement;

    const args = {
      alpha: false,
      depth: true,
      stencil: true,
    };

    this.gl = canvas.getContext("webgl2", args) as WebGL2RenderingContext;

    if (this.gl === null) {
      document.write("<br/><b> WebGL is not supported. </b>");
      return;
    }

    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  public clearCanvas(color: color) {
    this.gl.clearColor(color[0], color[1], color[2], color[3]);
    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT |
        this.gl.DEPTH_BUFFER_BIT |
        this.gl.STENCIL_BUFFER_BIT
    );
  }
})();
