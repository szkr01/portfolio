import { describe, expect, it, vi } from "vitest";
import { createTransitionRenderer } from "../src/canvas/renderers/transitionRenderer";
import { canvasTransitions } from "../src/canvas/transitions";

interface MockWebGL2Context extends Partial<WebGL2RenderingContext> {
  shaderSources: string[];
}

function createMockWebGL2Context(): MockWebGL2Context {
  const shaderSources: string[] = [];
  const shader = {} as WebGLShader;
  const program = {} as WebGLProgram;
  const buffer = {} as WebGLBuffer;
  const texture = {} as WebGLTexture;

  return {
    shaderSources,
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004,
    TEXTURE0: 0x84c0,
    TEXTURE_2D: 0x0de1,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    CLAMP_TO_EDGE: 0x812f,
    LINEAR: 0x2601,
    UNPACK_FLIP_Y_WEBGL: 0x9240,
    RGBA: 0x1908,
    UNSIGNED_BYTE: 0x1401,
    createShader: vi.fn(() => shader),
    shaderSource: vi.fn((_shader, source: string) => {
      shaderSources.push(source);
    }),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ""),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => program),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => ""),
    deleteProgram: vi.fn(),
    createBuffer: vi.fn(() => buffer),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn(() => ({} as WebGLUniformLocation)),
    viewport: vi.fn(),
    useProgram: vi.fn(),
    createTexture: vi.fn(() => texture),
    activeTexture: vi.fn(),
    bindTexture: vi.fn(),
    texParameteri: vi.fn(),
    pixelStorei: vi.fn(),
    texImage2D: vi.fn(),
    uniform1i: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    drawArrays: vi.fn()
  };
}

describe("createTransitionRenderer", () => {
  it("requests WebGL2 and compiles GLSL300 transition shaders", () => {
    const gl = createMockWebGL2Context();
    const renderer = createTransitionRenderer();
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    canvas.getContext = vi.fn((kind: string) => {
      if (kind === "webgl2") {
        return gl as WebGL2RenderingContext;
      }
      return null;
    }) as unknown as HTMLCanvasElement["getContext"];

    renderer.mount(canvas);
    renderer.render(canvasTransitions[0], {
      width: 640,
      height: 360,
      progress: 0.5,
      from: document.createElement("canvas"),
      to: document.createElement("canvas")
    });

    expect(canvas.getContext).toHaveBeenCalledWith("webgl2", {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: true
    });

    const vertexSource = gl.shaderSources[0];
    const fragmentSource = gl.shaderSources[1];

    expect(vertexSource).toContain("#version 300 es");
    expect(vertexSource).toContain("in vec2 a_position;");
    expect(vertexSource).toContain("out vec2 v_uv;");
    expect(fragmentSource).toContain("#version 300 es");
    expect(fragmentSource).toContain("precision highp float;");
    expect(fragmentSource).toContain("in vec2 v_uv;");
    expect(fragmentSource).not.toContain("texture2D");
    expect(fragmentSource).not.toContain("gl_FragColor");
  });
});
