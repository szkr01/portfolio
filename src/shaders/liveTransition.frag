void main() {
  float eased = smoothstep(0.0, 1.0, u_progress);
  vec2 v_uv_transformed = fract(v_uv);
  vec4 fromColor = texture2D(u_from, v_uv_transformed);
  vec4 toColor = texture2D(u_to, v_uv_transformed);
  gl_FragColor = mix(fromColor, toColor, eased);
}
