import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MusicArticlePage from "../src/content/articles/MusicArticlePage.vue";

describe("MusicArticlePage", () => {
  it("renders both tracks from the data-driven track list while keeping the Pool jacket image", () => {
    const wrapper = mount(MusicArticlePage);

    const poolJacket = wrapper.get('[data-testid="pool-jacket"]');
    const headings = wrapper.findAll("h2");

    expect(poolJacket.attributes("src")).toContain("pool_jacket");
    expect(poolJacket.attributes("alt")).toBe("Pool jacket");
    expect(headings).toHaveLength(2);
    expect(headings[0]?.text()).toBe("Pool");
    expect(headings[1]?.text()).toBe("Digital Drift");
    expect(wrapper.text()).toContain("Ambient");
    expect(wrapper.text()).toContain("Electronica");
  });
});
