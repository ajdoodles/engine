precision mediump float;

const int kGLSLuLightArraySize = 4;
const int ePointLight = 0;
const int eDirectionLight = 1;
const int eSpotLight = 2;

const bool kDebug = false;

struct Light
{
    int LightType;
    bool IsLit;
    vec4 Color;
    vec3 Position; // in pixel space
    vec3 Direction; // used by direction/spot lights
    float Intensity;
    float Near;
    float Far; 
    float Dropoff;
    float CosInner; // used by spotlights
    float CosOuter; // used by spotlights
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

// Returns the unit vector of the light hitting the fragment.
vec3 getLightUnitVec(Light light) {
    if (light.LightType == ePointLight || light.LightType == eSpotLight) {
        return normalize(light.Position.xyz - gl_FragCoord.xyz);
    } else if (light.LightType == eDirectionLight) {
        return -normalize(light.Direction);
    }
}

float distanceDropoff(Light light) {
    float atten = 0.0;
    float lightDist = length(light.Position.xyz - gl_FragCoord.xyz);

    float fuzz = 0.1;

    if (kDebug && lightDist < light.Far + fuzz && lightDist > light.Far - fuzz) {
        return 500.0;
    }
    if (kDebug && lightDist < light.Near + fuzz && lightDist > light.Near - fuzz) {
        return 500.0;
    }

    if (lightDist < light.Far) {
        if (lightDist < light.Near) {
            atten = 1.0;
        } else {
            float n = lightDist - light.Near;
            float d = light.Far - light.Near;
            atten = mySmoothStep(0.0, 1.0, 1.0-(n*n)/(d*d));
        }
    }

    return atten;
}

float angularDropoff(Light light) {
    float atten = 0.0;
    float cosFrag = dot(normalize(light.Direction), -getLightUnitVec(light));
    float cosOffset = cosFrag - light.CosOuter;

    float fuzz = 0.01;

    if (kDebug && cosOffset < fuzz && cosOffset > -fuzz) {
        return 500.0;
    }
    if (kDebug && cosFrag < light.CosInner + fuzz && cosFrag > light.CosInner - fuzz) {
        return 500.0;
    }

    if (cosOffset > 0.0) {
        if (cosFrag > light.CosInner) {
            atten = 1.0;
        } else {
            float cosRange = light.CosInner - light.CosOuter;
            atten = mySmoothStep(0.0, 1.0, pow(cosOffset/cosRange, light.Dropoff));
            //atten = 1.0;
        }
    }

    return atten;
}

vec4 ambientShading() {
     return uMaterial.Ka + (uGlobalAmbientIntensity * uGlobalAmbientColor);
}

vec4 diffuseShading(vec3 lightUnitVec, vec3 normalUnitVec) {
    float diffuseVal = max(0.0, dot(normalUnitVec, lightUnitVec));
    return uMaterial.Kd * diffuseVal;
}

vec4 specularShading(vec3 lightUnitVec, vec3 normalUnitVec) {
    vec3 cameraUnitVec = normalize(uCameraPosition - gl_FragCoord.xyz);
    vec3 lightCameraBisectVec = (cameraUnitVec + lightUnitVec) * 0.5;
    float specVal = pow(max(0.0, dot(normalUnitVec, lightCameraBisectVec)), uMaterial.Shininess);
    return uMaterial.Ks * specVal;
}

vec4 applyLight(Light light, vec3 normalUnitVec) {
    float dirAtten = 1.0;
    float angleAtten = 1.0;
    bool highlight = false;
    if (light.LightType != eDirectionLight) {
        dirAtten = distanceDropoff(light);
    }
    if (light.LightType == eSpotLight) {
        angleAtten = angularDropoff(light);
    }

    if (dirAtten < 0.0 || angleAtten < 0.0) {
        dirAtten = abs(dirAtten);
        angleAtten = abs(angleAtten);
        highlight = kDebug;
    }
    
    if (highlight) {
        return vec4(0.0, 0.0, 0.0, 0.0);
    }

    vec4 lightEffect = vec4(0.0);
    float atten = angleAtten * dirAtten;
    if (atten > 0.0) {
        vec3 lightUnitVec = getLightUnitVec(light);
        lightEffect += diffuseShading(lightUnitVec, normalUnitVec);
        lightEffect += specularShading(lightUnitVec, normalUnitVec);
        lightEffect *= (atten * light.Intensity * light.Color);
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