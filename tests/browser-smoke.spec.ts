import { describe, expect, it } from "vitest";

describe("browser smoke contract", () => {
  it("documents the required smoke script", async () => {
    const smokeModule = await import("../smoke/canvasTransition.smoke.mjs");

    expect(typeof smokeModule.runCanvasTransitionSmoke).toBe("function");
  });
});
