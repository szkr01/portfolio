import { afterEach, describe, expect, it, vi } from "vitest";
import { createThemeSampler } from "../src/canvas/theme/themeSampler";

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16)
  ];
}

function brightness(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (r + g + b) / 3;
}

function createImageData(size: number, rgb: [number, number, number]): Uint8ClampedArray {
  const data = new Uint8ClampedArray(size * size * 4);

  for (let index = 0; index < data.length; index += 4) {
    data[index] = rgb[0];
    data[index + 1] = rgb[1];
    data[index + 2] = rgb[2];
    data[index + 3] = 255;
  }

  return data;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createThemeSampler", () => {
  it("forces the existing dark/light branch regardless of sampled brightness", () => {
    const imageData = createImageData(96, [255, 255, 255]);
    const fakeContext = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({ data: imageData }))
    };
    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, "createElement").mockImplementation(((tagName: string) => {
      if (tagName === "canvas") {
        return {
          width: 0,
          height: 0,
          getContext: () => fakeContext
        } as unknown as HTMLCanvasElement;
      }

      return originalCreateElement(tagName);
    }) as typeof document.createElement);

    const darkSampler = createThemeSampler();
    const lightSampler = createThemeSampler();

    darkSampler.setThemeMode("dark");
    lightSampler.setThemeMode("light");

    for (let index = 0; index < 80; index += 1) {
      darkSampler.sample({} as CanvasImageSource);
      lightSampler.sample({} as CanvasImageSource);
    }

    expect(brightness(darkSampler.current().bg)).toBeLessThan(brightness(lightSampler.current().bg));
    expect(brightness(darkSampler.current().text)).toBeGreaterThan(
      brightness(lightSampler.current().text)
    );
  });

  it("interpolates the theme by transition progress instead of frame count", () => {
    const fakeContext = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({ data: createImageData(96, [200, 230, 255]) }))
    };
    const createElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(((tag: string) =>
      tag === "canvas"
        ? ({ width: 0, height: 0, getContext: () => fakeContext } as unknown as HTMLCanvasElement)
        : createElement(tag)
    ) as typeof document.createElement);

    const sampler = createThemeSampler();
    sampler.setThemeMode("light");
    for (let i = 0; i < 80; i += 1) sampler.sample({} as CanvasImageSource);
    const start = sampler.current();
    sampler.beginTransition({} as CanvasImageSource, "dark");
    expect(sampler.transition(0).bg).toBe(start.bg);
    const mid = sampler.transition(0.5);
    expect(sampler.transition(0.5)).toEqual(mid);
    const end = sampler.transition(1);

    expect(brightness(mid.bg)).toBeLessThan(brightness(start.bg));
    expect(brightness(mid.bg)).toBeGreaterThan(brightness(end.bg));
    expect(brightness(mid.text)).toBeGreaterThan(brightness(start.text));
    expect(brightness(mid.text)).toBeLessThan(brightness(end.text));
  });
});
