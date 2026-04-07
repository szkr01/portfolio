<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import poolJacket from "../assets/articles/music/pool_jacket.jpg";
import MusicTrackCard from "./MusicTrackCard.vue";
</script>

<template>
  <article>
    <header class="mb-16">
      <ArticleHeading :level="1">
        Music
      </ArticleHeading>
      <ArticleText class="mt-4 theme-muted">
        個人的に制作している楽曲やサウンドスケープ。
      </ArticleText>
    </header>

    <MusicTrackCard
      title="Pool"
      genre="Ambient"
      date-label="2026.04"
      description="作曲サークルで毎週行われている、「DTM研究会」で制作したトラック。硬い空気感と水中のようなドロップ。"
      accent="indigo"
      current-time-label="0:00"
      duration-label="4:12"
      :progress-ratio="1 / 3"
      :artwork="{
        kind: 'image',
        src: poolJacket,
        alt: 'Pool jacket',
        testId: 'pool-jacket'
      }"
    />
    <MusicTrackCard
      title="Digital Drift"
      genre="Electronica"
      date-label="2025.11"
      description="グリッチノイズとタイトなビートをベースにしたエレクトロニカ・トラック。ランダムに生成されるエフェクトと堅牢なベースラインの対比を楽しめるように構成しました。"
      accent="emerald"
      current-time-label="0:00"
      duration-label="2:58"
      :progress-ratio="0"
      :artwork="{
        kind: 'mock',
        icon: 'music-note'
      }"
    />
  </article>
</template>
