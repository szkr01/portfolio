export type CanvasSceneKind = "shader" | "image" | "video";
export type CanvasActivationSource = "init" | "scroll" | "manual";

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
  kind: CanvasSceneKind;
  source: CanvasSceneSource;
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
  render(now: number): void;
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
