<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { audioManager } from "../../audio/audioManager";
import ArticleHeading from "./ArticleHeading.vue";

type Accent = "indigo" | "emerald";

const props = defineProps<{
  title: string;
  genre: string;
  dateLabel: string;
  description: string;
  accent: Accent;
  audioSrc: string | null;
  durationLabel?: string;
  artworkSrc?: string;
  artworkAlt?: string;
}>();

const accentClassMap: Record<
  Accent,
  {
    genre: string;
    progress: string;
    playhead: string;
    playButton: string;
    placeholderGradient: string;
    placeholderIcon: string;
  }
> = {
  indigo: {
    genre: "text-indigo-600 dark:text-indigo-400",
    progress: "bg-indigo-500 group-hover:bg-indigo-400",
    playhead: "bg-indigo-600 dark:bg-white",
    playButton: "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/40",
    placeholderGradient: "from-indigo-500/20 to-sky-800/20",
    placeholderIcon: "text-indigo-600 dark:text-indigo-400"
  },
  emerald: {
    genre: "text-emerald-600 dark:text-emerald-400",
    progress: "bg-emerald-500 group-hover:bg-emerald-400",
    playhead: "bg-emerald-600 dark:bg-white",
    playButton: "bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 dark:disabled:bg-emerald-900/40",
    placeholderGradient: "from-emerald-500/20 to-teal-800/20",
    placeholderIcon: "text-emerald-600 dark:text-emerald-400"
  }
};

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(seconds, 0) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = Math.floor(safeSeconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

const accentClasses = computed(() => accentClassMap[props.accent]);
const isPlayable = computed(() => props.audioSrc !== null);
const hasArtwork = computed(() => Boolean(props.artworkSrc));
const isActive = computed(
  () => props.audioSrc !== null && audioManager.state.activeSrc === props.audioSrc
);
const isPlaying = computed(() => isActive.value && audioManager.state.isPlaying);
const activeDuration = computed(() =>
  isActive.value && audioManager.state.isReady ? audioManager.state.duration : 0
);
const progressRatio = computed(() => {
  if (!isActive.value || activeDuration.value <= 0) {
    return 0;
  }

  return Math.min(Math.max(audioManager.state.currentTime / activeDuration.value, 0), 1);
});
const progressPercent = computed(() => `${progressRatio.value * 100}%`);
const currentTimeLabel = computed(() =>
  isActive.value ? formatTime(audioManager.state.currentTime) : "0:00"
);
const durationLabel = computed(() => {
  if (isActive.value && activeDuration.value > 0) {
    return formatTime(activeDuration.value);
  }

  return props.durationLabel ?? "--:--";
});
const isArtworkModalOpen = ref(false);
let previousBodyOverflow = "";

function openArtworkModal() {
  if (!hasArtwork.value) {
    return;
  }

  isArtworkModalOpen.value = true;
}

function closeArtworkModal() {
  isArtworkModalOpen.value = false;
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeArtworkModal();
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target !== event.currentTarget) {
    return;
  }

  closeArtworkModal();
}

async function handleToggle() {
  if (!isPlayable.value) {
    return;
  }

  await audioManager.toggleTrack(props.audioSrc);
}

async function handleSeek(event: MouseEvent) {
  if (!isPlayable.value) {
    return;
  }

  const progressBar = event.currentTarget as HTMLElement | null;

  if (!progressBar) {
    return;
  }

  const rect = progressBar.getBoundingClientRect();

  if (rect.width <= 0) {
    return;
  }

  const ratio = (event.clientX - rect.left) / rect.width;
  await audioManager.seekTrack(props.audioSrc, ratio);
}

watch(isArtworkModalOpen, (isOpen) => {
  if (typeof document === "undefined") {
    return;
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleDocumentKeydown);
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
  document.removeEventListener("keydown", handleDocumentKeydown);
});

