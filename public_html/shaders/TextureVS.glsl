uniform mat4 uViewProjTransform;
uniform mat4 uModelTransform;

attribute vec3 aShapeVertexPosition;
attribute vec2 aTextureCoordinate;

varying vec2 vTexCoord;

void main(void) {
    gl_Position = uViewProjTransform * uModelTransform * vec4(aShapeVertexPosition, 1.0);
    vTexCoord = aTextureCoordinate;
}