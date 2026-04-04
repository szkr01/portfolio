import type { Component } from "vue";
import AboutArticlePage from "./articles/AboutArticlePage.vue";
import ImageDriftArticlePage from "./articles/ImageDriftArticlePage.vue";
import MotionFieldArticlePage from "./articles/MotionFieldArticlePage.vue";

export interface ArticlePageEntry {
  slug: string;
  title: string;
  sceneId: string;
  themeMode: "light" | "dark";
  component: Component;
  paneRatio: {
    canvas: number;
    article: number;
  };
}

export const articlePages: ArticlePageEntry[] = [
  {
    slug: "About",
    title: "About",
    sceneId: "About",
    themeMode: "light",
    component: AboutArticlePage,
    paneRatio: {
      canvas: 1,
      article: 1
    }
  },
  {
    slug: "motion-field",
    title: "Motion Field",
    sceneId: "motion-field",
    themeMode: "dark",
    component: MotionFieldArticlePage,
    paneRatio: {
      canvas: 1,
      article: 3
    }
  },
  {
    slug: "image-drift",
    title: "Image Drift",
    sceneId: "image-drift",
    themeMode: "light",
    component: ImageDriftArticlePage,
    paneRatio: {
      canvas: 1,
      article: 1
    }
  }
];

export const articlePagesBySlug = Object.fromEntries(
  articlePages.map((entry) => [entry.slug, entry] satisfies [string, ArticlePageEntry])
);
