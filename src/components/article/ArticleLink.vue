<script setup lang="ts">
defineProps<{
  href?: string;
}>();
</script>

<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="theme-accent hover:underline"
  >
    <slot />
  </a>
  <span v-else class="theme-text">
    <slot />
  </span>
</template>
