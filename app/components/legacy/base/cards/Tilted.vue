<template>
  <article
    ref="cardRef"
    class="md:h-50 lg:h-42 h-36 flex flex-col bg-purple-200/50 dark:bg-purple-950/50 items-center justify-around rounded-lg border border-black shadow-lg aspect-square will-change-transform
    before:w-8 before:h-8 before:border before:border-gray-600 before:absolute before:z-10 before:opacity-30 before:transition-[width,height] before:duration-500 before:top-7 before:right-7
    lg:before:top-6 lg:before:right-6 md:before:top-8 md:before:right-8 before:border-b-0 before:border-l-0
    hover:before:w-[calc(100%-2rem)] hover:before:h-[calc(100%-2rem)] hover:after:w-[calc(100%-2rem)] hover:after:h-[calc(100%-2rem)]
    lg:hover:before:w-[calc(100%-3rem)] lg:hover:before:h-[calc(100%-3rem)] lg:hover:after:w-[calc(100%-3rem)] lg:hover:after:h-[calc(100%-3rem)]
    md:hover:before:w-[calc(100%-4rem)] md:hover:before:h-[calc(100%-4rem)] md:hover:after:w-[calc(100%-4rem)] md:hover:after:h-[calc(100%-4rem)]
    after:w-8 after:h-8 after:border after:border-gray-600 after:absolute after:z-10 after:opacity-30 after:transition-[width,height] after:duration-500 after:bottom-7 after:left-7
    lg:after:bottom-6 lg:after:left-6 md:after:bottom-8 md:after:left-8 after:border-t-0 after:border-r-0"
    :style="cardStyle"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <main class="h-full flex flex-col">
      <div class="flex-1 p-10 lg:p-10 md:p-12">
        <UIcon :name="icon" :alt="iconAlt" class="size-18"/>
      </div>
      <div class="absolute bottom-1 lg:bottom-px left-1/2 transform -translate-x-1/2 text-center w-full">
        <h3 class="text-xl lg:text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 leading-tight">{{ title }}</h3>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  iconAlt: string
  title: string
  maxTilt?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxTilt: 15
})

const { playSound } = useSounds()

const cardRef = ref<HTMLElement>()
const isHovered = ref<boolean>(false)

const cardStyle = computed(() => ({
  transform: 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--s, 1))',
  transition: isHovered.value ? 'transform 0.15s ease-out' : 'transform 0.3s ease-out'
}))

let rect: DOMRect | null = null
let frame = 0
let lastX = 0
let lastY = 0

const setVars = (rx: number, ry: number, s: number) => {
  const el = cardRef.value
  if (!el) return
  el.style.setProperty('--rx', `${rx}deg`)
  el.style.setProperty('--ry', `${ry}deg`)
  el.style.setProperty('--s', `${s}`)
}

const handleMouseEnter = () => {
  if (!cardRef.value) return
  playSound('focusIn')
  rect = cardRef.value.getBoundingClientRect()
  isHovered.value = true
}

const handleMouseMove = (event: MouseEvent) => {
  lastX = event.clientX
  lastY = event.clientY
  if (frame || !rect) return

  frame = requestAnimationFrame(() => {
    frame = 0
    if (!rect) return
    const x = (lastX - rect.left) / rect.width
    const y = (lastY - rect.top) / rect.height
    setVars((y - 0.5) * props.maxTilt, (x - 0.5) * -props.maxTilt, 1.05)
  })
}

const handleMouseLeave = () => {
  playSound('focusOut')
  cancelAnimationFrame(frame)
  frame = 0
  rect = null
  isHovered.value = false
  setVars(0, 0, 1)
}

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>
