let flowShader;
let gui;

const params = {
  // 色設定
  color1: '#0d0d40', 
  color2: '#1a99a6', 
  color3: '#ffe6b3', 
  color4: '#3366cc', 
  
  // 全体設定
  zoom: 1.0,
  speed: 0.15,
  brightness: 10.0,
  contrast: 5.0,
  
  // FBM (ノイズの質感) 設定
  fbmAmp: 0.5,        // 初期の振幅
  fbmGain: 0.8,       // 減衰率（高いとノイズが荒くなる）
  fbmLacunarity: 2.0, // 周波数の倍率
  curlStrength: 1.0   // 歪みの強さ
};

const vertSource = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; 
  gl_Position = positionVec4;
}
`;

const fragSource = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Colors
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_c4;

// Settings
uniform float u_zoom;
uniform float u_brightness;
uniform float u_contrast;

// FBM Settings
uniform float u_fbm_amp;
uniform float u_fbm_gain;
uniform float u_fbm_lacunarity;
uniform float u_curl_strength;

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6

float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = u_fbm_amp;
    float frequency = 0.0;
    
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st = rot * st * u_fbm_lacunarity + shift;
        amplitude *= u_fbm_gain;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    st *= u_zoom; 
    
    vec2 mouse = u_mouse * u_resolution / u_resolution.y;
    
    vec3 color = vec3(0.0);
    
    // Domain Warping (領域のゆがみ)
    vec2 q = vec2(0.);
    q.x = fbm(st + 0.00 * u_time);
    q.y = fbm(st + vec2(1.0));
    
    vec2 r = vec2(0.);
    // u_curl_strength を適用して歪みを制御
    r.x = fbm(st + u_curl_strength * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(st + u_curl_strength * q + vec2(8.3, 2.8) + 0.126 * u_time);
    
    float f = fbm(st + r);
    
    color = mix(u_c1, u_c2, clamp((f*f)*4.0, 0.0, 1.0));
    color = mix(color, u_c3, clamp(length(q) - length(r), 0.0, 1.0));
    
    color += u_c4 * pow(f, u_brightness);
    
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(gl_FragCoord.xy / u_resolution.xy - 0.5) * 1.5);
    color *= vignette;
    
    color = pow(color, vec3(u_contrast));

    gl_FragColor = vec4(color, 1.0);
}
`;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  flowShader = createShader(vertSource, fragSource);
  
  gui = new lil.GUI();
  
  // 色設定
  const folderColor = gui.addFolder('Colors');
  folderColor.addColor(params, 'color1').name('Base');
  folderColor.addColor(params, 'color2').name('Mid');
  folderColor.addColor(params, 'color3').name('High');
  folderColor.addColor(params, 'color4').name('Glow');
  
  // ノイズ(FBM)設定フォルダ
  const folderFbm = gui.addFolder('Noise Structure');
  // 歪みの強さ：0に近いと煙、高いと油絵の具のように混ざる
  folderFbm.add(params, 'curlStrength', 0.0, 3.0).name('Curl Strength');
  // 粗さ：0.5付近が滑らか、0.8以上でザラザラ、1.0を超えるとカオス
  folderFbm.add(params, 'fbmGain', 0.3, 1.0).name('Roughness (Gain)');
  // 細かさの倍率：通常2.0
  folderFbm.add(params, 'fbmLacunarity', 1.0, 4.0).name('Detail Scale');
  // 初期の強さ
  folderFbm.add(params, 'fbmAmp', 0.1, 1.0).name('Amplitude');

  // 全体設定
  const folderParams = gui.addFolder('Global Settings');
  folderParams.add(params, 'zoom', 0.1, 5.0).name('Zoom');
  folderParams.add(params, 'speed', 0.0, 1.0).name('Speed');
  folderParams.add(params, 'brightness', 1.0, 20.0).name('Sharpness');
  folderParams.add(params, 'contrast', 1.0, 10.0).name('Contrast');
}

function draw() {
  shader(flowShader);
  
  const c1 = color(params.color1);
  const c2 = color(params.color2);
  const c3 = color(params.color3);
  const c4 = color(params.color4);
  
  flowShader.setUniform("u_resolution", [width, height]);
  flowShader.setUniform("u_time", (millis() / 1000.0) * params.speed);
  flowShader.setUniform("u_mouse", [mouseX, height - mouseY]);
  
  flowShader.setUniform("u_c1", [red(c1)/255, green(c1)/255, blue(c1)/255]);
  flowShader.setUniform("u_c2", [red(c2)/255, green(c2)/255, blue(c2)/255]);
  flowShader.setUniform("u_c3", [red(c3)/255, green(c3)/255, blue(c3)/255]);
  flowShader.setUniform("u_c4", [red(c4)/255, green(c4)/255, blue(c4)/255]);
  
  flowShader.setUniform("u_zoom", params.zoom);
  flowShader.setUniform("u_brightness", params.brightness);
  flowShader.setUniform("u_contrast", params.contrast);
  
  // 新しいFBM関連パラメータを送信
  flowShader.setUniform("u_fbm_amp", params.fbmAmp);
  flowShader.setUniform("u_fbm_gain", params.fbmGain);
  flowShader.setUniform("u_fbm_lacunarity", params.fbmLacunarity);
  flowShader.setUniform("u_curl_strength", params.curlStrength);
  
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}