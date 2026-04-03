<script setup lang="ts">
import ArticlePane from "./components/ArticlePane.vue";
import CanvasPane from "./components/CanvasPane.vue";
import { useCanvasController } from "./canvas/useCanvasController";
import { useSectionSceneActivation } from "./composables/useSectionSceneActivation";

const { setCanvas, themeStyle, activate } = useCanvasController();
const { registerSection } = useSectionSceneActivation({
  activate: (sceneId) => activate(sceneId, "scroll")
});
</script>

<template>
  <main
    class="color-transition flex h-screen w-screen overflow-hidden font-sans antialiased"
    :style="themeStyle"
  >
    <CanvasPane :set-canvas="setCanvas" />
    <ArticlePane :register-section="registerSection" />
  </main>
</template>
