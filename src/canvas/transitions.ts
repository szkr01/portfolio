import liveTransitionFragmentShader from "../shaders/liveTransition.frag?raw";
import type { CanvasTransitionDefinition } from "./types";

export const canvasTransitions: CanvasTransitionDefinition[] = [
  {
    id: "live-mix",
    fragmentShader: liveTransitionFragmentShader,
    durationMs: 1000
  }
];
