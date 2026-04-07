import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAudioManager } from "../src/audio/audioManager";

type AudioEventName =
  | "play"
  | "pause"
  | "timeupdate"
  | "loadedmetadata"
  | "durationchange"
  | "ended";

class FakeAudio {
  public src = "";
  public currentTime = 0;
  public duration = Number.NaN;
  public preload = "none";
  public paused = true;

  private listeners = new Map<AudioEventName, Set<() => void>>();

  play = vi.fn(async () => {
    this.paused = false;
    this.emit("play");
  });

  pause = vi.fn(() => {
    this.paused = true;
    this.emit("pause");
  });

  addEventListener(eventName: AudioEventName, listener: () => void) {
    const listeners = this.listeners.get(eventName) ?? new Set<() => void>();
    listeners.add(listener);
    this.listeners.set(eventName, listeners);
  }

  removeEventListener(eventName: AudioEventName, listener: () => void) {
    this.listeners.get(eventName)?.delete(listener);
  }

  emit(eventName: AudioEventName) {
    for (const listener of this.listeners.get(eventName) ?? []) {
      listener();
    }
  }

  setDuration(duration: number) {
    this.duration = duration;
    this.emit("loadedmetadata");
    this.emit("durationchange");
  }

  setCurrentTime(currentTime: number) {
    this.currentTime = currentTime;
    this.emit("timeupdate");
  }

  finish() {
    this.currentTime = this.duration;
    this.paused = true;
    this.emit("ended");
  }
}

describe("audioManager", () => {
  let audio: FakeAudio;

  beforeEach(() => {
    audio = new FakeAudio();
  });

  it("starts playback for a new track and toggles pause/resume on the active track", async () => {
    const manager = createAudioManager(() => audio as unknown as HTMLAudioElement);

    await manager.toggleTrack("pool.mp3");
    expect(audio.src).toBe("pool.mp3");
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(manager.state.activeSrc).toBe("pool.mp3");
    expect(manager.state.isPlaying).toBe(true);

    await manager.toggleTrack("pool.mp3");
    expect(audio.pause).toHaveBeenCalledTimes(1);
    expect(manager.state.isPlaying).toBe(false);

    await manager.toggleTrack("pool.mp3");
    expect(audio.play).toHaveBeenCalledTimes(2);
    expect(manager.state.isPlaying).toBe(true);
  });

  it("queues a seek on an inactive track until metadata is available and then starts playback from that position", async () => {
    const manager = createAudioManager(() => audio as unknown as HTMLAudioElement);

    await manager.seekTrack("pool.mp3", 0.25);
    expect(audio.src).toBe("pool.mp3");
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(manager.state.activeSrc).toBe("pool.mp3");
    expect(manager.state.currentTime).toBe(0);

    audio.setDuration(200);
    expect(audio.currentTime).toBe(50);

    audio.setCurrentTime(50);
    expect(manager.state.duration).toBe(200);
    expect(manager.state.currentTime).toBe(50);
    expect(manager.state.isReady).toBe(true);
  });

  it("resets ended playback to the start when replaying the same track", async () => {
    const manager = createAudioManager(() => audio as unknown as HTMLAudioElement);

    await manager.toggleTrack("pool.mp3");
    audio.setDuration(120);
    audio.finish();

    expect(manager.state.isPlaying).toBe(false);
    expect(manager.state.currentTime).toBe(120);

    await manager.toggleTrack("pool.mp3");
    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalledTimes(2);
    expect(manager.state.isPlaying).toBe(true);
  });
});
