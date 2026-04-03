import type {
  CanvasActivationSource,
  CanvasDebugState,
  CanvasRenderer,
  CanvasRendererFactory,
  CanvasRenderFrame,
  CanvasSceneDefinition,
  CanvasTransitionDefinition,
  CanvasTransitionRenderer,
  ThemeTokens
} from "./types";
import { createThemeSampler } from "./theme/themeSampler";

interface CanvasControllerOptions {
  rendererFactory: CanvasRendererFactory;
  transitionRenderer: CanvasTransitionRenderer;
  transitions?: CanvasTransitionDefinition[];
  defaultTransitionId?: string;
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
  getDebugState(): CanvasDebugState;
}

export function createCanvasController(options: CanvasControllerOptions): CanvasController {
  const requestFrame = options.requestFrame ?? window.requestAnimationFrame.bind(window);
  const cancelFrame = options.cancelFrame ?? window.cancelAnimationFrame.bind(window);
  const sampleIntervalMs = options.sampleIntervalMs ?? 120;
  const themeSampler = createThemeSampler();
  const themeListeners = new Set<(theme: ThemeTokens) => void>();
  const scenes = new Map<string, CanvasSceneDefinition>();
  const transitions = new Map((options.transitions ?? []).map((entry) => [entry.id, entry]));
  let canvas: HTMLCanvasElement | null = null;
  let currentScene: CanvasSceneDefinition | null = null;
  let activeRuntimeKey: string | null = null;
  let frameHandle = 0;
  let lastSampleTime = 0;
  let visibleContext: CanvasRenderingContext2D | null = null;
  let compositorCanvas: HTMLCanvasElement | null = null;
  let currentGlobalTimeMs = performance.now();
  let pageStartedAtMs = currentGlobalTimeMs;

  interface RuntimeInstance {
    key: string;
    scene: CanvasSceneDefinition;
    renderer: CanvasRenderer;
    canvas: HTMLCanvasElement;
    loaded: boolean;
    frame: CanvasRenderFrame;
  }

  interface TransitionState {
    definition: CanvasTransitionDefinition;
    fromRuntimeKey: string;
    toRuntimeKey: string;
    startedAtMs: number;
  }

  const runtimeInstances = new Map<string, RuntimeInstance>();
  let transitionState: TransitionState | null = null;

  function emitTheme(theme: ThemeTokens): void {
    for (const listener of themeListeners) {
      listener(theme);
    }
  }

  function createRuntimeCanvas(width: number, height: number): HTMLCanvasElement {
    const nextCanvas = document.createElement("canvas");
    nextCanvas.width = width;
    nextCanvas.height = height;
    return nextCanvas;
  }

  function drawToVisible(source: CanvasImageSource): void {
    if (!canvas || !visibleContext) {
      return;
    }
    visibleContext.clearRect(0, 0, canvas.width, canvas.height);
    visibleContext.drawImage(source, 0, 0, canvas.width, canvas.height);
  }

  function getOrCreateRuntime(scene: CanvasSceneDefinition): RuntimeInstance {
    const existing = runtimeInstances.get(scene.runtimeKey);
    if (existing) {
      existing.scene = scene;
      return existing;
    }
    const width = canvas?.width ?? 1;
    const height = canvas?.height ?? 1;
    const runtimeCanvas = createRuntimeCanvas(width, height);
    const renderer = options.rendererFactory(scene.kind);
    renderer.mount(runtimeCanvas);
    renderer.resize(width, height);
    const runtime: RuntimeInstance = {
      key: scene.runtimeKey,
      scene,
      renderer,
      canvas: runtimeCanvas,
      loaded: false,
      frame: {
        globalTimeMs: currentGlobalTimeMs,
        pageTimeMs: Math.max(0, currentGlobalTimeMs - pageStartedAtMs),
        width,
        height
      }
    };
    runtimeInstances.set(scene.runtimeKey, runtime);
    return runtime;
  }

  async function ensureRuntimeLoaded(scene: CanvasSceneDefinition): Promise<RuntimeInstance> {
    const runtime = getOrCreateRuntime(scene);
    runtime.scene = scene;
    if (!runtime.loaded) {
      await runtime.renderer.load(scene);
      runtime.loaded = true;
    }
    return runtime;
  }

  function getTransitionDefinition(scene: CanvasSceneDefinition): CanvasTransitionDefinition | null {
    const transitionId = scene.transitionId ?? options.defaultTransitionId ?? null;
    if (!transitionId) {
      return null;
    }
    return transitions.get(transitionId) ?? null;
  }

  function updateRuntimeFrame(runtime: RuntimeInstance, now: number): void {
    runtime.frame = {
      globalTimeMs: now,
      pageTimeMs: Math.max(0, now - pageStartedAtMs),
      width: runtime.canvas.width,
      height: runtime.canvas.height
    };
  }

  function disposeRuntime(runtimeKey: string): void {
    const runtime = runtimeInstances.get(runtimeKey);
    if (!runtime) {
      return;
    }
    runtime.renderer.dispose();
    runtimeInstances.delete(runtimeKey);
  }

  function renderLoop(now: number): void {
    currentGlobalTimeMs = now;
    if (canvas && activeRuntimeKey) {
      const activeRuntime = runtimeInstances.get(activeRuntimeKey) ?? null;
      if (activeRuntime) {
        updateRuntimeFrame(activeRuntime, now);
        activeRuntime.renderer.render(activeRuntime.frame);
      }
      if (transitionState) {
        const fromRuntime = runtimeInstances.get(transitionState.fromRuntimeKey) ?? null;
        const toRuntime = runtimeInstances.get(transitionState.toRuntimeKey) ?? null;
        if (fromRuntime && toRuntime) {
          updateRuntimeFrame(fromRuntime, now);
          updateRuntimeFrame(toRuntime, now);
          fromRuntime.renderer.render(fromRuntime.frame);
          toRuntime.renderer.render(toRuntime.frame);
          const progress = Math.min(
            1,
            Math.max(0, (now - transitionState.startedAtMs) / transitionState.definition.durationMs)
          );
          options.transitionRenderer.render(transitionState.definition, {
            width: canvas.width,
            height: canvas.height,
            progress,
            from: fromRuntime.renderer.captureFrame() ?? fromRuntime.canvas,
            to: toRuntime.renderer.captureFrame() ?? toRuntime.canvas
          });
          drawToVisible(options.transitionRenderer.getOutput() ?? toRuntime.canvas);
          if (progress >= 1) {
            disposeRuntime(transitionState.fromRuntimeKey);
            transitionState = null;
          }
        }
      } else if (activeRuntime) {
        drawToVisible(activeRuntime.renderer.captureFrame() ?? activeRuntime.canvas);
      }
      if (now - lastSampleTime >= sampleIntervalMs) {
        if (canvas) {
          const nextTheme = themeSampler.sample(canvas);
          if (nextTheme) {
            emitTheme(nextTheme);
          }
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
      pageStartedAtMs = performance.now();
      currentGlobalTimeMs = pageStartedAtMs;
      visibleContext = canvas.getContext("2d", { willReadFrequently: true });
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      compositorCanvas = createRuntimeCanvas(canvas.width, canvas.height);
      options.transitionRenderer.mount(compositorCanvas);
      options.transitionRenderer.resize(canvas.width, canvas.height);
      for (const runtime of runtimeInstances.values()) {
        runtime.canvas.width = canvas.width;
        runtime.canvas.height = canvas.height;
        runtime.renderer.mount(runtime.canvas);
        runtime.renderer.resize(canvas.width, canvas.height);
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
      currentGlobalTimeMs = performance.now();
      const nextScene = scenes.get(sceneId);
      if (!nextScene || !canvas) {
        return;
      }
      const previousScene = currentScene;
      if (previousScene?.id === nextScene.id) {
        return;
      }
      if (activeRuntimeKey === nextScene.runtimeKey) {
        currentScene = nextScene;
        const runtime = runtimeInstances.get(nextScene.runtimeKey);
        if (runtime) {
          runtime.scene = nextScene;
          updateRuntimeFrame(runtime, currentGlobalTimeMs);
          runtime.renderer.render(runtime.frame);
        }
        return;
      }
      const nextRuntime = await ensureRuntimeLoaded(nextScene);
      nextRuntime.renderer.resize(canvas.width, canvas.height);
      nextRuntime.renderer.render({
        globalTimeMs: currentGlobalTimeMs,
        pageTimeMs: Math.max(0, currentGlobalTimeMs - pageStartedAtMs),
        width: canvas.width,
        height: canvas.height
      });
      if (!activeRuntimeKey || !previousScene) {
        activeRuntimeKey = nextScene.runtimeKey;
        currentScene = nextScene;
        drawToVisible(nextRuntime.renderer.captureFrame() ?? nextRuntime.canvas);
        return;
      }
      const transition = getTransitionDefinition(nextScene);
      currentScene = nextScene;
      if (!transition) {
        disposeRuntime(activeRuntimeKey);
        activeRuntimeKey = nextScene.runtimeKey;
        drawToVisible(nextRuntime.renderer.captureFrame() ?? nextRuntime.canvas);
        return;
      }
      transitionState = {
        definition: transition,
        fromRuntimeKey: activeRuntimeKey,
        toRuntimeKey: nextScene.runtimeKey,
        startedAtMs: currentGlobalTimeMs
      };
      activeRuntimeKey = nextScene.runtimeKey;
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
      compositorCanvas ??= createRuntimeCanvas(canvas.width, canvas.height);
      compositorCanvas.width = canvas.width;
      compositorCanvas.height = canvas.height;
      options.transitionRenderer.mount(compositorCanvas);
      options.transitionRenderer.resize(canvas.width, canvas.height);
      for (const runtime of runtimeInstances.values()) {
        runtime.canvas.width = canvas.width;
        runtime.canvas.height = canvas.height;
        runtime.renderer.resize(canvas.width, canvas.height);
      }
    },
    dispose() {
      stopLoop();
      for (const runtimeKey of [...runtimeInstances.keys()]) {
        disposeRuntime(runtimeKey);
      }
      options.transitionRenderer.dispose();
      currentScene = null;
      activeRuntimeKey = null;
      transitionState = null;
      themeListeners.clear();
    },
    getDebugState() {
      const activeRuntime = activeRuntimeKey ? runtimeInstances.get(activeRuntimeKey) ?? null : null;
      return {
        activeSceneId: currentScene?.id ?? null,
        activeRuntimeKey,
        pageTimeMs: activeRuntime?.frame.pageTimeMs ?? Math.max(0, currentGlobalTimeMs - pageStartedAtMs),
        transition: transitionState
          ? {
              running: true,
              fromRuntimeKey: transitionState.fromRuntimeKey,
              toRuntimeKey: transitionState.toRuntimeKey,
              progress: Math.min(
                1,
                Math.max(
                  0,
                  (currentGlobalTimeMs - transitionState.startedAtMs) /
                    transitionState.definition.durationMs
                )
              )
            }
          : null
      };
    }
  };
}
