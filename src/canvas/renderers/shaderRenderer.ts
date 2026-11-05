import type { CanvasRenderer, CanvasRenderFrame, CanvasSceneDefinition } from "../types";

interface ShaderProgramState {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  positionLocation: number;
  resolutionUniform: WebGLUniformLocation | null;
  timeUniform: WebGLUniformLocation | null;
}

const vertexShaderSource = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

function wrapFragmentShader(fragmentShader: string): string {
  return `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
out vec4 outColor;
${fragmentShader}
void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  outColor = color;
}
`;
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to create shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error";
    gl.deleteShader(shader);
    throw new Error(error);
  }
  return shader;
}

async function createProgram(gl: WebGL2RenderingContext, fragmentShader: string): Promise<ShaderProgramState> {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const pixelShader = createShader(gl, gl.FRAGMENT_SHADER, wrapFragmentShader(fragmentShader));
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Failed to create WebGL program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, pixelShader);
  gl.linkProgram(program);

  const parallelCompile = gl.getExtension("KHR_parallel_shader_compile");
  if (parallelCompile) {
    while (!gl.getProgramParameter(program, parallelCompile.COMPLETION_STATUS_KHR)) {
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
    }
  }

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program) ?? "Unknown program link error";
    gl.deleteProgram(program);
    throw new Error(error);
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(pixelShader);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  return {
    gl,
    program,
    positionLocation,
    resolutionUniform: gl.getUniformLocation(program, "iResolution"),
    timeUniform: gl.getUniformLocation(program, "iTime")
  };
}

export function createShaderRenderer(): CanvasRenderer {
  let canvas: HTMLCanvasElement | null = null;
  let shaderState: ShaderProgramState | null = null;

  return {
    kind: "shader",
    mount(nextCanvas) {
      canvas = nextCanvas;
    },
    async load(scene: CanvasSceneDefinition) {
      if (!canvas) {
        throw new Error("Canvas must be mounted before loading a scene");
      }
      if (shaderState) {
        shaderState.gl.deleteProgram(shaderState.program);
        shaderState = null;
      }
      const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true
      });
      if (!gl) {
        throw new Error("WebGL2 is required for shader scenes");
      }
      gl.clearColor(0, 0, 0, 1);
      shaderState = await createProgram(gl, (scene.source as { fragmentShader: string }).fragmentShader);
    },
    render(frame: CanvasRenderFrame) {
      if (!canvas || !shaderState) {
        return;
      }
      const { gl, program, resolutionUniform, timeUniform } = shaderState;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform3f(resolutionUniform, canvas.width, canvas.height, 1);
      gl.uniform1f(timeUniform, frame.pageTimeMs / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    resize(width, height) {
      if (!canvas || !shaderState) {
        return;
      }
      shaderState.gl.viewport(0, 0, width, height);
    },
    dispose() {
      if (shaderState) {
        shaderState.gl.deleteProgram(shaderState.program);
      }
      shaderState = null;
    },
    captureFrame() {
      return canvas;
    }
  };
}
