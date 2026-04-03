<script setup lang="ts">
import { computed, useAttrs } from "vue";

const props = withDefaults(
  defineProps<{
    as?: "header" | "section";
    sceneId: string;
    registerSection: (
      sceneId: string,
      element:
        | Element
        | {
            $el?: Element | null;
          }
        | null
    ) => void;
  }>(),
  {
    as: "section"
  }
);

const attrs = useAttrs();
const mergedClass = computed(() => attrs.class);

function handleRef(node: Element | { $el?: Element | null } | null): void {
  props.registerSection(props.sceneId, node);
}
</script>

<template>
  <component
    :is="as"
    :ref="handleRef"
    :data-scene-id="sceneId"
    :class="mergedClass"
  >
    <slot />
  </component>
</template>
