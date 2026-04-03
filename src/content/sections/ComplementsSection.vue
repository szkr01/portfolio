<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleQuote from "../../components/article/ArticleQuote.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import InlineAccent from "../../components/article/InlineAccent.vue";
</script>

<template>
  <ArticleHeading :level="2" accent bordered>Understanding Complements</ArticleHeading>
  <ArticleText class="mb-4">
    Complementary colors are pairs of colors which, when combined or mixed, cancel each other out
    by producing a grayscale color like white or black. When placed next to each other, they
    create the strongest contrast for those two colors.
  </ArticleText>
  <ArticleQuote attribution="Pierre Bonnard">
    "Color does not add a pleasant quality to design - it reinforces it." <br />
  </ArticleQuote>
  <ArticleText>
    In digital interfaces, relying purely on opposite hues can lead to visual vibration. The key
    is to manage the
    <InlineAccent>Lightness</InlineAccent>
    and
    <InlineAccent>Chroma</InlineAccent>
    (saturation) to maintain readability while keeping the aesthetic link.
  </ArticleText>
</template>
