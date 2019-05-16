uniform mat4 uViewProjTransform;
uniform mat4 uModelTransform;

attribute vec3 aSquareVertexPosition;
attribute vec2 aTextureCoordinate;

varying vec2 vTexCoord;

void main(void) {
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0);
    vTexCoord = aTextureCoordinate;
}