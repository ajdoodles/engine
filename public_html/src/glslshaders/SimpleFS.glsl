precision mediump float;

uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor;
uniform float uGlobalAmbientIntensity;

void main(void) {
    gl_FragColor = uPixelColor * uGlobalAmbientColor * uGlobalAmbientIntensity;
}