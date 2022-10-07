uniform mat4 uViewProjTransform;
uniform mat4 uModelTransform;
attribute vec3 aShapeVertexPosition;
void main(void) {
    gl_Position = uViewProjTransform * uModelTransform * vec4(aShapeVertexPosition, 1.0);
}