onBeforeUnmount(() => {
  if (typeof document === "undefined") {
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
  document.removeEventListener("keydown", handleDocumentKeydown);
});
</script>

<template>
  <section class="mb-16">
    <ArticleHeading :level="2" accent bordered>
      {{ title }}
    </ArticleHeading>

    <div class="mt-6 flex flex-col items-start gap-8 md:flex-row">
      <button
        v-if="artworkSrc"
        type="button"
        data-testid="track-artwork-button"
        class="relative w-full shrink-0 overflow-hidden border border-black/10 bg-black/5 aspect-[4/3] group md:w-56 md:aspect-square dark:border-white/5"
        @click="openArtworkModal"
      >
        <img
          data-testid="track-artwork-image"
          :src="artworkSrc"
          :alt="artworkAlt ?? `${title} artwork`"
          class="h-full w-full object-cover"
        >
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <span class="text-sm font-medium uppercase tracking-widest text-white">View Jacket</span>
        </div>
      </button>

      <div
        v-else
        data-testid="track-artwork-placeholder"
        :class="[
          'relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/10 aspect-[4/3] group md:w-56 md:aspect-square dark:border-white/5',
          accentClasses.placeholderGradient
        ]"
      >
        <div
          :class="[
            'flex h-16 w-16 items-center justify-center rounded-full border border-current opacity-30',
            accentClasses.placeholderIcon
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
      </div>

      <div class="flex w-full flex-1 flex-col">
        <div class="mb-6">
          <div class="mb-4 flex items-center gap-3">
            <span :class="['text-xs font-bold uppercase tracking-wider', accentClasses.genre]">{{ genre }}</span>
            <span class="theme-muted text-xs font-mono">{{ dateLabel }}</span>
          </div>
          <p class="theme-muted text-sm leading-relaxed sm:text-base">
            {{ description }}
          </p>
        </div>

        <div class="mt-auto rounded-2xl border border-transparent bg-black/5 p-4 dark:border-white/5 dark:bg-white/5">
          <div class="mb-3 flex items-center gap-4">
            <span data-testid="track-current-time" class="theme-muted w-8 text-right text-xs font-mono">{{ currentTimeLabel }}</span>
            <div
              data-testid="track-progress-bar"
              class="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
              :class="isPlayable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
              :aria-disabled="!isPlayable"
              @click="handleSeek"
            >
              <div
                data-testid="track-progress-fill"
                :class="['absolute top-0 left-0 h-full rounded-full transition-all', accentClasses.progress]"
                :style="{ width: progressPercent }"
              ></div>
              <div
                data-testid="track-progress-playhead"
                :class="['absolute top-1/2 h-3 w-3 -translate-y-1/2 -ml-1.5 scale-0 rounded-full shadow-md transition-transform group-hover:scale-100', accentClasses.playhead]"
                :style="{ left: progressPercent }"
              ></div>
            </div>
            <span data-testid="track-duration" class="theme-muted w-8 text-xs font-mono">{{ durationLabel }}</span>
          </div>

          <div class="flex items-center justify-between px-2">
            <button
              type="button"
              disabled
              class="cursor-not-allowed text-current opacity-30"
              title="Repeat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
            </button>

            <div class="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                disabled
                class="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full text-current opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
              </button>
              <button
                type="button"
                data-testid="track-play-toggle"
                :disabled="!isPlayable"
                :class="[
                  'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-all',
                  isPlayable ? 'hover:scale-105' : 'cursor-not-allowed opacity-60',
                  accentClasses.playButton
                ]"
                @click="handleToggle"
              >
                <svg
                  v-if="isPlaying"
                  data-testid="track-pause-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                <svg
                  v-else
                  data-testid="track-play-icon"
                  class="translate-x-[2px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              <button
                type="button"
                disabled
                class="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full text-current opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
              </button>
            </div>

            <button
              type="button"
              disabled
              class="cursor-not-allowed text-current opacity-30"
              title="Volume"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <div
      v-if="isArtworkModalOpen && artworkSrc"
      data-testid="jacket-viewer-modal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      :aria-label="`${title} jacket viewer`"
    >
      <div
        data-testid="jacket-viewer-backdrop"
        class="absolute inset-0 bg-black/80 backdrop-blur-md"
        @click="handleBackdropClick"
      ></div>
      <div class="relative z-10 w-full max-w-5xl">
        <div class="overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
          <img
            data-testid="jacket-viewer-image"
            :src="artworkSrc"
            :alt="artworkAlt ?? `${title} artwork`"
            class="max-h-[85vh] w-full object-contain"
          >
        </div>
      </div>
    </div>
  </Teleport>
</template>
