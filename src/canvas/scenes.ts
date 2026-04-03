import { articlePages } from "../content/articlePages";
import cloudFragmentShader from "../shaders/cloud.frag?raw";
import flowFragmentShader from "../shaders/flow.frag?raw";
import type { CanvasSceneDefinition } from "./types";

export const canvasScenes: CanvasSceneDefinition[] = articlePages.map((entry) => {
  if (entry.sceneId === "color-harmony") {
    return {
      id: entry.sceneId,
      runtimeKey: "cloud",
      kind: "shader",
      transitionId: "live-mix",
      source: { fragmentShader: cloudFragmentShader }
    };
  }

  return {
    id: entry.sceneId,
    runtimeKey: "flow",
    kind: "shader",
    transitionId: "live-mix",
    source: { fragmentShader: flowFragmentShader }
  };
});
