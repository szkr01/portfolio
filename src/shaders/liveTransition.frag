out vec4 fragColor;

void main() {
  float eased = smoothstep(0.0, 1.0, u_progress);
  vec2 v_uv_transformed = fract(v_uv);
  vec4 fromColor = texture(u_from, v_uv_transformed);
  vec4 toColor = texture(u_to, v_uv_transformed);
  fragColor = mix(fromColor, toColor, eased);
}
