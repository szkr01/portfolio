import { computed, onBeforeUnmount, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { createCanvasController } from "./controller";
import { createRendererFactory } from "./renderers/factory";
import { canvasScenes } from "./scenes";
import type { ThemeTokens } from "./types";

const defaultTheme: ThemeTokens = {
  bg: "#ffffff",
  surface: "#f6f6f6",
  text: "#111111",
  muted: "#666666",
  accent: "#3366ff",
  accent2: "#ff9933",
  border: "rgba(0,0,0,0.12)"
};

export function useCanvasController(): {
  canvasRef: Ref<HTMLCanvasElement | null>;
  setCanvas: (element: HTMLCanvasElement | null) => void;
  themeStyle: ComputedRef<Record<string, string>>;
  activate: (sceneId: string, source: "init" | "scroll" | "manual") => Promise<void>;
} {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const theme = ref<ThemeTokens>(defaultTheme);
  const controller = createCanvasController({
    rendererFactory: createRendererFactory()
  });

  const cleanupThemeSubscription = controller.subscribeTheme((nextTheme) => {
    theme.value = nextTheme;
  });

  const handleResize = () => {
    controller.resize();
  };

  onMounted(async () => {
    if (!canvasRef.value) {
      return;
    }
    controller.bind(canvasRef.value);
    controller.registerScenes(canvasScenes);
    window.addEventListener("resize", handleResize);
    await controller.activate("hero", "init");
  });

  onBeforeUnmount(() => {
    cleanupThemeSubscription();
    window.removeEventListener("resize", handleResize);
    controller.dispose();
  });

  return {
    canvasRef,
    setCanvas(element) {
      canvasRef.value = element;
    },
    themeStyle: computed(() => ({
      "--bg": theme.value.bg,
      "--surface": theme.value.surface,
      "--text": theme.value.text,
      "--muted": theme.value.muted,
      "--accent": theme.value.accent,
      "--accent2": theme.value.accent2,
      "--border": theme.value.border
    })),
    activate(sceneId, source) {
      return controller.activate(sceneId, source);
    }
  };
}
