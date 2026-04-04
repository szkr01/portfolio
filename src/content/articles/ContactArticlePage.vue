<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleLink from "../../components/article/ArticleLink.vue";
import ArticleText from "../../components/article/ArticleText.vue";
</script>

<template>
  <article>
    <header class="mb-12">
      <ArticleHeading :level="1">
        <span class="theme-accent color-transition">Contact</span>
      </ArticleHeading>
    </header>

    <section>
      <ArticleText class="mb-4">
        You can find my projects and contact me via GitHub:
      </ArticleText>
      <ArticleText>
        <ArticleLink href="https://github.com/szkr01/">GitHub - szkr01</ArticleLink>
      </ArticleText>
    </section>
  </article>
</template>
