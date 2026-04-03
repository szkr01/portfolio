import cloudFragmentShader from "../../documents/cloud.frag?raw";
import type { CanvasSceneDefinition } from "./types";

export const canvasScenes: CanvasSceneDefinition[] = [
  {
    id: "hero",
    kind: "shader",
    source: { fragmentShader: cloudFragmentShader }
  },
  {
    id: "complements",
    kind: "shader",
    source: { fragmentShader: cloudFragmentShader }
  },
  {
    id: "contrast",
    kind: "shader",
    source: { fragmentShader: cloudFragmentShader }
  },
  {
    id: "mechanics",
    kind: "shader",
    source: { fragmentShader: cloudFragmentShader }
  }
];
