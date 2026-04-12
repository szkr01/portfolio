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

const interestedItems = [
  "Machine Learning",
  "Searching",
  "Rendering",
  "Reverse Engineering",
  "Design",
  "Music",
];

const technicalSkillsItems = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Node.js",
  "C/C++",
  "C#",
  "Java",
  "Rust",
  "x86-64 Assembly",
  "PowerPC Assembly",
  "GLSL",
];

const toolsItems = [
  "Visual Studio Code",
  "Antigravity",
  "WSL",
  "Git",
  "Ghidra/IDA Pro",
  "Codex",
  "Opencode",
  "Ableton Live",
  "Procreate",
  "Blender"
];

</script>

<template>
  <article>
    <header class="mb-12">
      <div class="my-8">
        <ParallaxContainer />
      </div>
      <ArticleHeading :level="1">
        About: 
        <span class="theme-accent color-transition">szkr01</span>
      </ArticleHeading>

      <p class="theme-muted color-transition text-lg leading-relaxed">
        プログラミング、機械学習、絵、音楽<br />
        普段は、Web アプリや、検索システムなどを作っています。抽象的なものが好きです。普遍的に表層だけでなく、内部の仕組みや実装そのものにも興味があり、リバースエンジニアリングを趣味で行います。メイン言語はJavaScriptです。
      </p>
    </header>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Interested In</ArticleHeading>
      <ArticleText class="mb-4">
        関心のある分野
      </ArticleText>
      <ArticleTagList :items="interestedItems" />
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Technical Skills</ArticleHeading>
      <ArticleText class="mb-4">
        経験のある技術スタック
      </ArticleText>
      <ArticleTagList :items="technicalSkillsItems" />
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Tools</ArticleHeading>
      <ArticleText class="mb-4">
        普段使っているツールや環境
      </ArticleText>
      <ArticleTagList :items="toolsItems" />
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Recent Works</ArticleHeading>
      <ArticleText class="mb-4">
        公開されている主な過去作品
      </ArticleText>
      <ul class="list-disc pl-6 space-y-2 theme-text color-transition leading-relaxed">
        <li><strong><a href="https://github.com/szkr01/portfolio/blob/main/src/components/article/ParallaxContainer.vue" rel="noopener noreferrer" class="theme-accent hover:underline">Icon Character</a></strong> - このページで使われている、視差効果で働くキャラクターアイコン</li>
        <li><strong><a href="https://szkr01.github.io/WASTE_APPS/pages/OverSub.html" target="_blank" rel="noopener noreferrer" class="theme-accent hover:underline">Sketch Book</a></strong> - 音韻を意識しながら書ける歌詞エディタ</li>
        <li><strong><a href="https://github.com/szkr01/PureILEMB" target="_blank" rel="noopener noreferrer" class="theme-accent hover:underline">Pure ILEMB</a></strong> - ローカル画像生成環境向けの画像検索システム</li>
        <li><strong><a href="https://github.com/szkr01/ShaderEditor" target="_blank" rel="noopener noreferrer" class="theme-accent hover:underline">Shader Editor</a></strong> - レイマーチングシーン内のオブジェクトを操作できるエディタ</li>
        <li><strong><a href="https://github.com/szkr01/DOPE_ABLETON_MOD" target="_blank" rel="noopener noreferrer" class="theme-accent hover:underline">DOPE ABLETON MOD</a></strong> - Ableton Liveにシェーダーによる動的視覚エフェクトを加えるMod</li>
        <li><strong><a href="https://github.com/szkr01/glassView" target="_blank" rel="noopener noreferrer" class="theme-accent hover:underline">GlassView</a></strong> - 画像に抽象的なガラス屈折エフェクトを適用するWebアプリ</li>
      </ul>
    </section>
  </article>
</template>
