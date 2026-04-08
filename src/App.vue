<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import type { CSSProperties } from "vue";
import { useRoute } from "vue-router";
import ArticlePane from "./components/ArticlePane.vue";
import CanvasPane from "./components/CanvasPane.vue";
import { useCanvasController } from "./canvas/useCanvasController";
import type { ArticlePageEntry } from "./content/articlePages";

const { setCanvas, themeStyle, activate } = useCanvasController();
const route = useRoute();
const currentArticle = computed(() => route.meta.article as ArticlePageEntry | undefined);
const activePaneRatio = computed(() => currentArticle.value?.paneRatio ?? { canvas: 1, article: 1 });
let hasActivatedInitialScene = false;
const canvasPaneStyle = computed<CSSProperties>(() => ({
  flexGrow: activePaneRatio.value.canvas,
  flexBasis: "0%",
  transition: "flex-grow 1000ms cubic-bezier(0.22, 1, 0.36, 1)"
}));
const articlePaneStyle = computed<CSSProperties>(() => ({
  flexGrow: activePaneRatio.value.article,
  flexBasis: "0%",
  transition: "flex-grow 1000ms cubic-bezier(0.22, 1, 0.36, 1)"
}));

onMounted(async () => {
  if (!currentArticle.value) {
    return;
  }

  await activate(currentArticle.value.sceneId, "init");
  hasActivatedInitialScene = true;
});

watch(
  () => currentArticle.value?.sceneId,
  async (nextSceneId, previousSceneId) => {
    if (!nextSceneId) {
      return;
    }

    if (!hasActivatedInitialScene) {
      await activate(nextSceneId, "init");
      hasActivatedInitialScene = true;
      return;
    }

    if (nextSceneId === previousSceneId) {
      return;
    }

    await activate(nextSceneId, "manual");
  }
);
</script>

<template>
  <main
    class="color-transition flex h-screen w-screen overflow-hidden font-sans antialiased"
    :style="themeStyle"
  >
    <CanvasPane :set-canvas="setCanvas" :pane-style="canvasPaneStyle" />
    <ArticlePane :pane-style="articlePaneStyle" />
  </main>
</template>
