<script setup lang="ts">
import type { CSSProperties } from "vue";

defineProps<{
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
  paneStyle: CSSProperties;
}>();
</script>

<template>
  <div
    id="left-pane"
    class="canvas-pane canvas-container color-transition theme-border relative flex min-w-0 items-center justify-center overflow-hidden"
    :style="paneStyle"
  >
    <canvas
      :ref="
        (node) => {
          if (node && typeof (node as HTMLCanvasElement).getContext === 'function') {
            setCanvas(node as HTMLCanvasElement);
          } else {
            setCanvas(null);
          }
        }
      "
      id="main-canvas"
      class="absolute inset-0 h-full w-full"
    />
  </div>
</template>
