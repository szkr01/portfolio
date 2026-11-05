import type {
  CanvasTransitionDefinition,
  CanvasTransitionRenderFrame,
  CanvasTransitionRenderer
} from "../types";

interface TransitionProgramState {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  resolutionUniform: WebGLUniformLocation | null;
  progressUniform: WebGLUniformLocation | null;
  fromUniform: WebGLUniformLocation | null;
  toUniform: WebGLUniformLocation | null;
}

const vertexShaderSource = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

function wrapFragmentShader(fragmentShader: string): string {
  return `#version 300 es
precision highp float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
in vec2 v_uv;
${fragmentShader}
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
    const error = gl.getShaderInfoLog(shader) ?? "Unknown transition shader compile error";
    gl.deleteShader(shader);
    throw new Error(error);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, fragmentShader: string): TransitionProgramState {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const pixelShader = createShader(gl, gl.FRAGMENT_SHADER, wrapFragmentShader(fragmentShader));
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Failed to create transition WebGL program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, pixelShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program) ?? "Unknown transition program link error";
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
    resolutionUniform: gl.getUniformLocation(program, "u_resolution"),
    progressUniform: gl.getUniformLocation(program, "u_progress"),
    fromUniform: gl.getUniformLocation(program, "u_from"),
    toUniform: gl.getUniformLocation(program, "u_to")
  };
}

function createTexture(gl: WebGL2RenderingContext, unit: number): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error("Failed to create transition texture");
  }
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  return texture;
}

export function createTransitionRenderer(): CanvasTransitionRenderer {
  let canvas: HTMLCanvasElement | null = null;
  let currentProgramId: string | null = null;
  let programState: TransitionProgramState | null = null;
  let textures: [WebGLTexture, WebGLTexture] | null = null;
  let textureWidth = 0;
  let textureHeight = 0;

  return {
    mount(nextCanvas) {
      canvas = nextCanvas;
    },
    render(transition: CanvasTransitionDefinition, frame: CanvasTransitionRenderFrame) {
      if (!canvas) {
        return;
      }
      const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true
      });
      if (!gl) {
        return;
      }
      if (!programState || currentProgramId !== transition.id) {
        currentProgramId = transition.id;
        programState = createProgram(gl, transition.fragmentShader);
      }
      const { program, resolutionUniform, progressUniform, fromUniform, toUniform } = programState;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      if (!textures) {
        textures = [createTexture(gl, 0), createTexture(gl, 1)];
      }
      const allocate = textureWidth !== frame.width || textureHeight !== frame.height;
      for (let unit = 0; unit < 2; unit += 1) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
        const source = unit === 0 ? frame.from : frame.to;
        if (allocate) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source as TexImageSource);
        } else {
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source as TexImageSource);
        }
      }
      textureWidth = frame.width;
      textureHeight = frame.height;
      gl.uniform1i(fromUniform, 0);
      gl.uniform1i(toUniform, 1);
      gl.uniform1f(progressUniform, frame.progress);
      gl.uniform2f(resolutionUniform, frame.width, frame.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    resize() {},
    dispose() {
      if (programState) {
        for (const texture of textures ?? []) {
          programState.gl.deleteTexture(texture);
        }
        programState.gl.deleteProgram(programState.program);
      }
      textures = null;
      textureWidth = 0;
      textureHeight = 0;
      programState = null;
      currentProgramId = null;
    },
    getOutput() {
      return canvas;
    }
  };
}
