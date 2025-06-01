import { useRef, useEffect } from 'react';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import vertexShaderSource from '../assets/shaders/vertex.glsl';
import fragmentShaderSource from '../assets/shaders/crtScanlines.glsl';
type ShaderType = 'vertex' | 'fragment';

// Utility: compile shader
function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Failed to compile shader: ${info}`);
  }
  return shader;
}

// Utility: create program
function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Failed to link program: ${info}`);
  }
  return program;
}

interface UseGLViewOptions {
  vertexShaderSource: string;
  fragmentShaderSource: string;
  onContextCreate?: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
}

export function useGLView({ vertexShaderSource, fragmentShaderSource, onContextCreate }: UseGLViewOptions) {
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function onGLContextCreate(gl: WebGLRenderingContext) {
      if (!isMounted) return;

      glRef.current = gl;

      // Compile shaders
      const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
      const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

      // Create and link program
      const program = createProgram(gl, vertexShader, fragmentShader);
      programRef.current = program;

      gl.useProgram(program);

      // Setup viewport
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

      // Setup buffers (simple quad)
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      const vertices = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

      // Call any onContextCreate hook
      if (onContextCreate) onContextCreate(gl, program);

      let frameCount = 0;

      // Render loop
      const render = () => {
        if (!glRef.current) return;

        // Set uniform time
        const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
        gl.uniform1f(timeUniformLocation, frameCount / 60);

        // Clear screen
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw quad (2 triangles)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.flush();
        gl.endFrameEXP?.();

        frameCount++;
        frameIdRef.current = requestAnimationFrame(render);
      };

      render();
    }

    return () => {
      isMounted = false;
      if (frameIdRef.current !== null) cancelAnimationFrame(frameIdRef.current);
      if (glRef.current) {
        // Cleanup WebGL context if needed
        glRef.current = null;
        programRef.current = null;
      }
    };
  }, [vertexShaderSource, fragmentShaderSource, onContextCreate]);

  return { glRef, programRef };
}
