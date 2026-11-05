<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import type { CSSProperties } from "vue";
import { useRoute } from "vue-router";
import ArticlePane from "./components/ArticlePane.vue";
import CanvasPane from "./components/CanvasPane.vue";
import { useCanvasController } from "./canvas/useCanvasController";
import type { ArticlePageEntry } from "./content/articlePages";

const { setCanvas, themeStyle, activate, preload } = useCanvasController();
const route = useRoute();
const currentArticle = computed(() => route.meta.article as ArticlePageEntry | undefined);
const activePaneRatio = computed(() => currentArticle.value?.paneRatio ?? { canvas: 1, article: 1 });
const activeArticlePaneShare = computed(() => {
  const { canvas, article } = activePaneRatio.value;
  const total = canvas + article;
  return total > 0 ? article / total : 0.5;
});
let hasActivatedInitialScene = false;
const canvasPaneStyle = computed<CSSProperties>(() => ({
  "--pane-grow": String(activePaneRatio.value.canvas)
}));
const articlePaneStyle = computed<CSSProperties>(() => ({
  "--pane-grow": String(activePaneRatio.value.article),
  "--article-pane-share": String(activeArticlePaneShare.value)
}));

onMounted(async () => {
  if (!currentArticle.value) {
    return;
  }

  await activate(currentArticle.value.sceneId, "init");
  hasActivatedInitialScene = true;
  preload();
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
      preload();
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
    class="app-shell color-transition font-sans antialiased"
    :style="themeStyle"
  >
    <CanvasPane :set-canvas="setCanvas" :pane-style="canvasPaneStyle" />
    <ArticlePane :pane-style="articlePaneStyle" />
  </main>
</template>
