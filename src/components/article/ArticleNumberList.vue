<script setup lang="ts">
defineProps<{
  items: string[];
}>();
</script>

<template>
  <ul class="mt-6 space-y-4">
    <li v-for="(item, index) in items" :key="item" class="flex items-start">
      <span
        class="theme-accent-bg color-transition mr-4 mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
      >
        {{ index + 1 }}
      </span>
      <span class="theme-text color-transition leading-relaxed">
        {{ item }}
      </span>
    </li>
  </ul>
</template>
