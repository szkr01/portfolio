import cloudFragmentShader from "../../documents/cloud.frag?raw";
import rippleFragmentShader from "../shaders/ripple.frag?raw";
import type { CanvasSceneDefinition } from "./types";

export const canvasScenes: CanvasSceneDefinition[] = [
  {
    id: "hero",
    runtimeKey: "cloud",
    kind: "shader",
    source: { fragmentShader: cloudFragmentShader }
  },
  {
    id: "complements",
    runtimeKey: "cloud",
    kind: "shader",
    source: { fragmentShader: cloudFragmentShader }
  },
  {
    id: "contrast",
    runtimeKey: "cloud",
    kind: "shader",
    source: { fragmentShader: cloudFragmentShader }
  },
  {
    id: "mechanics",
    runtimeKey: "ripple",
    kind: "shader",
    transitionId: "live-mix",
    source: { fragmentShader: rippleFragmentShader }
  }
];
