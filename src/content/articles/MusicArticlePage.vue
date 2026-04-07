<script setup lang="ts">
import ArticleHeading from "../../components/article/ArticleHeading.vue";
import ArticleText from "../../components/article/ArticleText.vue";
import poolJacket from "../assets/articles/music/pool_jacket.jpg";
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

    <!-- Track 1 -->
    <section class="mb-16">
      <ArticleHeading :level="2" accent bordered>Pool</ArticleHeading>
      <div class="flex flex-col md:flex-row gap-8 items-start mt-6">
        
        <div class="w-full md:w-56 aspect-[4/3] md:aspect-square shrink-0 rounded-2xl overflow-hidden border border-black/10 dark:border-white/5 relative group bg-black/5">
          <img
            :src="poolJacket"
            alt="Pool jacket"
            data-testid="pool-jacket"
            class="h-full w-full object-cover"
          >
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <span class="text-white text-sm font-medium tracking-widest uppercase">Play Track</span>
          </div>
        </div>

        <div class="w-full flex-1 flex flex-col">
          <!-- Info -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Ambient</span>
              <span class="text-xs font-mono theme-muted">2026.04</span>
            </div>
            <p class="theme-muted text-sm sm:text-base leading-relaxed">
              作曲サークルで毎週行われている、「DTM研究会」で制作したトラック。硬い空気感と水中のようなドロップ。
            </p>
          </div>
          
          <!-- Player UI -->
          <div class="mt-auto bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-transparent dark:border-white/5">
            <!-- Progress -->
            <div class="flex items-center gap-4 mb-3">
              <span class="text-xs theme-muted font-mono w-8 text-right">0:00</span>
              <div class="flex-1 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden cursor-pointer relative group">
                <div class="absolute top-0 left-0 h-full w-1/3 bg-indigo-500 rounded-full transition-all group-hover:bg-indigo-400"></div>
                <!-- Playhead -->
                <div class="absolute top-1/2 left-1/3 w-3 h-3 bg-indigo-600 dark:bg-white rounded-full -translate-y-1/2 -ml-1.5 shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
              </div>
              <span class="text-xs theme-muted font-mono w-8">4:12</span>
            </div>
            
            <!-- Controls -->
            <div class="flex items-center justify-between px-2">
              <button class="text-current opacity-50 hover:opacity-100 transition-opacity" title="Repeat">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              </button>
              
              <div class="flex items-center gap-4 sm:gap-6">
                <button class="w-10 h-10 rounded-full flex items-center justify-center text-current opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                </button>
                <button class="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all transform hover:scale-105 shadow-md">
                  <svg class="translate-x-[2px]" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <button class="w-10 h-10 rounded-full flex items-center justify-center text-current opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                </button>
              </div>

              <button class="text-current opacity-50 hover:opacity-100 transition-opacity" title="Volume">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Track 2 -->
    <section class="mb-16">
      <ArticleHeading :level="2" accent bordered>Digital Drift</ArticleHeading>
      <div class="flex flex-col md:flex-row gap-8 items-start mt-6">
        
        <!-- Album Art Mock -->
        <div class="w-full md:w-56 aspect-[4/3] md:aspect-square shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-800/20 flex flex-col items-center justify-center overflow-hidden border border-black/10 dark:border-white/5 relative group">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <span class="text-white text-sm font-medium tracking-widest uppercase">Play Track</span>
          </div>
          <div class="w-16 h-16 rounded-full border border-current opacity-30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          </div>
        </div>

        <div class="w-full flex-1 flex flex-col">
          <!-- Info -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">Electronica</span>
              <span class="text-xs font-mono theme-muted">2025.11</span>
            </div>
            <p class="theme-muted text-sm sm:text-base leading-relaxed">
              グリッチノイズとタイトなビートをベースにしたエレクトロニカ・トラック。
              ランダムに生成されるエフェクトと堅牢なベースラインの対比を楽しめるように構成しました。
            </p>
          </div>
          
          <!-- Player UI -->
          <div class="mt-auto bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-transparent dark:border-white/5">
            <!-- Progress -->
            <div class="flex items-center gap-4 mb-3">
              <span class="text-xs theme-muted font-mono w-8 text-right">0:00</span>
              <div class="flex-1 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden cursor-pointer relative group">
                <div class="absolute top-0 left-0 h-full w-0 bg-emerald-500 rounded-full transition-all group-hover:bg-emerald-400"></div>
                <!-- Playhead -->
                <div class="absolute top-1/2 left-0 w-3 h-3 bg-emerald-600 dark:bg-white rounded-full -translate-y-1/2 -ml-1.5 shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
              </div>
              <span class="text-xs theme-muted font-mono w-8">2:58</span>
            </div>
            
            <!-- Controls -->
            <div class="flex items-center justify-between px-2">
              <button class="text-current opacity-50 hover:opacity-100 transition-opacity" title="Repeat">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              </button>
              
              <div class="flex items-center gap-4 sm:gap-6">
                <button class="w-10 h-10 rounded-full flex items-center justify-center text-current opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                </button>
                <button class="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all transform hover:scale-105 shadow-md">
                  <svg class="translate-x-[2px]" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <button class="w-10 h-10 rounded-full flex items-center justify-center text-current opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                </button>
              </div>

              <button class="text-current opacity-50 hover:opacity-100 transition-opacity" title="Volume">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

  </article>
</template>
