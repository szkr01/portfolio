import type { CanvasRenderer, CanvasSceneDefinition } from "../types";

export function createMediaRenderer(kind: "image" | "video"): CanvasRenderer {
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let media: HTMLImageElement | HTMLVideoElement | null = null;

  async function loadImage(scene: CanvasSceneDefinition): Promise<void> {
    const image = new Image();
    image.src = "src" in scene.source ? scene.source.src : "";
    await image.decode();
    media = image;
  }

  async function loadVideo(scene: CanvasSceneDefinition): Promise<void> {
    const video = document.createElement("video");
    video.src = "src" in scene.source ? scene.source.src : "";
    video.muted = "muted" in scene.source ? Boolean(scene.source.muted) : true;
    video.loop = "loop" in scene.source ? Boolean(scene.source.loop) : true;
    await video.play().catch(() => undefined);
    media = video;
  }

  return {
    kind,
    mount(nextCanvas) {
      canvas = nextCanvas;
      context = canvas.getContext("2d");
    },
    async load(scene) {
      if (kind === "image") {
        await loadImage(scene);
        return;
      }
      await loadVideo(scene);
    },
    render() {
      if (!canvas || !context || !media) {
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(media, 0, 0, canvas.width, canvas.height);
    },
    resize() {
      this.render(0);
    },
    dispose() {
      if (media instanceof HTMLVideoElement) {
        media.pause();
      }
      media = null;
    },
    captureFrame() {
      return media;
    }
  };
}
