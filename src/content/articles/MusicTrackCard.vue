<script setup lang="ts">
import { computed } from "vue";
import ArticleHeading from "../../components/article/ArticleHeading.vue";

type Accent = "indigo" | "emerald";

type ImageArtwork = {
  kind: "image";
  src: string;
  alt: string;
  testId?: string;
};

type MockArtwork = {
  kind: "mock";
  icon: "music-note";
};

export type MusicTrackArtwork = ImageArtwork | MockArtwork;

const props = defineProps<{
  title: string;
  genre: string;
  dateLabel: string;
  description: string;
  accent: Accent;
  currentTimeLabel: string;
  durationLabel: string;
  progressRatio: number;
  artwork: MusicTrackArtwork;
}>();

const accentClassMap: Record<
  Accent,
  {
    genre: string;
    progress: string;
    playhead: string;
    playButton: string;
    mockGradient: string;
    mockIcon: string;
  }
> = {
  indigo: {
    genre: "text-indigo-600 dark:text-indigo-400",
    progress: "bg-indigo-500 group-hover:bg-indigo-400",
    playhead: "bg-indigo-600 dark:bg-white",
    playButton: "bg-indigo-600 hover:bg-indigo-500",
    mockGradient: "from-indigo-500/20 to-sky-800/20",
    mockIcon: "text-indigo-600 dark:text-indigo-400"
  },
  emerald: {
    genre: "text-emerald-600 dark:text-emerald-400",
    progress: "bg-emerald-500 group-hover:bg-emerald-400",
    playhead: "bg-emerald-600 dark:bg-white",
    playButton: "bg-emerald-600 hover:bg-emerald-500",
    mockGradient: "from-emerald-500/20 to-teal-800/20",
    mockIcon: "text-emerald-600 dark:text-emerald-400"
  }
};

const accentClasses = computed(() => accentClassMap[props.accent]);
const progressPercent = computed(() => `${Math.min(Math.max(props.progressRatio, 0), 1) * 100}%`);
</script>

<template>
  <section class="mb-16">
    <ArticleHeading :level="2" accent bordered>
      {{ title }}
    </ArticleHeading>

    <div class="mt-6 flex flex-col items-start gap-8 md:flex-row">
      <div
        v-if="artwork.kind === 'image'"
        class="relative w-full shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/5 aspect-[4/3] group md:w-56 md:aspect-square dark:border-white/5"
      >
        <img
          :src="artwork.src"
          :alt="artwork.alt"
          :data-testid="artwork.testId"
          class="h-full w-full object-cover"
        >
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <span class="text-sm font-medium uppercase tracking-widest text-white">Play Track</span>
        </div>
      </div>

      <div
        v-else
        data-testid="mock-artwork"
        :class="[
          'relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/10 aspect-[4/3] group md:w-56 md:aspect-square dark:border-white/5',
          accentClasses.mockGradient
        ]"
      >
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <span class="text-sm font-medium uppercase tracking-widest text-white">Play Track</span>
        </div>
        <div
          data-testid="mock-artwork-icon"
          :class="[
            'flex h-16 w-16 items-center justify-center rounded-full border border-current opacity-30',
            accentClasses.mockIcon
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
            <span class="theme-muted w-8 text-right text-xs font-mono">{{ currentTimeLabel }}</span>
            <div class="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-black/10 group dark:bg-white/10">
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
            <span class="theme-muted w-8 text-xs font-mono">{{ durationLabel }}</span>
          </div>

          <div class="flex items-center justify-between px-2">
            <button class="text-current opacity-50 transition-opacity hover:opacity-100" title="Repeat">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
            </button>

            <div class="flex items-center gap-4 sm:gap-6">
              <button class="flex h-10 w-10 items-center justify-center rounded-full text-current opacity-70 transition-all hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
              </button>
              <button
                :class="[
                  'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-all hover:scale-105',
                  accentClasses.playButton
                ]"
              >
                <svg class="translate-x-[2px]" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </button>
              <button class="flex h-10 w-10 items-center justify-center rounded-full text-current opacity-70 transition-all hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
              </button>
            </div>

            <button class="text-current opacity-50 transition-opacity hover:opacity-100" title="Volume">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
