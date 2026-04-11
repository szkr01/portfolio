// thanks for iq
//https://iquilezles.org/articles/warp/

const vec3 COLOR_1 = vec3(0.05098039, 0.05098039, 0.2509804);
const vec3 COLOR_2 = vec3(0.10196079, 0.6, 0.6509804);
const vec3 COLOR_3 = vec3(1.0, 0.902, 0.702);
const vec3 COLOR_4 = vec3(0.2, 0.4, 0.8);

const float ZOOM = 1.0;
const float SPEED = 0.15;
const float BRIGHTNESS = 10.0;
const float CONTRAST = 4.5;

const float FBM_AMP = 0.49;
const float FBM_GAIN = 0.72;
const float FBM_LACUNARITY = 2.1;
const float CURL_STRENGTH = 4.0;

#define OCTAVES 6

float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(13.9898, 78.233))) * 43758.5453123);
}

float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(in vec2 st) {
  float value = 0.0;
  float amplitude = FBM_AMP;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

  for (int octave = 0; octave < OCTAVES; octave++) {
    value += amplitude * noise(st);
    st = rot * st * FBM_LACUNARITY + shift;
    amplitude *= FBM_GAIN;
  }

  return value;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 st = fragCoord.xy / iResolution.xy;
  st.x *= iResolution.x / iResolution.y;
  st *= ZOOM;

  float t = iTime * SPEED;

  vec2 q = vec2(0.0);
  q.x = fbm(st + 0.05 * t);
  q.y = fbm(st + vec2(1.0));
  
  vec2 r = vec2(0.0);
  r.x = fbm(st + CURL_STRENGTH * q + vec2(1.7, 9.2) + 0.15 * t);
  r.y = fbm(st + CURL_STRENGTH * q + vec2(8.3, 2.8) + 0.126 * t);

  float f = fbm(st + r);

  vec3 color = mix(COLOR_1, COLOR_2, clamp((f * f) * 4.0, 0.0, 1.0));
  color = mix(color, COLOR_3, clamp(length(q) - length(r), 0.0, 1.0));
  color += COLOR_4 * pow(max(f, 0.0), BRIGHTNESS);

  vec2 uv = fragCoord.xy / iResolution.xy;
  float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5) * 1.5);
  color *= vignette;
  color = pow(max(color, 0.0), vec3(CONTRAST));

  fragColor = vec4(color, 1.0);
}
