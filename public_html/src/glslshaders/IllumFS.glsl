precision mediump float;

const int kGLSLuLightArraySize = 4;

struct Light
{
    bool IsLit;
    vec4 Color;
    vec3 Position;
    float Intensity;
    float Near;
    float Far;
};

uniform Light uLights[kGLSLuLightArraySize];

// Fetches data from the texture
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor;
uniform float uGlobalAmbientIntensity;

varying vec2 vTexCoord;

// TODO: Fix shader versioning and remove this
// This function needs to die a quick death. smoothStep is a method that exists
// on some versions of OpenGL/WebGL but I'm realizing that the openGL space
// is fragmented AF. I can't tell which type or version of OpenGL I'm using
// but I'm pretty sure I need to either upgrade my version of OpenGL or force
// a stricter version on my shaders. 
float mySmoothStep(float lower, float upper, float val) {
    float t = clamp((val - lower) / (upper - lower), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

vec4 applyLight(Light light, vec3 normalUnitVec) {
    vec3 lightVec = light.Position.xyz - gl_FragCoord.xyz;
    float dist = length(lightVec);
    float atten = 0.0;

    if (dist <= light.Far) {
        if (dist <= light.Near) {
            atten = 1.0;
        } else {
            float n = dist - light.Near;
            float d = light.Far - light.Near;
            atten = mySmoothStep(0.0, 1.0, 1.0-(n*n)/(d*d));
        }

        vec3 lightUnitVec = lightVec / dist;
        float nDotL = max(0.0, dot(normalUnitVec, lightUnitVec));
        atten *= nDotL;
    }

    vec4 result = (light.Color * atten * light.Intensity);
    result.a = 0.0;
    return result;
}

void main(void) {
    vec2 texCoord = vec2(vTexCoord.s, vTexCoord.t);
    vec4 texColor = texture2D(uSampler, texCoord);
    vec3 normal = (texture2D(uNormalSampler, texCoord).xyz * 2.0) - 1.0;    
    vec4 lightEffect = uGlobalAmbientIntensity * uGlobalAmbientColor;

    if (texColor.a > 0.0) {
        for (int i = 0; i < kGLSLuLightArraySize; i++) {
            if (uLights[i].IsLit) {
                lightEffect += applyLight(uLights[i], normal);
            }
        }
    };

    texColor *= lightEffect;

    vec3 r = (vec3(texColor) * (1.0 - uPixelColor.a)) + (vec3(uPixelColor) * uPixelColor.a);
    vec4 result = vec4(r, texColor.a);

    gl_FragColor = result;
}