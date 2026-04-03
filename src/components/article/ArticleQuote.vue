<script setup lang="ts">
defineProps<{
  attribution: string;
}>();
</script>

<template>
  <blockquote
    class="theme-accent-2-border theme-surface color-transition my-6 rounded-r-xl border-l-4 p-5 shadow-sm"
  >
    <p class="theme-text color-transition text-lg italic opacity-80">
      <slot />
      <span
        class="theme-accent-2 color-transition mt-3 block text-sm font-bold tracking-wide uppercase"
      >
        - {{ attribution }}
      </span>
    </p>
  </blockquote>
</template>
