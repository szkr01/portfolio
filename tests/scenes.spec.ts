import { describe, expect, it } from "vitest";
import { canvasScenes } from "../src/canvas/scenes";

describe("canvas scenes", () => {
  it("uses the embedded flow shader for the second article", () => {
    const secondScene = canvasScenes[1];

    expect(secondScene?.id).toBe("works");
    expect(secondScene?.runtimeKey).toBe("flow");
    expect(secondScene?.kind).toBe("shader");
    expect(secondScene?.source).toMatchObject({
      fragmentShader: expect.stringContaining("const float SPEED = 0.15;")
    });
  });

  it("uses a dedicated music shader for the third article", () => {
    const thirdScene = canvasScenes[2];

    expect(thirdScene?.id).toBe("music");
    expect(thirdScene?.runtimeKey).toBe("music");
    expect(thirdScene?.kind).toBe("shader");
    expect(thirdScene?.source).toMatchObject({
      fragmentShader: expect.stringContaining("tanh(")
    });
  });

  it("uses an image scene for the fourth article", () => {
    const fourthScene = canvasScenes[3];

    expect(fourthScene?.id).toBe("image-drift");
    expect(fourthScene?.runtimeKey).toBe("image-drift");
    expect(fourthScene?.kind).toBe("image");
    expect(fourthScene?.source).toMatchObject({
      src: expect.stringContaining("testImage")
    });
  });
});
