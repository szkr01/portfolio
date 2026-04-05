<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';

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
  'src/content/assets/parallax/layer-01.png',
  'src/content/assets/parallax/layer-02.png',
  'src/content/assets/parallax/layer-03.png',
  'src/content/assets/parallax/layer-04.png',
  'src/content/assets/parallax/layer-05.png',
  'src/content/assets/parallax/layer-06.png'
];

const altlayerSources: string[] = [
  'src/content/assets/parallax/layer-01.png',
  'src/content/assets/parallax/layer-02.png',
  'src/content/assets/parallax/layer-03.png',
  'src/content/assets/parallax/layer-04.png',
  'src/content/assets/parallax/layer-05-1.png',
  'src/content/assets/parallax/layer-06-1.png'
];

const BLINK_DURATION_MIN_MS = 120;
const BLINK_DURATION_MAX_MS = 300;
const BLINK_INTERVAL_MIN_MS = 2500;
const BLINK_INTERVAL_MAX_MS = 8000;

const containerRef = ref<HTMLElement | null>(null);
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
  const LERP_FACTOR = 0.08;
  let nextBlinkAtMs = 0;
  let blinkUntilMs = 0;

  function scheduleNextBlink(now: number) {
    nextBlinkAtMs = now + BLINK_INTERVAL_MIN_MS + Math.random() * (BLINK_INTERVAL_MAX_MS - BLINK_INTERVAL_MIN_MS);
  }

  function getBlinkDurationMs() {
    return BLINK_DURATION_MIN_MS + Math.random() * (BLINK_DURATION_MAX_MS - BLINK_DURATION_MIN_MS);
  }

  function render() {
    animationFrameId = requestAnimationFrame(render);
    if (layersLoaded < layerSources.length || blinkLayersLoaded < altlayerSources.length) return;
    
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
    
    const moveHandler = (e: MouseEvent | TouchEvent) => {
      const rect = mountContainer.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      targetParallaxMouse.x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      targetParallaxMouse.y = ((clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const resetTarget = () => { targetParallaxMouse = { x: 0, y: 0 }; };
    
    mountContainer.addEventListener('mousemove', moveHandler as EventListener);
    mountContainer.addEventListener('touchmove', moveHandler as EventListener, { passive: true });
    mountContainer.addEventListener('mouseleave', resetTarget);
    mountContainer.addEventListener('touchend', resetTarget);
    
    scheduleNextBlink(performance.now());
    cleanupInteraction = () => {
      mountContainer.removeEventListener('mousemove', moveHandler as EventListener);
      mountContainer.removeEventListener('touchmove', moveHandler as EventListener);
      mountContainer.removeEventListener('mouseleave', resetTarget);
      mountContainer.removeEventListener('touchend', resetTarget);
    };
    render();
  }

  function maybeStart() {
    if (layersLoaded === layerSources.length && blinkLayersLoaded === altlayerSources.length) {
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

  if (altlayerSources.length > 0) {
    altlayerSources.forEach(src => {
      const img = new Image();
      img.onload = () => { blinkLayersLoaded += 1; maybeStart(); };
      img.onerror = () => { blinkLayersLoaded += 1; maybeStart(); };
      img.src = src;
      blinkLayers.push(img);
    });
  } else {
    blinkLayersLoaded = 0;
  }

  if (layerSources.length === 0 && altlayerSources.length === 0) {
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
  ></div>
</template>
