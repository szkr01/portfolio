import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { useSectionSceneActivation } from "../src/composables/useSectionSceneActivation";

describe("useSectionSceneActivation", () => {
  it("activates a scene when an observed section becomes visible", async () => {
    const activate = vi.fn();
    let observer: IntersectionObserver | null = null;
    let observedElement: Element | null = null;

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        observer = {
          observe: vi.fn((element: Element) => {
            observedElement = element;
          }),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
          root: null,
          rootMargin: "",
          thresholds: [],
          takeRecords: vi.fn(),
          callback
        } as unknown as IntersectionObserver;
        return observer;
      })
    );

    const Harness = defineComponent({
      setup() {
        const { registerSection } = useSectionSceneActivation({ activate });
        return () =>
          h("section", {
            ref: (node) => registerSection("hero", node as Element | null)
          });
      }
    });

    mount(Harness);
    await nextTick();

    expect(observer).not.toBeNull();
    (observer as unknown as { callback: IntersectionObserverCallback }).callback(
      [
        {
          isIntersecting: true,
          intersectionRatio: 0.8,
          target: observedElement as unknown as Element
        } as IntersectionObserverEntry
      ],
      observer as unknown as IntersectionObserver
    );

    expect(activate).toHaveBeenCalledWith("hero", "scroll");
  });
});
