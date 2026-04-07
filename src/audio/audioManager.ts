import { readonly, reactive } from "vue";

export interface AudioManagerState {
  activeSrc: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
}

export interface AudioManager {
  state: Readonly<AudioManagerState>;
  toggleTrack: (src: string | null) => Promise<void>;
  seekTrack: (src: string | null, ratio: number) => Promise<void>;
}

type AudioFactory = () => HTMLAudioElement;

function clampRatio(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function isFiniteDuration(value: number) {
  return Number.isFinite(value) && value > 0;
}

export function createAudioManager(audioFactory: AudioFactory = () => new Audio()): AudioManager {
  const audio = audioFactory();
  const state = reactive<AudioManagerState>({
    activeSrc: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isReady: false
  });

  let pendingSeekRatio: number | null = null;

  audio.preload = "metadata";

  const syncTimingState = () => {
    const duration = audio.duration;
    const hasDuration = isFiniteDuration(duration);

    state.duration = hasDuration ? duration : 0;
    state.isReady = hasDuration;
    state.currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    if (pendingSeekRatio !== null && hasDuration) {
      audio.currentTime = duration * pendingSeekRatio;
      state.currentTime = audio.currentTime;
      pendingSeekRatio = null;
    }
  };

  audio.addEventListener("loadedmetadata", syncTimingState);
  audio.addEventListener("durationchange", syncTimingState);
  audio.addEventListener("timeupdate", syncTimingState);
  audio.addEventListener("play", () => {
    state.isPlaying = true;
  });
  audio.addEventListener("pause", () => {
    state.isPlaying = false;
  });
  audio.addEventListener("ended", () => {
    syncTimingState();
    state.isPlaying = false;
  });

  const playActive = async () => {
    try {
      await audio.play();
      state.isPlaying = true;
    } catch {
      state.isPlaying = false;
    }
  };

  const loadTrack = (src: string) => {
    if (audio.src !== src) {
      audio.src = src;
    }

    audio.currentTime = 0;
    pendingSeekRatio = null;
    state.activeSrc = src;
    state.currentTime = 0;
    state.duration = 0;
    state.isReady = false;
  };

  const ensureTrack = (src: string) => {
    if (state.activeSrc === src) {
      return;
    }

    if (state.isPlaying) {
      audio.pause();
    }

    loadTrack(src);
  };

  const hasEnded = () => state.isReady && state.currentTime >= state.duration;

  return {
    state: readonly(state),
    async toggleTrack(src) {
      if (!src) {
        return;
      }

      if (state.activeSrc !== src) {
        ensureTrack(src);
        await playActive();
        return;
      }

      if (state.isPlaying) {
        audio.pause();
        state.isPlaying = false;
        return;
      }

      if (hasEnded()) {
        audio.currentTime = 0;
        state.currentTime = 0;
      }

      await playActive();
    },
    async seekTrack(src, ratio) {
      if (!src) {
        return;
      }

      const clampedRatio = clampRatio(ratio);

      if (state.activeSrc !== src) {
        ensureTrack(src);
        pendingSeekRatio = clampedRatio;
        await playActive();
        return;
      }

      if (state.isReady) {
        audio.currentTime = state.duration * clampedRatio;
        state.currentTime = audio.currentTime;
      } else {
        pendingSeekRatio = clampedRatio;
      }

      if (!state.isPlaying) {
        await playActive();
      }
    }
  };
}

export const audioManager = createAudioManager();
