import { describe, expect, it } from "vitest";
import { canvasScenes } from "../src/canvas/scenes";
import { articlePages } from "../src/content/articlePages";

describe("content registry alignment", () => {
  it("keeps article pages and canvas scenes aligned by scene id", () => {
    const articleSceneIds = articlePages.map((entry) => entry.sceneId);
    const canvasSceneIds = canvasScenes.map((entry) => entry.id);

    expect(canvasSceneIds).toEqual(articleSceneIds);
  });

  it("carries each article theme mode into the matching canvas scene", () => {
    const sceneThemeModes = new Map(canvasScenes.map((entry) => [entry.id, entry.themeMode]));

    for (const article of articlePages) {
      expect(sceneThemeModes.get(article.sceneId)).toBe(article.themeMode);
    }
  });
});
