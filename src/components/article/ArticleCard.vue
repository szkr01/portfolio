<script setup lang="ts">
defineProps<{
  title: string;
  accent?: boolean;
}>();
</script>

<template>
  <div
    class="theme-surface theme-border color-transition flex-1 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="mb-3 flex items-center gap-3">
      <slot name="icon" />
      <h3 :class="['color-transition font-bold', accent ? 'theme-accent-2' : 'theme-text']">
        {{ title }}
      </h3>
    </div>
    <p class="theme-muted color-transition text-sm">
      <slot />
    </p>
  </div>
</template>
