export interface ArticleSection {
  id: string;
  title?: string;
  kind: "header" | "complements" | "contrast" | "mechanics";
}

export const articleSections: ArticleSection[] = [
  { id: "hero", kind: "header" },
  { id: "complements", kind: "complements", title: "Understanding Complements" },
  { id: "contrast", kind: "contrast", title: "Contrast & Context" },
  { id: "mechanics", kind: "mechanics", title: "The Mechanics" }
];
