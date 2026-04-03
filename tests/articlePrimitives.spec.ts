import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArticleQuote from "../src/components/article/ArticleQuote.vue";
import ArticleText from "../src/components/article/ArticleText.vue";

describe("article primitives", () => {
  it("renders body copy through a stable text primitive", () => {
    const wrapper = mount(ArticleText, {
      slots: {
        default: "A paragraph of article copy."
      }
    });

    expect(wrapper.text()).toContain("A paragraph of article copy.");
    expect(wrapper.classes()).toContain("theme-text");
    expect(wrapper.classes()).toContain("leading-relaxed");
  });

  it("renders quote content and attribution with encapsulated styling", () => {
    const wrapper = mount(ArticleQuote, {
      props: {
        attribution: "Pierre Bonnard"
      },
      slots: {
        default: '"Color does not add a pleasant quality to design - it reinforces it."'
      }
    });

    expect(wrapper.text()).toContain("Pierre Bonnard");
    expect(wrapper.classes()).toContain("theme-surface");
    expect(wrapper.classes()).toContain("theme-accent-2-border");
  });
});
