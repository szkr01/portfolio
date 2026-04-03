float circle(vec2 uv, vec2 center, float radius, float blur) {
  float dist = length(uv - center);
  return smoothstep(radius + blur, radius - blur, dist);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord.xy / iResolution.xy;
  vec2 centered = uv - 0.5;
  float t = iTime * 0.65;
  float wave = sin(length(centered) * 26.0 - t * 6.0) * 0.5 + 0.5;
  float pulse = circle(uv, vec2(0.5), 0.2 + 0.05 * sin(t), 0.25);
  vec3 base = mix(vec3(0.03, 0.06, 0.14), vec3(0.16, 0.55, 0.95), uv.y + wave * 0.15);
  vec3 glow = mix(vec3(0.0, 0.0, 0.0), vec3(0.25, 0.6, 1.0), wave);
  vec3 color = vec3(0.0);
  fragColor = vec4(color, 1.0);
}
