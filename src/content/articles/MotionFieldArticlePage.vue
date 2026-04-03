<script setup lang="ts">
import ArticleCard from "../../components/article/ArticleCard.vue";
import ArticleCardGrid from "../../components/article/ArticleCardGrid.vue";
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleNumberList from "../../components/article/ArticleNumberList.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import InlineCode from "../../components/article/InlineCode.vue";

const playbackNotes = [
  "Keep the canvas shader alive while the article route changes so the transition can be composed instead of replaced abruptly.",
  "Bind one scene per article and let navigation choose the next runtime intentionally.",
  "Use a lightweight article shell so the right pane changes content without remounting the left pane."
];
</script>

<template>
  <article>
    <header class="mb-12">
      <ArticleHeading :level="1">
        Motion Field &
        <span class="theme-accent color-transition">Routing</span>
      </ArticleHeading>
      <p class="theme-muted color-transition text-lg leading-relaxed">
        This article treats navigation as the signal that changes the visual field. The shader is
        no longer tied to section visibility, so scroll stays focused on reading.
      </p>
    </header>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Route-Driven Visual State</ArticleHeading>
      <ArticleText class="mb-4">
        Each article owns a single scene identifier. When the route changes, the canvas activates
        the destination scene and keeps the transition logic inside the controller where timing and
        runtime reuse already exist.
      </ArticleText>
      <ArticleCardGrid>
        <ArticleCard title="Stable Reading Flow">
          <template #icon>
            <div class="theme-bg theme-border h-4 w-4 rounded-full border"></div>
          </template>
          Long articles can scroll without accidentally changing the left-side visual every time a
          subsection enters the viewport.
        </ArticleCard>
        <ArticleCard title="Clear State Boundary" accent>
          <template #icon>
            <div class="theme-accent-bg h-4 w-4 rounded-full"></div>
          </template>
          The route becomes the single public contract for both article content and shader
          selection.
        </ArticleCard>
      </ArticleCardGrid>
    </section>

    <section>
      <ArticleHeading :level="2" accent bordered>Implementation Notes</ArticleHeading>
      <ArticleText class="mb-4">
        The shell keeps the canvas mounted and swaps only the right pane through
        <InlineCode>vue-router</InlineCode>
        with hash history, which keeps deployment straightforward on GitHub Pages.
      </ArticleText>
      <ArticleNumberList :items="playbackNotes" />
    </section>
  </article>
</template>
