export type CanvasSceneKind = "shader" | "image" | "video";
export type CanvasActivationSource = "init" | "scroll" | "manual";
export type CanvasThemeMode = "light" | "dark";

export interface ShaderSceneSource {
  fragmentShader: string;
}

export interface ImageSceneSource {
  src: string;
}

export interface VideoSceneSource {
  src: string;
  muted?: boolean;
  loop?: boolean;
}

export type CanvasSceneSource = ShaderSceneSource | ImageSceneSource | VideoSceneSource;

export interface CanvasSceneDefinition {
  id: string;
  runtimeKey: string;
  kind: CanvasSceneKind;
  themeMode?: CanvasThemeMode;
  transitionId?: string;
  source: CanvasSceneSource;
}

export interface CanvasRenderFrame {
  globalTimeMs: number;
  pageTimeMs: number;
  width: number;
  height: number;
}

export interface CanvasTransitionDefinition {
  id: string;
  fragmentShader: string;
  durationMs: number;
}

export interface ThemeTokens {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  border: string;
}

export interface CanvasRenderer {
  kind: CanvasSceneKind;
  mount(canvas: HTMLCanvasElement): void;
  load(scene: CanvasSceneDefinition): Promise<void>;
  render(frame: CanvasRenderFrame): void;
  resize(width: number, height: number): void;
  dispose(): void;
  captureFrame():
    | HTMLCanvasElement
    | HTMLImageElement
    | HTMLVideoElement
    | OffscreenCanvas
    | null;
}

export type CanvasRendererFactory = (kind: CanvasSceneKind) => CanvasRenderer;

export interface CanvasTransitionRenderFrame {
  width: number;
  height: number;
  progress: number;
  from: CanvasImageSource;
  to: CanvasImageSource;
}

export interface CanvasTransitionRenderer {
  mount(canvas: HTMLCanvasElement): void;
  render(transition: CanvasTransitionDefinition, frame: CanvasTransitionRenderFrame): void;
  resize(width: number, height: number): void;
  dispose(): void;
  getOutput(): HTMLCanvasElement | null;
}

export interface CanvasDebugState {
  activeSceneId: string | null;
  activeRuntimeKey: string | null;
  pageTimeMs: number;
  transition: {
    running: boolean;
    fromRuntimeKey: string;
    toRuntimeKey: string;
    progress: number;
  } | null;
}
