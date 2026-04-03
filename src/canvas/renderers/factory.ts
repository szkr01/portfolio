import type { CanvasRendererFactory } from "../types";
import { createMediaRenderer } from "./mediaRenderer";
import { createShaderRenderer } from "./shaderRenderer";

export const createRendererFactory = (): CanvasRendererFactory => {
  return (kind) => {
    switch (kind) {
      case "shader":
        return createShaderRenderer();
      case "image":
        return createMediaRenderer("image");
      case "video":
        return createMediaRenderer("video");
    }
  };
};
