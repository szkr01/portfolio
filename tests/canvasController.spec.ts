import { describe, expect, it, vi } from "vitest";
import { createCanvasController } from "../src/canvas/controller";
import type {
  CanvasRenderer,
  CanvasRendererFactory,
  CanvasSceneDefinition
} from "../src/canvas/types";

function createRenderer(kind: CanvasRenderer["kind"] = "shader"): CanvasRenderer {
  return {
    kind,
    mount: vi.fn(),
    load: vi.fn().mockResolvedValue(undefined),
    render: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    captureFrame: vi.fn(() => null)
  };
}

describe("createCanvasController", () => {
  it("activates the requested scene and avoids reloading the same scene twice", async () => {
    const shaderRenderer = createRenderer("shader");
    const factory: CanvasRendererFactory = vi.fn(() => shaderRenderer);
    const controller = createCanvasController({
      rendererFactory: factory,
      requestFrame: vi.fn(() => 1),
      cancelFrame: vi.fn()
    });
    const canvas = document.createElement("canvas");
    const scenes: CanvasSceneDefinition[] = [
      {
        id: "hero",
        kind: "shader",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(1.0);}" }
      }
    ];

    controller.bind(canvas);
    controller.registerScenes(scenes);
    await controller.activate("hero", "init");
    await controller.activate("hero", "scroll");

    expect(factory).toHaveBeenCalledTimes(1);
    expect(shaderRenderer.mount).toHaveBeenCalledWith(canvas);
    expect(shaderRenderer.load).toHaveBeenCalledTimes(1);
    expect(shaderRenderer.render).toHaveBeenCalled();
  });

  it("switches renderers when the scene kind changes", async () => {
    const shaderRenderer = createRenderer("shader");
    const videoRenderer = createRenderer("video");
    const factory: CanvasRendererFactory = vi
      .fn()
      .mockImplementationOnce(() => shaderRenderer)
      .mockImplementationOnce(() => videoRenderer);
    const controller = createCanvasController({
      rendererFactory: factory,
      requestFrame: vi.fn(() => 1),
      cancelFrame: vi.fn()
    });

    controller.bind(document.createElement("canvas"));
    controller.registerScenes([
      {
        id: "hero",
        kind: "shader",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(1.0);}" }
      },
      {
        id: "reel",
        kind: "video",
        source: { src: "/demo.mp4" }
      }
    ]);

    await controller.activate("hero", "init");
    await controller.activate("reel", "manual");

    expect(shaderRenderer.dispose).toHaveBeenCalledTimes(1);
    expect(videoRenderer.load).toHaveBeenCalledTimes(1);
  });
});
