import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ArticleSceneSection from "../src/components/article/ArticleSceneSection.vue";

describe("ArticleSceneSection", () => {
  it("registers the root element and applies the scene id automatically", () => {
    const registerSection = vi.fn();
    const wrapper = mount(ArticleSceneSection, {
      props: {
        as: "section",
        sceneId: "mechanics",
        registerSection
      },
      slots: {
        default: "<p>Section body</p>"
      }
    });

    const section = wrapper.get("section");

    expect(section.attributes("data-scene-id")).toBe("mechanics");
    expect(registerSection).toHaveBeenCalledWith("mechanics", section.element);
    expect(wrapper.text()).toContain("Section body");
  });
});
