import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import App from "../src/App.vue";
import { articlePages } from "../src/content/articlePages";

const activate = vi.fn();

vi.mock("../src/canvas/useCanvasController", () => ({
  useCanvasController: () => ({
    canvasRef: { value: null },
    setCanvas: vi.fn(),
    themeStyle: { value: {} },
    activate
  })
}));

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/",
        redirect: `/articles/${articlePages[0].slug}`
      },
      ...articlePages.map((entry) => ({
        path: `/articles/${entry.slug}`,
        name: entry.slug,
        component: entry.component,
        meta: {
          article: entry
        }
      }))
    ]
  });
}

describe("App", () => {
  it("renders article navigation and the active route article in the right pane", async () => {
    activate.mockReset();
    const router = createTestRouter();
    await router.push(`/articles/${articlePages[0].slug}`);
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    });
    await nextTick();

    expect(wrapper.find('input[type="file"]').exists()).toBe(false);
    expect(wrapper.findAll("[data-article-link]").length).toBe(articlePages.length);
    expect(wrapper.text()).toContain("Color Harmony & Contrast");
  });

  it("activates the destination article scene when the route changes", async () => {
    activate.mockReset();
    const router = createTestRouter();
    await router.push(`/articles/${articlePages[0].slug}`);
    await router.isReady();

    mount(App, {
      global: {
        plugins: [router]
      }
    });
    await nextTick();

    await router.push(`/articles/${articlePages[1].slug}`);
    await nextTick();

    expect(activate).toHaveBeenCalledWith(articlePages[0].sceneId, "init");
    expect(activate).toHaveBeenCalledWith(articlePages[1].sceneId, "manual");
  });

  it("applies the active article pane ratio to the canvas and article panes", async () => {
    activate.mockReset();
    const router = createTestRouter();
    await router.push(`/articles/${articlePages[0].slug}`);
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    });
    await nextTick();

    expect(wrapper.get("#left-pane").attributes("style")).toContain("flex-grow: 1;");
    expect(wrapper.get("#right-pane").attributes("style")).toContain("flex-grow: 1;");

    await router.push(`/articles/${articlePages[1].slug}`);
    await nextTick();

    expect(wrapper.get("#left-pane").attributes("style")).toContain("flex-grow: 1;");
    expect(wrapper.get("#right-pane").attributes("style")).toContain("flex-grow: 3;");
  });
});
