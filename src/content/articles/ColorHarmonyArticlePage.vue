<script setup lang="ts">
import ArticleCard from "../../components/article/ArticleCard.vue";
import ArticleCardGrid from "../../components/article/ArticleCardGrid.vue";
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleNumberList from "../../components/article/ArticleNumberList.vue";
import ArticleQuote from "../../components/article/ArticleQuote.vue";
import ArticleTagList from "../../components/article/ArticleTagList.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import InlineAccent from "../../components/article/InlineAccent.vue";
import InlineCode from "../../components/article/InlineCode.vue";
import ParallaxContainer from "../../components/article/ParallaxContainer.vue";

const mechanicsItems = [
  "Extract dominant neutral tones to formulate subtle background tints and determine Light/Dark mode.",
  "Identify vibrant peaks for primary accents, ensuring they pop against the current background.",
  "Calculate a 180 degree hue shift for the complementary accent to provide secondary highlights.",
  "Apply an Exponential Moving Average (EMA) to smooth the transition beautifully over time."
];

const interestedItems = [
  "Machine Learning",
  "Searching",
  "Rendering",
  "Reverse Engineering",
  "Design",
  "Music",
];
</script>

<template>
  <article>
    <header class="mb-12">
      <div class="my-8">
        <ParallaxContainer />
      </div>
      <ArticleHeading :level="1">
        About :
        <span class="theme-accent color-transition">szkr01</span>
      </ArticleHeading>

      <p class="theme-muted color-transition text-lg leading-relaxed">
        プログラミング、機械学習、絵、音楽<br />
        普段は、Web アプリや画像表現、検索システムなどを作っています。見た目だけでなく、内部の仕組みや実装そのものにも興味があり、リバースエンジニアリングが好きです。抽象化された設計が好み。
      </p>
    </header>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Interested In</ArticleHeading>
      <ArticleText class="mb-4">
        関心のある分野や技術スタック
      </ArticleText>
      <ArticleTagList :items="interestedItems" />
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Works</ArticleHeading>
      <ArticleText class="mb-4">
        過去の作品群
      </ArticleText>
      <ArticleNumberList :items="mechanicsItems" />
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

    </section>
  </article>
</template>
