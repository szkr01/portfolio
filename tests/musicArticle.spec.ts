import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MusicArticlePage from "../src/content/articles/MusicArticlePage.vue";

describe("MusicArticlePage", () => {
  it("renders the Pool jacket as an image while keeping the second track section", () => {
    const wrapper = mount(MusicArticlePage);

    const poolJacket = wrapper.get('[data-testid="pool-jacket"]');

    expect(poolJacket.attributes("src")).toContain("pool_jacket");
    expect(poolJacket.attributes("alt")).toBe("Pool jacket");
    expect(wrapper.text()).toContain("Pool");
    expect(wrapper.text()).toContain("Digital Drift");
  });
});
