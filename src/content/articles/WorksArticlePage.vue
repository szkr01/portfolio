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
        思いついたものは、その都度かたちにしています。公開しているものは非常に少数で、共有可能なものの中から特に面白い、わかりやすいものをピックアップしています。すべてのコードはリンクからgithub経由で閲覧することができます。
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
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/HRM-sudoku">HRM-sudoku</ArticleLink></strong>
          <br/>
          Hierarchical Reasoning Modelを用いた数独ソルバーのToy実装。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/VAE_of_Theseus">VAE_of_Theseus</ArticleLink></strong>
          <br/>
          Subramaniam らの論文「<ArticleLink href="https://arxiv.org/abs/2512.04198">Network of Theseus (like the ship)</ArticleLink>」の実験コード。大学のレポート題材として作成。
        </li>
        
      </ul>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Graphics / Interactive</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/portfolio/blob/main/src/shaders/flow.frag">BlueFlow</ArticleLink></strong>
          - 左側のシーン。FBMを利用した流体のようなテクスチャ。GLSLフラグメントシェーダーで実装。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/ShaderEditor">Shader Editor</ArticleLink></strong>
          - レイマーチングシーン内のオブジェクトをブラウザから操作できるエディタ。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/glassView">GlassView</ArticleLink></strong>
          - レイトレーシングを用いて、抽象的なガラス屈折エフェクトを適用するアプリ。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/PQR-ts/">PQR-ts</ArticleLink></strong>
          - 動くQRコード。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/DOPE_ABLETON_MOD">DOPE ABLETON MOD</ArticleLink></strong>
          <br/>
          Ableton Liveのレンダラーにフックし、シェーダーによる動的な視覚エフェクトを加えるMod。
        </li>
      </ul>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>p5.js sketch</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="https://editor.p5js.org/szkr01/sketches/emdQKs8BS">BoidSphere</ArticleLink></strong>
          - Boidアルゴリズムを球面上で動かしたスケッチ。
        </li>
        <li>
          <strong><ArticleLink href="https://editor.p5js.org/szkr01/sketches/Hha8Fp1vf">circle-wave</ArticleLink></strong>
          - パーフェクトループの基本的なスケッチ。
        </li>
        <li>
          <strong><ArticleLink href="https://editor.p5js.org/szkr01/sketches/EP3LLSLIo">Maclaurin expansion</ArticleLink></strong>
          - 楕円をマクローリン展開で近似するスケッチ。
        </li>
        
      </ul>
    </section>

    <section class="mb-10">
      <ArticleHeading :level="2" accent bordered>Tools / Web Apps</ArticleHeading>
      <ul class="list-disc pl-6 mt-4 space-y-2 theme-text color-transition leading-relaxed">
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/OverSub.html">Sketch Book</ArticleLink></strong>
          - 読み音韻を意識しながら書ける歌詞エディタ。楽曲「<ArticleLink href="https://youtu.be/8T6zb3059P4?si=AyA1H89LCF4Etsaf">過置換</ArticleLink>」に影響を受け作成。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/ParallaxGenerator.html">Parallax Generator</ArticleLink></strong>
          - 視差効果を簡単に作成できるウェブアプリ。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/depth_map.html">Image to 3D Viewer</ArticleLink></strong>
          - 画像の深度マップを推定し、簡単な3Dビューアで表示するウェブアプリ。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/QRtest.html">CuteR web</ArticleLink></strong>
          - 画像を埋め込んだQRコードを生成できるウェブアプリ。<ArticleLink href="https://github.com/chinuno-usami/CuteR">CuteR</ArticleLink>のweb版。
        </li>
        <li>
          <strong><ArticleLink href="https://szkr01.github.io/WASTE_APPS/pages/AudioSorter.html">WaveSort</ArticleLink></strong>
          - 音声をN分割し、ソートをした際にアクセスした音を構築するwebプレイグラウンド。
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
          <strong><ArticleLink href="https://github.com/szkr01/pwaUserScript">PWA Wrapper APK Generator</ArticleLink></strong>
          - Android上でPWAアプリ上でUserScriptを実行するためのスクリプト群。
        </li>
        <li>
          <strong><ArticleLink href="https://github.com/szkr01/connection_logger">connection_logger</ArticleLink></strong>
          - wininet.dllをオーバーライドし、windowsアプリケーションの通信をログに取るためのプログラム。
        </li>
      </ul>
    </section>
  </article>
</template>
