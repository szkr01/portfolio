<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ArticlePane from "./components/ArticlePane.vue";
import CanvasPane from "./components/CanvasPane.vue";
import { useCanvasController } from "./canvas/useCanvasController";
import type { ArticlePageEntry } from "./content/articlePages";

const { setCanvas, themeStyle, activate } = useCanvasController();
const route = useRoute();
const currentArticle = computed(() => route.meta.article as ArticlePageEntry | undefined);

onMounted(async () => {
  if (currentArticle.value) {
    await activate(currentArticle.value.sceneId, "init");
  }
});

watch(
  () => route.fullPath,
  async (_nextPath, previousPath) => {
    if (!previousPath || !currentArticle.value) {
      return;
    }

    await activate(currentArticle.value.sceneId, "manual");
  }
);
</script>

<template>
  <main
    class="color-transition flex h-screen w-screen overflow-hidden font-sans antialiased"
    :style="themeStyle"
  >
    <CanvasPane :set-canvas="setCanvas" />
    <ArticlePane />
  </main>
</template>
