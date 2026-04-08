<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import poolAudio from "../assets/articles/music/pool.mp3";
import poolJacket from "../assets/articles/music/pool_jacket.png";
import MusicTrackCard from "../../components/article/MusicTrackCard.vue";
</script>

<template>
  <article>
    <header class="mb-16">
      <ArticleHeading :level="1">
        Music
      </ArticleHeading>
      <ArticleText class="mt-4 theme-muted">
        個人的に制作している楽曲。
      </ArticleText>
    </header>

    <MusicTrackCard
      title="Pool"
      genre="Electro BPM178"
      date-label="2026.03"
      description="所属の作曲サークルで制作したトラック。硬いタイルと水中のような質感。"
      accent="indigo"
      :audio-src="poolAudio"
      duration-label="1:47"
      :artwork-src="poolJacket"
      artwork-alt="Pool jacket"
    />
  </article>
</template>
