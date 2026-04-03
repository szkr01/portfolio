import { describe, expect, it } from "vitest";
import { canvasScenes } from "../src/canvas/scenes";
import { articlePages } from "../src/content/articlePages";

describe("content registry alignment", () => {
  it("keeps article pages and canvas scenes aligned by scene id", () => {
    const articleSceneIds = articlePages.map((entry) => entry.sceneId);
    const canvasSceneIds = canvasScenes.map((entry) => entry.id);

    expect(canvasSceneIds).toEqual(articleSceneIds);
  });
});
