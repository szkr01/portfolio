import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
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

function findWorkspaceChromiumExecutable() {
  const browsersRoot = resolve(process.cwd(), ".playwright-browsers");
  if (!existsSync(browsersRoot)) {
    return undefined;
  }

  const browserDir = readdirSync(browsersRoot, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith("chromium-"));

  if (!browserDir) {
    return undefined;
  }

  const executablePath = join(browsersRoot, browserDir.name, "chrome-linux64", "chrome");
  return existsSync(executablePath) ? executablePath : undefined;
}

export async function runCanvasTransitionSmoke() {
  const port = 4173;
  const host = "127.0.0.1";
  const executablePath =
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
    findWorkspaceChromiumExecutable() ??
    chromium.executablePath();
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
    const browser = await chromium.launch({
      headless: true,
      ...(executablePath ? { executablePath } : {})
    });
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

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(150);

    const mobileLayout = await page.evaluate(() => {
      const canvasPane = document.querySelector("#left-pane");
      const articlePane = document.querySelector("#right-pane");
      if (!(canvasPane instanceof HTMLElement) || !(articlePane instanceof HTMLElement)) {
        return null;
      }

      const canvasRect = canvasPane.getBoundingClientRect();
      const articleRect = articlePane.getBoundingClientRect();
      const rootStyle = window.getComputedStyle(document.querySelector(".app-shell"));
      const canvasStyle = window.getComputedStyle(canvasPane);
      const articleStyle = window.getComputedStyle(articlePane);

      return {
        rootDirection: rootStyle.flexDirection,
        canvasTop: canvasRect.top,
        canvasBottom: canvasRect.bottom,
        canvasHeight: canvasRect.height,
        articleTop: articleRect.top,
        articleHeight: articleRect.height,
        viewportHeight: window.innerHeight,
        canvasBorderBottomWidth: canvasStyle.borderBottomWidth,
        articleOverflowY: articleStyle.overflowY
      };
    });

    if (!mobileLayout) {
      throw new Error("Expected mobile layout metrics to be available");
    }

    if (mobileLayout.rootDirection !== "column") {
      throw new Error(`Expected mobile layout to stack vertically, received ${JSON.stringify(mobileLayout)}`);
    }

    if (Math.abs(mobileLayout.canvasHeight - mobileLayout.viewportHeight * 0.18) > 3) {
      throw new Error(`Expected mobile canvas height to be about 18svh, received ${JSON.stringify(mobileLayout)}`);
    }

    if (mobileLayout.articleTop < mobileLayout.canvasBottom - 1) {
      throw new Error(`Expected article pane to render below the canvas, received ${JSON.stringify(mobileLayout)}`);
    }

    if (mobileLayout.articleHeight <= mobileLayout.canvasHeight) {
      throw new Error(`Expected article pane to remain dominant on mobile, received ${JSON.stringify(mobileLayout)}`);
    }

    if (mobileLayout.canvasBorderBottomWidth === "0px") {
      throw new Error(`Expected mobile canvas pane to switch to a bottom border, received ${JSON.stringify(mobileLayout)}`);
    }

    if (mobileLayout.articleOverflowY !== "auto") {
      throw new Error(`Expected article pane to stay scrollable, received ${JSON.stringify(mobileLayout)}`);
    }

    await browser.close();
    stopServer();

    return { ok: true, initial, transitioning, completed, musicArticle, roundTrip, mobileLayout };
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
