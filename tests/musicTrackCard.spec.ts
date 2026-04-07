import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MusicTrackCard from "../src/content/articles/MusicTrackCard.vue";

const mockedAudioManager = vi.hoisted(() => ({
  managerState: {
    activeSrc: "pool.mp3" as string | null,
    isPlaying: true,
    currentTime: 84,
    duration: 252,
    isReady: true
  },
  toggleTrack: vi.fn(),
  seekTrack: vi.fn()
}));

vi.mock("../src/audio/audioManager", () => ({
  audioManager: {
    state: mockedAudioManager.managerState,
    toggleTrack: mockedAudioManager.toggleTrack,
    seekTrack: mockedAudioManager.seekTrack
  }
}));

describe("MusicTrackCard", () => {
  beforeEach(() => {
    mockedAudioManager.managerState.activeSrc = "pool.mp3";
    mockedAudioManager.managerState.isPlaying = true;
    mockedAudioManager.managerState.currentTime = 84;
    mockedAudioManager.managerState.duration = 252;
    mockedAudioManager.managerState.isReady = true;
    mockedAudioManager.toggleTrack.mockReset();
    mockedAudioManager.seekTrack.mockReset();
  });

  it("renders live playback UI for the active playable track and routes controls to the audio manager", async () => {
    const wrapper = mount(MusicTrackCard, {
      props: {
        title: "Pool",
        genre: "Ambient",
        dateLabel: "2026.04",
        description: "Track description",
        accent: "indigo",
        audioSrc: "pool.mp3",
        durationLabel: "4:12",
        artworkSrc: "/pool_jacket.jpg",
        artworkAlt: "Pool jacket"
      }
    });

    expect(wrapper.get('[data-testid="track-artwork-image"]').attributes("src")).toContain("/pool_jacket.jpg");
    expect(wrapper.get('[data-testid="track-artwork-image"]').attributes("alt")).toBe("Pool jacket");
    expect(wrapper.get('[data-testid="track-current-time"]').text()).toBe("1:24");
    expect(wrapper.get('[data-testid="track-duration"]').text()).toBe("4:12");
    expect(wrapper.get('[data-testid="track-progress-fill"]').attributes("style")).toContain("width: 33.33333333333333%");
    expect(wrapper.find('[data-testid="track-pause-icon"]').exists()).toBe(true);

    await wrapper.get('[data-testid="track-play-toggle"]').trigger("click");
    expect(mockedAudioManager.toggleTrack).toHaveBeenCalledWith("pool.mp3");

    const progress = wrapper.get('[data-testid="track-progress-bar"]');
    vi.spyOn(progress.element, "getBoundingClientRect").mockReturnValue({
      x: 10,
      y: 0,
      width: 200,
      height: 8,
      top: 0,
      left: 10,
      right: 210,
      bottom: 8,
      toJSON: () => ({})
    });

    await progress.trigger("click", { clientX: 60 });
    expect(mockedAudioManager.seekTrack).toHaveBeenCalledWith("pool.mp3", 0.25);
  });

  it("renders the internal placeholder artwork and disables playback controls when no audio source is available", async () => {
    const wrapper = mount(MusicTrackCard, {
      props: {
        title: "Digital Drift",
        genre: "Electronica",
        dateLabel: "2025.11",
        description: "Track description",
        accent: "emerald",
        audioSrc: null,
        durationLabel: "2:58"
      }
    });

    expect(wrapper.find('[data-testid="track-artwork-placeholder"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="track-current-time"]').text()).toBe("0:00");
    expect(wrapper.get('[data-testid="track-duration"]').text()).toBe("2:58");
    expect(wrapper.get('[data-testid="track-play-toggle"]').attributes("disabled")).toBeDefined();
    expect(wrapper.get('[data-testid="track-progress-bar"]').attributes("aria-disabled")).toBe("true");

    await wrapper.get('[data-testid="track-play-toggle"]').trigger("click");
    await wrapper.get('[data-testid="track-progress-bar"]').trigger("click", { clientX: 10 });

    expect(mockedAudioManager.toggleTrack).not.toHaveBeenCalled();
    expect(mockedAudioManager.seekTrack).not.toHaveBeenCalled();
  });
});
