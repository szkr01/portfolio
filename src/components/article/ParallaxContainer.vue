<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import layer01 from '../../content/assets/parallax/layer-01.png';
import layer02 from '../../content/assets/parallax/layer-02.png';
import layer03 from '../../content/assets/parallax/layer-03.png';
import layer04 from '../../content/assets/parallax/layer-04.png';
import layer05 from '../../content/assets/parallax/layer-05.png';
import layer051 from '../../content/assets/parallax/layer-05-1.png';
import layer06 from '../../content/assets/parallax/layer-06.png';
import layer061 from '../../content/assets/parallax/layer-06-1.png';

interface Props {
  intensity?: number;
  width?: number;
  height?: number;
  animVertEnabled?: boolean;
  animVertSpeed?: number;
  animVertRange?: number;
  animHorizEnabled?: boolean;
  animHorizSpeed?: number;
  animHorizRange?: number;
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 15,
  width: 768,
  height: 768,
  animVertEnabled: true,
  animVertSpeed: 0.5,
  animVertRange: 15,
  animHorizEnabled: true,
  animHorizSpeed: 1.5,
  animHorizRange: 5
});

const layerSources: string[] = [
  layer01,
  layer02,
  layer03,
  layer04,
  layer05,
  layer06
];

const altLayerSources: string[] = [
  layer01,
  layer02,
  layer03,
  layer04,
  layer051,
  layer061
];

const BLINK_DURATION_MIN_MS = 120;
const BLINK_DURATION_MAX_MS = 300;
const BLINK_INTERVAL_MIN_MS = 2500;
const BLINK_INTERVAL_MAX_MS = 8000;
const TRACK_POINTER_ON_PAGE = true;

function computeParallaxPointerTarget(
  clientX: number,
  clientY: number,
  rect: DOMRect | Omit<DOMRect, 'toJSON'>
) {
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }

  const rawX = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const rawY = ((clientY - rect.top) / rect.height - 0.5) * 2;
  const magnitude = Math.hypot(rawX, rawY);

  if (magnitude <= Math.sqrt(2)) {
    return { x: rawX, y: rawY };
  }

  return {
    x: (rawX / magnitude) * Math.sqrt(2),
    y: (rawY / magnitude) * Math.sqrt(2)
  };
}

const containerRef = ref<HTMLElement | null>(null);
const isLoading = ref(true);
let animationFrameId = 0;
let cleanupInteraction: (() => void) | null = null;

