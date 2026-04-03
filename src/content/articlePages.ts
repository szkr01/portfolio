import type { Component } from "vue";
import ColorHarmonyArticlePage from "./articles/ColorHarmonyArticlePage.vue";
import MotionFieldArticlePage from "./articles/MotionFieldArticlePage.vue";

export interface ArticlePageEntry {
  slug: string;
  title: string;
  sceneId: string;
  component: Component;
  paneRatio: {
    canvas: number;
    article: number;
  };
}

export const articlePages: ArticlePageEntry[] = [
  {
    slug: "color-harmony",
    title: "Color Harmony",
    sceneId: "color-harmony",
    component: ColorHarmonyArticlePage,
    paneRatio: {
      canvas: 1,
      article: 1
    }
  },
  {
    slug: "motion-field",
    title: "Motion Field",
    sceneId: "motion-field",
    component: MotionFieldArticlePage,
    paneRatio: {
      canvas: 1,
      article: 3
    }
  }
];

export const articlePagesBySlug = Object.fromEntries(
  articlePages.map((entry) => [entry.slug, entry] satisfies [string, ArticlePageEntry])
);
