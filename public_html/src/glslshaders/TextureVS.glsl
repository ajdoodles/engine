#version 300 es

uniform mat4 uViewProjTransform;
uniform mat4 uModelTransform;

in vec3 aSquareVertexPosition;
in vec2 aTextureCoordinate;

out vec2 vTexCoord;

void main(void) {
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0);
    vTexCoord = aTextureCoordinate;
}