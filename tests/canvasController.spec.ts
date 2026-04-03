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
    expect(controller.getDebugState().pageTimeMs).toBeGreaterThan(0);
  });

  it("starts a live transition, keeps page time advancing, and retains both runtimes until the transition completes", async () => {
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

    const cloudFrames = (cloudRenderer.render as ReturnType<typeof vi.fn>).mock.calls.map(
      (call) => call[0] as CanvasRenderFrame
    );
    const altFrames = (altRenderer.render as ReturnType<typeof vi.fn>).mock.calls.map(
      (call) => call[0] as CanvasRenderFrame
    );

    expect(cloudFrames.length).toBeGreaterThan(0);
    expect(altFrames.length).toBeGreaterThan(0);
    expect(cloudFrames[cloudFrames.length - 1]?.pageTimeMs).toBe(1_300);
    expect(altFrames[altFrames.length - 1]?.pageTimeMs).toBe(1_300);
    expect(transitionRenderer.render).toHaveBeenCalled();

    (animationCallback as unknown as FrameRequestCallback)(2_800);

    expect(cloudRenderer.dispose).toHaveBeenCalledTimes(1);
    expect(controller.getDebugState().transition).toBeNull();
    expect(controller.getDebugState().activeRuntimeKey).toBe("ripple");
  });

  it("passes monotonic page time into renderers and does not reset across runtime changes", async () => {
    const shaderRenderer = createRenderer("shader");
    const secondRenderer = createRenderer("shader");
    const transitionRenderer = {
      mount: vi.fn(),
      render: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      getOutput: vi.fn(() => document.createElement("canvas"))
    };
    let animationCallback: FrameRequestCallback | null = null;
    const controller = createCanvasController({
      rendererFactory: vi
        .fn()
        .mockImplementationOnce(() => shaderRenderer)
        .mockImplementationOnce(() => secondRenderer),
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
        runtimeKey: "flow",
        kind: "shader",
        transitionId: "ripple-mix",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(0.0);}" }
      }
    ]);

    await controller.activate("hero", "init");
    (animationCallback as unknown as FrameRequestCallback)(1_250);
    vi.mocked(performance.now).mockReturnValue(1_600);
    await controller.activate("reel", "manual");
    (animationCallback as unknown as FrameRequestCallback)(1_750);

    const firstRuntimeFrames = (shaderRenderer.render as ReturnType<typeof vi.fn>).mock.calls.map(
      (call) => call[0] as CanvasRenderFrame
    );
    const secondRuntimeFrames = (secondRenderer.render as ReturnType<typeof vi.fn>).mock.calls.map(
      (call) => call[0] as CanvasRenderFrame
    );

    expect(firstRuntimeFrames[0].pageTimeMs).toBeGreaterThanOrEqual(0);
    expect(firstRuntimeFrames[firstRuntimeFrames.length - 1]?.pageTimeMs).toBeGreaterThan(
      firstRuntimeFrames[0].pageTimeMs
    );
    expect(secondRuntimeFrames[0]?.pageTimeMs).toBe(600);
    expect(secondRuntimeFrames[secondRuntimeFrames.length - 1]?.pageTimeMs).toBeGreaterThanOrEqual(
      secondRuntimeFrames[0]?.pageTimeMs ?? 0
    );
  });

  it("redraws the visible canvas immediately after resize so the active scene does not flash blank", async () => {
    const shaderRenderer = createRenderer("shader");
    const transitionRenderer = {
      mount: vi.fn(),
      render: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      getOutput: vi.fn(() => document.createElement("canvas"))
    };
    const controller = createCanvasController({
      rendererFactory: vi.fn(() => shaderRenderer),
      transitionRenderer,
      transitions: [{ id: "ripple-mix", fragmentShader: "void main() {}", durationMs: 600 }],
      requestFrame: vi.fn(() => 1),
      cancelFrame: vi.fn()
    });
    const visibleContext = {
      clearRect: vi.fn(),
      drawImage: vi.fn()
    };
    const canvas = document.createElement("canvas");
    canvas.getBoundingClientRect = vi.fn(() => ({
      width: 320,
      height: 240,
      top: 0,
      left: 0,
      right: 320,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON: () => ({})
    }));
    canvas.getContext = vi.fn((kind: string) => {
      if (kind === "2d") {
        return visibleContext as unknown as CanvasRenderingContext2D;
      }
      return null;
    }) as unknown as HTMLCanvasElement["getContext"];

    controller.bind(canvas);
    controller.registerScenes([
      {
        id: "hero",
        runtimeKey: "cloud",
        kind: "shader",
        source: { fragmentShader: "void mainImage(out vec4 c, in vec2 f){c=vec4(1.0);}" }
      }
    ]);
    await controller.activate("hero", "init");

    visibleContext.clearRect.mockClear();
    visibleContext.drawImage.mockClear();

    controller.resize();

    expect(shaderRenderer.render).toHaveBeenCalled();
    expect(visibleContext.clearRect).toHaveBeenCalledTimes(1);
    expect(visibleContext.drawImage).toHaveBeenCalledTimes(1);
  });
});
