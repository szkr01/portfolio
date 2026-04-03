<script setup lang="ts">
import ArticleCard from "../../components/article/ArticleCard.vue";
import ArticleCardGrid from "../../components/article/ArticleCardGrid.vue";
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleNumberList from "../../components/article/ArticleNumberList.vue";
import ArticleQuote from "../../components/article/ArticleQuote.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import InlineAccent from "../../components/article/InlineAccent.vue";
import InlineCode from "../../components/article/InlineCode.vue";

const mechanicsItems = [
  "Extract dominant neutral tones to formulate subtle background tints and determine Light/Dark mode.",
  "Identify vibrant peaks for primary accents, ensuring they pop against the current background.",
  "Calculate a 180 degree hue shift for the complementary accent to provide secondary highlights.",
  "Apply an Exponential Moving Average (EMA) to smooth the transition beautifully over time."
];
</script>

<template>
  <article>
    <header class="mb-12">
      <ArticleHeading :level="1">
        Color Harmony &
        <span class="theme-accent color-transition">Contrast</span>
      </ArticleHeading>
      <p class="theme-muted color-transition text-lg leading-relaxed">
        A visual exploration of dynamic themes driven by localized spatial color sampling. As you
        navigate the image, the background, text, and accents adapt in real-time.
      </p>
    </header>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Understanding Complements</ArticleHeading>
      <ArticleText class="mb-4">
        Complementary colors are pairs of colors which, when combined or mixed, cancel each other
        out by producing a grayscale color like white or black. When placed next to each other,
        they create the strongest contrast for those two colors.
      </ArticleText>
      <ArticleQuote attribution="Pierre Bonnard">
        "Color does not add a pleasant quality to design - it reinforces it." <br />
      </ArticleQuote>
      <ArticleText>
        In digital interfaces, relying purely on opposite hues can lead to visual vibration. The
        key is to manage the
        <InlineAccent>Lightness</InlineAccent>
        and
        <InlineAccent>Chroma</InlineAccent>
        (saturation) to maintain readability while keeping the aesthetic link.
      </ArticleText>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Contrast &amp; Context</ArticleHeading>
      <ArticleText class="mb-4">
        The background color naturally shifts based on the overall brightness of the viewport.
        Darker image areas trigger a subtle dark mode, while lighter areas return to a luminous
        white, maintaining perfect text contrast automatically.
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
          Accent colors are verified against the background. If contrast falls below WCAG
          standards, lightness is dynamically corrected.
        </ArticleCard>
      </ArticleCardGrid>
    </section>

    <section>
      <ArticleHeading :level="2" accent bordered>The Mechanics</ArticleHeading>
      <ArticleText class="mb-4">
        This demonstration does not simply average the entire image. It utilizes an
        <InlineCode>OffscreenCanvas</InlineCode>
        to render the exact viewport you are looking at.
      </ArticleText>
      <ArticleNumberList :items="mechanicsItems" />
    </section>
  </article>
</template>
