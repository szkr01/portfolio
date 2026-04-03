import type { CanvasRenderer, CanvasRenderFrame, CanvasSceneDefinition } from "../types";

interface ShaderProgramState {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionLocation: number;
  resolutionUniform: WebGLUniformLocation | null;
  timeUniform: WebGLUniformLocation | null;
}

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

function wrapFragmentShader(fragmentShader: string): string {
  return `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
${fragmentShader}
void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
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

function createProgram(gl: WebGLRenderingContext, fragmentShader: string): ShaderProgramState {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const pixelShader = createShader(gl, gl.FRAGMENT_SHADER, wrapFragmentShader(fragmentShader));
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Failed to create WebGL program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, pixelShader);
  gl.linkProgram(program);

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
      const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true
      });
      if (!gl) {
        throw new Error("WebGL is not supported in this environment");
      }
      gl.clearColor(0, 0, 0, 1);
      shaderState = createProgram(gl, (scene.source as { fragmentShader: string }).fragmentShader);
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
