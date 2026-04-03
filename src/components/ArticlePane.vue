<script setup lang="ts">
import ArticleSceneSection from "./article/ArticleSceneSection.vue";
import { articleSections } from "../content/articleSections";

defineProps<{
  registerSection: (
    sceneId: string,
    element:
      | Element
      | {
          $el?: Element | null;
        }
      | null
  ) => void;
}>();
</script>

<template>
  <div
    id="right-pane"
    class="theme-bg color-transition h-full w-1/2 overflow-y-auto px-12 py-16"
  >
    <div class="mx-auto max-w-2xl">
      <ArticleSceneSection
        v-for="entry in articleSections"
        :key="entry.id"
        :as="entry.as"
        :scene-id="entry.sceneId"
        :register-section="registerSection"
        :class="entry.className"
      >
        <component :is="entry.component" />
      </ArticleSceneSection>
    </div>
  </div>
</template>
