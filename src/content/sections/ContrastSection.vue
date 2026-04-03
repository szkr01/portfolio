<script setup lang="ts">
import ArticleCard from "../../components/article/ArticleCard.vue";
import ArticleCardGrid from "../../components/article/ArticleCardGrid.vue";
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleText from "../../components/article/ArticleText.vue";
</script>

<template>
  <ArticleHeading :level="2" accent bordered>Contrast &amp; Context</ArticleHeading>
  <ArticleText class="mb-4">
    The background color naturally shifts based on the overall brightness of the viewport. Darker
    image areas trigger a subtle dark mode, while lighter areas return to a luminous white,
    maintaining perfect text contrast automatically.
  </ArticleText>
  <ArticleCardGrid>
    <ArticleCard title="Dynamic Background">
      <template #icon>
        <div class="theme-bg theme-border h-4 w-4 rounded-full border"></div>
      </template>
      Calculated by averaging the lightness of the viewport and applying a faint hue of the
      dominant color to unify the design.
    </ArticleCard>
    <ArticleCard title="Responsive Accents" accent>
      <template #icon>
        <div class="theme-accent-bg h-4 w-4 rounded-full"></div>
      </template>
      Accent colors are verified against the background. If contrast falls below WCAG standards,
      lightness is dynamically corrected.
    </ArticleCard>
  </ArticleCardGrid>
</template>
