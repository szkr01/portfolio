import type { CanvasRenderer, CanvasRenderFrame, CanvasSceneDefinition } from "../types";

const IMAGE_CROP_SCALE = 0.95;
const IMAGE_PAN_DURATION_MS = 20_000;
const IMAGE_MIN_TRAVEL_RATIO = 0.1;

interface CropPoint {
  x: number;
  y: number;
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageMotionState {
  cropSize: number;
  panDurationMs: number;
  minTravelRatio: number;
  maxOffsetX: number;
  maxOffsetY: number;
  from: CropPoint;
  to: CropPoint;
  segmentStartedAtMs: number;
}

interface DestinationRect {
  x: number;
  y: number;
  size: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function easeInOutQuad(progress: number): number {
  if (progress < 0.5) {
    return 2 * progress * progress;
  }
  return 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

export function createMediaRenderer(kind: "image" | "video"): CanvasRenderer {
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let media: HTMLImageElement | HTMLVideoElement | null = null;
  let imageMotion: ImageMotionState | null = null;
  let lastFrame: CanvasRenderFrame = {
    globalTimeMs: 0,
    pageTimeMs: 0,
    width: 0,
    height: 0
  };

  function createRandomCropPoint(maxOffsetX: number, maxOffsetY: number): CropPoint {
    return {
      x: maxOffsetX > 0 ? maxOffsetX * Math.random() : 0,
      y: maxOffsetY > 0 ? maxOffsetY * Math.random() : 0
    };
  }

  function chooseNextCropPoint(
    from: CropPoint,
    maxOffsetX: number,
    maxOffsetY: number,
    minTravelRatio: number
  ): CropPoint {
    const maxTravel = Math.hypot(maxOffsetX, maxOffsetY);
    if (maxTravel === 0) {
      return from;
    }

    const minTravel = maxTravel * minTravelRatio;
    let candidate = createRandomCropPoint(maxOffsetX, maxOffsetY);
    for (let attempt = 0; attempt < 12; attempt += 1) {
      if (Math.hypot(candidate.x - from.x, candidate.y - from.y) >= minTravel) {
        return candidate;
      }
      candidate = createRandomCropPoint(maxOffsetX, maxOffsetY);
    }
    return candidate;
  }

  function initializeImageMotion(scene: CanvasSceneDefinition, image: ImageDimensions): void {
    const motion =
      "motion" in scene.source && scene.source.motion
        ? scene.source.motion
        : undefined;
    const cropScale = motion?.cropScale ?? IMAGE_CROP_SCALE;
    const panDurationMs = motion?.panDurationMs ?? IMAGE_PAN_DURATION_MS;
    const minTravelRatio = motion?.minTravelRatio ?? IMAGE_MIN_TRAVEL_RATIO;
    const cropSize = Math.min(image.width, image.height) * cropScale;
    const maxOffsetX = Math.max(0, image.width - cropSize);
    const maxOffsetY = Math.max(0, image.height - cropSize);
    const from = createRandomCropPoint(maxOffsetX, maxOffsetY);

    imageMotion = {
      cropSize,
      panDurationMs,
      minTravelRatio,
      maxOffsetX,
      maxOffsetY,
      from,
      to: chooseNextCropPoint(from, maxOffsetX, maxOffsetY, minTravelRatio),
      segmentStartedAtMs: 0
    };
  }

  function getImageDestinationRect(targetCanvas: HTMLCanvasElement): DestinationRect {
    if (targetCanvas.width > targetCanvas.height) {
      return {
        x: 0,
        y: (targetCanvas.height - targetCanvas.width) / 2,
        size: targetCanvas.width
      };
    }

    return {
      x: 0,
      y: 0,
      size: targetCanvas.height
    };
  }

  function drawAnimatedImage(frame: CanvasRenderFrame): void {
    if (!media || !canvas || !context || !imageMotion) {
      return;
    }

    while (frame.pageTimeMs - imageMotion.segmentStartedAtMs >= imageMotion.panDurationMs) {
      imageMotion.from = imageMotion.to;
      imageMotion.to = chooseNextCropPoint(
        imageMotion.from,
        imageMotion.maxOffsetX,
        imageMotion.maxOffsetY,
        imageMotion.minTravelRatio
      );
      imageMotion.segmentStartedAtMs += imageMotion.panDurationMs;
    }

    const progress = clamp01(
      (frame.pageTimeMs - imageMotion.segmentStartedAtMs) / imageMotion.panDurationMs
    );
    const easedProgress = easeInOutQuad(progress);
    const cropX = lerp(imageMotion.from.x, imageMotion.to.x, easedProgress);
    const cropY = lerp(imageMotion.from.y, imageMotion.to.y, easedProgress);
    const destinationRect = getImageDestinationRect(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      media,
      cropX,
      cropY,
      imageMotion.cropSize,
      imageMotion.cropSize,
      destinationRect.x,
      destinationRect.y,
      destinationRect.size,
      destinationRect.size
    );
  }

  async function loadImage(scene: CanvasSceneDefinition): Promise<void> {
    const image = new Image();
    image.src = "src" in scene.source ? scene.source.src : "";
    await image.decode();
    media = image;
    initializeImageMotion(scene, image);
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
    render(_frame: CanvasRenderFrame) {
      lastFrame = _frame;
      if (!canvas || !context || !media) {
        return;
      }
      if (kind === "image" && imageMotion) {
        drawAnimatedImage(_frame);
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(media, 0, 0, canvas.width, canvas.height);
    },
    resize() {
      this.render(lastFrame);
    },
    dispose() {
      if (media instanceof HTMLVideoElement) {
        media.pause();
      }
      media = null;
      imageMotion = null;
    },
    captureFrame() {
      return canvas;
    }
  };
}
