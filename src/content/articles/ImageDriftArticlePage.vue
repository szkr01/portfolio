<script setup lang="ts">
import ArticleCard from "../../components/article/ArticleCard.vue";
import ArticleCardGrid from "../../components/article/ArticleCardGrid.vue";
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleNumberList from "../../components/article/ArticleNumberList.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import InlineCode from "../../components/article/InlineCode.vue";

const motionNotes = [
  "The renderer derives a square crop from the image short edge and keeps the scale in a named constant instead of scattering magic numbers.",
  "Each move chooses a new crop origin within legal bounds, then interpolates slowly toward it with eased progress.",
  "The destination draw always uses canvas height for both dimensions, so narrower panes simply clip the right side while the left edge stays stable.",
  "Resize redraws from the current motion state rather than restarting the path, keeping pane-ratio animation visually continuous."
];
</script>

<template>
  <article>
    <header class="mb-12">
      <ArticleHeading :level="1">
        Image
        <span class="theme-accent color-transition">Drift</span>
      </ArticleHeading>
      <p class="theme-muted color-transition text-lg leading-relaxed">
        This scene trades shader synthesis for a slow camera move across a single still image. The
        motion comes from a square crop that keeps drifting to new targets.
      </p>
    </header>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Square Crop, Stable Edge</ArticleHeading>
      <ArticleText class="mb-4">
        The canvas treats the rendered image as a square view first. That square is always anchored
        to the left side of the pane, so layout changes reveal less on the right instead of
        recomposing the frame.
      </ArticleText>
      <ArticleCardGrid>
        <ArticleCard title="Short-Edge Crop">
          <template #icon>
            <div class="theme-bg theme-border h-4 w-4 rounded-sm border"></div>
          </template>
          The crop size follows the image short edge and leaves a small margin so the camera has
          room to move.
        </ArticleCard>
        <ArticleCard title="Continuous Motion" accent>
          <template #icon>
            <div class="theme-accent-bg h-4 w-4 rounded-full"></div>
          </template>
          Each destination becomes the next starting point, so the pan loops without snapping back
          to a fixed origin.
        </ArticleCard>
      </ArticleCardGrid>
    </section>

    <section>
      <ArticleHeading :level="2" accent bordered>Implementation Notes</ArticleHeading>
      <ArticleText class="mb-4">
        The behavior lives in the shared image renderer, which keeps the scene contract simple:
        the article only supplies an asset URL through the existing
        <InlineCode>kind: "image"</InlineCode>
        source shape.
      </ArticleText>
      <ArticleNumberList :items="motionNotes" />
    </section>
  </article>
</template>
