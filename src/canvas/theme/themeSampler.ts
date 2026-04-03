import type { CanvasThemeMode, ThemeTokens } from "../types";
import {
  fitChromaToGamut,
  getContrast,
  lerp,
  lerpHue,
  oklabToHex,
  oklabToOklch,
  oklchToOklab,
  rgbToOklab,
  type Oklab
} from "./colorUtils";

interface ThemeState {
  bg: Oklab;
  surface: Oklab;
  text: Oklab;
  muted: Oklab;
  accent: Oklab;
  accent2: Oklab;
  border: Oklab;
}

const defaultThemeOklab: ThemeState = {
  bg: rgbToOklab(255, 255, 255),
  surface: rgbToOklab(246, 246, 246),
  text: rgbToOklab(17, 17, 17),
  muted: rgbToOklab(102, 102, 102),
  accent: rgbToOklab(51, 102, 255),
  accent2: rgbToOklab(255, 153, 51),
  border: rgbToOklab(229, 229, 229)
};

function cloneThemeState(theme: ThemeState): ThemeState {
  return structuredClone(theme);
}

function toThemeTokens(theme: ThemeState): ThemeTokens {
  return {
    bg: oklabToHex(theme.bg.L, theme.bg.a, theme.bg.b),
    surface: oklabToHex(theme.surface.L, theme.surface.a, theme.surface.b),
    text: oklabToHex(theme.text.L, theme.text.a, theme.text.b),
    muted: oklabToHex(theme.muted.L, theme.muted.a, theme.muted.b),
    accent: oklabToHex(theme.accent.L, theme.accent.a, theme.accent.b),
    accent2: oklabToHex(theme.accent2.L, theme.accent2.a, theme.accent2.b),
    border: oklabToHex(theme.border.L, theme.border.a, theme.border.b)
  };
}

