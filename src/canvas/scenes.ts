import { articleSectionDefinitions } from "../content/articleSectionDefinitions";
import cloudFragmentShader from "../shaders/cloud.frag?raw";
import rippleFragmentShader from "../shaders/ripple.frag?raw";
import type { CanvasSceneDefinition } from "./types";

const sharedCloudSceneIds = new Set(["hero", "complements", "contrast"]);

export const canvasScenes: CanvasSceneDefinition[] = articleSectionDefinitions.map((entry) => {
  if (sharedCloudSceneIds.has(entry.sceneId)) {
    return {
      id: entry.sceneId,
      runtimeKey: "cloud",
      kind: "shader",
      source: { fragmentShader: cloudFragmentShader }
    };
  }

  return {
    id: entry.sceneId,
    runtimeKey: "ripple",
    kind: "shader",
    transitionId: "live-mix",
    source: { fragmentShader: rippleFragmentShader }
  };
});
