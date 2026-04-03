<script setup lang="ts">
import type { CSSProperties } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { articlePages } from "../content/articlePages";

defineProps<{
  paneStyle: CSSProperties;
}>();

const route = useRoute();
</script>

<template>
  <div
    id="right-pane"
    class="theme-bg color-transition h-full min-w-0 overflow-y-auto px-12 py-16"
    :style="paneStyle"
  >
    <div class="mx-auto max-w-2xl">
      <nav class="theme-border mb-12 flex flex-wrap gap-3 border-b pb-4">
        <RouterLink
          v-for="entry in articlePages"
          :key="entry.slug"
          :to="`/articles/${entry.slug}`"
          data-article-link
          :class="[
            'color-transition rounded-full border px-4 py-2 text-sm font-semibold',
            route.path === `/articles/${entry.slug}`
              ? 'theme-accent theme-border theme-surface'
              : 'theme-muted theme-border'
          ]"
        >
          {{ entry.title }}
        </RouterLink>
      </nav>
      <RouterView />
    </div>
  </div>
</template>
