import imageDriftAsset from "../content/assets/articles/image-drift/testImage.jpg";
import cloudFragmentShader from "../shaders/cloud.frag?raw";
import flowFragmentShader from "../shaders/flow.frag?raw";
import musicFragmentShader from "../shaders/music.frag?raw";
import type { CanvasSceneDefinition } from "./types";

export const canvasScenes: CanvasSceneDefinition[] = [
  {
    id: "About",
    runtimeKey: "cloud",
    kind: "shader",
    themeMode: "light",
    transitionId: "live-mix",
    source: { fragmentShader: cloudFragmentShader }
  },
  {
    id: "works",
    runtimeKey: "flow",
    kind: "shader",
    themeMode: "dark",
    transitionId: "live-mix",
    source: { fragmentShader: flowFragmentShader }
  },
  {
    id: "music",
    runtimeKey: "music",
    kind: "shader",
    themeMode: "light",
    transitionId: "live-mix",
    source: { fragmentShader: musicFragmentShader }
  },
  {
    id: "contact",
    runtimeKey: "image-drift",
    kind: "image",
    themeMode: "light",
    transitionId: "live-mix",
    source: { src: imageDriftAsset }
  },
  {
    id: "image-drift",
    runtimeKey: "image-drift",
    kind: "image",
    themeMode: "light",
    transitionId: "live-mix",
    source: { src: imageDriftAsset }
  }
];
