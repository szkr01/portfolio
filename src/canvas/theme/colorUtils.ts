function srgbToLinear(c: number): number {
  const v = c / 255.0;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

export interface Oklab {
  L: number;
  a: number;
  b: number;
}

export interface Oklch {
  L: number;
  C: number;
  h: number;
}

export function rgbToOklab(r: number, g: number, b: number): Oklab {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  return {
    L: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot
  };
}

export function oklabToRgb(L: number, a: number, b: number): { r: number; g: number; b: number } {
  const lRoot = L + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = L - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = L - 0.0894841775 * a - 1.291485548 * b;
  const l = lRoot * lRoot * lRoot;
  const m = mRoot * mRoot * mRoot;
  const s = sRoot * sRoot * sRoot;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return {
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb)
  };
}

export function oklabToOklch(L: number, a: number, b: number): Oklch {
  const C = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) {
    h += 360;
  }
  return { L, C, h };
}

export function oklchToOklab(L: number, C: number, h: number): Oklab {
  const rad = (h * Math.PI) / 180;
  return {
    L,
    a: C * Math.cos(rad),
    b: C * Math.sin(rad)
  };
}

export function oklabToHex(L: number, a: number, b: number): string {
  const rgb = oklabToRgb(L, a, b);
  return `#${(1 << 24 | rgb.r << 16 | rgb.g << 8 | rgb.b).toString(16).slice(1)}`;
}

function getLuminance(L: number, a: number, b: number): number {
  const rgb = oklabToRgb(L, a, b);
  const lr = srgbToLinear(rgb.r);
  const lg = srgbToLinear(rgb.g);
  const lb = srgbToLinear(rgb.b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function getContrast(oklab1: Oklab, oklab2: Oklab): number {
  const lum1 = getLuminance(oklab1.L, oklab1.a, oklab1.b);
  const lum2 = getLuminance(oklab2.L, oklab2.a, oklab2.b);
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function isInSrgbGamut(L: number, a: number, b: number): boolean {
  const lRoot = L + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = L - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = L - 0.0894841775 * a - 1.291485548 * b;
  const l = lRoot * lRoot * lRoot;
  const m = mRoot * mRoot * mRoot;
  const s = sRoot * sRoot * sRoot;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return lr >= 0 && lr <= 1 && lg >= 0 && lg <= 1 && lb >= 0 && lb <= 1;
}

export function fitChromaToGamut(L: number, C: number, h: number): number {
  let lab = oklchToOklab(L, C, h);
  if (isInSrgbGamut(L, lab.a, lab.b)) {
    return C;
  }
  let low = 0;
  let high = C;
  for (let i = 0; i < 14; i += 1) {
    const mid = (low + high) * 0.5;
    lab = oklchToOklab(L, mid, h);
    if (isInSrgbGamut(L, lab.a, lab.b)) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

export function lerp(start: number, end: number, amount: number): number {
  return (1 - amount) * start + amount * end;
}

export function lerpHue(start: number, end: number, amount: number): number {
  let diff = (end - start + 180) % 360 - 180;
  if (diff < -180) {
    diff += 360;
  }
  return (start + diff * amount + 360) % 360;
}
