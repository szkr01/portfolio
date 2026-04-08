import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ParallaxContainer from "../src/components/article/ParallaxContainer.vue";
import layer01 from "../src/content/assets/parallax/layer-01.png";
import layer02 from "../src/content/assets/parallax/layer-02.png";
import layer03 from "../src/content/assets/parallax/layer-03.png";
import layer04 from "../src/content/assets/parallax/layer-04.png";
import layer05 from "../src/content/assets/parallax/layer-05.png";
import layer051 from "../src/content/assets/parallax/layer-05-1.png";
import layer06 from "../src/content/assets/parallax/layer-06.png";
import layer061 from "../src/content/assets/parallax/layer-06-1.png";

type FrameCallback = (time: number) => void;

const drawImage = vi.fn();
const clearRect = vi.fn();
const requestAnimationFrameMock = vi.fn<(callback: FrameCallback) => number>();
const cancelAnimationFrameMock = vi.fn();
const queuedFrames: FrameCallback[] = [];
const assignedImageSources: string[] = [];

class MockImage {
  public onload: null | (() => void) = null;
  public onerror: null | (() => void) = null;
  public naturalWidth = 768;
  public naturalHeight = 768;

  set src(value: string) {
    assignedImageSources.push(value);
    queueMicrotask(() => {
      this.onload?.();
    });
  }
}

function flushMicrotasks() {
  return Promise.resolve();
}

function runNextFrame(time = 16) {
  const callback = queuedFrames.shift();
  if (!callback) {
    throw new Error("No animation frame queued");
  }
  callback(time);
}

function computeExpectedTarget(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }) {
  const rawX = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const rawY = ((clientY - rect.top) / rect.height - 0.5) * 2;
  const magnitude = Math.hypot(rawX, rawY);

  if (magnitude <= Math.sqrt(2)) {
    return { x: rawX, y: rawY };
  }

  return {
    x: (rawX / magnitude) * Math.sqrt(2),
    y: (rawY / magnitude) * Math.sqrt(2)
  };
}

describe("ParallaxContainer", () => {
  beforeEach(() => {
    queuedFrames.length = 0;
    assignedImageSources.length = 0;
    drawImage.mockReset();
    clearRect.mockReset();
    requestAnimationFrameMock.mockReset();
    requestAnimationFrameMock.mockImplementation((callback: FrameCallback) => {
      queuedFrames.push(callback);
      return queuedFrames.length;
    });
    cancelAnimationFrameMock.mockReset();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
    vi.stubGlobal("Image", MockImage);
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect,
      drawImage
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tracks page-wide mouse movement and clamps distant offsets", async () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const wrapper = mount(ParallaxContainer, {
      props: {
        animHorizEnabled: false,
        animVertEnabled: false
      },
      attachTo: document.body
    });

    const container = wrapper.get(".parallax-container").element as HTMLElement;
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 100,
      left: 100,
      top: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200,
      toJSON: () => ({})
    });

    await flushMicrotasks();
    await nextTick();

    expect(addEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("blur", expect.any(Function));

    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 900, clientY: 700 }));

    runNextFrame();

    const lastDrawCall = drawImage.mock.calls[drawImage.mock.calls.length - 1];
    const expectedTarget = computeExpectedTarget(900, 700, {
      left: 100,
      top: 100,
      width: 200,
      height: 200
    });

    expect(lastDrawCall).toBeDefined();
    expect(lastDrawCall?.[1]).toBeCloseTo(expectedTarget.x * 15 * 0.08, 2);
    expect(lastDrawCall?.[2]).toBeCloseTo(expectedTarget.y * 15 * 0.08, 2);

    await wrapper.unmount();
  });

  it("loads parallax layers from Vite-resolved asset URLs", async () => {
    const wrapper = mount(ParallaxContainer, {
      attachTo: document.body
    });

    await flushMicrotasks();
    await nextTick();

    expect(assignedImageSources).toEqual([
      layer01,
      layer02,
      layer03,
      layer04,
      layer05,
      layer06,
      layer01,
      layer02,
      layer03,
      layer04,
      layer051,
      layer061
    ]);
    expect(assignedImageSources).not.toContain("src/content/assets/parallax/layer-01.png");

    await wrapper.unmount();
  });
});
