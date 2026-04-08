import { describe, expect, it } from "vitest";
import { canvasScenes } from "../src/canvas/scenes";
import { articlePages } from "../src/content/articlePages";

describe("content registry alignment", () => {
  it("keeps every routed article scene registered in the canvas scene list", () => {
    const canvasSceneIds = new Set(canvasScenes.map((entry) => entry.id));

    for (const article of articlePages) {
      expect(canvasSceneIds.has(article.sceneId)).toBe(true);
    }
  });

  it("carries each article theme mode into the matching canvas scene", () => {
    const sceneThemeModes = new Map(canvasScenes.map((entry) => [entry.id, entry.themeMode]));

    for (const article of articlePages) {
      expect(sceneThemeModes.get(article.sceneId)).toBe(article.themeMode);
    }
  });
});
