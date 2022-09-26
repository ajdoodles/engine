precision mediump float;

const float kSufficientlyOpaque = 0.1;

uniform sampler2D uSampler;

varying vec2 vTexCoord;

void main(void) {
    vec4 texColor = texture2D(uSampler, vTexCoord);
    if (texColor.a < kSufficientlyOpaque) {
        discard;
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}