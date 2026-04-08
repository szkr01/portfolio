import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";

async function waitForServer(url, timeoutMs = 20_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      await delay(250);
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

export async function runCanvasTransitionSmoke() {
  const port = 4173;
  const host = "127.0.0.1";
  const browserExecutableCandidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    "/home/korag/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome",
    "/home/korag/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell"
  ].filter(Boolean);
  const viteProcess = spawn(
    process.execPath,
    ["./node_modules/vite/bin/vite.js", "--host", host, "--port", String(port)],
    {
      cwd: process.cwd(),
      stdio: "pipe"
    }
  );

  const stopServer = () => {
    if (!viteProcess.killed) {
      viteProcess.kill("SIGTERM");
    }
  };

  try {
    await waitForServer(`http://${host}:${port}`);
    const executablePath = browserExecutableCandidates.find((candidate) => existsSync(candidate));
    const browser = await chromium.launch({ headless: true, executablePath });
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

    await page.goto(`http://${host}:${port}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => typeof window.__PORTFOLIO_CANVAS_DEBUG__ === "function");
    await page.waitForSelector("[data-article-link]");

    const getState = () =>
      page.evaluate(() => window.__PORTFOLIO_CANVAS_DEBUG__ ? window.__PORTFOLIO_CANVAS_DEBUG__() : null);

    const waitForTransitionOrRuntime = async (runtimeKey) => {
      await page.waitForFunction(
        (expectedRuntimeKey) => {
          const state = window.__PORTFOLIO_CANVAS_DEBUG__?.();
          return Boolean(
            state && (state.transition?.running || (state.activeRuntimeKey === expectedRuntimeKey && state.transition === null))
          );
        },
        runtimeKey
      );
    };

    const initial = await getState();
    if (!initial || initial.activeRuntimeKey !== "cloud") {
      throw new Error(`Expected initial runtime to be cloud, received ${JSON.stringify(initial)}`);
    }

    await page.getByRole("link", { name: "Works" }).click();
    await page.waitForURL((url) => url.hash.includes("/articles/works"));
    await waitForTransitionOrRuntime("flow");
    await page.waitForTimeout(120);
    const transitioning = await getState();
    if (!transitioning || (!transitioning.transition?.running && transitioning.activeRuntimeKey !== "flow")) {
      throw new Error(`Expected live transition to be running, received ${JSON.stringify(transitioning)}`);
    }

    await page.waitForFunction(() => {
      const state = window.__PORTFOLIO_CANVAS_DEBUG__?.();
      return state?.activeRuntimeKey === "flow" && state?.transition === null;
    });
    const completed = await getState();
    if (!completed || completed.activeRuntimeKey !== "flow") {
      throw new Error(`Expected final runtime to be flow, received ${JSON.stringify(completed)}`);
    }

    await page.getByRole("link", { name: "Music" }).click();
    await page.waitForURL((url) => url.hash.includes("/articles/music"));
    await waitForTransitionOrRuntime("music");
    await page.waitForFunction(() => {
      const state = window.__PORTFOLIO_CANVAS_DEBUG__?.();
      return state?.activeRuntimeKey === "music" && state?.transition === null;
    });
    const musicArticle = await getState();
    if (!musicArticle || musicArticle.activeRuntimeKey !== "music") {
      throw new Error(`Expected music article runtime to be music, received ${JSON.stringify(musicArticle)}`);
    }

    await page.getByRole("link", { name: "About" }).click();
    await page.waitForURL((url) => url.hash.includes("/articles/About"));
    await page.waitForFunction(() => {
      const state = window.__PORTFOLIO_CANVAS_DEBUG__?.();
      return state?.activeRuntimeKey === "cloud" && state?.transition === null;
    });
    const roundTrip = await getState();
    if (!roundTrip || roundTrip.activeRuntimeKey !== "cloud") {
      throw new Error(`Expected round-trip runtime to be cloud, received ${JSON.stringify(roundTrip)}`);
    }

    await browser.close();
    stopServer();

    return { ok: true, initial, transitioning, completed, musicArticle, roundTrip };
  } catch (error) {
    stopServer();
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCanvasTransitionSmoke()
    .then(() => {
      process.stdout.write("canvas transition smoke passed\n");
    })
    .catch((error) => {
      process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
      process.exitCode = 1;
    });
}
