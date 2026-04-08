import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MusicTrackCard from "../src/components/article/MusicTrackCard.vue";

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
    document.body.innerHTML = "";
    mockedAudioManager.managerState.activeSrc = "pool.mp3";
    mockedAudioManager.managerState.isPlaying = true;
    mockedAudioManager.managerState.currentTime = 84;
    mockedAudioManager.managerState.duration = 252;
    mockedAudioManager.managerState.isReady = true;
    mockedAudioManager.toggleTrack.mockReset();
    mockedAudioManager.seekTrack.mockReset();
  });

  it("opens a jacket viewer modal from the artwork without changing playback wiring", async () => {
    const wrapper = mount(MusicTrackCard, {
      attachTo: document.body,
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
    expect(document.body.querySelector('[data-testid="jacket-viewer-modal"]')).toBeNull();

    await wrapper.get('[data-testid="track-artwork-button"]').trigger("click");

    const modal = document.body.querySelector('[data-testid="jacket-viewer-modal"]');
    const viewerImage = document.body.querySelector('[data-testid="jacket-viewer-image"]');

    expect(modal).not.toBeNull();
    expect(modal?.getAttribute("role")).toBe("dialog");
    expect(modal?.getAttribute("aria-modal")).toBe("true");
    expect(viewerImage?.getAttribute("src")).toContain("/pool_jacket.jpg");
    expect(viewerImage?.getAttribute("alt")).toBe("Pool jacket");
    expect(mockedAudioManager.toggleTrack).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe("hidden");

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

    const backdrop = document.body.querySelector('[data-testid="jacket-viewer-backdrop"]') as HTMLElement | null;
    backdrop?.click();
    await wrapper.vm.$nextTick();
    expect(document.body.querySelector('[data-testid="jacket-viewer-modal"]')).toBeNull();

    await wrapper.get('[data-testid="track-artwork-button"]').trigger("click");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();
    expect(document.body.querySelector('[data-testid="jacket-viewer-modal"]')).toBeNull();
    expect(document.body.style.overflow).toBe("");

    wrapper.unmount();
  });

  it("renders the internal placeholder artwork and keeps cards without artwork non-interactive", async () => {
    const wrapper = mount(MusicTrackCard, {
      attachTo: document.body,
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
    expect(wrapper.find('[data-testid="track-artwork-button"]').exists()).toBe(false);

    await wrapper.get('[data-testid="track-play-toggle"]').trigger("click");
    await wrapper.get('[data-testid="track-progress-bar"]').trigger("click", { clientX: 10 });

    expect(mockedAudioManager.toggleTrack).not.toHaveBeenCalled();
    expect(mockedAudioManager.seekTrack).not.toHaveBeenCalled();
    expect(document.body.querySelector('[data-testid="jacket-viewer-modal"]')).toBeNull();

    wrapper.unmount();
  });
});
