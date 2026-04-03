import type {
  CanvasActivationSource,
  CanvasRenderer,
  CanvasRendererFactory,
  CanvasSceneDefinition,
  ThemeTokens
} from "./types";
import { createThemeSampler } from "./theme/themeSampler";

interface CanvasControllerOptions {
  rendererFactory: CanvasRendererFactory;
  requestFrame?: (callback: FrameRequestCallback) => number;
  cancelFrame?: (id: number) => void;
  sampleIntervalMs?: number;
}

interface CanvasController {
  bind(canvas: HTMLCanvasElement): void;
  registerScenes(scenes: CanvasSceneDefinition[]): void;
  activate(sceneId: string, source: CanvasActivationSource): Promise<void>;
  subscribeTheme(listener: (theme: ThemeTokens) => void): () => void;
  resize(): void;
  dispose(): void;
}

export function createCanvasController(options: CanvasControllerOptions): CanvasController {
  const requestFrame = options.requestFrame ?? window.requestAnimationFrame.bind(window);
  const cancelFrame = options.cancelFrame ?? window.cancelAnimationFrame.bind(window);
  const sampleIntervalMs = options.sampleIntervalMs ?? 120;
  const themeSampler = createThemeSampler();
  const themeListeners = new Set<(theme: ThemeTokens) => void>();
  const scenes = new Map<string, CanvasSceneDefinition>();
  let canvas: HTMLCanvasElement | null = null;
  let renderer: CanvasRenderer | null = null;
  let currentScene: CanvasSceneDefinition | null = null;
  let frameHandle = 0;
  let lastSampleTime = 0;

  function emitTheme(theme: ThemeTokens): void {
    for (const listener of themeListeners) {
      listener(theme);
    }
  }

  function renderLoop(now: number): void {
    if (canvas && renderer) {
      renderer.render(now);
      if (now - lastSampleTime >= sampleIntervalMs) {
        const frame = renderer.captureFrame();
        if (frame) {
          const nextTheme = themeSampler.sample(frame);
          if (nextTheme) {
            emitTheme(nextTheme);
          }
        } else {
          emitTheme(themeSampler.step());
        }
        lastSampleTime = now;
      } else {
        emitTheme(themeSampler.step());
      }
    }
    frameHandle = requestFrame(renderLoop);
  }

  function startLoop(): void {
    if (frameHandle === 0) {
      frameHandle = requestFrame(renderLoop);
    }
  }

  function stopLoop(): void {
    if (frameHandle !== 0) {
      cancelFrame(frameHandle);
      frameHandle = 0;
    }
  }

  return {
    bind(nextCanvas) {
      canvas = nextCanvas;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      if (renderer) {
        renderer.mount(canvas);
        renderer.resize(canvas.width, canvas.height);
      }
      emitTheme(themeSampler.current());
      startLoop();
    },
    registerScenes(nextScenes) {
      scenes.clear();
      for (const scene of nextScenes) {
        scenes.set(scene.id, scene);
      }
    },
    async activate(sceneId, _source) {
      const nextScene = scenes.get(sceneId);
      if (!nextScene || !canvas) {
        return;
      }
      if (currentScene?.id === nextScene.id) {
        return;
      }
      if (!renderer || renderer.kind !== nextScene.kind) {
        renderer?.dispose();
        renderer = options.rendererFactory(nextScene.kind);
        renderer.mount(canvas);
      }
      currentScene = nextScene;
      await renderer.load(nextScene);
      renderer.resize(canvas.width, canvas.height);
      renderer.render(performance.now());
    },
    subscribeTheme(listener) {
      themeListeners.add(listener);
      listener(themeSampler.current());
      return () => {
        themeListeners.delete(listener);
      };
    },
    resize() {
      if (!canvas) {
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      renderer?.resize(canvas.width, canvas.height);
    },
    dispose() {
      stopLoop();
      renderer?.dispose();
      renderer = null;
      currentScene = null;
      themeListeners.clear();
    }
  };
}
