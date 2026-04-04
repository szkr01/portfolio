<script setup lang="ts">
defineProps<{
  items: string[];
}>();
</script>

<template>
  <ul class="my-6 flex flex-wrap gap-3">
    <li
      v-for="item in items"
      :key="item"
      class="theme-surface theme-text color-transition flex items-center rounded-xl border border-transparent px-4 py-2 text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <span class="theme-accent mr-2 opacity-70">#</span>
      <span class="font-medium tracking-wide">{{ item }}</span>
    </li>
  </ul>
</template>
