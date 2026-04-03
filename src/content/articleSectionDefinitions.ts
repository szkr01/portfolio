export interface ArticleSectionDefinition {
  id: string;
  sceneId: string;
  as: "header" | "section";
  className?: string;
}

export const articleSectionDefinitions: ArticleSectionDefinition[] = [
  { id: "hero", sceneId: "hero", as: "header", className: "mb-12" },
  { id: "complements", sceneId: "complements", as: "section", className: "mb-10" },
  { id: "contrast", sceneId: "contrast", as: "section", className: "mb-10" },
  { id: "mechanics", sceneId: "mechanics", as: "section" }
];
