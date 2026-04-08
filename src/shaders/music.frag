// thanks for iq
//https://iquilezles.org/articles/warp/

// Hash / noise
const float HASH_SCALE = 0.6180339;
const float HASH_MULT  = 25.0;

// FBM
const mat2 FBM_ROTATION = mat2(
    0.85,  0.65,
   -0.65,  0.85
);

const float FBM4_NORM = 0.93752;
const float FBM6_NORM = 0.968751;

// Domain warp / animation
const vec2 FLOW_FREQ_1 = vec2(0.112, 0.13);
const vec2 FLOW_FREQ_2 = vec2(0.132, 0.13);
const float FLOW_WAVE_SCALE = 4.0;
const float DOMAIN_SCALE_BASE = 0.7;
const float DOMAIN_SCALE_ANIM = 0.2;
const float DOMAIN_SCALE_FREQ = 0.05;

// Pattern shaping
const float DETAIL_SCALE = 4.0;
const float PATTERN_OFFSET = 1.0;
const float FBM_SAMPLE_SCALE = 2.0;
const float STRIPE_FREQ = 8.2;
const float STRIPE_POW = 8.2;
const float STRIPE_MIX = 0.5;

// Lighting
const vec3 LIGHT_DIR = normalize(vec3(0.2, 0.4, -0.1));
const float DIFFUSE_BASE = 0.32;
const float DIFFUSE_GAIN = 0.72;

// Colors
const vec3 BASE_COLOR          = vec3(0.2863, 0.4, 0.102);
const vec3 WARP_COLOR          = vec3(0.051, 0.1882, 0.302);
const vec3 HIGHLIGHT_COLOR     = vec3(0.902, 0.902, 0.902);
const vec3 SECONDARY_TINT      = vec3(0.502, 0.2, 0.2745);
const vec3 EDGE_COLOR          = vec3(0.4, 0.0, 0.0);
const vec3 SKY_LIGHT_COLOR     = vec3(0.949, 0.851, 0.902);
const vec3 DIFFUSE_LIGHT_COLOR = vec3(0.1451, 0.098, 0.0471);
const vec3 FINAL_TINT          = vec3(1.2, 1.25, 1.2);

// Vignette
const float VIGNETTE_SCALE = 16.0;

// ------------------------------------------------------------
// Utility
// ------------------------------------------------------------

float hash(vec2 p)
{
    p = fract(p * HASH_SCALE);
    p *= HASH_MULT;
    return fract(p.x * p.y * (p.x + p.y));
}

float noise(vec2 x)
{
    vec2 cell = floor(x);
    vec2 frac = fract(x);

    frac = frac * frac * (3.0 - 2.0 * frac);

    float a = hash(cell + vec2(0.0, 0.0));
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));

    return mix(
        mix(a, b, frac.x),
        mix(c, d, frac.x),
        frac.y
    );
}

// ------------------------------------------------------------
// FBM
// ------------------------------------------------------------

float fbm4(vec2 p)
{
    float f = 0.0;

    f += 0.5000 * (-1.0 + 2.0 * noise(p)); p = FBM_ROTATION * p * 2.02;
    f += 0.2500 * (-1.0 + 2.0 * noise(p)); p = FBM_ROTATION * p * 2.03;
    f += 0.1250 * (-1.0 + 2.0 * noise(p)); p = FBM_ROTATION * p * 2.01;
    f += 0.0625 * (-1.0 + 2.0 * noise(p));

    return f / FBM4_NORM;
}

float fbm6(vec2 p)
{
    float f = 0.0;

    f += 0.500000 * noise(p); p = FBM_ROTATION * p * 8.5;
    f += 0.250000 * noise(p); p = FBM_ROTATION * p * 8.3;
    f += 0.125000 * noise(p); p = FBM_ROTATION * p * 8.7;
    f += 0.062500 * noise(p); p = FBM_ROTATION * p * 8.5;
    f += 0.031250 * noise(p); p = FBM_ROTATION * p * 8.2;
    f += 0.015625 * noise(p);

    return f / FBM6_NORM;
}

vec2 fbm4_2(vec2 p)
{
    return vec2(
        fbm4(p + vec2(1.0)),
        fbm4(p + vec2(6.2))
    );
}

vec2 fbm6_2(vec2 p){
  return vec2(
      fbm6(p + vec2(9.2)),
      fbm6(p + vec2(5.7))
  );
}

// ------------------------------------------------------------
// Main field
// ------------------------------------------------------------

float func(vec2 q, out vec2 o, out vec2 n)
{
    q += 0.05 * sin(FLOW_FREQ_1 * iTime + length(q) * FLOW_WAVE_SCALE);
    q *= DOMAIN_SCALE_BASE + DOMAIN_SCALE_ANIM * cos(DOMAIN_SCALE_FREQ * iTime);

    o = 0.5 + 0.5 * fbm4_2(q);
    o += 0.02 * sin(FLOW_FREQ_2 * iTime * length(o));

    n = fbm6_2(DETAIL_SCALE * o);

    vec2 p = q + 2.0 * n + PATTERN_OFFSET;

    float f = 0.5 + 0.5 * fbm4(FBM_SAMPLE_SCALE * p);
    f = mix(f, f * f * f * 3.45, f * abs(n.x));

    float stripes = 0.5 + 0.5 * sin(STRIPE_FREQ * p.x) * sin(STRIPE_FREQ * p.y);
    f *= 1.0 - STRIPE_MIX * pow(stripes, STRIPE_POW);

    return f;
}

float sampleField(vec2 q)
{
    vec2 o, n;
    return func(q, o, n);
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 q = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec2 o, n;
    float f = func(q, o, n);

    vec3 col = BASE_COLOR;
    col = mix(col, WARP_COLOR, f);
    col = mix(col, HIGHLIGHT_COLOR, dot(n, n));
    col = mix(col, SECONDARY_TINT, 0.5 * o.y * o.y);
    col = mix(col, EDGE_COLOR, 0.5 * smoothstep(1.2, 1.3, abs(n.y) + abs(n.x)));
    col *= f * 2.0;

    vec2 dx = vec2(1.0 / iResolution.x, 0.0);
    vec2 dy = vec2(0.0, 1.0 / iResolution.y);

    vec3 normal = normalize(vec3(
        sampleField(q + dx) - f,
        dx.x,
        sampleField(q + dy) - f
    ));

    float diffuse = clamp(
        DIFFUSE_BASE + DIFFUSE_GAIN * dot(normal, LIGHT_DIR),
        0.0,
        1.0
    );

    vec3 lighting  = SKY_LIGHT_COLOR * (normal.y * 0.5 + 0.5);
    lighting += DIFFUSE_LIGHT_COLOR * diffuse;

    col *= lighting;
    col = vec3(1.0) - col;
    col = col * col;
    col *= FINAL_TINT;

    vec2 uv = fragCoord / iResolution.xy;
    float vignette = 0.5 + 0.5 * sqrt(
        VIGNETTE_SCALE * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y)
    );

    col *= vignette;

    fragColor = vec4(col, 1.0);
}