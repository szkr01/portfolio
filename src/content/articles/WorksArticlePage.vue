<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleLink from "../../components/article/ArticleLink.vue";
</script>

<template>
  <article>
    <header class="mb-12">
      <ArticleHeading :level="1">
        Works &
        <span class="theme-accent color-transition">Projects</span>
      </ArticleHeading>
      <p class="theme-muted color-transition text-lg leading-relaxed mt-4">
        画像表現、検索、ランタイム実装、音楽周辺のツールを中心に制作しています。<br />
        表現だけでなく、内部構造やインタラクションの設計も含めて作ることが多いです。
      </p>
    </header>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Image Search</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/PureILEMB">Pure ILEMB</ArticleLink></strong>
          - ComfyUIなどのローカル環境向けに最適化された、ILEMBの後継画像検索機。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/ILEMB">ILEMB</ArticleLink></strong>
          - ベクトル表現を利用した直感的な高速画像検索エンジン。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/booruViewer">booruViewer</ArticleLink></strong>
          - リアルタイムでイラストのインデックスを構築するエコシステム。
        </li>
      </ul>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Machine Learning</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/DiT.html">pixelwise DiT</ArticleLink></strong>
          <br/>
          フルスクラッチで学習された、画像のピクセル単位で動作するTransformerベースのDiffusionモデル。非常に小さく、スマホで動作します。
        </li>
      </ul>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Graphics / Interactive</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="./#/articles/works">BlueFlow</ArticleLink></strong>
          - 左側のシーン。FBMを利用した流体のようなテクスチャ。GLSLフラグメントシェーダーで実装。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/ShaderEditor">Shader Editor</ArticleLink></strong>
          - レイマーチングシーン内のオブジェクトをブラウザから操作できるエディタ。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/glassView">GlassView</ArticleLink></strong>
          - リアルタイム動画サンプリングを用いて、抽象的なガラス屈折エフェクトを適用するアプリ。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/PQR-ts/">PQR-ts</ArticleLink></strong>
          - 音楽の歌詞に合わせて動くインタラクティブなQRコード実装。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/DOPE_ABLETON_MOD">DOPE ABLETON MOD</ArticleLink></strong>
          <br/>
          Ableton Liveのレンダラーにフックし、シェーダーによる動的な視覚エフェクトを加えるMod。
        </li>
      </ul>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Tools / Web Apps</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/OverSub.html">Sketch Book</ArticleLink></strong>
          - 読み音韻を意識しながら書ける歌詞エディタ。楽曲「過置換」に影響を受け作成。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/ParallaxGenerator.html">Parallax Generator</ArticleLink></strong>
          - 視差効果を簡単に作成できるウェブアプリ。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/QRtest.html">CuteR web</ArticleLink></strong>
          - 画像を埋め込んだQRコードを生成できるウェブアプリ。<ArticleLink href="https://github.com/chinuno-usami/CuteR">CuteR</ArticleLink>のweb版。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/">WASTE APPS</ArticleLink></strong>
          - 言語モデルで量産したアプリケーション群のインデックス。
        </li>
      </ul>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Runtime / Reverse Engineering</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/myJVM">myJVM</ArticleLink></strong>
          - Javaのクラスファイルを読み取り、簡易的なバイトコード解釈でmainメソッドを実行する小さなJVMインタプリタ実装。
        </li>
        <li>
          <strong><ArticleLink>LostCode</ArticleLink></strong>
          - コンソール版マインクラフトMOD。物理エンジンを実装し、アイテムに剛体挙動を適用。アセンブリ直書き実装。
        </li>
      </ul>
    </section>
  </article>
</template>
