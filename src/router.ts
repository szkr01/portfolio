import { createRouter, createWebHashHistory } from "vue-router";
import { articlePages } from "./content/articlePages";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: `/articles/${articlePages[0].slug}`
    },
    ...articlePages.map((entry) => ({
      path: `/articles/${entry.slug}`,
      name: entry.slug,
      component: entry.component,
      meta: {
        article: entry
      }
    })),
    {
      path: "/:pathMatch(.*)*",
      redirect: `/articles/${articlePages[0].slug}`
    }
  ]
});
