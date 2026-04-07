<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import poolAudio from "../assets/articles/music/pool.mp3";
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
      :audio-src="poolAudio"
      duration-label="4:12"
      :artwork-src="poolJacket"
      artwork-alt="Pool jacket"
    />
    <MusicTrackCard
      title="Digital Drift"
      genre="Electronica"
      date-label="2025.11"
      description="グリッチノイズとタイトなビートをベースにしたエレクトロニカ・トラック。ランダムに生成されるエフェクトと堅牢なベースラインの対比を楽しめるように構成しました。"
      accent="emerald"
      :audio-src="null"
      duration-label="2:58"
    />
  </article>
</template>
