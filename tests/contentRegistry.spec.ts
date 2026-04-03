import { describe, expect, it } from "vitest";
import { canvasScenes } from "../src/canvas/scenes";
import { articleSectionDefinitions } from "../src/content/articleSectionDefinitions";

describe("content registry alignment", () => {
  it("keeps article sections and canvas scenes aligned by scene id", () => {
    const sectionSceneIds = articleSectionDefinitions.map((entry) => entry.sceneId);
    const canvasSceneIds = canvasScenes.map((entry) => entry.id);

    expect(canvasSceneIds).toEqual(sectionSceneIds);
  });
});
