import { describe, expect, it } from "vitest";
import { canvasScenes } from "../src/canvas/scenes";

describe("canvas scenes", () => {
  it("uses the embedded flow shader for the second article", () => {
    const secondScene = canvasScenes[1];

    expect(secondScene?.id).toBe("motion-field");
    expect(secondScene?.runtimeKey).toBe("flow");
    expect(secondScene?.kind).toBe("shader");
    expect(secondScene?.source).toMatchObject({
      fragmentShader: expect.stringContaining("const float SPEED = 0.15;")
    });
  });

  it("uses an image scene for the third article", () => {
    const thirdScene = canvasScenes[2];

    expect(thirdScene?.id).toBe("image-drift");
    expect(thirdScene?.runtimeKey).toBe("image-drift");
    expect(thirdScene?.kind).toBe("image");
    expect(thirdScene?.source).toMatchObject({
      src: expect.stringContaining("testImage")
    });
  });
});
