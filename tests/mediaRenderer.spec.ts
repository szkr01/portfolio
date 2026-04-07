import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMediaRenderer } from "../src/canvas/renderers/mediaRenderer";
import type { CanvasRenderFrame, CanvasSceneDefinition } from "../src/canvas/types";

class MockImage {
  public src = "";
  public width = 1000;
  public height = 800;

  decode(): Promise<void> {
    return Promise.resolve();
  }
}

function createFrame(pageTimeMs: number): CanvasRenderFrame {
  return {
    globalTimeMs: pageTimeMs,
    pageTimeMs,
    width: 500,
    height: 500
  };
}

describe("createMediaRenderer", () => {
  beforeEach(() => {
    vi.stubGlobal("Image", MockImage);
  });

  it("renders image scenes as a left-anchored square crop scaled from the short edge", async () => {
    const drawImage = vi.fn();
    const renderer = createMediaRenderer("image");
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 500;
    canvas.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage
    })) as unknown as HTMLCanvasElement["getContext"];
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1);

    renderer.mount(canvas);
    await renderer.load({
      id: "image-drift",
      runtimeKey: "image-drift",
      kind: "image",
      source: { src: "/test-image.png" }
    } satisfies CanvasSceneDefinition);
    renderer.render(createFrame(0));

    expect(drawImage).toHaveBeenCalledWith(expect.any(MockImage), 120, 0, 760, 760, 0, 0, 500, 500);
  });

  it("advances to the previous target when a pan segment completes", async () => {
    const drawImage = vi.fn();
    const renderer = createMediaRenderer("image");
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    canvas.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage
    })) as unknown as HTMLCanvasElement["getContext"];
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.75);

    renderer.mount(canvas);
    await renderer.load({
      id: "image-drift",
      runtimeKey: "image-drift",
      kind: "image",
      source: { src: "/test-image.png" }
    } satisfies CanvasSceneDefinition);
    renderer.render(createFrame(0));
    renderer.render(createFrame(20_000));

    const completedSegmentCall = drawImage.mock.calls[1];

    expect(completedSegmentCall?.slice(1)).toEqual([240, 40, 760, 760, 0, 0, 500, 500]);
  });

  it("keeps the current crop position when resize redraws the scene", async () => {
    const drawImage = vi.fn();
    const renderer = createMediaRenderer("image");
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    canvas.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage
    })) as unknown as HTMLCanvasElement["getContext"];
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1);

    renderer.mount(canvas);
    await renderer.load({
      id: "image-drift",
      runtimeKey: "image-drift",
      kind: "image",
      source: { src: "/test-image.png" }
    } satisfies CanvasSceneDefinition);
    renderer.render(createFrame(10_000));

    canvas.width = 320;
    canvas.height = 400;
    renderer.resize(320, 400);

    const beforeResize = drawImage.mock.calls[0];
    const afterResize = drawImage.mock.calls[1];

    expect(beforeResize?.[1]).toBe(120);
    expect(beforeResize?.[2]).toBe(20);
    expect(afterResize?.[1]).toBe(120);
    expect(afterResize?.[2]).toBe(20);
    expect(afterResize?.slice(5)).toEqual([0, 0, 400, 400]);
  });

  it("uses scene-specific image motion settings when provided", async () => {
    const drawImage = vi.fn();
    const renderer = createMediaRenderer("image");
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    canvas.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage
    })) as unknown as HTMLCanvasElement["getContext"];
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1);

    renderer.mount(canvas);
    await renderer.load({
      id: "music",
      runtimeKey: "music",
      kind: "image",
      source: {
        src: "/pool-jacket.png",
        motion: {
          cropScale: 0.75,
          panDurationMs: 8_000
        }
      }
    } satisfies CanvasSceneDefinition);
    renderer.render(createFrame(4_000));

    expect(drawImage).toHaveBeenCalledWith(expect.any(MockImage), 300, 100, 600, 600, 0, 0, 500, 500);
  });
});
