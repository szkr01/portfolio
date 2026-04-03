import { afterEach, vi } from "vitest";

class IntersectionObserverMock {
  public observe = vi.fn();
  public unobserve = vi.fn();
  public disconnect = vi.fn();

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

afterEach(() => {
  vi.restoreAllMocks();
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
});
