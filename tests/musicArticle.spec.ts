import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

vi.mock("../src/components/article/MusicTrackCard.vue", () => ({
  default: defineComponent({
    name: "MusicTrackCardStub",
    props: {
      title: { type: String, required: true },
      audioSrc: { type: String, default: null },
      artworkSrc: { type: String, default: undefined },
      artworkAlt: { type: String, default: undefined }
    },
    template: `
      <div
        data-testid="music-track-card"
        :data-title="title"
        :data-audio-src="audioSrc ?? 'null'"
        :data-artwork-src="artworkSrc ?? 'null'"
        :data-artwork-alt="artworkAlt ?? 'null'"
      >
        {{ title }}
      </div>
    `
  })
}));

import MusicArticlePage from "../src/content/articles/MusicArticlePage.vue";

describe("MusicArticlePage", () => {
  it("renders the explicit Pool track card with its real audio and jacket assets", () => {
    const wrapper = mount(MusicArticlePage);
    const cards = wrapper.findAll('[data-testid="music-track-card"]');

    expect(cards).toHaveLength(1);
    expect(cards[0]?.attributes("data-title")).toBe("Pool");
    expect(cards[0]?.attributes("data-audio-src")).toContain("pool.mp3");
    expect(cards[0]?.attributes("data-artwork-src")).toContain("pool_jacket");
    expect(cards[0]?.attributes("data-artwork-alt")).toBe("Pool jacket");
  });
});
