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

struct Material
{
    vec4 Ka;
    vec4 Kd;
    vec4 Ks;
    float Shininess;
};
uniform Material uMaterial;

// Fetches data from the texture
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

uniform vec3 uCameraPosition; 
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

float lightAttenuation(Light light) {
    float atten = 0.0;
    float lightDist = length(light.Position.xyz - gl_FragCoord.xyz);

    if (lightDist <= light.Far) {
        if (lightDist <= light.Near) {
            atten = 1.0;
        } else {
            float n = lightDist - light.Near;
            float d = light.Far - light.Near;
            atten = mySmoothStep(0.0, 1.0, 1.0-(n*n)/(d*d)); 
        }
    }

    return atten;
}

vec4 ambientShading() {
     return uMaterial.Ka + (uGlobalAmbientIntensity * uGlobalAmbientColor);
}

vec4 diffuseShading(Light light, vec3 normalUnitVec) {
    vec3 lightUnitVec = normalize(light.Position.xyz - gl_FragCoord.xyz);
    float diffuseVal = max(0.0, dot(normalUnitVec, lightUnitVec));
    return uMaterial.Kd * diffuseVal;
}

vec4 specularShading(Light light, vec3 normalUnitVec) {
    vec3 cameraUnitVec = normalize(uCameraPosition - gl_FragCoord.xyz);
    float specVal = pow(max(0.0, dot(cameraUnitVec, normalUnitVec)), uMaterial.Shininess);
    return uMaterial.Ks * specVal;
}

vec4 applyLight(Light light, vec3 normalUnitVec) {
    float atten = lightAttenuation(light);
    vec4 lightEffect = vec4(0.0);
    if (atten >= 0.0) {
        lightEffect += diffuseShading(light, normalUnitVec);
        lightEffect += specularShading(light, normalUnitVec);
        lightEffect *= (atten * light.Intensity * light.Color);
        //lightEffect.a = 0.0;
    }
    return lightEffect;
}

void main(void) {
    vec2 texCoord = vec2(vTexCoord.s, vTexCoord.t);
    vec4 texColor = texture2D(uSampler, texCoord);
    vec3 normal = (texture2D(uNormalSampler, texCoord).xyz * 2.0) - 1.0;
  
    vec4 lightEffect = ambientShading();
    if (texColor.a > 0.0) {
        for (int i = 0; i < kGLSLuLightArraySize; i++) {
            if (uLights[i].IsLit) {
                lightEffect += applyLight(uLights[i], normal);
            }
        }
    }
    texColor *= lightEffect;

    vec3 r = (vec3(texColor) * (1.0 - uPixelColor.a)) + (vec3(uPixelColor) * uPixelColor.a);
    vec4 result = vec4(r, texColor.a);

    gl_FragColor = result;
}