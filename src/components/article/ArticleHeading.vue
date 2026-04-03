<script setup lang="ts">
withDefaults(
  defineProps<{
    level?: 1 | 2 | 3;
    accent?: boolean;
    bordered?: boolean;
  }>(),
  {
    level: 2,
    accent: false,
    bordered: false
  }
);
</script>

<template>
  <h1
    v-if="level === 1"
    class="theme-text color-transition mb-4 text-4xl font-extrabold tracking-tight"
  >
    <slot />
  </h1>
  <h2
    v-else-if="level === 2"
    :class="[
      'color-transition text-2xl font-bold',
      accent ? 'theme-accent' : 'theme-text',
      bordered ? 'theme-border mb-4 border-b pb-2' : 'mb-3'
    ]"
  >
    <slot />
  </h2>
  <h3 v-else class="theme-text color-transition font-bold">
    <slot />
  </h3>
</template>
