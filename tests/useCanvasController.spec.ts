import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const bind = vi.fn();
const registerScenes = vi.fn();
const resize = vi.fn();
const subscribeTheme = vi.fn(() => () => undefined);
const dispose = vi.fn();

vi.mock("../src/canvas/controller", () => ({
  createCanvasController: () => ({
    bind,
    registerScenes,
    resize,
    subscribeTheme,
    activate: vi.fn(),
    dispose,
    getDebugState: vi.fn()
  })
}));

import { useCanvasController } from "../src/canvas/useCanvasController";

class ResizeObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();

  constructor(public callback: ResizeObserverCallback) {}
}

const resizeObserverInstances: ResizeObserverMock[] = [];

describe("useCanvasController", () => {
  beforeEach(() => {
    resizeObserverInstances.length = 0;
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn((callback: ResizeObserverCallback) => {
        const instance = new ResizeObserverMock(callback);
        resizeObserverInstances.push(instance);
        return instance;
      })
    );
    bind.mockReset();
    registerScenes.mockReset();
    resize.mockReset();
    subscribeTheme.mockClear();
    dispose.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resizes the controller when the canvas element size changes", async () => {
    const TestHarness = defineComponent({
      setup() {
        const { setCanvas } = useCanvasController();
        return { setCanvas };
      },
      template: `
        <canvas
          :ref="
            (node) => {
              if (node && typeof node.getContext === 'function') {
                setCanvas(node);
              } else {
                setCanvas(null);
              }
            }
          "
        />
      `
    });

    mount(TestHarness);
    await nextTick();

    const observerInstance = resizeObserverInstances[0];

    expect(observerInstance.observe).toHaveBeenCalledTimes(1);

    observerInstance.callback([], observerInstance as unknown as ResizeObserver);

    expect(resize).toHaveBeenCalledTimes(1);
  });
});
