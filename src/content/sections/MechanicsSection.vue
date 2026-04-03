<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleNumberList from "../../components/article/ArticleNumberList.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import InlineCode from "../../components/article/InlineCode.vue";

const mechanicsItems = [
  "Extract dominant neutral tones to formulate subtle background tints and determine Light/Dark mode.",
  "Identify vibrant peaks for primary accents, ensuring they pop against the current background.",
  "Calculate a 180° hue shift for the complementary accent to provide secondary highlights.",
  "Apply an Exponential Moving Average (EMA) to smooth the transition beautifully over time."
];
</script>

<template>
  <ArticleHeading :level="2" accent bordered>The Mechanics</ArticleHeading>
  <ArticleText class="mb-4">
    This demonstration does not simply average the entire image. It utilizes an
    <InlineCode>OffscreenCanvas</InlineCode>
    to render the exact viewport you are looking at.
  </ArticleText>
  <ArticleNumberList :items="mechanicsItems" />
</template>