export function createThemeSampler(size = 96): {
  sample(source: CanvasImageSource): ThemeTokens | null;
  setThemeMode(mode: CanvasThemeMode | null): void;
  step(): ThemeTokens;
  current(): ThemeTokens;
} {
  const analysisCanvas = document.createElement("canvas");
  analysisCanvas.width = size;
  analysisCanvas.height = size;
  const context = analysisCanvas.getContext("2d", { willReadFrequently: true });
  let currentTheme = cloneThemeState(defaultThemeOklab);
  let targetTheme = cloneThemeState(defaultThemeOklab);
  let themeMode: CanvasThemeMode | null = null;

  if (!context) {
    return {
      sample: () => null,
      setThemeMode: () => undefined,
      step: () => toThemeTokens(currentTheme),
      current: () => toThemeTokens(currentTheme)
    };
  }

  return {
    setThemeMode(mode) {
      themeMode = mode;
    },
    sample(source) {
      context.clearRect(0, 0, size, size);
      context.drawImage(source, 0, 0, size, size);
      const imageData = context.getImageData(0, 0, size, size).data;
      const bins = [];

      for (let index = 0; index < imageData.length; index += 12) {
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];
        const a = imageData[index + 3];
        if (a < 200) {
          continue;
        }
        const oklab = rgbToOklab(r, g, b);
        bins.push(oklabToOklch(oklab.L, oklab.a, oklab.b));
      }

      if (bins.length === 0) {
        return null;
      }

      const hueCounts = new Array<number>(24).fill(0);
      let totalLightness = 0;
      for (const color of bins) {
        const hueIndex = Math.floor(color.h / 15) % 24;
        const weight = color.C > 0.05 ? color.C : 0.01;
        hueCounts[hueIndex] += weight;
        totalLightness += color.L;
      }

      let dominantIndex = 0;
      for (let index = 1; index < hueCounts.length; index += 1) {
        if (hueCounts[index] > hueCounts[dominantIndex]) {
          dominantIndex = index;
        }
      }

      let dominantHue = dominantIndex * 15 + 7.5;
      const averageLightness = totalLightness / bins.length;
      const isDark = themeMode === null ? averageLightness < 0.45 : themeMode === "dark";
      const bgL = isDark ? 0.16 : 0.97;
      const bgC = isDark ? 0.02 : 0.01;
      const bgH = dominantHue;
      const surfaceL = isDark ? 0.22 : 0.94;
      const borderL = isDark ? 0.28 : 0.9;
      const textL = isDark ? 0.92 : 0.15;
      const textC = 0.01;
      const mutedL = isDark ? 0.65 : 0.45;
      let accentL = isDark ? 0.75 : 0.58;
      let accentC = isDark ? 0.15 : 0.26;
      const colorfulSamples = bins.filter((entry) => entry.C > 0.08);

      if (colorfulSamples.length > 0) {
        const accent = colorfulSamples.reduce((max, current) =>
          current.C > max.C ? current : max
        );
        dominantHue = accent.h;
        accentC = accent.C + (isDark ? 0.03 : 0.1);
        accentL = accent.L;
      }

      if (!isDark) {
        accentC = Math.max(0.24, Math.min(0.42, accentC));
        accentL = Math.max(0.5, Math.min(0.68, accentL));
      } else {
        accentC = Math.max(0.12, Math.min(0.24, accentC));
      }

      const backgroundLab = oklchToOklab(bgL, bgC, bgH);
      const accentLch = {
        L: accentL,
        C: fitChromaToGamut(accentL, accentC, dominantHue),
        h: dominantHue
      };
      let accentLab = oklchToOklab(accentLch.L, accentLch.C, accentLch.h);
      let contrast = getContrast(accentLab, backgroundLab);

      if (contrast < 4.0) {
        if (isDark) {
          accentLch.L = Math.min(0.9, accentLch.L + 0.2);
        } else {
          accentLch.C = fitChromaToGamut(
            accentLch.L,
            Math.min(0.42, accentLch.C + 0.04),
            accentLch.h
          );
          let attempts = 0;
          while (attempts < 2) {
            accentLab = oklchToOklab(accentLch.L, accentLch.C, accentLch.h);
            contrast = getContrast(accentLab, backgroundLab);
            if (contrast >= 4.0) {
              break;
            }
            accentLch.L = Math.max(0.4, accentLch.L - 0.03);
            accentLch.C = fitChromaToGamut(accentLch.L, accentLch.C, accentLch.h);
            attempts += 1;
          }
        }
      }

      const accent2Hue = (dominantHue + 180) % 360;
      targetTheme = {
        bg: oklchToOklab(bgL, bgC, bgH),
        surface: oklchToOklab(surfaceL, bgC * 1.5, bgH),
        text: oklchToOklab(textL, textC, dominantHue),
        muted: oklchToOklab(mutedL, textC, dominantHue),
        accent: oklchToOklab(accentLch.L, accentLch.C, accentLch.h),
        accent2: oklchToOklab(accentLch.L, accentLch.C, accent2Hue),
        border: oklchToOklab(borderL, bgC * 2, bgH)
      };

      return this.step();
    },
    step() {
      const alpha = 0.08;
      for (const key of Object.keys(currentTheme) as Array<keyof ThemeState>) {
        const current = currentTheme[key];
        const target = targetTheme[key];
        const currentLch = oklabToOklch(current.L, current.a, current.b);
        const targetLch = oklabToOklch(target.L, target.a, target.b);
        currentLch.L = lerp(currentLch.L, targetLch.L, alpha);
        currentLch.C = lerp(currentLch.C, targetLch.C, alpha);
        currentLch.h = lerpHue(currentLch.h, targetLch.h, alpha);
        currentTheme[key] = oklchToOklab(currentLch.L, currentLch.C, currentLch.h);
      }
      return toThemeTokens(currentTheme);
    },
    current() {
      return toThemeTokens(currentTheme);
    }
  };
}
