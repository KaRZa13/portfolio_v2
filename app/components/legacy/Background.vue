<template>
  <div ref="ctnDom" class="fixed top-0 left-0 w-full h-full z-[-1]" />
</template>

<script setup lang="ts">
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'

interface BackgroundProps {
  color?: [number, number, number]
  speed?: number
  amplitude?: number
}

const props = withDefaults(defineProps<BackgroundProps>(), {
  color: () => [1, 1, 1],
  speed: 1.0,
  amplitude: 0.1
})

const ctnDom = ref<HTMLDivElement | null>(null)
const mousePos = ref<{ x: number; y: number }>({ x: 0.5, y: 0.5 })

let renderer: Renderer
let program: Program
let animateId: number

const resize = function resizeToFitTheScreen() {
  if (!renderer || !program || !ctnDom.value) return
  const scale = 1
  renderer.setSize(ctnDom.value.offsetWidth * scale, ctnDom.value.offsetHeight * scale)
  program.uniforms.uResolution.value = new Color(
    renderer.gl.canvas.width,
    renderer.gl.canvas.height,
    renderer.gl.canvas.width / renderer.gl.canvas.height
  )
}

onMounted(() => {
  if (!ctnDom.value) return
  const ctn = ctnDom.value

  renderer = new Renderer()
  const gl = renderer.gl
  gl.clearColor(1, 1, 1, 1)

  const geometry = new Triangle(gl)
  program = new Program(gl, {
    vertex: `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `,
    fragment: `
      precision highp float;
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uResolution;
      uniform vec2 uMouse;
      uniform float uAmplitude;
      uniform float uSpeed;
      varying vec2 vUv;
      void main() {
        float mr = min(uResolution.x, uResolution.y);
        vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
        uv += (uMouse - vec2(0.5)) * uAmplitude;
        float d = -uTime * 0.5 * uSpeed;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += uTime * 0.5 * uSpeed;
        vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
        col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(...props.color) },
      uResolution: {
        value: new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        )
      },
      uMouse: { value: new Float32Array([mousePos.value.x, mousePos.value.y]) },
      uAmplitude: { value: props.amplitude },
      uSpeed: { value: props.speed }
    }
  })

  const mesh = new Mesh(gl, { geometry, program })

  const update = (t: number) => {
    animateId = requestAnimationFrame(update)
    program.uniforms.uTime.value = t * 0.001
    renderer.render({ scene: mesh })
  }

  animateId = requestAnimationFrame(update)
  ctn.appendChild(gl.canvas)

  window.addEventListener('resize', resize)
  resize()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animateId)
  window.removeEventListener('resize', resize)
  if (renderer?.gl && ctnDom.value?.contains(renderer.gl.canvas)) {
    ctnDom.value.removeChild(renderer.gl.canvas)
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
})
</script>