onMounted(() => {
  if (!containerRef.value) return;
  const mountContainer = containerRef.value as HTMLElement;
  
  const imageLayers: HTMLImageElement[] = [];
  const blinkLayers: HTMLImageElement[] = [];
  let layersLoaded = 0;
  let blinkLayersLoaded = 0;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%;";
  mountContainer.appendChild(canvas);
  
  let parallaxMouse = { x: 0, y: 0 }, targetParallaxMouse = { x: 0, y: 0 };
  let lastPagePointer: { clientX: number; clientY: number } | null = null;
  const LERP_FACTOR = 0.08;
  let nextBlinkAtMs = 0;
  let blinkUntilMs = 0;

  function updateTargetFromPointerPosition(clientX: number, clientY: number) {
    const rect = mountContainer.getBoundingClientRect();
    targetParallaxMouse = computeParallaxPointerTarget(clientX, clientY, rect);
  }

  function updateTargetFromPagePointer() {
    if (!lastPagePointer) {
      targetParallaxMouse = { x: 0, y: 0 };
      return;
    }

    updateTargetFromPointerPosition(lastPagePointer.clientX, lastPagePointer.clientY);
  }

  function scheduleNextBlink(now: number) {
    nextBlinkAtMs = now + BLINK_INTERVAL_MIN_MS + Math.random() * (BLINK_INTERVAL_MAX_MS - BLINK_INTERVAL_MIN_MS);
  }

  function getBlinkDurationMs() {
    return BLINK_DURATION_MIN_MS + Math.random() * (BLINK_DURATION_MAX_MS - BLINK_DURATION_MIN_MS);
  }

  function render() {
    animationFrameId = requestAnimationFrame(render);
    if (layersLoaded < layerSources.length || blinkLayersLoaded < altLayerSources.length) return;

    if (TRACK_POINTER_ON_PAGE) {
      updateTargetFromPagePointer();
    }
    
    parallaxMouse.x += (targetParallaxMouse.x - parallaxMouse.x) * LERP_FACTOR;
    parallaxMouse.y += (targetParallaxMouse.y - parallaxMouse.y) * LERP_FACTOR;
    
    const now = performance.now();
    if (!blinkUntilMs && now >= nextBlinkAtMs) {
      blinkUntilMs = now + getBlinkDurationMs();
    } else if (blinkUntilMs && now >= blinkUntilMs) {
      blinkUntilMs = 0;
      scheduleNextBlink(now);
    }

    const activeLayers = blinkUntilMs > now ? blinkLayers : imageLayers;
    const time = now / 1000;
    const animX = props.animHorizEnabled ? Math.sin(time * props.animHorizSpeed) * props.animHorizRange : 0;
    const animY = props.animVertEnabled ? Math.sin(time * props.animVertSpeed) * props.animVertRange : 0;
    
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    const numLayers = activeLayers.length;
    
    activeLayers.forEach((layer, i) => {
      const depthFactor = numLayers > 1 ? (i / (numLayers - 1)) : 0;
      const parallaxOffsetX = (parallaxMouse.x * props.intensity + animX) * depthFactor;
      const parallaxOffsetY = (parallaxMouse.y * props.intensity + animY) * depthFactor;
      ctx!.drawImage(layer, parallaxOffsetX, parallaxOffsetY, canvas.width, canvas.height);
    });
  }

  function onAssetsLoaded() {
    if (imageLayers.length > 0) {
      canvas.width = imageLayers[0].naturalWidth;
      canvas.height = imageLayers[0].naturalHeight;
    }
    isLoading.value = false;

    const localMoveHandler = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      updateTargetFromPointerPosition(clientX, clientY);
    };
    const pageMoveHandler = (e: MouseEvent) => {
      lastPagePointer = {
        clientX: e.clientX,
        clientY: e.clientY
      };
    };
    const resetTarget = () => {
      lastPagePointer = null;
      targetParallaxMouse = { x: 0, y: 0 };
    };

    if (TRACK_POINTER_ON_PAGE) {
      window.addEventListener('mousemove', pageMoveHandler);
      window.addEventListener('mouseleave', resetTarget);
      window.addEventListener('blur', resetTarget);
    } else {
      mountContainer.addEventListener('mousemove', localMoveHandler as EventListener);
      mountContainer.addEventListener('mouseleave', resetTarget);
    }

    mountContainer.addEventListener('touchmove', localMoveHandler as EventListener, { passive: true });
    mountContainer.addEventListener('touchend', resetTarget);
    
    scheduleNextBlink(performance.now());
    cleanupInteraction = () => {
      if (TRACK_POINTER_ON_PAGE) {
        window.removeEventListener('mousemove', pageMoveHandler);
        window.removeEventListener('mouseleave', resetTarget);
        window.removeEventListener('blur', resetTarget);
      } else {
        mountContainer.removeEventListener('mousemove', localMoveHandler as EventListener);
      }

      mountContainer.removeEventListener('touchmove', localMoveHandler as EventListener);
      mountContainer.removeEventListener('touchend', resetTarget);
    };
    render();
  }

  function maybeStart() {
    if (layersLoaded === layerSources.length && blinkLayersLoaded === altLayerSources.length) {
      onAssetsLoaded();
    }
  }
  
  if (layerSources.length > 0) {
    layerSources.forEach(src => {
      const img = new Image();
      img.onload = () => { layersLoaded += 1; maybeStart(); };
      img.onerror = () => { layersLoaded += 1; maybeStart(); };
      img.src = src;
      imageLayers.push(img);
    });
  } else {
    layersLoaded = 0;
  }

  if (altLayerSources.length > 0) {
    altLayerSources.forEach(src => {
      const img = new Image();
      img.onload = () => { blinkLayersLoaded += 1; maybeStart(); };
      img.onerror = () => { blinkLayersLoaded += 1; maybeStart(); };
      img.src = src;
      blinkLayers.push(img);
    });
  } else {
    blinkLayersLoaded = 0;
  }

  if (layerSources.length === 0 && altLayerSources.length === 0) {
    onAssetsLoaded();
  }
});

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  cleanupInteraction?.();
  cleanupInteraction = null;
});
</script>

<template>
  <div 
    ref="containerRef" 
    class="parallax-container"
    :style="{
      position: 'relative',
      width: '100%',
      maxWidth: `${width}px`,
      aspectRatio: `${width} / ${height}`,
      margin: 'auto',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0',
      userSelect: 'none',
      touchAction: 'none'
    }"
  >
    <div v-if="isLoading" class="parallax-loader">
      <div class="parallax-loader__ring"></div>
    </div>
  </div>
</template>

<style scoped>
.parallax-loader {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, rgba(255, 255, 255, 0.78), rgba(240, 240, 240, 0.92));
  pointer-events: none;
}

.parallax-loader__ring {
  width: 2.75rem;
  height: 2.75rem;
  border: 2px solid rgba(17, 17, 17, 0.12);
  border-top-color: rgba(17, 17, 17, 0.72);
  border-radius: 9999px;
  animation: parallax-spin 0.8s linear infinite;
}

@keyframes parallax-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
