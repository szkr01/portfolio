import type { Component } from "vue";
import { articleSectionDefinitions } from "./articleSectionDefinitions";
import ComplementsSection from "./sections/ComplementsSection.vue";
import ContrastSection from "./sections/ContrastSection.vue";
import HeroSection from "./sections/HeroSection.vue";
import MechanicsSection from "./sections/MechanicsSection.vue";

export interface ArticleSectionEntry {
  id: string;
  sceneId: string;
  as: "header" | "section";
  className?: string;
  component: Component;
}

const articleSectionComponents: Record<string, Component> = {
  hero: HeroSection,
  complements: ComplementsSection,
  contrast: ContrastSection,
  mechanics: MechanicsSection
};

export const articleSections: ArticleSectionEntry[] = articleSectionDefinitions.map((entry) => ({
  ...entry,
  component: articleSectionComponents[entry.id]
}));
