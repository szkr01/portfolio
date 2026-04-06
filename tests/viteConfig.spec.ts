import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("vite config", () => {
  it("uses polling file watching for WSL-mounted workspace hot reload", () => {
    const configSource = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");

    expect(configSource).toContain("usePolling: true");
    expect(configSource).toContain("interval: 100");
  });
});
