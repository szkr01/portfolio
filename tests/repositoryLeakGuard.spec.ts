import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoFiles = [
  "README.md",
  "tasks/todo.md",
  "tasks/lessons.md",
  "smoke/canvasTransition.smoke.mjs"
];

const leakedPathPatterns = [
  /\/home\/[^/\s]+/,
  /\/Users\/[^/\s]+/,
  /\/mnt\/[A-Za-z]\/Users\/[^/\s]+/,
  /[A-Z]:\\Users\\[^\\\s]+/
];

describe("repository leak guard", () => {
  it("keeps tracked docs and smoke scripts free from local path strings", () => {
    for (const relativePath of repoFiles) {
      const contents = readFileSync(resolve(process.cwd(), relativePath), "utf8");

      for (const pattern of leakedPathPatterns) {
        expect(contents, `${relativePath} should not contain ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
