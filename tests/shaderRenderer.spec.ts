import { describe, expect, it, vi } from "vitest";
import { createShaderRenderer } from "../src/canvas/renderers/shaderRenderer";
import type { CanvasSceneDefinition } from "../src/canvas/types";

interface MockWebGL2Context extends Partial<WebGL2RenderingContext> {
  shaderSources: string[];
}

function createMockWebGL2Context(): MockWebGL2Context {
  const shaderSources: string[] = [];
  const shader = {} as WebGLShader;
  const program = {} as WebGLProgram;
  const buffer = {} as WebGLBuffer;

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
    getExtension: vi.fn(() => null),
    getProgramInfoLog: vi.fn(() => ""),
    deleteProgram: vi.fn(),
    createBuffer: vi.fn(() => buffer),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn(() => ({} as WebGLUniformLocation)),
    clearColor: vi.fn(),
    viewport: vi.fn(),
    useProgram: vi.fn(),
    uniform3f: vi.fn(),
    uniform1f: vi.fn(),
    drawArrays: vi.fn()
  };
}

describe("createShaderRenderer", () => {
  it("requests WebGL2 and wraps scene fragments as GLSL300 shaders", async () => {
    const gl = createMockWebGL2Context();
    const renderer = createShaderRenderer();
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
    await renderer.load({
      id: "music",
      runtimeKey: "music",
      kind: "shader",
      source: { fragmentShader: "void mainImage(out vec4 color, in vec2 fragCoord){ color = vec4(1.0); }" }
    } satisfies CanvasSceneDefinition);

    expect(canvas.getContext).toHaveBeenCalledWith("webgl2", {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: true
    });

    const fragmentSource = gl.shaderSources[1];
    expect(fragmentSource).toContain("#version 300 es");
    expect(fragmentSource).toContain("precision highp float;");
    expect(fragmentSource).toContain("out vec4 outColor;");
    expect(fragmentSource).toContain("mainImage(color, gl_FragCoord.xy);");
    expect(fragmentSource).toContain("outColor = color;");
    expect(fragmentSource).not.toContain("gl_FragColor");
  });

  it("waits for parallel shader compilation before checking link status", async () => {
    const gl = createMockWebGL2Context();
    const completionStatus = 0x91b1;
    let completed = false;
    vi.mocked(gl.getExtension!).mockReturnValue({
      COMPLETION_STATUS_KHR: completionStatus
    } as KHR_parallel_shader_compile);
    vi.mocked(gl.getProgramParameter!).mockImplementation((_program, param) =>
      param === completionStatus ? completed : true
    );

    const renderer = createShaderRenderer();
    const canvas = document.createElement("canvas");
    canvas.getContext = vi.fn(() => gl as WebGL2RenderingContext) as unknown as HTMLCanvasElement["getContext"];
    renderer.mount(canvas);
    const loading = renderer.load({
      id: "music",
      runtimeKey: "music",
      kind: "shader",
      source: { fragmentShader: "void mainImage(out vec4 c, in vec2 p) { c = vec4(1.0); }" }
    });

    expect(gl.getProgramParameter).not.toHaveBeenCalledWith(expect.anything(), gl.LINK_STATUS);
    completed = true;
    await loading;
    expect(gl.getProgramParameter).toHaveBeenCalledWith(expect.anything(), gl.LINK_STATUS);
  });
});
