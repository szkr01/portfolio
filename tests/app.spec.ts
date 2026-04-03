import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../src/App.vue";

vi.mock("../src/canvas/useCanvasController", () => ({
  useCanvasController: () => ({
    canvasRef: { value: null },
    setCanvas: vi.fn(),
    themeStyle: { value: {} },
    activate: vi.fn()
  })
}));

describe("App", () => {
  it("renders the migrated layout without upload controls and includes scene-linked sections", () => {
    const wrapper = mount(App);

    expect(wrapper.find('input[type="file"]').exists()).toBe(false);
    expect(wrapper.find("[data-scene-id='hero']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Color Harmony & Contrast");
  });
});
