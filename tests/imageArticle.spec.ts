import { describe, expect, it } from "vitest";
import { articlePages } from "../src/content/articlePages";
import { canvasScenes } from "../src/canvas/scenes";

describe("image article integration", () => {
  it("registers the image-drift article and scene with aligned ids", () => {
    const article = articlePages.find((entry) => entry.slug === "image-drift");
    const scene = canvasScenes.find((entry) => entry.id === "image-drift");

    expect(article).toMatchObject({
      slug: "image-drift",
      title: "Image Drift",
      sceneId: "image-drift"
    });
    expect(scene).toMatchObject({
      id: "image-drift",
      runtimeKey: "image-drift",
      kind: "image",
      transitionId: "live-mix"
    });
    expect(scene?.source).toMatchObject({
      src: expect.stringContaining("testImage")
    });
  });
});
