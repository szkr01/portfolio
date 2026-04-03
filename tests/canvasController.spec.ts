import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCanvasController } from "../src/canvas/controller";
import type {
  CanvasRenderer,
  CanvasRendererFactory,
  CanvasRenderFrame,
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
    captureFrame: vi.fn(() => document.createElement("canvas"))
  };
}

describe("createCanvasController", () => {
  beforeEach(() => {
    vi.spyOn(performance, "now").mockReturnValue(1_000);
  });

  it("reuses the same runtime across section ids that share a runtimeKey", async () => {
    const shaderRenderer = createRenderer("shader");
    const transitionRenderer = {
      mount: vi.fn(),
      render: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      getOutput: vi.fn(() => document.createElement("canvas"))
    };
    const factory: CanvasRendererFactory = vi.fn(() => shaderRenderer);
    const controller = createCanvasController({
      rendererFactory: factory,
      transitionRenderer,
      transitions: [{ id: "ripple-mix", fragmentShader: "void main() {}", durationMs: 600 }],
      requestFrame: vi.fn(() => 1),
      cancelFrame: vi.fn()
    });
    const canvas = document.createElement("canvas");
    const scenes: CanvasSceneDefinition[] = [
      {
        id: "hero",
        runtimeKey: "cloud",
        kind: "shader",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(1.0);}" }
      },
      {
        id: "complements",
        runtimeKey: "cloud",
        kind: "shader",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(1.0);}" }
      }
    ];

    controller.bind(canvas);
    controller.registerScenes(scenes);
    await controller.activate("hero", "init");
    vi.mocked(performance.now).mockReturnValue(1_600);
    await controller.activate("complements", "scroll");

    expect(factory).toHaveBeenCalledTimes(1);
    expect(shaderRenderer.load).toHaveBeenCalledTimes(1);
    expect(transitionRenderer.render).not.toHaveBeenCalled();
    expect(controller.getDebugState().activeRuntimeKey).toBe("cloud");
    expect(controller.getDebugState().activeSceneId).toBe("complements");
    expect(controller.getDebugState().runtimeSceneTimeMs).toBeGreaterThan(0);
  });

  it("starts a live transition and retains both runtimes until the transition completes", async () => {
    const cloudRenderer = createRenderer("shader");
    const altRenderer = createRenderer("shader");
    const transitionRenderer = {
      mount: vi.fn(),
      render: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      getOutput: vi.fn(() => document.createElement("canvas"))
    };
    const factory: CanvasRendererFactory = vi
      .fn()
      .mockImplementationOnce(() => cloudRenderer)
      .mockImplementationOnce(() => altRenderer);
    let animationCallback: FrameRequestCallback | null = null;
    const controller = createCanvasController({
      rendererFactory: factory,
      transitionRenderer,
      transitions: [{ id: "ripple-mix", fragmentShader: "void main() {}", durationMs: 600 }],
      requestFrame: vi.fn((cb: FrameRequestCallback) => {
        animationCallback = cb;
        return 1;
      }),
      cancelFrame: vi.fn()
    });

    controller.bind(document.createElement("canvas"));
    controller.registerScenes([
      {
        id: "hero",
        runtimeKey: "cloud",
        kind: "shader",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(1.0);}" }
      },
      {
        id: "reel",
        runtimeKey: "ripple",
        kind: "shader",
        transitionId: "ripple-mix",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(0.0);}" }
      }
    ]);

    await controller.activate("hero", "init");
    vi.mocked(performance.now).mockReturnValue(2_000);
    await controller.activate("reel", "manual");

    expect(cloudRenderer.load).toHaveBeenCalledTimes(1);
    expect(altRenderer.load).toHaveBeenCalledTimes(1);
    expect(controller.getDebugState().transition?.running).toBe(true);
    expect(controller.getDebugState().transition?.fromRuntimeKey).toBe("cloud");
    expect(controller.getDebugState().transition?.toRuntimeKey).toBe("ripple");

    expect(animationCallback).not.toBeNull();
    (animationCallback as unknown as FrameRequestCallback)(2_300);

    expect((cloudRenderer.render as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(0);
    expect((altRenderer.render as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(0);
    expect(transitionRenderer.render).toHaveBeenCalled();

    (animationCallback as unknown as FrameRequestCallback)(2_800);

    expect(cloudRenderer.dispose).toHaveBeenCalledTimes(1);
    expect(controller.getDebugState().transition).toBeNull();
    expect(controller.getDebugState().activeRuntimeKey).toBe("ripple");
  });

  it("passes monotonic scene time into renderers", async () => {
    const shaderRenderer = createRenderer("shader");
    const transitionRenderer = {
      mount: vi.fn(),
      render: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      getOutput: vi.fn(() => document.createElement("canvas"))
    };
    let animationCallback: FrameRequestCallback | null = null;
    const controller = createCanvasController({
      rendererFactory: vi.fn(() => shaderRenderer),
      transitionRenderer,
      transitions: [{ id: "ripple-mix", fragmentShader: "void main() {}", durationMs: 600 }],
      requestFrame: vi.fn((cb: FrameRequestCallback) => {
        animationCallback = cb;
        return 1;
      }),
      cancelFrame: vi.fn()
    });

    controller.bind(document.createElement("canvas"));
    controller.registerScenes([
      {
        id: "hero",
        runtimeKey: "cloud",
        kind: "shader",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(1.0);}" }
      }
    ]);

    await controller.activate("hero", "init");
    (animationCallback as unknown as FrameRequestCallback)(1_250);
    (animationCallback as unknown as FrameRequestCallback)(1_500);

    const frames = (shaderRenderer.render as ReturnType<typeof vi.fn>).mock.calls.map(
      (call) => call[0] as CanvasRenderFrame
    );

    expect(frames[0].sceneTimeMs).toBeGreaterThanOrEqual(0);
    expect(frames[frames.length - 1]?.sceneTimeMs).toBeGreaterThan(frames[0].sceneTimeMs);
  });
});
