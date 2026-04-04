import { articlePages } from "../content/articlePages";
import imageDriftAsset from "../content/assets/articles/image-drift/testImage.webp";
import cloudFragmentShader from "../shaders/cloud.frag?raw";
import flowFragmentShader from "../shaders/flow.frag?raw";
import type { CanvasSceneDefinition } from "./types";

export const canvasScenes: CanvasSceneDefinition[] = articlePages.map((entry) => {
  if (entry.sceneId === "About") {
    return {
      id: entry.sceneId,
      runtimeKey: "cloud",
      kind: "shader",
      themeMode: entry.themeMode,
      transitionId: "live-mix",
      source: { fragmentShader: cloudFragmentShader }
    };
  }

  if (entry.sceneId === "motion-field") {
    return {
      id: entry.sceneId,
      runtimeKey: "flow",
      kind: "shader",
      themeMode: entry.themeMode,
      transitionId: "live-mix",
      source: { fragmentShader: flowFragmentShader }
    };
  }

  return {
    id: entry.sceneId,
    runtimeKey: "image-drift",
    kind: "image",
    themeMode: entry.themeMode,
    transitionId: "live-mix",
    source: { src: imageDriftAsset }
  };
});
