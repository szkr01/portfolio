import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MusicTrackCard from "../src/content/articles/MusicTrackCard.vue";

describe("MusicTrackCard", () => {
  it("renders image artwork metadata and indigo progress UI from props", () => {
    const wrapper = mount(MusicTrackCard, {
      props: {
        title: "Pool",
        genre: "Ambient",
        dateLabel: "2026.04",
        description: "Track description",
        accent: "indigo",
        currentTimeLabel: "0:00",
        durationLabel: "4:12",
        progressRatio: 1 / 3,
        artwork: {
          kind: "image",
          src: "/pool_jacket.jpg",
          alt: "Pool jacket",
          testId: "pool-jacket"
        }
      }
    });

    const jacket = wrapper.get('[data-testid="pool-jacket"]');
    const progressFill = wrapper.get('[data-testid="track-progress-fill"]');
    const playhead = wrapper.get('[data-testid="track-progress-playhead"]');

    expect(wrapper.text()).toContain("Pool");
    expect(wrapper.text()).toContain("Ambient");
    expect(wrapper.text()).toContain("2026.04");
    expect(jacket.attributes("src")).toContain("/pool_jacket.jpg");
    expect(jacket.attributes("alt")).toBe("Pool jacket");
    expect(progressFill.attributes("style")).toContain("width: 33.33333333333333%");
    expect(playhead.attributes("style")).toContain("left: 33.33333333333333%");
    expect(wrapper.html()).toContain("bg-indigo-600");
  });

  it("renders mock artwork metadata and emerald progress UI from props", () => {
    const wrapper = mount(MusicTrackCard, {
      props: {
        title: "Digital Drift",
        genre: "Electronica",
        dateLabel: "2025.11",
        description: "Track description",
        accent: "emerald",
        currentTimeLabel: "0:00",
        durationLabel: "2:58",
        progressRatio: 0,
        artwork: {
          kind: "mock",
          icon: "music-note"
        }
      }
    });

    expect(wrapper.text()).toContain("Digital Drift");
    expect(wrapper.text()).toContain("Electronica");
    expect(wrapper.text()).toContain("2025.11");
    expect(wrapper.get('[data-testid="mock-artwork"]').classes()).toContain("from-emerald-500/20");
    expect(wrapper.get('[data-testid="mock-artwork-icon"]').classes()).toContain("text-emerald-600");
    expect(wrapper.get('[data-testid="track-progress-fill"]').attributes("style")).toContain("width: 0%");
    expect(wrapper.get('[data-testid="track-progress-playhead"]').attributes("style")).toContain("left: 0%");
    expect(wrapper.html()).toContain("bg-emerald-600");
  });
});
