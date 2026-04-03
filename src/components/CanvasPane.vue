<script setup lang="ts">
defineProps<{
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
}>();
</script>

<template>
  <div
    id="left-pane"
    class="canvas-container color-transition theme-border relative flex h-full w-1/2 items-center justify-center overflow-hidden border-r"
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
