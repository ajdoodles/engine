precision mediump float;

// Fetches data from the texture
uniform sampler2D uSampler;

uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor;
uniform float uGlobalAmbientIntensity;

uniform bool uLightOn;
uniform vec4 uLightColor;
uniform vec3 uLightPosition;
uniform float uLightRadius;

varying vec2 vTexCoord;

void main(void) {
    vec4 texColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    vec4 light = uGlobalAmbientIntensity * uGlobalAmbientColor;

    if (uLightOn && texColor.a > 0.0) {
        float lightDist = length(uLightPosition.xyz - gl_FragCoord.xyz);
        if (lightDist <= uLightRadius) {
            light += uLightColor;
        }
    }
    texColor *= light;

    vec3 r = (vec3(texColor) * (1.0 - uPixelColor.a)) + (vec3(uPixelColor) * uPixelColor.a);
    vec4 result = vec4(r, texColor.a);

    gl_FragColor = result;
}